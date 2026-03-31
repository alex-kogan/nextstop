"use client";
import { Departure } from "@/types";
import { formatDepartureTime, minutesUntil } from "@/lib/utils";
import { getLineColor } from "@/lib/transitColors";

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
  const { stop, category, to, number, operator } = departure;
  const minutes = minutesUntil(stop.departure);
  const displayTime = formatDepartureTime(stop.departure);
  const delay = stop.delay ?? 0;
  const isImminent = minutes <= 2;
  const isDelayed = delay > 0;
  const lineColor = getLineColor(operator, category, number);

  let departsText: string;
  if (minutes <= 1) {
    departsText = "now";
  } else if (minutes > 60) {
    departsText = displayTime;
  } else {
    departsText = `in ${minutes}'`;
  }

  const rowBg = index % 2 === 0 ? "#f9f9f9" : "#ffffff";

  return (
    <tr style={{ backgroundColor: rowBg, borderBottom: "1px solid #e0e0e0" }}>
      {/* Line */}
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

      {/* Direction + from label */}
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
        <span
          style={{
            color: "#999",
            fontSize: "0.72rem",
            fontFamily: "'DM Mono', monospace",
            display: "block",
            marginTop: 1,
          }}
        >
          from: {stopName}
        </span>
      </td>

      {/* From */}
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

      {/* Walk — hidden on mobile */}
      <td
        className="hidden md:table-cell"
        style={{ padding: "8px 12px", textAlign: "center" }}
      >
        <span style={{ color: "#999", fontSize: "0.85rem" }}>—</span>
      </td>

      {/* Departs */}
      <td style={{ padding: "8px 12px 8px 8px", textAlign: "right", whiteSpace: "nowrap" }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.9rem",
            fontFamily: "'DM Mono', monospace",
            color: isImminent ? "#f59e0b" : "#1a1a1a",
          }}
        >
          {departsText}
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
