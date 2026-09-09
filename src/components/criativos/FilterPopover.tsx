import { useState } from "react";
import { format } from "date-fns";
import { Filter, CalendarIcon, Search, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import type { Remessa } from "@/hooks/useRemessas";
import type { Formato } from "@/hooks/useFormatos";
import type { Avatar } from "@/hooks/useAvatares";
import type { CopyMethod } from "@/hooks/useCopyMethods";
import type { ProjectMember } from "@/hooks/useProjectMembers";
import { copywriterMembers } from "@/lib/roles";

// Todos os status possíveis do anúncio (espelha AdForm).
const STATUS_OPTIONS: { id: string; name: string }[] = [
  { id: "enviado_gravacao", name: "Enviado para gravação" },
  { id: "enviado_analise_1", name: "Enviado para análise 1" },
  { id: "enviado_edicao", name: "Enviado para edição" },
  { id: "enviado_analise_2", name: "Enviado para análise 2" },
  { id: "enviado_subir", name: "Enviado para subir" },
  { id: "no_ar", name: "No Ar" },
];

export interface FilterValues {
  dateFrom?: Date;
  dateTo?: Date;
  remessaIds: string[];
  copywriterIds: string[];
  formatoIds: string[];
  avatarIds: string[];
  copyMethodIds: string[];
  statusList: string[];
  validacao: "all" | "yes" | "no" | "undefined";
}

export const defaultFilters: FilterValues = {
  remessaIds: [],
  copywriterIds: [],
  formatoIds: [],
  avatarIds: [],
  copyMethodIds: [],
  statusList: [],
  validacao: "all",
};

interface FilterPopoverProps {
  remessas: Remessa[];
  members: ProjectMember[];
  formatos: Formato[];
  avatares: Avatar[];
  copyMethods: CopyMethod[];
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
  canFilterValidacao?: boolean;
}

type Item = { id: string; name: string };

// Multi-select reutilizável: botão "N selecionado(s)" + lista com busca.
function MultiSelectField({ label, items, selected, onToggle }: {
  label: string;
  items: Item[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between text-xs font-normal">
            <span className={cn("truncate", selected.length === 0 && "text-muted-foreground")}>
              {selected.length > 0 ? `${selected.length} selecionado(s)` : "Todos"}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 space-y-2" align="start">
          {items.length > 6 && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-7 pl-7 text-xs" />
            </div>
          )}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filtered.map((it) => (
              <label key={it.id} className="flex items-center gap-2 cursor-pointer px-1 py-0.5 rounded hover:bg-muted">
                <Checkbox checked={selected.includes(it.id)} onCheckedChange={() => onToggle(it.id)} />
                <span className="text-xs">{it.name}</span>
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">Nada encontrado</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function FilterPopover({ remessas, members, formatos, avatares, copyMethods, filters, onApply, canFilterValidacao = true }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<FilterValues>(filters);
  const [datePickerOpen, setDatePickerOpen] = useState<"from" | "to" | null>(null);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setLocal(filters);
    setOpen(isOpen);
  };

  // Toggle genérico em qualquer campo array de FilterValues.
  const toggle = (key: "remessaIds" | "copywriterIds" | "formatoIds" | "avatarIds" | "copyMethodIds" | "statusList", id: string) =>
    setLocal((prev) => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
    });

  // Só cargos de copywriter — mais quem já estiver selecionado, para não sumir com um filtro ativo.
  const memberItems: Item[] = copywriterMembers(members, local.copywriterIds)
    .map((m) => ({ id: m.user_id, name: m.full_name || m.email || m.user_id.slice(0, 8) }));
  const toItems = (arr: { id: string; name: string }[]): Item[] => arr.map((x) => ({ id: x.id, name: x.name }));

  const activeCount =
    (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0) +
    filters.remessaIds.length + filters.copywriterIds.length + filters.formatoIds.length +
    filters.avatarIds.length + filters.copyMethodIds.length + filters.statusList.length +
    (filters.validacao !== "all" ? 1 : 0);

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-1.5">
          <Filter className="h-4 w-4" />
          <span className="text-xs">Filtros</span>
          {activeCount > 0 && (
            <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-xs font-semibold">Filtros</span>
          {activeCount > 0 && (
            <button onClick={() => setLocal(defaultFilters)} className="inline-flex items-center gap-1 text-2xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" /> Limpar
            </button>
          )}
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {/* Data de criação */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Data de criação</Label>
            <div className="flex items-center gap-2">
              <Popover open={datePickerOpen === "from"} onOpenChange={(o) => setDatePickerOpen(o ? "from" : null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("flex-1 justify-start text-left text-xs font-normal", !local.dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {local.dateFrom ? format(local.dateFrom, "dd/MM/yy") : "De"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={local.dateFrom} onSelect={(d) => { setLocal((p) => ({ ...p, dateFrom: d || undefined })); setDatePickerOpen(null); }} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <Popover open={datePickerOpen === "to"} onOpenChange={(o) => setDatePickerOpen(o ? "to" : null)}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("flex-1 justify-start text-left text-xs font-normal", !local.dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {local.dateTo ? format(local.dateTo, "dd/MM/yy") : "Até"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={local.dateTo} onSelect={(d) => { setLocal((p) => ({ ...p, dateTo: d || undefined })); setDatePickerOpen(null); }} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          <MultiSelectField label="Status" items={STATUS_OPTIONS} selected={local.statusList} onToggle={(id) => toggle("statusList", id)} />
          <MultiSelectField label="Copywriter" items={memberItems} selected={local.copywriterIds} onToggle={(id) => toggle("copywriterIds", id)} />
          <MultiSelectField label="Formato" items={toItems(formatos)} selected={local.formatoIds} onToggle={(id) => toggle("formatoIds", id)} />
          <MultiSelectField label="Avatar" items={toItems(avatares)} selected={local.avatarIds} onToggle={(id) => toggle("avatarIds", id)} />
          <MultiSelectField label="Método de Copy" items={toItems(copyMethods)} selected={local.copyMethodIds} onToggle={(id) => toggle("copyMethodIds", id)} />
          <MultiSelectField label="Remessa" items={toItems(remessas)} selected={local.remessaIds} onToggle={(id) => toggle("remessaIds", id)} />

          {canFilterValidacao && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs font-medium">Validação</Label>
                <RadioGroup value={local.validacao} onValueChange={(v) => setLocal((p) => ({ ...p, validacao: v as FilterValues["validacao"] }))} className="flex gap-3">
                  {([["all", "Todos"], ["no", "Não"], ["yes", "Sim"]] as const).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-1.5 cursor-pointer">
                      <RadioGroupItem value={value} />
                      <span className="text-xs">{label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border p-3">
          <Button size="sm" className="w-full" onClick={() => { onApply(local); setOpen(false); }}>
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
