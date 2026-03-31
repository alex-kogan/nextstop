"use client";
import { useState, useEffect, useRef } from "react";
import { UserStop, TransportStop } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props { initialSavedStops: UserStop[]; }

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number): string {
  return meters < 1000
    ? `${Math.round(meters)}m`
    : `${(meters / 1000).toFixed(1)}km`;
}

export default function StopManager({ initialSavedStops }: Props) {
  const [savedStops, setSavedStops] = useState<UserStop[]>(initialSavedStops);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Address / nearby state
  const [address, setAddress] = useState("");
  const [addrCoords, setAddrCoords] = useState<{ x: number; y: number } | null>(null);
  const [nearbyResults, setNearbyResults] = useState<(TransportStop & { _dist: number })[]>([]);
  const [addrSearching, setAddrSearching] = useState(false);
  const addrDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Stop name search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TransportStop[]>([]);
  const [searching, setSearching] = useState(false);
  const stopDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  const isSaved = (stopId: string) => savedStops.some((s) => s.stop_id === stopId);

  // Geocode address → then fetch nearby stops
  useEffect(() => {
    clearTimeout(addrDebounceRef.current);
    if (address.length < 3) {
      setAddrCoords(null);
      setNearbyResults([]);
      return;
    }
    addrDebounceRef.current = setTimeout(async () => {
      setAddrSearching(true);
      try {
        // Step 1: geocode the address to get coordinates
        const geoRes = await fetch(`/api/stops?q=${encodeURIComponent(address)}&geocode=1`);
        const geoData = await geoRes.json();
        const locations: TransportStop[] = geoData.stations ?? [];
        const ref = locations.find((l) => l.coordinate?.x && l.coordinate?.y);
        if (!ref) { setAddrCoords(null); setNearbyResults([]); return; }

        const coords = { x: ref.coordinate.x, y: ref.coordinate.y };
        setAddrCoords(coords);

        // Step 2: fetch nearby stations by coordinates
        const nearRes = await fetch(`/api/stops?x=${coords.x}&y=${coords.y}`);
        const nearData = await nearRes.json();
        const stops: TransportStop[] = nearData.stations ?? [];

        // Filter to within 800m using Haversine (x=lon, y=lat)
        const filtered = stops
          .filter((s) => s.coordinate?.x && s.coordinate?.y && s.id)
          .map((s) => ({
            ...s,
            _dist: haversineMeters(coords.y, coords.x, s.coordinate.y, s.coordinate.x),
          }))
          .filter((s) => s._dist <= 800)
          .sort((a, b) => a._dist - b._dist);

        setNearbyResults(filtered);
      } finally {
        setAddrSearching(false);
      }
    }, 500);
    return () => clearTimeout(addrDebounceRef.current);
  }, [address]);

  // Debounced stop name search
  useEffect(() => {
    clearTimeout(stopDebounceRef.current);
    if (query.length < 2) { setResults([]); return; }
    stopDebounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/stops?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.stations ?? []);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(stopDebounceRef.current);
  }, [query]);

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

  function StopRow({ stop, distance }: { stop: TransportStop; distance?: number }) {
    const saved = isSaved(stop.id);
    return (
      <div className="flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-colors">
        <div>
          <p className="font-body text-sm font-medium">{stop.name}</p>
          {distance != null && (
            <p className="font-display text-xs text-muted">{formatDistance(distance)}</p>
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
  }

  const unsavedNearby = nearbyResults.filter((s) => !isSaved(s.id));
  const unsavedResults = results.filter((s) => !isSaved(s.id));

  return (
    <div className="space-y-8">
      {/* Address / nearby search */}
      <div className="space-y-3">
        <label className="block font-display text-xs tracking-widest uppercase text-muted">
          Enter your address
        </label>
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Bahnhofstrasse 1, Zürich"
            className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm focus:outline-none focus:border-ink transition-colors placeholder:text-muted/50"
          />
          {addrSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="live-dot" />
            </div>
          )}
        </div>

        {address.length >= 3 && !addrSearching && addrCoords && unsavedNearby.length === 0 && (
          <p className="text-muted text-sm font-display">No stops within 800m.</p>
        )}

        {unsavedNearby.length > 0 && (
          <div className="space-y-1">
            <p className="font-display text-xs tracking-widest uppercase text-muted">
              Nearby stops
            </p>
            <div className="border border-border divide-y divide-border">
              {unsavedNearby.map((stop) => (
                <StopRow key={stop.id} stop={stop} distance={stop._dist} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stop name search */}
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

        {unsavedResults.length > 0 && (
          <div className="border border-border divide-y divide-border">
            {unsavedResults.slice(0, 8).map((stop) => (
              <StopRow key={stop.id} stop={stop} />
            ))}
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
              <div key={stop.id} className="flex items-center justify-between px-4 py-3">
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
