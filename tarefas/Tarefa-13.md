---
id: 13
titulo: CSS premium sidebar + tipografia mobile @media 560px
status: todo
modo: forge
expert: ui-visual-designer
depende_de: 12
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h · executor-20260611-001 ──────────────────────────┐
│ 🔄 RUN ▰▰▰░░░░ 3/4  ·  🎨 Forge 1/1                         │
│ 🧠 Expert ativo: ui-visual-designer                           │
│ ⏳ AGORA:   Tarefa-13 · CSS premium sidebar + mobile         │
│ ✅ Aceite:  pílula teal + chevron 180° + mobile 15px sem zoom│
│ ⏭️ PRÓXIMA: Tarefa-14 · Smoke Playwright                     │
└───────────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar.
> Ao concluir: reimprima com ✅ na linha AGORA e barra avançada.

## O que é
Atualizar css/estilo.css com os estilos premium do sidebar (accordion, pílula ativa,
hierarquia de opacidade, micro-animações) e adicionar bloco de tipografia mobile.

## Etapas
1. Fazer checkpoint BEFORE em css/estilo.css
2. PASSO A: Localizar e substituir as regras antigas de nav (linhas ~116–136)
   pelo bloco novo (ver Prompt completo):
   - .nav-group, .nav-group-header, .nav-label, .nav-chevron
   - .nav-items (accordion max-height)
   - .nav-item (opacity .52 inativo)
   - .nav-item:hover (opacity 1 + translateX + bg)
   - .nav-item.active (pílula gradiente + inset shadow teal)
   - .nav-mode-sep (separador híbrido)
   - #sidebar (gradient surface)
3. PASSO B: ADICIONAR ao final do arquivo o bloco @media(max-width:560px)
4. Verificar visualmente: item ativo tem pílula teal; inativos em ~52% opacidade; chevron gira
5. Verificar mobile 360px: fontes maiores, inputs sem zoom

## ✅ Critério de aceite
- Item ativo: pílula gradiente teal + acento 3px esquerda + ícone teal
- Inativo: ~52% opacidade → hover 100% + translateX no ícone
- Chevron gira 180° quando grupo abre (transition 220ms)
- Mobile: nav-item font-size = 15px; .field font-size = 16px
- Zero overflow horizontal em 360px
- Tema escuro: estilos corretos (dark variant)

## 📂 Escopo
**Mexe:** css/estilo.css (substituir bloco nav ~116–136 + adicionar @media no final)
**NÃO toca:** HTML, JS, outros arquivos CSS
