---
id: 82
titulo: Redesign da FICHA (hero + score · ações em pílula · 4 cards compactados · bento responsivo)
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [79]
---

## 🖥️ HUD — COPIAR ANTES DE EXECUTAR
```
┌─ Mentor24h-v3 · executor-20260617-001 · Redesign Contatos ─┐
│ 🔄 RUN ▰▰▰▰▱▱ 4/6  ·  🎨 Forge                            │
│ 🧠 Expert ativo: ui-visual-designer                        │
│ ⏳ AGORA:   Tarefa-82 · Redesign da Ficha                  │
│ ⏭️ PRÓXIMA: Tarefa-83 · CSS premium                        │
└────────────────────────────────────────────────────────────┘
```

## O que é
Repaginar a FICHA de detalhe (`renderFicha()` ~74). Resolver o "card grande demais", dar hierarquia
premium e compactar o bento. Mantém todos os blocos e botões.

## Etapas
- [ ] 1. **C1 Header**: Voltar · Favoritar · Editar · Excluir (ícones consistentes, 44px).
- [ ] 2. **C2 HERO**: avatar grande · nome · contexto + "conheci por" · chips tag · **score (E4)** ·
       **ações em PÍLULA** WhatsApp/Ligar/E-mail (E5, Material 3).
- [ ] 3. **C3 Manter contato**: último contato · alerta reconectar · select frequência · bloco próxima ação ·
       botões "Falei hoje" + "Próxima ação" — compacto.
- [ ] 4. **C4 Datas importantes**: aniversário + datas (label/data/dias/remover) + add + vazio.
- [ ] 5. **C5 Anotações** (condicional) · **C6 Histórico**: timeline + Registrar + vazio.
- [ ] 6. **C7 Compactar** os cards + bento responsivo (col-6/col-12 → empilha no mobile).
- [ ] 7. Ficha do componente em `tarefas\componentes\`.

## ✅ Critério de aceite
- [ ] Ficha compacta e premium; hero com score + ações em pílula; todos os blocos/botões preservados.
- [ ] Responsivo: cards empilham no mobile sem overflow.

## 📂 Escopo
Mexe: `js/pessoal/09-contatos.js` (renderFicha + markup). 🔒 NÃO tocar: lógica de score/datas/interações.
