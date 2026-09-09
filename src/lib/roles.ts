import { ProjectMember } from "@/hooks/useProjectMembers";

/**
 * Cargos que de fato escrevem copy — "Copywriter chief" (master) e
 * "Copywriter research" (copywriter_jr). São os únicos oferecidos no seletor
 * de Copywriter do anúncio e no filtro de Criativos.
 */
export const COPYWRITER_ROLES = ["master", "copywriter_jr"];

/**
 * Membros elegíveis como copywriter. `keepIds` mantém na lista quem já está
 * atribuído/filtrado mesmo que não tenha (mais) cargo de copywriter, para não
 * apagar silenciosamente a atribuição de criativos antigos.
 */
export function copywriterMembers(members: ProjectMember[], keepIds: string[] = []): ProjectMember[] {
  return members.filter((m) => COPYWRITER_ROLES.includes(m.role) || keepIds.includes(m.user_id));
}
