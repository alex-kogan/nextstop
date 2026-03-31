"use client";
import { Departure } from "@/types";
import { formatDepartureTime, minutesUntil } from "@/lib/utils";

function getLineColor(category: string, number: string): string {
  if (category === "T") {
    const n = parseInt(number, 10);
    const colors: Record<number, string> = {
      2: "#00569b", 3: "#6cb33f", 4: "#c4007a", 5: "#9b6300",
      6: "#6f2282", 7: "#00694f", 8: "#003c8f", 9: "#00a9c7",
      10: "#008b7a", 11: "#6cb33f", 13: "#e4007e", 14: "#e84e0f",
      15: "#0075b0", 17: "#8a7200",
    };
    return colors[n] ?? "#888888";
  }
  if (category === "B") return "#f07d00";
  if (category === "S") return "#169b62";
  if (category === "IR" || category === "IC" || category === "RE") return "#eb0000";
  return "#888888";
}

function TramIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="10" width="20" height="8" rx="1" fill={color} />
      <rect x="4" y="12" width="4" height="3.5" rx="0.5" fill="white" opacity="0.9" />
      <rect x="10" y="12" width="4" height="3.5" rx="0.5" fill="white" opacity="0.9" />
      <rect x="16" y="12" width="4" height="3.5" rx="0.5" fill="white" opacity="0.9" />
      <circle cx="7" cy="19.5" r="1.5" fill={color} />
      <circle cx="17" cy="19.5" r="1.5" fill={color} />
      <line x1="9" y1="10" x2="7" y2="5" stroke={color} strokeWidth="1" />
      <line x1="15" y1="10" x2="17" y2="5" stroke={color} strokeWidth="1" />
      <line x1="7" y1="5" x2="17" y2="5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function BusIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="7" width="20" height="11" rx="2" fill={color} />
      <rect x="4" y="9.5" width="4.5" height="4" rx="0.5" fill="white" opacity="0.9" />
      <rect x="10" y="9.5" width="4.5" height="4" rx="0.5" fill="white" opacity="0.9" />
      <rect x="16" y="9.5" width="3.5" height="4" rx="0.5" fill="white" opacity="0.9" />
      <circle cx="7" cy="19.5" r="1.8" fill={color} />
      <circle cx="17" cy="19.5" r="1.8" fill={color} />
    </svg>
  );
}

function SBahnIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill={color} />
      <text x="12" y="16.5" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">S</text>
    </svg>
  );
}

function TrainIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="3" width="16" height="15" rx="2" fill={color} />
      <rect x="6" y="5.5" width="5" height="5" rx="0.5" fill="white" opacity="0.9" />
      <rect x="13" y="5.5" width="5" height="5" rx="0.5" fill="white" opacity="0.9" />
      <circle cx="8" cy="20.5" r="1.8" fill={color} />
      <circle cx="16" cy="20.5" r="1.8" fill={color} />
      <rect x="7" y="18" width="10" height="2" fill={color} opacity="0.6" />
    </svg>
  );
}

function VehicleIcon({ category, color }: { category: string; color: string }) {
  if (category === "T") return <TramIcon color={color} />;
  if (category === "B") return <BusIcon color={color} />;
  if (category === "S") return <SBahnIcon color={color} />;
  return <TrainIcon color={color} />;
}

interface Props {
  departure: Departure;
  stopName: string;
  index: number;
}

export default function DepartureCard({ departure, stopName, index }: Props) {
  const { stop, category, to, number } = departure;
  const minutes = minutesUntil(stop.departure);
  const displayTime = formatDepartureTime(stop.departure);
  const delay = stop.delay ?? 0;
  const isImminent = minutes <= 2;
  const isDelayed = delay > 0;
  const lineColor = getLineColor(category, number);

  let abfahrtText: string;
  if (minutes <= 1) {
    abfahrtText = "now";
  } else if (minutes > 60) {
    abfahrtText = displayTime;
  } else {
    abfahrtText = `in ${minutes}'`;
  }

  const rowBg = index % 2 === 0 ? "#f9f9f9" : "#ffffff";

  return (
    <tr style={{ backgroundColor: rowBg, borderBottom: "1px solid #e0e0e0" }}>
      {/* Linie */}
      <td style={{ padding: "8px 10px 8px 12px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <VehicleIcon category={category} color={lineColor} />
          <span
            style={{
              backgroundColor: lineColor,
              color: "white",
              fontWeight: 700,
              borderRadius: 4,
              minWidth: "2.5rem",
              textAlign: "center",
              fontSize: "0.8rem",
              padding: "2px 7px",
              fontFamily: "'DM Mono', monospace",
              display: "inline-block",
            }}
          >
            {number || category}
          </span>
        </div>
      </td>

      {/* Richtung */}
      <td style={{ padding: "8px 12px", maxWidth: 220 }}>
        <span
          style={{
            color: "#1a1a1a",
            fontWeight: 600,
            fontSize: "0.9rem",
            fontFamily: "'DM Sans', sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {to}
        </span>
      </td>

      {/* Ab Haltestelle */}
      <td style={{ padding: "8px 12px" }}>
        <span
          style={{
            color: "#555",
            fontSize: "0.85rem",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {stopName}
        </span>
      </td>

      {/* Fussweg — hidden on mobile */}
      <td
        className="hidden md:table-cell"
        style={{ padding: "8px 12px", textAlign: "center" }}
      >
        <span style={{ color: "#999", fontSize: "0.85rem" }}>—</span>
      </td>

      {/* Abfahrt */}
      <td style={{ padding: "8px 12px 8px 8px", textAlign: "right", whiteSpace: "nowrap" }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.9rem",
            fontFamily: "'DM Mono', monospace",
            color: isImminent ? "#f59e0b" : "#1a1a1a",
          }}
        >
          {abfahrtText}
        </span>
        {isDelayed && (
          <div>
            <span
              style={{
                color: "#ef4444",
                fontSize: "0.7rem",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              +{delay}'
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}
