import type { ZodType } from "zod";
import { supabase } from "./supabase";

export async function fetchApi<T>(path: string, schema: ZodType<T>): Promise<T> {
  // /profile
  if (path === "/profile") {
    const { data, error } = await supabase.from("Profile").select("*").eq("id", 1).single();
    if (error) throw new Error(`Gagal memuat profile: ${error.message}`);
    return schema.parse(data);
  }

  // /skills
  if (path === "/skills") {
    const { data, error } = await supabase
      .from("Skill")
      .select("*")
      .order("order", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw new Error(`Gagal memuat skills: ${error.message}`);
    return schema.parse(data ?? []);
  }

  // /projects?type=...
  if (path.startsWith("/projects?type=")) {
    const type = path.split("type=")[1];
    const { data, error } = await supabase
      .from("Project")
      .select("*")
      .eq("type", type)
      .eq("status", "PUBLISHED")
      .order("order", { ascending: true })
      .order("id", { ascending: true });
    if (error) throw new Error(`Gagal memuat projects: ${error.message}`);
    return schema.parse(data ?? []);
  }

  throw new Error(`Path tidak dikenal: ${path}`);
}