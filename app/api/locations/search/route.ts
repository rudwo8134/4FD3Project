import { NextResponse } from "next/server";

// Simple static list for now; replace with real geocoding API if needed
// Restrict to Canadian locations only
const CITY_LIST = [
  "Toronto",
  "Vancouver",
  "Montreal",
  "Calgary",
  "Ottawa",
  "Edmonton",
  "Winnipeg",
  "Quebec City",
  "Hamilton",
  "Kitchener",
  "Waterloo",
  "London, Ontario",
  "Mississauga",
  "Brampton",
  "Halifax",
  "Victoria",
  "Saskatoon",
  "Regina",
  "St. John's",
  "Windsor",
  "Markham",
  "Surrey",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    if (!q) return NextResponse.json({ results: [] });

    const results = CITY_LIST.filter((c) =>
      c.toLowerCase().startsWith(q)
    ).slice(0, 8);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
