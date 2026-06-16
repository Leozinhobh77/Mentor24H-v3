# PLANO — Mentor Semanal com Carry-over (R6 · item 6)  ·  Mentor24h-v3 / Finanças (Pessoal)
> projeto: Mentor24h-v3 · criado 2026-06-15 · status: rascunho (aguarda validacao do Leo p/ gerar Prompt)
> ESCOPO TRAVADO: SO a tela Financas (js/pessoal/03-contas.js + #contas-root CSS + frases em js/15-mentor.js).
> NAO mexer em inicio, dashboard nem outras telas. App = READ-ONLY (so via skill-executor).

## NORTE (a ideia do Leo)
No modo A Pagar / Semana, cada bloco de semana tem um Mentor proprio que conversa de forma humana.
O grande upgrade: o Mentor tem MEMORIA DE ATRASO (carry-over). Conta nao paga numa semana acumula
e a SEMANA ATUAL absorve esse atraso na sua meta diaria. As mensagens atualizam sozinhas conforme
o usuario paga. Tudo com 3 tons (atraso com mais variacoes), sem repetir/enjoar, parecendo gente real.

## VERIFICACAO DO CODIGO (feita 2026-06-15)
- `buildListaSemana()` (l.170-203): monta 1 bloco por semana via `semanasMes(mesAtivo)`.
  - `estaSemanaBool = hojeIso>=si && hojeIso<=domIso` (semana atual).
  - `pendSem` = itens nao pagos; `apagar`/`areceber`; `diasRestSem = dias ate domingo`.
  - HOJE o Mentor (`mentorSemHTML`) so renderiza SE `estaSemanaBool && apagar>0 && diasRestSem>0` (l.189) -> so na semana atual.
- `semanasMes(ym)` (l.62-): retorna [{n, ini, fim, segmIni, segmFim}], ja apara virada do mes.
- `Mentor.fraseMeta({devo,dias})` (15-mentor.js l.786) + nucleo `fin-metadiaria` (l.380) — motor de voz com tom + pick() anti-repeticao.
- Estado de conta: {tipo:'pagar'|'receber', status:'pendente'|'paga', venc, valor}. `diasAte(venc)<0` = vencida.

## ENGENHARIA (o que construir)

### A. Modelo temporal por bloco
- PASSADA: `domIso < hojeIso`  ·  ATUAL: `estaSemanaBool`  ·  FUTURA: `si > hojeIso`.

### B. Carry-over (acumulo)
- `atrasado` = SOMA das contas a pagar pendentes com `diasAte(venc)<0` (vencidas das semanas passadas do mes).
- `atrasadoN` = quantidade dessas contas.
- SO a semana ATUAL absorve o `atrasado` acumulado. Futuras seguem com o programado.
- `totalSemanaAtual = programadoSemanaAtual + atrasado`. `meta = ceil(totalSemanaAtual / diasRestSem)`.

### C. Os 6 estados (gatilho -> mensagem)
| Estado | Dispara quando | Mensagem (ideia) | Tons |
|--------|----------------|------------------|------|
| Meta | atual, apagar>0, atrasado=0 | "R$ X essa semana — meta R$ Y/dia" | 3 |
| Acumulo | atual, atrasado>0 | "devia R$ P, acumulou +R$ A atrasados = R$ T. Meta R$ Y/dia pra fechar no azul" | 3 (atencao) |
| Atraso | passada, tem a pagar pendente | "ficaram N conta(s) atrasada(s) aqui (R$ A)" -> atualiza ao pagar | 4-6 (gentil/SENS) |
| Fechada | passada/atual, tudo pago | "semana fechada, parabens" | 3 |
| Suave | sem nada a pagar | "semana tranquila, nada vencendo" | 3 |
| Previa | futura, tem a pagar | "R$ X ja programados pra ca — chega na sua vez" | 3 |

### D. Atualizacao dinamica
- `render()` recalcula tudo a cada pay/del. As frases se ajustam sozinhas (pagou 1 -> "so 1 agora"; quitou -> "tudo em dia").
- Anti-repeticao por `pick()` (ja existe). Atraso = pool maior + abertura/fecho calmos (conceito SENS).

### E. Voz (15-mentor.js)
- Novos nucleos: `fin-sem-meta`, `fin-sem-acumulo`, `fin-sem-atraso`, `fin-sem-fechada`, `fin-sem-suave`, `fin-sem-previa`.
- API nova: `Mentor.fraseSemana({estado, programado, atrasado, atrasadoN, total, dias, meta})` -> escolhe nucleo+tom+anti-repeticao.
- `fin-sem-atraso` e sensivel: cobranca gentil, nunca punitiva; 4-6 variacoes por tom.

### F. Visual (03-contas.js + #contas-root CSS)
- Card Mentor por semana em TODOS os blocos (remover a trava `estaSemanaBool` da l.189; renderizar por estado).
- Cor da listra por estado: teal (meta) / ambar (acumulo, atraso) / verde-income (fechada, suave) / teal-suave (previa).
- Tag flutuante "MENTOR" (estilo .mtr-spot-tag) no topo (item 5 do R6).
- Hero de meta (R$ Y/dia) quando estado = meta/acumulo. Anatomia .mtr-card herdada fielmente (item 2 do R6).

## DEPENDENCIAS / CUIDADOS
- Item 4 do R6 (rodape so no modo Mes) — no Semana o Mentor vive nos blocos, sem rodape.
- Item 2 (CSS .mtr-card limpo) e item 5 (tag MENTOR) valem aqui tambem.
- Carry-over escopado ao MES ativo (atraso = vencidas pendentes do mes). Navegar de mes recalcula.
- Guarda de zero em diasRestSem (semana terminando hoje).
- SO tela Financas. Nao tocar Transacoes, negocio, outras telas, .fin-card(1285).

## CHECKLIST R6 COMPLETO (todos os itens desta rodada)
1. [BUG] Accordion modo Mes -> "Contas Pagas" / "Contas Recebidas" (acordeaoHdr l.141 usa o parametro `nome`).
2. [BUG/CSS] Card Mentor nao condiz com a aba Mentor -> limpar CSS legado (l.1695+), recuperar listra teal + surface-1 do .mtr-card; remover regras mortas R3/R4.
3. Conteudo do card Mentor (Mes/A Pagar) -> frase amarra deve->prazo->meta (leigo entende) + toque humano por persona + pool ampliado anti-repeticao + meta 1x so no hero (legenda "por dia"). 3 tons.
4. [BUG] Mentor do rodape duplica no modo Semana -> renderizar rodape SO no modo Mes.
5. Tag flutuante "MENTOR" no topo de todos os cards Mentor da Financa (rodape Mes + blocos Semana).
6. UPGRADE Mentor Semanal com carry-over (esta engenharia A-F).

## AJUSTES DA LENTE (7 furos achados + resolvidos · 2026-06-15)
1. DUPLA CONTAGEM (critico): `atrasado` = SO vencidas pendentes de semanas ANTERIORES (domIso < hojeIso).
   A semana atual conta as suas vencidas como "programado" (nao soma 2x). Formula: atrasado exclui a semana atual.
2. MESES NAVEGADOS: `estaSemanaBool` so e' true no mes corrente. Em mes != atual NAO ha absorcao:
   - mes passado: blocos = estado Vencida (se pendente) ou Fechada (se paga). Sem meta/acumulo.
   - mes futuro: blocos = estado Previa. Sem acumulo.
3. VOCABULARIO CONSISTENTE: usar a MESMA palavra do modo Mes ("Vencidas" / "em aberto"). Nao inventar 3o termo.
   O Mentor fala "ficaram N em aberto / venceram", alinhado ao grupo 🔴 Vencidas do modo Mes.
4. MODO A RECEBER (decisao tomada — Leo confirma depois): versao ADAPTADA, SEM meta-diaria-de-esforco
   (nao se "junta por dia" pra receber). Estados A Receber: Previsto ("R$ X a receber essa semana"),
   Recebido ("tudo recebido 👏"), A receber em aberto/vencido ("R$ X que era pra ter entrado — vale cobrar"),
   Suave ("nada a receber essa semana"). Foco em COBRAR, nao em meta diaria.
5. TOM ANTI-CULPA (sensivel): proibido vocabulario acusatorio ("voce deixou acumular", "voce atrasou", "falhou").
   Usar apoio/acao: "rolou pra essa semana", "vamos resolver", "da pra recuperar". Pool atraso = empatico, herda SENS.
6. DENSIDADE (anti mar-de-alerta): semana Suave/Previa = Mentor COMPACTO (1 linha leve, sem hero, sem tag grande).
   Card rico (mtr-card + hero + tag) so na ATUAL e nas VENCIDAS. Cor atraso = AMBAR SUAVE, nunca vermelho gritante.
7. META-TETO (borda): se diasRestSem pequeno e meta/dia inviavel (ex: meta > ~50% do programado num so dia),
   trocar o numero-hero por mensagem ("foco no que der essa semana, o resto a gente reprograma"). Guarda de zero ja prevista.

## PROXIMO PASSO
Lente aplicada (7 furos). Leo aprovou incorporar todos + gerar -> gerar Prompt R6 (Tarefa-60..65).
