# Plano Vivo — Sidebar Rodada 2
> Projeto: Mentor24h-v3 · Data: 2026-06-16 · ID: executor-20260616-001 · Status: gerado

---

## 🧭 Norte
3 melhorias pós-R1: Painel Negócios como standalone (espelho do Pessoal),
hierarquia visual CSS corrigida (categoria > subcategoria em peso físico),
e remoção do FAB órfão que aparecia sem função.

## 💬 O que conversamos
- Léo percebeu que "Painel" de Negócio ficou dentro do grupo Operação enquanto o Pessoal virou standalone
- Hierarquia CSS invertida: subcategoria fisicamente maior que categoria (padding 9px > 6px) — corrigir
- FAB (botão flutuante +) apareceu no Painel Pessoal sem funcionalidade — remover
- Fix técnico crítico: ambos os painéis usam data-nav="dashboard" → navigate() precisa filtrar por data-ctx

## 📋 Fases (tarefas 70–73)

### T70 — HTML: Painel Negócios standalone
- Remover item "Painel" (data-nav="dashboard") de dentro do grupo Operação (l.102)
- Criar nav-item.nav-standalone logo abaixo do separador "Negócio" (l.93)
  data-ctx="negocio", data-nav="dashboard", ícone {i:home}, texto "Painel Negócios"
- modo: construtor · expert: frontend-dev

### T71 — JS: fix active duplo
- navigate() hoje faz: querySelectorAll('[data-nav]').forEach → toggle active se data-nav===pageReal
- Com 2 items data-nav="dashboard" (Pessoal + Negócios), ambos ficam ativos ao mesmo tempo
- Fix: ao marcar active, verificar também se data-ctx bate com o modo atual (ou se não tem data-ctx)
- modo: construtor · expert: frontend-dev

### T72 — CSS: hierarquia + FAB
- Categoria mais robusta: padding 10px, nav-label 12px/.55, nav-cat-icon 18px, fundo sutil inativo
- Subcategoria mais fina: padding 7px, font 13px, weight 400, opacity .42, svg 16px stroke 1.5
- Sub ativa (Nível 1): brand-text opacity .80, weight 500, dot 3px
- Mobile: ajuste proporcional (l.1516-1518)
- Remover .fab e regras mobile do CSS (l.1420-1436)
- Remover <button class="fab" id="fab-main"> do HTML (index.html l.372)
- modo: forge · expert: ui-visual-designer

### T73 — Sentinela: smoke Playwright real
- Painel Negócios standalone visible no modo negócio e híbrido
- Apenas 1 painel aceso por vez (fix active duplo funcionando)
- Hierarquia visual: categoria visivelmente mais robusta que subcategoria
- FAB ausente em todas as telas
- modo: sentinela · expert: smoke-visual-tester

## 🚫 Não Incluído
- Lógica accordion · ícones subcategorias · brand area · side-foot · outras páginas

## 🎯 Status
✅ GERADO → executor-20260616-001
