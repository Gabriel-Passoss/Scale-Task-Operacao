import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useRemessas } from "@/hooks/useRemessas";
import { useFormatos } from "@/hooks/useFormatos";
import { useAvatares } from "@/hooks/useAvatares";
import { useCopyMethods } from "@/hooks/useCopyMethods";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useCurrentUserRole } from "@/hooks/useCurrentUserRole";
import { ManageDialog } from "@/components/criativos/ManageDialog";
import { CreateDocumentDialog } from "@/components/criativos/CreateDocumentDialog";
import { ViewDocumentDialog } from "@/components/criativos/ViewDocumentDialog";
import { EditDocumentDialog } from "@/components/criativos/EditDocumentDialog";
import { FilterPopover, defaultFilters, type FilterValues } from "@/components/criativos/FilterPopover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Pencil, ExternalLink } from "lucide-react";
import { toast } from "sonner";
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

const STATUS_LABELS: Record<string, string> = {
  enviado_gravacao: "Enviado para gravação",
  enviado_analise_1: "Enviado para análise 1",
  enviado_edicao: "Enviado para edição",
  enviado_analise_2: "Enviado para análise 2",
  enviado_subir: "Enviado para subir",
  no_ar: "No Ar",
};

interface DocWithAds {
  id: string;
  remessa_id: string | null;
  remessa_name?: string;
  link?: string;
  phase_assignments?: Record<string, string> | null;
  created_at: string;
  ads: any[];
}

const Criativos = () => {
  const { currentProject } = useProjectContext();
  const { remessas, add: addRemessa, remove: removeRemessa } = useRemessas();
  const { formatos, add: addFormato, remove: removeFormato } = useFormatos();
  const { avatares, add: addAvatar, remove: removeAvatar } = useAvatares();
  const { copyMethods, add: addCopyMethod, remove: removeCopyMethod } = useCopyMethods();
  const { members } = useProjectMembers();

  // add() do useFormatos devolve undefined quando não há projeto selecionado.
  const handleAddFormato = async (name: string) => {
    const res = await addFormato(name);
    return res?.data ?? null;
  };
  const handleAddAvatar = async (name: string) => {
    const { data } = await addAvatar(name);
    return data ?? null;
  };
  const handleAddCopyMethod = async (name: string) => {
    const { data } = await addCopyMethod(name);
    return data ?? null;
  };
  const { canEdit, isFullAccess } = useCurrentUserRole();
  const [documents, setDocuments] = useState<DocWithAds[]>([]);
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [viewDoc, setViewDoc] = useState<DocWithAds | null>(null);
  const [editDoc, setEditDoc] = useState<DocWithAds | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!currentProject) return;
    const { data: docs } = await supabase
      .from("creative_documents")
      .select("*")
      .eq("project_id", currentProject.id)
      .order("created_at", { ascending: false });

    if (!docs) return;

    const docIds = docs.map((d) => d.id);
    const { data: ads } = await supabase
      .from("creative_ads")
      .select("*")
      .in("document_id", docIds.length > 0 ? docIds : ["none"]);

    const remessaMap = Object.fromEntries(remessas.map((r) => [r.id, r.name]));

    setDocuments(
      docs.map((doc) => ({
        ...doc,
        phase_assignments: (doc.phase_assignments as Record<string, string> | null) ?? null,
        remessa_name: doc.remessa_id ? remessaMap[doc.remessa_id] : undefined,
        ads: (ads ?? []).filter((a) => a.document_id === doc.id),
      }))
    );
  }, [currentProject, remessas]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Date filter
      if (filters.dateFrom) {
        const docDate = new Date(doc.created_at);
        if (docDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const docDate = new Date(doc.created_at);
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (docDate > endOfDay) return false;
      }
      // Remessa filter
      if (filters.remessaIds.length > 0) {
        if (!doc.remessa_id || !filters.remessaIds.includes(doc.remessa_id)) return false;
      }
      // Filtros por campo do anúncio: o documento passa se TIVER ao menos um
      // anúncio que bate em cada dimensão ativa (valores OR dentro da dimensão).
      const anyAd = (pred: (a: any) => boolean) => doc.ads.some(pred);
      if (filters.copywriterIds.length > 0 && !anyAd((a) => a.copywriter_id && filters.copywriterIds.includes(a.copywriter_id))) return false;
      if (filters.formatoIds.length > 0 && !anyAd((a) => a.formato_id && filters.formatoIds.includes(a.formato_id))) return false;
      if (filters.avatarIds.length > 0 && !anyAd((a) => a.avatar_id && filters.avatarIds.includes(a.avatar_id))) return false;
      if (filters.copyMethodIds.length > 0 && !anyAd((a) => a.copy_method_id && filters.copyMethodIds.includes(a.copy_method_id))) return false;
      if (filters.statusList.length > 0 && !anyAd((a) => filters.statusList.includes(a.status))) return false;
      // Validação filter
      if (filters.validacao === "yes") {
        if (!doc.ads.every((a) => a.validacao === true)) return false;
      } else if (filters.validacao === "no") {
        if (!doc.ads.some((a) => a.validacao === false)) return false;
      } else if (filters.validacao === "undefined") {
        if (!doc.ads.some((a) => a.validacao === null || a.validacao === undefined)) return false;
      }
      return true;
    });
  }, [documents, filters]);

  const deleteDocument = async (docId: string) => {
    const { error: adsError } = await supabase
      .from("creative_ads")
      .delete()
      .eq("document_id", docId);
    if (adsError) {
      toast.error("Erro ao excluir anúncios do documento");
      return;
    }
    const { error } = await supabase
      .from("creative_documents")
      .delete()
      .eq("id", docId);
    if (error) {
      toast.error("Erro ao excluir documento");
      return;
    }
    toast.success("Documento excluído");
    fetchDocuments();
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium text-foreground">Criativos</h1>
          <p className="mt-1 text-xs text-muted-foreground">Gerencie seus materiais criativos.</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterPopover
            remessas={remessas}
            members={members}
            formatos={formatos}
            avatares={avatares}
            copyMethods={copyMethods}
            filters={filters}
            onApply={setFilters}
            canFilterValidacao={isFullAccess}
          />
          {isFullAccess && (
            <>
              <ManageDialog
                title="Gerenciar Remessas"
                triggerLabel="Gerenciar Remessas"
                items={remessas}
                onAdd={addRemessa}
                onRemove={removeRemessa}
              />
              <ManageDialog
                title="Gerenciar Formatos"
                triggerLabel="Gerenciar Formatos"
                items={formatos}
                onAdd={addFormato}
                onRemove={removeFormato}
              />
              <ManageDialog
                title="Gerenciar Avatares"
                triggerLabel="Gerenciar Avatares"
                items={avatares}
                onAdd={addAvatar}
                onRemove={removeAvatar}
              />
              <ManageDialog
                title="Gerenciar Métodos de Copy"
                triggerLabel="Gerenciar Métodos de Copy"
                items={copyMethods}
                onAdd={addCopyMethod}
                onRemove={removeCopyMethod}
              />
            </>
          )}
          {canEdit && (
            <CreateDocumentDialog
              remessas={remessas}
              formatos={formatos}
              onAddFormato={handleAddFormato}
              avatares={avatares}
              onAddAvatar={handleAddAvatar}
              copyMethods={copyMethods}
              onAddCopyMethod={handleAddCopyMethod}
              members={members}
              onCreated={fetchDocuments}
            />
          )}
        </div>
      </div>

      {/* Documents list */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Nenhum documento encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDocuments.map((doc) => (
            <Card
              key={doc.id}
              className="p-3 cursor-pointer border-0 bg-white/[0.04] transition-colors hover:bg-white/[0.06]"
              onClick={() => setViewDoc(doc)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {doc.remessa_name || "Sem remessa"}
                </h3>
                <div className="flex items-center gap-0.5">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
                      onClick={(e) => { e.stopPropagation(); setEditDoc(doc); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {doc.link && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
                      onClick={(e) => { e.stopPropagation(); window.open(doc.link, "_blank"); }}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {canEdit && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir documento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Isso excluirá o documento e todos os seus anúncios. Essa ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteDocument(doc.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5">
                <span>{doc.ads.length} anúncio(s)</span>
                <span>{doc.ads.filter((a) => a.validacao).length} validado(s)</span>
                <span>{new Date(doc.created_at).toLocaleDateString("pt-BR")}</span>
                {(() => {
                  const memberMap = Object.fromEntries(members.map((m) => [m.user_id, m.full_name || m.email || m.user_id.slice(0, 8)]));
                  const writers = [...new Set(doc.ads.map((a) => a.copywriter_id).filter(Boolean))];
                  return writers.length > 0 ? (
                    <span>{writers.map((id) => memberMap[id] ?? id.slice(0, 8)).join(", ")}</span>
                  ) : null;
                })()}
              </div>
            </Card>
          ))}
        </div>
      )}

      {viewDoc && (
        <ViewDocumentDialog
          open={!!viewDoc}
          onOpenChange={(open) => !open && setViewDoc(null)}
          remessaName={viewDoc.remessa_name}
          link={viewDoc.link}
          createdAt={viewDoc.created_at}
          ads={viewDoc.ads}
          formatoMap={Object.fromEntries(formatos.map((f) => [f.id, f.name]))}
          avatarMap={Object.fromEntries(avatares.map((a) => [a.id, a.name]))}
          copyMethodMap={Object.fromEntries(copyMethods.map((c) => [c.id, c.name]))}
          memberMap={Object.fromEntries(members.map((m) => [m.user_id, m.email ?? m.user_id.slice(0, 8)]))}
        />
      )}

      {editDoc && (
        <EditDocumentDialog
          open={!!editDoc}
          onOpenChange={(open) => !open && setEditDoc(null)}
          document={editDoc}
          remessas={remessas}
          formatos={formatos}
          onAddFormato={handleAddFormato}
          avatares={avatares}
          onAddAvatar={handleAddAvatar}
          copyMethods={copyMethods}
          onAddCopyMethod={handleAddCopyMethod}
          members={members}
          onSaved={fetchDocuments}
        />
      )}
    </div>
  );
};

export default Criativos;
