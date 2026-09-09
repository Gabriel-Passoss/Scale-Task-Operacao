-- Novo cargo "Tráfego" (2026-09-09).
-- O valor precisa entrar no enum em uma migration separada: o Postgres não deixa
-- usar um label recém-adicionado dentro da mesma transação que o criou.
ALTER TYPE public.project_role ADD VALUE IF NOT EXISTS 'trafego';
