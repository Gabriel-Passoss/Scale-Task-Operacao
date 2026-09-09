import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Crown, Users, Loader2, Trash2, ImagePlus, X as XIcon, Bot, AlertTriangle, User, Webhook } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { findUserIdByEmail, type EmailLookupClient } from "@/lib/findUserByEmail";
import { PushNotificationsCard } from "@/components/PushNotificationsCard";
import { TestNotificationCard } from "@/components/TestNotificationCard";
import { ProfilePanel } from "@/components/ProfilePanel";
import { WebhookPanel } from "@/components/WebhookPanel";
import { ElevenLabsKeyCard } from "@/components/ElevenLabsKeyCard";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ProjectWithMembers {
  id: string;
  name: string;
  image_url?: string | null;
  telegram_bot_token?: string | null;
  role: string;
  members: MemberInfo[];
}

interface MemberInfo {
  id: string;
  user_id: string;
  role: string;
  full_name: string;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { updateProject, projects, selectProject } = useProjectContext();
  const navigate = useNavigate();
  const [ownedProjects, setOwnedProjects] = useState<ProjectWithMembers[]>([]);
  const [participatingProjects, setParticipatingProjects] = useState<ProjectWithMembers[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingEmail, setAddingEmail] = useState<Record<string, string>>({});
  const [addingRole, setAddingRole] = useState<Record<string, string>>({});
  const [editingName, setEditingName] = useState<Record<string, string>>({});
  const [editingToken, setEditingToken] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProjects } = await supabase
        .from("user_projects")
        .select("project_id, role, projects:project_id(id, name, image_url, telegram_bot_token)")
        .eq("user_id", user.id);

      if (!userProjects) return;

      const projectIds = userProjects.map((up: any) => up.project_id);

      const { data: allMembers } = await supabase
        .from("user_projects")
        .select("id, user_id, role, project_id")
        .in("project_id", projectIds);

      const uniqueUserIds = [...new Set((allMembers ?? []).map((m) => m.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", uniqueUserIds);

      const profileMap = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, p.full_name || p.id.slice(0, 8)])
      );

      const owned: ProjectWithMembers[] = [];
      const participating: ProjectWithMembers[] = [];

      for (const up of userProjects) {
        const proj = (up as any).projects;
        const projectMembers = (allMembers ?? [])
          .filter((m) => m.project_id === proj.id)
          .map((m) => ({
            id: m.id,
            user_id: m.user_id,
            role: m.role,
            full_name: profileMap[m.user_id] || m.user_id.slice(0, 8),
          }));

        const item: ProjectWithMembers = {
          id: proj.id,
          name: proj.name,
          image_url: proj.image_url,
          telegram_bot_token: (proj as any).telegram_bot_token,
          role: up.role,
          members: projectMembers,
        };

        if (up.role === "owner") {
          owned.push(item);
        } else {
          participating.push(item);
        }
      }

      setOwnedProjects(owned);
      setParticipatingProjects(participating);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const handleAddMember = async (projectId: string) => {
    const email = addingEmail[projectId]?.trim();
    const role = addingRole[projectId] || "editor";
    if (!email) return;

    setSubmitting(true);
    try {
      const lookup = await findUserIdByEmail(supabase as unknown as EmailLookupClient, email);

      if (lookup.status === "error") {
        toast.error(`Erro ao buscar usuário: ${lookup.message}`);
        setSubmitting(false);
        return;
      }
      if (lookup.status === "not_found") {
        toast.error("Usuário não encontrado com esse email");
        setSubmitting(false);
        return;
      }

      const userId = lookup.userId;

      const existing = ownedProjects
        .find((p) => p.id === projectId)
        ?.members.find((m) => m.user_id === userId);

      if (existing) {
        toast.error("Esse usuário já é membro do projeto");
        setSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("user_projects")
        .insert([{ user_id: userId, project_id: projectId, role: role as any }]);
      if (insertError) throw insertError;

      toast.success("Membro adicionado!");
      setAddingEmail((prev) => ({ ...prev, [projectId]: "" }));
      fetchData();
    } catch (err) {
      // Mostra o motivo real (ex.: RLS barrando quem não é dono do projeto).
      const detail = err instanceof Error ? err.message : String(err);
      toast.error(`Erro ao adicionar membro: ${detail}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (membershipId: string, projectId: string) => {
    const { error } = await supabase
      .from("user_projects")
      .delete()
      .eq("id", membershipId);

    if (error) {
      toast.error("Erro ao remover membro");
    } else {
      toast.success("Membro removido!");
      fetchData();
    }
  };

  const handleImageUpload = async (projectId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida");
      return;
    }
    setUploadingImage((prev) => ({ ...prev, [projectId]: true }));
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${projectId}/logo.${ext}`;

      await supabase.storage.from("project-images").remove([path]);

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(path);

      const imageUrl = urlData.publicUrl + "?t=" + Date.now();

      const { error: updateError } = await supabase
        .from("projects")
        .update({ image_url: imageUrl })
        .eq("id", projectId);
      if (updateError) throw updateError;

      updateProject(projectId, { image_url: imageUrl });
      toast.success("Imagem do projeto atualizada!");
      fetchData();
    } catch {
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploadingImage((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const handleRemoveImage = async (projectId: string) => {
    try {
      const { data: files } = await supabase.storage.from("project-images").list(projectId);
      if (files && files.length > 0) {
        await supabase.storage.from("project-images").remove(files.map((f) => `${projectId}/${f.name}`));
      }
      await supabase.from("projects").update({ image_url: null }).eq("id", projectId);
      updateProject(projectId, { image_url: null });
      toast.success("Imagem removida!");
      fetchData();
    } catch {
      toast.error("Erro ao remover imagem");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.rpc("delete_project_cascade" as any, { _project_id: projectId });
      if (error) throw error;
      toast.success("Projeto excluído com sucesso!");
      onOpenChange(false);
      // Switch to another project or redirect
      const remaining = projects.filter((p) => p.id !== projectId);
      if (remaining.length > 0) {
        selectProject(remaining[0]);
        window.location.reload();
      } else {
        navigate("/");
        window.location.reload();
      }
    } catch {
      toast.error("Erro ao excluir o projeto");
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case "owner": return "Dono";
      case "master": return "Copywriter chief";
      case "copywriter_jr": return "Copywriter research";
      case "especialista": return "Especialista";
      case "editor": return "Editor";
      case "trafego": return "Tráfego";
      case "gestor": return "Gestor"; // legado (fora do seletor)
      default: return role;
    }
  };

  const roleBadgeColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
      case "master": return "bg-blue-500/15 text-blue-700 dark:text-blue-400";
      case "copywriter_jr": return "bg-purple-500/15 text-purple-700 dark:text-purple-400";
      case "especialista": return "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400";
      case "editor": return "bg-green-500/15 text-green-700 dark:text-green-400";
      case "trafego": return "bg-rose-500/15 text-rose-700 dark:text-rose-400";
      case "gestor": return "bg-orange-500/15 text-orange-700 dark:text-orange-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const renderMembers = (members: MemberInfo[], isOwner: boolean, projectId: string) => (
    <div className="space-y-1.5">
      {members.map((m) => (
        <div key={m.id} className="flex items-center justify-between py-1.5 px-2 rounded-md bg-secondary/30">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-foreground truncate">{m.full_name}</span>
            <Badge variant="secondary" className={`text-2xs border-0 shrink-0 ${roleBadgeColor(m.role)}`}>
              {roleLabel(m.role)}
            </Badge>
          </div>
          {isOwner && m.role !== "owner" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => handleRemoveMember(m.id, projectId)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Configurações</DialogTitle>
        </DialogHeader>

        <PushNotificationsCard />
        <TestNotificationCard />
        <ElevenLabsKeyCard />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="perfil" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="perfil" className="flex-1 gap-1.5 text-xs">
                <User className="h-3.5 w-3.5" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="owned" className="flex-1 gap-1.5 text-xs">
                <Crown className="h-3.5 w-3.5" />
                Meus Projetos
              </TabsTrigger>
              <TabsTrigger value="participating" className="flex-1 gap-1.5 text-xs">
                <Users className="h-3.5 w-3.5" />
                Participando
              </TabsTrigger>
              <TabsTrigger value="webhook" className="flex-1 gap-1.5 text-xs">
                <Webhook className="h-3.5 w-3.5" />
                Webhook
              </TabsTrigger>
            </TabsList>

            <TabsContent value="perfil" className="mt-4">
              <ProfilePanel />
            </TabsContent>

            <TabsContent value="owned" className="space-y-4 mt-4">
              {ownedProjects.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Você não é dono de nenhum projeto.
                </p>
              )}
              {ownedProjects.map((project) => (
                <div key={project.id} className="space-y-2.5 rounded-lg border border-border p-3">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editingName[project.id] ?? project.name}
                      onChange={(e) => setEditingName((prev) => ({ ...prev, [project.id]: e.target.value }))}
                      className="h-7 text-xs font-medium bg-secondary/30 border-border/50 flex-1"
                    />
                    {editingName[project.id] !== undefined && editingName[project.id] !== project.name && (
                      <Button
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={async () => {
                          const newName = editingName[project.id]?.trim();
                          if (!newName) return;
                          const { error } = await supabase.from("projects").update({ name: newName }).eq("id", project.id);
                          if (error) { toast.error("Erro ao renomear"); return; }
                          toast.success("Nome atualizado!");
                          setEditingName((prev) => { const n = { ...prev }; delete n[project.id]; return n; });
                          fetchData();
                        }}
                      >
                        Salvar
                      </Button>
                    )}
                  </div>

                  {/* Project image */}
                  <div className="flex items-center gap-3 py-1">
                    {project.image_url ? (
                      <div className="relative group">
                        <img
                          src={project.image_url}
                          alt={project.name}
                          className="h-10 w-10 rounded-md object-cover border border-border/50"
                        />
                        <button
                          onClick={() => handleRemoveImage(project.id)}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRefs.current[project.id]?.click()}
                        className="h-10 w-10 rounded-md border border-dashed border-border/70 flex items-center justify-center cursor-pointer hover:bg-secondary/40 transition-colors"
                      >
                        {uploadingImage[project.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <ImagePlus className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground">
                        {project.image_url ? "Imagem do projeto" : "Adicionar imagem ao projeto"}
                      </p>
                      {project.image_url && (
                        <button
                          onClick={() => fileInputRefs.current[project.id]?.click()}
                          className="text-[10px] text-primary hover:underline"
                        >
                          Trocar imagem
                        </button>
                      )}
                    </div>
                    <input
                      ref={(el) => { fileInputRefs.current[project.id] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(project.id, file);
                        e.target.value = "";
                      }}
                    />
                  </div>

                  {/* Telegram Bot Token */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-medium">Token do Bot Telegram</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={editingToken[project.id] ?? project.telegram_bot_token ?? ""}
                        onChange={(e) => setEditingToken((prev) => ({ ...prev, [project.id]: e.target.value }))}
                        className="h-7 text-xs bg-secondary/30 border-border/50 flex-1"
                        placeholder="Cole o token do BotFather"
                      />
                      {(editingToken[project.id] !== undefined && editingToken[project.id] !== (project.telegram_bot_token ?? "")) && (
                        <Button
                          size="sm"
                          className="h-7 text-xs px-2"
                          onClick={async () => {
                            const token = editingToken[project.id]?.trim() || null;
                            const { error } = await supabase.from("projects").update({ telegram_bot_token: token } as any).eq("id", project.id);
                            if (error) { toast.error("Erro ao salvar token"); return; }
                            toast.success("Token do Telegram salvo!");
                            setEditingToken((prev) => { const n = { ...prev }; delete n[project.id]; return n; });
                            fetchData();
                          }}
                        >
                          Salvar
                        </Button>
                      )}
                    </div>
                  </div>

                  {renderMembers(project.members, true, project.id)}

                  {/* Add member form */}
                  <div className="flex gap-2 pt-1">
                    <Input
                      placeholder="Email do membro"
                      value={addingEmail[project.id] || ""}
                      onChange={(e) =>
                        setAddingEmail((prev) => ({ ...prev, [project.id]: e.target.value }))
                      }
                      className="h-7 text-xs bg-secondary/30 border-border/50 flex-1"
                    />
                    <Select
                      value={addingRole[project.id] || "editor"}
                      onValueChange={(v) =>
                        setAddingRole((prev) => ({ ...prev, [project.id]: v }))
                      }
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="master">Copywriter chief</SelectItem>
                        <SelectItem value="especialista">Especialista</SelectItem>
                        <SelectItem value="copywriter_jr">Copywriter research</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="trafego">Tráfego</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="h-7 text-xs px-2"
                      disabled={submitting || !addingEmail[project.id]?.trim()}
                      onClick={() => handleAddMember(project.id)}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Delete project */}
                  <div className="pt-2 border-t border-border/50">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                        >
                          <Trash2 className="h-3 w-3" />
                          Excluir projeto
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Excluir projeto?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            Essa ação é <strong>irreversível</strong>. Todos os dados do projeto <strong>"{project.name}"</strong> serão excluídos permanentemente, incluindo tarefas, criativos, métricas, arquivos e membros.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={submitting}
                          >
                            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Excluir permanentemente"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="participating" className="space-y-4 mt-4">
              {participatingProjects.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Você não participa de outros projetos.
                </p>
              )}
              {participatingProjects.map((project) => (
                <div key={project.id} className="space-y-2.5 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-medium text-foreground">{project.name}</h3>
                    <Badge variant="secondary" className={`text-2xs border-0 ${roleBadgeColor(project.role)}`}>
                      {roleLabel(project.role)}
                    </Badge>
                  </div>
                  {renderMembers(project.members, false, project.id)}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="webhook" className="mt-4">
              <WebhookPanel projects={ownedProjects.map((p) => ({ id: p.id, name: p.name }))} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
