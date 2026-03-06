"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchTab from "@/components/SearchTab";
import TrackerTab from "@/components/TrackerTab";
import AddJobTab from "@/components/AddJobTab";
import CoverLetterModal from "@/components/CoverLetterModal";
import RecommendationsTab from "@/components/RecommendationsTab";
import { Job } from "@/lib/data";

type Tab = "search" | "tracker" | "add" | "recommendations";
const STORAGE_KEY = "mj_jobs_v2";

export default function Home() {
  const [tab, setTab]           = useState<Tab>("search");
  const [jobs, setJobs]         = useState<Job[]>([]);
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [toast, setToast]       = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setJobs(JSON.parse(saved));
    } catch {}
  }, []);

  const persist = (updated: Job[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const addJob = (jobData: Omit<Job, "id" | "date">) => {
    // Prevent duplicate
    if (jobs.some(j => j.title === jobData.title && j.company === jobData.company)) {
      showToast("⚠️ Already in tracker");
      return;
    }
    const updated = [
      ...jobs,
      { ...jobData, id: Date.now(), date: new Date().toLocaleDateString("de-DE") },
    ];
    setJobs(updated);
    persist(updated);
    showToast("✓ Saved to tracker!");
  };

  const addJobAndSwitch = (jobData: Omit<Job, "id" | "date">) => {
    addJob(jobData);
    setTab("tracker");
  };

  const updateStatus = (id: number, status: string) => {
    const updated = jobs.map(j => j.id === id ? { ...j, status } : j);
    setJobs(updated); persist(updated);
  };

  const deleteJob = (id: number) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated); persist(updated);
    if (modalJob?.id === id) setModalJob(null);
  };

  return (
    <>
      <Header tab={tab} setTab={setTab} jobCount={jobs.length} />

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "22px 18px" }}>
        {tab === "search" && (
          <SearchTab
            onAddJob={(partial) => addJob({
              title:       partial.title || "",
              company:     partial.company || "",
              url:         partial.url || "",
              description: partial.description || "",
              source:      partial.source || "JSearch",
              status:      "Saved",
              notes:       "",
            })}
          />
        )}
        {tab === "tracker" && (
          <TrackerTab
            jobs={jobs}
            onUpdateStatus={updateStatus}
            onDelete={deleteJob}
            onCoverLetter={setModalJob}
            onGoSearch={() => setTab("search")}
          />
        )}
        {tab === "add" && (
          <AddJobTab
            onSave={addJobAndSwitch}
            onCancel={() => setTab("tracker")}
          />
        )}
        {tab === "recommendations" && (
          <RecommendationsTab
            onSaveJob={(partial) => addJob({
              title:       partial.title,
              company:     partial.company,
              url:         partial.url,
              description: partial.description,
              source:      partial.source ?? "JSearch",
              status:      "Saved",
              notes:       "",
            })}
          />
        )}
      </main>

      <CoverLetterModal job={modalJob} onClose={() => setModalJob(null)} />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1e3a5f", color: "white", padding: "10px 22px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.2s ease", zIndex: 2000, whiteSpace: "nowrap",
          fontFamily: "'DM Sans'",
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
