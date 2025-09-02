import React from "react"
import { motion } from "framer-motion"
import {
  ArrowRight, Download, Mail, Wrench, ServerCog, Globe, ShieldCheck, Workflow,
  FileText, Blocks, Database, Rocket, Linkedin, Github, Phone, MapPin, CalendarDays, Search
} from "lucide-react"

const ACCENT = "#03feff"

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
)

const Section = ({
  id, title, subtitle, children
}: { id: string; title: string; subtitle?: string; children: React.ReactNode }) => (
  <section id={id} className="py-16 md:py-24">
    <Container>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-2 max-w-2xl text-gray-500">{subtitle}</p>}
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <input
              className="w-full rounded-md border px-3 py-2 pl-10 text-sm"
              placeholder="Quick search (projects, skills, services)"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      {children}
    </Container>
  </section>
)

const Stat = ({ k, v }: { k: string; v: string }) => (
  <div className="text-center">
    <div className="text-2xl md:text-3xl font-semibold">{v}</div>
    <div className="mt-1 text-xs md:text-sm text-gray-400">{k}</div>
  </div>
)

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium bg-white/60 backdrop-blur">
    {children}
  </span>
)
// --- Contact form wired to Formspree ---
function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "ok" | "err">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch("https://formspree.io/f/mwpnqlyp", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
      if (res.ok) {
        form.reset()
        setStatus("ok")
      } else {
        setStatus("err")
      }
    } catch {
      setStatus("err")
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {/* Honeypot for bots */}
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-4 md:grid-cols-2">
        <input className="w-full rounded-md border px-3 py-2" name="name" placeholder="Your name" required />
        <input className="w-full rounded-md border px-3 py-2" name="email" type="email" placeholder="Email" required />
      </div>
      <input className="w-full rounded-md border px-3 py-2" name="company" placeholder="Company (optional)" />
      <input
        className="w-full rounded-md border px-3 py-2"
        name="need"
        placeholder="What do you need? e.g., NetSuite workflow, website, Google Workspace"
        required
      />
      <textarea
        className="min-h-[120px] w-full rounded-md border px-3 py-2"
        name="details"
        placeholder="A few details—current pain points, deadline, budget range"
      />

      {/* Subject shown in the email you receive */}
      <input type="hidden" name="_subject" value="New project inquiry from arjayferrer.com" />

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">No templates. Clear, direct replies.</div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center rounded-2xl bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send"} <span className="ml-2">→</span>
        </button>
      </div>

      {status === "ok" && <p className="mt-2 text-sm text-green-600">✅ Sent. I’ll reply shortly.</p>}
      {status === "err" && <p className="mt-2 text-sm text-red-600">⚠️ Something went wrong. Try again or email hello@arjayferrer.com.</p>}
    </form>
  )
}

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* HERO */}
      <header className="relative overflow-hidden">
        {/* subtle glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 left-1/2 h-64 w-[90vw] -translate-x-1/2 rounded-full blur-3xl opacity-30"
            style={{ background: `radial-gradient(closest-side, ${ACCENT}, transparent)` }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(3,254,255,0.4)] to-transparent" />
        </div>

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid items-center gap-8 pt-16 pb-16 md:pt-24 md:pb-24 md:grid-cols-12"
          >
            {/* left */}
            <div className="md:col-span-7">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge><Rocket className="h-3.5 w-3.5" /> Available for: NetSuite, IT Systems, Web</Badge>
                <Badge><ShieldCheck className="h-3.5 w-3.5" /> Dubai • Remote OK</Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                Arjay Ferrer
                <span className="mt-3 block text-lg md:text-xl text-gray-500">
                  NetSuite Admin • IT & Systems • Web Design/UX
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-gray-600">
                I build clean, reliable business systems: NetSuite customizations, Google Workspace/IT ops, and
                minimalist, fast web experiences.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-2xl bg-black px-4 py-2 text-white hover:opacity-90"
                >
                  <Mail className="mr-2 h-4 w-4" /> Start a project
                </a>
                <a
                  href="/CVArjayFerrer.pdf"
                  download="CVArjayFerrer.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl border px-4 py-2 hover:bg-gray-50"
                >
                  <Download className="mr-2 h-4 w-4" /> Download CV
                </a>
                <a
                  href="https://www.linkedin.com/in/jayferrer"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl px-4 py-2 hover:bg-gray-50"
                >
                  <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-2xl px-4 py-2 hover:bg-gray-50"
                >
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6">
                <Stat k="Years in Tech" v="10+" />
                <Stat k="NetSuite Focus" v="5+ yrs" />
                <Stat k="Departments Served" v="Ops • Sales • Finance" />
              </div>
            </div>

            {/* right */}
            <div className="md:col-span-5">
              <div className="rounded-2xl border bg-white shadow-sm">
                <div className="border-b px-5 py-4 font-semibold flex items-center gap-2">
                  <Wrench className="h-5 w-5" /> What I solve
                </div>
                <div className="grid gap-3 p-5 text-sm">
                  <div className="flex items-start gap-3">
                    <Workflow className="mt-0.5 h-4 w-4" />
                    <div>
                      <div className="font-medium">NetSuite that actually works</div>
                      <p className="text-gray-500">
                        Workflows, Saved Searches, Advanced PDF/HTML, SuiteScript 2.x, WMS, Inbound Shipments, customer notifications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ServerCog className="mt-0.5 h-4 w-4" />
                    <div>
                      <div className="font-medium">IT & Google Workspace</div>
                      <p className="text-gray-500">
                        Email + SSO hygiene, device & network basics, user onboarding/offboarding, policy and guardrails
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-4 w-4" />
                    <div>
                      <div className="font-medium">Clean, fast web</div>
                      <p className="text-gray-500">
                        Minimalist sites with clear copy. No fluff. Accessible, responsive, and fast.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </header>

      {/* SERVICES */}
      <Section id="services" title="Services" subtitle="Pick what you need. No fluff.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <Workflow className="h-5 w-5" />,
              title: "NetSuite Admin + Dev",
              bullets: ["Workflows & SuiteScript 2.x","Advanced PDF/HTML","Saved Searches & Dashboards","WMS • Inbound Shipments","Customer comms automation"],
            },
            {
              icon: <ServerCog className="h-5 w-5" />,
              title: "IT & Google Workspace",
              bullets: ["Email/DNS/DMARC hygiene","SSO and access control","Device setup & policies","Backups & uptime basics","Docs & knowledge base"],
            },
            {
              icon: <Globe className="h-5 w-5" />,
              title: "Web Design / UX",
              bullets: ["Single-page sites","Landing pages","Design systems","Lightweight animations","Content & SEO basics"],
            },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                {s.icon} {s.title}
              </div>
              <ul className="space-y-2 text-sm">
                {s.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURED PROJECTS */}
      <Section id="projects" title="Featured work" subtitle="A few representative pieces.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <FileText className="h-5 w-5" />, title: "Advanced PDF suite", desc: "Quotation, Packing Slip, and auto-paginated templates with conditional tables and totals.", meta: "NetSuite • XML/FreeMarker" },
            { icon: <Blocks className="h-5 w-5" />, title: "Support Cases on NetSuite", desc: "Email-to-case, SLAs, dashboards, and automated customer updates.", meta: "NetSuite • Workflows" },
            { icon: <Database className="h-5 w-5" />, title: "Inbound Shipments + WMS", desc: "Cleaned legacy searches, implemented WMS with notifications to Sales and clients.", meta: "NetSuite • WMS" },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
              <div className="mb-3 flex items-center gap-2 font-semibold">{p.icon}{p.title}</div>
              <p className="min-h-[56px] text-sm text-gray-500">{p.desc}</p>
              <div className="mt-4 text-xs opacity-80">{p.meta}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section id="process" title="Simple process" subtitle="Clear steps, fast delivery.">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { n: "01", t: "Scope", d: "We clarify goals, constraints, and success metrics." },
            { n: "02", t: "Build", d: "Implement with small, reviewable increments." },
            { n: "03", t: "Ship", d: "Deploy safely with rollback in mind." },
            { n: "04", t: "Support", d: "Measure, iterate, document." },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-3 text-lg font-semibold">
                <span className="text-xl" style={{ color: ACCENT }}>{s.n}</span>{s.t}
              </div>
              <p className="text-sm text-gray-500">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* QUICK FACTS */}
      <Section id="about" title="Quick facts" subtitle="Context that matters.">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-2 font-semibold">Experience</div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>10+ years in tech; 5+ in NetSuite</div>
              <div>De-facto IT & Systems Admin at WOG (Dubai/JAFZA)</div>
              <div>Hands-on with Sales, Ops, Finance, Logistics</div>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-2 font-semibold">Focus</div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Stability first; clear docs</div>
              <div>Automation before headcount</div>
              <div>Minimal UI, fast responses</div>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-2 font-semibold">Stack</div>
            <div className="space-y-2 text-sm text-gray-600">
              <div>NetSuite (SuiteScript 2.x, Workflows, PDF/HTML)</div>
              <div>Google Workspace, DNS/DMARC, SSO basics</div>
              <div>HTML/CSS/JS, React, Tailwind</div>
            </div>
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Let’s work" subtitle="Tell me what you need. I’ll reply with a plan and a timeline.">
        <div className="grid items-start gap-6 md:grid-cols-5">
          {/* form */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Mail className="h-5 w-5" /> Start a project
              </div>
<ContactForm />
            </div>
          </div>

          {/* sidebar */}
          <div className="grid gap-6 md:col-span-2">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Phone className="h-5 w-5" /> Contact
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@arjayferrer.com</div>
                <div className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> /in/arjayferrer</div>
                <div className="flex items-center gap-2"><Github className="h-4 w-4" /> github.com/</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dubai, UAE</div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Mon–Fri • 8–5 GST</div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-2 font-semibold">One-line pitch</div>
              <div className="text-sm text-gray-600">
                Systems guy who makes NetSuite sane, keeps email clean, and ships straight-to-the-point websites.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 py-10 text-xs text-gray-500">
            <div>© {new Date().getFullYear()} Arjay Ferrer</div>
            <div className="flex items-center gap-4">
              <a href="#services" className="hover:underline">Services</a>
              <a href="#projects" className="hover:underline">Work</a>
              <a href="#contact" className="hover:underline">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
