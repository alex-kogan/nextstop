// transport.opendata.ch API types
export interface TransportStop {
  id: string;
  name: string;
  score: number;
  coordinate: { type: string; x: number; y: number };
  distance: number | null;
}

export interface Departure {
  stop: {
    station: { id: string; name: string };
    departure: string; // ISO string
    delay: number | null;
    platform: string | null;
  };
  name: string;     // line name e.g. "S3"
  category: string; // "S", "T", "B", etc.
  number: string;
  operator: string;
  to: string;       // destination
  passList: Array<{ station: { name: string } }>;
}

export interface StationboardResponse {
  station: { id: string; name: string };
  stationboard: Departure[];
}

// App-level types
export interface UserStop {
  id: string;
  stop_id: string;
  stop_name: string;
  created_at: string;
}

export interface DepartureGroup {
  stopId: string;
  stopName: string;
  departures: Departure[];
  fetchedAt: Date;
  error?: string;
}

export type TransportCategory = "S" | "T" | "B" | "IR" | "IC" | "RE" | string;

export const CATEGORY_LABELS: Record<string, string> = {
  S: "S-Bahn",
  T: "Tram",
  B: "Bus",
  IR: "Interregio",
  IC: "InterCity",
  RE: "RegioExpress",
};
