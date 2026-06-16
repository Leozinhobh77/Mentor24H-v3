---
id: 69
titulo: Smoke Playwright real + auditoria sidebar redesign (3 níveis · ícones · divisórias · bug fix · overflow 0 · regressão)
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [66, 67, 68]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-006 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-69 · Smoke real + auditoria sidebar    │
│ ✅ Aceite:  tudo VERDE com evidência                      │
│ ⏭️ PRÓXIMA: — (fim do run)                                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Provar o redesign da sidebar com **smoke Playwright REAL** (Python, instalado).
Sem maquiar: console 0, overflow 0px, evidência por asserção. Falha → reportar.

## Etapas

- [ ] 1. **Painel Pessoal ativo** — ao carregar o app (dashboard pessoal), `.nav-standalone.active` existe
         e tem `border-left` teal e `box-shadow` (glow). Texto "Painel Pessoal" visível.

- [ ] 2. **Nível 2 — categoria acesa** — clicar em "Finanças" na sidebar:
         - `#sidebar .nav-group.active-parent` existe para o grupo Dinheiro.
         - O header do grupo Dinheiro tem `background` teal suave e `box-shadow` não nulo.
         - Dot `::after` visível (verificar via computed style).

- [ ] 3. **Nível 1 — subcategoria discreta** — item Finanças tem `.active`:
         - `background` transparente (sem fundo teal forte).
         - `color` é brand-text.
         - `box-shadow` não tem `inset 3px 0 0` (barra lateral foi substituída pelo dot ::before).

- [ ] 4. **Ícones nas categorias** — verificar que os 7 headers têm `<svg>` com classe `nav-cat-icon`.
         Nenhum texto `{i:link}` literal visível (foram substituídos pelo boot).

- [ ] 5. **Divisórias** — verificar que há `border-bottom` entre as categorias (computed style).

- [ ] 6. **Bug fix desktop** — clicar no botão "Negócio" da topbar (`.mode-switch button[data-mode="negocio"]`):
         verificar que a página dashboard fica ativa (`[data-page="dashboard"].show`).

- [ ] 7. **Mentor aceso** — navegar para Mentor: grupo Assistente ganha `.active-parent`, item Mentor ativo.

- [ ] 8. **Responsivo** — 360px e 1280px, claro + escuro: overflow **0px**, sem sobreposição.
         Sidebar mobile (drawer): card premium não vaza, padding correto.

- [ ] 9. **Regressão** — accordion abre/fecha normalmente; router funciona (Finanças → página Finanças);
         brand area intacta; side-foot intacto; outras páginas (Metas, Mentor, Contatos, Negócio) sem erro.
         Console **0 erros**.

- [ ] 10. Ficha do componente em `tarefas\componentes\` + 2 screenshots (360 + 1280).

## ✅ Critério de aceite
- [ ] Nível 2 (categoria): card teal aceso com glow e dot. Nível 1 (subcategoria): discreta, dot 4px.
- [ ] Ícones renderizados (não literal). Divisórias presentes.
- [ ] Desktop: trocar modo navega ao dashboard. Mobile: sem regressão.
- [ ] Console **0**; overflow **0px** (1280+360, claro+escuro); sem regressão.
- [ ] Falha → reportar (não marcar pronto).

## 📂 Escopo
Mexe: `smoke-*.py` + `tarefas\componentes\` + screenshots. 🔒 Read-only no app.
