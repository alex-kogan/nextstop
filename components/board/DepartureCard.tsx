"use client";
import { Departure } from "@/types";
import { formatDepartureTime, minutesUntil, cn } from "@/lib/utils";

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

function TramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Tram">
      <rect x="2" y="10" width="20" height="8" rx="1" fill="currentColor" />
      <rect x="4" y="12" width="4" height="3.5" rx="0.5" fill="white" opacity="0.85" />
      <rect x="10" y="12" width="4" height="3.5" rx="0.5" fill="white" opacity="0.85" />
      <rect x="16" y="12" width="4" height="3.5" rx="0.5" fill="white" opacity="0.85" />
      <circle cx="7" cy="19.5" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.5" fill="currentColor" />
      <line x1="9" y1="10" x2="7" y2="5" stroke="currentColor" strokeWidth="1" />
      <line x1="15" y1="10" x2="17" y2="5" stroke="currentColor" strokeWidth="1" />
      <line x1="7" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Bus">
      <rect x="2" y="7" width="20" height="11" rx="2" fill="currentColor" />
      <rect x="4" y="9.5" width="4.5" height="4" rx="0.5" fill="white" opacity="0.85" />
      <rect x="10" y="9.5" width="4.5" height="4" rx="0.5" fill="white" opacity="0.85" />
      <rect x="16" y="9.5" width="3.5" height="4" rx="0.5" fill="white" opacity="0.85" />
      <circle cx="7" cy="19.5" r="1.8" fill="currentColor" />
      <circle cx="17" cy="19.5" r="1.8" fill="currentColor" />
    </svg>
  );
}

function SBahnIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="S-Bahn">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <text
        x="12" y="16.5"
        textAnchor="middle"
        fill="white"
        fontSize="11"
        fontWeight="bold"
        fontFamily="sans-serif"
      >S</text>
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Train">
      <rect x="4" y="3" width="16" height="15" rx="2" fill="currentColor" />
      <rect x="6" y="5.5" width="5" height="5" rx="0.5" fill="white" opacity="0.85" />
      <rect x="13" y="5.5" width="5" height="5" rx="0.5" fill="white" opacity="0.85" />
      <rect x="4" y="14" width="16" height="2" fill="white" opacity="0.15" />
      <circle cx="8" cy="20.5" r="1.8" fill="currentColor" />
      <circle cx="16" cy="20.5" r="1.8" fill="currentColor" />
      <rect x="7" y="18" width="10" height="2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function VehicleIcon({ category }: { category: string }) {
  if (category === "T") return <TramIcon />;
  if (category === "B") return <BusIcon />;
  if (category === "S") return <SBahnIcon />;
  return <TrainIcon />;
}

interface Props { departure: Departure; }

export default function DepartureCard({ departure }: Props) {
  const { stop, category, to, number } = departure;
  const minutes = minutesUntil(stop.departure);
  const displayTime = formatDepartureTime(stop.departure);
  const delay = stop.delay ?? 0;
  const isImminent = minutes <= 2;
  const isDelayed = delay > 0;
  const lineColor = getLineColor(category, number);

  return (
    <div
      className={cn(
        "departure-row flex items-center gap-3 px-4 py-3 border border-border border-l-[3px]",
        "hover:bg-white/60 transition-all duration-200",
        isImminent && "bg-amber-50/70"
      )}
      style={{ borderLeftColor: lineColor }}
    >
      {/* Vehicle icon */}
      <div className="flex-shrink-0 text-ink/40" style={{ width: 24, height: 24 }}>
        <VehicleIcon category={category} />
      </div>

      {/* Line badge */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded font-display text-sm font-bold text-white"
        style={{ backgroundColor: lineColor, minWidth: "2.5rem", height: "1.75rem", padding: "0 6px" }}
      >
        {number || category}
      </div>

      {/* Destination */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-semibold truncate">{to}</p>
        {stop.platform && (
          <p className="font-display text-xs text-muted tracking-wide">Pl. {stop.platform}</p>
        )}
      </div>

      {/* Time */}
      <div className="flex-shrink-0 text-right">
        <div className={cn(
          "font-display text-lg font-bold tabular-nums leading-tight",
          isImminent ? "text-amber-600" : "text-ink"
        )}>
          {minutes <= 0 ? "now" : `${minutes}'`}
        </div>
        <div className="flex items-center gap-1 justify-end">
          <span className="font-display text-xs text-muted tabular-nums">{displayTime}</span>
          {isDelayed && (
            <span className="font-display text-xs text-red-500 font-medium">+{delay}'</span>
          )}
        </div>
      </div>
    </div>
  );
}
