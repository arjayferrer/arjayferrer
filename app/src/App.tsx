import { useState, type FormEvent, type ReactNode } from "react"
import {
  Mail, ServerCog, Globe, Workflow,
  FileText, Blocks, Database, Linkedin, Github, Phone,
  MapPin, CalendarDays, User
} from "lucide-react"


const ACCENT = "#3d4fb5"

const Container = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
)

const Section = ({
  id, eyebrow, title, subtitle, children
}: { id: string; eyebrow?: string; title: string; subtitle?: string; children: ReactNode }) => (
  <section id={id} className="py-16 md:py-24">
    <Container>
      <div className="mb-10 max-w-2xl">
        {eyebrow && (
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">{eyebrow}</div>
        )}
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      </div>
      {children}
    </Container>
  </section>
)

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent">
    {children}
  </span>
)

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
        <input className="w-full rounded-lg border border-hairline px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" name="name" placeholder="Your name" required />
        <input className="w-full rounded-lg border border-hairline px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" name="email" type="email" placeholder="Email" required />
      </div>
      <input className="w-full rounded-lg border border-hairline px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" name="company" placeholder="Company (optional)" />
      <input
        className="w-full rounded-lg border border-hairline px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        name="need"
        placeholder="What do you need? e.g., NetSuite workflow, website, Google Workspace"
        required
      />
      <textarea
        className="min-h-[120px] w-full rounded-lg border border-hairline px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        name="details"
        placeholder="A few details—current pain points, deadline, budget range"
      />

      <input type="hidden" name="_subject" value="New project inquiry from arjayferrer.com" />

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">No templates. Clear, direct replies.</div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send"} <span className="ml-2">→</span>
        </button>
      </div>

      {status === "ok" && <p className="mt-2 text-sm text-emerald-600">✅ Sent. I'll reply shortly.</p>}
      {status === "err" && <p className="mt-2 text-sm text-red-600">⚠️ Something went wrong. Try again or email hello@arjayferrer.com.</p>}
    </form>
  )
}

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* NAV */}
      <nav className="sticky top-0 z-20 bg-canvas/85 backdrop-blur">
        <Container>
          <div className="flex items-center justify-between py-5">
            <a href="#" className="text-lg font-extrabold tracking-tight text-ink">Arjay Ferrer</a>
            <div className="flex items-center gap-8">
              <div className="hidden items-center gap-8 md:flex">
                <a href="#services" className="text-sm font-medium text-muted hover:text-ink">Services</a>
                <a href="#skills" className="text-sm font-medium text-muted hover:text-ink">Skills</a>
                <a href="#about" className="text-sm font-medium text-muted hover:text-ink">About</a>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Get in touch
              </a>
            </div>
          </div>
        </Container>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 left-1/2 h-64 w-[90vw] -translate-x-1/2 rounded-full blur-3xl opacity-30"
            style={{ background: `radial-gradient(closest-side, ${ACCENT}, transparent)` }}
          />
        </div>

        <Container>
          <div className="hero-fade-in grid items-center gap-12 py-16 md:py-24 md:grid-cols-12">
            {/* left */}
            <div className="md:col-span-7">
              <Badge>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Available for consulting engagements
              </Badge>

              <h1 className="mt-6 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-ink">
                NetSuite Admin &amp; IT Consultant, Dubai
              </h1>

              <p className="mt-5 max-w-xl text-lg text-muted">
                I help companies optimize business processes with modern ERP solutions, workflow
                automation, and digital transformation — end to end, from setup to support.
              </p>

              <div className="mt-8 flex flex-wrap gap-3.5">
                <a
                  href="#contact"
                  className="inline-flex items-center rounded-lg bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Start a project
                </a>
                <a
                  href="/CVArjayFerrer.pdf"
                  download="CVArjayFerrer.pdf"
                  className="inline-flex items-center rounded-lg border border-hairline px-7 py-3.5 text-sm font-semibold text-ink hover:border-muted"
                >
                  Download CV
                </a>
              </div>
            </div>

            {/* right */}
            <div className="md:col-span-5">
              <div
                className="flex aspect-[4/5] items-center justify-center rounded-2xl"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, oklch(0.92 0.006 250) 0 12px, oklch(0.95 0.006 250) 12px 24px)",
                }}
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-muted shadow-sm">
                  <User className="h-14 w-14" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* SERVICES */}
      <Section id="services" eyebrow="Services" title="Where I can help your business" subtitle="Pick what you need. No fluff.">
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
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-hairline bg-white p-6 transition-colors hover:border-ink/30">
              <div className="mb-3 flex items-center gap-2 font-semibold text-ink">
                {s.icon} {s.title}
              </div>
              <ul className="space-y-2 text-sm text-muted">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
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
          ].map((p) => (
            <div key={p.title} className="rounded-xl border border-hairline bg-white p-6 transition-colors hover:border-ink/30">
              <div className="mb-3 flex items-center gap-2 font-semibold text-ink">{p.icon}{p.title}</div>
              <p className="min-h-[56px] text-sm text-muted">{p.desc}</p>
              <div className="mt-4 text-xs text-muted">{p.meta}</div>
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
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-hairline bg-white p-6 transition-colors hover:border-ink/30">
              <div className="mb-2 flex items-center gap-3 text-lg font-semibold text-ink">
                <span className="text-xl font-extrabold" style={{ color: ACCENT }}>{s.n}</span>{s.t}
              </div>
              <p className="text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <section id="skills" className="bg-ink py-20 md:py-24">
        <Container>
          <div className="mb-10 max-w-2xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-300">Skills &amp; Tools</div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">What I work with</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              "NetSuite", "ERP Systems", "SuiteScript", "Workflow Automation",
              "IT Systems Administration", "SQL", "Cloud Infrastructure", "Digital Transformation",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/90"
              >
                {skill}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* QUICK FACTS */}
      <Section id="about" eyebrow="About" title="Quick facts" subtitle="Context that matters.">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-hairline bg-white p-6">
            <div className="mb-2 font-semibold text-ink">Experience</div>
            <div className="space-y-2 text-sm text-muted">
              <div>10+ years in tech; 5+ in NetSuite</div>
              <div>De-facto IT & Systems Admin at WOG (Dubai/JAFZA)</div>
              <div>Hands-on with Sales, Ops, Finance, Logistics</div>
            </div>
          </div>
          <div className="rounded-xl border border-hairline bg-white p-6">
            <div className="mb-2 font-semibold text-ink">Focus</div>
            <div className="space-y-2 text-sm text-muted">
              <div>Stability first; clear docs</div>
              <div>Automation before headcount</div>
              <div>Minimal UI, fast responses</div>
            </div>
          </div>
          <div className="rounded-xl border border-hairline bg-white p-6">
            <div className="mb-2 font-semibold text-ink">Stack</div>
            <div className="space-y-2 text-sm text-muted">
              <div>NetSuite (SuiteScript 2.x, Workflows, PDF/HTML)</div>
              <div>Google Workspace, DNS/DMARC, SSO basics</div>
              <div>HTML/CSS/JS, React, Tailwind</div>
            </div>
          </div>
        </div>
      </Section>

      {/* RESUME BANNER */}
      <section id="resume" className="pb-16 md:pb-24">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-hairline bg-zinc-50 p-10 md:p-12">
            <div>
              <h3 className="text-xl font-extrabold text-ink">Want the full picture?</h3>
              <p className="mt-2 text-sm text-muted">Download my resume for full work history and qualifications.</p>
            </div>
            <a
              href="/CVArjayFerrer.pdf"
              download="CVArjayFerrer.pdf"
              className="inline-flex items-center whitespace-nowrap rounded-lg bg-ink px-7 py-3.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Download resume ↓
            </a>
          </div>
        </Container>
      </section>

      {/* CONTACT */}
      <Section id="contact" title="Let's work" subtitle="Tell me what you need. I'll reply with a plan and a timeline.">
        <div className="grid items-start gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="rounded-xl border border-hairline bg-white p-6">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
                <Mail className="h-5 w-5" /> Start a project
              </div>
              <ContactForm />
            </div>
          </div>

          <div className="grid gap-6 md:col-span-2">
            <div className="rounded-xl border border-hairline bg-white p-6">
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
                <Phone className="h-5 w-5" /> Contact
              </div>
              <div className="space-y-3 text-sm text-muted">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@arjayferrer.com</div>
                <div className="flex items-center gap-2"><Linkedin className="h-4 w-4" /> /in/jayferrer</div>
                <div className="flex items-center gap-2"><Github className="h-4 w-4" /> github.com/arjayferrer</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dubai, UAE</div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Mon–Fri • 8–5 GST</div>
              </div>
            </div>

            <div className="rounded-xl border border-hairline bg-white p-6">
              <div className="mb-2 font-semibold text-ink">One-line pitch</div>
              <div className="text-sm text-muted">
                Systems guy who makes NetSuite sane, keeps email clean, and ships straight-to-the-point websites.
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-hairline">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 py-10 text-xs text-muted">
            <div>© {new Date().getFullYear()} Arjay Ferrer. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#services" className="hover:text-ink">Services</a>
              <a href="#projects" className="hover:text-ink">Work</a>
              <a href="#contact" className="hover:text-ink">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
