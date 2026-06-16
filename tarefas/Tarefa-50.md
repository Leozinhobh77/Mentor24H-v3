---
id: 50
titulo: Toggle Mês/Semana — centralizar ao meio + aumentar um pouco (mesmo estilo, sem mudar a formatação)
status: todo
modo: forge
expert: ui-visual-designer
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-002 ───────────────────┐
│ 🔄 RUN ▰░░░░ 2/5  ·  🎨 Forge 2/4                          │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-50 · Toggle Mês/Semana                 │
│ ✅ Aceite:  centralizado + maior, mesmo design            │
│ ⏭️ PRÓXIMA: Tarefa-51 · Card Mentor (rodapé)              │
└───────────────────────────────────────────────────────────┘
```

## O que é
O toggle `Mês/Semana` (`.fin-view-toggle`/`.fin-vtab`, `js/pessoal/03-contas.js` l.310-312) está ok,
mas pequeno e desalinhado. **NÃO mudar a formatação/estilo** — só **centralizar** no card e **aumentar um pouco**.

## Etapas
- [ ] 1. **Centralizar** o `.fin-view-toggle` horizontalmente no card-dashboard (margin auto / justify center).
- [ ] 2. **Aumentar um pouco** — altura/padding e tamanho do texto um tom acima (sem exagero).
- [ ] 3. **Preservar** o design atual: mesmo formato segmentado, "ativo destaca", deslizar/realce — só escala+posição.

## ✅ Critério de aceite
- [ ] Toggle centralizado no card e visivelmente um pouco maior.
- [ ] Estilo/cores/comportamento idênticos ao atual (só tamanho+posição mudaram).
- [ ] Sem overflow 360/1280; alterna Mês↔Semana normal; console 0.

## 📂 Escopo
Mexe: `css/estilo.css` (`.fin-view-toggle`/`.fin-vtab`, ajuste de tamanho+centralização) · markup só se necessário (wrapper).
🔒 NÃO toca: lógica do `viewMode` (l.5/205/343), Transacoes, negocio.
