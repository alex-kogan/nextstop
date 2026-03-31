"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface HeaderProps { userEmail: string; }

export default function Header({ userEmail }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "#ffffff", borderBottom: "2px solid #0070b4" }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="live-dot" />
          <Link
            href="/board"
            className="font-display text-sm tracking-[0.15em] uppercase font-medium"
            style={{ color: "#0070b4" }}
          >
            NextStop
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            href="/board/stops"
            className="font-display text-xs tracking-widest uppercase transition-colors"
            style={{ color: "#0070b4" }}
          >
            My Stops
          </Link>
          <span className="text-border">|</span>
          <span className="font-display text-xs text-muted tracking-wide hidden sm:block">
            {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="font-display text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
          >
            {signingOut ? "…" : "Sign out"}
          </button>
        </nav>
      </div>
    </header>
  );
}
