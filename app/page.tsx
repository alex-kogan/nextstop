import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/board");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Decorative background lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-border"
            style={{ top: `${15 + i * 14}%`, left: 0, right: 0, opacity: 0.6 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-amber-400 live-dot" />
          <span className="font-display text-sm tracking-[0.2em] uppercase text-muted">
            NextStop
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-medium leading-tight tracking-tight">
          Your personal
          <br />
          <span className="text-amber-500">departure board.</span>
        </h1>

        <p className="text-muted text-lg font-light max-w-sm mx-auto leading-relaxed">
          Save your favorite Swiss transit stops. See real-time departures the moment you open the app.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/auth"
            className="px-8 py-3 bg-ink text-chalk font-display text-sm tracking-wide rounded-none hover:bg-rail transition-colors"
          >
            Get started →
          </Link>
          <Link
            href="/auth"
            className="px-8 py-3 border border-border text-ink font-display text-sm tracking-wide rounded-none hover:border-ink transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 justify-center pt-4">
          {["Live departures", "Swiss transit", "Your saved stops", "Auto-refresh"].map((f) => (
            <span
              key={f}
              className="px-3 py-1 border border-border text-xs font-display text-muted tracking-wide"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
