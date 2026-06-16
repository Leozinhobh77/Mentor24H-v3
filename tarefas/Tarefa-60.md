---
id: 60
titulo: Correções de lógica — accordion Mês "Contas Pagas/Recebidas" + rodapé Mentor só no modo Mês
status: todo
modo: construtor
expert: frontend-dev
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-005 ───────────────────┐
│ 🔄 RUN ░░░░░ 1/6  ·  🔨 Construtor 1/3                     │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-60 · Correções de lógica               │
│ ✅ Aceite:  accordion certo por aba + rodapé só no Mês    │
│ ⏭️ PRÓXIMA: Tarefa-61 · Card Mentor visual                │
└───────────────────────────────────────────────────────────┘
```

## O que é
Duas correções pequenas e cirúrgicas em `js/pessoal/03-contas.js`.

## Etapas
- [ ] 1. **[BUG] Accordion modo Mês ignora o nome** — `acordeaoHdr(id,nome,itens)` (l.136) recebe o `nome`
      certo (a chamada l.161 já passa `filtroCard==='receber'?'✓ Recebidas':'✓ Pagas'`), mas a **linha 141**
      escreve `<span class="fin-pagas-nome">Pagas</span>` **fixo**. Corrigir para usar `${nome}`.
      Texto final: aba A Pagar → **"Contas Pagas"** · aba A Receber → **"Contas Recebidas"**
      (ajustar a chamada l.161 para passar esses rótulos; o ícone ✅ já está na l.140).
- [ ] 2. **[BUG] Rodapé Mentor duplica no modo Semana** — `mentorRodHTML` (montado em l.271-289) é inserido
      em l.338 **sempre**. No modo Semana o Mentor já vive em cada bloco → duplica. Renderizar o rodapé
      **só quando `viewMode==='mes'`** (no Semana, `mentorRodHTML=''`).

## ✅ Critério de aceite
- [ ] Aba A Pagar mostra "Contas Pagas"; aba A Receber mostra "Contas Recebidas" (modo Mês).
- [ ] No modo Semana, o card Mentor do rodapé **não aparece** (só os por-semana); no modo Mês, aparece normal.
- [ ] Console 0; nada mais muda.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`acordeaoHdr` l.141 + chamada l.161; condição do `mentorRodHTML` no render).
🔒 NÃO toca: outras telas, Transacoes, negocio.
