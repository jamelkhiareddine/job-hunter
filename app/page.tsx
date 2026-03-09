"use client";
// app/page.tsx
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import SearchTab from "@/components/SearchTab";
import TrackerTab from "@/components/TrackerTab";
import AddJobTab from "@/components/AddJobTab";
import CoverLetterModal from "@/components/CoverLetterModal";
import RecommendationsTab from "@/components/RecommendationsTab";
import { createClient } from "../lib/supabase/client";
import { logout } from "./actions/auth";
import { getJobs, addJob as addJobAction, updateJobStatus, deleteJob as deleteJobAction } from "./actions/jobs";
import { Job } from "@/lib/data";

type Tab = "search" | "tracker" | "add" | "recommendations";

export default function Home() {
  const [tab, setTab]           = useState<Tab>("search");
  const [jobs, setJobs]         = useState<Job[]>([]);
  const [modalJob, setModalJob] = useState<Job | null>(null);
  const [toast, setToast]       = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Load user email
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? "");
    });
  }, []);

  // Load jobs from DB
  const loadJobs = useCallback(async () => {
    const data = await getJobs();
    setJobs(data);
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const addJob = async (jobData: Omit<Job, "id">) => {
    if (jobs.some(j => j.title === jobData.title && j.company === jobData.company)) {
      showToast("⚠️ Already in tracker");
      return;
    }
    const result = await addJobAction(jobData);
    if (result?.error) { showToast("❌ " + result.error); return; }
    showToast("✓ Saved to tracker!");
    loadJobs();
  };

  const addJobAndSwitch = async (jobData: Omit<Job, "id">) => {
    await addJob(jobData);
    setTab("tracker");
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    await updateJobStatus(id, status);
    loadJobs();
  };

  const handleDeleteJob = async (id: number) => {
    await deleteJobAction(id);
    if (modalJob?.id === id) setModalJob(null);
    loadJobs();
  };

  return (
    <>
      <Header tab={tab} setTab={setTab} jobCount={jobs.length} userEmail={userEmail} onLogout={logout} />

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
              date:        new Date().toLocaleDateString("de-DE"),
            })}
          />
        )}
        {tab === "tracker" && (
          <TrackerTab
            jobs={jobs}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteJob}
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
              date:        new Date().toLocaleDateString("de-DE"),
            })}
          />
        )}
      </main>

      <CoverLetterModal job={modalJob} onClose={() => setModalJob(null)} />

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
