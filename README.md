# Mahanth Ltd — mahanthltd.co.uk

The company's own marketing site: software engineering consultancy
positioning, a portfolio of real shipped products (TirupurHub, OrderSmart,
TheHire.in, VibePair), and a contact form.

| | |
|---|---|
| Stack | Next.js (App Router), Tailwind v4, TypeScript |
| Contact form | Server-side Route Handler → Resend |
| Local dev | `docker compose up` → http://localhost:3200 |
| Production | Google Cloud Platform — Cloud Run, Firebase Hosting, Secret Manager; provisioned with OpenTofu (`infra/`) |

See `AGENTS.md` for repository conventions, `infra/README.md` for the
deployment architecture and first-apply steps.
