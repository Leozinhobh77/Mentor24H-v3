---
id: 67
titulo: CSS — card premium para Painel Pessoal + categorias + divisórias + hierarquia 3 níveis
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [66]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-006 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-67 · CSS card premium + estados        │
│ ✅ Aceite:  3 níveis visuais corretos, tokens only        │
│ ⏭️ PRÓXIMA: Tarefa-68 · JS fix                            │
└───────────────────────────────────────────────────────────┘
```

## O que é
CSS premium para a sidebar: card com 3 estados (aceso / subcategoria ativa / inativo) e
divisórias finas entre categorias. É a maior e mais importante tarefa do redesign.

## Hierarquia visual (3 níveis)

```
Nível 0 — INATIVO       : neutro, opacidade 52%, sem fundo, sem glow
Nível 1 — SUB ATIVA     : dot 4px teal à esquerda + cor teal + weight 600 (sem fundo/glow)
Nível 2 — CATEGORIA ACESA: card completo — gradient teal, border-left 3px, glow, dot ::after
```

## Etapas

- [ ] 1. **Ícone no header** — adicionar em `estilo.css` (após regras .nav-chevron):
         ```css
         .nav-cat-icon{width:16px;height:16px;stroke-width:1.7;flex-shrink:0;color:var(--text-3);transition:color .22s var(--ease)}
         ```

- [ ] 2. **Card base** — .nav-standalone e .nav-group-header compartilham card base (aditivo, não quebra):
         ```css
         .nav-standalone,.nav-group-header{
           border-left:3px solid transparent;
           border-radius:var(--r-md);
           transition:background .22s var(--ease),border-color .22s var(--ease),box-shadow .22s var(--ease);
         }
         ```

- [ ] 3. **Divisórias** — linha fina premium após cada .nav-standalone e .nav-group (exceto o último):
         ```css
         .nav-standalone,.nav-group{border-bottom:1px solid var(--border);padding-bottom:4px;margin-bottom:4px}
         .nav-group:last-of-type{border-bottom:none}
         ```
         Ajustar para não duplicar com o `margin-bottom:2px` existente.

- [ ] 4. **Nível 2 — categoria acesa** (`.nav-standalone.active` e `.nav-group.active-parent > .nav-group-header`):
         ```css
         .nav-standalone.active,
         .nav-group.active-parent > .nav-group-header{
           background:linear-gradient(105deg,var(--brand-soft),rgba(22,138,124,.04));
           border-left:3px solid var(--brand);
           box-shadow:0 0 14px rgba(22,138,124,.18),inset 0 0 0 1px rgba(22,138,124,.08);
         }
         .nav-standalone.active .nav-cat-icon,
         .nav-group.active-parent > .nav-group-header .nav-cat-icon,
         .nav-standalone.active svg{color:var(--brand);stroke-width:2}
         .nav-standalone.active span,
         .nav-group.active-parent > .nav-group-header .nav-label{color:var(--brand-text);opacity:1;font-weight:700}
         /* dot indicator à direita */
         .nav-standalone.active::after,
         .nav-group.active-parent > .nav-group-header::after{
           content:'';width:6px;height:6px;border-radius:50%;
           background:var(--brand);box-shadow:0 0 6px var(--brand);
           margin-left:auto;flex-shrink:0;
         }
         ```

- [ ] 5. **Nível 1 — subcategoria ativa** (`.nav-group .nav-item.active`) — sobrescrever o estilo atual
         que tem background forte (nav-item.active l.144):
         ```css
         .nav-group .nav-item.active{
           background:transparent;
           box-shadow:none;
           color:var(--brand-text);
           font-weight:600;
           opacity:1;
         }
         .nav-group .nav-item.active svg{color:var(--brand);stroke-width:1.9}
         /* dot lateral esquerdo no lugar da barra inset */
         .nav-group .nav-item.active::before{
           content:'';position:absolute;left:6px;top:50%;transform:translateY(-50%);
           width:4px;height:4px;border-radius:50%;background:var(--brand);
         }
         ```
         Remover o `box-shadow:inset 3px 0 0 var(--brand)` para subcategorias (só para .nav-standalone.active).

- [ ] 6. **Dark mode** — ajustar glow para não vazar:
         ```css
         [data-theme="dark"] .nav-standalone.active,
         [data-theme="dark"] .nav-group.active-parent > .nav-group-header{
           background:linear-gradient(105deg,rgba(22,138,124,.22),rgba(22,138,124,.06));
           box-shadow:0 0 18px rgba(22,138,124,.28),inset 0 0 0 1px rgba(22,138,124,.14);
         }
         ```

- [ ] 7. Abrir o app, clicar em Finanças: verificar Nível 2 (Dinheiro aceso) e Nível 1 (Finanças com dot).
         Verificar Painel Pessoal aceso ao entrar no dashboard.

## ✅ Critério de aceite
- [ ] Painel Pessoal ativo: card teal com glow, border-left, dot — premium, não exagerado.
- [ ] Categoria com filho ativo: mesmo visual.
- [ ] Subcategoria ativa: dot 4px à esquerda + cor teal + weight 600 — SEM background/glow.
- [ ] Categorias inativas: neutras (igual a antes).
- [ ] Divisórias: linha fina e elegante entre cada categoria — não pesada.
- [ ] Tokens only: zero hardcode de cor (exceto rgba de teal já usados no app, aceitável).
- [ ] Claro + escuro: sem vazar glow no dark mode.

## 📂 Escopo
Mexe: `css/estilo.css` (seção sidebar). 🔒 Não tocar: JS · HTML · CSS de outras seções.
