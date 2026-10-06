import { supabase } from "./supabase";

export type ApiIssue = { path: string; message: string };

export class ApiError extends Error {
  status: number;
  issues?: ApiIssue[];

  constructor(status: number, message: string, issues?: ApiIssue[]) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

function handleSupabaseError(error: { message: string; code?: string } | null) {
  if (!error) return;
  if (error.code === "23505") {
    throw new ApiError(409, "Slug sudah dipakai atau data duplikat");
  }
  throw new ApiError(400, error.message);
}

// Router adapter to mimic previous REST API directly over Supabase client
export const api = {
  get: async <T>(path: string): Promise<T> => {
    // GET /api/admin/profile
    if (path === "/api/admin/profile") {
      const { data, error } = await supabase.from("Profile").select("*").eq("id", 1).single();
      handleSupabaseError(error);
      return data as T;
    }

    // GET /api/admin/skills
    if (path === "/api/admin/skills") {
      const { data, error } = await supabase
        .from("Skill")
        .select("*")
        .order("order", { ascending: true })
        .order("id", { ascending: true });
      handleSupabaseError(error);
      return (data ?? []) as T;
    }

    // GET /api/admin/teaching-tools
    if (path === "/api/admin/teaching-tools") {
      const { data, error } = await supabase
        .from("TeachingTool")
        .select("*")
        .order("order", { ascending: true })
        .order("id", { ascending: true });
      handleSupabaseError(error);
      return (data ?? []) as T;
    }

    // GET /api/admin/projects?type=...
    if (path.startsWith("/api/admin/projects?")) {
      const url = new URL(`http://dummy${path}`);
      const type = url.searchParams.get("type");
      let query = supabase.from("Project").select("*");
      if (type) {
        query = query.eq("type", type);
      }
      const { data, error } = await query
        .order("order", { ascending: true })
        .order("id", { ascending: true });
      handleSupabaseError(error);
      return (data ?? []) as T;
    }

    // GET /api/admin/projects/:id
    const projectMatch = path.match(/^\/api\/admin\/projects\/(\d+)$/);
    if (projectMatch) {
      const id = Number(projectMatch[1]);
      const { data, error } = await supabase.from("Project").select("*").eq("id", id).single();
      handleSupabaseError(error);
      return data as T;
    }

    // GET /api/admin/messages
    if (path === "/api/admin/messages") {
      const { data, error } = await supabase
        .from("ContactMessage")
        .select("*")
        .order("createdAt", { ascending: false });
      handleSupabaseError(error);
      return (data ?? []) as T;
    }

    throw new ApiError(404, `Endpoint tidak ditemukan: ${path}`);
  },

  post: async <T>(path: string, body?: unknown): Promise<T> => {
    // POST /api/admin/skills
    if (path === "/api/admin/skills") {
      const { data, error } = await supabase.from("Skill").insert(body as object).select().single();
      handleSupabaseError(error);
      return data as T;
    }

    // POST /api/admin/teaching-tools
    if (path === "/api/admin/teaching-tools") {
      const { data, error } = await supabase.from("TeachingTool").insert(body as object).select().single();
      handleSupabaseError(error);
      return data as T;
    }

    // POST /api/admin/projects
    if (path === "/api/admin/projects") {
      const { data, error } = await supabase.from("Project").insert(body as object).select().single();
      handleSupabaseError(error);
      return data as T;
    }

    throw new ApiError(404, `Endpoint tidak ditemukan: ${path}`);
  },

  put: async <T>(path: string, body?: unknown): Promise<T> => {
    // PUT /api/admin/profile
    if (path === "/api/admin/profile") {
      const { data, error } = await supabase
        .from("Profile")
        .upsert({ id: 1, ...(body as object) })
        .select()
        .single();
      handleSupabaseError(error);
      return data as T;
    }

    // PUT /api/admin/skills/:id
    const skillMatch = path.match(/^\/api\/admin\/skills\/(\d+)$/);
    if (skillMatch) {
      const id = Number(skillMatch[1]);
      const { data, error } = await supabase.from("Skill").update(body as object).eq("id", id).select().single();
      handleSupabaseError(error);
      return data as T;
    }

    // PUT /api/admin/teaching-tools/:id
    const toolMatch = path.match(/^\/api\/admin\/teaching-tools\/(\d+)$/);
    if (toolMatch) {
      const id = Number(toolMatch[1]);
      const { data, error } = await supabase.from("TeachingTool").update(body as object).eq("id", id).select().single();
      handleSupabaseError(error);
      return data as T;
    }

    // PUT /api/admin/projects/:id
    const projectMatch = path.match(/^\/api\/admin\/projects\/(\d+)$/);
    if (projectMatch) {
      const id = Number(projectMatch[1]);
      const { data, error } = await supabase.from("Project").update(body as object).eq("id", id).select().single();
      handleSupabaseError(error);
      return data as T;
    }

    throw new ApiError(404, `Endpoint tidak ditemukan: ${path}`);
  },

  patch: async <T>(path: string, body?: unknown): Promise<T> => {
    // PATCH /api/admin/messages/:id
    const msgMatch = path.match(/^\/api\/admin\/messages\/(\d+)$/);
    if (msgMatch) {
      const id = Number(msgMatch[1]);
      const { data, error } = await supabase.from("ContactMessage").update(body as object).eq("id", id).select().single();
      handleSupabaseError(error);
      return data as T;
    }

    throw new ApiError(404, `Endpoint tidak ditemukan: ${path}`);
  },

  delete: async <T>(path: string): Promise<T> => {
    // DELETE /api/admin/skills/:id
    const skillMatch = path.match(/^\/api\/admin\/skills\/(\d+)$/);
    if (skillMatch) {
      const id = Number(skillMatch[1]);
      const { error } = await supabase.from("Skill").delete().eq("id", id);
      handleSupabaseError(error);
      return undefined as T;
    }

    // DELETE /api/admin/teaching-tools/:id
    const toolMatch = path.match(/^\/api\/admin\/teaching-tools\/(\d+)$/);
    if (toolMatch) {
      const id = Number(toolMatch[1]);
      const { error } = await supabase.from("TeachingTool").delete().eq("id", id);
      handleSupabaseError(error);
      return undefined as T;
    }

    // DELETE /api/admin/projects/:id
    const projectMatch = path.match(/^\/api\/admin\/projects\/(\d+)$/);
    if (projectMatch) {
      const id = Number(projectMatch[1]);
      const { error } = await supabase.from("Project").delete().eq("id", id);
      handleSupabaseError(error);
      return undefined as T;
    }

    // DELETE /api/admin/messages/:id
    const msgMatch = path.match(/^\/api\/admin\/messages\/(\d+)$/);
    if (msgMatch) {
      const id = Number(msgMatch[1]);
      const { error } = await supabase.from("ContactMessage").delete().eq("id", id);
      handleSupabaseError(error);
      return undefined as T;
    }

    throw new ApiError(404, `Endpoint tidak ditemukan: ${path}`);
  },

  upload: async <T>(path: string, form: FormData): Promise<T> => {
    const url = new URL(`http://dummy${path}`);
    const folder = url.searchParams.get("folder") ?? "uploads";
    const file = form.get("image") as File;
    if (!file) {
      throw new ApiError(400, "File gambar tidak ditemukan");
    }

    const ext = file.name.split(".").pop() || "png";
    const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

    const { error: uploadError } = await supabase.storage.from("portfolio").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      throw new ApiError(500, `Gagal upload gambar: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from("portfolio").getPublicUrl(fileName);

    return {
      url: data.publicUrl,
      publicId: fileName,
      width: 0,
      height: 0,
    } as T;
  },
};