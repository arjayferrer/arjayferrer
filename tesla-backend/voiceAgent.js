import Anthropic from "@anthropic-ai/sdk";
import { COMMANDS, readVehicleStatus, runCommand } from "./vehicleActions.js";

const MAX_TURNS = 4; // model round-trips per request
const MAX_COMMANDS = 3; // car commands per request, whatever the model asks for

const SYSTEM_PROMPT = `You are the voice assistant on the driver's smartwatch for their Tesla Model 3.
The user's words come from speech-to-text, so expect mishearings and filler.

- To act on the car, call vehicle_command. To answer a question about battery, range, charging or lock state, call get_vehicle_status first. Never guess vehicle data.
- Do exactly what was asked, one command unless they clearly ask for several. Lock and unlock are opposites: if the transcript doesn't clearly say which, ask instead of guessing.
- If the request isn't about the car, say you can only help with the car.
- Your reply is shown on a small watch screen and spoken aloud: one short sentence, plain words, no markdown or emoji.
- If a tool returns an error, say what failed in a few words. If the car was asleep, say it is waking up and to try again in a few seconds.`;

const TOOLS = [
  {
    name: "vehicle_command",
    description: "Send one command to the car.",
    input_schema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: Object.keys(COMMANDS),
          description: "lock/unlock the doors, climate-on/climate-off for cabin A/C, honk the horn, flash the lights",
        },
      },
      required: ["action"],
    },
  },
  {
    name: "get_vehicle_status",
    description: "Read live battery percent, range in km, charging state and whether the car is locked.",
    input_schema: { type: "object", properties: {} },
  },
];

let defaultClient;
function getDefaultClient() {
  // Created lazily so the server still boots (and dotenv has run) without a key.
  defaultClient ??= new Anthropic();
  return defaultClient;
}

async function runTool(block, executed, actions) {
  const result = (content, isError = false) => ({
    type: "tool_result",
    tool_use_id: block.id,
    content: JSON.stringify(content),
    ...(isError && { is_error: true }),
  });

  try {
    if (block.name === "get_vehicle_status") {
      return result(await actions.readVehicleStatus());
    }
    if (block.name === "vehicle_command") {
      const { action } = block.input;
      if (!(action in COMMANDS)) return result({ error: `Unknown action: ${action}` }, true);
      if (executed.length >= MAX_COMMANDS) return result({ error: "Command limit reached for this request" }, true);
      const outcome = await actions.runCommand(action);
      executed.push(action);
      return result({ ok: true, outcome });
    }
    return result({ error: `Unknown tool: ${block.name}` }, true);
  } catch (err) {
    return result({ error: err.message }, true);
  }
}

// text: the transcribed utterance. deps: injectable for tests.
export async function handleVoice(text, deps = {}) {
  const client = deps.client ?? getDefaultClient();
  const actions = deps.actions ?? { readVehicleStatus, runCommand };
  const model = process.env.VOICE_MODEL || "claude-haiku-5-5";

  const messages = [{ role: "user", content: text }];
  const executed = [];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.messages.create({
      model,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });

    if (response.stop_reason !== "tool_use") {
      const reply = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join(" ")
        .trim();
      return { reply: reply || "Done.", actions: executed };
    }

    messages.push({ role: "assistant", content: response.content });
    const results = [];
    for (const block of response.content) {
      if (block.type === "tool_use") results.push(await runTool(block, executed, actions));
    }
    messages.push({ role: "user", content: results });
  }

  return { reply: "Sorry, that took too many steps.", actions: executed };
}
