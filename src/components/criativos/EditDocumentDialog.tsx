import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { AdForm, AdData, emptyAd } from "./AdForm";
import { Remessa } from "@/hooks/useRemessas";
import { Formato } from "@/hooks/useFormatos";
import { Avatar } from "@/hooks/useAvatares";
import { CopyMethod } from "@/hooks/useCopyMethods";
import { ProjectMember } from "@/hooks/useProjectMembers";
import { supabase } from "@/integrations/supabase/client";
import { useProjectContext } from "@/contexts/ProjectContext";
import { toast } from "sonner";
import { notifyTelegramAssignment } from "@/lib/notifyTelegram";
import { format } from "date-fns";
import { CREATIVE_STEPS, FIRST_STEP } from "@/lib/creativeSteps";

interface DocWithAds {
  id: string;
  remessa_id: string | null;
  link?: string;
  phase_assignments?: Record<string, string> | null;
  ads: any[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocWithAds;
  remessas: Remessa[];
  formatos: Formato[];
  onAddFormato: (name: string) => Promise<Formato | null>;
  avatares: Avatar[];
  onAddAvatar: (name: string) => Promise<Avatar | null>;
  copyMethods: CopyMethod[];
  onAddCopyMethod: (name: string) => Promise<CopyMethod | null>;
  members: ProjectMember[];
  onSaved: () => void;
}

function adToFormData(ad: any): AdData {
  return {
    name: ad.name ?? "",
    briefing: ad.briefing ?? "",
    status: ad.status ?? "enviado_gravacao",
    validacao: ad.validacao ?? false,
    copywriter_id: ad.copywriter_id ?? "",
    formato_id: ad.formato_id ?? "",
    avatar_id: ad.avatar_id ?? "",
    copy_method_id: ad.copy_method_id ?? "",
    referencia: ad.referencia ?? "",
    notas_editor: ad.notas_editor ?? "",
    notas_gravacao: ad.notas_gravacao ?? "",
    texto: ad.texto ?? "",
    hook_rate: ad.hook_rate != null ? String(ad.hook_rate) : "",
    hold_rate: ad.hold_rate != null ? String(ad.hold_rate) : "",
    cpm: ad.cpm != null ? String(ad.cpm) : "",
    conv_checkout: ad.conv_checkout != null ? String(ad.conv_checkout) : "",
    cic: ad.cic != null ? String(ad.cic) : "",
    cpc: ad.cpc != null ? String(ad.cpc) : "",
    retencao_1min: ad.retencao_1min != null ? String(ad.retencao_1min) : "",
    retencao_pitch: ad.retencao_pitch != null ? String(ad.retencao_pitch) : "",
    conversao_vsl: ad.conversao_vsl != null ? String(ad.conversao_vsl) : "",
    faturamento: ad.faturamento != null ? String(ad.faturamento) : "",
    investimento: ad.investimento != null ? String(ad.investimento) : "",
    roas: ad.roas != null ? String(ad.roas) : "",
    faturamento_backend: ad.faturamento_backend != null ? String(ad.faturamento_backend) : "",
  };
}

export function EditDocumentDialog({ open, onOpenChange, document, remessas, formatos, onAddFormato, avatares, onAddAvatar, copyMethods, onAddCopyMethod, members, onSaved }: Props) {
  const { currentProject } = useProjectContext();
  const [remessaId, setRemessaId] = useState(document.remessa_id ?? "");
  const [link, setLink] = useState(document.link ?? "");
  const [ads, setAds] = useState<(AdData & { _id?: string })[]>(
    document.ads.map((a) => ({ ...adToFormData(a), _id: a.id }))
  );
  const [saving, setSaving] = useState(false);
  const [phaseAssignments, setPhaseAssignments] = useState<Record<string, string>>(
    (document.phase_assignments as Record<string, string>) ?? {}
  );

  useEffect(() => {
    setRemessaId(document.remessa_id ?? "");
    setLink(document.link ?? "");
    setAds(document.ads.map((a) => ({ ...adToFormData(a), _id: a.id })));
    setPhaseAssignments((document.phase_assignments as Record<string, string>) ?? {});
  }, [document]);

  const updateAd = (index: number, data: AdData) => {
    setAds((prev) => prev.map((a, i) => (i === index ? { ...data, _id: a._id } : a)));
  };

  const addAd = () => setAds((prev) => [...prev, { ...emptyAd }]);

  // Campos do anúncio gravados no banco (sem o _id, que é controle local).
  const adPayload = (ad: AdData) => ({
    name: ad.name,
    briefing: ad.briefing || null,
    status: ad.status as any,
    validacao: ad.validacao,
    copywriter_id: ad.copywriter_id || null,
    formato_id: ad.formato_id || null,
    avatar_id: ad.avatar_id || null,
    copy_method_id: ad.copy_method_id || null,
    referencia: ad.referencia || null,
    notas_editor: ad.notas_editor || null,
    notas_gravacao: ad.notas_gravacao || null,
    texto: ad.texto || "",
    hook_rate: ad.hook_rate ? parseFloat(ad.hook_rate) : null,
    hold_rate: ad.hold_rate ? parseFloat(ad.hold_rate) : null,
    cpm: ad.cpm ? parseFloat(ad.cpm) : null,
    conv_checkout: ad.conv_checkout ? parseFloat(ad.conv_checkout) : null,
    cic: ad.cic ? parseFloat(ad.cic) : null,
    cpc: ad.cpc ? parseFloat(ad.cpc) : null,
    retencao_1min: ad.retencao_1min ? parseFloat(ad.retencao_1min) : null,
    retencao_pitch: ad.retencao_pitch ? parseFloat(ad.retencao_pitch) : null,
    conversao_vsl: ad.conversao_vsl ? parseFloat(ad.conversao_vsl) : null,
    faturamento: ad.faturamento ? parseFloat(ad.faturamento) : null,
    investimento: ad.investimento ? parseFloat(ad.investimento) : null,
    roas: ad.roas ? parseFloat(ad.roas) : null,
    faturamento_backend: ad.faturamento_backend ? parseFloat(ad.faturamento_backend) : null,
  });

  const handleSave = async () => {
    if (!currentProject) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Update document remessa + responsáveis das etapas
    const { error: docErr } = await supabase
      .from("creative_documents")
      .update({
        remessa_id: remessaId || null,
        link: link || "",
        phase_assignments: phaseAssignments,
      })
      .eq("id", document.id);

    if (docErr) {
      toast.error("Erro ao atualizar documento");
      setSaving(false);
      return;
    }

    // Anúncios: atualiza os existentes, insere os novos e remove os excluídos.
    // (Não apagamos tudo para reinserir: tasks.ad_id é ON DELETE CASCADE, então
    // isso apagaria as tarefas já criadas do pipeline deste documento.)
    const keptIds = ads.map((a) => a._id).filter(Boolean) as string[];
    const removedIds = document.ads
      .map((a) => a.id as string)
      .filter((id) => !keptIds.includes(id));

    if (removedIds.length > 0) {
      await supabase.from("creative_ads").delete().in("id", removedIds);
    }

    for (const ad of ads.filter((a) => a._id)) {
      const { error } = await supabase
        .from("creative_ads")
        .update(adPayload(ad))
        .eq("id", ad._id!);
      if (error) {
        toast.error("Erro ao salvar anúncios");
        setSaving(false);
        return;
      }
    }

    const newAds = ads.filter((a) => !a._id);
    let insertedAds: { id: string; project_id: string; copywriter_id: string | null }[] = [];
    if (newAds.length > 0) {
      const { data, error } = await supabase
        .from("creative_ads")
        .insert(
          newAds.map((ad) => ({
            ...adPayload(ad),
            document_id: document.id,
            project_id: currentProject.id,
            created_by: user?.id ?? null,
          })) as any
        )
        .select("id, project_id, copywriter_id");
      if (error) {
        toast.error("Erro ao salvar anúncios");
        setSaving(false);
        return;
      }
      insertedAds = data ?? [];
    }

    // Anúncio novo entra no pipeline pela 1ª etapa, igual à criação do documento.
    if (insertedAds.length > 0 && user) {
      const today = format(new Date(), "yyyy-MM-dd");
      const step1Assignee = phaseAssignments[FIRST_STEP.key] || null;
      const { error: taskErr } = await supabase.from("tasks").insert(
        insertedAds.map((ad) => ({
          project_id: ad.project_id,
          ad_id: ad.id,
          name: FIRST_STEP.label,
          description: "Tarefa automática criada ao adicionar anúncio ao documento.",
          status: "pendente" as const,
          priority: "alta",
          assigned_to: step1Assignee || ad.copywriter_id || null,
          due_date: today,
          created_by: user.id,
        })) as any
      );
      if (taskErr) {
        console.error("Falha ao criar tarefa automática:", taskErr);
        toast.error("Anúncio salvo, mas falhou ao gerar a tarefa: " + taskErr.message);
      } else {
        insertedAds.forEach((ad) => {
          const assignee = step1Assignee || ad.copywriter_id;
          if (assignee) notifyTelegramAssignment(FIRST_STEP.label, assignee, ad.project_id);
        });
      }
    }

    // Responsáveis alterados agora: repassa para as tarefas dessas etapas que
    // ainda estão em aberto. As etapas ainda não criadas leem phase_assignments
    // na hora em que forem geradas.
    const changedSteps = CREATIVE_STEPS.filter(
      (s) => phaseAssignments[s.key] && phaseAssignments[s.key] !== (document.phase_assignments ?? {})[s.key]
    );
    const adIds = [...keptIds, ...insertedAds.map((a) => a.id)];
    if (changedSteps.length > 0 && adIds.length > 0) {
      for (const step of changedSteps) {
        const { error } = await supabase
          .from("tasks")
          .update({ assigned_to: phaseAssignments[step.key] })
          .in("ad_id", adIds)
          .eq("name", step.label)
          .in("status", ["pendente", "em_progresso"]);
        if (error) console.error("Falha ao repassar responsável da etapa:", error);
      }
    }

    toast.success("Documento atualizado!");
    onOpenChange(false);
    onSaved();
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Documento</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 min-h-0">
          <div className="space-y-6 pb-4 px-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Remessa</Label>
              <Select value={remessaId} onValueChange={setRemessaId}>
                <SelectTrigger><SelectValue placeholder="Selecione uma remessa" /></SelectTrigger>
                <SelectContent>
                  {remessas.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Link */}
            <div className="space-y-1.5">
              <Label className="text-xs">Link (pasta do Drive)</Label>
              <Input placeholder="https://drive.google.com/..." value={link} onChange={(e) => setLink(e.target.value)} />
            </div>

            {/* Task Assignments — one responsável per pipeline step */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Responsáveis das tarefas</Label>
              <p className="text-2xs text-muted-foreground">
                Defina quem recebe cada tarefa. Alterar um responsável aqui atualiza a tarefa da etapa
                que ainda estiver em aberto e vale para as próximas, criadas ao concluir a anterior.
                Deixe em branco para escolher o responsável na hora de avançar.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CREATIVE_STEPS.map((phase, i) => (
                  <div key={phase.key} className="flex items-center gap-2">
                    <span className="text-2xs text-muted-foreground w-6 flex-shrink-0 text-right tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Label className="text-2xs text-muted-foreground w-32 flex-shrink-0 leading-tight">{phase.label}</Label>
                    <Select
                      value={phaseAssignments[phase.key] || ""}
                      onValueChange={(v) =>
                        setPhaseAssignments((prev) => ({ ...prev, [phase.key]: v }))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Selecionar membro" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((m) => (
                          <SelectItem key={m.user_id} value={m.user_id}>
                            {m.full_name || m.email || m.user_id.slice(0, 8)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {ads.map((ad, i) => (
              <AdForm
                key={i}
                index={i}
                data={ad}
                onChange={(d) => updateAd(i, d)}
                onRemove={ads.length > 1 ? () => setAds((prev) => prev.filter((_, idx) => idx !== i)) : undefined}
                formatos={formatos}
                onAddFormato={onAddFormato}
                avatares={avatares}
                onAddAvatar={onAddAvatar}
                copyMethods={copyMethods}
                onAddCopyMethod={onAddCopyMethod}
                members={members}
                metricsAuto
              />
            ))}

            <Button variant="outline" className="w-full" onClick={addAd}>
              <Plus className="h-4 w-4 mr-1.5" />
              Criar novo anúncio
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
