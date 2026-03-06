import { NextResponse } from "next/server";

const QUERIES = [
  "Node.js Developer",
  "NestJS Backend Engineer",
  "TypeScript Full-Stack Developer",
  "Senior Software Engineer React",
];

export async function GET() {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey || apiKey === "your_rapidapi_key_here") {
    return NextResponse.json(
      { error: "missing_key", message: "RAPIDAPI_KEY is not set." },
      { status: 500 }
    );
  }

  // Fire all queries in parallel
  const results = await Promise.allSettled(
    QUERIES.map(async (q) => {
      const url = new URL("https://jsearch.p.rapidapi.com/search");
      url.searchParams.set("query", `${q} Germany`);
      url.searchParams.set("page", "1");
      url.searchParams.set("num_pages", "1");
      url.searchParams.set("date_posted", "month");
      url.searchParams.set("country", "DE");

      const res = await fetch(url.toString(), {
        headers: {
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
          "x-rapidapi-key": apiKey,
        },
        cache: "no-store",
      });

      const json = await res.json();
      return (json.data as Record<string, unknown>[]) ?? [];
    })
  );

  // Merge + deduplicate
  const seen = new Set<string>();
  const jobs: Record<string, unknown>[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const j of result.value) {
      const id = String(j.job_id ?? "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      jobs.push({
        id:          j.job_id,
        title:       j.job_title,
        company:     j.employer_name,
        location:    [j.job_city, j.job_state, j.job_country]
                       .filter(Boolean)
                       .join(", "),
        remote:      j.job_is_remote,
        url:         j.job_apply_link,
        description: (j.job_description as string)?.slice(0, 3000) ?? "",
        posted:      j.job_posted_at_datetime_utc,
        source:      j.job_publisher,
        logo:        j.employer_logo,
        salary:      j.job_min_salary
          ? `${j.job_min_salary}–${j.job_max_salary} ${j.job_salary_currency ?? "EUR"}`
          : null,
      });

      if (jobs.length >= 20) break;
    }
    if (jobs.length >= 20) break;
  }

  return NextResponse.json({ jobs });
}
