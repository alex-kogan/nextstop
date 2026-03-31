import { NextRequest, NextResponse } from "next/server";
import { searchStops, geocodeAddress, nearbyStops } from "@/lib/transport";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");
  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const geocode = searchParams.get("geocode");

  try {
    if (x && y) {
      const stations = await nearbyStops(parseFloat(x), parseFloat(y));
      return NextResponse.json({ stations });
    }
    if (!query || query.length < 2) {
      return NextResponse.json({ stations: [] });
    }
    if (geocode === "1") {
      const stations = await geocodeAddress(query);
      return NextResponse.json({ stations });
    }
    const stations = await searchStops(query);
    return NextResponse.json({ stations });
  } catch {
    return NextResponse.json({ error: "Failed to search stops" }, { status: 500 });
  }
}
