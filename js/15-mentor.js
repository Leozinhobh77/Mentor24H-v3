const Mentor=(()=>{
  const CAP=8;
  const dispensados=new Set();                 // ids escondidos na sessão (sem persistência)
  const SEV={critico:{o:0,ic:'alert',cor:'expense'},atencao:{o:1,ic:'clock',cor:'warning'},
             oportunidade:{o:2,ic:'trendup',cor:'income'},info:{o:3,ic:'zap',cor:'info'}};

  // ── helpers locais ──
  const agora=new Date();
  const HHMM=`${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;
  const mesKey=offset(0).slice(0,7);
  const wa=(tel,msg)=>`https://wa.me/55${(tel||'').replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`;
  function diasAniv(a){if(!a)return null;const p=a.split('-');if(p.length<3)return null;
    const m=+p[1],d=+p[2];let nx=new Date(HOJE.getFullYear(),m-1,d);
    if(nx<HOJE)nx=new Date(HOJE.getFullYear()+1,m-1,d);return Math.round((nx-HOJE)/86400000);}
  function mk(id,modulo,contexto,sev,dados,titulo,acao){
    return {id,modulo,contexto,severidade:sev,icone:SEV[sev].ic,titulo,texto:fraseDe(id,dados),acao};}

  // ══ A VOZ DO MENTOR (14B) — 3 tons · frase modular · anti-repetição · trava de empatia ══
  let tom='serio';                              // 'serio' | 'descontraido' | 'motivador' (memória da sessão)
  // ids sensíveis (saúde inteira + severidade crítica): aberturas/fechos sempre CALMOS, nunca zoeira/cobrança
  const SENS=new Set(['fin-vencida','prod-tarefa','sau-dose','sau-remedio','sau-adesao','sau-metrica','sau-humor']);
  const ultima={};
  function pick(arr,key){
    if(!arr||!arr.length)return '';
    if(arr.length===1){ultima[key]=arr[0];return arr[0];}
    let i,n=0;do{i=Math.floor(Math.random()*arr.length);}while(arr[i]===ultima[key]&&++n<8);
    ultima[key]=arr[i];return arr[i];
  }
  // Aberturas e fechos por tom (compartilhados). 'calmo' = usado nos ids sensíveis em qualquer tom.
  const AB={
    serio:['Atenção.','Lembrete.','Para sua atenção.','Fique de olho.','Importante.'],
    descontraido:['Ó só 👀','Psiu!','Olha aqui 👇','Dá uma olhada.','Rapidinho.'],
    motivador:['Partiu resolver! 💪','Bora lá!','Você consegue.','Foco 🎯','Simbora!'],
    calmo:['Com atenção.','Vale priorizar.','Um lembrete.','Quando puder.','Importante.']
  };
  const FE={
    serio:['','Vale revisar.','Confere quando puder.','Recomendo dar atenção.'],
    descontraido:['','😉','Bora? 👍','Tranquilo de resolver.','É rapidinho.'],
    motivador:['','Você dá conta! 🙌','Simbora!','Rumo ao verde! 🚀','Um passo de cada vez.'],
    calmo:['','No seu tempo. 🤍','Tô aqui se precisar.','Sem correria.','Cuida disso com carinho.']
  };
  // sau-humor: pool dedicado, acolhedor, SEM conselho — mesmo espírito nos 3 tons (varia só a leveza)
  const HUMOR=[
    'Notei que seus últimos registros de humor vieram mais baixos. Se quiser, registra como você tá hoje. 🤍',
    'Pelos registros, os últimos dias pesaram um pouco. Tô por aqui — anota como você se sente hoje quando quiser.',
    'Seus humores recentes andaram mais para baixo. Sem cobrança: registrar como está hoje pode ajudar a enxergar melhor.',
    'Percebi uma sequência de dias mais difíceis. Cuida de você 🤍 Se quiser, marca o humor de hoje.'
  ];
  // Núcleos factuais por id × tom (slots reais via fmt/venceTxt). 2 variações por tom.
  const NUC={
    'fin-vencida':{
      serio:[d=>d.n===1?`a conta ${d.nome} venceu e segue em aberto (${fmt(d.total)})`:`${d.n} contas já venceram, somando ${fmt(d.total)}`,
             d=>d.n===1?`${d.nome} passou do vencimento e continua pendente (${fmt(d.total)})`:`há ${d.n} contas vencidas em aberto (${fmt(d.total)})`],
      descontraido:[d=>d.n===1?`a ${d.nome} acabou passando do prazo (${fmt(d.total)})`:`${d.n} contas venceram aí (${fmt(d.total)})`,
             d=>d.n===1?`ficou uma conta vencida esperando: ${d.nome} (${fmt(d.total)})`:`tem ${d.n} contas vencidas no aguardo (${fmt(d.total)})`],
      motivador:[d=>d.n===1?`dá pra quitar a ${d.nome} e tirar esse peso (${fmt(d.total)})`:`resolver essas ${d.n} contas vencidas vai aliviar (${fmt(d.total)})`,
             d=>d.n===1?`um passo: a ${d.nome} (${fmt(d.total)}) já sai da frente`:`${d.n} contas de ${fmt(d.total)} prontas pra sair da lista`]
    },
    'fin-avencer':{
      serio:[d=>`${d.n===1?'uma conta vence':d.n+' contas vencem'} em até 3 dias (${fmt(d.total)}); a mais próxima é ${d.nome}, ${venceTxt(d.venc).toLowerCase()}`,
             d=>`${fmt(d.total)} em contas chegando no prazo — ${d.nome} ${venceTxt(d.venc).toLowerCase()}`],
      descontraido:[d=>`${d.n===1?'uma conta tá quase vencendo':d.n+' contas batendo na porta'} (${fmt(d.total)}) — ${d.nome} ${venceTxt(d.venc).toLowerCase()}`,
             d=>`se prepara: ${fmt(d.total)} vencendo logo, começando pela ${d.nome} (${venceTxt(d.venc).toLowerCase()})`],
      motivador:[d=>`adianta ${d.n===1?'essa conta':'essas '+d.n+' contas'} (${fmt(d.total)}) e fica livre — ${d.nome} ${venceTxt(d.venc).toLowerCase()}`,
             d=>`organiza ${fmt(d.total)} agora e dorme tranquilo; ${d.nome} ${venceTxt(d.venc).toLowerCase()}`]
    },
    'fin-saldoneg':{
      serio:[d=>`suas saídas do mês superam as entradas em ${fmt(-d.saldo)}`,
             d=>`o saldo do mês está negativo em ${fmt(-d.saldo)}`],
      descontraido:[d=>`o mês tá no vermelho em ${fmt(-d.saldo)}`,
             d=>`gastou mais do que entrou: ${fmt(-d.saldo)} no negativo`],
      motivador:[d=>`dá pra virar esse jogo: faltam ${fmt(-d.saldo)} pra equilibrar o mês`,
             d=>`${fmt(-d.saldo)} pra zerar — um corte aqui e ali e você chega lá`]
    },
    'fin-meta':{
      serio:[d=>`a meta "${d.nome}" está atrás do ritmo: ${d.pct}% concluída, ${d.dias} dias restantes`,
             d=>`"${d.nome}" precisa de um empurrão — ${d.pct}% em ${d.dias} dias`],
      descontraido:[d=>`a meta "${d.nome}" tá meio devagar: ${d.pct}% feito, ${d.dias} dias no relógio`,
             d=>`"${d.nome}" pedindo ritmo — só ${d.pct}% com ${d.dias} dias`],
      motivador:[d=>`bora acelerar "${d.nome}"! ${d.pct}% feito, ${d.dias} dias pra brilhar`,
             d=>`"${d.nome}" a ${d.pct}% — dá tempo de cravar em ${d.dias} dias 🎯`]
    },
    'neg-fiado':{
      serio:[d=>d.um?`${d.nome} tem ${fmt(d.total)} em aberto a receber`:`${fmt(d.total)} a receber de ${d.n} ${d.n===1?'cliente':'clientes'} no fiado`,
             d=>d.um?`há ${fmt(d.total)} pendentes com ${d.nome}`:`o fiado soma ${fmt(d.total)} de ${d.n} clientes`],
      descontraido:[d=>d.um?`${d.nome} ainda tá devendo ${fmt(d.total)}`:`${fmt(d.total)} pra entrar de ${d.n} clientes no fiado`,
             d=>d.um?`rolê do fiado: ${d.nome} com ${fmt(d.total)} em aberto`:`tem ${fmt(d.total)} no fiado esperando (${d.n} clientes)`],
      motivador:[d=>d.um?`um toque no ${d.nome} e ${fmt(d.total)} entram no caixa`:`${fmt(d.total)} prontos pra virar caixa — é só cobrar`,
             d=>d.um?`recebe esse ${fmt(d.total)} do ${d.nome} e fortalece o caixa`:`${fmt(d.total)} de ${d.n} clientes esperando seu empurrãozinho`]
    },
    'neg-estoque':{
      serio:[d=>`${d.n===1?'um produto está':d.n+' produtos estão'} com estoque baixo: ${d.nomes}`,
             d=>`estoque baixo em ${d.n} ${d.n===1?'item':'itens'} (${d.nomes})`],
      descontraido:[d=>`tá acabando: ${d.nomes}`,
             d=>`${d.nomes} quase no fim do estoque 📦`],
      motivador:[d=>`repõe ${d.nomes} e não perde venda nenhuma`,
             d=>`bora reabastecer ${d.nomes} antes que falte 🚀`]
    },
    'neg-parado':{
      serio:[d=>`${d.n} ${d.n===1?'produto está parado':'produtos estão parados'} sem vendas no período${d.nomes?` (${d.nomes})`:''}`,
             d=>`${d.n} ${d.n===1?'item':'itens'} sem giro — vale revisar ou promover${d.nomes?`: ${d.nomes}`:''}`],
      descontraido:[d=>`${d.n} ${d.n===1?'produto encostado':'produtos encostados'} sem vender${d.nomes?` (${d.nomes})`:''}`,
             d=>`uns ${d.n} itens criando teia de aranha${d.nomes?`: ${d.nomes}`:''} 🕸️`],
      motivador:[d=>`que tal uma promo pra girar esses ${d.n}?${d.nomes?` ${d.nomes}`:''}`,
             d=>`${d.n} produtos esperando uma chance de brilhar${d.nomes?`: ${d.nomes}`:''}`]
    },
    'neg-campeao':{
      serio:[d=>`seu campeão de lucro é ${d.nome} (${fmt(d.lucro)} no período)`,
             d=>`${d.nome} lidera o lucro com ${fmt(d.lucro)}`],
      descontraido:[d=>`o queridinho é ${d.nome}, ${fmt(d.lucro)} de lucro 🏆`,
             d=>`${d.nome} tá voando: ${fmt(d.lucro)} no bolso`],
      motivador:[d=>`${d.nome} é seu campeão (${fmt(d.lucro)}) — investe nele e cresça mais!`,
             d=>`aposta no ${d.nome}: ${fmt(d.lucro)} mostram que é ouro 🚀`]
    },
    'neg-margem':{
      serio:[d=>`${d.n===1?'um produto tem':d.n+' produtos têm'} margem abaixo de 20%: ${d.nomes}`,
             d=>`margem apertada (abaixo de 20%) em ${d.nomes}`],
      descontraido:[d=>`a margem de ${d.nomes} tá magrinha (menos de 20%)`,
             d=>`${d.nomes} rendendo pouquinho — margem abaixo de 20%`],
      motivador:[d=>`ajusta o preço de ${d.nomes} e ganha mais em cada venda`,
             d=>`um reajuste em ${d.nomes} e a margem decola 🚀`]
    },
    'sau-dose':{
      serio:[d=>`você tem ${d.n} ${d.n===1?'dose de hoje sem registro de tomada':'doses de hoje sem registro de tomada'}`,
             d=>`${d.n} ${d.n===1?'dose programada para hoje ainda não foi marcada':'doses programadas para hoje ainda não foram marcadas'}`],
      descontraido:[d=>`faltou marcar ${d.n} ${d.n===1?'dose de hoje':'doses de hoje'}`,
             d=>`${d.n} ${d.n===1?'dose de hoje segue':'doses de hoje seguem'} sem registro`],
      motivador:[d=>`cuidar de você vem primeiro: ${d.n} ${d.n===1?'dose de hoje':'doses de hoje'} esperando o registro`,
             d=>`sua saúde em dia — ${d.n} ${d.n===1?'dose':'doses'} de hoje pra confirmar`]
    },
    'sau-remedio':{
      serio:[d=>`${d.n===1?'um remédio está acabando':d.n+' remédios estão acabando'}: ${d.nomes}`,
             d=>`estoque baixo de ${d.nomes}`],
      descontraido:[d=>`tá no finalzinho: ${d.nomes}`,
             d=>`${d.nomes} quase no fim`],
      motivador:[d=>`vale repor ${d.nomes} pra não ficar sem`,
             d=>`garante já ${d.nomes} e siga firme no tratamento`]
    },
    'sau-adesao':{
      serio:[d=>`sua adesão aos remédios na semana está em ${d.pct}%`,
             d=>`na última semana, ${d.pct}% das doses foram registradas`],
      descontraido:[d=>`a semana fechou em ${d.pct}% de adesão`,
             d=>`${d.pct}% das doses marcadas essa semana`],
      motivador:[d=>`dá pra subir esses ${d.pct}% — cada dose conta`,
             d=>`${d.pct}% essa semana; bora chegar mais perto do 100%`]
    },
    'sau-metrica':{
      serio:[d=>`seu último registro de ${d.nome} está fora da faixa de referência (${d.valor})`,
             d=>`${d.nome} aparece fora do esperado no último registro (${d.valor})`],
      descontraido:[d=>`o último ${d.nome} veio fora da faixa (${d.valor})`,
             d=>`${d.nome} deu uma saída da faixa (${d.valor})`],
      motivador:[d=>`fica de olho no ${d.nome} (${d.valor}) — acompanhar de perto ajuda`,
             d=>`vale monitorar ${d.nome} (${d.valor}); você no controle`]
    },
    'prod-tarefa':{
      serio:[d=>d.n===1?`a tarefa "${d.nome}" está atrasada`:`${d.n} tarefas estão atrasadas`,
             d=>d.n===1?`"${d.nome}" passou do prazo`:`há ${d.n} tarefas passadas do prazo`],
      descontraido:[d=>d.n===1?`a "${d.nome}" ficou pra trás`:`${d.n} tarefas atrasadinhas`,
             d=>d.n===1?`"${d.nome}" tá te esperando`:`${d.n} tarefas no aguardo, já passaram do prazo`],
      motivador:[d=>d.n===1?`bora fechar a "${d.nome}" e sentir o alívio`:`${d.n} tarefas atrasadas — começa por uma e desencalha`,
             d=>d.n===1?`um gás na "${d.nome}" e ela sai da lista`:`derruba essas ${d.n} tarefas, uma de cada vez`]
    },
    'prod-habito':{
      serio:[d=>`${d.nome} ainda não foi registrado hoje${d.outros?` (e mais ${d.outros})`:''}`,
             d=>`falta marcar ${d.nome} hoje${d.outros?` e outros ${d.outros}`:''}`],
      descontraido:[d=>`${d.nome} tá te esperando hoje${d.outros?` (+${d.outros})`:''}`,
             d=>`hoje ainda sem ${d.nome}${d.outros?` e mais ${d.outros}`:''}`],
      motivador:[d=>`não perde a sequência de ${d.nome}${d.outros?` (+${d.outros})`:''} — você tá indo bem!`,
             d=>`mantém a chama de ${d.nome} acesa hoje${d.outros?` e +${d.outros}`:''} 🔥`]
    },
    'prod-agenda':{
      serio:[d=>[d.nEv?`${d.nEv} ${d.nEv===1?'compromisso hoje':'compromissos hoje'}`:'',d.aniv?`aniversário de ${d.aniv} ${d.anivDias===0?'hoje':'em '+d.anivDias+'d'}`:''].filter(Boolean).join('; '),
             d=>[d.aniv?`${d.aniv} faz aniversário ${d.anivDias===0?'hoje':'em '+d.anivDias+' dias'}`:'',d.nEv?`${d.nEv} ${d.nEv===1?'compromisso':'compromissos'} na agenda de hoje`:''].filter(Boolean).join('; ')],
      descontraido:[d=>[d.nEv?`${d.nEv} ${d.nEv===1?'parada hoje':'paradas hoje'}`:'',d.aniv?`aniversário de ${d.aniv} ${d.anivDias===0?'é hoje 🎉':'em '+d.anivDias+'d 🎂'}`:''].filter(Boolean).join(' · '),
             d=>[d.aniv?`bolo à vista: ${d.aniv} ${d.anivDias===0?'hoje 🎂':'em '+d.anivDias+'d'}`:'',d.nEv?`${d.nEv} ${d.nEv===1?'compromisso':'compromissos'} hoje`:''].filter(Boolean).join(' · ')],
      motivador:[d=>[d.nEv?`${d.nEv} ${d.nEv===1?'compromisso':'compromissos'} pra arrasar hoje`:'',d.aniv?`e o aniversário de ${d.aniv} ${d.anivDias===0?'hoje':'em '+d.anivDias+'d'} pra lembrar`:''].filter(Boolean).join(' '),
             d=>[d.aniv?`capricha no carinho com ${d.aniv} (${d.anivDias===0?'hoje':d.anivDias+'d'})`:'',d.nEv?`e manda ver nos ${d.nEv} compromissos de hoje`:''].filter(Boolean).join(' ')]
    },
    // ── ESTUDOS (Etapa 16) ──
    'est-prova':{
      serio:[d=>`faltam ${d.dias}d para a prova de ${d.materia} e você estudou só ${d.horas}h essa semana`,
             d=>`a prova de ${d.materia} é em ${d.dias}d e a semana soma ${d.horas}h de estudo`],
      descontraido:[d=>`prova de ${d.materia} em ${d.dias}d e só ${d.horas}h essa semana 👀`,
             d=>`${d.dias}d pra prova de ${d.materia}; tá em ${d.horas}h na semana`],
      motivador:[d=>`${d.dias}d pra prova de ${d.materia} — bora passar das ${d.horas}h dessa semana! 💪`,
             d=>`dá pra chegar firme na prova de ${d.materia} (${d.dias}d): foco nessas horas 🎯`]
    },
    'est-parado':{
      serio:[d=>`você não estuda ${d.materia} há ${d.dias} dias`,
             d=>`${d.materia} está há ${d.dias} dias sem nenhuma sessão`],
      descontraido:[d=>`${d.materia} tá esquecida há ${d.dias}d 👀`,
             d=>`faz ${d.dias}d que ${d.materia} não vê você`],
      motivador:[d=>`que tal retomar ${d.materia} hoje? ${d.dias}d sem estudar, dá pra voltar! 💪`,
             d=>`bora desencalhar ${d.materia} (${d.dias}d parada) — um pouco já conta`]
    },
    'est-meta':{
      serio:[d=>`você bateu a meta semanal de ${d.materia} (${d.horas}h)`,
             d=>`meta de estudo de ${d.materia} atingida nesta semana: ${d.horas}h`],
      descontraido:[d=>`mandou bem! meta de ${d.materia} batida (${d.horas}h) 🎉`,
             d=>`${d.materia} no alvo essa semana: ${d.horas}h ✅`],
      motivador:[d=>`isso! bateu a meta de ${d.materia} (${d.horas}h) — segue nesse ritmo! 🚀`,
             d=>`meta de ${d.materia} conquistada (${d.horas}h)! orgulho 🙌`]
    },
    // ── LEITURA (Etapa 17) ──
    'leit-parado':{
      serio:[d=>`você está há ${d.dias} dias sem avançar em "${d.titulo}"`,
             d=>`"${d.titulo}" está parado há ${d.dias} dias`],
      descontraido:[d=>`"${d.titulo}" tá te esperando há ${d.dias}d 👀`,
             d=>`faz ${d.dias}d que "${d.titulo}" não vira uma página`],
      motivador:[d=>`que tal retomar "${d.titulo}"? ${d.dias}d parado, dá pra voltar! 📖`,
             d=>`um capítulo de "${d.titulo}" hoje (${d.dias}d parado) já reanima a leitura`]
    },
    'leit-meta':{
      serio:[d=>`faltam ${d.faltam} ${d.faltam===1?'livro':'livros'} para sua meta de ${d.meta} em ${d.ano}`,
             d=>`sua meta de ${d.meta} livros em ${d.ano} ainda pede ${d.faltam}`],
      descontraido:[d=>`faltam ${d.faltam} ${d.faltam===1?'livrinho':'livros'} pra meta de ${d.ano} 📚`,
             d=>`${d.faltam} ${d.faltam===1?'livro':'livros'} e você fecha a meta de ${d.ano}`],
      motivador:[d=>`só mais ${d.faltam} ${d.faltam===1?'livro':'livros'} pra bater a meta de ${d.ano} — bora! 🚀`,
             d=>`a meta de ${d.meta} livros tá logo ali: faltam ${d.faltam} 💪`]
    },
    'leit-semler':{
      serio:[d=>`você não registra leitura há ${d.dias} dias`,
             d=>`já são ${d.dias} dias sem nenhuma sessão de leitura`],
      descontraido:[d=>`faz ${d.dias}d que você não lê 👀`,
             d=>`${d.dias}d sem virar uma página, hein 📖`],
      motivador:[d=>`que tal 10 minutinhos de leitura hoje? ${d.dias}d sem ler`,
             d=>`bora reativar o hábito — ${d.dias}d sem leitura, um pouco já conta 💪`]
    },
    // ── SÉRIES (Etapa 18) ──
    'ser-parada':{
      serio:[d=>`você parou "${d.titulo}" na T${d.temp}E${d.ep} há ${d.dias} dias`,
             d=>`"${d.titulo}" está parada na T${d.temp}E${d.ep} há ${d.dias} dias`],
      descontraido:[d=>`"${d.titulo}" travou na T${d.temp}E${d.ep} faz ${d.dias}d 👀`,
             d=>`faz ${d.dias}d que "${d.titulo}" tá pausada (T${d.temp}E${d.ep})`],
      motivador:[d=>`que tal voltar pra "${d.titulo}"? Parou na T${d.temp}E${d.ep}, ${d.dias}d atrás 📺`,
             d=>`um episódio de "${d.titulo}" hoje (parada há ${d.dias}d) já reanima a maratona`]
    },
    'ser-fila':{
      serio:[d=>`você tem ${d.n} séries na lista "quero assistir"`,
             d=>`há ${d.n} séries esperando na sua fila`],
      descontraido:[d=>`${d.n} séries esperando na fila 🍿`,
             d=>`sua fila tem ${d.n} séries pra começar`],
      motivador:[d=>`${d.n} séries na fila — escolhe uma e começa hoje! 🍿`,
             d=>`que tal estrear uma das ${d.n} da fila? 🎬`]
    },
    'ser-semver':{
      serio:[d=>`você não assiste nada da lista há ${d.dias} dias`,
             d=>`já são ${d.dias} dias sem registrar episódios`],
      descontraido:[d=>`faz ${d.dias}d que você não assiste nada 👀`,
             d=>`${d.dias}d sem um episódio sequer, hein 📺`],
      motivador:[d=>`que tal um episódio hoje? ${d.dias}d sem assistir`,
             d=>`bora voltar pra lista — ${d.dias}d parado, um ep já conta 💪`]
    },
    // ── TREINOS (Etapa 19) ──
    'tre-hoje':{
      serio:[d=>`hoje é dia do ${d.plano} no seu plano`,d=>`seu plano marca ${d.plano} para hoje`],
      descontraido:[d=>`bora? hoje é dia do ${d.plano} 💪`,d=>`${d.plano} te espera hoje 🏋️`],
      motivador:[d=>`hoje é dia do ${d.plano} — não deixa pra depois! 💪`,d=>`partiu ${d.plano}? seu eu do futuro agradece 🔥`]
    },
    'tre-meta':{
      serio:[d=>`você fez ${d.feitos} de ${d.meta} treinos planejados nesta semana`,d=>`${d.feitos}/${d.meta} treinos da semana até agora`],
      descontraido:[d=>`${d.feitos}/${d.meta} treinos essa semana — falta pouco 👟`,d=>`tá em ${d.feitos} de ${d.meta} na semana`],
      motivador:[d=>`faltam ${d.meta-d.feitos} pra fechar a semana (${d.feitos}/${d.meta}) — bora! 💪`,d=>`${d.feitos}/${d.meta}: mais um e a meta tá garantida 🎯`]
    },
    'tre-pr':{
      serio:[d=>`novo recorde de carga no ${d.exercicio}: ${d.carga}kg`,d=>`${d.exercicio} atingiu ${d.carga}kg — seu maior registro`],
      descontraido:[d=>`PR no ${d.exercicio}: ${d.carga}kg! 🎉`,d=>`mandou ${d.carga}kg no ${d.exercicio} 💥`],
      motivador:[d=>`isso! PR de ${d.carga}kg no ${d.exercicio} — tá voando! 🚀`,d=>`${d.carga}kg no ${d.exercicio}, novo recorde! orgulho 🙌`]
    },
    'tre-plato':{
      serio:[d=>`seu volume de treino está estável há cerca de 3 semanas`,d=>`o volume não sobe há ~3 semanas`],
      descontraido:[d=>`volume empacou faz umas 3 semanas 🧱`,d=>`3 semanas no mesmo volume, hein`],
      motivador:[d=>`bora furar o platô! varie carga ou exercícios 🧱→🚀`,d=>`hora de mudar o estímulo — 3 semanas no mesmo volume`]
    },
    'tre-sumido':{
      serio:[d=>`você não treina há ${d.dias} dias`,d=>`já são ${d.dias} dias sem treino`],
      descontraido:[d=>`faz ${d.dias}d que você não treina 👀`,d=>`${d.dias}d longe do treino, bora voltar?`],
      motivador:[d=>`que tal voltar hoje? ${d.dias}d parado, um treino leve já conta 💪`,d=>`retoma o ritmo — ${d.dias}d sem treinar, você consegue 🔥`]
    },
    // ── SALVOS (Etapa 20) ──
    'sav-semana':{
      serio:[d=>`você salvou ${d.n} ${d.n===1?'coisa':'coisas'} nos últimos 7 dias`,d=>`${d.n} ${d.n===1?'link salvo':'links salvos'} nesta semana`],
      descontraido:[d=>`você salvou ${d.n} coisas essa semana 🔖`,d=>`${d.n} novidades guardadas na semana 👀`],
      motivador:[d=>`${d.n} salvos essa semana — que tal ver um agora? 🔖`,d=>`bora aproveitar: ${d.n} coisas novas guardadas essa semana`]
    },
    'sav-paraver':{
      serio:[d=>`você tem ${d.n} itens em "pra ver depois"`,d=>`${d.n} salvos seguem na lista de "pra ver"`],
      descontraido:[d=>`${d.n} itens em "pra ver depois" 👀`,d=>`a fila de "pra ver" tá em ${d.n} itens`],
      motivador:[d=>`que tal zerar a fila? ${d.n} itens esperando em "pra ver" 👀`,d=>`${d.n} pra ver depois — escolhe um e marca como visto hoje ✓`]
    },
    'sav-cat':{
      serio:[d=>`sua categoria "${d.cat}" é a que mais cresce (${d.n} itens)`,d=>`"${d.cat}" lidera seus salvos com ${d.n} itens`],
      descontraido:[d=>`sua categoria "${d.cat}" tá crescendo (${d.n}) 📈`,d=>`"${d.cat}" virou febre: já são ${d.n} salvos`],
      motivador:[d=>`"${d.cat}" tá bombando (${d.n})! que tal revisitar um? 🚀`,d=>`${d.n} salvos em "${d.cat}" — seu interesse tá claro, explora mais!`]
    }
  };

  // ── Montador + anti-repetição + trava de empatia (mesma assinatura da 14A) ──
  function fraseDe(id,d){
    if(id==='sau-humor')return pick(HUMOR,'sau-humor');        // muito delicado: sem abertura/fecho, sem conselho
    const blk=NUC[id];
    if(!blk)return '';
    const tomNuc=blk[tom]?tom:'serio';
    const poolKey=SENS.has(id)?'calmo':tom;                    // sensível → abertura/fecho calmos em qualquer tom
    const ab=pick(AB[poolKey]||AB.serio,`${id}|${poolKey}|ab`);
    const nuc=pick(blk[tomNuc],`${id}|${tomNuc}|nuc`)(d);
    const fe=pick(FE[poolKey]||FE.serio,`${id}|${poolKey}|fe`);
    const core=nuc?(nuc.charAt(0).toUpperCase()+nuc.slice(1)).replace(/[.!?…]+$/,'')+'.':'';
    return [ab,core,fe].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
  }

  // ── MOTOR DE REGRAS (funções puras DB → insight | null) ──
  const REGRAS=[
    // FINANÇAS
    ()=>{const v=DB.contas.filter(c=>c.tipo==='pagar'&&c.status!=='paga'&&diasAte(c.venc)<0);if(!v.length)return null;
      return mk('fin-vencida','Finanças','ambos','critico',{n:v.length,total:v.reduce((s,c)=>s+c.valor,0),nome:v[0].descricao},
        v.length===1?'Conta vencida':`${v.length} contas vencidas`,{label:'Ver contas',navTo:'financas'});},
    ()=>{const v=DB.contas.filter(c=>c.tipo==='pagar'&&c.status!=='paga'&&diasAte(c.venc)>=0&&diasAte(c.venc)<=3);if(!v.length)return null;
      v.sort((a,b)=>diasAte(a.venc)-diasAte(b.venc));
      return mk('fin-avencer','Finanças','ambos','atencao',{n:v.length,total:v.reduce((s,c)=>s+c.valor,0),nome:v[0].descricao,venc:v[0].venc},
        'Contas a vencer',{label:'Ver contas',navTo:'financas'});},
    ()=>{const t=DB.transacoes.filter(x=>x.data.slice(0,7)===mesKey);
      const saldo=t.reduce((s,x)=>s+(x.tipo==='entrada'?x.valor:-x.valor),0);if(saldo>=0)return null;
      return mk('fin-saldoneg','Finanças','ambos','atencao',{saldo},'Saldo do mês negativo',{label:'Ver transações',navTo:'transacoes'});},
    ()=>{let pior=null;DB.metas.filter(m=>m.status==='ativa'&&m.prazo).forEach(m=>{
        const dias=diasAte(m.prazo);if(dias<=0)return;
        const total=Math.max(1,diasAte(m.prazo)-diasAte(m.criadoEm));const decorr=-diasAte(m.criadoEm);
        const esp=Math.min(1,Math.max(0,decorr/total)),real=m.atual/m.alvo,atras=esp-real;
        if(atras>0.12&&(!pior||atras>pior.atras))pior={m,dias,atras,pct:Math.round(real*100)};});
      if(!pior)return null;
      return mk('fin-meta','Finanças','ambos','oportunidade',{nome:pior.m.nome,pct:pior.pct,dias:pior.dias},
        'Meta fora do ritmo',{label:'Ver meta',navTo:'metas'});},
    // NEGÓCIO
    ()=>{const pend=DB.vendas.filter(v=>v.pagamento==='a_prazo'&&v.status==='pendente');if(!pend.length)return null;
      const total=pend.reduce((s,v)=>s+(v.total-(v.recebido||0)),0);if(total<=0)return null;
      const ids=[...new Set(pend.map(v=>v.clienteId).filter(Boolean))];let um=ids.length===1,nome='',acao={label:'Ver clientes',navTo:'clientes'};
      if(um){const c=DB.contatos.find(x=>x.id===ids[0]);if(c){nome=c.nome;if(c.telefone)acao={label:'Cobrar no WhatsApp',navTo:'clientes',href:wa(c.telefone,`Oi ${c.nome}! 😊 Passando pra lembrar do valor de ${fmt(total)} da(s) sua(s) compra(s). Quando puder acertar, me avisa? 🙏`)};}else um=false;}
      return mk('neg-fiado','Negócio','negocio','atencao',{total,n:ids.length||pend.length,um,nome},'Fiado a receber',acao);},
    ()=>{const p=DB.produtos.filter(x=>x.ativo&&x.estoque<=x.estoqueMin);if(!p.length)return null;
      return mk('neg-estoque','Negócio','negocio','atencao',{n:p.length,nomes:p.slice(0,3).map(x=>x.nome).join(', ')+(p.length>3?'…':'')},
        'Estoque baixo',{label:'Ver estoque',navTo:'estoque'});},
    ()=>{const vendidos=new Set();DB.vendas.forEach(v=>v.itens.forEach(i=>i.produtoId&&vendidos.add(i.produtoId)));
      const p=DB.produtos.filter(x=>x.ativo&&x.estoque<900&&!vendidos.has(x.id));if(!p.length)return null;
      return mk('neg-parado','Negócio','negocio','info',{n:p.length,nomes:p.slice(0,3).map(x=>x.nome).join(', ')+(p.length>3?'…':'')},
        'Produtos parados',{label:'Ver relatórios',navTo:'relatorios'});},
    ()=>{const lucro={};DB.vendas.forEach(v=>v.itens.forEach(i=>{const p=DB.produtos.find(x=>x.id===i.produtoId);if(p)lucro[p.id]=(lucro[p.id]||0)+(i.preco-p.custo)*i.qtd;}));
      const top=Object.entries(lucro).sort((a,b)=>b[1]-a[1])[0];if(!top||top[1]<=0)return null;
      const p=DB.produtos.find(x=>x.id===+top[0]);
      return mk('neg-campeao','Negócio','negocio','oportunidade',{nome:p?p.nome:'Produto',lucro:top[1]},
        'Produto campeão',{label:'Ver relatórios',navTo:'relatorios'});},
    ()=>{const p=DB.produtos.filter(x=>x.ativo&&x.preco>0&&(x.preco-x.custo)/x.preco<0.20);if(!p.length)return null;
      return mk('neg-margem','Negócio','negocio','atencao',{n:p.length,nomes:p.slice(0,3).map(x=>x.nome).join(', ')+(p.length>3?'…':'')},
        'Margem baixa',{label:'Ver produtos',navTo:'produtos'});},
    // SAÚDE
    ()=>{let n=0;DB.medicamentos.filter(m=>m.status==='ativo'&&m.freq==='diario').forEach(m=>{
        (m.horarios||[]).forEach(h=>{if(h.hora<HHMM&&!DB.tomadas.some(t=>t.medId===m.id&&t.data===offset(0)&&t.hora===h.hora))n++;});});
      if(!n)return null;
      return mk('sau-dose','Saúde','pessoal','critico',{n},'Dose atrasada',{label:'Ver saúde',navTo:'saude'});},
    ()=>{const m=DB.medicamentos.filter(x=>x.status==='ativo'&&x.estoque<=x.estoqueMin);if(!m.length)return null;
      return mk('sau-remedio','Saúde','pessoal','atencao',{n:m.length,nomes:m.map(x=>x.nome).join(', ')},
        'Remédio acabando',{label:'Ver saúde',navTo:'saude'});},
    ()=>{const recent=DB.tomadas.filter(t=>diasAte(t.data)>=-6);if(!recent.length)return null; // sem registro = sem baseline → silencia
      const prev=DB.medicamentos.filter(m=>m.status==='ativo'&&m.freq==='diario').reduce((s,m)=>s+(m.horarios||[]).length*7,0);
      if(!prev)return null;const pct=Math.round(recent.length/prev*100);if(pct>=70)return null;
      return mk('sau-adesao','Saúde','pessoal','atencao',{pct},'Adesão baixa',{label:'Ver saúde',navTo:'saude'});},
    ()=>{for(const mt of DB.metricas){const r=mt.registros&&mt.registros[mt.registros.length-1];if(!r)continue;
        if(mt.tipo==='pressao'&&r.v&&(r.v.s>=140||r.v.d>=90))return mk('sau-metrica','Saúde','pessoal','atencao',{nome:mt.nome,valor:`${r.v.s}/${r.v.d} ${mt.unidade}`},'Métrica fora da faixa',{label:'Ver métricas',navTo:'metricas'});
        if(/glicose|glicemia/i.test(mt.nome)&&typeof r.v==='number'&&r.v>=126)return mk('sau-metrica','Saúde','pessoal','atencao',{nome:mt.nome,valor:`${r.v} ${mt.unidade}`},'Métrica fora da faixa',{label:'Ver métricas',navTo:'metricas'});}
      return null;},
    ()=>{const h=DB.humor.slice().sort((a,b)=>b.data.localeCompare(a.data)).slice(0,5);if(h.length<3)return null;
      const med=h.reduce((s,x)=>s+x.mood,0)/h.length;if(med>2)return null;
      return mk('sau-humor','Saúde','pessoal','info',{},'Como você tem se sentido',{label:'Ver saúde',navTo:'saude'});},
    // PRODUTIVIDADE
    ()=>{const t=DB.tarefas.filter(x=>x.coluna!=='done'&&x.prazo&&diasAte(x.prazo)<0);if(!t.length)return null;
      return mk('prod-tarefa','Produtividade','pessoal','critico',{n:t.length,nome:t.length===1?t[0].titulo:''},
        t.length===1?'Tarefa atrasada':`${t.length} tarefas atrasadas`,{label:'Ver tarefas',navTo:'tarefas'});},
    ()=>{const risco=DB.habitos.filter(h=>{const hoje=h.registros&&h.registros[offset(0)];if(hoje)return false;
        let feitos=0;for(let i=0;i<7;i++){const v=h.registros&&h.registros[offset(-i)];if(v)feitos++;}return feitos<(h.freq||7);});
      if(!risco.length)return null;
      return mk('prod-habito','Produtividade','pessoal','atencao',{nome:risco[0].nome,outros:risco.length>1?risco.length-1:0},
        'Hábito em risco',{label:'Ver hábitos',navTo:'habitos'});},
    ()=>{const ev=DB.eventos.filter(e=>e.data===offset(0)).length;
      let aniv=null,anivDias=null;DB.contatos.forEach(c=>{const d=diasAniv(c.aniversario);if(d!=null&&d>=0&&d<=7&&(anivDias==null||d<anivDias)){aniv=c.nome;anivDias=d;}});
      if(!ev&&!aniv)return null;
      return mk('prod-agenda','Produtividade','pessoal','info',{nEv:ev,aniv,anivDias},
        'Sua agenda',{label:aniv&&!ev?'Ver contatos':'Ver agenda',navTo:aniv&&!ev?'contatos':'agenda'});},
    // ESTUDOS (Etapa 16)
    ()=>{let alvo=null;
      DB.estudos.forEach(m=>{if(!m.prova)return;const dd=diasAte(m.prova);if(dd<0||dd>7)return;
        const semMin=DB.sessoesEstudo.filter(s=>s.materiaId===m.id&&diasAte(s.data)>=-6&&diasAte(s.data)<=0).reduce((a,s)=>a+s.minutos,0);
        if(semMin<(m.metaSemanal||0)*60&&(!alvo||dd<alvo.dias))alvo={materia:m.nome,dias:dd,horas:+(semMin/60).toFixed(1)};});
      if(!alvo)return null;
      return mk('est-prova','Estudos','pessoal','atencao',alvo,'Prova chegando',{label:'Estudar',navTo:'estudos'});},
    ()=>{let pior=null;
      DB.estudos.forEach(m=>{const ss=DB.sessoesEstudo.filter(s=>s.materiaId===m.id);if(!ss.length)return;
        const dias=-Math.max(...ss.map(s=>diasAte(s.data)));
        if(dias>=3&&(!pior||dias>pior.dias))pior={materia:m.nome,dias};});
      if(!pior)return null;
      return mk('est-parado','Estudos','pessoal','info',pior,'Estudo parado',{label:'Estudar agora',navTo:'estudos'});},
    ()=>{let bat=null;
      DB.estudos.forEach(m=>{if(!m.metaSemanal||bat)return;
        const semMin=DB.sessoesEstudo.filter(s=>s.materiaId===m.id&&diasAte(s.data)>=-6&&diasAte(s.data)<=0).reduce((a,s)=>a+s.minutos,0);
        if(semMin>=m.metaSemanal*60)bat={materia:m.nome,horas:+(semMin/60).toFixed(1)};});
      if(!bat)return null;
      return mk('est-meta','Estudos','pessoal','oportunidade',bat,'Meta batida 🎉',{label:'Ver estudos',navTo:'estudos'});},
    // LEITURA (Etapa 17)
    ()=>{let pior=null;
      DB.livros.filter(l=>l.estante==='lendo').forEach(l=>{
        const ss=DB.sessoesLeitura.filter(s=>s.livroId===l.id);if(!ss.length)return;
        const dias=-Math.max(...ss.map(s=>diasAte(s.data)));
        if(dias>=4&&(!pior||dias>pior.dias))pior={titulo:l.titulo,dias};});
      if(!pior)return null;
      return mk('leit-parado','Leitura','pessoal','atencao',pior,'Leitura parada',{label:'Continuar',navTo:'leitura'});},
    ()=>{const meta=DB.metaLeitura||0;if(meta<=0)return null;
      const lidos=DB.livros.filter(l=>l.estante==='lido').length;const faltam=meta-lidos;if(faltam<=0)return null;
      return mk('leit-meta','Leitura','pessoal','info',{faltam,meta,ano:new Date().getFullYear()},'Meta de leitura',{label:'Ver leitura',navTo:'leitura'});},
    ()=>{if(!DB.livros.some(l=>l.estante==='lendo')||!DB.sessoesLeitura.length)return null;
      const ult=-Math.max(...DB.sessoesLeitura.map(s=>diasAte(s.data)));if(ult<7)return null;
      return mk('leit-semler','Leitura','pessoal','info',{dias:ult},'Sem leitura',{label:'Ler agora',navTo:'leitura'});},
    // SÉRIES (Etapa 18)
    ()=>{let pior=null;
      DB.series.filter(s=>s.lista==='assistindo').forEach(s=>{
        const ss=DB.sessoesSeries.filter(x=>x.serieId===s.id);if(!ss.length)return;
        const dias=-Math.max(...ss.map(x=>diasAte(x.data)));
        if(dias>=5&&(!pior||dias>pior.dias))pior={titulo:s.titulo,temp:s.tempAtual||1,ep:s.epAtual||0,dias};});
      if(!pior)return null;
      return mk('ser-parada','Séries','pessoal','atencao',pior,'Série parada',{label:'Continuar',navTo:'series'});},
    ()=>{const n=DB.series.filter(s=>s.lista==='quero').length;if(n<3)return null;
      return mk('ser-fila','Séries','pessoal','info',{n},'Fila de séries',{label:'Ver séries',navTo:'series'});},
    ()=>{if(!DB.series.some(s=>s.lista==='assistindo')||!DB.sessoesSeries.length)return null;
      const ult=-Math.max(...DB.sessoesSeries.map(s=>diasAte(s.data)));if(ult<7)return null;
      return mk('ser-semver','Séries','pessoal','info',{dias:ult},'Sem assistir',{label:'Assistir',navTo:'series'});},
    // TREINOS (Etapa 19)
    ()=>{const DOWK=['dom','seg','ter','qua','qui','sex','sab'];const k=DOWK[HOJE.getDay()];const pid=DB.treinoAgenda&&DB.treinoAgenda[k];
      if(!pid||DB.treinoSessoes.some(s=>s.data===offset(0)))return null;
      const pl=DB.treinoPlanos.find(p=>p.id===pid);if(!pl)return null;
      return mk('tre-hoje','Treinos','pessoal','info',{plano:pl.nome},'Treino de hoje',{label:'Treinar',navTo:'treinos'});},
    ()=>{const meta=(DB.treinoConfig&&DB.treinoConfig.metaSemanal)||0;if(!meta)return null;
      const feitos=DB.treinoSessoes.filter(s=>diasAte(s.data)>=-6&&diasAte(s.data)<=0).length;const dow=HOJE.getDay();
      if(feitos>=meta||!(dow===0||dow>=3))return null;
      return mk('tre-meta','Treinos','pessoal','atencao',{feitos,meta},'Meta da semana',{label:'Treinar',navTo:'treinos'});},
    ()=>{const pr={};DB.treinoSessoes.filter(s=>s.modalidade==='musculacao').forEach(s=>{(s.exercicios||[]).forEach(e=>{(e.series||[]).forEach(se=>{if(se.carga&&(!pr[e.nome]||se.carga>pr[e.nome].carga))pr[e.nome]={carga:se.carga,data:s.data};});});});
      let best=null;Object.entries(pr).forEach(([nome,v])=>{if(-diasAte(v.data)<=10&&(!best||v.carga>best.carga))best={exercicio:nome,carga:v.carga};});
      if(!best)return null;
      return mk('tre-pr','Treinos','pessoal','oportunidade',best,'Novo recorde 🎉',{label:'Ver treinos',navTo:'treinos'});},
    ()=>{const vw=[];for(let w=3;w>=0;w--){const ini=offset(-(w*7+6)),fim=offset(-(w*7));vw.push(DB.treinoSessoes.filter(s=>s.data>=ini&&s.data<=fim).reduce((a,s)=>a+(s.volume||0),0));}
      if(vw.length<4||vw[0]===0||!(vw[3]<=vw[0]*1.03&&vw[2]<=vw[0]*1.03))return null;
      return mk('tre-plato','Treinos','pessoal','atencao',{},'Volume estagnado',{label:'Variar treino',navTo:'treinos'});},
    ()=>{if(!DB.treinoSessoes.length)return null;const dias=-Math.max(...DB.treinoSessoes.map(s=>diasAte(s.data)));
      if(dias<5)return null;
      return mk('tre-sumido','Treinos','pessoal','atencao',{dias},'Sem treinar',{label:'Treinar',navTo:'treinos'});},
    // SALVOS (Etapa 20)
    ()=>{if(!DB.salvos)return null;const n=DB.salvos.filter(s=>diasAte(s.data)>=-6).length;if(n<3)return null;
      return mk('sav-semana','Salvos','pessoal','info',{n},'Salvos da semana',{label:'Ver salvos',navTo:'salvos'});},
    ()=>{if(!DB.salvos)return null;const n=DB.salvos.filter(s=>s.status==='ver').length;if(n<5)return null;
      return mk('sav-paraver','Salvos','pessoal','atencao',{n},'Pra ver depois',{label:'Revisitar',navTo:'salvos'});},
    ()=>{if(!DB.salvos||!DB.salvos.length)return null;const m={};DB.salvos.forEach(s=>{const c=s.categoria||'Outros';m[c]=(m[c]||0)+1;});
      const top=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];if(!top||top[1]<3)return null;
      return mk('sav-cat','Salvos','pessoal','oportunidade',{cat:top[0],n:top[1]},'Categoria em alta',{label:'Ver salvos',navTo:'salvos'});},
  ];

  function rodarRegras(){
    return REGRAS.map(r=>{try{return r();}catch(e){return null;}}).filter(Boolean)
      .filter(i=>!dispensados.has(i.id))
      .sort((a,b)=>SEV[a.severidade].o-SEV[b.severidade].o);
  }
  function filtraModo(list,modoOverride){
    const m=modoOverride||document.documentElement.getAttribute('data-mode')||'pessoal';
    if(m==='negocio')return list.filter(i=>i.contexto!=='pessoal');
    if(m==='pessoal')return list.filter(i=>i.contexto!=='negocio');
    return list;
  }
  function contarCriticos(){return rodarRegras().filter(i=>i.severidade==='critico').length;}
  // Briefing do dashboard: insights do contexto pedido, no tom atual (herda fraseDe + empatia)
  function briefing(modo,limite=3){
    const all=filtraModo(rodarRegras(),modo);
    const contagem={critico:0,atencao:0,oportunidade:0,info:0};
    all.forEach(i=>contagem[i.severidade]++);
    return {spotlight:all[0]||null,contagem,resto:all.slice(1,limite),total:all.length};
  }

  // ── RENDER (feed Quiet Premium) ──
  function cardHTML(i){
    const c=SEV[i.severidade];
    const act=i.acao.href
      ?`<a class="mtr-btn" href="${i.acao.href}" target="_blank" rel="noopener">${i.acao.label}</a>`
      :`<button class="mtr-btn" data-go="${i.acao.navTo}">${i.acao.label}</button>`;
    return `<div class="mtr-card" style="--c:var(--${c.cor});--cs:var(--${c.cor}-soft)">
      <div class="mtr-ico">${svg(i.icone,17)}</div>
      <div class="mtr-main"><div class="mtr-t">${i.titulo}</div><div class="mtr-s">${i.texto}</div></div>
      <div class="mtr-side">${act}<button class="mtr-x" data-x="${i.id}" title="Dispensar">dispensar</button></div>
    </div>`;
  }
  function render(){
    const root=document.getElementById('mentor-root');if(!root)return;
    const all=filtraModo(rodarRegras());
    const nCrit=all.filter(i=>i.severidade==='critico').length;
    const nAtt=all.filter(i=>i.severidade==='atencao').length;
    const critSaude=all.some(i=>i.id==='sau-dose');           // trava: crítico de saúde → saudação/resumo calmos
    const vis=all.slice(0,CAP),resto=all.length-vis.length;
    const hr=new Date().getHours(),ola=hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite';
    const tCab=critSaude?'serio':tom;
    const emoji={serio:'👋',descontraido:'😎',motivador:'💪'}[tCab];
    const av=all.length===1?'aviso':'avisos';
    const det=`${nCrit?`, ${nCrit} ${nCrit===1?'crítico':'críticos'}`:''}${nAtt?` e ${nAtt} pedindo atenção`:''}`;
    const resumo=all.length
      ?({serio:`Você tem ${all.length} ${av}${det}.`,
         descontraido:`Bora ver o dia? ${all.length} ${av}${det}.`,
         motivador:`Vamo nessa! ${all.length} ${av}${det}${critSaude?'':' — dá pra organizar'}.`}[tCab])
      :({serio:'Nenhum alerta agora — está tudo em ordem.',
         descontraido:'Tá tudo tranquilo por aqui 😌',
         motivador:'Tudo em ordem! Segue brilhando ✨'}[tom]);
    const toggle=`<div class="mtr-tom seg">
      <button data-tom="serio" class="${tom==='serio'?'on':''}">🤝 Sério</button>
      <button data-tom="descontraido" class="${tom==='descontraido'?'on':''}">😎 Descontraído</button>
      <button data-tom="motivador" class="${tom==='motivador'?'on':''}">💪 Motivador</button>
    </div>`;
    root.innerHTML=`
      ${toggle}
      <div class="mtr-resumo"><h2>${ola}, Léo ${emoji}</h2><p>${resumo}</p></div>
      ${all.length
        ?`<div class="mtr-feed">${vis.map(cardHTML).join('')}</div>${resto>0?`<div class="mtr-more">+${resto} ${resto===1?'aviso de menor prioridade':'avisos de menor prioridade'}</div>`:''}`
        :`<div class="empty" style="padding:var(--s-6) 0"><div class="eico">${svg('spark',24)}</div><h4>Tudo em ordem por aqui ✨</h4><p>Quando algo precisar da sua atenção, aparece aqui.</p></div>`}`;
    root.querySelectorAll('[data-tom]').forEach(b=>b.onclick=()=>{tom=b.dataset.tom;render();});
    root.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>navigate(b.dataset.go));
    root.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{dispensados.add(b.dataset.x);render();});
    updateMentorBadge();
  }
  function feed(){return rodarRegras();}
  return {render,contarCriticos,briefing,feed};
})();

/* ═══ Briefing "Mentor · seu dia" no dashboard (consome Mentor.briefing — Etapa 14) ═══ */
const SEVD={
  critico:{cor:'expense',e:'🔴',l:'crítico',lp:'críticos'},
  atencao:{cor:'warning',e:'🟡',l:'atenção',lp:'atenção'},
  oportunidade:{cor:'income',e:'🟢',l:'oportunidade',lp:'oportunidades'},
  info:{cor:'info',e:'ℹ️',l:'info',lp:'infos'}
};
function briefingHTML(b){
  const head=`<span class="ai-badge">${svg('spark',13)} Mentor · seu dia</span>`;
  if(!b.total)return `${head}<div class="brf-empty">${svg('spark',22)}<div><b>Tudo em ordem por aqui ✨</b><span>Nenhum alerta agora.</span></div></div>`;
  const sp=b.spotlight,s=SEVD[sp.severidade];
  const spotAct=sp.acao.href
    ?`<a class="brf-btn" href="${sp.acao.href}" target="_blank" rel="noopener">${sp.acao.label}</a>`
    :`<button class="brf-btn" data-go="${sp.acao.navTo}">${sp.acao.label}</button>`;
  const spot=`<div class="brf-spot" style="--c:var(--${s.cor});--cs:var(--${s.cor}-soft)">
    <div class="brf-ico">${svg(sp.icone,18)}</div>
    <div class="brf-main"><div class="brf-t">${sp.titulo}</div><div class="brf-s">${sp.texto}</div></div>
    ${spotAct}
  </div>`;
  const chips=['critico','atencao','oportunidade','info'].filter(k=>b.contagem[k]).map(k=>{
    const sv=SEVD[k];return `<button class="brf-chip" data-go="mentor">${sv.e} ${b.contagem[k]} ${b.contagem[k]===1?sv.l:sv.lp}</button>`;
  }).join('');
  const resto=b.resto.length?`<div class="brf-resto">${b.resto.map(i=>{
    const sv=SEVD[i.severidade];
    const a=i.acao.href
      ?`<a class="brf-mini" href="${i.acao.href}" target="_blank" rel="noopener">${i.acao.label} →</a>`
      :`<button class="brf-mini" data-go="${i.acao.navTo}">${i.acao.label} →</button>`;
    return `<div class="brf-r"><span class="brf-dot" style="background:var(--${sv.cor})"></span><span class="brf-rt">${i.titulo}</span>${a}</div>`;
  }).join('')}</div>`:'';
  const foot=`<button class="brf-foot" data-go="mentor">Ver tudo no Mentor (${b.total}) →</button>`;
  return `${head}${spot}${chips?`<div class="brf-chips">${chips}</div>`:''}${resto}${foot}`;
}
function pintaBriefingDash(){
  [['pessoal','mtr-dash-pessoal'],['negocio','mtr-dash-negocio'],['hibrido','mtr-dash-hibrido']].forEach(([ctx,id])=>{
    const card=document.getElementById(id);if(!card)return;
    card.innerHTML=briefingHTML(Mentor.briefing(ctx,3));
    card.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>navigate(x.dataset.go));
  });
}

/* ═══════════════════════════════════════════════
   ETAPA 15A — COMMAND PALETTE ⌘K (Search & Act, sem IA)
═══════════════════════════════════════════════ */
(function(){
  const norm=s=>(s+'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  const esc=s=>(s+'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const wa=tel=>window.open('https://wa.me/55'+(tel||'').replace(/\D/g,''),'_blank');

  // ── índice estático ──
  const NAVICON={dashboard:'home',financas:'wallet',transacoes:'repeat',metas:'target',agenda:'calendar',saude:'heart',tarefas:'check',habitos:'flame',contatos:'users',vendas:'cart',produtos:'box',estoque:'archive',clientes:'users',relatorios:'chart',documentos:'file',mentor:'spark',perfil:'user'};
  const NAVLIST=[['dashboard','Dashboard'],...Object.entries(TITLES)];
  const ACOES=[
    {key:'new:conta',titulo:'Nova conta',tela:'financas'},
    {key:'new:tx',titulo:'Nova transação',tela:'transacoes'},
    {key:'new:venda',titulo:'Nova venda',tela:'vendas',noAdd:true},
    {key:'new:tarefa',titulo:'Nova tarefa',tela:'tarefas'},
    {key:'new:contato',titulo:'Novo contato',tela:'contatos'},
    {key:'new:evento',titulo:'Novo evento',tela:'agenda'},
  ];
  const SECLBL={calc:'🧮 Calculadora',nav:'Ir para',acao:'Ações',data:'Resultados',recent:'Recentes',sug:'Sugeridos'};

  // ── fuzzy score ──
  function score(q,t){
    q=norm(q);t=norm(t);
    if(!q)return 0;
    if(t===q)return 100;
    if(t.startsWith(q))return 80;
    const wi=t.split(/\s+/).map(w=>w[0]||'').join('');
    if(wi.startsWith(q))return 60;
    const idx=t.indexOf(q);
    if(idx>=0)return 40-idx*0.1;
    let i=0;for(const ch of t){if(ch===q[i])i++;if(i===q.length)break;}
    if(i===q.length)return 18;
    return -1;
  }

  // ── recentes (memória, máx 5) ──
  let recent=[];
  function pushRecent(t,id){recent=recent.filter(r=>!(r.t===t&&r.id===id));recent.unshift({t,id});recent=recent.slice(0,5);}

  // ── ações ──
  function go(id){return ()=>{pushRecent('nav',id);close();navigate(id);};}
  function novo(a){return ()=>{pushRecent('acao',a.key);close();navigate(a.tela);if(!a.noAdd){const b=document.querySelector('.page[data-page="'+a.tela+'"] [data-add]');if(b)b.click();}};}

  // ── builders ──
  const navLabel=id=>id==='dashboard'?'Dashboard':(TITLES[id]||id);
  const navItem=(id,label)=>({sec:'nav',icon:NAVICON[id]||'chevright',titulo:label||navLabel(id),sub:'Ir para tela',acts:[{label:'Abrir',run:go(id)}]});
  const acaoItem=a=>({sec:'acao',icon:'plus',titulo:a.titulo,sub:'Criar novo',acts:[{label:'Criar',run:novo(a)}]});
  function resolve(t,id,sec){const it=t==='nav'?navItem(id):acaoItem(ACOES.find(x=>x.key===id));return {...it,sec};}

  function dataResults(q){
    const out=[],add=it=>{if(it._s>=0)out.push(it);};
    DB.contas.forEach(c=>{const s=score(q,c.descricao);add({sec:'data',_s:s,icon:'wallet',titulo:c.descricao,
      sub:`${c.tipo==='pagar'?'conta a pagar':'conta a receber'} · ${fmt(c.valor)} · ${c.status==='paga'?'paga':venceTxt(c.venc)}`,
      acts:[{label:'Abrir',run:()=>{close();navigate('financas');}},
        ...(c.tipo==='pagar'&&c.status!=='paga'?[{label:'Marcar paga',icon:'tick',run:()=>{close();Contas.pay(c.id);}}]:[]),
        {label:'Editar',icon:'pencil',run:()=>{close();navigate('financas');Contas.form(c.id);}}]});});
    DB.transacoes.forEach(t=>{const s=score(q,t.descricao);add({sec:'data',_s:s,icon:'repeat',titulo:t.descricao,
      sub:`transação · ${fmt(t.valor)} · ${t.data.slice(8,10)}/${t.data.slice(5,7)}`,acts:[{label:'Abrir',run:()=>{close();navigate('transacoes');}}]});});
    DB.metas.forEach(m=>{const s=score(q,m.nome);add({sec:'data',_s:s,icon:'target',titulo:m.nome,
      sub:`meta · ${fmt(m.atual)} de ${fmt(m.alvo)}`,acts:[{label:'Abrir',run:()=>{close();navigate('metas');}}]});});
    DB.tarefas.forEach(t=>{const s=score(q,t.titulo);add({sec:'data',_s:s,icon:'check',titulo:t.titulo,
      sub:`tarefa · ${t.coluna==='done'?'concluída':t.coluna==='doing'?'em andamento':'a fazer'}`,acts:[{label:'Abrir',run:()=>{close();navigate('tarefas');}}]});});
    DB.eventos.forEach(e=>{const s=score(q,e.titulo);add({sec:'data',_s:s,icon:'calendar',titulo:e.titulo,
      sub:`evento · ${e.data.slice(8,10)}/${e.data.slice(5,7)}${e.hora?' '+e.hora:''}`,acts:[{label:'Abrir',run:()=>{close();navigate('agenda');}}]});});
    DB.produtos.forEach(p=>{const s=score(q,p.nome);add({sec:'data',_s:s,icon:'box',titulo:`${p.emoji||''} ${p.nome}`.trim(),
      sub:`produto · ${p.categoria} · ${p.estoque} un.${p.estoque<=p.estoqueMin?' · estoque baixo':''}`,
      acts:[{label:'Abrir',run:()=>{close();navigate('produtos');}},{label:'Ver no estoque',icon:'archive',run:()=>{close();navigate('estoque');}}]});});
    DB.contatos.forEach(c=>{const s=Math.max(score(q,c.nome),score(q,(c.tags||[]).join(' ')));
      const dev=DB.vendas.filter(v=>v.clienteId===c.id&&v.pagamento==='a_prazo'&&v.status==='pendente').reduce((a,v)=>a+(v.total-(v.recebido||0)),0);
      add({sec:'data',_s:s,icon:'users',titulo:c.nome,
      sub:`contato · ${c.contexto}${dev>0?` · deve ${fmt(dev)}`:c.telefone?' · '+c.telefone:''}`,
      acts:[{label:'Abrir',run:()=>{close();navigate(c.contexto==='negocio'?'clientes':'contatos');}},
        ...(c.telefone?[{label:'WhatsApp',icon:'chat',run:()=>{close();wa(c.telefone);}}]:[])]});});
    DB.vendas.forEach(v=>{const s=score(q,v.clienteNome||'venda');if(s<0)return;add({sec:'data',_s:s,icon:'cart',titulo:`Venda · ${v.clienteNome||'sem cliente'}`,
      sub:`${fmt(v.total)} · ${v.data.slice(8,10)}/${v.data.slice(5,7)} · ${v.status}`,acts:[{label:'Abrir',run:()=>{close();navigate('vendas');}}]});});
    DB.medicamentos.forEach(m=>{const s=score(q,m.nome);add({sec:'data',_s:s,icon:'heart',titulo:m.nome,
      sub:`medicamento · ${m.estoque} ${m.estoque<=m.estoqueMin?'(baixo)':'em estoque'}`,acts:[{label:'Abrir',run:()=>{close();navigate('saude');}}]});});
    (DB.fornecedores||[]).forEach(f=>{const s=score(q,f.nome);add({sec:'data',_s:s,icon:'box',titulo:f.nome,
      sub:'fornecedor',acts:[{label:'Abrir',run:()=>{close();navigate('clientes');}}]});});
    return out.filter(x=>x._s>=0).sort((a,b)=>b._s-a._s).slice(0,8);
  }

  // ── calculadora segura (só números/operadores) ──
  function calcItem(q){
    if(!/[+\-*/%]/.test(q)||!/^[\d\s.,+\-*/()%]+$/.test(q))return null;
    let r;try{r=Function('"use strict";return('+q.replace(/,/g,'.')+')')();}catch(_){return null;}
    if(typeof r!=='number'||!isFinite(r))return null;
    const res=Math.round(r*1e6)/1e6;
    return {sec:'calc',icon:'zap',titulo:`${q.trim()} = ${res}`,sub:'Resultado da calculadora',
      acts:[{label:'Copiar',icon:'tick',run:()=>{if(navigator.clipboard)navigator.clipboard.writeText(String(res));Toast.show('Resultado copiado');close();}}]};
  }

  function compute(q){
    q=q.trim();const out=[];
    const calc=calcItem(q);if(calc)out.push(calc);
    if(!q){
      recent.map(r=>resolve(r.t,r.id,'recent')).forEach(i=>out.push(i));
      const m=document.documentElement.getAttribute('data-mode')||'pessoal';
      const sug={negocio:[['acao','new:venda'],['nav','relatorios'],['nav','estoque']],
                 pessoal:[['acao','new:tarefa'],['acao','new:conta'],['nav','saude']],
                 hibrido:[['acao','new:venda'],['acao','new:tarefa'],['nav','mentor']]}[m];
      sug.forEach(([t,id])=>out.push(resolve(t,id,'sug')));
      return out;
    }
    NAVLIST.map(([id,l])=>({it:navItem(id,l),s:score(q,l)})).filter(x=>x.s>=0).sort((a,b)=>b.s-a.s).slice(0,8).forEach(x=>out.push(x.it));
    ACOES.map(a=>({it:acaoItem(a),s:score(q,a.titulo)})).filter(x=>x.s>=0).sort((a,b)=>b.s-a.s).slice(0,6).forEach(x=>out.push(x.it));
    dataResults(q).forEach(i=>out.push(i));
    return out;
  }

  // ── overlay ──
  const back=document.createElement('div');back.className='cmdk-back';back.id='cmdk';back.hidden=true;
  back.innerHTML=`<div class="cmdk" role="dialog" aria-label="Buscar e agir">
    <div class="cmdk-in">${svg('search',18)}<input id="cmdk-q" placeholder="Buscar telas, ações, dados…" autocomplete="off" spellcheck="false"></div>
    <div class="cmdk-list" id="cmdk-list"></div>
    <div class="cmdk-foot"><span>↑↓ navegar</span><span>↵ executar</span><span>⇥ ações</span><span>esc fechar</span></div>
  </div>`;
  document.body.appendChild(back);
  const input=back.querySelector('#cmdk-q'),listEl=back.querySelector('#cmdk-list');
  let opened=false,flat=[],sel=0,actSel=0,q='';

  function draw(){
    if(!flat.length){listEl.innerHTML=`<div class="cmdk-empty">Nada encontrado${q?` para “${esc(q.trim())}”`:''}.</div>`;return;}
    if(sel>=flat.length)sel=flat.length-1;if(sel<0)sel=0;
    let html='',lastSec=null;
    flat.forEach((it,i)=>{
      if(it.sec!==lastSec){html+=`<div class="cmdk-sec">${SECLBL[it.sec]||''}</div>`;lastSec=it.sec;}
      const on=i===sel,multi=it.acts.length>1;
      const right=on&&multi
        ?`<div class="cmdk-acts">${it.acts.map((a,ai)=>`<button class="cmdk-act${ai===actSel?' on':''}" data-i="${i}" data-a="${ai}">${a.icon?svg(a.icon,12):''}${a.label}</button>`).join('')}</div>`
        :(multi?`<span class="cmdk-hint">⇥ ações</span>`:`<span class="cmdk-go">↵</span>`);
      html+=`<div class="cmdk-item${on?' on':''}" data-i="${i}"><div class="cmdk-ic">${svg(it.icon,16)}</div><div class="cmdk-tx"><div class="cmdk-t">${esc(it.titulo)}</div>${it.sub?`<div class="cmdk-s">${esc(it.sub)}</div>`:''}</div>${right}</div>`;
    });
    listEl.innerHTML=html;
    listEl.querySelectorAll('.cmdk-item').forEach(el=>{const i=+el.dataset.i;
      el.onmousemove=()=>{if(sel!==i){sel=i;actSel=0;draw();}};
      el.onclick=ev=>{if(ev.target.closest('.cmdk-act'))return;sel=i;run();};});
    listEl.querySelectorAll('.cmdk-act').forEach(b=>b.onclick=()=>{sel=+b.dataset.i;actSel=+b.dataset.a;run();});
    const selEl=listEl.querySelector('.cmdk-item.on');if(selEl)selEl.scrollIntoView({block:'nearest'});
  }
  function run(){const it=flat[sel];if(!it)return;const a=it.acts[Math.min(actSel,it.acts.length-1)];if(a)a.run();}
  function rebuild(){q=input.value;flat=compute(q);sel=0;actSel=0;draw();}
  function open(){if(opened)return;opened=true;back.hidden=false;requestAnimationFrame(()=>back.classList.add('show'));input.value='';q='';flat=compute('');sel=0;actSel=0;draw();setTimeout(()=>input.focus(),20);}
  function close(){if(!opened)return;opened=false;back.classList.remove('show');setTimeout(()=>{back.hidden=true;},160);}

  input.addEventListener('input',rebuild);
  input.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();close();}
    else if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(flat.length-1,sel+1);actSel=0;draw();}
    else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);actSel=0;draw();}
    else if(e.key==='Enter'){e.preventDefault();run();}
    else if(e.key==='Tab'){e.preventDefault();const it=flat[sel];if(it&&it.acts.length>1)actSel=(actSel+(e.shiftKey?-1:1)+it.acts.length)%it.acts.length,draw();}
    else if(e.key==='ArrowRight'){const it=flat[sel];if(it&&it.acts.length>1){actSel=Math.min(it.acts.length-1,actSel+1);draw();}}
    else if(e.key==='ArrowLeft'){if(actSel>0){actSel--;draw();}}
  });
  back.addEventListener('mousedown',e=>{if(e.target===back)close();});
  // gatilho global ⌘K / Ctrl+K
  document.addEventListener('keydown',e=>{
    if((e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey)){
      const ae=document.activeElement,tag=(ae&&ae.tagName)||'';
      if(!opened&&/^(INPUT|TEXTAREA|SELECT)$/.test(tag)&&!back.contains(ae))return; // não sequestra digitação
      e.preventDefault();opened?close():open();
    }
  });
  const sb=document.querySelector('.search');if(sb)sb.onclick=open;
})();

Toast.init();
Contas.render();
Transacoes.render();
Metas.render();
Relatorios.render();
Categorias.render();
Tarefas.render();
Agenda.render();
Saude.render();
Habitos.render();
Metricas.render();
Contatos.render();
Produtos.render();
Estoque.render();
Vendas.render();
updateMentorBadge();
pintaBriefingDash();
/* ═══ 15B — Notificações + Quick-add + Modos refinados ═══ */
(function(){
  const SEVcol={critico:'expense',atencao:'warning',oportunidade:'income',info:'info'};
  const SEVlbl={critico:'🔴 Crítico',atencao:'🟡 Atenção',oportunidade:'🟢 Oportunidade',info:'ℹ️ Info'};

  // ── Estado de lidas (items 2) ──
  const lidas=new Set();

  // ── NOTIFICAÇÕES (items 3-4) ──
  const notifBtn=document.getElementById('notif-btn');
  const notifPanel=document.getElementById('notif-panel');
  const notifBadge=document.getElementById('notif-badge');
  let notifAberto=false;

  function syncBadge(){
    const all=Mentor.feed();
    const nlidas=all.filter(i=>!lidas.has(i.id)).length;
    notifBadge.textContent=nlidas;notifBadge.style.display=nlidas?'':'none';
    const temCrit=all.some(i=>i.severidade==='critico'&&!lidas.has(i.id));
    if(temCrit){notifBtn.classList.remove('bell-ring');void notifBtn.offsetWidth;notifBtn.classList.add('bell-ring');}
    else notifBtn.classList.remove('bell-ring');
  }
  function renderPanel(){
    const all=Mentor.feed();
    if(!all.length){notifPanel.innerHTML=`<div class="notif-head"><h4>Notificações</h4></div><div class="notif-empty">${svg('spark',22)}<br>Nenhuma notificação — tudo em ordem ✨</div>`;return;}
    const grupos={critico:[],atencao:[],oportunidade:[],info:[]};
    all.forEach(i=>grupos[i.severidade].push(i));
    let html=`<div class="notif-head"><h4>Notificações</h4><button class="notif-read-all" id="notif-rall">Marcar todas como lidas</button></div><div class="notif-body" id="notif-body">`;
    ['critico','atencao','oportunidade','info'].forEach(sev=>{
      if(!grupos[sev].length)return;
      html+=`<div class="notif-group-lbl">${SEVlbl[sev]}</div>`;
      grupos[sev].forEach(i=>{
        const read=lidas.has(i.id);const cor=SEVcol[sev];
        html+=`<div class="notif-item${read?' read':''}" data-nid="${i.id}" data-nav="${i.acao.navTo||''}" data-href="${i.acao.href||''}">
          <div class="notif-ic" style="background:var(--${cor}-soft);color:var(--${cor})">${svg(i.icone,14)}</div>
          <div class="notif-tx"><div class="nt">${i.titulo}</div><div class="ns">${i.texto}</div></div>
          ${!read?`<span class="notif-dot" style="background:var(--${cor})"></span>`:''}
        </div>`;
      });
    });
    html+='</div>';
    notifPanel.innerHTML=html;
    notifPanel.querySelectorAll('.notif-item').forEach(el=>{
      el.onclick=()=>{lidas.add(el.dataset.nid);const h=el.dataset.href,n=el.dataset.nav;if(h)window.open(h,'_blank');else if(n)navigate(n);closePanel();};});
    const ra=notifPanel.querySelector('#notif-rall');
    if(ra)ra.onclick=()=>{Mentor.feed().forEach(i=>lidas.add(i.id));closePanel();syncBadge();};
  }
  function openPanel(){notifAberto=true;renderPanel();notifPanel.classList.add('show');}
  function closePanel(){notifAberto=false;notifPanel.classList.remove('show');syncBadge();}
  notifBtn.onclick=e=>{e.stopPropagation();notifAberto?closePanel():openPanel();};
  document.addEventListener('click',e=>{if(notifAberto&&!document.getElementById('notif-wrap').contains(e.target))closePanel();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&notifAberto)closePanel();});

  // ── QUICK-ADD global (item 5) ──
  const QA_ITEMS=[
    {icon:'wallet',label:'Nova conta',tela:'financas'},
    {icon:'repeat',label:'Nova transação',tela:'transacoes'},
    {icon:'cart',label:'Nova venda',tela:'vendas',noAdd:true},
    {icon:'check',label:'Nova tarefa',tela:'tarefas'},
    {icon:'users',label:'Novo contato',tela:'contatos'},
    {icon:'calendar',label:'Novo evento',tela:'agenda'},
  ];
  const qaBtn=document.getElementById('qa-btn');
  const qaMenu=document.getElementById('qa-menu');
  let qaAberto=false;
  qaMenu.innerHTML=QA_ITEMS.map(it=>`<div class="qa-item" data-tela="${it.tela}" data-noadd="${it.noAdd||false}"><div class="qa-ic">${svg(it.icon,14)}</div><span class="qa-lbl">${it.label}</span></div>`).join('');
  function openQa(){qaAberto=true;qaMenu.classList.add('show');}
  function closeQa(){qaAberto=false;qaMenu.classList.remove('show');}
  qaBtn.onclick=e=>{e.stopPropagation();qaAberto?closeQa():openQa();};
  qaMenu.querySelectorAll('.qa-item').forEach(el=>{el.onclick=()=>{const tela=el.dataset.tela;navigate(tela);if(el.dataset.noadd!=='true')setTimeout(()=>{const b=document.querySelector('.page[data-page="'+tela+'"] [data-add]');if(b)b.click();},80);closeQa();};});
  document.addEventListener('click',e=>{if(qaAberto&&!document.getElementById('qa-wrap').contains(e.target))closeQa();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&qaAberto)closeQa();});

  // ── MODOS REFINADOS (item 6) ──
  let _modo=document.documentElement.getAttribute('data-mode')||'pessoal';
  const MODO_MAP={'1':'pessoal','2':'hibrido','3':'negocio'};
  document.addEventListener('keydown',e=>{
    if(!e.altKey||!MODO_MAP[e.key])return;
    const ae=document.activeElement,tag=(ae&&ae.tagName)||'';
    if(/^(INPUT|TEXTAREA|SELECT)$/.test(tag))return;
    e.preventDefault();
    const m=MODO_MAP[e.key];_modo=m;
    // reusar switchMode do bottom-nav IIFE (já existe como variável interna), invocar diretamente:
    document.documentElement.setAttribute('data-mode',m);
    document.querySelectorAll('.mode-switch button').forEach(x=>x.classList.toggle('on',x.dataset.mode===m));
    document.querySelectorAll('.mode-pane').forEach(p=>p.classList.toggle('show',p.dataset.pane===m));
    document.querySelectorAll('[data-ctx]').forEach(g=>g.style.display=(m==='hibrido'||g.dataset.ctx===m)?'':'none');
    if(typeof pintaBriefingDash==='function')pintaBriefingDash();
  });

  // Inicializar badge
  syncBadge();
})();
