import { NextRequest, NextResponse } from "next/server";
import { fetchDepartures } from "@/lib/transport";

export async function GET(request: NextRequest) {
  const stationId = request.nextUrl.searchParams.get("id");
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "10");

  if (!stationId) {
    return NextResponse.json({ error: "Missing station id" }, { status: 400 });
  }
  try {
    const data = await fetchDepartures(stationId, limit);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch departures" }, { status: 500 });
  }
}
