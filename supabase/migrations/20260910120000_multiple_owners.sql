-- Vários Donos por projeto (2026-09-10). Antes só o dono original gerenciava
-- membros e não havia como delegar isso; agora um dono pode promover outro
-- membro a Dono.
--
-- Todo dono tem o mesmo poder — inclusive EXCLUIR O PROJETO e rebaixar os
-- outros donos. Decisão consciente do usuário: quem vira Dono é confiança
-- total, não um nível intermediário de administração.
--
-- A trava contra órfão é `user_id <> auth.uid()`: um dono nunca edita nem
-- remove o próprio registro, então é impossível o projeto ficar sem dono
-- (para rebaixar A é preciso ser dono, e o último dono não pode se rebaixar).

-- WITH CHECK sem o `role <> 'owner'` de antes: é isso que libera a promoção.
DROP POLICY IF EXISTS "Owners can update member roles" ON public.user_projects;
CREATE POLICY "Owners can update member roles"
  ON public.user_projects FOR UPDATE TO authenticated
  USING (
    public.has_project_access(auth.uid(), project_id, 'owner'::project_role)
    AND user_id <> auth.uid()
  )
  WITH CHECK (
    public.has_project_access(auth.uid(), project_id, 'owner'::project_role)
    AND user_id <> auth.uid()
  );

-- Antes a policy de DELETE não barrava o próprio registro — só a UI escondia a
-- lixeira do dono. Com vários donos isso vira risco real de órfão, então a
-- trava passa a existir também no banco.
DROP POLICY IF EXISTS "Owners can remove members" ON public.user_projects;
CREATE POLICY "Owners can remove members"
  ON public.user_projects FOR DELETE TO authenticated
  USING (
    public.has_project_access(auth.uid(), project_id, 'owner'::project_role)
    AND user_id <> auth.uid()
  );
