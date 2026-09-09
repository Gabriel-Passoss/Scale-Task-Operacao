import { describe, it, expect, vi } from "vitest";
import { findUserIdByEmail, type EmailLookupClient } from "./findUserByEmail";

const UID = "8c5a0e2a-363d-470d-af31-4d0dc615cca8";

function makeClient(overrides: {
  rpc?: { data: unknown; error: { message: string } | null };
  fn?: { data: unknown; error: { message: string } | null };
}): EmailLookupClient & { rpcSpy: ReturnType<typeof vi.fn>; fnSpy: ReturnType<typeof vi.fn> } {
  const rpcSpy = vi.fn().mockResolvedValue(overrides.rpc ?? { data: null, error: null });
  const fnSpy = vi.fn().mockResolvedValue(overrides.fn ?? { data: null, error: null });
  return { rpc: rpcSpy, functions: { invoke: fnSpy }, rpcSpy, fnSpy };
}

describe("findUserIdByEmail", () => {
  it("acha o usuário pela RPC do Postgres", async () => {
    const client = makeClient({ rpc: { data: UID, error: null } });

    expect(await findUserIdByEmail(client, "leandrolsgamer@gmail.com")).toEqual({
      status: "found",
      userId: UID,
    });
    expect(client.fnSpy).not.toHaveBeenCalled();
  });

  it("normaliza o email antes de consultar", async () => {
    const client = makeClient({ rpc: { data: UID, error: null } });

    await findUserIdByEmail(client, "  LeandroLSGamer@Gmail.com  ");

    expect(client.rpcSpy).toHaveBeenCalledWith("get_user_id_by_email", {
      _email: "leandrolsgamer@gmail.com",
    });
  });

  it("só diz 'não encontrado' quando a consulta funcionou e não achou ninguém", async () => {
    const client = makeClient({ rpc: { data: null, error: null } });

    expect(await findUserIdByEmail(client, "ninguem@gmail.com")).toEqual({ status: "not_found" });
    expect(client.fnSpy).not.toHaveBeenCalled();
  });

  it("cai para a edge function quando a RPC ainda não existe no projeto", async () => {
    const client = makeClient({
      rpc: { data: null, error: { message: 'function public.get_user_id_by_email does not exist' } },
      fn: { data: { user_id: UID }, error: null },
    });

    expect(await findUserIdByEmail(client, "leandrolsgamer@gmail.com")).toEqual({
      status: "found",
      userId: UID,
    });
  });

  // O bug relatado: a busca falhava (edge function fora do ar) e a tela dizia
  // "usuário não encontrado", mandando o usuário procurar defeito no lugar errado.
  it("reporta erro — não 'não encontrado' — quando as duas consultas falham", async () => {
    const client = makeClient({
      rpc: { data: null, error: { message: "function does not exist" } },
      fn: { data: null, error: { message: "Edge Function returned a non-2xx status code" } },
    });

    const result = await findUserIdByEmail(client, "leandrolsgamer@gmail.com");

    expect(result.status).toBe("error");
    expect(result.status === "error" && result.message).toContain("non-2xx");
  });

  it("não consulta nada com email vazio", async () => {
    const client = makeClient({});

    expect((await findUserIdByEmail(client, "   ")).status).toBe("error");
    expect(client.rpcSpy).not.toHaveBeenCalled();
  });
});
