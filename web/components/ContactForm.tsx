"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-card border border-success-soft bg-success-soft/60 p-6 text-success">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">Thanks — your message is on its way.</p>
          <p className="mt-1 text-sm text-success/80">We&apos;ll get back to you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" type="text" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-control border border-line bg-surface-raised px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder="Tell us about the project you're working on."
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="brand-gradient-bg inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-6 text-sm font-semibold text-brand-ink shadow-raised transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-control border border-line bg-surface-raised px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}
