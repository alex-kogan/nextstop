import { NextRequest, NextResponse } from "next/server";
import { searchStops } from "@/lib/transport";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query || query.length < 2) {
    return NextResponse.json({ stations: [] });
  }
  try {
    const stations = await searchStops(query);
    return NextResponse.json({ stations });
  } catch (e) {
    return NextResponse.json({ error: "Failed to search stops" }, { status: 500 });
  }
}
