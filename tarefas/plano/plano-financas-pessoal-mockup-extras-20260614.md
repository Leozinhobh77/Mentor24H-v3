# PLANO VIVO - financas-pessoal-mockup-extras
> projeto: Mentor24h-v3 - criado 2026-06-14 03:02 - atualizado 2026-06-14 18:29 - status: rascunho

## Norte (a ideia em 3 linhas)
Aplicar o mockup aprovado da tela Financas (Pessoal) na tela real, PRESERVANDO o CRUD, e somar 4 extras: navegacao por mes, tap=acao rapida, filtro categoria+busca, faixa do Mentor.

## O que conversamos (cru - append-only)

## Fases


### P0-P4 ESCUTA/VASCULHA/CLARIFICA/ESTRUTURA  [2026-06-14 03:02]
- Direcao: Mockup + extras (Leo escolheu).
- Tela real: js/pessoal/03-contas.js (modulo Contas) -> render() em #contas-root; rota navigate('financas') chama Contas.render() (01-core.js:250).
- Mockup aprovado: _mockups/mockup-financas.html [PADROES 2026-06-13, executor-20260613-001].
- LENTE/regressao: mockup NAO tem CRUD (pay/edit/del/form/busca/filtro-cat/icone-cor). Preservar e obrigatorio.
- CUIDADO 1: colisao .fin-card (estilo.css:1285 = card Financeiro NEGOCIO). Renomear/escopar classes do mockup.
- CUIDADO 2: Mentor ja tem regras fin-vencida/fin-avencer (15-mentor.js:398-404, navTo financas). Faixa = consumir Mentor.feed() dominio Financas; nao criar regra.
- Extras escolhidos: [1] navegacao por mes [2] tap=acao rapida [3] filtro categoria+busca [4] faixa do Mentor.
- Leo avisou: tem MAIS detalhes para depois desta rodada aplicada.
- Helpers globais: fmt, HOJE, offset, addMonths, diasAte, venceTxt, nid, svg, CATS, DB, Modal, Toast, donut(02-ui.js).
- conta shape: {id,tipo:pagar|receber,descricao,valor,cat,metodo,venc,status:pendente|paga,recorrente?,parcela?}. CATS ids lowercase.


### P2/P4 ENRIQUECIMENTO - Reserva por dia + Ritmo semanal  [2026-06-14 08:41]
NOVA FEATURE (detalhes do Leo) - Ritmo de poupanca em 2 niveis:
- NIVEL MES: 'Pra fechar o mes: R\$ X/dia - faltam N dias'. X = (a pagar pendente do mes + vencidas) / dias restantes ate fim do mes. Sub-linha dentro do fin-resumo, abaixo do Saldo previsto. Defaults: ate fim do mes - so o que devo - sub-linha (Leo nao mexeu).
- NIVEL SEMANA: lista agrupada por SEMANAS DE CALENDARIO (seg-dom reais; 1a/ultima parciais; 4-6 divisorias). Cada semana: label 'Semana N - DD-DD mes' + chip count + subtotal a pagar + por-dia.
- DENOMINADOR ADAPTATIVO (o pulo do gato): semana futura = dias cheios do segmento no mes; semana atual = dias restantes ate domingo (inclui hoje); semana passada = sem ritmo.
- AGRUPAMENTO (DECISAO Leo): semanas SUBSTITUEM os buckets aprovados (hoje/esta semana/proximas). Nova ordem: VENCIDAS (vermelho, topo, fora do fluxo) -> SEMANA 1..N (subtotal+por-dia) -> PAGAS (recolhida). => ATUALIZAR PADROES.md (evolucao do padrao 2026-06-13).
- DESTAQUE: semana atual marcada 'ESTA SEMANA' + 'faltam X dias'.
- EDGE: divisao por zero (ultimo dia=vence hoje); navegacao por mes recalcula semanas; por-dia c/ dias-restantes so no mes atual; sem divida = 'ta tranquilo'.
- Leo: 'enriquecer ao maximo' + ainda tem MAIS a passar depois desta.


### P2/P4 - Filtros  [2026-06-14 08:48]
FILTROS (decisao Leo):
- Visiveis sempre: cards-filtro A pagar / A receber / Vencidas (do mockup) + navegacao por Mes.
- Sob demanda: botao 'Filtros' (icone discreto) que EXPANDE -> Busca por texto (descricao) + Categoria (CATS). Tela limpa por padrao.
- FORA: metodo de pagamento, so-recorrentes, faixa de valor (evita poluir / Simplicity First).
- Extra 3 do plano vira: 'Filtros expansiveis (busca + categoria) atras de botao'.


### P6 GERADO  [2026-06-14 09:04]
Prompt gerado -> executor-20260614-001 (Sonnet 4.6 / High / tier L / Forge->Construtor->Sentinela). 9 tarefas (32-40) + checklist atualizado. Status: GERADO.


### RODADA 2 - ajustes (acumulando)  [2026-06-14 18:29]
Leo: rodada 1 ficou boa; ajustes finos, um de cada vez.
- AJUSTE #1: remover a FAIXA DO MENTOR da tela Financas (reverter o render do mentor-strip adicionado na T39 em js/pessoal/03-contas.js). Mentor continua no resto do app. [confirmado]


### RODADA 2 - despejo completo + P0-P6  [2026-06-15]
Leo passou 9 ajustes (um a um, com esbocos validados ao vivo). Resumo consolidado:
- (1) remover Mentor do TOPO; (2) selos dos cards enriquecidos + data real de vencimento; (3) lapis (affordance) no card, clique segue no card todo; (4) modal Add/Editar: UX + Recorrente + Parcelado(18x) + Observacao; (5) card mostra data do pagamento.
- (6) CARD-DASHBOARD direcao A (hero evoluido, escolhida no menu): topo (mes + retornar-hoje) / Total a Receber + Total a Pagar (PREVISAO FIXA: nao muda ao pagar, so ao add/edit/excluir) / Saldo previsto como RESULTADO embaixo / 3 chips-filtro A Receber|A Pagar|Todas (PENDENTE: o que falta; Todas=N contas, default) / toggle Mes|Semana (lembra ultima escolha) / barra acao Filtros+Nova conta 50/50 / REMOVER fin-prop-bar.
- (6.M) MODO MES: grupos por urgencia 🔴 Vencidas / 🟡 Vence hoje / 🟠 A vencer, cada um com cabecalho nome+N+soma; vencidas+hoje no topo, resto crescente; accordion Pagas no fim (ocultas, riscadas/opacas + data pgto).
- (6.S) MODO SEMANA: 1 bloco por semana (seg->dom, 4-5/mes, APARA dias fora do mes), cabecalho-resumo (N contas, a pagar, a receber), contas em ordem, "esta semana" destacada, Mentor POR SEMANA, estado vazio.
- (6.7/9) MENTOR adaptativo (regra de ouro = total devido + meta diaria por dias restantes; foco autonomo/MEI): rodape no mes + por semana; REUSA o motor de voz de 15-mentor.js (tom/persona/anti-repeticao); estados mes-atual(meta)/passado(retrospecto)/futuro(previa)/tudo-pago(elogio); guarda de zero.
- (7) campo Observacao no modal. (8) COR SEMANTICA do valor: receber=verde / a pagar a-vencer=ambar-pendencia / hoje=ambar-forte / vencida=vermelho / paga=cinza (tokens).
DECISOES DE BORDA (Lente Senior, todas com recomendacao aceita): Parcelado x Recorrente = EXCLUSIVOS + parcela com selo "i/18"; semana na virada = mostra so dias do mes; Mentor fora do mes atual = adapta por contexto; meta sem divisao por zero = vira elogio. SUGESTOES ACEITAS: ♻️ selo recorrente no card, estado vazio bonito, copy "a receber hoje" p/ entradas, data de pagamento editavel (default hoje).
CUIDADOS TECNICOS no Prompt: 2 funcoes de calculo (calcTotais fixo x pendente); recorrencia rolavel (nasce so ao pagar, valor herdado, desativavel); Mentor reusa voz (nao duplica); guarda de zero; tudo em tokens; nao tocar Transacoes/negocio nem .fin-card(1285).

### P6 GERADO  [2026-06-15]
Prompt gerado -> executor-20260615-001 (Sonnet / High / tier L / Construtor->Forge->Sentinela). 8 tarefas (41-48) + checklist atualizado (Etapa 33). Status: GERADO.

### RODADA 3 - polimento visual  [2026-06-15]
R2 fechou 8/8 + smoke 50/50. Leo: tela ficou perfeita, so pequenos ajustes visuais. 4 itens (so CSS+markup, NAO mexe na logica R2):
- (1) chips A Receber/A Pagar/Todas viram CARDS QUADRADOS na mesma linha (rotulo topo, valor base, 3 col iguais). Ordem do esboco: A Receber, A Pagar, Todas (Todas default). Seguem como filtro.
- (2) toggle Mes/Semana: MESMO design, so centralizar ao meio + aumentar um pouco.
- (3) card Mentor do rodape: vestir com IDENTIDADE do Mentor (badge "Mentor" + icone + realce teal) reusando .ai/.ai-badge/.mtr-spotlight; so badge (sem tag dupla); mesma cara no Mentor por semana.
- (4) accordion "Pagas": estava sem formatacao (exp 0). Virar bloco elegante: ✅ verde + contagem em chip income + total verde/mono + seta giratoria + cards concluidos riscados/opacos + "Pago em DD/MM".
P6 GERADO -> executor-20260615-002 (Sonnet/High/tier M / Forge->Sentinela). 5 tarefas (49-53). Status: GERADO.

### RODADA 4 - card Mentor repaginado  [2026-06-15]
R3 fechou 5/5 + smoke 63/63. Leo: tudo otimo, EXCETO o card do Mentor - textos mal formatados + valor "/dia" deformado por persona + nao casa com os cards da aba Mentor.
DIAGNOSTICO (P1): (a) frase fin-metadiaria (15-mentor.js l.380-386) JA cita "meta de R$ X/dia" E o card mostra hero "R$ X /dia" -> valor 2x, formatado diferente por tom. (b) card usa layout proprio .fin-mentor-rod, nao a anatomia .mtr-card da aba Mentor (cardHTML 15-mentor.js l.651-663: ico+main[t+s]+side).
DECISAO (aprovada): adotar anatomia .mtr-card (ico teal + titulo "Meta diaria" + frase persona + HERO UNICO a direita R$ X/dia mono/teal). Frase reescrita p/ falar do total devido+prazo SEM citar o /dia. Estados passado/futuro/tudo-pago sem hero. Mesma cara no Mentor por semana.
P6 GERADO -> executor-20260615-003 (Sonnet/High/tier S / Construtor->Forge->Sentinela). 3 tarefas (54-56). Status: GERADO.

### RODADA 5 - abas + progresso + bug accordion + terminologia  [2026-06-15]
R4 fechou 3/3. Leo: mais ajustes. 5 itens (premium, nada solto):
- (1) REMOVER "Todas" (misturar dava conflito). So A Receber/A Pagar -> 2 cards retangulares 50/50, ABAS sempre-um-ativo, default A Pagar (decisao Leo).
- (2) textos/valores CENTRALIZADOS no card (harmonia).
- (3) PROGRESSO no card: barra fina + fracao 10/20 (pagas/total do tipo). Valor grande = pendente.
- (4) BUG investigado (P1): accordion "Pagas" some ao filtrar. CAUSA = filtered() l.20-21 descarta pagas (&&status!=paga) + buildListaMes l.158 so monta Pagas com !filtroCard. FIX: filtrar so por tipo + accordion sempre, pagas do tipo. Conecta com remocao do "Todas" (senao Pagas nunca apareceria).
- (5) TERMINOLOGIA contextual por tipo (estado interno UNICO status=paga=liquidada, so o rotulo muda): a pagar -> "Marcar como pago"/"Pago em"/"Pagas"; a receber -> "Marcar como recebido"/"Recebido em"/"Recebidas". Vale modo Mes E Semana.
CUIDADOS: estado unico (nao refatorar mecanica/transacoes ja corretas); consistencia no modo Semana; denominador progresso = todas do tipo no mes.
P6 GERADO -> executor-20260615-004 (Sonnet/High/tier M / Construtor->Forge->Sentinela). 3 tarefas (57-59). Status: GERADO. Leo avisou: depois volta com mais reajustes finos.

### RODADA 6 - Mentor Semanal carry-over + correcoes do card Mentor  [2026-06-15]
R5 fechou 3/3. Leo: mais ajustes + UPGRADE grande no Mentor Semanal. 6 itens:
- (1) [BUG] accordion modo Mes ignora o nome (acordeaoHdr l.141 "Pagas" fixo) -> "Contas Pagas"/"Contas Recebidas".
- (2) [BUG/CSS] card Mentor nao condiz c/ aba Mentor: override l.1695 mata o .mtr-card (perde listra teal). Limpar CSS legado R3/R4.
- (3) conteudo do card Mentor (Mes): frase amarra deve->prazo->meta (leigo entende) + toque humano + pool ampliado + meta 1x (hero, legenda "por dia").
- (4) [BUG] rodape Mentor duplica no modo Semana -> so no modo Mes.
- (5) tag flutuante "MENTOR" (.mtr-spot-tag) no topo de todos os cards Mentor.
- (6) UPGRADE Mentor Semanal com CARRY-OVER (memoria de atraso): cada bloco tem Mentor; contas nao pagas acumulam; a semana ATUAL absorve; 6 estados (Meta/Acumulo/Vencidas/Fechada/Suave/Previa); voz humana 3 tons (atraso gentil); atualiza ao pagar. Plano dedicado: plano-mentor-semanal-carryover-20260615.md.
LENTE (Leo pediu): 7 furos achados+incorporados — dupla contagem, meses navegados, vocabulario "Vencidas", A Receber adaptado, tom anti-culpa, densidade (anti mar-de-alerta), meta-teto.
P6 GERADO -> executor-20260615-005 (Sonnet/High/tier L / Construtor->Forge->Sentinela). 6 tarefas (60-65). Status: GERADO.

## Rumo ao Prompt (consolida no P6)
R6 -> 6 tarefas 60-65 (60∥61 -> 62 -> 63 -> 64 -> 65). Engenharia carry-over no plano dedicado.
R5 -> 3 tarefas 57-59 (57 logica -> 58 visual -> 59 smoke).
R4 -> 3 tarefas 54-56 (54 frases -> 55 card -> 56 smoke).
R3 -> 5 tarefas 49-53 (49∥50∥51∥52 independentes -> 53 smoke).
Consolidado na Rodada 2 acima -> 8 tarefas 41-48. Ordem: 41(modelo) -> 42(modal) / 43(card-dash) -> 44(modo mes) -> 45(modo semana) -> 46(cards visual) -> 47(mentor) -> 48(smoke).

## Nao Incluido
- Aba Transacoes e modulos do Negocio (fora de escopo, intactos). - Persistencia Supabase (so Etapa 28). - Metodo de pagamento como filtro. - Coexistencia Recorrente+Parcelado (decidido: exclusivos).

