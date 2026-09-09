-- Cargo "Tráfego" (slot 'trafego'), 2026-09-09.
-- Acesso limitado (mesmas abas do Editor, criativos somente leitura, sem
-- exclusão permanente) + acesso completo a Métricas (ver e editar).
--
-- Só compara role::text: nenhum literal do enum é usado aqui, então esta
-- migration pode rodar logo depois do ALTER TYPE ... ADD VALUE.

CREATE OR REPLACE FUNCTION public.has_project_access(_user_id uuid, _project_id uuid, _min_role project_role DEFAULT 'especialista'::project_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_projects WHERE user_id = _user_id AND project_id = _project_id
      AND CASE _min_role::text
        WHEN 'editor' THEN role::text IN ('editor','trafego','especialista','gestor','copywriter_jr','master','owner')
        WHEN 'trafego' THEN role::text IN ('trafego','especialista','master','owner')
        WHEN 'especialista' THEN role::text IN ('especialista','gestor','copywriter_jr','master','owner')
        WHEN 'gestor' THEN role::text IN ('gestor','copywriter_jr','master','owner','especialista')
        WHEN 'copywriter_jr' THEN role::text IN ('copywriter_jr','master','owner','especialista')
        WHEN 'master' THEN role::text IN ('master','owner','especialista')
        WHEN 'owner' THEN role::text = 'owner'
      END
  )
$$;

-- Tráfego NÃO é acesso total: criativos continuam somente leitura para ele
-- (as policies de creative_ads/creative_documents usam is_full_access).
CREATE OR REPLACE FUNCTION public.is_full_access(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_projects
    WHERE user_id = _user_id AND project_id = _project_id
      AND role::text IN ('owner','master','especialista')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_trafego(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_projects
    WHERE user_id = _user_id AND project_id = _project_id
      AND role::text = 'trafego'
  )
$$;

-- Métricas: acesso total + Tráfego. Editor & research continuam sem acesso.
CREATE OR REPLACE FUNCTION public.can_view_metrics(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_full_access(_user_id, _project_id)
      OR public.is_trafego(_user_id, _project_id)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_metrics(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_full_access(_user_id, _project_id)
      OR public.is_trafego(_user_id, _project_id)
$$;

GRANT EXECUTE ON FUNCTION public.is_trafego(uuid, uuid) TO authenticated;
