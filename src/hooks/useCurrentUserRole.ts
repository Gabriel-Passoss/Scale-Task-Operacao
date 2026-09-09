import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProjectContext } from "@/contexts/ProjectContext";

export function useCurrentUserRole() {
  const { currentProject } = useProjectContext();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentProject) { setRole(null); setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setRole(null); setLoading(false); return; }

      const { data } = await supabase.rpc("get_project_role", {
        _user_id: user.id,
        _project_id: currentProject.id,
      });

      setRole(data as string | null);
      setLoading(false);
    };
    setLoading(true);
    fetchRole();
  }, [currentProject]);

  // Role model v2 (enum slots reused):
  //   Dono=owner, Copywriter chief=master, Especialista=especialista → FULL access.
  //   Copywriter research=copywriter_jr, Editor=editor, Tráfego=trafego → limited.
  const isFullAccess = role === "owner" || role === "master" || role === "especialista";
  const isResearch = role === "copywriter_jr"; // "Copywriter research"
  const isEditor = role === "editor";
  const isTrafego = role === "trafego";
  const isLimited = isResearch || isEditor || isTrafego;

  // Métricas: full access + Tráfego. Editor & research have no access.
  const canViewMetrics = isFullAccess || isTrafego;
  const canEditMetrics = isFullAccess || isTrafego;

  // Criativos create/edit/delete: full access only (limited roles are view-only).
  const canEdit = isFullAccess;

  // Validação filter in Criativos: full access only.
  const canFilterValidacao = isFullAccess;

  // Tasks: every assigned role can create + edit/archive…
  const canManageTasks = isFullAccess || isLimited;
  // …but only full access can permanently delete (tasks/criativos).
  const canDelete = isFullAccess;

  // Swipe: full access + research can create; editor is view-only.
  const canCreateSwipe = isFullAccess || isResearch;

  // Kept for back-compat with callers; especialista is now full access.
  const isEspecialista = role === "especialista";
  const isGestor = role === "gestor";

  // Can access a specific tab
  const canAccessTab = (tab: string): boolean => {
    if (isFullAccess) return true;
    // Editor, Copywriter research & Tráfego: everything except Métricas
    // (Tráfego também vê Métricas — liberado por canViewMetrics/canEditMetrics).
    if (isLimited) {
      return ["dashboard", "tasks", "criativos", "chat", "swipe", "arquivos", "educacional"].includes(tab);
    }
    return false;
  };

  return {
    role,
    loading,
    canEdit,
    canEditMetrics,
    canViewMetrics,
    canFilterValidacao,
    canManageTasks,
    canCreateSwipe,
    canDelete,
    isFullAccess,
    isResearch,
    isEditor,
    isTrafego,
    isEspecialista,
    isGestor,
    canAccessTab,
  };
}
