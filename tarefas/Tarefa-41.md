---
id: 41
titulo: Modelo de dados + camada de cálculo (totais fixos × pendente, recorrência rolável, parcelado 18x, obs, pagoEm)
status: todo
modo: construtor
expert: frontend-dev
depende_de: []
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ░░░░░░░░ 1/8  ·  🔨 Construtor 1/5                 │
│ 🧠 Expert ativo: frontend-dev                             │
│ ⏳ AGORA:   Tarefa-41 · Modelo + camada de cálculo        │
│ ✅ Aceite:  totais não mudam ao pagar; chips = pendente   │
│ ⏭️ PRÓXIMA: Tarefa-42 · Modal Add/Editar                  │
└───────────────────────────────────────────────────────────┘
```

## O que é
Base de tudo: separar **previsão fixa** de **pendente** e dar ao modelo de conta os campos
que as próximas tarefas precisam. **Sem reescrever** o CRUD (`pay`/`del`/`form`) — só estende.
Alvo: `js/pessoal/03-contas.js` (IIFE `Contas`).

## Etapas
- [ ] 1. **Totais fixos vs pendente** — hoje `calcSaldos()` (l.28-34) já filtra `status!=='paga'`.
      Criar **`calcTotais()`** = soma de **TODAS** as contas do mês (pagas + pendentes) → `{receber, pagar, saldo}`
      para os Totais do topo (previsão fixa, NÃO muda ao pagar). Manter `calcSaldos()`/equivalente para
      o **pendente** dos chips (`status!=='paga'`). Documentar a diferença num comentário.
- [ ] 2. **Campos novos no shape da conta** (todos opcionais, aditivos): `obs` (string),
      `pagoEm` (YYYY-MM-DD, gravado ao marcar paga), `serieId` (id da série recorrente),
      `recorrenteAtivo` (bool — controla o rolar). `recorrente`/`parcela` já existem.
- [ ] 3. **Recorrência ROLÁVEL** — ao criar recorrente, criar **só a 1ª** ocorrência (mês corrente),
      com `serieId` e `recorrenteAtivo:true`. **NÃO materializar** vários meses (hoje l.342 cria 6×).
- [ ] 4. **Roll ao pagar** — em `pay(id)`: se a conta é recorrente e `recorrenteAtivo`, ao marcar paga,
      **gerar a próxima** (`venc = addMonths(venc,1)`) com o **valor herdado** (o valor atual da conta paga)
      e mesma `serieId`. Gravar `pagoEm = offset(0)`.
- [ ] 5. **Valor herdado/âncora** — a próxima nasce com o último valor; se o usuário editar a conta
      antes de pagar (via `form`), a âncora muda naturalmente (o roll usa o valor vigente).
- [ ] 6. **Desativar recorrência** — expor caminho para setar `recorrenteAtivo=false` (consumido pelo modal, T42):
      a conta vira avulsa e **para de rolar**.
- [ ] 7. **Parcelado exclusivo + 18×** — manter materialização das parcelas (l.341) mas teto **18**;
      cada parcela com `parcela:'i/18'` e **sem** `recorrente` (exclusivos). `serieId` comum às parcelas.

## ✅ Critério de aceite
- [ ] Marcar conta como **paga** NÃO altera Total a Receber / Total a Pagar / Saldo previsto.
- [ ] Marcar paga **altera** os valores pendentes (chips).
- [ ] Recorrente gera o mês seguinte **só ao pagar** (nunca materializa vários de uma vez).
- [ ] Próxima ocorrência herda o último valor; editar antes de pagar muda a âncora.
- [ ] Parcelado até 18×, exclusivo de recorrente; `pay`/`del`/`form` seguem funcionando.
- [ ] Zero erro no console.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (IIFE `Contas` — cálculo + pay + criação) · adições/extensões.
🔒 NÃO toca: `Transacoes` (l.351+), `js/negocio/*`, helpers globais de `01-core.js`.
