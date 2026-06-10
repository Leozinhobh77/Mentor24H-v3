---
id: 02
titulo: Módulo financeiro.js + registro completo (nav, rota, título, ⌘K)
status: todo
expert: construtor
depende_de: 01
---

## O que é
Criar `js/negocio/financeiro.js` (IIFE `const Financeiro=(()=>{...})()`, padrão idêntico ao `encomendas.js`) com 2 abas — **💵 Caixa** e **📑 Despesas** — e registrá-lo em TODOS os pontos onde "encomendas" aparece (é a receita exata de integração).

## Etapas
1. Criar `js/negocio/financeiro.js`: IIFE com `esc()`, abas internas (seg/toolbar, padrão `enc-seg`), `render()` no `#financeiro-root`, expõe `{render}`.
2. `index.html` linha ~67 (junto dos nav-items do Negócio): `<div class="nav-item" data-nav="financeiro">{i:wallet}<span>Financeiro</span></div>` — posicionar entre Relatórios e Documentos.
3. `index.html` linha ~423: `<section class="page" data-page="financeiro"><div id="financeiro-root"></div></section>`.
4. `index.html` linha ~462: `<script src="js/negocio/financeiro.js"></script>` (antes do encomendas.js ou junto — ordem dos módulos negocio).
5. `js/01-core.js:186`: adicionar `financeiro:'Financeiro'` em `TITLES`.
6. `js/01-core.js:222` (função `navigate`): adicionar `if(page==='financeiro') Financeiro.render();`.
7. `js/15-mentor.js:622`: adicionar `financeiro:'wallet'` em `NAVICON` (⌘K "Ir para" pega automático se o índice nav é gerado das TITLES/nav-items — conferir como encomendas entrou e replicar).
8. Conferir visibilidade por modo: replicar exatamente o mecanismo que esconde "Encomendas" no modo Pessoal (CSS `data-mode` ou classe) para "Financeiro".

## ✅ Critério de aceite
- Modo Negócio: item "Financeiro" na sidebar e bottom-nav, abre a tela com 2 abas navegáveis.
- Modo Pessoal: item invisível. ⌘K acha "Financeiro" no IR PARA.
- Console limpo.

## 📂 Escopo
- **Mexe:** novo `js/negocio/financeiro.js` · `index.html` (3 pontos) · `js/01-core.js` (2 linhas) · `js/15-mentor.js` (NAVICON).
- **NÃO toca:** lógica de outros módulos, PDV, Relatórios, Mentor regras.
