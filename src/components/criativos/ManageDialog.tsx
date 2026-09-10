import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
}

interface ManageDialogProps {
  title: string;
  triggerLabel: string;
  items: Item[];
  onAdd: (name: string) => Promise<any>;
  onRemove: (id: string) => Promise<any>;
  /** Opcional: sem isso a lista não mostra o lápis de renomear. */
  onRename?: (id: string, name: string) => Promise<any>;
}

export function ManageDialog({ title, triggerLabel, items, onAdd, onRemove, onRename }: ManageDialogProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onAdd(name.trim());
    setName("");
    setLoading(false);
  };

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const commitEdit = async () => {
    const value = editingName.trim();
    if (!onRename || !editingId || !value) return;
    // Nada mudou: sai da edição sem ir ao banco.
    if (value === items.find((i) => i.id === editingId)?.name) return cancelEdit();

    setLoading(true);
    const result = await onRename(editingId, value);
    setLoading(false);

    // Erro de RLS/rede mantém a linha em edição para não perder o que foi digitado.
    if (result?.error) {
      const detail = result.error.message ?? String(result.error);
      toast.error(`Erro ao renomear: ${detail}`);
      return;
    }
    cancelEdit();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} disabled={loading || !name.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum item cadastrado.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
              {editingId === item.id ? (
                <>
                  <Input
                    autoFocus
                    className="h-7 text-sm"
                    value={editingName}
                    disabled={loading}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
                      if (e.key === "Escape") cancelEdit();
                    }}
                  />
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Salvar" disabled={loading || !editingName.trim()} onClick={commitEdit}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" title="Cancelar" disabled={loading} onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm truncate">{item.name}</span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {onRename && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Renomear" onClick={() => startEdit(item)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Remover" onClick={() => onRemove(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
