---
id: 26
titulo: Bloco fin-resumo — hero "Saldo previsto" + donut + tira 3-em-linha + grupos
status: todo
modo: forge
expert: ui-visual-designer
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR (não reescrever, não resumir)

```
┌─ Mentor24h-v3 · executor-20260613-001 ───────────────────┐
│ 🔄 RUN ▰▱▱▱▱▱ 1/6  ·  🎨 Forge 1/4                        │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-26 · Bloco fin-resumo (hero+donut+tira)│
│ ✅ Aceite:  hierarquia clara + tokens, zero hardcode      │
│ ⏭️ PRÓXIMA: Tarefa-27 · cards-filtro + collapse + fade    │
└───────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar. Ao concluir, reimprima com ✅ e barra avançada.

## O que é
Especificar e estruturar o **componente visual `fin-resumo`** da nova tela Finanças, dentro do mockup. É a planta visual que o frontend-dev (Tarefa-30) materializa. Resolve o "cards mal feitos/desconfigurados" unificando tudo num bloco com hierarquia clara.

Anatomia (cima → baixo):
1. **Hero "Saldo previsto"** — número grande `var(--mono)` tabular, cor por sinal (`--income` se +, `--expense` se −); subtítulo `entra R$X · sai R$Y` em `--text-3`. À direita, o **donut** (receber × pagar).
2. **Tira 3-em-linha** — A pagar · A receber · Vencidas (mini-cards lado a lado).
3. **Lista agrupada** — grupos por vencimento, cada header com dot colorido + rótulo + chip count + **subtotal mono à direita**.

## Etapas (ordem natural 1→n)
- [ ] 1. Definir a hierarquia tripla: 1 número-herói > 3 mini-cards (médios) > linhas da lista. O olho bate primeiro no saldo.
- [ ] 2. Especificar o layout do hero: número + sinal + subtítulo à esquerda; donut à direita (desktop). No mobile (≤640px) o donut vira **barra de proporção slim** (não comer altura).
- [ ] 3. Especificar a tira: 3 colunas iguais, cada uma com chip-ícone + label uppercase 10.5px + valor mono. Mantém-se **lado a lado** no mobile (não empilha).
- [ ] 4. Especificar os grupos: reusar `.daygroup` (rótulo) + `.lrow` (linhas) do app; header de grupo com subtotal alinhado à direita; Vencidas com leve acento `--expense` na linha.
- [ ] 5. Definir TODAS as classes novas escopadas em `.fin-resumo*`, usando só tokens (`--s-*`, `--r-*`, `--surface-*`, `--shadow-*`, cores semânticas). Entregar como `<style>` inline pronto pro mockup.

## ✅ Critério de aceite (self-check com evidência)
- [ ] Hierarquia visível: saldo domina, tira é secundária, lista é o corpo — sem competição visual.
- [ ] Fiel ao "Quiet Premium teal" (usa os mesmos tokens/superfícies do app).
- [ ] ZERO cor/spacing/radius hardcoded — tudo via `var(--token)`.
- [ ] Spec entregue pronta pra Tarefa-30 (classes + estrutura HTML descritas).

## 📂 Escopo
Mexe: spec visual + `<style>` `.fin-resumo*` (consumido na Tarefa-30, dentro de `_mockups\mockup-financas.html`) · NÃO toca: nada fora de `_mockups\`; não edita `css\estilo.css` (só referência) 🔒
