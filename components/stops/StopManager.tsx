"use client";
import { useState, useEffect, useRef } from "react";
import { UserStop, TransportStop } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props { initialSavedStops: UserStop[]; }

export default function StopManager({ initialSavedStops }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TransportStop[]>([]);
  const [savedStops, setSavedStops] = useState<UserStop[]>(initialSavedStops);
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/stops?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.stations ?? []);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const isSaved = (stopId: string) => savedStops.some((s) => s.stop_id === stopId);

  async function addStop(stop: TransportStop) {
    setActionLoading(stop.id);
    const res = await fetch("/api/user-stops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stop_id: stop.id, stop_name: stop.name }),
    });
    const data = await res.json();
    if (data.stop) setSavedStops((prev) => [...prev, data.stop]);
    setActionLoading(null);
  }

  async function removeStop(rowId: string) {
    setActionLoading(rowId);
    await fetch(`/api/user-stops?id=${rowId}`, { method: "DELETE" });
    setSavedStops((prev) => prev.filter((s) => s.id !== rowId));
    setActionLoading(null);
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <label className="block font-display text-xs tracking-widest uppercase text-muted">
          Search stops
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Zürich Bellevue, Bern Bahnhof…"
            className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="live-dot" />
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="border border-border divide-y divide-border">
            {results.slice(0, 8).map((stop) => {
              const saved = isSaved(stop.id);
              return (
                <div
                  key={stop.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-colors"
                >
                  <div>
                    <p className="font-body text-sm font-medium">{stop.name}</p>
                    {stop.distance != null && (
                      <p className="font-display text-xs text-muted">
                        {stop.distance < 1000
                          ? `${Math.round(stop.distance)}m away`
                          : `${(stop.distance / 1000).toFixed(1)}km away`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => saved ? undefined : addStop(stop)}
                    disabled={saved || actionLoading === stop.id}
                    className={cn(
                      "font-display text-xs tracking-widest uppercase px-3 py-1.5 transition-colors",
                      saved
                        ? "text-muted border border-border cursor-default"
                        : "text-chalk bg-ink hover:bg-rail disabled:opacity-50"
                    )}
                  >
                    {actionLoading === stop.id ? "…" : saved ? "Saved" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {query.length >= 2 && !searching && results.length === 0 && (
          <p className="text-muted text-sm font-display">No stops found.</p>
        )}
      </div>

      {/* Saved stops */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-display text-xs tracking-widest uppercase text-muted">
            Saved stops ({savedStops.length})
          </label>
          {savedStops.length > 0 && (
            <Link
              href="/board"
              className="font-display text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
            >
              View board →
            </Link>
          )}
        </div>

        {savedStops.length === 0 ? (
          <p className="text-muted text-sm font-light">No stops saved yet. Search above to add some.</p>
        ) : (
          <div className="border border-border divide-y divide-border">
            {savedStops.map((stop) => (
              <div
                key={stop.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <p className="font-body text-sm font-medium">{stop.stop_name}</p>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={actionLoading === stop.id}
                  className="font-display text-xs tracking-widest uppercase text-muted hover:text-red-500 transition-colors disabled:opacity-40"
                >
                  {actionLoading === stop.id ? "…" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
