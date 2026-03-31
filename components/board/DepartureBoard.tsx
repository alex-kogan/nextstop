"use client";
import { useState, useEffect, useCallback } from "react";
import { UserStop, DepartureGroup, Departure } from "@/types";
import DepartureCard from "./DepartureCard";
import { minutesUntil } from "@/lib/utils";

const REFRESH_INTERVAL = 30_000;

const colHeaderStyle: React.CSSProperties = {
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#0070b4",
  fontWeight: 600,
  fontFamily: "'DM Mono', monospace",
  padding: "6px 12px",
  borderBottom: "2px solid #e0e0e0",
};

interface FlatDeparture {
  departure: Departure;
  stopName: string;
}

interface Props { initialStops: UserStop[]; }

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
          const res = await fetch(`/api/departures?id=${stop.stop_id}&limit=12`);
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

  // Flatten, filter (0–30 min), sort by departure time
  const merged: FlatDeparture[] = [];
  for (const group of groups) {
    for (const dep of group.departures) {
      const mins = minutesUntil(dep.stop.departure);
      if (mins >= 0 && mins <= 30) {
        merged.push({ departure: dep, stopName: group.stopName });
      }
    }
  }
  merged.sort(
    (a, b) =>
      minutesUntil(a.departure.stop.departure) -
      minutesUntil(b.departure.stop.departure)
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Board header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div className="live-dot" />
          <h1
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#1a1a1a",
              fontFamily: "'DM Sans', sans-serif",
              margin: 0,
            }}
          >
            Next Departures
          </h1>
        </div>
        <button
          onClick={fetchAll}
          disabled={refreshing}
          style={{
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#0070b4",
            fontFamily: "'DM Mono', monospace",
            background: "none",
            border: "none",
            cursor: refreshing ? "default" : "pointer",
            opacity: refreshing ? 0.5 : 1,
          }}
        >
          {refreshing ? "Updating…" : `↺ ${countdown}s`}
        </button>
      </div>

      {/* Unified table */}
      {merged.length === 0 && groups.length > 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1rem",
            color: "#999",
            fontSize: "0.9rem",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          No departures in the next 30 minutes
        </div>
      ) : merged.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
            tableLayout: "auto",
          }}
        >
          <thead>
            <tr>
              <th style={{ ...colHeaderStyle, textAlign: "left", width: "7rem" }}>Line</th>
              <th style={{ ...colHeaderStyle, textAlign: "left" }}>Direction</th>
              <th style={{ ...colHeaderStyle, textAlign: "left" }}>From</th>
              <th
                className="hidden md:table-cell"
                style={{ ...colHeaderStyle, textAlign: "center", width: "5rem" }}
              >
                Walk
              </th>
              <th style={{ ...colHeaderStyle, textAlign: "right", width: "6rem" }}>Departs</th>
            </tr>
          </thead>
          <tbody>
            {merged.map(({ departure, stopName }, i) => (
              <DepartureCard
                key={`${departure.name}-${departure.stop.departure}-${stopName}-${i}`}
                departure={departure}
                stopName={stopName}
                index={i}
              />
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
