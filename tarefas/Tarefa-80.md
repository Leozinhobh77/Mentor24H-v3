---
id: 80
titulo: Os 6 modais padronizados (Novo/Editar · Excluir · Falei hoje · Próxima ação · Nova data · Registrar)
status: todo
modo: construtor
expert: frontend-dev
depende_de: [79]
---

## 🖥️ HUD — COPIAR ANTES DE EXECUTAR
```
┌─ Mentor24h-v3 · executor-20260617-001 · Redesign Contatos ─┐
│ 🔄 RUN ▰▰▱▱▱▱ 2/6  ·  🔨 Construtor                        │
│ 🧠 Expert ativo: frontend-dev (+ forge)                    │
│ ⏳ AGORA:   Tarefa-80 · Modais padronizados                │
│ ⏭️ PRÓXIMA: Tarefa-81 · Redesign da Lista                  │
└────────────────────────────────────────────────────────────┘
```

## O que é
Padronizar TODOS os modais/caixas da tela usando os componentes da T79. Cada um com: header,
campos, validação por campo, loading no envio, sucesso/toast, fecha por botão + ESC + clicar fora,
focus trap e trava de scroll do fundo. Reusa `Modal.open`/`Modal.confirm`/`Toast`.

## Etapas
- [ ] 1. **D1 Novo/Editar contato** (`form()` ~144): Nome* · Telefone (E2) · E-mail (E1) · Contexto ·
       Aniversário · Tags (E3) · Como conheci · Anotações · Favorito. Erro por campo + loading + sucesso.
- [ ] 2. **D2 Excluir** (`Modal.confirm`): título + nome + Cancelar / Confirmar destrutivo (`--expense`).
- [ ] 3. **D3 "Falei hoje"** (`renderFicha` data-falei): canal (chips D7) + nota opcional.
- [ ] 4. **D4 Próxima ação** (data-addprox): o que fazer* + data.
- [ ] 5. **D5 Nova data** (data-adddata): descrição* + data.
- [ ] 6. **D6 Registrar interação** (data-addint): canal (chips) + data + nota.
- [ ] 7. **D7 chips de canal** (refatora `tipoRadios` ~5): chips selecionáveis com cor/ícone do `INT_TIPOS`.
- [ ] 8. Garantir ESC + clicar-fora + focus trap + scroll-lock no `Modal` base (uma vez, herda todos).
- [ ] 9. Ficha do componente em `tarefas\componentes\`.

## ✅ Critério de aceite
- [ ] Os 6 modais abrem/fecham por botão+ESC+fora, com foco preso e scroll do fundo travado.
- [ ] Validação por campo + loading no envio + toast de sucesso em todos.
- [ ] CRUD intacto: criar/editar/excluir, falei hoje, próxima ação, datas, interações funcionando.

## 📂 Escopo
Mexe: `js/pessoal/09-contatos.js`. 🔒 NÃO tocar: lógica de dados/score (só apresentação), modo Negócio.
