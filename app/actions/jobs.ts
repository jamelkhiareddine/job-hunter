// app/actions/jobs.ts
"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";
import { Job } from "@/lib/data";

/** Fetch all jobs for the signed-in user */
export async function getJobs(): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error(error); return []; }
  return (data ?? []) as Job[];
}

/** Add a new job */
export async function addJob(job: Omit<Job, "id">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("jobs").insert({
    ...job,
    user_id: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

/** Update a job's status */
export async function updateJobStatus(id: number, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

/** Delete a job */
export async function deleteJob(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}
