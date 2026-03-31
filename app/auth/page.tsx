"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors">
            ← NextStop
          </Link>
          <h1 className="mt-6 font-display text-3xl font-medium tracking-tight">
            {sent ? "Check your email." : "Sign in."}
          </h1>
          <p className="mt-2 text-muted text-sm font-light">
            {sent
              ? `We sent a magic link to ${email}. Click it to continue — no password needed.`
              : "We'll email you a magic link — no password required."}
          </p>
        </div>

        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-display text-xs tracking-widest uppercase text-muted mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs font-display">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-chalk py-3 font-display text-sm tracking-wide hover:bg-rail transition-colors disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send magic link →"}
            </button>
          </form>
        )}

        {sent && (
          <button
            onClick={() => setSent(false)}
            className="text-sm text-muted hover:text-ink transition-colors font-display underline underline-offset-4"
          >
            Use a different email
          </button>
        )}
      </div>
    </main>
  );
}
