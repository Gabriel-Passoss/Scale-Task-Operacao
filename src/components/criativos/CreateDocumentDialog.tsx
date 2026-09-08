import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, FilePlus } from "lucide-react";
import { AdForm, AdData, emptyAd } from "./AdForm";
import { Remessa } from "@/hooks/useRemessas";
import { Formato } from "@/hooks/useFormatos";
import { Avatar } from "@/hooks/useAvatares";
import { CopyMethod } from "@/hooks/useCopyMethods";
import { ProjectMember } from "@/hooks/useProjectMembers";
import { supabase } from "@/integrations/supabase/client";
import { useProjectContext } from "@/contexts/ProjectContext";
import { toast } from "sonner";
import { logActivity } from "@/hooks/useActivityLog";
import { notifyTelegramAssignment } from "@/lib/notifyTelegram";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CREATIVE_STEPS, FIRST_STEP } from "@/lib/creativeSteps";

interface Props {
  remessas: Remessa[];
  formatos: Formato[];
  onAddFormato: (name: string) => Promise<Formato | null>;
  avatares: Avatar[];
  onAddAvatar: (name: string) => Promise<Avatar | null>;
  copyMethods: CopyMethod[];
  onAddCopyMethod: (name: string) => Promise<CopyMethod | null>;
  members: ProjectMember[];
  onCreated: () => void;
}

export function CreateDocumentDialog({ remessas, formatos, onAddFormato, avatares, onAddAvatar, copyMethods, onAddCopyMethod, members, onCreated }: Props) {
  const { currentProject } = useProjectContext();
  const [open, setOpen] = useState(false);
  const [remessaId, setRemessaId] = useState("");
  const [link, setLink] = useState("");
  const [ads, setAds] = useState<AdData[]>([{ ...emptyAd }]);
  const [saving, setSaving] = useState(false);
  const [phaseAssignments, setPhaseAssignments] = useState<Record<string, string>>({});

  const updateAd = (index: number, data: AdData) => {
    setAds((prev) => prev.map((a, i) => (i === index ? data : a)));
  };

  const addAd = () => setAds((prev) => [...prev, { ...emptyAd }]);

  const handleSave = async () => {
    if (!currentProject) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    // Create document
    const { data: doc, error: docErr } = await supabase
      .from("creative_documents")
      .insert({
        project_id: currentProject.id,
        remessa_id: remessaId || null,
        link: link || "",
        created_by: user.id,
        phase_assignments: phaseAssignments,
      } as any)
      .select()
      .single();

    if (docErr || !doc) {
      toast.error("Erro ao criar documento");
      setSaving(false);
      return;
    }

    // Insert ads
    const adsToInsert = ads.map((ad) => ({
      document_id: doc.id,
      project_id: currentProject.id,
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
      created_by: user.id,
    }));

    const { data: insertedAds, error: adsErr } = await supabase
      .from("creative_ads")
      .insert(adsToInsert as any)
      .select("id, project_id, copywriter_id, name");

    if (adsErr) {
      toast.error("Erro ao criar anúncios");
    } else {
      // Auto-create the FIRST step of the creative pipeline for each ad
      // ("Analisar copy"). The next steps are created one at a time as each task
      // is concluded (see Tasks.tsx). Every auto-task is due today + high priority.
      if (insertedAds && insertedAds.length > 0) {
        const today = format(new Date(), "yyyy-MM-dd");
        // Assignee for step 1: the member picked in the assignment UI, else the ad's copywriter.
        const step1Assignee = phaseAssignments[FIRST_STEP.key] || null;
        const tasksToInsert = insertedAds.map((ad: any) => ({
          project_id: ad.project_id,
          ad_id: ad.id,
          name: FIRST_STEP.label,
          description: `Tarefa automática criada ao criar documento.`,
          status: "pendente" as const,
          priority: "alta",
          assigned_to: step1Assignee || ad.copywriter_id || null,
          due_date: today,
          created_by: user.id,
        }));
        const { error: taskErr } = await supabase.from("tasks").insert(tasksToInsert as any);
        if (taskErr) {
          console.error("Falha ao criar tarefa automática:", taskErr);
          toast.error("Documento criado, mas falhou ao gerar a tarefa: " + taskErr.message);
        }

        // Notify assignees on Telegram (best-effort).
        insertedAds.forEach((ad: any) => {
          const assignee = step1Assignee || ad.copywriter_id;
          if (assignee) {
            notifyTelegramAssignment(FIRST_STEP.label, assignee, ad.project_id);
          }
        });
      }

      toast.success("Documento criado com sucesso!");
      logActivity({
        action: "create",
        entity_type: "criativo",
        entity_name: `Documento com ${ads.length} anúncio(s)`,
        details: `criou um documento com ${ads.length} anúncio(s)`,
        project_id: currentProject?.id,
      });
      setOpen(false);
      setRemessaId("");
      setLink("");
      setAds([{ ...emptyAd }]);
      setPhaseAssignments({});
      onCreated();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <FilePlus className="h-4 w-4 mr-1.5" />
          Criar documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Novo Documento Criativo</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 min-h-0">
          <div className="space-y-6 pb-4 px-1">
            {/* Remessa */}
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
                Defina quem recebe cada tarefa. Só a 1ª ("{FIRST_STEP.label}") é criada agora — as
                próximas surgem ao concluir a anterior. Deixe em branco para escolher o responsável na hora de avançar.
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

            {/* Ads */}
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
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar documento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
