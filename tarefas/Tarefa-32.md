---
id: 32
titulo: CSS do componente fin-* (namespaced) da tela Finanças Pessoal
status: todo
modo: forge
expert: ui-visual-designer
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260614-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░ 1/9  ·  🎨 Forge 1/2                        │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-32 · CSS componente fin-* namespaced   │
│ ✅ Aceite:  classes novas sem colidir com .fin-card(1285) │
│ ⏭️ PRÓXIMA: Tarefa-33 · Render base + cards-filtro        │
└───────────────────────────────────────────────────────────┘
```

## O que é
Portar para `css/estilo.css` as classes do componente da tela Finanças (referência visual:
`_mockups/mockup-financas.html`), **com prefixo/escopo próprio** para NÃO colidir com a classe
`.fin-card` já existente (linha 1285 = card do Financeiro do Negócio). Tudo via tokens.

## Etapas
- [ ] 1. Escolher estratégia anti-colisão: prefixo `.finp-*` OU escopo `#contas-root .fin-*`. Documentar a escolha no topo do bloco CSS.
- [ ] 2. Criar classes: resumo/hero (Saldo previsto), sub-linha "ritmo" (Reserva por dia), donut, barra de proporção (mobile), tira de cards-filtro, header de grupo Vencidas, header de semana (com chip + subtotal + pílula "/dia" + estado "ESTA SEMANA"), grupo Pagas recolhível, estado vazio, botão "Filtros" + painel expansível, faixa do Mentor.
- [ ] 3. Reusar `.lrow`/`.li`/`.lt`/`.lacts` existentes para as linhas (mantém as ações).
- [ ] 4. Responsivo até 360px (sem overflow, sem sobreposição); donut some no mobile e vira barra slim.

## ✅ Critério de aceite
- [ ] Nenhuma regra nova sobrescreve/colide com `.fin-card` (1285) — tela do Negócio intacta.
- [ ] 100% via tokens (zero cor/spacing hardcoded).
- [ ] Sem overflow em 1280 e 360, tema claro e escuro.
- [ ] zero erro no console.

## 📂 Escopo
Mexe: `css/estilo.css` (apenas adições, no fim do arquivo ou seção própria) · NÃO toca: `.fin-card`(1285), demais classes do Negócio 🔒
