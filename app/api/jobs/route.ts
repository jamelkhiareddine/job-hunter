import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "Node.js Developer";
  const location = searchParams.get("location") || "Germany";
  const page = searchParams.get("page") || "1";
  const datePosted = searchParams.get("datePosted") || "all";

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey || apiKey === "your_rapidapi_key_here") {
    return NextResponse.json({
      error: "missing_key",
      message: "RAPIDAPI_KEY is not set. Add it to .env.local and restart.",
    }, { status: 500 });
  }

  const url = new URL("https://jsearch.p.rapidapi.com/search");
  url.searchParams.set("query", `${query} ${location}`);
  url.searchParams.set("page", page);
  url.searchParams.set("num_pages", "1");
  url.searchParams.set("date_posted", datePosted);
  url.searchParams.set("country", "DE");

  let raw: Record<string, unknown>;
  try {
    const response = await fetch(url.toString(), {
      headers: {
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      cache: "no-store",
    });

    const text = await response.text();

    // Try parse JSON
    try {
      raw = JSON.parse(text);
    } catch {
      return NextResponse.json({
        error: "parse_error",
        message: `API returned non-JSON: ${text.slice(0, 200)}`,
      }, { status: 500 });
    }

    // RapidAPI quota / auth errors come back as 200 with a message field
    if (!response.ok || raw.message) {
      return NextResponse.json({
        error: "api_error",
        message: (raw.message as string) || `HTTP ${response.status}`,
        status: response.status,
      }, { status: 400 });
    }

  } catch (err) {
    return NextResponse.json({
      error: "network_error",
      message: String(err),
    }, { status: 500 });
  }

  const data = (raw.data as Record<string, unknown>[]) || [];

  if (data.length === 0) {
    // Return the raw response so the frontend can show a useful message
    return NextResponse.json({
      jobs: [],
      total: 0,
      debug: {
        query: url.searchParams.get("query"),
        status: raw.status,
        requestId: raw.requestId,
      },
    });
  }

  const jobs = data.map((j) => ({
    id: j.job_id,
    title: j.job_title,
    company: j.employer_name,
    location: [j.job_city, j.job_state, j.job_country].filter(Boolean).join(", "),
    remote: j.job_is_remote,
    url: j.job_apply_link,
    description: (j.job_description as string)?.slice(0, 2000),
    posted: j.job_posted_at_datetime_utc,
    source: j.job_publisher,
    logo: j.employer_logo,
    salary: j.job_min_salary
      ? `${j.job_min_salary}–${j.job_max_salary} ${j.job_salary_currency || "EUR"}`
      : null,
  }));

  return NextResponse.json({ jobs, total: jobs.length });
}
