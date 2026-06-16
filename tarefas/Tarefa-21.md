---
id: 21
titulo: Redesign visual da tela Mentor — experiência própria por modo
status: todo
modo: forge
expert: frontend-design
depende_de: 20
---

## O que é
Com base na pesquisa (Tarefa-20), **redesenhar a tela Mentor** (`#mentor-root`) elevando-a ao nível premium do resto do app (dashboard 3 zonas, sidebar accordion, KPIs). Hoje os 3 modos compartilham o **mesmo feed plano filtrado** — o redesign dá **experiência/layout próprio por modo**. Esta tarefa é **design/especificação visual** (proposta + tokens + estados); a implementação é a Tarefa-22.

## Etapas
1. Definir a **anatomia nova** da tela: cabeçalho (saudação + tom), **spotlight** do insight #1, feed **agrupado** (por domínio e/ou severidade), "+N" **expansível**, estado vazio premium.
2. Especificar a **diferença por modo** (a parte central do pedido):
   - **Pessoal** — tom acolhedor, agrupar por área de vida; destaque saúde/hábitos/agenda.
   - **Negócio** — orientado a ação/dinheiro; destaque fiado/estoque/DAS/metas; ações rápidas (WhatsApp, marcar pago).
   - **Híbrido** — duas faixas/seções (Pessoal | Negócio) sem virar ruído; priorização clara.
3. Reusar **tokens existentes** (`--s-*`, `--teal`, `--surface-1`, `--border`, `--r-lg`, `--ease`, `--expense/--warning/--income/--info`) e a linguagem dos componentes premium já no app. Zero cor/spacing hardcoded.
4. Garantir **responsivo sem overflow e sem sobreposição** (desktop + mobile 360px) e alinhamento/espaçamento coerentes com dash 3 zonas.
5. Entregar a **spec visual** em `tarefas/componentes/spec-tela-mentor.md`: layout por modo, classes CSS novas/reusadas, estados (normal/expandido/vazio), micro-interações.

## ✅ Critério de aceite
- Spec cobre os **3 modos** com layout próprio (não a mesma casca filtrada).
- Lista classes a reusar vs novas; nada hardcoded; contraste AA garantido.
- Especifica responsivo (breakpoints) e zero sobreposição/overflow.
- Mantém o **motor de regras e a voz** intactos (só apresentação).

## 📂 Escopo
- **Mexe / cria:** `tarefas/componentes/spec-tela-mentor.md` (novo). Pode anotar trechos CSS-alvo de `css/estilo.css` (.mtr-*, .brf-*, linhas ~313–333+).
- **NÃO toca código ainda** (implementação é Tarefa-22). **NÃO toca:** motor de regras nem `fraseDe`/NUC/AB/FE/HUMOR.
