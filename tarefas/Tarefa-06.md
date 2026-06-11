---
id: 06
titulo: DB — config MEI + metasNeg + proLabore + reservaNeg + seed
status: todo
expert: construtor
depende_de: —
---

## O que é
Criar as bases de dados da Etapa 25B no `DB` central, com seed demo coerente da Pizza e Cia BH.

## Etapas
1. Em `js/01-core.js`, junto da config do negócio (`DB.negocio`, linha ~475), adicionar objeto `DB.negocioFin` (config editável):
   `{ meiLimite:81000, dasValor:76.90, dasDia:20, dasnMes:'05-31', proLaboreValor:2500, proLaboreDia:5 }`.
2. Adicionar `DB.metasNeg:[]` — metas do negócio: `{id, tipo:'faturamento'|'lucro', alvo, mesRef:'YYYY-MM', criadaEm}`. Seed: 1 meta de faturamento do mês atual (ex: alvo 12000) + 1 de lucro.
3. Adicionar `DB.dasPagos:[]` — controle do DAS: `{ym:'YYYY-MM', pago:bool, pagoEm:null}`. Seed: marcar pagos os meses passados do ano corrente, mês atual em aberto.
4. Adicionar `DB.reservaNeg:{ saldo:0, movimentos:[] }` — `movimentos:[{id,tipo:'guardar'|'resgatar',valor,data}]`. Seed: 2-3 movimentos (saldo ~800).
5. Adicionar `DB.proLaboreReg:[]` — registros de retirada: `{id, valor, ym:'YYYY-MM', data}`. Seed: retiradas dos meses passados; mês atual em aberto.
6. Usar `offset(n)`/`nid()` (datas relativas).

## ✅ Critério de aceite
- App abre sem erro; `DB.negocioFin`, `DB.metasNeg`, `DB.dasPagos`, `DB.reservaNeg`, `DB.proLaboreReg` existem e populados.
- Mês atual aparece "em aberto" em DAS e pró-labore (pra Mentor disparar).

## 📂 Escopo
- **Mexe:** `js/01-core.js` (DB + SEED).
- **NÃO toca:** módulos, router, CSS.
