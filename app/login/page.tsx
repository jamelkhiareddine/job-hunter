"use client";
// app/login/page.tsx
import { useState } from "react";
import { login } from "@/app/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const result = await login(fd);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.dot} />
          <span style={styles.badge}>Germany Job Hunter</span>
          <h1 style={styles.title}>Welcome back 👋</h1>
          <p style={styles.subtitle}>Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" required placeholder="you@email.com" style={styles.input} />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" required placeholder="••••••••" style={styles.input} />
          </div>

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #091525 0%, #1a3a6b 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "white",
    borderRadius: 18,
    padding: "36px 40px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#4ade80",
    boxShadow: "0 0 10px #4ade80",
    margin: "0 auto 10px",
  },
  badge: {
    fontSize: 10,
    color: "#64748b",
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    fontFamily: "'DM Mono'",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "#1e3a5f",
    margin: "8px 0 6px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 13,
    margin: 0,
  },
  label: {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    color: "#64748b",
    marginBottom: 5,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    padding: "10px 13px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 13,
    color: "#1e3a5f",
    fontFamily: "'DM Sans'",
    boxSizing: "border-box" as const,
    outline: "none",
  },
  btn: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans'",
    marginTop: 4,
  },
  errorBox: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: 8,
    padding: "10px 13px",
    color: "#be123c",
    fontSize: 12,
    fontWeight: 600,
  },
  footer: {
    textAlign: "center" as const,
    marginTop: 22,
    fontSize: 13,
    color: "#64748b",
  },
};
