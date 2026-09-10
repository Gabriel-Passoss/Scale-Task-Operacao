-- Renomear formato (2026-09-10). A tabela tinha SELECT, INSERT e DELETE, mas
-- nenhuma policy de UPDATE — editar o nome batia na RLS.
-- Mesmo gate do insert/delete: 'master' (que na hierarquia inclui owner e
-- especialista, ou seja, os cargos de acesso total).
CREATE POLICY "Master+ can update formatos"
  ON public.formatos FOR UPDATE TO authenticated
  USING (public.has_project_access(auth.uid(), project_id, 'master'::project_role))
  WITH CHECK (public.has_project_access(auth.uid(), project_id, 'master'::project_role));
