"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicError, setMagicError] = useState("");

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/board");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicLoading(true);
    setMagicError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setMagicError(error.message);
    else setMagicSent(true);
    setMagicLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <Link href="/" className="font-display text-xs tracking-[0.2em] uppercase text-muted hover:text-ink transition-colors">
            ← NextStop
          </Link>
          <h1 className="mt-6 font-display text-3xl font-medium tracking-tight">
            Sign in.
          </h1>
        </div>

        <form onSubmit={handlePasswordSignIn} className="space-y-4">
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
          <div>
            <label className="block font-display text-xs tracking-widest uppercase text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <div className="border-t border-border pt-6">
          {magicSent ? (
            <div className="space-y-3">
              <p className="text-sm text-muted font-light">
                Magic link sent to {email}. Check your inbox.
              </p>
              <button
                onClick={() => setMagicSent(false)}
                className="text-sm text-muted hover:text-ink transition-colors font-display underline underline-offset-4"
              >
                Send again
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-3">
              <p className="text-xs font-display tracking-widest uppercase text-muted">
                Or send a magic link instead
              </p>
              {magicError && (
                <p className="text-red-500 text-xs font-display">{magicError}</p>
              )}
              <button
                type="submit"
                disabled={magicLoading || !email}
                className="w-full border border-border text-ink py-3 font-display text-sm tracking-wide hover:bg-ink hover:text-chalk transition-colors disabled:opacity-50"
              >
                {magicLoading ? "Sending…" : "Send magic link →"}
              </button>
              <p className="text-xs text-muted/60 font-light">
                Uses the email address entered above.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
