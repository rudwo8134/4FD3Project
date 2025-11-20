import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Forward the request to the upstream API
    const upstreamRes = await fetch(
      "https://4fd3api.shinsolutions.org/jobs/apply",
      {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type header when using FormData,
          // fetch will set it automatically with the correct boundary
          accept: "*/*",
        },
      }
    );

    if (!upstreamRes.ok) {
      const errorText = await upstreamRes.text();
      return NextResponse.json(
        {
          error: `Upstream API failed: ${upstreamRes.status}`,
          details: errorText,
        },
        { status: upstreamRes.status }
      );
    }

    const data = await upstreamRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in apply route:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
