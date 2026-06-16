# Plano Vivo — Sidebar Redesign Premium
> Projeto: Mentor24h-v3 · Data: 2026-06-15 · ID: executor-20260615-006 · Status: gerado

---

## 🧭 Norte
Transformar a sidebar em uma experiência premium com hierarquia visual clara de 3 níveis:
categoria "acesa" como destaque principal, subcategoria ativa discreta, inativo apagado.

## 💬 O que conversamos (P0–P5)
- Léo observou que "Início" parecia básico vs o "Painel" do negócio (mais rico por estar em grupo)
- Decisão: card premium para todos os botões de categoria, igual ao Painel Pessoal
- Esboço validado ao vivo — visual aprovado antes de gerar
- Bug desktop descoberto via código: mode-switch topbar não chama navigate('dashboard')
- Ícones das categorias analisados — 4 conflitos encontrados e corrigidos
- Hierarquia 3 níveis decidida: Categoria (card completo) > Subcategoria (dot+cor) > Inativo (neutro)

## 📋 Fases (tarefas 66–69)

### T66 — HTML: renomear + ícones nos headers
- "Início" → "Painel Pessoal" (só texto, nada mais muda)
- Ícones {i:NOME} em cada nav-group-header
- modo: construtor · expert: frontend-dev

### T67 — CSS: card premium + divisórias + estados 3 níveis
- .nav-standalone e .nav-group-header viram cards premium
- Estados Nível 2 (aceso): gradient teal, border-left, glow, dot ::after
- Estado Nível 1 (subcategoria ativa): dot ::before 4px, cor teal, sem fundo
- Divisórias finas (border-bottom opacity .45) entre categorias
- modo: forge · expert: ui-visual-designer

### T68 — JS: fix bug desktop + active-parent
- navigate('dashboard') no mode-switch desktop (1 linha)
- Classe .active-parent no nav-group quando filho está ativo
- modo: construtor · expert: frontend-dev

### T69 — Sentinela: smoke Playwright real
- Testar os 3 níveis, bug fix, divisórias, ícones, overflow, regressão
- modo: sentinela · expert: smoke-visual-tester

## 🚫 Não Incluído
- Ícones das subcategorias (ficam como estão)
- Lógica do accordion (open/close intocada)
- Brand area, side-foot, qualquer página fora da sidebar
- Dados/DB

## 🎯 Rumo ao Prompt
Mapa de arquivos pré-varrido: index.html l.24–140 (sidebar) · estilo.css (nav-*) · 01-core.js l.128–138 (bug).
Ícones mapeados: link · card · zap · star · briefcase · layers · trendup.
Status: ✅ GERADO → executor-20260615-006
