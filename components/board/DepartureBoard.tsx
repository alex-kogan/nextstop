"use client";
import { useState, useEffect, useCallback } from "react";
import { UserStop, DepartureGroup, Departure } from "@/types";
import DepartureCard from "./DepartureCard";
import { minutesUntil } from "@/lib/utils";

const REFRESH_INTERVAL = 30_000;

interface Props { initialStops: UserStop[]; }

function nextDepartureLabel(departures: Departure[]): string | null {
  if (!departures.length) return null;
  const mins = minutesUntil(departures[0].stop.departure);
  if (mins <= 0) return "next departure: now";
  return `next in ${mins}m`;
}

export default function DepartureBoard({ initialStops }: Props) {
  const [groups, setGroups] = useState<DepartureGroup[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    const results = await Promise.all(
      initialStops.map(async (stop) => {
        try {
          const res = await fetch(`/api/departures?id=${stop.stop_id}&limit=8`);
          const data = await res.json();
          return {
            stopId: stop.stop_id,
            stopName: stop.stop_name,
            departures: data.stationboard ?? [],
            fetchedAt: new Date(),
          } as DepartureGroup;
        } catch {
          return {
            stopId: stop.stop_id,
            stopName: stop.stop_name,
            departures: [],
            fetchedAt: new Date(),
            error: "Could not load departures",
          } as DepartureGroup;
        }
      })
    );
    setGroups(results);
    setLastRefresh(new Date());
    setCountdown(30);
    setRefreshing(false);
  }, [initialStops]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 30 : c - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastRefresh]);

  return (
    <div className="space-y-8">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="live-dot animate-pulse" />
          <span className="font-display text-xs tracking-widest uppercase text-muted">
            {refreshing ? "Updating…" : "Live"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-display text-xs text-muted">
            Refreshing in {countdown}s
          </span>
          <button
            onClick={fetchAll}
            disabled={refreshing}
            className="font-display text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors disabled:opacity-40"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* Stop groups */}
      {groups.map((group) => {
        const nextLabel = nextDepartureLabel(group.departures);
        return (
          <section key={group.stopId} className="space-y-3">
            <div className="flex items-baseline gap-3 pb-2 border-b border-border">
              <h2 className="font-display text-lg font-medium tracking-tight">
                {group.stopName}
              </h2>
              {nextLabel && (
                <span className="font-display text-xs text-muted tracking-wide">
                  {nextLabel}
                </span>
              )}
            </div>

            {group.error ? (
              <p className="text-muted text-sm font-display">{group.error}</p>
            ) : group.departures.length === 0 ? (
              <p className="text-muted text-sm font-display">No upcoming departures.</p>
            ) : (
              <div className="space-y-2">
                {group.departures.map((dep, i) => (
                  <DepartureCard key={`${dep.name}-${dep.stop.departure}-${i}`} departure={dep} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
