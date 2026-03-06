"use client";
import { useState } from "react";
import { Job, STATUS_CONFIG } from "@/lib/data";

interface TrackerTabProps {
  jobs: Job[];
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
  onCoverLetter: (job: Job) => void;
  onGoSearch: () => void;
}

export default function TrackerTab({ jobs, onUpdateStatus, onDelete, onCoverLetter, onGoSearch }: TrackerTabProps) {
  const [filter, setFilter] = useState("All");

  const counts = Object.keys(STATUS_CONFIG).reduce<Record<string, number>>(
    (a, s) => ({ ...a, [s]: jobs.filter(j => j.status === s).length }),
    {}
  );
  const filteredJobs = filter === "All" ? jobs : jobs.filter(j => j.status === filter);

  return (
    <div className="fade-in">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 18 }}>
        {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
          <div
            key={s}
            onClick={() => setFilter(s)}
            style={{
              background: "white", borderRadius: 10, padding: "12px 10px",
              border: `1.5px solid ${counts[s] > 0 ? cfg.color + "55" : "#e2e8f0"}`,
              textAlign: "center", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{counts[s] || 0}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 4, fontWeight: 600 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {["All", ...Object.keys(STATUS_CONFIG)].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "5px 13px", borderRadius: 20, border: "1.5px solid", cursor: "pointer",
              fontSize: 11, fontWeight: 700, transition: "all 0.15s",
              borderColor: filter === s ? (STATUS_CONFIG[s]?.color || "#2563eb") : "#e2e8f0",
              background: filter === s ? (STATUS_CONFIG[s]?.bg || "#eff6ff") : "white",
              color: filter === s ? (STATUS_CONFIG[s]?.color || "#2563eb") : "#64748b",
            }}
          >
            {s} {s === "All" ? `(${jobs.length})` : counts[s] > 0 ? `(${counts[s]})` : ""}
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", background: "white", borderRadius: 12, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>📋</div>
          <p style={{ color: "#64748b", margin: "0 0 14px", fontSize: 14 }}>No jobs tracked yet. Go search and add jobs!</p>
          <button
            onClick={onGoSearch}
            style={{ padding: "9px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12 }}
          >
            🔍 Start Searching
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              style={{
                background: "white", borderRadius: 10, padding: "13px 16px",
                border: "1px solid #e2e8f0", display: "flex", alignItems: "center",
                gap: 12, flexWrap: "wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>{job.title}</span>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 700,
                    background: STATUS_CONFIG[job.status]?.bg,
                    color: STATUS_CONFIG[job.status]?.color,
                  }}>
                    {job.status}
                  </span>
                  {job.source && (
                    <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono'" }}>{job.source}</span>
                  )}
                </div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 3 }}>
                  🏢 {job.company} · 📅 {job.date}
                  {job.url && (
                    <> · <a href={job.url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>View ↗</a></>
                  )}
                </div>
                {job.notes && (
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2, fontStyle: "italic" }}>{job.notes}</div>
                )}
              </div>

              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <select
                  value={job.status}
                  onChange={e => onUpdateStatus(job.id, e.target.value)}
                  style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 11, cursor: "pointer", color: "#1e3a5f", background: "white" }}
                >
                  {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                </select>
                <button
                  onClick={() => onCoverLetter(job)}
                  style={{ padding: "5px 11px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  ✍️ Cover Letter
                </button>
                <button
                  onClick={() => onDelete(job.id)}
                  style={{ padding: "5px 9px", background: "#fff1f2", color: "#ef4444", border: "1px solid #fecdd3", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
