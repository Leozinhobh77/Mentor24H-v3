# Pesquisa UX/UI 2026 — Tela Mentor (Insights/Digest)
> Tarefa-20 · executor-20260612-001 · pesquisador
> Alimenta o redesign (Tarefa-21 / spec-tela-mentor.md)

---

## 1. Top Tendências 2026 para Telas de Insight/Digest

### 1.1 Progressive Disclosure (hierarquia em camadas)
- **Princípio central de 2026**: exibir só o que é relevante agora; revelar o resto sob demanda.
- Na prática: spotlight (#1 insight) sempre visível → feed secundário expandível com "+N" → detalhe em modal ou nav.
- Combate diretamente o "notification fatigue" — usuário vê complexidade só quando quer.
- Fonte: UXPin, IxDF, Tim Graf UX 2026.

### 1.2 Spotlight / Hero Card
- O insight mais crítico ocupa posição privilegiada (destaque visual diferente, maior, mais cor).
- Padrão em apps de produtividade e fintech 2025–2026 (Apple Card, Headspace, apps de CRM).
- O spotlight **não é só o primeiro card**: tem tratamento visual próprio — borda mais grossa, fundo elevado, ação principal visível sem scroll.
- Card normal: borda lateral colorida + ícone. Spotlight: bloco maior com background soft + badge de severidade + botão CTA em destaque.

### 1.3 Agrupamento por Tema / Severidade
- Feeds com 6+ itens sem agrupamento causam abandono (cognitive overload).
- Padrão 2026: agrupar por domínio (saúde, finanças, tarefas...) OU por severidade (crítico > atenção > oportunidade > info), com cabeçalhos de seção colapsáveis.
- Bento Grid: blocos de tamanhos diferentes por prioridade — item crítico = bloco largo, itens info = linha compacta.

### 1.4 Estado Vazio Premium
- Empty states genéricos ("sem dados") saem; entram estados com personalidade, animação leve e mensagem acolhedora.
- Tom por persona: wellness = celebração ("Tudo em ordem — você está mandando bem!"); negócio = oportunidade ("Nenhum alerta — boa hora pra checar metas").

### 1.5 Densidade Adaptativa por Contexto
- Modo pessoal/bem-estar: espaçamento generoso, font maior, baixa densidade → sensação de calma.
- Modo negócio: densidade maior, botões de ação diretos, métricas numéricas em destaque → ação rápida.
- Híbrido: densidade intermediária com separação visual clara entre os dois domínios.

### 1.6 Micro-interações e Feedback Imediato
- "Dispensar" deve dar feedback visual (card desliza ou faz fade, não some abruptamente).
- Expandir "+N" com animação suave (max-height transition).
- Tom toggle: botão ativo com estado visual diferente e transição de cor.

### 1.7 Ações Rápidas Contextuais
- Apps fintech líderes (2026): cada card expõe a ação mais relevante diretamente — não esconde atrás de "ver mais".
- Para negócio: "Cobrar fiado", "Pagar DAS", "Ver estoque" — visíveis no card.
- Para pessoal: "Marcar feito", "Ver treinos", "Abrir meta" — discretos mas acessíveis.

---

## 2. Referências Reais Aplicáveis

| App | O que faz bem |
|-----|---------------|
| Apple Card | Spotlight de gasto crítico com CTA direto; chips de categoria; linguagem explicável ("por que esse alerta?") |
| Headspace/Calm | Empty state premium com celebração; ton acolhedor que não cobra |
| Notions AI Digest | Agrupamento por domínio; "+N" progressivo; densidade compacta mas legível |
| Fintech dashboards (2026) | Card colorido por severidade; ação principal visível; white space generoso para reduzir stress |

---

## 3. Tradução por Modo — Recomendações Concretas

### 3.1 MODO PESSOAL 🏠
**Persona**: Léo em modo vida pessoal — saúde, hábitos, agenda, aprendizado, treino.
**Sentimento alvo**: acolhedor, encorajador, sem cobrança excessiva.

**O que mudar na tela:**
- **Saudação expandida**: além de "Bom dia, Léo 👋" + resumo, adicionar **sub-linha contextual por hora** ("Sua tarde de quarta — veja o que está pendente").
- **Agrupamento por área de vida** (não por severidade): Saúde & Bem-estar · Hábitos & Rotina · Agenda & Tarefas · Aprendizado & Leitura. Cabeçalho de seção com ícone e contagem.
- **Spotlight**: o primeiro insight crítico/atenção recebe bloco destacado com fundo `--surface-2` + borda `--teal` + CTA visível.
- **Feed**: cards compactos dentro de cada grupo; crítico no topo do grupo, não do feed inteiro.
- **"+N"**: texto empático — "Ver mais X situações menos urgentes" (não "avisos de menor prioridade").
- **Vazio**: "Tudo em dia, Léo! ✨ Aproveita pra focar no que importa." + ícone spark.
- **Dispensar**: fade-out suave; o card não "desaparece brutal".
- **Densidade**: espaçamento `--s-4` entre cards, padding interno generoso (`--s-4 var(--s-5)`).

**Wireframe textual — Pessoal:**
```
┌─────────────────────────────────────────┐
│  👋 Boa tarde, Léo                      │
│  Você tem 5 avisos — 1 crítico          │
│  [🤝 Sério] [😎 Descontraído] [💪 Motiv]│
├─────────────────────────────────────────┤
│ ★ SPOTLIGHT (crítico/atenção mais alto) │
│ ┌───────────────────────────────────┐   │
│ │ 🔴 ícone  Título do insight       │   │
│ │           Texto explicativo...    │   │
│ │           [Ação principal]        │   │
│ └───────────────────────────────────┘   │
├─────────────────────────────────────────┤
│ 🏃 Saúde & Bem-estar  (2)              │
│  ├─ card 1                              │
│  └─ card 2                              │
├─────────────────────────────────────────┤
│ 📅 Agenda & Tarefas  (1)               │
│  └─ card 1                              │
├─────────────────────────────────────────┤
│   ▼ Ver mais 2 avisos de info           │
└─────────────────────────────────────────┘
```

---

### 3.2 MODO NEGÓCIO 💼
**Persona**: Léo gerenciando Pizza e Cia BH — fiado, estoque, DAS/MEI, encomendas, metas.
**Sentimento alvo**: ação rápida, dinheiro à vista, zero ambiguidade.

**O que mudar na tela:**
- **Saudação compacta**: "Léo · Negócio · 15:00 — 3 pendências hoje". Menos poético, mais executivo.
- **Agrupamento por área de negócio**: 💸 Financeiro · 📦 Estoque & Produtos · 📋 Encomendas & Clientes · 🏛️ MEI & Fiscal. Cabeçalho com badge de contagem e valor total (ex: "💸 Financeiro (2) · R$ 340 em aberto").
- **Spotlight**: obrigatoriamente o item mais urgente de dinheiro (fiado vencido, DAS próximo, meta em risco). CTA em botão sólido (não outline) — "Cobrar agora", "Pagar DAS".
- **Feed**: cards com métrica numérica visível no título ("R$ 120 de fiado com Maria"). Botão de ação direto, visível sem scroll/expand.
- **"+N"**: "Ver mais X avisos menos urgentes →" (link simples, não bloco).
- **Vazio**: "Negócio em dia! Nenhum alerta urgente. Bom momento pra ver suas metas." + botão "Ver Metas →".
- **Densidade**: mais compacta — padding `--s-3 var(--s-4)`, gap entre cards 8px.

**Wireframe textual — Negócio:**
```
┌─────────────────────────────────────────┐
│  💼 Léo · Negócio · 15:00              │
│  3 itens pedindo atenção hoje           │
│  [🤝 Sério] [😎 Descontraído] [💪 Motiv]│
├─────────────────────────────────────────┤
│ ★ SPOTLIGHT                             │
│ ┌───────────────────────────────────┐   │
│ │ 🔴 💸  DAS MEI vence em 3 dias    │   │
│ │        R$ 76,50 · competência Mai │   │
│ │        [Pagar DAS]                │   │
│ └───────────────────────────────────┘   │
├─────────────────────────────────────────┤
│ 💸 Financeiro  (2) · R$ 340 em aberto  │
│  ├─ 🟡 R$ 220 fiado · João Silva       │  [Cobrar]
│  └─ 🟡 R$ 120 fiado · Maria Costa     │  [Cobrar]
├─────────────────────────────────────────┤
│ 📦 Estoque  (1)                         │
│  └─ 🟠 Mussarela abaixo do mínimo      │  [Ver]
├─────────────────────────────────────────┤
│   Ver mais 1 aviso →                    │
└─────────────────────────────────────────┘
```

---

### 3.3 MODO HÍBRIDO 🔄
**Persona**: Léo alternando vida pessoal + negócio, quer ver os dois sem virar caos.
**Sentimento alvo**: visão integrada, separação clara, sem ruído cruzado.

**O que mudar na tela:**
- **Saudação**: "Léo · Modo Híbrido — Pessoal + Negócio". Resumo separado: "X pessoal · Y negócio".
- **Layout em 2 faixas** (não misturado): primeira faixa = insights Negócio (urgência executiva); segunda faixa = insights Pessoal (bem-estar). Cada faixa com cabeçalho separador e cor de acento própria.
- **Spotlight único** do item mais crítico (qualquer domínio), com tag de origem ("NEGÓCIO" / "PESSOAL") em chip sobre o card.
- **Separador visual** entre as faixas: linha `--border` + label de contexto ("Sua vida pessoal ↓").
- **"+N"** por faixa, não global.
- **Vazio**: "Tudo em dia em ambos os mundos! ✨" — reconhece os dois contextos.
- **Densidade**: intermediária (entre Pessoal e Negócio).

**Wireframe textual — Híbrido:**
```
┌─────────────────────────────────────────┐
│  🔄 Léo · Híbrido · Tarde              │
│  2 pessoal · 3 negócio                 │
│  [🤝 Sério] [😎 Descontraído] [💪 Motiv]│
├─────────────────────────────────────────┤
│ ★ SPOTLIGHT  [chip: NEGÓCIO]            │
│ ┌───────────────────────────────────┐   │
│ │ 🔴 DAS vence em 3 dias            │   │
│ │    [Pagar DAS]                    │   │
│ └───────────────────────────────────┘   │
├─── 💼 NEGÓCIO (2 restantes) ───────────┤
│  ├─ card negócio 1                      │
│  └─ card negócio 2                      │
│   ▼ Ver mais 1 negócio                  │
├─── 🏠 PESSOAL (2) ─────────────────────┤
│  ├─ card pessoal 1                      │
│  └─ card pessoal 2                      │
└─────────────────────────────────────────┘
```

---

## 4. Restrições a Respeitar no Redesign

- **Motor de regras intacto**: `REGRAS`, `rodarRegras`, `filtraModo`, `briefing`, `contarCriticos` — só apresentação.
- **A VOZ**: `fraseDe`, `NUC`, `AB`, `FE`, `HUMOR`, `tom` — não tocar. O tom toggle permanece.
- **API pública**: `render`, `contarCriticos`, `briefing`, `feed` — assinaturas inalteradas.
- **Tokens only**: zero cor/spacing hardcoded. Usar `--s-*`, `--teal`, `--surface-*`, `--border`, `--r-*`, `--ease`, `--expense/--warning/--income/--info (+ -soft)`.
- **Responsivo**: desktop 1280px + mobile 360px, sem overflow nem sobreposição.
- **`briefingHTML`/`pintaBriefingDash`**: seguem funcionando (usam API pública — não quebram).

---

## 5. Decisões de Implementação (para Tarefa-22)

| Decisão | Escolha |
|---------|---------|
| Agrupamento Pessoal | Por área de vida (modulo → grupo) |
| Agrupamento Negócio | Por área de negócio (modulo → grupo) + valor monetário no cabeçalho se disponível |
| Agrupamento Híbrido | Duas faixas: Negócio primeiro, Pessoal depois |
| Spotlight | Sempre o primeiro da lista (mais crítico/alto) — igual ao briefing |
| "+N" expansível | `<details>` nativo ou div.mtr-expand com toggle JS (max-height animation) |
| Persistir dispensados | `localStorage.setItem('mentor.dispensados', JSON.stringify([...dispensados]))` + reidratação no load |
| Grupos sem itens | Não renderizar o cabeçalho de grupo (grupo vazio → hidden) |
| Densidade Pessoal | padding: `var(--s-4) var(--s-5)` · gap: 10px |
| Densidade Negócio | padding: `var(--s-3) var(--s-4)` · gap: 8px |
| Densidade Híbrido | padding: `var(--s-4) var(--s-4)` · gap: 9px |

---
*Fontes: UXPin (Progressive Disclosure, Dashboard Principles), IxDF, Codewave UX Trends 2026, Promodo UX/UI Trends, WildNetEdge Fintech UX, ProCreator Finance App Design, Muzli Blog Mobile Patterns 2026.*
