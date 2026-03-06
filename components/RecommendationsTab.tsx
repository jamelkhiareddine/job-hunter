"use client";
import { useState, useEffect, useCallback } from "react";
import { RECOMMENDATIONS, Recommendation, scoreJob, PROFILE } from "@/lib/data";

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface FetchedJob {
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

interface ScoredJob extends FetchedJob {
  score: number;
  matched: string[];
}

/* ─── Score colours ─────────────────────────────────────────────────────────── */
function scoreColor(s: number) {
  if (s >= 75) return { text: "#10b981", bg: "#d1fae5", ring: "#10b981" };
  if (s >= 50) return { text: "#f59e0b", bg: "#fef3c7", ring: "#f59e0b" };
  return       { text: "#6366f1", bg: "#eef2ff", ring: "#6366f1" };
}

/* ─── Mini score ring ───────────────────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const c = scoreColor(score);
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
      <svg width={60} height={60} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={30} cy={30} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5} />
        <circle
          cx={30} cy={30} r={r} fill="none"
          stroke={c.ring} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: c.text, lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: 8, color: "#94a3b8", fontFamily: "'DM Mono'", letterSpacing: 0.5 }}>fit</span>
      </div>
    </div>
  );
}

/* ─── Job fit card ──────────────────────────────────────────────────────────── */
function JobFitCard({ job, onSave }: { job: ScoredJob; onSave: (j: ScoredJob) => void }) {
  const c = scoreColor(job.score);
  const label = job.score >= 75 ? "Great fit" : job.score >= 50 ? "Good fit" : "Partial fit";

  return (
    <div style={{
      background: "white", borderRadius: 14,
      border: `1.5px solid ${c.ring}22`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.12)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      {/* Top accent */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${c.ring}, ${c.ring}55)` }} />

      <div style={{ padding: "16px 18px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 12 }}>
          {/* Logo / fallback */}
          <div style={{
            width: 40, height: 40, borderRadius: 8, flexShrink: 0,
            background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", border: "1px solid #e2e8f0",
          }}>
            {job.logo
              ? <img src={job.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              : <span style={{ fontSize: 18 }}>🏢</span>
            }
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 2, lineHeight: 1.3 }}>{job.title}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>
              <strong style={{ color: "#334155" }}>{job.company}</strong>
              {job.location && <span> · {job.location}</span>}
              {job.remote && <span style={{ color: "#10b981", marginLeft: 6, fontWeight: 700 }}>Remote</span>}
            </div>
            {job.salary && (
              <div style={{ fontSize: 11, color: "#0ea5e9", marginTop: 3, fontWeight: 600 }}>💰 {job.salary}</div>
            )}
          </div>

          <ScoreRing score={job.score} />
        </div>

        {/* Fit label */}
        <div style={{ marginBottom: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
            color: c.text, background: c.bg, padding: "2px 8px", borderRadius: 20,
            letterSpacing: 0.5,
          }}>{label}</span>
        </div>

        {/* Matched skills */}
        {job.matched.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
            {job.matched.slice(0, 8).map(skill => (
              <span key={skill} style={{
                fontSize: 10, fontWeight: 700,
                background: "#dbeafe", color: "#1d4ed8",
                padding: "2px 8px", borderRadius: 20,
              }}>{skill}</span>
            ))}
            {job.matched.length > 8 && (
              <span style={{ fontSize: 10, color: "#94a3b8", padding: "2px 4px" }}>+{job.matched.length - 8} more</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={job.url} target="_blank" rel="noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: "#1e3a5f", color: "white",
              padding: "8px 14px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={e => (e.currentTarget.style.background = "#1e3a5f")}
          >
            Apply ↗
          </a>
          <button
            onClick={() => onSave(job)}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              background: "white", color: "#1e3a5f",
              border: "1.5px solid #cbd5e1",
              padding: "8px 14px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563eb"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "white"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#cbd5e1"; }}
          >
            📋 Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton card ─────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{
      background: "white", borderRadius: 14, border: "1.5px solid #e2e8f0",
      padding: 18, animation: "pulse 1.5s ease-in-out infinite",
    }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f1f5f9" }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, background: "#f1f5f9", borderRadius: 6, marginBottom: 8, width: "60%" }} />
          <div style={{ height: 11, background: "#f1f5f9", borderRadius: 6, width: "40%" }} />
        </div>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#f1f5f9" }} />
      </div>
      <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, width: "30%", marginBottom: 10 }} />
      <div style={{ display: "flex", gap: 5 }}>
        {[60, 70, 50].map(w => (
          <div key={w} style={{ height: 20, background: "#f1f5f9", borderRadius: 20, width: w }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Recommendation card (unchanged logic, inline) ────────────────────────── */
function RecommendationCard({ rec, open, onToggle }: { rec: Recommendation; open: boolean; onToggle: () => void }) {
  const PREVIEW_LENGTH = 180;
  const isLong = rec.text.length > PREVIEW_LENGTH;
  const displayText = open || !isLong ? rec.text : rec.text.slice(0, PREVIEW_LENGTH) + "…";

  return (
    <div style={{
      background: "white", borderRadius: 12, border: "1px solid #e2e8f0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden",
    }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${rec.avatarColor}, ${rec.avatarColor}88)` }} />
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: "50%", background: rec.avatarColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 15, flexShrink: 0,
            boxShadow: `0 0 0 3px ${rec.avatarColor}33`,
          }}>{rec.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>{rec.author}</span>
              {rec.linkedin && (
                <a href={rec.linkedin} target="_blank" rel="noreferrer"
                  style={{ color: "#0a66c2", fontSize: 11, fontWeight: 700, textDecoration: "none", background: "#e8f0fb", padding: "2px 7px", borderRadius: 6 }}>
                  LinkedIn ↗
                </a>
              )}
            </div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
              {rec.role} · <strong style={{ color: "#1e3a5f" }}>{rec.company}</strong>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono'", marginBottom: 4 }}>{rec.date}</div>
            <div style={{ fontSize: 10, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{rec.relation}</div>
          </div>
        </div>
        <div style={{ position: "relative", background: "#f8fafc", borderLeft: `3px solid ${rec.avatarColor}`, borderRadius: "0 8px 8px 0", padding: "12px 16px" }}>
          <span style={{ position: "absolute", top: -6, left: 10, fontSize: 36, color: rec.avatarColor, opacity: 0.2, fontFamily: "Georgia, serif", lineHeight: 1 }}>"</span>
          <p style={{ margin: 0, color: "#334155", fontSize: 13, lineHeight: 1.7, fontStyle: "italic" }}>{displayText}</p>
          {isLong && (
            <button onClick={onToggle}
              style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", color: rec.avatarColor, fontSize: 12, fontWeight: 700, padding: 0 }}>
              {open ? "▲ Show less" : "▼ Read more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export default function RecommendationsTab({
  onSaveJob,
}: {
  onSaveJob?: (job: { title: string; company: string; url: string; description: string; source: string }) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [jobs, setJobs]         = useState<ScoredJob[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchAndScore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/recommendations");
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.message ?? "Failed to load job recommendations.");
        return;
      }

      const scored: ScoredJob[] = (data.jobs as FetchedJob[])
        .map(j => ({ ...j, ...scoreJob(j.title, j.description) }))
        .sort((a, b) => b.score - a.score);

      setJobs(scored);
    } catch {
      setError("Network error – check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAndScore(); }, [fetchAndScore]);

  return (
    <div className="fade-in">
      {/* ── Job Fit Section ───────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #091525 0%, #1a3a6b 100%)",
        borderRadius: 14, padding: "22px 28px", marginBottom: 22,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ color: "#94b8e0", fontSize: 11, fontFamily: "'DM Mono'", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>
            AI-Powered Ranking
          </div>
          <h2 style={{ color: "white", margin: 0, fontSize: 20, fontWeight: 700 }}>🎯 Jobs That Fit You</h2>
          <p style={{ color: "#60a0d4", margin: "4px 0 0", fontSize: 12 }}>
            Live jobs scored against <strong style={{ color: "#94b8e0" }}>{PROFILE.name.split(" ")[0]}</strong>'s profile · {PROFILE.skills.split(",").length} skills matched
          </p>
        </div>
        <button
          onClick={fetchAndScore}
          disabled={loading}
          style={{
            background: loading ? "rgba(255,255,255,0.1)" : "#2563eb",
            color: "white", border: "none", borderRadius: 8,
            padding: "9px 16px", fontSize: 12, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {loading ? "⏳ Loading…" : "🔄 Refresh"}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: "#fef2f2", border: "1.5px solid #fecaca",
          borderRadius: 12, padding: "14px 18px", marginBottom: 20,
          color: "#dc2626", fontSize: 13, fontWeight: 600,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 32 }}>
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Job cards grid */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>
              {jobs.length} jobs ranked by match score
            </span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>— Best matches first</span>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 14, marginBottom: 36,
          }}>
            {jobs.map(job => (
              <JobFitCard
                key={job.id}
                job={job}
                onSave={j => onSaveJob?.({
                  title:       j.title,
                  company:     j.company,
                  url:         j.url,
                  description: j.description,
                  source:      j.source ?? "JSearch",
                })}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0 48px", fontSize: 14 }}>
          No jobs found. Try refreshing.
        </div>
      )}

      {/* ── Professional Endorsements Section ────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #091525 0%, #1a3a6b 100%)",
        borderRadius: 14, padding: "22px 28px", marginBottom: 22,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ color: "#94b8e0", fontSize: 11, fontFamily: "'DM Mono'", letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>
            Professional Endorsements
          </div>
          <h2 style={{ color: "white", margin: 0, fontSize: 20, fontWeight: 700 }}>What Colleagues Say 💬</h2>
          <p style={{ color: "#60a0d4", margin: "4px 0 0", fontSize: 12 }}>
            {RECOMMENDATIONS.length} recommendations from past collaborators
          </p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#fbbf24", fontSize: 22 }}>{s}</span>)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {RECOMMENDATIONS.map(rec => (
          <RecommendationCard
            key={rec.id} rec={rec}
            open={expanded === rec.id}
            onToggle={() => setExpanded(expanded === rec.id ? null : rec.id)}
          />
        ))}
      </div>

      <div style={{
        marginTop: 22, padding: "16px 22px",
        background: "#eff6ff", border: "1.5px dashed #bfdbfe",
        borderRadius: 12, textAlign: "center",
      }}>
        <p style={{ margin: 0, color: "#1e3a5f", fontSize: 13, fontWeight: 600 }}>🔗 Want to add a new recommendation?</p>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 12 }}>
          Update the <code style={{ background: "#dbeafe", padding: "1px 5px", borderRadius: 4, fontSize: 11 }}>RECOMMENDATIONS</code> array in{" "}
          <code style={{ background: "#dbeafe", padding: "1px 5px", borderRadius: 4, fontSize: 11 }}>lib/data.ts</code>
        </p>
      </div>
    </div>
  );
}
