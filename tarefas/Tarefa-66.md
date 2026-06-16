---
id: 66
titulo: HTML — renomear "Início" → "Painel Pessoal" + ícones únicos nos headers de categoria
status: todo
modo: construtor
expert: frontend-dev
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-006 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-66 · HTML ícones + renomear           │
│ ✅ Aceite:  ícones visíveis, texto "Painel Pessoal"       │
│ ⏭️ PRÓXIMA: Tarefa-67 · CSS card premium                  │
└───────────────────────────────────────────────────────────┘
```

## O que é
Ajustes cirúrgicos no `index.html`: renomear o item standalone e adicionar ícones SVG
nos headers de categoria da sidebar (hoje sem ícone, quebrando harmonia com Painel Pessoal e Mentor).

## Etapas

- [ ] 1. Em `index.html` l.35, trocar `<span>Início</span>` por `<span>Painel Pessoal</span>`.
         Não tocar: `data-nav="dashboard"`, `data-ctx="pessoal"`, `class="nav-item nav-standalone"`.

- [ ] 2. Adicionar `{i:link}` no header de **Conexões** (l.38-40), ANTES do `<span class="nav-label">`,
         dentro de um `<svg class="nav-cat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">`.
         Usar o path do ícone `link` do ICONS do core.js.

- [ ] 3. Idem para as demais categorias pessoais:
         - Dinheiro (l.50-52) → `{i:card}`
         - Rotina (l.64-66) → `{i:zap}`
         - Cultura (l.77-79) → `{i:star}`

- [ ] 4. Idem para as categorias de negócio (ocultas por padrão, mas presentes no HTML):
         - Operação (l.91-94) → `{i:briefcase}`
         - Gestão (l.104-107) → `{i:layers}`
         - Resultado (l.116-119) → `{i:trendup}`

- [ ] 5. O header "Assistente" (l.127-130) é estático (sem chevron, sem accordion).
         Não adicionar ícone aqui — o item Mentor dentro já tem `{i:spark}`.

- [ ] 6. Abrir o app e confirmar visualmente: texto "Painel Pessoal" aparece, ícones visíveis nos headers.

## ✅ Critério de aceite
- [ ] "Painel Pessoal" aparece onde era "Início" (sidebar modo pessoal).
- [ ] Todos os 7 headers de categoria têm ícone (Conexões · Dinheiro · Rotina · Cultura · Operação · Gestão · Resultado).
- [ ] Ícones renderizam (não aparecem como `{i:link}` literal — o boot do core.js substitui).
- [ ] Nenhuma outra parte da sidebar mudou.

## 📂 Escopo
Mexe: `index.html` (sidebar, l.24–140). 🔒 Não tocar: CSS · JS · qualquer outra parte do HTML.
