"use client";
import { useState, useEffect, useCallback } from "react";
import { UserStop, DepartureGroup } from "@/types";
import DepartureCard from "./DepartureCard";

const REFRESH_INTERVAL = 30_000;

const colHeaderStyle: React.CSSProperties = {
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#999",
  fontWeight: 500,
  fontFamily: "'DM Mono', monospace",
  padding: "6px 12px",
  borderBottom: "2px solid #e0e0e0",
};

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
        <h1
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#1a1a1a",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
          }}
        >
          Nächste Abfahrten
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={fetchAll}
            disabled={refreshing}
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#999",
              fontFamily: "'DM Mono', monospace",
              background: "none",
              border: "none",
              cursor: refreshing ? "default" : "pointer",
              opacity: refreshing ? 0.5 : 1,
            }}
          >
            {refreshing ? "Updating…" : `↺ ${countdown}s`}
          </button>
          <span
            style={{
              color: "#eb0000",
              fontWeight: 700,
              fontSize: "1.1rem",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            ZVV
          </span>
        </div>
      </div>

      {/* Stop tables */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {groups.map((group) => (
          <div key={group.stopId}>
            {/* Stop label */}
            <div
              style={{
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#999",
                fontFamily: "'DM Mono', monospace",
                marginBottom: "0.4rem",
              }}
            >
              {group.stopName}
            </div>

            {group.error ? (
              <p style={{ color: "#999", fontSize: "0.85rem", margin: 0 }}>{group.error}</p>
            ) : group.departures.length === 0 ? (
              <p style={{ color: "#999", fontSize: "0.85rem", margin: 0 }}>No upcoming departures.</p>
            ) : (
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
                    <th style={{ ...colHeaderStyle, textAlign: "left", width: "7rem" }}>Linie</th>
                    <th style={{ ...colHeaderStyle, textAlign: "left" }}>Richtung</th>
                    <th style={{ ...colHeaderStyle, textAlign: "left" }}>Ab Haltestelle</th>
                    <th
                      className="hidden md:table-cell"
                      style={{ ...colHeaderStyle, textAlign: "center", width: "5rem" }}
                    >
                      Fussweg
                    </th>
                    <th style={{ ...colHeaderStyle, textAlign: "right", width: "6rem" }}>Abfahrt</th>
                  </tr>
                </thead>
                <tbody>
                  {group.departures.map((dep, i) => (
                    <DepartureCard
                      key={`${dep.name}-${dep.stop.departure}-${i}`}
                      departure={dep}
                      stopName={group.stopName}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
