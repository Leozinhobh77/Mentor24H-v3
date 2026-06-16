---
id: 68
titulo: JS — fix bug desktop (navigate ao trocar modo) + active-parent para categoria acesa
status: todo
modo: construtor
expert: frontend-dev
depende_de: [67]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-006 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-68 · JS fix bug + active-parent        │
│ ✅ Aceite:  desktop navega ao dashboard; cat acesa correta│
│ ⏭️ PRÓXIMA: Tarefa-69 · Sentinela smoke                   │
└───────────────────────────────────────────────────────────┘
```

## O que é
Dois ajustes JS em `js/01-core.js`:
1. **Bug desktop**: clicar nos botões de modo (Pessoal/Híbrido/Negócio) na topbar não
   navega pro dashboard — só troca o modo. Mobile funciona; desktop não.
2. **active-parent**: o CSS da T67 precisa da classe `.active-parent` no `.nav-group`
   pai quando uma subcategoria está ativa. O JS precisa gerenciar isso.

## Etapas

- [ ] 1. **Fix bug desktop** — em `js/01-core.js` l.128-138, dentro do listener do `.mode-switch button`,
         adicionar `navigate('dashboard')` como PRIMEIRA ação do click:
         ```js
         document.querySelectorAll('.mode-switch button').forEach(b=>{
           b.addEventListener('click',()=>{
             navigate('dashboard');              // ← ADICIONAR esta linha
             const mode=b.dataset.mode;
             document.documentElement.setAttribute('data-mode',mode);
             // ... resto igual
           });
         });
         ```

- [ ] 2. **active-parent** — na função `initSidebarAccordion()` (l.176+), criar helper que
         sincroniza `.active-parent` nos grupos sempre que `.nav-item.active` muda:
         ```js
         function syncActiveParent(){
           sidebar.querySelectorAll('.nav-group').forEach(function(g){
             var hasActive=g.querySelector('.nav-item.active');
             g.classList.toggle('active-parent',!!hasActive);
           });
         }
         ```
         Chamar `syncActiveParent()` nos pontos onde `.nav-item.active` muda:
         - Após o `navObserver` detectar mudança (já existe em l.194-197 — adicionar chamada).
         - No `setTimeout` do estado inicial (l.213-219 — adicionar chamada).
         - Ao abrir o modo (no `modeObserver` l.203-210 — adicionar chamada).

- [ ] 3. Verificar que o Mentor também recebe `.active-parent` quando está ativo
         (o grupo "Assistente" contém o item Mentor; ao navegar pra Mentor, o grupo deve ganhar a classe).
         Confirmar que o CSS da T67 cobre `.nav-group.active-parent > .nav-group-header`.

- [ ] 4. Testar: desktop clicar em "Negócio" → vai para o dashboard; clicar em "Pessoal" → dashboard.
         Clicar em Finanças → Dinheiro ganha `.active-parent`, Finanças fica ativo.

## ✅ Critério de aceite
- [ ] Desktop: clicar Pessoal/Híbrido/Negócio na topbar → navega pro dashboard (modo muda + página muda).
- [ ] Mobile: comportamento mantido (não regredir).
- [ ] Dinheiro.active-parent quando Finanças/Transações/Metas/Relatórios/Categorias está ativo.
- [ ] active-parent removido ao navegar para fora do grupo.
- [ ] Mentor (grupo Assistente) acende quando na página Mentor.

## 📂 Escopo
Mexe: `js/01-core.js` (l.128-138 + initSidebarAccordion). 🔒 Não tocar: HTML · CSS · outros módulos.
