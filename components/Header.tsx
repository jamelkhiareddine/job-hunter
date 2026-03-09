"use client";
// components/Header.tsx
import { PROFILE } from "@/lib/data";

type Tab = "search" | "tracker" | "add" | "recommendations";

interface HeaderProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  jobCount: number;
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({ tab, setTab, jobCount, userEmail, onLogout }: HeaderProps) {
  const tabs: [Tab, string][] = [
    ["search",          "🔍 Search"],
    ["tracker",         `📋 Tracker (${jobCount})`],
    ["add",             "➕ Add Job"],
    ["recommendations", "🎯 Job Fit"],
  ];

  return (
    <header style={{
      background: "linear-gradient(135deg, #091525 0%, #1a3a6b 100%)",
      padding: "18px 28px",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
            <span style={{ color: "#94b8e0", fontSize: 10, fontFamily: "'DM Mono'", letterSpacing: 2, textTransform: "uppercase" }}>
              Germany Job Hunter
            </span>
          </div>
          <h1 style={{ color: "white", margin: 0, fontSize: 19, fontWeight: 700 }}>{PROFILE.name}</h1>
          <p style={{ color: "#60a0d4", margin: "2px 0 0", fontSize: 11 }}>
            {PROFILE.title} · 🇩🇪 Targeting Germany
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <nav style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {tabs.map(([t, label]) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 15px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  transition: "all 0.15s",
                  background: tab === t ? "#2563eb" : "rgba(255,255,255,0.1)",
                  color: tab === t ? "white" : "#94b8e0",
                }}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* User info + logout */}
          {userEmail && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, color: "#60a0d4", fontFamily: "'DM Mono'" }}>
                {userEmail}
              </span>
              <button
                onClick={onLogout}
                style={{
                  padding: "4px 10px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 6,
                  color: "#94b8e0",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans'",
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
