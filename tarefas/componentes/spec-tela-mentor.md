# Spec Visual — Tela Mentor Redesignada (Etapa 30)
> Tarefa-21 · executor-20260612-001 · forge/frontend-design
> Baseada em: pesquisa-mentor-ux2026.md
> Implementada em: Tarefa-22 (construtor/frontend-dev)

---

## 1. Anatomia Nova da Tela (todos os modos)

```
┌── #mentor-root ──────────────────────────────────────┐
│  .mtr-header        ← saudação + resumo (por modo)   │
│  .mtr-tom.seg       ← toggle de tom (mantido)        │
│                                                       │
│  .mtr-spotlight     ← bloco destacado #1 insight      │
│                                                       │
│  .mtr-grupos        ← lista de grupos/faixas         │
│    .mtr-grupo       ← cabeçalho + cards do grupo     │
│      .mtr-grupo-head← ícone + label + contagem       │
│      .mtr-feed      ← cards (existente, reutilizado) │
│                                                       │
│  .mtr-expandir      ← "+N" expansível (novo)         │
│    .mtr-feed-extra  ← cards ocultos (animated)       │
│                                                       │
│  .mtr-vazio         ← empty state premium (por modo) │
└──────────────────────────────────────────────────────┘
```

**Fluxo de renderização:**
1. `render()` lê `document.body.dataset.mode` (pessoal/negocio/hibrido)
2. Chama `renderPessoal()`, `renderNegocio()` ou `renderHibrido()` conforme o modo
3. Cada sub-render monta spotlight + grupos + expand + vazio

---

## 2. Componentes CSS: Reutilizar × Criar

### Reutilizar (sem alteração)
| Classe | Onde | O que faz |
|--------|------|-----------|
| `.mtr-tom` | toggle | botões de tom (sério/descontraído/motivador) |
| `.mtr-card` | cards | card base com borda colorida à esquerda |
| `.mtr-ico` | cards | ícone 34×34 com fundo soft |
| `.mtr-main` | cards | título + subtexto |
| `.mtr-t`, `.mtr-s` | cards | tipografia do card |
| `.mtr-btn` | cards | botão de ação do card |
| `.mtr-x` | cards | botão dispensar |
| `.mtr-feed` | container | flex-column gap-10px |

### Criar / Estender (novas classes)
| Classe | Descrição |
|--------|-----------|
| `.mtr-header` | Container do cabeçalho (saudação + resumo) — substitui `.mtr-resumo` inline |
| `.mtr-header-sub` | Sub-linha contextual (hora/contexto do modo) |
| `.mtr-spotlight` | Bloco hero do insight #1 — visual diferenciado |
| `.mtr-spot-tag` | Chip origem em Híbrido ("NEGÓCIO" / "PESSOAL") |
| `.mtr-grupos` | Wrapper dos grupos |
| `.mtr-grupo` | Grupo individual (cabeçalho + feed) |
| `.mtr-grupo-head` | Linha do cabeçalho do grupo |
| `.mtr-grupo-icon` | Ícone do grupo (emoji inline) |
| `.mtr-grupo-label` | Rótulo do grupo |
| `.mtr-grupo-count` | Badge de contagem |
| `.mtr-grupo-meta` | Meta info extra (ex: "R$ 340 em aberto" — Negócio) |
| `.mtr-expandir` | Wrapper "+N" expansível |
| `.mtr-expandir-btn` | Botão de expand (exibe "+N ver mais") |
| `.mtr-feed-extra` | Feed oculto (animado com max-height) |
| `.mtr-feed-extra.open` | Estado expandido |
| `.mtr-vazio` | Empty state por modo |
| `.mtr-vazio-cta` | Botão CTA do vazio (negócio: "Ver Metas →") |
| `.mtr-sep` | Separador entre faixas (Híbrido) |
| `.mtr-sep-label` | Label do separador "🏠 Sua vida pessoal ↓" |

### Variantes de Densidade (atributo `data-modo` no root)
- `[data-mtr-modo="pessoal"]` → `.mtr-card` padding `var(--s-4) var(--s-5)`, gap 10px
- `[data-mtr-modo="negocio"]` → `.mtr-card` padding `var(--s-3) var(--s-4)`, gap 8px
- `[data-mtr-modo="hibrido"]` → padding `var(--s-4) var(--s-4)`, gap 9px

---

## 3. Spec do Spotlight (`.mtr-spotlight`)

```css
/* Spotlight — insight #1 (hero card) */
.mtr-spotlight {
  display: flex;
  align-items: flex-start;
  gap: var(--s-4);
  padding: var(--s-4) var(--s-5);
  background: var(--cs);          /* --c setado inline, igual mtr-card */
  border: 1px solid var(--c);
  border-radius: var(--r-lg);
  margin-bottom: var(--s-5);
  position: relative;
  transition: .18s var(--ease);
}
.mtr-spotlight .mtr-ico {
  width: 40px; height: 40px;       /* maior que card normal (34px) */
  border-radius: 12px;
}
.mtr-spotlight .mtr-t {
  font-size: 14.5px;               /* maior que card normal (13.5px) */
  font-weight: 800;
}
.mtr-spotlight .mtr-btn {
  background: var(--c);            /* botão sólido, não outline */
  color: #fff;
  font-size: 12px;
  padding: 8px 14px;
}
.mtr-spot-tag {
  position: absolute; top: -10px; left: var(--s-4);
  font-size: 10px; font-weight: 800; letter-spacing: .06em;
  text-transform: uppercase;
  background: var(--c); color: #fff;
  padding: 2px 8px; border-radius: var(--r-full);
}
```

---

## 4. Spec dos Grupos (`.mtr-grupo`)

```css
.mtr-grupos { display: flex; flex-direction: column; gap: var(--s-5); }

.mtr-grupo-head {
  display: flex; align-items: center; gap: var(--s-2);
  margin-bottom: var(--s-3);
  padding-bottom: var(--s-2);
  border-bottom: 1px solid var(--border);
}
.mtr-grupo-label {
  flex: 1;
  font-size: 12px; font-weight: 800; text-transform: uppercase;
  letter-spacing: .06em; color: var(--text-3);
}
.mtr-grupo-count {
  font-size: 11px; font-weight: 700;
  background: var(--surface-2); color: var(--text-3);
  padding: 2px 7px; border-radius: var(--r-full);
}
.mtr-grupo-meta {
  font-size: 11.5px; font-weight: 600; color: var(--expense);
  margin-left: auto;
}
```

---

## 5. Spec do "+N" Expansível (`.mtr-expandir`)

```css
.mtr-expandir { margin-top: var(--s-4); }
.mtr-expandir-btn {
  display: flex; align-items: center; gap: var(--s-2);
  font-size: 12.5px; font-weight: 700; color: var(--brand-text);
  padding: var(--s-2) 0;
  transition: .18s var(--ease);
}
.mtr-expandir-btn svg { transition: transform .2s var(--ease); }
.mtr-expandir-btn[aria-expanded="true"] svg { transform: rotate(180deg); }

.mtr-feed-extra {
  max-height: 0; overflow: hidden;
  transition: max-height .25s var(--ease);
  display: flex; flex-direction: column; gap: 10px;
  margin-top: var(--s-3);
}
.mtr-feed-extra.open { max-height: 2000px; }  /* colapso suave */
```

**JS Toggle:**
```js
btn.addEventListener('click', () => {
  const open = extra.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
  btn.querySelector('.mtr-xp-label').textContent = open ? 'Recolher' : `+${n} ver mais`;
});
```

---

## 6. Spec Vazio Premium (`.mtr-vazio`)

```css
.mtr-vazio {
  display: flex; flex-direction: column; align-items: center;
  gap: var(--s-3);
  padding: var(--s-8) var(--s-4);
  text-align: center; color: var(--text-2);
}
.mtr-vazio svg { color: var(--brand-text); opacity: .7; }
.mtr-vazio h4 { font-size: 15px; font-weight: 800; color: var(--text-1); }
.mtr-vazio p  { font-size: 13px; line-height: 1.5; }
.mtr-vazio-cta {
  margin-top: var(--s-2);
  font-size: 12.5px; font-weight: 700;
  color: var(--brand-text);
  padding: 8px 18px; border-radius: var(--r-md);
  background: var(--surface-2);
  transition: .18s var(--ease);
}
.mtr-vazio-cta:hover { background: var(--surface-3); }
```

**Textos por modo:**
- Pessoal: `h4` = "Tudo em dia, Léo! ✨" · `p` = "Aproveita pra focar no que importa hoje."
- Negócio: `h4` = "Negócio em dia!" · `p` = "Nenhum alerta urgente. Bom momento pra revisar suas metas." · CTA `data-go="financeiro"`
- Híbrido: `h4` = "Tudo em dia nos dois mundos! ✨" · `p` = "Quando algo precisar da sua atenção, aparece aqui."

---

## 7. Grupos por Modo

### Pessoal — Áreas de Vida
| ID grupo | Ícone | Label | Módulos mapeados |
|----------|-------|-------|-----------------|
| `saude` | 🏃 | Saúde & Bem-estar | `saude`, `sau-*` |
| `habitos` | ✅ | Hábitos & Rotina | `habitos`, `hab-*`, `prod-*` |
| `agenda` | 📅 | Agenda & Tarefas | `agenda`, `ag-*`, `fin-*` (pessoal) |
| `aprendizado` | 📚 | Aprendizado & Leitura | `leitura`, `series`, `estudos` |

### Negócio — Áreas do Negócio
| ID grupo | Ícone | Label | Módulos mapeados |
|----------|-------|-------|-----------------|
| `financeiro` | 💸 | Financeiro | `fin-*`, `caixa-*`, `fiado-*` |
| `estoque` | 📦 | Estoque & Produtos | `prod-*`, `estoque-*` |
| `clientes` | 👥 | Clientes & Encomendas | `enc-*`, `cliente-*` |
| `fiscal` | 🏛️ | MEI & Fiscal | `mei-*`, `das-*` |

### Híbrido — Duas Faixas
- **Faixa 1**: todos os insights de negócio (ordenados por severidade)
- **Faixa 2**: todos os insights pessoais (ordenados por severidade)
- Sem sub-agrupamento dentro de cada faixa (manter simples)

**Lógica de mapeamento módulo → grupo:**
```js
const GRUPOS_PESSOAL = {
  saude: ['saude','sau'],
  habitos: ['habito','hab','prod'],
  agenda: ['agenda','ag','fin-pessoal'],
  aprendizado: ['leitura','serie','estudo']
};
const GRUPOS_NEGOCIO = {
  financeiro: ['fin','caixa','fiado'],
  estoque: ['prod','estoque'],
  clientes: ['enc','cliente'],
  fiscal: ['mei','das']
};
// match: i.modulo.startsWith(prefix) para cada prefix da lista
```

---

## 8. Separador Híbrido (`.mtr-sep`)

```css
.mtr-sep {
  display: flex; align-items: center; gap: var(--s-3);
  margin: var(--s-5) 0 var(--s-4);
}
.mtr-sep::before, .mtr-sep::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}
.mtr-sep-label {
  font-size: 11px; font-weight: 800; text-transform: uppercase;
  letter-spacing: .08em; color: var(--text-3); white-space: nowrap;
}
```

---

## 9. Persistência de Dispensados

**Antes (sessão only):**
```js
const dispensados = new Set();  // linha 3 — perde no reload
```

**Depois (persistido):**
```js
const DISP_KEY = 'mentor.dispensados';
const dispensados = new Set(
  JSON.parse(localStorage.getItem(DISP_KEY) || '[]')
);
// Ao dispensar:
function dispensar(id) {
  dispensados.add(id);
  localStorage.setItem(DISP_KEY, JSON.stringify([...dispensados]));
  render();
}
```

---

## 10. Responsivo

| Breakpoint | Ajuste |
|------------|--------|
| `≤768px` | `.mtr-spotlight` flex-wrap; `.mtr-btn` margin-top 6px |
| `≤560px` | `.mtr-grupo-meta` hidden; `.mtr-spot-tag` menor (8px) |
| `≤360px` | `.mtr-grupo-head` empilha label+count em coluna; `.mtr-side` flex-row (btn+x lado a lado) |

---

## 11. Contraste AA

- Texto principal (`--text-1`) sobre `--surface-1`: ✓ (já garantido pelo app)
- `.mtr-grupo-label` (`--text-3`) sobre `--surface-0`: verificar em modo escuro — use `--text-2` se necessário
- `.mtr-spot-tag` texto branco sobre `var(--c)`: ✓ (cores do design system já passam AA)
- `.mtr-expandir-btn` (`--brand-text`) sobre `--surface-0`: ✓

---

## 12. Arquivos a Mexer (resumo para Tarefa-22)

| Arquivo | O que muda |
|---------|-----------|
| `js/15-mentor.js` | `dispensados` (linha 3) → persistido; `render()` (~652) → despacha por modo; `cardHTML()` (~641) → recebe opções extras (spotlight=true) |
| `css/estilo.css` | Estender bloco `.mtr-*` (~313) com as classes novas deste spec. Mudanças ADITIVAS. |
| `tarefas/componentes/spec-tela-mentor.md` | Este arquivo (entregável Tarefa-21) |

**NÃO tocar:** `REGRAS`, `rodarRegras`, `filtraModo`, `briefing`, `fraseDe`, NUC, AB, FE, HUMOR, ⌘K, notificações.

---
*Tarefa-21 concluída. Próxima: Tarefa-22 (construtor/frontend-dev) — implementar esta spec.*
