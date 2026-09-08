import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Formato } from "@/hooks/useFormatos";
import { FormatoSelect } from "./FormatoSelect";
import { Avatar } from "@/hooks/useAvatares";
import { AvatarSelect } from "./AvatarSelect";
import { CopyMethod } from "@/hooks/useCopyMethods";
import { CopyMethodSelect } from "./CopyMethodSelect";
import { ProjectMember } from "@/hooks/useProjectMembers";

const STATUS_OPTIONS = [
  { value: "enviado_gravacao", label: "Enviado para gravação" },
  { value: "enviado_analise_1", label: "Enviado para análise 1" },
  { value: "enviado_edicao", label: "Enviado para edição" },
  { value: "enviado_analise_2", label: "Enviado para análise 2" },
  { value: "enviado_subir", label: "Enviado para subir" },
  { value: "no_ar", label: "No Ar" },
];

export interface AdData {
  name: string;
  briefing: string;
  status: string;
  validacao: boolean;
  copywriter_id: string;
  formato_id: string;
  avatar_id: string;
  copy_method_id: string;
  referencia: string;
  notas_editor: string;
  notas_gravacao: string;
  texto: string;
  hook_rate: string;
  hold_rate: string;
  cpm: string;
  conv_checkout: string;
  cic: string;
  cpc: string;
  retencao_1min: string;
  retencao_pitch: string;
  conversao_vsl: string;
  faturamento: string;
  investimento: string;
  roas: string;
  faturamento_backend: string;
}

export const emptyAd: AdData = {
  name: "",
  briefing: "",
  status: "enviado_gravacao",
  validacao: false,
  copywriter_id: "",
  formato_id: "",
  avatar_id: "",
  copy_method_id: "",
  referencia: "",
  notas_editor: "",
  notas_gravacao: "",
  texto: "",
  hook_rate: "",
  hold_rate: "",
  cpm: "",
  conv_checkout: "",
  cic: "",
  cpc: "",
  retencao_1min: "",
  retencao_pitch: "",
  conversao_vsl: "",
  faturamento: "",
  investimento: "",
  roas: "",
  faturamento_backend: "",
};

interface AdFormProps {
  data: AdData;
  onChange: (data: AdData) => void;
  onRemove?: () => void;
  formatos: Formato[];
  onAddFormato: (name: string) => Promise<Formato | null>;
  avatares: Avatar[];
  onAddAvatar: (name: string) => Promise<Avatar | null>;
  copyMethods: CopyMethod[];
  onAddCopyMethod: (name: string) => Promise<CopyMethod | null>;
  members: ProjectMember[];
  index: number;
  // Métricas preenchidas via webhook — mostradas desabilitadas/borradas.
  metricsAuto?: boolean;
}

// [rótulo, chave] das métricas (preenchidas automaticamente pela API/webhook).
const METRICS: [string, keyof AdData][] = [
  ["Hook Rate (%)", "hook_rate"],
  ["Hold Rate (%)", "hold_rate"],
  ["CPM (R$)", "cpm"],
  ["Conv. Checkout (%)", "conv_checkout"],
  ["Custo IC (R$)", "cic"],
  ["CPC (R$)", "cpc"],
  ["Retenção p/ 1min (%)", "retencao_1min"],
  ["Retenção ao Pitch (%)", "retencao_pitch"],
  ["Conversão da VSL (%)", "conversao_vsl"],
  ["Faturamento (R$)", "faturamento"],
  ["Investimento (R$)", "investimento"],
  ["ROAS", "roas"],
  ["Faturamento Backend (R$)", "faturamento_backend"],
];

export function AdForm({ data, onChange, onRemove, formatos, onAddFormato, avatares, onAddAvatar, copyMethods, onAddCopyMethod, members, index, metricsAuto }: AdFormProps) {
  const set = <K extends keyof AdData>(key: K, value: AdData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Anúncio {index + 1}</h3>
        {onRemove && (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Nome */}
      <div className="space-y-1.5">
        <Label className="text-xs">Nome do anúncio</Label>
        <Input placeholder="Nome do anúncio" value={data.name} onChange={(e) => set("name", e.target.value)} />
      </div>

      {/* Briefing */}
      <div className="space-y-1.5">
        <Label className="text-xs">Briefing</Label>
        <Textarea placeholder="Briefing do anúncio..." value={data.briefing} onChange={(e) => set("briefing", e.target.value)} rows={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select value={data.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Validação */}
        <div className="space-y-1.5">
          <Label className="text-xs">Validação</Label>
          <div className="flex items-center gap-2 h-10">
            <Switch checked={data.validacao} onCheckedChange={(v) => set("validacao", v)} />
            <span className="text-xs text-muted-foreground">{data.validacao ? "Sim" : "Não"}</span>
          </div>
        </div>

        {/* Copywriter */}
        <div className="space-y-1.5">
          <Label className="text-xs">Copywriter</Label>
          <Select value={data.copywriter_id} onValueChange={(v) => set("copywriter_id", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.user_id} value={m.user_id}>
                  {m.full_name || m.email || m.user_id.slice(0, 8)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Formato — lista gerenciável */}
        <FormatoSelect items={formatos} value={data.formato_id} onChange={(v) => set("formato_id", v)} onAdd={onAddFormato} />

        {/* Avatar (persona) — lista gerenciável */}
        <AvatarSelect items={avatares} value={data.avatar_id} onChange={(v) => set("avatar_id", v)} onAdd={onAddAvatar} />

        {/* Método de Copy — lista gerenciável */}
        <CopyMethodSelect items={copyMethods} value={data.copy_method_id} onChange={(v) => set("copy_method_id", v)} onAdd={onAddCopyMethod} />

        {/* Referência (link) */}
        <div className="space-y-1.5">
          <Label className="text-xs">Referência (link)</Label>
          <Input type="url" placeholder="https://..." value={data.referencia} onChange={(e) => set("referencia", e.target.value)} />
        </div>
      </div>

      {/* Notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Notas para editor</Label>
          <Textarea placeholder="Orientações para o editor..." value={data.notas_editor} onChange={(e) => set("notas_editor", e.target.value)} rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Notas para gravação</Label>
          <Textarea placeholder="Orientações para a gravação..." value={data.notas_gravacao} onChange={(e) => set("notas_gravacao", e.target.value)} rows={3} />
        </div>
      </div>

      {/* Copy do anúncio (texto) */}
      <div className="space-y-1.5">
        <Label className="text-xs">Copy do anúncio</Label>
        <Textarea placeholder="Texto/copy do anúncio..." value={data.texto} onChange={(e) => set("texto", e.target.value)} rows={6} />
      </div>

      {/* Métricas (preenchidas automaticamente via API/webhook) */}
      <div className="border-t border-border pt-4">
        {metricsAuto ? (
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pointer-events-none select-none opacity-50 blur-[1.5px]">
              {METRICS.map(([label, key]) => (
                <Metric key={key} label={label} value={String(data[key] ?? "")} onChange={() => {}} disabled />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-md border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                Preenchidas automaticamente via API
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {METRICS.map(([label, key]) => (
              <Metric key={key} label={label} value={String(data[key] ?? "")} onChange={(v) => set(key, v as AdData[typeof key])} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type="number" step="0.01" placeholder="0.00" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} tabIndex={disabled ? -1 : undefined} />
    </div>
  );
}
