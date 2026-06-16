---
id: 71
titulo: JS — fix active duplo (Painel Pessoal + Painel Negócios ambos com data-nav="dashboard")
status: todo
modo: construtor
expert: frontend-dev
depende_de: [70]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260616-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-71 · JS fix active duplo               │
│ ✅ Aceite:  só 1 painel aceso por vez                     │
│ ⏭️ PRÓXIMA: Tarefa-72 · CSS hierarquia                    │
└───────────────────────────────────────────────────────────┘
```

## O que é
Com 2 itens `data-nav="dashboard"` na sidebar (Painel Pessoal + Painel Negócios), a função
`navigate()` em `js/01-core.js` (l.239) marca **ambos** como `.active` ao mesmo tempo —
porque filtra só por `data-nav === pageReal`, sem considerar o contexto do modo.

## Causa raiz
```js
// l.239 — hoje:
document.querySelectorAll('[data-nav]').forEach(n =>
  n.classList.toggle('active', n.dataset.nav === pageReal)
);
// → ativa TODOS os elementos com data-nav="dashboard", incluindo os 2 painéis
```

## Solução
Ao marcar `.active` em items com `data-ctx`, verificar se o `data-ctx` bate com o modo atual.
Items SEM `data-ctx` (subcategorias) seguem o comportamento normal.

```js
const modeAtual = document.documentElement.getAttribute('data-mode') || 'pessoal';
document.querySelectorAll('[data-nav]').forEach(n => {
  const navMatch = n.dataset.nav === pageReal;
  const ctx = n.dataset.ctx;
  // Se tem data-ctx, só ativa se o ctx bate com o modo atual
  // (no híbrido, ativa o pessoal por padrão pois Painel Pessoal é o topo)
  const ctxMatch = !ctx || ctx === modeAtual || (modeAtual === 'hibrido' && ctx === 'pessoal');
  n.classList.toggle('active', navMatch && ctxMatch);
});
```

**Comportamento esperado:**
- Modo pessoal → só Painel Pessoal (data-ctx="pessoal") fica ativo
- Modo negócio → só Painel Negócios (data-ctx="negocio") fica ativo
- Modo híbrido → Painel Pessoal ativo (ctx="pessoal" prioridade, por estar no topo)

## Etapas

- [ ] 1. Localizar `navigate()` em `js/01-core.js` l.235+, especificamente o
         `querySelectorAll('[data-nav]').forEach` (l.239).

- [ ] 2. Substituir o toggle simples pela lógica com verificação de data-ctx acima.

- [ ] 3. Verificar que a lógica não quebra outros nav-items (subcategorias não têm
         data-ctx — devem continuar funcionando normalmente com o `!ctx` no ctxMatch).

- [ ] 4. Testar: modo pessoal → clicar "Início do dashboard": Painel Pessoal aceso, Negócios não.
         Trocar para modo negócio → Painel Negócios aceso, Pessoal some (oculto por data-ctx).

## ✅ Critério de aceite
- [ ] Modo pessoal: só Painel Pessoal com .active. Painel Negócios: sem .active (e oculto).
- [ ] Modo negócio: só Painel Negócios com .active.
- [ ] Modo híbrido: Painel Pessoal ativo (por estar visível no topo da seção pessoal).
- [ ] Subcategorias: comportamento de .active inalterado (sem data-ctx = sempre elegível).
- [ ] Sem regressão no router (outras páginas continuam navegando corretamente).

## 📂 Escopo
Mexe: `js/01-core.js` (função navigate(), l.239). 🔒 Não tocar: HTML · CSS · outros módulos.
