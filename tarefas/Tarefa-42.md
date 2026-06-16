---
id: 42
titulo: Modal Adicionar/Editar conta — UX + Recorrente + Parcelado (18x) + Observação + desativar recorrência
status: todo
modo: construtor
expert: frontend-dev
depende_de: [41]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ▰░░░░░░░ 2/8  ·  🔨 Construtor 2/5                 │
│ 🧠 Expert ativo: frontend-dev (🎨 forge no visual)        │
│ ⏳ AGORA:   Tarefa-42 · Modal Add/Editar conta            │
│ ✅ Aceite:  Recorrente/Parcelado exclusivos + Observação  │
│ ⏭️ PRÓXIMA: Tarefa-43 · Card-dashboard (A)                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Reformar o `form(id)` (l.312-347) para uma experiência caprichada e expor as opções novas.
Hoje o modal tem "Repetir: Não/Mensal(6×)" + "Parcelas 1-48" (l.328) — substituir por um controle
**claro e exclusivo**.

## Etapas
- [ ] 1. **Tipo de lançamento** — segmented control **Avulso · Recorrente · Parcelado** (exclusivos, 1 só).
      Avulso = conta única; Recorrente = rolável (T41, sem parcelas); Parcelado = nº de parcelas.
- [ ] 2. **Parcelas** — quando "Parcelado": campo nº de parcelas **1–18** (teto 18, era 48). Mostra preview
      tipo "18× de R$ X" se valor preenchido.
- [ ] 3. **Campo Observação** — `textarea` curto opcional (`#f-obs`), abaixo da Descrição; persiste em `c.obs` (T41).
- [ ] 4. **Editar conta recorrente** — quando `c.recorrente && c.recorrenteAtivo`, mostrar toggle
      **"Desativar recorrência"** que seta `recorrenteAtivo=false` (T41) ao salvar → para de rolar.
- [ ] 5. **UX/visual (forge)** — agrupamento lógico, labels claras, espaçamento via tokens, alvos ≥44px,
      teclado/foco ok, sem overflow no modal em 360px.

## ✅ Critério de aceite
- [ ] Recorrente e Parcelado são **mutuamente exclusivos** (nunca os dois juntos).
- [ ] Parcelas no máximo **18**.
- [ ] Observação salva e reaparece ao reabrir/editar a conta.
- [ ] Toggle "Desativar recorrência" só aparece em conta recorrente ativa e realmente para o roll.
- [ ] Modal sem overflow em 360px; criar/editar continua funcionando (não quebra `form`).
- [ ] Zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`form`) · `css/estilo.css` (estilos do modal, aditivo, tokens).
🔒 NÃO toca: modal de `Transacoes`, `js/negocio/*`.
