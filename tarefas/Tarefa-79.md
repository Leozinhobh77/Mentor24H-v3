---
id: 79
titulo: Componentes-base padronizados (campo · telefone intl BR · chip tags · badge score · pílula)
status: todo
modo: construtor
expert: frontend-dev
depende_de: []
---

## 🖥️ HUD — COPIAR ANTES DE EXECUTAR
```
┌─ Mentor24h-v3 · executor-20260617-001 · Redesign Contatos ─┐
│ 🔄 RUN ▰▱▱▱▱▱ 1/6  ·  🔨 Construtor                        │
│ 🧠 Expert ativo: frontend-dev                              │
│ ⏳ AGORA:   Tarefa-79 · Componentes-base                   │
│ ⏭️ PRÓXIMA: Tarefa-80 · Modais padronizados               │
└────────────────────────────────────────────────────────────┘
```

## O que é
Base reusável de toda a tela Contatos. Construir UMA vez (helpers internos da IIFE `Contatos` em
`js/pessoal/09-contatos.js`), usar em T80/T81/T82. CSS visual consolida na T83.

## Etapas
- [ ] 1. **E1 — Campo padrão**: helper de `.field` com label, erro inline por campo, `type`/`inputmode` corretos.
       E-mail: `type=email` + `inputmode=email` + lowercase/trim + validação regex + mensagem de erro.
- [ ] 2. **E2 — Telefone internacional** (núcleo): seletor de país bandeira+DDI, **default 🇧🇷 +55**;
       máscara automática celular `(XX) 9XXXX-XXXX` / fixo `(XX) XXXX-XXXX` (detecta por dígitos);
       formata no `input` com **cursor estável**; armazena **E.164**; **parse tolerante** de telefones
       legados (texto livre em `DB.contatos`) → continuam exibindo e gerando links `wa.me`/`tel:`.
       **Vanilla puro** (sem lib, roda em `file://`); bandeira via emoji/CSS, **nunca fetch**.
- [ ] 3. **E3 — Chip input de tags**: add no Enter/vírgula, remove no ✕ (substitui campo "vírgula" cru).
- [ ] 4. **E4 — Badge de score**: emoji+rótulo+cor semântica reusando `relScore()` (linha ~4).
- [ ] 5. **E5 — Botão-pílula de ação rápida** (wa/tel/mail/registrar), estilo Material 3.
- [ ] 6. Ficha do componente em `tarefas\componentes\`.

## ✅ Critério de aceite
- [ ] Telefone formata ao digitar, guarda E.164; seed legada continua funcionando (testar).
- [ ] E-mail valida inline com mensagem. Chip de tags add/remove. Badge e pílula reusáveis.
- [ ] `render()`/`form()` atuais não quebraram (componentes plugam em T80/T81/T82).

## 📂 Escopo
Mexe: `js/pessoal/09-contatos.js` (helpers internos). 🔒 NÃO tocar: DB/persistência, modo Negócio, APIs reais.
