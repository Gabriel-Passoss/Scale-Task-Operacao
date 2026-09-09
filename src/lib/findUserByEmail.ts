// Busca o user_id de um email para o convite de membros.
//
// O email só existe em `auth.users` — `public.profiles` não guarda email —, então
// a consulta precisa de privilégio elevado. Caminho principal: a RPC
// `get_user_id_by_email` (SECURITY DEFINER), o mesmo canal Postgres que o resto
// do app já usa. A edge function `get-user-by-email` fica como fallback para
// projetos onde a migration ainda não foi aplicada.
//
// Regra central: "não encontrado" só pode ser dito quando a consulta REALMENTE
// rodou e não achou ninguém. Falha de transporte precisa aparecer como erro —
// era isso que fazia a tela acusar email inexistente para usuário cadastrado.

export type EmailLookupResult =
  | { status: "found"; userId: string }
  | { status: "not_found" }
  | { status: "error"; message: string };

interface QueryResult {
  data: unknown;
  error: { message: string } | null;
}

export interface EmailLookupClient {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<QueryResult>;
  functions: {
    invoke: (name: string, options: { body: unknown }) => Promise<QueryResult>;
  };
}

export async function findUserIdByEmail(
  client: EmailLookupClient,
  rawEmail: string
): Promise<EmailLookupResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!email) return { status: "error", message: "Informe um email" };

  const rpc = await client.rpc("get_user_id_by_email", { _email: email });
  if (!rpc.error) {
    return rpc.data ? { status: "found", userId: String(rpc.data) } : { status: "not_found" };
  }

  const fn = await client.functions.invoke("get-user-by-email", { body: { email } });
  if (!fn.error) {
    const userId = (fn.data as { user_id?: string } | null)?.user_id;
    return userId ? { status: "found", userId } : { status: "not_found" };
  }

  return {
    status: "error",
    message: `${fn.error.message} (RPC: ${rpc.error.message})`,
  };
}
