import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, CheckSquare, BarChart3, Palette, GitBranch, GraduationCap,
  FileText, Archive, MessageSquare, Highlighter, Users, ShieldCheck, Sparkles,
  Moon, Sun, Bell, Send, Clock, TrendingUp, Check, ChevronRight, Layers, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const modules = [
  "Dashboard", "Tarefas", "Criativos", "Métricas", "Chat",
  "Swipe", "Arquivos", "Educacional", "Fluxos",
];

const pipeline = [
  "Analisar copy",
  "Enviar copy p/ expert",
  "Esperando entrega do expert",
  "Copywriter analisar bruto",
  "Enviar para edição",
  "Copy analisar edição",
  "Gestor subir anúncios",
];

const bento = [
  {
    icon: CheckSquare, span: "lg:col-span-2", accent: "from-emerald-400/20 to-transparent",
    title: "Tarefas que se criam sozinhas",
    desc: "Pipeline sequencial de criativos: concluiu uma etapa, a próxima nasce automática — já com responsável, prazo Hoje e prioridade Alta. A seção 'Próxima tarefa' mostra o que vem a caminho.",
    chips: ["7 etapas automáticas", "Prioridade Alta", "Próxima tarefa", "@menções"],
  },
  {
    icon: BarChart3, span: "", accent: "from-cyan-400/20 to-transparent",
    title: "Métricas de Tráfego & VSL",
    desc: "Comparativo automático entre registros, ROAS calculado, Upsell/Downsell dinâmicos.",
    chips: ["ROAS auto", "Tráfego + VSL"],
  },
  {
    icon: Palette, span: "", accent: "from-violet-400/20 to-transparent",
    title: "Criativos",
    desc: "Documentos e anúncios com validação, métricas por criativo e copywriter responsável.",
    chips: ["Validação", "Métricas/anúncio"],
  },
  {
    icon: Highlighter, span: "lg:col-span-2", accent: "from-fuchsia-400/20 to-transparent",
    title: "Swipe",
    desc: "Biblioteca global de referências com transcrição por IA. O vídeo abre no ponto exato da fala — para dissecar o que converte.",
    chips: ["Transcrição por IA", "Vídeo sincronizado", "Biblioteca global"],
  },
  {
    icon: MessageSquare, span: "", accent: "from-sky-400/20 to-transparent",
    title: "Chat da equipe",
    desc: "Conversas por projeto, em tempo real, sem sair da plataforma.",
    chips: ["Tempo real", "Por projeto"],
  },
  {
    icon: GraduationCap, span: "", accent: "from-amber-400/20 to-transparent",
    title: "Educacional",
    desc: "Hub de videoaulas com player embutido, categorias e filtro por autor.",
    chips: ["Player embutido", "Categorias"],
  },
  {
    icon: Archive, span: "", accent: "from-teal-400/20 to-transparent",
    title: "Arquivos",
    desc: "Pastas hierárquicas com cores; tarefas e métricas viram cards dentro dos diretórios.",
    chips: ["Pastas coloridas", "Cards vinculados"],
  },
];

const roles = [
  { role: "Dono", tag: "Acesso total", icon: ShieldCheck, full: true },
  { role: "Copywriter chief", tag: "Acesso total", icon: Users, full: true },
  { role: "Especialista", tag: "Acesso total", icon: Sparkles, full: true },
  { role: "Copywriter research", tag: "Limitado + criar swipe", icon: FileText, full: false },
  { role: "Editor", tag: "Limitado", icon: Palette, full: false },
  { role: "Tráfego", tag: "Limitado + Métricas", icon: TrendingUp, full: false },
];

const themes = [
  { name: "Dark", icon: Moon, ring: "ring-emerald-400/40", bg: "bg-[#0b0d10]", dot: "bg-emerald-400" },
  { name: "Light", icon: Sun, ring: "ring-violet-400/40", bg: "bg-zinc-100", dot: "bg-violet-500" },
  { name: "Special", icon: Sparkles, ring: "ring-teal-400/40", bg: "bg-[#08130f]", dot: "bg-teal-400" },
];

const stats = [
  { value: "10", label: "Módulos integrados" },
  { value: "7", label: "Etapas de criativo automáticas" },
  { value: "6", label: "Níveis de acesso" },
  { value: "3", label: "Temas visuais" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070709] text-zinc-100 antialiased">
      {/* ---------------- Background layers ---------------- */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 lp-grid opacity-[0.9]" />
        <div className="animate-aurora absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-[130px]" />
        <div className="animate-aurora-slow absolute top-20 right-[-140px] h-[560px] w-[560px] rounded-full bg-cyan-500/16 blur-[140px]" />
        <div className="animate-aurora absolute top-[900px] left-1/4 h-[520px] w-[520px] rounded-full bg-violet-500/14 blur-[150px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      </div>

      {/* ---------------- Navbar ---------------- */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#070709]/70 backdrop-blur-xl"
        style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/30 to-cyan-400/10 ring-1 ring-emerald-400/30">
              <Zap className="h-4 w-4 text-emerald-300" />
            </span>
            <span className="text-sm font-bold tracking-tight">ScaleTask</span>
          </div>
          <div className="hidden items-center gap-7 md:flex">
            {["Funcionalidades", "Fluxo", "Acessos"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-xs text-zinc-400 transition-colors hover:text-zinc-100">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-zinc-300 hover:text-white hover:bg-white/5" onClick={() => navigate("/login")}>
              Entrar
            </Button>
            <Button size="sm" className="gap-1.5 border-0 bg-emerald-400 text-xs font-semibold text-emerald-950 hover:bg-emerald-300" onClick={() => navigate("/signup")}>
              Começar grátis <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ---------------- Hero ---------------- */}
      <section className="relative z-10 px-6 pt-36 pb-24">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              A operação de tráfego inteira, em um só lugar
            </span>
          </motion.div>

          <motion.h1 className="mx-auto mt-7 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            Escale sua operação com{" "}
            <span className="lp-neon-text">fluxos que trabalham por você</span>
          </motion.h1>

          <motion.p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            Tarefas automáticas, métricas de tráfego e VSL, criativos, swipe files e
            chat — uma plataforma feita para times de copy e tráfego que escalam de verdade.
          </motion.p>

          <motion.div className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button size="lg" className="h-12 gap-2 border-0 bg-emerald-400 px-8 text-sm font-semibold text-emerald-950 shadow-[0_0_40px_-8px_rgba(74,222,128,0.6)] hover:bg-emerald-300"
              onClick={() => navigate("/signup")}>
              Criar conta gratuita <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 border-white/15 bg-white/[0.02] px-8 text-sm text-zinc-200 hover:bg-white/5 hover:text-white"
              onClick={() => document.getElementById("funcionalidades")?.scrollIntoView({ behavior: "smooth" })}>
              Ver funcionalidades
            </Button>
          </motion.div>
        </div>

        {/* Floating app preview */}
        <motion.div className="relative mx-auto mt-16 max-w-4xl"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div className="absolute -inset-x-8 -top-6 bottom-0 rounded-[28px] bg-gradient-to-b from-emerald-400/10 to-transparent blur-2xl" />
          <div className="lp-border relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c10]/80 p-2 backdrop-blur-xl">
            <div className="grid gap-2 md:grid-cols-[180px_1fr]">
              {/* mini sidebar */}
              <div className="hidden flex-col gap-1 rounded-xl bg-white/[0.02] p-3 md:flex">
                {modules.slice(0, 6).map((m, i) => (
                  <div key={m} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] ${i === 1 ? "bg-emerald-400/15 text-emerald-200" : "text-zinc-400"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-emerald-400" : "bg-zinc-600"}`} />
                    {m}
                  </div>
                ))}
              </div>
              {/* mini content: a task card */}
              <div className="rounded-xl bg-white/[0.02] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200">Hoje</span>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">4 tarefas</span>
                </div>
                <div className="space-y-2">
                  {[
                    { n: "Analisar copy", tags: ["Alta", "Criativo"] },
                    { n: "Enviar copy para expert", tags: ["Alta", "AD01"] },
                    { n: "Copywriter analisar bruto", tags: ["Alta"] },
                  ].map((t, i) => (
                    <div key={t.n} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${i === 0 ? "bg-emerald-400 text-emerald-950" : "bg-white/5 text-zinc-400"}`}>
                        {i === 0 ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className="flex-1 truncate text-[11px] text-zinc-200">{t.n}</span>
                      {t.tags.map((tag) => (
                        <span key={tag} className={`hidden rounded px-1.5 py-0.5 text-[9px] font-medium sm:inline ${tag === "Alta" ? "bg-red-500/20 text-red-300" : "bg-violet-500/20 text-violet-200"}`}>{tag}</span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2">
                  <Zap className="h-3.5 w-3.5 text-emerald-300" />
                  <span className="text-[10px] text-emerald-200">Concluiu uma etapa → próxima tarefa criada automaticamente</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------------- Marquee ---------------- */}
      <section className="relative z-10 overflow-hidden border-y border-white/[0.06] py-5">
        <div className="flex w-max animate-marquee gap-3">
          {[...modules, ...modules].map((m, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 text-xs text-zinc-400">
              <span className="h-1 w-1 rounded-full bg-emerald-400/70" /> {m}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="relative z-10 px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <p className="text-4xl font-bold lp-neon-text md:text-5xl">{s.value}</p>
              <p className="mt-1.5 text-xs text-zinc-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Bento features ---------------- */}
      <section id="funcionalidades" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div className="mx-auto mb-14 max-w-2xl text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">Funcionalidades</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Um módulo para cada dor da operação</h2>
            <p className="mt-4 text-sm text-zinc-400">Nada de inchaço. Cada peça resolve um problema real de quem faz tráfego e copy.</p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bento.map((b, i) => (
              <motion.div key={b.title}
                className={`lp-border lp-glow-hover group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 ${b.span}`}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i % 3}>
                <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${b.accent} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                    <b.icon className="h-5 w-5 text-emerald-300" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-100">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{b.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {b.chips.map((c) => (
                      <span key={c} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-300">{c}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Signature: creative pipeline ---------------- */}
      <section id="fluxo" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div className="mx-auto mb-14 max-w-2xl text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
              <GitBranch className="h-3.5 w-3.5" /> Fluxo automático
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Do documento ao anúncio no ar</h2>
            <p className="mt-4 text-sm text-zinc-400">
              Criou o documento do criativo? A primeira tarefa nasce sozinha. Concluiu? A próxima aparece — sem ninguém abrir chamado.
            </p>
          </motion.div>

          <div className="lp-border relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 md:p-8">
            <div className="space-y-2.5">
              {pipeline.map((step, i) => {
                const isDate = i === 1; // "Enviar copy p/ expert" → popup de data
                return (
                  <motion.div key={step}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 text-[11px] font-bold text-emerald-200 ring-1 ring-emerald-400/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                      <span className="flex-1 text-sm text-zinc-200">{step}</span>
                      <span className="hidden rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-medium text-red-300 sm:inline">Alta</span>
                      {isDate ? (
                        <span className="inline-flex items-center gap-1 rounded bg-cyan-500/15 px-1.5 py-0.5 text-[9px] font-medium text-cyan-200">
                          <Clock className="h-2.5 w-2.5" /> pede data de entrega
                        </span>
                      ) : (
                        <span className="hidden rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-zinc-400 sm:inline">Hoje</span>
                      )}
                    </div>
                    {i < pipeline.length - 1 && (
                      <ChevronRight className="hidden h-4 w-4 shrink-0 text-zinc-600 md:block" />
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-5 text-[11px] text-zinc-400">
              <Flame className="h-3.5 w-3.5 text-emerald-300" />
              Toda tarefa nasce com prazo <b className="mx-1 text-zinc-200">Hoje</b> e prioridade
              <b className="mx-1 text-red-300">Alta</b> — e o responsável já recebe no
              <span className="ml-1 inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5"><Send className="h-3 w-3" /> Telegram</span>.
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Metrics preview ---------------- */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-violet-300">
              <TrendingUp className="h-3.5 w-3.5" /> Métricas
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Tráfego e VSL, lado a lado</h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Registre suas métricas e a plataforma compara os dois últimos períodos automaticamente — com ROAS calculado, Upsell e Downsell dinâmicos. O Dashboard mostra a variação num piscar de olhos.
            </p>
            <ul className="mt-5 space-y-2.5">
              {["ROAS calculado automaticamente", "Comparativo período a período", "Upsell & Downsell dinâmicos"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20"><Check className="h-3 w-3 text-emerald-300" /></span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="lp-border overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0c10]/70 p-5"
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-xs font-medium text-zinc-200">Métricas de Tráfego</span>
              <span className="ml-auto rounded bg-white/5 px-2 py-0.5 text-[9px] text-zinc-400">Comparativo</span>
            </div>
            <div className="space-y-1">
              {[
                { k: "CPM", prev: "R$ 28,40", cur: "R$ 22,10", up: false },
                { k: "CTR", prev: "1,8%", cur: "2,6%", up: true },
                { k: "ROAS", prev: "1,9x", cur: "2,7x", up: true },
                { k: "CPA", prev: "R$ 41,00", cur: "R$ 33,20", up: false },
              ].map((m, i) => (
                <div key={m.k} className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-lg px-3 py-2 text-[11px] ${i % 2 ? "bg-white/[0.02]" : ""}`}>
                  <span className="font-medium text-zinc-200">{m.k}</span>
                  <span className="text-zinc-500">{m.prev}</span>
                  <span className="text-zinc-100">{m.cur}</span>
                  <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold ${m.up ? "bg-emerald-400/15 text-emerald-300" : "bg-cyan-400/15 text-cyan-300"}`}>
                    <TrendingUp className={`h-2.5 w-2.5 ${m.up ? "" : "rotate-180"}`} /> {m.up ? "melhor" : "-22%"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Roles ---------------- */}
      <section id="acessos" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div className="mx-auto mb-12 max-w-2xl text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Acessos
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Cada cargo vê só o que precisa</h2>
            <p className="mt-4 text-sm text-zinc-400">Controle granular por projeto. Sem confusão, sem vazamento de dados sensíveis.</p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {roles.map((r, i) => (
              <motion.div key={r.role}
                className="lp-glow-hover rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${r.full ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-zinc-300"}`}>
                  <r.icon className="h-5 w-5" />
                </span>
                <h4 className="mt-3 text-sm font-semibold text-zinc-100">{r.role}</h4>
                <p className={`mt-1 text-[11px] ${r.full ? "text-emerald-300/90" : "text-zinc-500"}`}>{r.tag}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Themes ---------------- */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
              <Layers className="h-3.5 w-3.5" /> Personalização
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Do seu jeito, em 3 temas</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-zinc-400">Cada pessoa escolhe o tema — salvo na conta e sincronizado entre dispositivos.</p>
          </motion.div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {themes.map((t, i) => (
              <motion.div key={t.name}
                className={`flex w-40 flex-col items-center gap-3 rounded-2xl border border-white/[0.07] p-5 ring-1 ${t.ring}`}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className={`relative h-20 w-full overflow-hidden rounded-xl ${t.bg} ring-1 ring-white/10`}>
                  <span className={`absolute left-3 top-3 h-2 w-2 rounded-full ${t.dot}`} />
                  <span className="absolute left-3 top-7 h-1.5 w-16 rounded-full bg-white/20" />
                  <span className="absolute left-3 top-10 h-1.5 w-10 rounded-full bg-white/10" />
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
                  <t.icon className="h-3.5 w-3.5" /> {t.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative z-10 px-6 py-24">
        <motion.div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-12 text-center"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[520px] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[120px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              Pronto para <span className="lp-neon-text">escalar</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
              Comece grátis e organize sua operação de tráfego em minutos. Sem cartão, sem complicação.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="h-12 gap-2 border-0 bg-emerald-400 px-10 text-sm font-semibold text-emerald-950 shadow-[0_0_44px_-8px_rgba(74,222,128,0.7)] hover:bg-emerald-300"
                onClick={() => navigate("/signup")}>
                Criar minha conta <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 border-white/15 bg-white/[0.02] px-8 text-sm text-zinc-200 hover:bg-white/5 hover:text-white"
                onClick={() => navigate("/login")}>
                Já tenho conta
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
              <Bell className="h-3 w-3" /> Notificações no Telegram incluídas
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-400/15 ring-1 ring-emerald-400/30">
              <Zap className="h-3.5 w-3.5 text-emerald-300" />
            </span>
            <span className="text-xs font-semibold">ScaleTask</span>
          </div>
          <p className="text-[11px] text-zinc-500">© {new Date().getFullYear()} ScaleTask. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
