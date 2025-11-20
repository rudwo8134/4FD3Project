import { NextResponse } from "next/server";

// Comprehensive list of Canadian cities and major North American tech hubs
const CITY_LIST = [
  // Ontario
  "Toronto, ON",
  "Ottawa, ON",
  "Mississauga, ON",
  "Brampton, ON",
  "Hamilton, ON",
  "London, ON",
  "Markham, ON",
  "Vaughan, ON",
  "Kitchener, ON",
  "Windsor, ON",
  "Burlington, ON",
  "Sudbury, ON",
  "Oshawa, ON",
  "Barrie, ON",
  "St. Catharines, ON",
  "Cambridge, ON",
  "Kingston, ON",
  "Guelph, ON",
  "Thunder Bay, ON",
  "Waterloo, ON",
  "Brantford, ON",
  "Pickering, ON",
  "Niagara Falls, ON",
  "Peterborough, ON",
  "Sault Ste. Marie, ON",
  "Sarnia, ON",
  "Norfolk County, ON",
  "Welland, ON",
  "Belleville, ON",
  "North Bay, ON",

  // British Columbia
  "Vancouver, BC",
  "Surrey, BC",
  "Burnaby, BC",
  "Richmond, BC",
  "Abbotsford, BC",
  "Coquitlam, BC",
  "Kelowna, BC",
  "Langley, BC",
  "Saanich, BC",
  "Delta, BC",
  "Nanaimo, BC",
  "Kamloops, BC",
  "North Vancouver, BC",
  "Victoria, BC",
  "Chilliwack, BC",
  "Maple Ridge, BC",
  "Prince George, BC",
  "New Westminster, BC",

  // Quebec
  "Montreal, QC",
  "Quebec City, QC",
  "Laval, QC",
  "Gatineau, QC",
  "Longueuil, QC",
  "Sherbrooke, QC",
  "Saguenay, QC",
  "Levis, QC",
  "Trois-Rivieres, QC",
  "Terrebonne, QC",

  // Alberta
  "Calgary, AB",
  "Edmonton, AB",
  "Red Deer, AB",
  "Strathcona County, AB",
  "Lethbridge, AB",
  "St. Albert, AB",
  "Medicine Hat, AB",
  "Grande Prairie, AB",

  // Manitoba
  "Winnipeg, MB",
  "Brandon, MB",
  "Steinbach, MB",

  // Saskatchewan
  "Saskatoon, SK",
  "Regina, SK",
  "Prince Albert, SK",
  "Moose Jaw, SK",

  // Atlantic Canada
  "Halifax, NS",
  "Cape Breton, NS",
  "St. John's, NL",
  "Moncton, NB",
  "Saint John, NB",
  "Fredericton, NB",
  "Charlottetown, PE",

  // Major US Tech Hubs
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Denver, CO",
  "Washington, DC",
  "San Jose, CA",
  "Sunnyvale, CA",
  "Palo Alto, CA",
  "Mountain View, CA",
  "Santa Clara, CA",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    if (!q) return NextResponse.json({ results: [] });

    // Enhanced search: matches anywhere in string, prioritizes startsWith
    const results = CITY_LIST.filter((c) => c.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(q);
        const bStarts = b.toLowerCase().startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .slice(0, 10);

    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
