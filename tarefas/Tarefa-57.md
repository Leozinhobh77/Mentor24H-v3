---
id: 57
titulo: Lógica — abas A Receber/A Pagar (remove Todas), corrige accordion Pagas por tipo (bug), dados de progresso, terminologia contextual
status: todo
modo: construtor
expert: frontend-dev
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-004 ───────────────────┐
│ 🔄 RUN ░░░ 1/3  ·  🔨 Construtor 1/1                       │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-57 · Lógica abas + bug + terminologia  │
│ ✅ Aceite:  abas sempre-um-ativo; Pagas/Recebidas por tipo│
│ ⏭️ PRÓXIMA: Tarefa-58 · Visual premium                    │
└───────────────────────────────────────────────────────────┘
```

## O que é
Reorganizar a lógica dos filtros da Finanças (`js/pessoal/03-contas.js`): de 3 chips (com "Todas")
para **2 abas exclusivas** (A Receber / A Pagar, sempre uma ativa), corrigir o bug do accordion
"Pagas", expor os dados de progresso e ajustar a terminologia por tipo. **Estado interno único**
(`status='paga'` = liquidada) — só os rótulos mudam.

## Etapas
- [ ] 1. **Abas sempre-um-ativo** — remover o filtro "Todas". `filtroCard` passa a ser sempre `'pagar'`
      ou `'receber'` (nunca vazio). **Default ao abrir = `'pagar'`**. Clicar numa aba seleciona (não desliga).
- [ ] 2. **[BUG] Accordion Pagas por tipo** — hoje `filtered()` (l.20-21) remove as pagas ao filtrar
      (`&&c.status!=='paga'`) e `buildListaMes` (l.158) só monta Pagas quando `!filtroCard`. Corrigir:
      - `filtered()` para 'pagar'/'receber' filtra **só por tipo** (mantém pagas e pendentes do tipo).
      - `buildListaMes`: pendentes vão pros grupos (Vencidas/Hoje/A vencer); **as pagas do tipo vão pro accordion**,
        que aparece **sempre** (não só sem filtro).
- [ ] 3. **Terminologia contextual** (estado único, rótulo por `c.tipo`):
      - botão quick (l.241): a pagar → "Marcar como pago" · a receber → "Marcar como recebido".
      - selo (l.83): a pagar → "Pago em DD/MM"/"Paga" · a receber → "Recebido em DD/MM"/"Recebida".
      - accordion (l.158): aba A Pagar → "✓ Pagas" · aba A Receber → "✓ Recebidas".
- [ ] 4. **Dados de progresso** (consumidos pela T58) — por tipo da aba: `pagasN` (contas liquidadas do tipo no mês)
      e `totalN` (todas as contas do tipo no mês). Expor para o render montar a barra "pagasN/totalN".
- [ ] 5. **Consistência no modo Semana** — aplicar o mesmo filtro por tipo + terminologia (Pagas/Recebidas)
      no `buildListaSemana`, pra não misturar os tipos.

## ✅ Critério de aceite
- [ ] Só 2 filtros (A Receber/A Pagar), sempre um ativo; default A Pagar; lista mostra um tipo por vez.
- [ ] Accordion aparece em **cada aba** com as liquidadas do tipo (bug resolvido) — testado nos 2 modos.
- [ ] Botão/selo/accordion usam a palavra certa por tipo (pago vs recebido).
- [ ] `pagasN/totalN` disponíveis por tipo; estado interno segue único; transações corretas (entrada/saída).
- [ ] Console 0; nada quebra no CRUD nem nos modos Mês/Semana.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`filtered`, `buildListaMes`, `buildListaSemana`, `openQuick`, selo/`venceTxt`, estado inicial).
🔒 NÃO toca: Totais/Saldo do topo, Mentor (R4), modal, `Transacoes`, `js/negocio/*`, `.fin-card`(1285).
