"use client";
import { useState, useEffect } from "react";
import { Job } from "@/lib/data";

interface CoverLetterModalProps {
  job: Job | null;
  onClose: () => void;
}

async function fetchLetter(job: Job): Promise<string> {
  const res = await fetch("/api/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job }),
  });
  const data = await res.json();
  return data.letter || "Error generating cover letter.";
}

export default function CoverLetterModal({ job, onClose }: CoverLetterModalProps) {
  const [letter, setLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!job) return;
    setGenerating(true);
    fetchLetter(job)
      .then(setLetter)
      .catch(() => setLetter("Error generating cover letter."))
      .finally(() => setGenerating(false));
  }, [job]);

  const regenerate = () => {
    if (!job) return;
    setGenerating(true);
    fetchLetter(job)
      .then(setLetter)
      .catch(() => setLetter("Error generating cover letter."))
      .finally(() => setGenerating(false));
  };

  const copy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!job) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 660, maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.3)", animation: "fadeIn 0.2s ease" }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "#fafbfc" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, color: "#1e3a5f", fontWeight: 700 }}>✍️ Cover Letter</h3>
            <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: 12 }}>
              {job.title} at <strong>{job.company}</strong>
              <span style={{ marginLeft: 8, fontSize: 10, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 6, padding: "1px 7px", fontWeight: 600 }}>
                ✓ No API key needed
              </span>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, fontSize: 15, cursor: "pointer", color: "#64748b", padding: "4px 9px", fontWeight: 800 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
          {generating ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "#64748b" }}>
              <div style={{ width: 32, height: 32, border: "3px solid #bfdbfe", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 0.7s linear infinite", marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: 13 }}>Generating your cover letter...</p>
            </div>
          ) : (
            <>
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "9px 13px", marginBottom: 12, fontSize: 12, color: "#92400e" }}>
                💡 This letter is auto-generated from your profile + the job details you entered. Edit it freely before sending.
              </div>
              <textarea
                value={letter}
                onChange={e => setLetter(e.target.value)}
                style={{ width: "100%", minHeight: 320, padding: "13px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, lineHeight: 1.8, fontFamily: "'DM Sans'", resize: "vertical", boxSizing: "border-box", color: "#1e3a5f", outline: "none" }}
              />
            </>
          )}
        </div>

        {/* Footer */}
        {!generating && letter && (
          <div style={{ padding: "13px 20px", borderTop: "1px solid #e2e8f0", display: "flex", gap: 8, flexWrap: "wrap", background: "#fafbfc" }}>
            <button
              onClick={copy}
              style={{ padding: "8px 18px", background: copied ? "#10b981" : "#2563eb", color: "white", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 700, fontSize: 12, transition: "background 0.2s" }}
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
            <button
              onClick={regenerate}
              style={{ padding: "8px 14px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 600, fontSize: 12 }}
            >
              🔄 New Variant
            </button>
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                style={{ padding: "8px 14px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 7, textDecoration: "none", fontWeight: 700, fontSize: 12 }}
              >
                Apply Now ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
