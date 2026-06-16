---
id: 38
titulo: Filtros expansíveis (busca + categoria) atrás do botão "Filtros"
status: todo
modo: construtor
expert: frontend-dev
depende_de: [33]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 7/9  ·  🔨 Construtor 5/6                   │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-38 · Filtros expansíveis               │
│ ✅ Aceite:  botão Filtros abre busca + categoria          │
│ ⏭️ PRÓXIMA: Tarefa-39 · Faixa do Mentor                   │
└───────────────────────────────────────────────────────────┘
```

## O que é
Um botão "Filtros" (ícone discreto) que expande um painel com busca por texto (descrição) +
filtro por categoria (`CATS`). Fechado por padrão (tela limpa). Os cards A pagar / A receber /
Vencidas continuam como filtro rápido sempre visível.

## Etapas
- [ ] 1. Botão "Filtros" (toggle) que abre/fecha o painel (animação suave, `aria-expanded`).
- [ ] 2. Painel: input de busca (filtra por `descricao`, case-insensitive) + select de categoria (`CATS`).
- [ ] 3. Combinar com o filtro ativo dos cards e com o mês corrente (filtros se somam).
- [ ] 4. Indicador de "filtro ativo" no botão quando busca/categoria estiverem aplicadas; limpar fácil.

## ✅ Critério de aceite
- [ ] Busca e categoria filtram a lista corretamente, combinando com cards + mês.
- [ ] Painel fechado por padrão; abre/fecha sem quebrar layout (360 ok).
- [ ] zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (botão + painel + filtro) · NÃO toca: outros módulos 🔒
