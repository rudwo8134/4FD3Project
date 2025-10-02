import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const location = searchParams.get("location") ?? "";
    const limit = searchParams.get("limit") ?? "25";
    const offset = searchParams.get("offset") ?? "0";

    const upstreamUrl = new URL(
      "https://4fd3api.shinsolutions.org/jobs/search"
    );
    if (q) upstreamUrl.searchParams.set("q", q);
    if (location) upstreamUrl.searchParams.set("location", location);
    if (limit) upstreamUrl.searchParams.set("limit", limit);
    if (offset) upstreamUrl.searchParams.set("offset", offset);

    const res = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        accept: "*/*",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error", status: res.status },
        { status: res.status }
      );
    }

    const raw = await res.json();

    // Helpers for robust field extraction and format normalization
    const norm = (k: string) =>
      k
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "_");

    const getField = (obj: any, candidates: string[]) => {
      if (!obj || typeof obj !== "object") return undefined;
      const entries = Object.entries(obj);
      for (const candidate of candidates) {
        const n = norm(candidate);
        for (const [key, val] of entries) {
          if (norm(key) === n) return val;
        }
      }
      return undefined;
    };

    const daysFromRelative = (
      text: string | undefined | null
    ): number | null => {
      if (!text || typeof text !== "string") return null;
      const s = text.toLowerCase();
      if (/(minute|hour)/.test(s)) return 0;
      const dayMatch = s.match(/(\d+)\s*day/);
      if (dayMatch) return Math.max(0, parseInt(dayMatch[1], 10));
      const weekMatch = s.match(/(\d+)\s*week/);
      if (weekMatch) return Math.max(0, parseInt(weekMatch[1], 10) * 7);
      const monthMatch = s.match(/(\d+)\s*month/);
      if (monthMatch) return Math.max(0, parseInt(monthMatch[1], 10) * 30);
      return null;
    };

    // Accept various upstream shapes: {results: [...]}, [...], {data:[...]}, or single object
    const resultsSource = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as any)?.results)
      ? (raw as any).results
      : Array.isArray((raw as any)?.data)
      ? (raw as any).data
      : raw
      ? [raw]
      : [];

    const normalizedResults = resultsSource.map((r: any) => {
      const postedDateStr =
        getField(r, [
          "job_posted_date",
          "jobPostedDate",
          "posted_date",
          "date_posted",
          "timestamp",
        ]) ?? null;
      let daysSincePosted: number | null = null;
      if (postedDateStr) {
        let ts: number = NaN;
        if (typeof postedDateStr === "string") {
          ts = Date.parse(postedDateStr);
        } else if (postedDateStr instanceof Date) {
          ts = postedDateStr.getTime();
        } else {
          ts = Date.parse(String(postedDateStr));
        }
        if (!Number.isNaN(ts)) {
          const diffMs = Date.now() - ts;
          daysSincePosted = Math.max(
            0,
            Math.floor(diffMs / (1000 * 60 * 60 * 24))
          );
        }
      }
      if (daysSincePosted === null) {
        const rel = getField(r, [
          "job_posted_time",
          "jobPostedTime",
          "posted_time",
        ]);
        const relDays = daysFromRelative(rel as string | undefined);
        if (relDays !== null) daysSincePosted = relDays;
      }

      const rawSuitability =
        getField(r, [
          "suitabilityScore",
          "suitability_score",
          "score",
          "Suitability Score",
        ]) ?? 0;
      let suitabilityScore: number = 0;
      if (typeof rawSuitability === "number") {
        suitabilityScore = rawSuitability;
      } else if (typeof rawSuitability === "string") {
        const cleaned = rawSuitability.replace(/[^0-9.]/g, "");
        const parsed = parseFloat(cleaned);
        suitabilityScore = Number.isFinite(parsed) ? parsed : 0;
      }

      const keyPoints =
        getField(r, [
          "key_points_to_mention",
          "key_points",
          "keyPoints",
          "Key Points to Mention in Application",
        ]) ?? null;

      const id =
        (getField(r, ["id", "job_posting_id", "jobPostingId"]) as
          | string
          | undefined) ?? `${Date.now()}-${Math.random()}`;

      return {
        // Core identifiers
        id,
        job_posting_id:
          (getField(r, ["job_posting_id", "jobPostingId"]) as
            | string
            | undefined) ?? id,

        // Titles and company
        job_title:
          (getField(r, ["job_title", "jobTitle", "title"]) as string) ?? "",
        company_name:
          (getField(r, ["company_name", "companyName"]) as string) ?? "",
        company_id:
          (getField(r, ["company_id", "companyId"]) as string | null) ?? null,
        company_url:
          (getField(r, ["company_url", "companyUrl", "company_link"]) as
            | string
            | null) ?? null,

        // Location and type
        job_location:
          (getField(r, [
            "job_location",
            "jobLocation",
            "location",
          ]) as string) ?? "",
        job_employment_type:
          (getField(r, [
            "job_employment_type",
            "jobEmploymentType",
            "employment_type",
          ]) as string) ?? "",
        job_seniority_level:
          (getField(r, [
            "job_seniority_level",
            "jobSeniorityLevel",
            "seniority_level",
          ]) as string) ?? "",

        // Posting timing
        job_posted_time:
          (getField(r, ["job_posted_time", "jobPostedTime"]) as string) ?? "",
        job_posted_date: postedDateStr,
        days_since_posted: r?.days_since_posted ?? daysSincePosted,

        // Content
        job_summary:
          (getField(r, ["job_summary", "jobSummary", "summary"]) as string) ??
          "",
        url: (getField(r, ["url", "job_url", "jobUrl"]) as string) ?? "#",

        // Matching insights
        suitabilityScore,
        score: suitabilityScore, // keep legacy field for UI compatibility
        keyPoints,
        key_points: keyPoints,

        // Additional metadata passthrough
        job_function: (getField(r, ["job_function"]) as string | null) ?? null,
        job_industries:
          (getField(r, ["job_industries"]) as string | null) ?? null,
      };
    });

    return NextResponse.json(
      {
        results: normalizedResults,
        total: raw?.total ?? normalizedResults.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
