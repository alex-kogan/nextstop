"use client";
import { Departure } from "@/types";
import { formatDepartureTime, minutesUntil, categoryColor, cn } from "@/lib/utils";

interface Props { departure: Departure; }

export default function DepartureCard({ departure }: Props) {
  const { stop, name, category, to, number } = departure;
  const minutes = minutesUntil(stop.departure);
  const displayTime = formatDepartureTime(stop.departure);
  const delay = stop.delay ?? 0;
  const isImminent = minutes <= 2;
  const isDelayed = delay > 0;

  return (
    <div className={cn(
      "departure-row flex items-center gap-4 px-4 py-3 border border-border",
      "hover:border-ink/30 hover:bg-white/50 transition-all duration-200",
      isImminent && "border-amber-300 bg-amber-50/50"
    )}>
      {/* Line badge */}
      <div className={cn(
        "flex-shrink-0 w-12 h-8 flex items-center justify-center font-display text-sm font-medium",
        categoryColor(category)
      )}>
        {name || number || category}
      </div>

      {/* Destination */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium truncate">{to}</p>
        {stop.platform && (
          <p className="font-display text-xs text-muted tracking-wide">
            Platform {stop.platform}
          </p>
        )}
      </div>

      {/* Time */}
      <div className="flex-shrink-0 text-right">
        <div className="flex items-baseline gap-1.5 justify-end">
          <span className={cn(
            "font-display text-lg font-medium tabular-nums",
            isImminent ? "text-amber-600" : "text-ink"
          )}>
            {minutes <= 0 ? "now" : `${minutes}'`}
          </span>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <span className="font-display text-xs text-muted tabular-nums">{displayTime}</span>
          {isDelayed && (
            <span className="font-display text-xs text-red-500">+{delay}'</span>
          )}
        </div>
      </div>
    </div>
  );
}
