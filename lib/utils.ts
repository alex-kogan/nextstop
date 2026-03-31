import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInMinutes, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDepartureTime(isoString: string): string {
  return format(parseISO(isoString), "HH:mm");
}

export function minutesUntil(isoString: string): number {
  return differenceInMinutes(parseISO(isoString), new Date());
}

export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    S: "bg-green-600 text-white",
    T: "bg-blue-600 text-white",
    B: "bg-amber text-ink",
    IR: "bg-red-600 text-white",
    IC: "bg-red-700 text-white",
    RE: "bg-purple-600 text-white",
  };
  return map[category] ?? "bg-muted text-white";
}
