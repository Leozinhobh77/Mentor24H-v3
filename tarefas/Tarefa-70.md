---
id: 70
titulo: HTML — criar "Painel Negócios" standalone (espelho do Painel Pessoal, fora do grupo Operação)
status: todo
modo: construtor
expert: frontend-dev
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260616-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-70 · HTML Painel Negócios              │
│ ✅ Aceite:  standalone visível, Operação sem "Painel"     │
│ ⏭️ PRÓXIMA: Tarefa-71 · JS fix active duplo               │
└───────────────────────────────────────────────────────────┘
```

## O que é
O "Painel" de negócio hoje é subcategoria do grupo "Operação" (index.html l.102).
Deve virar um item standalone idêntico ao "Painel Pessoal" — fora de qualquer grupo,
com o mesmo visual de card premium herdado da R1.

## Etapas

- [ ] 1. Remover o item "Painel" de dentro do grupo Operação:
         Apagar a linha l.102:
         `<div class="nav-item" data-nav="dashboard">{i:home}<span>Painel</span></div>`
         O grupo Operação fica com 3 itens: Vendas · Encomendas · Estoque.

- [ ] 2. Criar o item standalone logo APÓS o separador "Negócio" (l.93) e ANTES do grupo Operação (l.95):
         ```html
         <div class="nav-item nav-standalone" data-nav="dashboard" data-ctx="negocio">
           {i:home}<span>Painel Negócios</span>
         </div>
         ```
         Estrutura idêntica ao "Painel Pessoal" (l.35), só com data-ctx="negocio".

- [ ] 3. Adicionar divisória fina após o standalone (igual ao Painel Pessoal — o CSS da R1 já cobre
         .nav-standalone com border-bottom). Confirmar visualmente.

- [ ] 4. Verificar nos 3 modos:
         - Pessoal: "Painel Negócios" não aparece (data-ctx="negocio" oculto).
         - Negócio: "Painel Negócios" aparece no topo (standalone antes de Operação).
         - Híbrido: ambos aparecem — Painel Pessoal no topo geral, Painel Negócios após o separador.

## ✅ Critério de aceite
- [ ] "Painel Negócios" aparece como standalone (não dentro de accordion).
- [ ] Grupo Operação não contém mais o item "Painel".
- [ ] No modo pessoal: não visível. No negócio/híbrido: visível na posição correta.
- [ ] Card premium herdado da R1 (CSS já cobre .nav-standalone).

## 📂 Escopo
Mexe: `index.html` (l.93–107). 🔒 Não tocar: CSS · JS · outros itens do HTML.
