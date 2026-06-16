---
id: 73
titulo: Smoke Playwright real + auditoria Sidebar R2 (Painel Negócios · active duplo · hierarquia · FAB · overflow 0 · regressão)
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [70, 71, 72]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260616-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: smoke-visual-tester                      │
│ ⏳ AGORA:   Tarefa-73 · Smoke real + auditoria Sidebar R2 │
│ ✅ Aceite:  tudo VERDE com evidência                      │
│ ⏭️ PRÓXIMA: — (fim do run)                                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Provar a Sidebar R2 com **smoke Playwright REAL** (Python, instalado).
Sem maquiar: console 0, overflow 0px, evidência por asserção. Falha → reportar.

## Etapas

- [ ] 1. **Painel Negócios standalone** — trocar para modo negócio:
         `.nav-item.nav-standalone[data-ctx="negocio"]` existe e está visível.
         NÃO está dentro de `.nav-group` (confirmar com `.closest('.nav-group')` = null).

- [ ] 2. **Painel Pessoal ausente no modo negócio** —
         `.nav-item.nav-standalone[data-ctx="pessoal"]` está com display:none.

- [ ] 3. **Modo híbrido** — ambos os standalones visíveis:
         Pessoal no topo geral, Negócios logo após o separador ".nav-mode-sep".

- [ ] 4. **Active duplo resolvido** — no modo pessoal, navegar ao dashboard:
         Só 1 elemento com classe `.active` e `data-nav="dashboard"` (o Pessoal).
         No modo negócio: só o Negócios tem `.active`.

- [ ] 5. **Hierarquia visual** — comparar computed styles:
         `.nav-group-header` padding-top/bottom ≥ 10px.
         `.nav-group .nav-item` padding-top/bottom ≤ 7px.
         Categoria visivelmente mais alta/robusta que subcategoria.

- [ ] 6. **Subcategoria ativa discreta** — clicar em Finanças:
         `.nav-group .nav-item.active` tem opacity < 1 e background transparente (sem fundo forte).

- [ ] 7. **FAB ausente** — `#fab-main` não existe no DOM. Nenhum elemento `.fab` visível.
         Console sem erro relacionado.

- [ ] 8. **Responsivo** — 360px e 1280px, claro + escuro: overflow **0px**, sem sobreposição.
         Hierarquia legível no mobile.

- [ ] 9. **Regressão** — accordion abre/fecha; router funciona; outras páginas (Finanças, Mentor,
         Contatos, Negócio) sem erro. Console **0 erros**.

- [ ] 10. Ficha do componente em `tarefas\componentes\` + 2 screenshots (360 + 1280).

## ✅ Critério de aceite
- [ ] Painel Negócios standalone, posição correta nos 3 modos.
- [ ] Active duplo resolvido: 1 painel ativo por vez.
- [ ] Hierarquia CSS: categoria > subcategoria em peso visual.
- [ ] FAB ausente em todas as telas.
- [ ] Console **0**; overflow **0px**; sem regressão.
- [ ] Falha → reportar (não marcar pronto).

## 📂 Escopo
Mexe: `smoke-*.py` + `tarefas\componentes\` + screenshots. 🔒 Read-only no app.
