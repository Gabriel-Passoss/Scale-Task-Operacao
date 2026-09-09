-- Convite de membro por email.
--
-- O email do usuário só existe em `auth.users` (public.profiles guarda apenas
-- full_name/avatar), então a tela de Configurações dependia da edge function
-- `get-user-by-email` para traduzir email -> user_id. Quando essa function não
-- está publicada/configurada no projeto, a chamada falha e a tela acusava
-- "usuário não encontrado" para um email que existe no Auth.
--
-- Esta RPC resolve o mesmo lookup pelo canal Postgres, que é o caminho que o
-- resto do app já usa. Segue o padrão de get_elevenlabs_key_status: SECURITY
-- DEFINER, sem acesso anônimo, e devolvendo só o id — nunca a linha do auth.users.

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(_email TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT u.id
  FROM auth.users u
  WHERE auth.uid() IS NOT NULL
    AND u.deleted_at IS NULL
    AND lower(u.email) = lower(btrim(_email))
  LIMIT 1;
$$;

-- Só usuário autenticado consulta (não é oráculo público de email -> id).
REVOKE ALL ON FUNCTION public.get_user_id_by_email(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) TO authenticated;
