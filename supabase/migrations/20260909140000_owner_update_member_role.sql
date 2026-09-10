-- Dono pode alterar o cargo de um membro sem precisar remover e adicionar de
-- novo (2026-09-09). Faltava a policy de UPDATE em user_projects.
--
-- USING olha a linha ANTIGA e WITH CHECK a NOVA, então as duas condições juntas
-- significam: o dono mexe em qualquer membro menos no próprio registro de dono,
-- e não pode promover ninguém a dono (transferência de propriedade fica fora).
CREATE POLICY "Owners can update member roles"
  ON public.user_projects FOR UPDATE TO authenticated
  USING (
    public.has_project_access(auth.uid(), project_id, 'owner'::project_role)
    AND role::text <> 'owner'
  )
  WITH CHECK (
    public.has_project_access(auth.uid(), project_id, 'owner'::project_role)
    AND role::text <> 'owner'
  );
