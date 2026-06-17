---
id: 84
titulo: Smoke Playwright real + QA (regressão CRUD · máscaras · validações · estados · modo Negócio · 360/1280)
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: [79, 80, 81, 82, 83]
---

## 🖥️ HUD — COPIAR ANTES DE EXECUTAR
```
┌─ Mentor24h-v3 · executor-20260617-001 · Redesign Contatos ─┐
│ 🔄 RUN ▰▰▰▰▰▰ 6/6  ·  🛡️ Sentinela                        │
│ 🧠 Expert ativo: smoke-visual-tester (+ qa-funcional)      │
│ ⏳ AGORA:   Tarefa-84 · Smoke + QA                         │
│ ⏭️ PRÓXIMA: — (fim do run · auditoria cega tier L)         │
└────────────────────────────────────────────────────────────┘
```

## O que é
Provar o redesign com **smoke Playwright REAL** (Python, instalado). Sem maquiar: console 0, overflow 0px,
evidência por asserção. Falha → reportar, não marcar pronto.

## Etapas
- [ ] 1. **Lista renderiza**: KPIs presentes; linhas com avatar+score; chips de tag funcionam; busca filtra.
- [ ] 2. **CRUD criar**: abrir "Novo contato", preencher, salvar → contato aparece na lista.
- [ ] 3. **Telefone**: digitar número BR → máscara aplica `(XX) 9XXXX-XXXX`; salvar → link `wa.me`/`tel:` correto.
       Telefone legado da seed continua exibindo e com links válidos (parse tolerante).
- [ ] 4. **E-mail inválido** → erro inline aparece; válido → salva.
- [ ] 5. **CRUD editar + excluir** (com confirmação) funcionam; favoritar dá toast.
- [ ] 6. **Ficha**: abrir contato; hero+score; "Falei hoje", próxima ação, nova data, registrar interação OK.
- [ ] 7. **Modais**: fecham por ESC + clicar fora; foco preso; scroll do fundo travado.
- [ ] 8. **Estados**: busca sem resultado mostra vazio.
- [ ] 9. **Responsivo** 360px e 1280px, claro+escuro: overflow **0px**, sem sobreposição.
- [ ] 10. **Regressão modo Negócio/Clientes**: navegar Clientes não quebra; filtro de contexto funciona.
- [ ] 11. Console **0 erros** em toda a sessão.
- [ ] 12. Ficha em `tarefas\componentes\` + 2 screenshots (360px + 1280px).

## ✅ Critério de aceite
- [ ] CRUD completo + máscaras + validações + estados OK com evidência.
- [ ] Modo Negócio/Clientes sem regressão. Console 0 · overflow 0px · sem sobreposição.
- [ ] Falha → reportar (não marcar pronto). Tier L → segue auditoria cega (Sentinela isolado).

## 📂 Escopo
Mexe: `smoke-*.py` + `tarefas\componentes\` + screenshots. 🔒 Read-only no app.
