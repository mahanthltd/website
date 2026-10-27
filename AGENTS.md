# Working in this repository

This is Mahanth Ltd's own marketing site (mahanthltd.co.uk) — a single
Next.js app, no database, no separate API. Rebuilt from an earlier Svelte +
GitHub Pages site into the same Docker + GCP Cloud Run + Terraform shape as
the company's product projects (ordersmart, tirupurhub-com, vipepair-in).

## The three rules that matter most

1. **A push to `main` is a production deploy** (once `deploy-web.yml`
   exists — see infra/README.md "What's not here yet"). Never push without
   being told to in the current conversation. Commit freely; say "ready to
   push" and stop.
2. **Never print, log or paste a secret.** The Resend API key lives in GCP
   Secret Manager. If a task needs it, fetch it in a single shell
   invocation into `$TMPDIR`, use it, delete it, never echo it.
3. **Lead with the standard fix and do it.** Suggest the obvious
   best-practice approach and act on it; don't present a menu of options or
   wait to be pointed at each detail. Reserve questions for decisions that
   are genuinely the user's (money, product positioning, prod data).

## Layout

```
web/      Next.js app (App Router, TypeScript, Tailwind v4). The entire
          product — marketing page plus one API route (/api/contact).
docker/   web.Dockerfile — build context is the REPOSITORY ROOT.
infra/    Terraform for this project's GCP resources (state in GCS).
```

## Things worth knowing

**No `NEXT_PUBLIC_*` build-arg gotcha here, unlike the product projects.**
This app has no separate backend to point at, so `RESEND_API_KEY` and
`CONTACT_TO_EMAIL` are read server-side in `app/api/contact/route.ts` at
request time — ordinary Cloud Run env/secret values, not Docker build args.
Changing them means a restart, not a rebuild.

**Port 3200.** 3000, 3002, and 3100 already belong to sibling projects on
this machine — see `docker-compose.yml`'s own comment.

**The contact form fails closed.** With no `RESEND_API_KEY` configured, the
route returns a friendly error and logs server-side rather than silently
dropping the submission or falling back to anything looser.

## Before you call something done

```bash
cd web && npx tsc --noEmit && npm run lint && npm run build
```

Then exercise the change against the running local stack
(`docker compose up`, click through http://localhost:3200) and say what you
actually observed.

## Working style

- Small, logical, signed commits with messages that say *why*.
- Prefer editing the file in hand over a repo-wide refactor nobody asked
  for.
- Update this file when you change a port, a secret name, or a convention
  listed here.
