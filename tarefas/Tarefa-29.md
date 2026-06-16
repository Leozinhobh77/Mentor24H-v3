---
id: 29
titulo: Acessibilidade AAA — aria-pressed, teclado, contraste, alvos
status: todo
modo: forge
expert: acessibilidade-wcag
depende_de: [26, 27]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR (não reescrever, não resumir)

```
┌─ Mentor24h-v3 · executor-20260613-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰▱▱ 4/6  ·  🎨 Forge 4/4                        │
│ 🧠 Expert ativo: acessibilidade-wcag                      │
│ ⏳ AGORA:   Tarefa-29 · a11y AAA                          │
│ ✅ Aceite:  contraste AAA + teclado 100%                  │
│ ⏭️ PRÓXIMA: Tarefa-30 · construir o arquivo              │
└───────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar. Ao concluir, reimprima com ✅ e barra avançada.

## O que é
Garantir que a tela é **acessível de verdade** (WCAG AAA no que cabe a um mockup), especificando os requisitos pro frontend-dev (Tarefa-30).

## Etapas (ordem natural 1→n)
- [ ] 1. **Cards-filtro semânticos:** cada um é `<button type="button" aria-pressed="true|false">` (não `<div>`); estado ativo reflete no `aria-pressed`.
- [ ] 2. **Collapse "Pagas":** botão com `aria-expanded` + `aria-controls` apontando pro grupo.
- [ ] 3. **Teclado:** tudo navegável por Tab na ordem lógica; Enter/Espaço ativam; foco SEMPRE visível (anel de foco, não remover outline sem substituir).
- [ ] 4. **Contraste AAA:** conferir texto/ícone vs fundos `soft` (income/expense/warning/brand) — ajustar para ≥7:1 em texto normal (ou usar a cor "forte" do par token quando o soft não passar).
- [ ] 5. **Alvos de toque:** cada card-filtro e botão ≥44×44px de área clicável.
- [ ] 6. **Leitura:** valores monetários com rótulo associado (ex.: aria-label "A pagar: R$ 2.112,60") pra leitor de tela não ler só o número solto.

## ✅ Critério de aceite (self-check com evidência)
- [ ] Cards usam `<button aria-pressed>`; collapse usa `aria-expanded`.
- [ ] Navegação 100% por teclado com foco visível.
- [ ] Contraste de texto ≥7:1 (AAA) nas combinações usadas.
- [ ] Alvos ≥44px.

## 📂 Escopo
Mexe: requisitos a11y (atributos ARIA + ajustes de contraste no HTML/CSS da Tarefa-30) · NÃO toca: nada fora de `_mockups\` 🔒
