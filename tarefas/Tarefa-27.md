---
id: 27
titulo: Cards-filtro + collapse "Pagas" + micro-fade + estados
status: todo
modo: forge
expert: interaction-designer
depende_de: [26]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR (não reescrever, não resumir)

```
┌─ Mentor24h-v3 · executor-20260613-001 ───────────────────┐
│ 🔄 RUN ▰▰▱▱▱▱ 2/6  ·  🎨 Forge 2/4                        │
│ 🧠 Expert ativo: interaction-designer                     │
│ ⏳ AGORA:   Tarefa-27 · estados + microinteração          │
│ ✅ Aceite:  filtra sem "pulo"; Pagas abre/fecha           │
│ ⏭️ PRÓXIMA: Tarefa-28 · microcopy                         │
└───────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar. Ao concluir, reimprima com ✅ e barra avançada.

## O que é
Definir o **comportamento e os estados** da tela: os 3 mini-cards viram **filtros**, o grupo "Pagas" recolhe, e tudo transita suave. Especificação para o frontend-dev (Tarefa-30).

## Etapas (ordem natural 1→n)
- [ ] 1. **Cards-filtro (exclusivo):** tocar "A pagar" → filtra tipo=pagar · "A receber" → tipo=receber · "Vencidas" → status=vencida. Tocar o card ativo de novo → limpa (volta "Todas").
- [ ] 2. **Estado ativo:** card selecionado ganha borda `--brand` + bg `--brand-soft`; os outros ficam neutros. Só 1 ativo por vez.
- [ ] 3. **Hover/focus:** elevação sutil (`--shadow-sm` → `--shadow-md`) + cursor pointer; foco visível (anel) pra teclado.
- [ ] 4. **Collapse "Pagas":** recolhido por padrão (decisão 3a); seta ⌄ gira ao abrir; transição de altura/opacidade suave.
- [ ] 5. **Micro-fade ao filtrar:** a lista faz fade 150ms (`opacity`) na troca — **sem reflow/"pulo"** de layout (não animar height de forma que empurre o resto; trocar conteúdo com a área estável).
- [ ] 6. **Estados vazios por filtro:** quando o filtro não tem itens, mostrar `.empty` (ex.: "Nada a receber em aberto").
- [ ] 7. **Vencidas = 0:** card neutro/apagado (`--text-3`), sem alarme falso (decisão 2a).

## ✅ Critério de aceite (self-check com evidência)
- [ ] Trocar de filtro NÃO causa "pulo" de layout (transição suave, área estável).
- [ ] Só 1 card ativo por vez; tocar o ativo limpa o filtro.
- [ ] "Pagas" abre e fecha; seta reflete o estado.
- [ ] Todo filtro sem resultado mostra estado vazio claro.

## 📂 Escopo
Mexe: spec de estados + microinterações (CSS de transição + comportamento) consumido na Tarefa-30 · NÃO toca: nada fora de `_mockups\` 🔒
