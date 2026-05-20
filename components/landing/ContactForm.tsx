"use client";

import { useState, type CSSProperties, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const INPUT_FONT_SIZE = "clamp(18px, 3vw, 40px)";
const MESSAGE_FONT_SIZE = "clamp(16px, 2.2vw, 28px)";
const BUTTON_FONT_SIZE = "clamp(14px, 2vw, 26px)";
const LIST_FONT_SIZE = "clamp(13px, 2vw, 24px)";
const STATUS_FONT_SIZE = "clamp(12px, 1.6vw, 20px)";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || `Submission failed (${res.status})`);
      }

      setStatus("success");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Submission failed");
    }
  }

  function resetStatusIfNeeded() {
    if (status === "success" || status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  }

  const disabled = status === "submitting";

  const fieldBaseStyle: CSSProperties = {
    width: "100%",
    border: "none",
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: "clamp(0.35rem, 1vw, 0.65rem) clamp(0.5rem, 1.3vw, 0.9rem)",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full uppercase"
      style={{ maxWidth: "min(92vw, 1000px)" }}
      aria-label="Join the peeyew email list"
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <input
          id="signup-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            resetStatusIfNeeded();
          }}
          disabled={disabled}
          required
          autoComplete="email"
          placeholder="example@email.com"
          className="min-w-0 flex-1 text-black outline-none placeholder:text-black/30 focus-visible:ring-2 focus-visible:ring-black disabled:opacity-60"
          style={{
            ...fieldBaseStyle,
            fontSize: INPUT_FONT_SIZE,
            lineHeight: 1,
          }}
        />

        <button
          type="submit"
          disabled={disabled}
          className="cursor-pointer border-2 border-black bg-black text-white transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            fontSize: BUTTON_FONT_SIZE,
            padding: "clamp(0.45rem, 1vw, 0.75rem) clamp(0.9rem, 2vw, 1.6rem)",
            lineHeight: 1,
            letterSpacing: "0.04em",
          }}
        >
          {status === "submitting" ? "sending..." : status === "success" ? "sent!" : "submit"}
        </button>
      </div>

      <textarea
        id="signup-message"
        name="message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          resetStatusIfNeeded();
        }}
        disabled={disabled}
        required
        rows={2}
        placeholder="enter your shoe size..."
        className="mt-2 block resize-y text-black outline-none placeholder:text-black/30 focus-visible:ring-2 focus-visible:ring-black disabled:opacity-60"
        style={{
          ...fieldBaseStyle,
          minHeight: "clamp(64px, 7vw, 110px)",
          fontSize: MESSAGE_FONT_SIZE,
          lineHeight: 1.05,
        }}
      />

      <ul
        className="mt-3 text-left leading-[0.95] text-black"
        style={{ fontSize: LIST_FONT_SIZE }}
      >
        <li>- rsvps to guestlists</li>
        <li>- exclusive unseen magazine content</li>
        <li>- presale to events and drops</li>
      </ul>

      {status === "success" && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-center text-black"
          style={{ fontSize: STATUS_FONT_SIZE }}
        >
          you&apos;re on the list. PEEYEW sends it thanks.
        </p>
      )}

      {status === "error" && (
        <p
          role="alert"
          className="mt-3 text-left"
          style={{ color: "var(--color-redBrand)", fontSize: STATUS_FONT_SIZE }}
        >
          {errorMessage || "something went wrong. try again?"}
        </p>
      )}
    </form>
  );
}