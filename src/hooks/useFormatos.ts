import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProjectContext } from "@/contexts/ProjectContext";

export interface Formato {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
}

export function useFormatos() {
  const { currentProject } = useProjectContext();
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!currentProject) return;
    setLoading(true);
    const { data } = await supabase
      .from("formatos")
      .select("*")
      .eq("project_id", currentProject.id)
      .order("created_at", { ascending: false });
    setFormatos(data ?? []);
    setLoading(false);
  }, [currentProject]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (name: string) => {
    if (!currentProject) return;
    const { data, error } = await supabase
      .from("formatos")
      .insert({ name, project_id: currentProject.id })
      .select()
      .single();
    if (!error && data) setFormatos((prev) => [data, ...prev]);
    return { data, error };
  };

  const update = async (id: string, name: string) => {
    const { data, error } = await supabase
      .from("formatos")
      .update({ name })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) setFormatos((prev) => prev.map((f) => (f.id === id ? data : f)));
    return { data, error };
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("formatos").delete().eq("id", id);
    if (!error) setFormatos((prev) => prev.filter((f) => f.id !== id));
    return { error };
  };

  return { formatos, loading, add, update, remove, refetch: fetch };
}
