---
id: 72
titulo: CSS — hierarquia categoria > subcategoria (peso físico correto) + remover FAB
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [70, 71]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260616-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰ 4/4  ·  🛡️ Sentinela 1/1                     │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-72 · CSS hierarquia + FAB              │
│ ✅ Aceite:  cat > sub visualmente, FAB ausente            │
│ ⏭️ PRÓXIMA: Tarefa-73 · Sentinela smoke                   │
└───────────────────────────────────────────────────────────┘
```

## O que é
Dois problemas visuais: (1) hierarquia invertida — categoria com padding 6px parece mais
fina que subcategoria com padding 9px; (2) FAB flutuante órfão sem funcionalidade.

## Diagnóstico CSS (R1 herdado)

```
HOJE (invertido)
.nav-group-header  padding: 6px   font: 10px  opacity: .38  ← FRACA
.nav-item          padding: 9px   font: 13.5px opacity: .52  ← FORTE
```

## Etapas

### Parte A — Hierarquia CSS

- [ ] 1. **Categoria mais robusta** — sobrescrever/ajustar em `estilo.css`:
         ```css
         .nav-group-header{
           padding:10px var(--s-3);   /* era 6px → supera os 9px da sub */
           gap:8px;
         }
         .nav-label{
           font-size:12px;             /* era 10px */
           opacity:.55;                /* era .38 */
           letter-spacing:.08em;       /* era .1em — reduzir levemente */
         }
         .nav-group.open .nav-label{opacity:.72}   /* era .56 */
         .nav-group-header:hover .nav-label{opacity:.72}  /* era .58 */
         .nav-cat-icon{width:18px;height:18px}     /* era 16px */
         /* fundo sutil mesmo inativo — "presença" da categoria */
         .nav-group-header{background:rgba(0,0,0,.02)}
         [data-theme="dark"] .nav-group-header{background:rgba(255,255,255,.02)}
         ```

- [ ] 2. **Subcategoria mais fina e elegante** — sobrescrever `.nav-item` dentro de `.nav-group`:
         ```css
         .nav-group .nav-item{
           padding:7px var(--s-3);     /* era 9px */
           font-size:13px;             /* era 13.5px */
           font-weight:400;            /* era 500 */
           opacity:.42;                /* era .52 */
         }
         .nav-group .nav-item svg{
           width:16px;height:16px;     /* era 18px */
           stroke-width:1.5;           /* era 1.7 */
         }
         ```
         ⚠️ Usar `.nav-group .nav-item` para não afetar o `.nav-standalone` (Painel Pessoal/Negócios).

- [ ] 3. **Subcategoria ativa (Nível 1) — mais discreta** — ajustar `.nav-group .nav-item.active`:
         ```css
         .nav-group .nav-item.active{
           color:var(--brand-text);
           opacity:.82;                /* não 100% — discreta */
           font-weight:500;            /* era 600 */
         }
         .nav-group .nav-item.active::before{
           width:3px;height:3px;       /* era 4px — dot menor */
         }
         ```

- [ ] 4. **Mobile** — ajustar proporcionalmente (l.1516-1518):
         ```css
         @media(max-width:768px){
           .nav-group .nav-item{font-size:14px;padding:9px var(--s-3)}  /* era 15px/11px */
           .nav-label{font-size:12.5px}   /* era 11.5px — manter levemente maior que sub */
         }
         ```

### Parte B — Remover FAB

- [ ] 5. Remover de `index.html` l.372:
         `<button class="fab" id="fab-main" title="Ação rápida">{i:plus}</button>`

- [ ] 6. Remover de `css/estilo.css` l.1420–1430 (bloco .fab e .fab:hover e .fab svg)
         e l.1436 (.fab dentro do @media 768px).

- [ ] 7. Verificar console: sem erro por elemento removido que JS possa referenciar.
         Buscar "fab-main" em todos os .js e confirmar que não há listener ativo.

## ✅ Critério de aceite
- [ ] Categoria visualmente MAIOR e mais presente que subcategoria (padding · font · ícone).
- [ ] Subcategoria discreta: mais fina, mais opaca, ícone menor.
- [ ] Subcategoria ativa: discreta mas identificável (dot 3px + brand-text opacity .82).
- [ ] .nav-standalone (Painel Pessoal/Negócios) NÃO afetado pelos ajustes de .nav-group .nav-item.
- [ ] FAB ausente: botão não aparece em nenhuma tela, sem erro de console.
- [ ] Claro + escuro: hierarquia mantida nos 2 temas.

## 📂 Escopo
Mexe: `css/estilo.css` (seção sidebar + .fab) · `index.html` (l.372 FAB).
🔒 Não tocar: JS · outras seções do CSS · ícones de subcategorias.
