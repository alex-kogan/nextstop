const BASE = "https://transport.opendata.ch/v1";

export async function searchStops(query: string) {
  const url = `${BASE}/locations?query=${encodeURIComponent(query)}&type=station`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch stops");
  const data = await res.json();
  return data.stations ?? [];
}

export async function fetchDepartures(stationId: string, limit = 10) {
  const url = `${BASE}/stationboard?id=${encodeURIComponent(stationId)}&limit=${limit}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch departures for ${stationId}`);
  return res.json();
}
