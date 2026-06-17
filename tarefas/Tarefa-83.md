---
id: 83
titulo: CSS premium (tokens · .ct-* upgrade · microinterações · touch 44px · sem overflow · responsivo)
status: todo
modo: forge
expert: design-system
depende_de: [79, 80, 81, 82]
---

## 🖥️ HUD — COPIAR ANTES DE EXECUTAR
```
┌─ Mentor24h-v3 · executor-20260617-001 · Redesign Contatos ─┐
│ 🔄 RUN ▰▰▰▰▰▱ 5/6  ·  🎨 Forge                            │
│ 🧠 Expert ativo: design-system (+ interaction-designer)    │
│ ⏳ AGORA:   Tarefa-83 · CSS premium                        │
│ ⏭️ PRÓXIMA: Tarefa-84 · Smoke + QA                         │
└────────────────────────────────────────────────────────────┘
```

## O que é
Consolidar o CSS de tudo que T79–T82 marcaram. Upgrade do bloco `.ct-*` (`css/estilo.css` ~820–832 + ~1513).
Zero cor/spacing hardcoded — só tokens Quiet Premium teal.

## Etapas
- [ ] 1. Upgrade `.ct-*`: lista respirada, linha premium, badge de score, chips de tag/canal, pílulas de ação.
- [ ] 2. Estilos dos novos componentes (campo padrão, telefone intl + seletor país, chip input, estados de erro).
- [ ] 3. Bento da ficha compacto + responsivo (col-6/col-12 empilham no mobile).
- [ ] 4. **Microinterações** sutis: hover, transições com `--ease`, foco visível.
- [ ] 5. **A11y/robustez**: alvo de toque 44×44px; `overscroll-behavior: contain` em listas/modais; sem overflow horizontal.
- [ ] 6. Responsivo 360px e 1280px, tema claro + escuro, sem sobreposição.
- [ ] 7. Ficha do componente em `tarefas\componentes\`.

## ✅ Critério de aceite
- [ ] Zero cor/spacing hardcoded (só var(--*)). `.ct-*` repaginado coerente com o app.
- [ ] Touch 44px · overscroll contido · sem overflow/sobreposição em 360/1280 · motion sutil.

## 📂 Escopo
Mexe: `css/estilo.css` (bloco .ct-* + novos seletores). 🔒 NÃO tocar: tokens globais (:root), outros módulos.
