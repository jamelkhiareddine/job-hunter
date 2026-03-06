"use client";
import { useState } from "react";
import { PLATFORMS, STATUS_CONFIG, Job } from "@/lib/data";

interface AddJobTabProps {
  onSave: (job: Omit<Job, "id" | "date">) => void;
  onCancel: () => void;
}

export default function AddJobTab({ onSave, onCancel }: AddJobTabProps) {
  const [form, setForm] = useState({
    title: "", company: "", url: "", description: "",
    status: "Saved", notes: "", source: "LinkedIn",
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: "1.5px solid #e2e8f0", fontSize: 13, boxSizing: "border-box",
    color: "#1e3a5f", background: "white",
  };

  const handleSave = () => {
    if (!form.title || !form.company) return;
    onSave(form);
    setForm({ title: "", company: "", url: "", description: "", status: "Saved", notes: "", source: "LinkedIn" });
  };

  return (
    <div className="fade-in" style={{ maxWidth: 560 }}>
      <div style={{ background: "white", borderRadius: 14, padding: "24px 26px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h2 style={{ margin: "0 0 18px", fontSize: 16, color: "#1e3a5f", fontWeight: 700 }}>➕ Add New Job</h2>

        {([
          { key: "title",   label: "Job Title *",  ph: "e.g. Senior Node.js Developer" },
          { key: "company", label: "Company *",    ph: "e.g. Zalando, N26, Delivery Hero" },
          { key: "url",     label: "Job URL",      ph: "Paste the job listing URL" },
        ] as const).map(f => (
          <div key={f.key} style={{ marginBottom: 13 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</label>
            <input
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.ph}
              style={inputStyle}
            />
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 13 }}>
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Source Platform</label>
            <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
              {Object.values(PLATFORMS).map(p => <option key={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Job Description <span style={{ fontWeight: 400, textTransform: "none", fontSize: 11 }}>(paste for a better AI cover letter)</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Paste key requirements from the job listing..."
            rows={4}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Notes</label>
          <input
            value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="e.g. referral contact, salary mentioned, great team..."
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 9 }}>
          <button
            onClick={handleSave}
            disabled={!form.title || !form.company}
            style={{
              padding: "10px 22px",
              background: form.title && form.company ? "#2563eb" : "#94a3b8",
              color: "white", border: "none", borderRadius: 8,
              cursor: form.title && form.company ? "pointer" : "not-allowed",
              fontWeight: 700, fontSize: 13,
            }}
          >
            Save Job
          </button>
          <button
            onClick={onCancel}
            style={{ padding: "10px 18px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
