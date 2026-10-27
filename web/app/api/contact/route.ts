import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "support@mahanthltd.co.uk";
const MAX_LENGTH = 5000;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = asTrimmedString(body.name, 200);
  const email = asTrimmedString(body.email, 320);
  const message = asTrimmedString(body.message, MAX_LENGTH);

  if (!name || !email || !message || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Please fill in every field with a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Logged, not returned — see api/src/billing/mod.rs's identical
    // reasoning in the sibling projects for why internal detail never
    // reaches the client.
    console.error("RESEND_API_KEY is not configured; refusing the contact form submission");
    return NextResponse.json({ error: "The contact form isn't available right now. Please email us directly." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Mahanth Ltd website <noreply@mahanthltd.co.uk>",
    to: TO_EMAIL,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("resend send failed", error);
    return NextResponse.json({ error: "Something went wrong sending your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
