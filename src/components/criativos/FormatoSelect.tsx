import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Formato } from "@/hooks/useFormatos";

interface Props {
  items: Formato[];
  value: string;
  onChange: (id: string) => void;
  onAdd: (name: string) => Promise<Formato | null>;
}

// Select de Formato com "+ adicionar" inline — espelha AvatarSelect/CopyMethodSelect,
// para o copy cadastrar o formato usado no anúncio sem sair do documento.
export function FormatoSelect({ items, value, onChange, onAdd }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const commit = async () => {
    const v = name.trim();
    if (!v) return;
    setSaving(true);
    const item = await onAdd(v);
    setSaving(false);
    if (item) onChange(item.id);
    setName("");
    setAdding(false);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Formato</Label>
      {adding ? (
        <div className="flex gap-1.5">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Novo formato"
            disabled={saving}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commit(); }
              if (e.key === "Escape") { setAdding(false); setName(""); }
            }}
          />
          <Button type="button" size="icon" variant="outline" className="shrink-0" disabled={saving || !name.trim()} onClick={commit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" className="shrink-0" disabled={saving} onClick={() => { setAdding(false); setName(""); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-1.5">
          <Select value={value || undefined} onValueChange={onChange}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {items.length === 0 ? (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">Nenhum cadastrado</div>
              ) : (
                items.map((it) => (
                  <SelectItem key={it.id} value={it.id}>{it.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button type="button" size="icon" variant="outline" className="shrink-0" onClick={() => setAdding(true)} title="Cadastrar formato">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
