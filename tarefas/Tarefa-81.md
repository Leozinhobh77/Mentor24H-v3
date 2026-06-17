---
id: 81
titulo: Redesign da LISTA (KPIs enxutos · filtros reorganizados · faixa reconectar · linha c/ score · estados)
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [79]
---

## 🖥️ HUD — COPIAR ANTES DE EXECUTAR
```
┌─ Mentor24h-v3 · executor-20260617-001 · Redesign Contatos ─┐
│ 🔄 RUN ▰▰▰▱▱▱ 3/6  ·  🎨 Forge                            │
│ 🧠 Expert ativo: ui-visual-designer (+ construtor)         │
│ ⏳ AGORA:   Tarefa-81 · Redesign da Lista                  │
│ ⏭️ PRÓXIMA: Tarefa-82 · Redesign da Ficha                 │
└────────────────────────────────────────────────────────────┘
```

## O que é
Repaginar layout da LISTA (`render()` ~41 + `itemHTML()` ~22). Resolver "cards grandes / tela feia /
filtros mal organizados". Herda tokens Quiet Premium; CSS fino consolida na T83.

## Etapas
- [ ] 1. **A1 KPIs enxutos**: Contatos · Aniversários 30d · Para reconectar — glanceable, ícone em pílula, sem card grande.
- [ ] 2. **A2 Filtros**: busca em destaque (lupa + limpar) · TAGS como CHIPS roláveis (tira o `<select>`) ·
       segmento Todos/Pessoal/Negócio compacto · botão "Novo contato" primário.
- [ ] 3. **A3 Faixa de destaque** (estilo Dex), quando houver: "Reconectar" + "Aniversários próximos".
- [ ] 4. **A4 Group labels**: ★ Favoritos + A–Z legíveis com respiro.
- [ ] 5. **A5 Linha** (itemHTML): avatar · nome+contexto · chips tag + 🎂 · **badge de score (E4) visível** · ações.
- [ ] 6. **A6 Ações** da linha: WhatsApp · Ligar · E-mail · Favoritar · Editar · Excluir (44px, aria-label).
- [ ] 7. **A7 Estado vazio** (zero / busca sem resultado): ícone + título + texto + CTA. **A8** skeleton/erro.
- [ ] 8. Ficha do componente em `tarefas\componentes\`.

## ✅ Critério de aceite
- [ ] Lista escaneável, respirada, sem "card grande"; filtros claros; score visível na linha.
- [ ] As 6 ações funcionam; estado vazio aparece; nada regrediu no modo Negócio.

## 📂 Escopo
Mexe: `js/pessoal/09-contatos.js` (render/itemHTML/markup dos filtros). 🔒 NÃO tocar: lógica `filtered()`/dados.
