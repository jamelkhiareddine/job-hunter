"use client";
import { useState, useCallback } from "react";

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  url: string;
  description: string;
  posted: string;
  source: string;
  logo: string | null;
  salary: string | null;
}

const QUICK_SEARCHES = [
  { label: "Node.js Developer",     query: "Node.js Developer",          location: "Germany" },
  { label: "NestJS Engineer",       query: "NestJS Engineer",            location: "Germany" },
  { label: "TypeScript Full-Stack", query: "TypeScript Full-Stack",      location: "Germany" },
  { label: "Backend Node.js",       query: "Backend Node.js Developer",  location: "Berlin" },
  { label: "Senior React Engineer", query: "Senior React Engineer",      location: "Germany" },
  { label: "Microservices Engineer",query: "Microservices Node.js",      location: "Germany" },
];

const DATE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "3days", label: "Last 3 days" },
  { value: "week",  label: "Last week" },
  { value: "month", label: "Last month" },
  { value: "all",   label: "All time" },
];

function timeAgo(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7)  return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function SearchTab({ onAddJob }: { onAddJob: (job: Partial<Record<string, string>>) => void }) {
  const [query, setQuery]         = useState("Node.js Developer");
  const [location, setLocation]   = useState("Germany");
  const [datePosted, setDatePosted] = useState("week");
  const [page, setPage]           = useState(1);
  const [results, setResults]     = useState<JobResult[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [searched, setSearched]   = useState(false);
  const [expanded, setExpanded]   = useState<string | null>(null);

  const search = useCallback(async (q = query, loc = location, dp = datePosted, pg = 1) => {
    setLoading(true);
    setError("");
    setSearched(true);
    setPage(pg);
    try {
      const params = new URLSearchParams({ query: q, location: loc, datePosted: dp, page: String(pg) });
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      if (data.error) {
        setError(data.message || data.error);
        setResults([]);
        return;
      }
      setResults(data.jobs || []);
    } catch {
      setError("Network error — check your connection.");
    } finally {
      setLoading(false);
    }
  }, [query, location, datePosted]);

  const handleQuick = (s: typeof QUICK_SEARCHES[0]) => {
    setQuery(s.query);
    setLocation(s.location);
    search(s.query, s.location, datePosted, 1);
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 13px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    fontSize: 13, color: "#1e3a5f", background: "white", fontFamily: "'DM Sans'",
  };

  return (
    <div className="fade-in">
      {/* Search bar */}
      <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", marginBottom: 16, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 3, minWidth: 180 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Job Title / Keywords</label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="e.g. Node.js Developer, NestJS, TypeScript"
              style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: 2, minWidth: 140 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Location</label>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Germany, Berlin, Munich..."
              style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Posted</label>
            <select
              value={datePosted}
              onChange={e => setDatePosted(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {DATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button
            onClick={() => search()}
            disabled={loading}
            style={{
              padding: "10px 24px", background: loading ? "#94a3b8" : "#2563eb",
              color: "white", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans'", whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Searching..." : "🔍 Search"}
          </button>
        </div>

        {/* Quick searches */}
        <div style={{ marginTop: 14, display: "flex", gap: 7, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center", fontWeight: 600 }}>Quick:</span>
          {QUICK_SEARCHES.map(s => (
            <button
              key={s.label}
              onClick={() => handleQuick(s)}
              style={{
                padding: "4px 12px", borderRadius: 20, border: "1.5px solid #e2e8f0",
                background: "white", color: "#64748b", fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2563eb"; (e.currentTarget as HTMLElement).style.color = "#2563eb"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>


      {/* Error */}
      {error && (
        <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 10, padding: "16px 18px", marginBottom: 14, color: "#be123c", fontSize: 13, lineHeight: 1.7 }}>
          <strong>⚠️ Error:</strong> {error}
          {(error.includes("missing_key") || error.includes("RAPIDAPI_KEY")) && (
            <div style={{ marginTop: 10, background: "white", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#1e3a5f", border: "1px solid #fecdd3" }}>
              <strong>Fix:</strong> Add your RapidAPI key to <code style={{ background: "#fee2e2", padding: "1px 5px", borderRadius: 4 }}>.env.local</code>:
              <pre style={{ margin: "8px 0 0", background: "#f8fafc", padding: "8px 12px", borderRadius: 6, fontSize: 12, overflowX: "auto" }}>RAPIDAPI_KEY=your_key_here</pre>
              Then restart: <code style={{ background: "#fee2e2", padding: "1px 5px", borderRadius: 4 }}>npm run dev</code>
              <br /><br />
              Get a free key (no card) at:{" "}
              <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                rapidapi.com → JSearch → Free plan ↗
              </a>
            </div>
          )}
          {error.includes("exceeded") && (
            <div style={{ marginTop: 8, fontSize: 12 }}>
              You&apos;ve hit the free tier limit (200 calls/month). Upgrade on RapidAPI or wait until next month.
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: "18px 20px", border: "1px solid #e2e8f0", display: "flex", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#f1f5f9", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, background: "#f1f5f9", borderRadius: 4, width: "55%", marginBottom: 8 }} />
                <div style={{ height: 11, background: "#f1f5f9", borderRadius: 4, width: "35%", marginBottom: 8 }} />
                <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, width: "80%" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && searched && results.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "white", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 12 }}>No results found for these filters.</p>
          <p style={{ color: "#94a3b8", fontSize: 12 }}>
            Try: broader keywords · set date to &ldquo;All time&rdquo; · use just &ldquo;Germany&rdquo; as location
          </p>
          <button
            onClick={() => search(query, location, "all", 1)}
            style={{ marginTop: 14, padding: "8px 18px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "'DM Sans'" }}
          >
            Retry with All dates
          </button>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              <strong style={{ color: "#1e3a5f" }}>{results.length}</strong> jobs found for <strong style={{ color: "#1e3a5f" }}>{query}</strong> in <strong style={{ color: "#1e3a5f" }}>{location}</strong>
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              {page > 1 && (
                <button onClick={() => search(query, location, datePosted, page - 1)}
                  style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 12, color: "#64748b", fontFamily: "'DM Sans'" }}>
                  ← Prev
                </button>
              )}
              <button onClick={() => search(query, location, datePosted, page + 1)}
                style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 12, color: "#64748b", fontFamily: "'DM Sans'" }}>
                Next →
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.map(job => (
              <div key={job.id} style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.09)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"}>

                {/* Job header */}
                <div style={{ padding: "15px 18px", display: "flex", alignItems: "flex-start", gap: 13 }}>
                  {/* Logo */}
                  <div style={{ width: 44, height: 44, borderRadius: 8, border: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {job.logo
                      ? <img src={job.logo} alt={job.company} style={{ width: 36, height: 36, objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <span style={{ fontSize: 18 }}>🏢</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{job.title}</h3>
                        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>
                          {job.company}
                          {job.location && <> · 📍 {job.location}</>}
                          {job.remote && <span style={{ marginLeft: 7, fontSize: 10, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 6, padding: "1px 7px", fontWeight: 700 }}>Remote</span>}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                        {job.posted && <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono'" }}>{timeAgo(job.posted)}</span>}
                        {job.salary && <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>💰 {job.salary}</span>}
                        {job.source && <span style={{ fontSize: 10, color: "#94a3b8" }}>via {job.source}</span>}
                      </div>
                    </div>

                    {/* Description preview */}
                    {job.description && (
                      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.6,
                        display: expanded === job.id ? "block" : "-webkit-box",
                        WebkitLineClamp: expanded === job.id ? undefined : 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: expanded === job.id ? "visible" : "hidden",
                        whiteSpace: expanded === job.id ? "pre-wrap" : undefined,
                      }}>
                        {job.description.slice(0, expanded === job.id ? 1200 : 300)}
                        {job.description.length > 300 && expanded !== job.id && "..."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: "10px 18px", borderTop: "1px solid #f1f5f9", background: "#fafbfc", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    onClick={() => onAddJob({
                      title: job.title,
                      company: job.company,
                      url: job.url,
                      description: job.description?.slice(0, 1000),
                      source: job.source || "JSearch",
                      status: "Saved",
                    })}
                    style={{ padding: "6px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans'" }}
                  >
                    + Save to Tracker
                  </button>
                  {job.url && (
                    <a href={job.url} target="_blank" rel="noreferrer"
                      style={{ padding: "6px 14px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 7, textDecoration: "none", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans'" }}>
                      Apply ↗
                    </a>
                  )}
                  <button
                    onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                    style={{ padding: "6px 12px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans'" }}
                  >
                    {expanded === job.id ? "Show less ▲" : "Read more ▼"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination bottom */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {page > 1 && (
              <button onClick={() => search(query, location, datePosted, page - 1)}
                style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b", fontFamily: "'DM Sans'" }}>
                ← Previous
              </button>
            )}
            <button onClick={() => search(query, location, datePosted, page + 1)}
              style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b", fontFamily: "'DM Sans'" }}>
              Next page →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
