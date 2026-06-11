---
id: 09
titulo: Mentor — 7 regras novas de Financeiro (mk + NUC 3 tons)
status: todo
expert: construtor
depende_de: 08
---

## O que é
Adicionar 7 gatilhos ao motor do Mentor em `js/15-mentor.js`, no padrão exato das regras de Negócio existentes (array de arrow fns → `mk(id,modulo,contexto,sev,dados,titulo,acao)`, linhas ~358-378), CADA id com entrada no `NUC` (núcleos factuais × 3 tons × 2 variações). Contexto `'negocio'`.

## Etapas (1 arrow fn + 1 bloco NUC por regra)
1. **`fin-das-vence`** (atencao→critico): DAS do mês em aberto e vence em ≤3d / atrasou. Ação: navTo `financeiro` (aba MEI).
2. **`fin-mei-limite`** (atencao): faturamento do ano ≥70% (info) / ≥90% (atencao) do limite. Ação: ver MEI.
3. **`fin-mei-projecao`** (atencao): projeção de ritmo estoura o limite anual. Ação: ver MEI.
4. **`fin-cx-negativo`** (atencao): caixa projetado 30d cruza o zero. Ação: ver Caixa.
5. **`fin-despesa-subindo`** (info): despesas do mês > mês anterior em ≥20%. Ação: ver Despesas.
6. **`fin-meta-batida`** (oportunidade): meta de faturamento/lucro do mês atingida 🎉. Ação: ver Metas.
7. **`fin-prolabore`** (info): pró-labore do mês ainda não retirado e já passou o `proLaboreDia`. Ação: ver Metas.

## Regras de implementação
- Cada arrow fn retorna `null` quando não aplica (igual as existentes).
- NUC: seguir o formato `{id:{serio:[d=>..,d=>..],descontraido:[...],motivador:[...]}}`. Frases factuais com slots via `fmt()`.
- Respeitar o cap top-8 e o filtro por modo (já existem). Nada de regra sensível/empatia aqui (é financeiro, não saúde) — tom normal.
- Conferir que aparecem no feed do Mentor E no briefing do dashboard (modo Negócio/Híbrido).

## ✅ Critério de aceite
- As 7 regras disparam com o seed da 25B (DAS em aberto, pró-labore não retirado, etc.) e somem quando resolvido.
- Frase muda conforme o tom (🤝/😎/💪); nenhuma quebra no feed; navTo abre a aba certa.

## 📂 Escopo
- **Mexe:** `js/15-mentor.js` (array de regras + NUC).
- **NÃO toca:** voz/empatia (14B), outras regras, motor de tom.
