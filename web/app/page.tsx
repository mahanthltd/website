import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Cloud, Code2, Compass, Landmark, Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/BrandIcons";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <SiteHeader />
      <Hero />
      <Services />
      <Products />
      <Technology />
      <Team />
      <Contact />
      <SiteFooter />
    </div>
  );
}

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#products", label: "Products" },
  { href: "#technology", label: "Technology" },
  { href: "#team", label: "Team" },
];

function Wordmark() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground">
      <Image src="/images/mahanth-mark.png" alt="" width={30} height={25} className="h-[1.6em] w-auto" priority />
      Mahanth Ltd
    </Link>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="brand-gradient-bg inline-flex min-h-10 items-center rounded-control px-4 text-sm font-semibold text-brand-ink transition hover:brightness-110"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[linear-gradient(180deg,var(--brand-soft)_0%,transparent_100%)]"
      />
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-cyan">
          Software Engineering Consultancy
        </p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          We build software.
          <br />
          Then we help you build yours.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Mahanth Ltd is a team of engineers who ship production software for real businesses — and bring that same
          rigor to your technology strategy, product engineering, and infrastructure.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contact"
            className="brand-gradient-bg inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-6 text-base font-semibold text-brand-ink shadow-raised transition hover:brightness-110"
          >
            Start a conversation
          </a>
          <a
            href="#products"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-line bg-surface px-6 text-base font-semibold text-foreground transition hover:border-brand/40"
          >
            See what we&apos;ve built
          </a>
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    icon: Code2,
    title: "Product Engineering",
    description:
      "Full-stack web and mobile engineering, from first prototype to production — we write the code, not just the recommendations.",
  },
  {
    icon: Cloud,
    title: "Cloud & Infrastructure",
    description:
      "Docker, Kubernetes, Terraform, and CI/CD across GCP, AWS and Azure — infrastructure that scales to zero at idle and up without a rewrite.",
  },
  {
    icon: Landmark,
    title: "Payments & Financial Systems",
    description:
      "Deep, practical experience with ISO 8583, ISO 20022, UPI, and PSD2 / open banking — the message formats and regulatory constraints most consultancies only know from documentation.",
  },
  {
    icon: Compass,
    title: "Technology Strategy",
    description:
      "Pragmatic digital transformation guidance drawn from our own production systems, not slideware — an honest assessment of your technical readiness and the shortest path forward.",
  },
];

function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading eyebrow="What we do" title="Consultancy, grounded in what we've shipped" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <div key={service.title} className="rounded-card border border-line bg-surface p-6 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand">
              <service.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-bold text-foreground">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const PRODUCTS = [
  {
    name: "TirupurHub",
    url: "https://tirupurhub.com",
    logo: "/images/products/tirupurhub.png",
    description:
      "A local business and job-work marketplace for Tirupur's textile industry — directories, listings, and WhatsApp-based customer engagement.",
  },
  {
    name: "OrderSmart",
    url: "https://ordersmart.in",
    logo: "/images/products/ordersmart.png",
    description:
      "Subscription and order management for local businesses, run entirely over WhatsApp — no app download required for the customer.",
  },
  {
    name: "TheHire.in",
    url: "https://thehire.in",
    logo: "/images/products/thehire.png",
    description:
      "Local People. Real Work. A trusted marketplace connecting verified local professionals with blue-collar job postings.",
  },
  {
    name: "VibePair",
    url: "https://vibepair.in",
    logo: "/images/products/vibepair.png",
    description: "A modern matching platform built for real connections, not endless swiping.",
  },
];

function Products() {
  return (
    <section id="products" className="border-y border-line bg-brand-soft px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Proof, not promises" title="Products we've designed, built, and run in production" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PRODUCTS.map((product) => (
            <a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-card border border-line bg-surface-raised p-6 shadow-card transition hover:border-brand/40 hover:shadow-raised"
            >
              <div className="flex items-center gap-3">
                {/* A neutral chip gives every logo a consistent frame
                    regardless of its own background/padding. */}
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#f3f5f7] p-2">
                  <Image src={product.logo} alt="" width={40} height={40} className="h-full w-full object-contain" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
                <ArrowUpRight
                  className="ml-auto size-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                  aria-hidden
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const STACK = [
  "TypeScript",
  "Rust",
  "Python",
  "Node.js",
  "React",
  "Next.js",
  "Flutter",
  "GraphQL",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "Apache Kafka",
  "AWS",
  "Azure",
  "Google Cloud",
  "Kubernetes",
  "Docker",
  "Terraform",
];

const PRINCIPLES = [
  {
    title: "Domain-Driven Design",
    description:
      "Bounded contexts and a shared ubiquitous language keep a complex business domain tractable as the codebase grows, instead of collapsing into an undifferentiated monolith.",
  },
  {
    title: "Modular & Microservice Architecture",
    description:
      "Services decomposed along real domain boundaries — independently deployable and scalable, not split for its own sake.",
  },
  {
    title: "Event-Driven Architecture",
    description:
      "Asynchronous messaging (Kafka, queues, webhooks) decouples systems and absorbs load spikes without cascading failure.",
  },
  {
    title: "Disaster Recovery & Business Continuity",
    description:
      "Automated backups, tested failover, and documented RTO/RPO targets — recovery that's rehearsed, not assumed.",
  },
  {
    title: "Observability",
    description:
      "Structured logging, distributed tracing, and metrics built in from day one, not bolted on after the first incident.",
  },
  {
    title: "Infrastructure as Code",
    description:
      "Every environment reproducible from version-controlled Terraform — no manually configured, undocumented servers.",
  },
  {
    title: "Security by Design",
    description:
      "Least-privilege access, encrypted secrets, and defence-in-depth considered at the architecture stage, not audited in afterward.",
  },
  {
    title: "CI/CD & Zero-Downtime Delivery",
    description: "Automated pipelines and progressive rollouts mean shipping is routine, not a weekend event.",
  },
];

function Technology() {
  return (
    <section id="technology" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Engineering principles"
        title="Architecture we'd stand behind in a review"
      />
      <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-muted">
        Beyond the language list, this is what we hold every system to — the same principles behind TirupurHub,
        OrderSmart, TheHire.in, and VibePair, and what we bring to client work.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {STACK.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((principle) => (
          <div key={principle.title} className="rounded-card border border-line bg-surface p-5">
            <h3 className="text-sm font-bold text-brand-cyan">{principle.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{principle.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="border-y border-line bg-brand-soft px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Who you'll work with" title="Team" />
        <div className="mt-10 flex flex-col items-center gap-6 rounded-card border border-line bg-surface-raised p-8 shadow-card sm:flex-row sm:items-start sm:text-left">
          <Image
            src="/images/durairaj.jpeg"
            alt="Durairaj Subramaniam"
            width={128}
            height={128}
            className="size-32 shrink-0 rounded-full object-cover"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground">Durairaj Subramaniam</h3>
            <p className="text-sm font-medium text-brand-cyan">Director &amp; Technologist, Mahanth Ltd</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Engineer and founder with experience spanning payments infrastructure, WhatsApp-commerce platforms, and
              full-stack product delivery — the hands-on work behind every product in our portfolio.
            </p>
            <div className="mt-4 flex justify-center gap-4 sm:justify-start">
              <SocialLink href="mailto:support@mahanthltd.co.uk" label="Email">
                <Mail className="size-5" aria-hidden />
              </SocialLink>
              <SocialLink href="https://github.com/durairaj" label="GitHub">
                <GithubIcon className="size-5" />
              </SocialLink>
              <SocialLink href="https://www.linkedin.com/in/durairajsubramaniam/" label="LinkedIn">
                <LinkedinIcon className="size-5" />
              </SocialLink>
              <SocialLink href="https://twitter.com/_londontrader_" label="Twitter">
                <TwitterIcon className="size-5" />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="text-muted transition hover:text-brand"
    >
      {children}
    </a>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionHeading eyebrow="Let's talk" title="Tell us about your project" />
      <p className="mt-4 text-center text-muted">
        Whether it&apos;s a full product build, a cloud migration, or a second opinion on your architecture — we&apos;d
        like to hear about it.
      </p>
      <div className="mt-10 rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
        <ContactForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Prefer email?{" "}
        <a href="mailto:support@mahanthltd.co.uk" className="font-medium text-brand hover:underline">
          support@mahanthltd.co.uk
        </a>
      </p>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-cyan">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h2>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <Wordmark />
        <div className="flex gap-4">
          <SocialLink href="mailto:support@mahanthltd.co.uk" label="Email">
            <Mail className="size-4" aria-hidden />
          </SocialLink>
          <SocialLink href="https://github.com/durairaj" label="GitHub">
            <GithubIcon className="size-4" />
          </SocialLink>
          <SocialLink href="https://www.linkedin.com/company/mahanthlimited" label="LinkedIn">
            <LinkedinIcon className="size-4" />
          </SocialLink>
          <SocialLink href="https://twitter.com/MahanthLimited" label="Twitter">
            <TwitterIcon className="size-4" />
          </SocialLink>
        </div>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Mahanth Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}
