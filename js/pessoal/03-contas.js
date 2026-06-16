const Contas=(()=>{
  // ── Estado ──────────────────────────────────────────────────────────────
  let mesAtivo=HOJE.toISOString().slice(0,7);   // YYYY-MM
  let filtroCard='pagar';                         // 'pagar'|'receber' — sempre ativo, default A Pagar
  let viewMode='mes';                            // 'mes'|'semana'
  let pagasAberta=false;
  let filtrosAberto=false;
  let filtroBusca='';
  let filtrocat='todas';

  // ── Helpers de mês ──────────────────────────────────────────────────────
  const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  function mesLabel(ym){const[y,m]=ym.split('-').map(Number);return MESES[m-1]+' '+y;}
  function navMes(delta){const[y,m]=mesAtivo.split('-').map(Number);const d=new Date(y,m-1+delta,1);mesAtivo=d.toISOString().slice(0,7);render();}

  // ── Filtros ──────────────────────────────────────────────────────────────
  function contasMes(){return DB.contas.filter(c=>c.venc.slice(0,7)===mesAtivo);}
  function filtered(){
    let base=contasMes();
    if(filtroCard==='pagar')  base=base.filter(c=>c.tipo==='pagar');
    if(filtroCard==='receber')base=base.filter(c=>c.tipo==='receber');
    if(filtroCard==='vencida')base=base.filter(c=>c.status==='pendente'&&diasAte(c.venc)<0);
    if(filtroBusca)base=base.filter(c=>c.descricao.toLowerCase().includes(filtroBusca.toLowerCase()));
    if(filtrocat!=='todas')base=base.filter(c=>c.cat===filtrocat);
    return base;
  }

  // ── Saldos ───────────────────────────────────────────────────────────────
  // calcSaldos: apenas pendentes (status!=='paga') — usado nos chips de filtro
  function calcSaldos(){
    const pendentes=contasMes().filter(c=>c.status!=='paga');
    const receber=pendentes.filter(c=>c.tipo==='receber').reduce((s,c)=>s+c.valor,0);
    const pagar=pendentes.filter(c=>c.tipo==='pagar').reduce((s,c)=>s+c.valor,0);
    const vencidas=pendentes.filter(c=>diasAte(c.venc)<0).reduce((s,c)=>s+c.valor,0);
    return{receber,pagar,vencidas,saldo:receber-pagar};
  }
  // calcTotais: TODAS as contas do mês (pagas + pendentes) — previsão fixa, NÃO muda ao pagar
  function calcTotais(){
    const todas=contasMes();
    const receber=todas.filter(c=>c.tipo==='receber').reduce((s,c)=>s+c.valor,0);
    const pagar=todas.filter(c=>c.tipo==='pagar').reduce((s,c)=>s+c.valor,0);
    return{receber,pagar,saldo:receber-pagar};
  }

  // ── Reserva por dia (T34) ────────────────────────────────────────────────
  function calcReserva(){
    const aPagar=contasMes().filter(c=>c.tipo==='pagar'&&c.status==='pendente').reduce((s,c)=>s+c.valor,0);
    if(aPagar===0)return 'Tá tranquilo, nada a reservar ✨';
    const esMesAtual=mesAtivo===HOJE.toISOString().slice(0,7);
    const[y,m]=mesAtivo.split('-').map(Number);
    const ultimoDia=new Date(y,m,0);
    if(!esMesAtual){
      const diasMes=ultimoDia.getDate();
      return `🎯 Ritmo do mês: <strong>${fmt(aPagar/diasMes)}/dia</strong>`;
    }
    const diasRestantes=Math.round((ultimoDia-HOJE)/86400000)+1;
    if(diasRestantes<=0)return `🎯 Vence hoje: <strong>${fmt(aPagar)}</strong>`;
    return `🎯 Pra fechar o mês: <strong>${fmt(aPagar/diasRestantes)}/dia</strong> · faltam ${diasRestantes} dia${diasRestantes!==1?'s':''}`;
  }

  // ── Semanas de calendário do mês (T35) ──────────────────────────────────
  function semanasMes(ym){
    const[y,m]=ym.split('-').map(Number);
    const primeiro=new Date(y,m-1,1),ultimo=new Date(y,m,0);
    const semanas=[];
    let ini=new Date(primeiro);
    const dow=ini.getDay();ini.setDate(ini.getDate()-((dow===0?7:dow)-1));
    for(let n=1;;n++){
      const fim=new Date(ini);fim.setDate(fim.getDate()+6);
      const segmIni=ini<primeiro?new Date(primeiro):new Date(ini);
      const segmFim=fim>ultimo?new Date(ultimo):new Date(fim);
      if(segmIni>ultimo)break;
      semanas.push({n,ini:new Date(ini),fim:new Date(fim),segmIni,segmFim});
      ini.setDate(ini.getDate()+7);
      if(ini>ultimo)break;
    }
    return semanas;
  }

  // ── Selo de vencimento/pagamento por tipo e urgência ────────────────────
  function seloTxt(c){
    const fmtD=iso=>{const d=new Date(iso+'T00:00:00');return d.getDate()+'/'+(d.getMonth()+1);};
    if(c.status==='paga'){
      if(c.tipo==='receber')return c.pagoEm?`Recebido em ${fmtD(c.pagoEm)}`:'Recebida';
      return c.pagoEm?`Pago em ${fmtD(c.pagoEm)}`:'Paga';
    }
    const d=diasAte(c.venc);
    if(c.tipo==='receber'){
      if(d===0)return 'a receber hoje';
      if(d>0)return `recebe em ${d}d · ${fmtD(c.venc)}`;
      return `esperado há ${Math.abs(d)}d`;
    }
    if(d===0)return 'Vence hoje';
    if(d>0)return `Vence em ${d}d · ${fmtD(c.venc)}`;
    return `Venceu há ${Math.abs(d)}d`;
  }

  // ── Linha de conta ───────────────────────────────────────────────────────
  function rowHTML(c){
    const cat=CATS.find(x=>x.id===c.cat)||{nome:'—',cor:'#8A867C',icone:'box'};
    const isPagar=c.tipo==='pagar';
    const corSoft=isPagar?'var(--expense-soft)':'var(--income-soft)';
    const corIcon=isPagar?'var(--expense)':'var(--income)';
    const sinal=isPagar?'−':'+';
    // Cor semântica do valor (T46): tokens, duplo canal (cor+ícone)
    let corValor,valStyle='';
    if(c.status==='paga'){corValor='var(--text-3)';valStyle='opacity:.6';}
    else if(!isPagar){corValor='var(--income)';}
    else{const d=diasAte(c.venc);if(d<0)corValor='var(--expense)';else if(d===0)corValor='var(--warning)';else{corValor='var(--warning)';valStyle='opacity:.75';}}
    // Selos ♻️ recorrente e parcela
    const seloRec=c.recorrente&&c.recorrenteAtivo?`<span class="fin-selo-rec">↺</span>`:'';
    const seloParc=c.parcela?`<span class="fin-selo-parc">${c.parcela}</span>`:'';
    return `<div class="lrow${c.status==='paga'?' paga':''}" role="listitem" tabindex="0" data-qid="${c.id}" style="cursor:pointer">
      <div class="li" style="background:${corSoft};color:${corIcon}" aria-hidden="true">${svg(isPagar?'arrowup':'arrowdown',18)}</div>
      <div class="lmain" style="pointer-events:none">
        <div class="lt">${c.descricao}${seloRec}${seloParc}</div>
        <div class="ls"><span class="tagcat" style="background:${cat.cor}20;color:${cat.cor}">${cat.nome}</span><span>·</span><span>${seloTxt(c)}</span></div>
      </div>
      <div class="fin-card-right" style="pointer-events:none">
        <div class="fin-lapis" aria-hidden="true">${svg('pencil',12)}</div>
        <div style="font-family:var(--mono);font-size:13.5px;font-weight:700;color:${corValor};${valStyle};font-variant-numeric:tabular-nums">${sinal}${fmt(c.valor)}</div>
      </div>
    </div>`;
  }

  // ── Helpers de grupo ─────────────────────────────────────────────────────
  function grupoHdr(dot,nome,itens){
    const sub=itens.reduce((s,c)=>s+c.valor,0);
    return `<div class="fin-grupo-hdr">
      <span class="fin-grupo-dot" style="background:${dot}"></span>
      <span class="fin-grupo-nome">${nome}</span>
      <span class="fin-grupo-chip">${itens.length}</span>
      <span class="fin-grupo-sub">${fmt(sub)}</span>
    </div>`;
  }
  function acordeaoHdr(id,nome,itens){
    const sub=itens.reduce((s,c)=>s+c.valor,0);
    const n=itens.length;
    return `<button type="button" class="fin-grupo-toggle fin-pagas-hdr" aria-expanded="${pagasAberta}" aria-controls="${id}" data-pagas>
      <span class="fin-pagas-ico">✅</span>
      <span class="fin-pagas-nome">${nome}</span>
      <span class="fin-pagas-count">${n} conta${n!==1?'s':''}</span>
      <span class="fin-pagas-total">${fmt(sub)}</span>
      <svg class="fin-seta" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div id="${id}" class="fin-pagas-body${pagasAberta?' aberta':''}">${itens.map(rowHTML).join('')}</div>`;
  }

  // ── Modo Mês: grupos Vencidas / Hoje / A vencer / Pagas (T44) ───────────
  function buildListaMes(){
    const contas=filtered();
    const pendentes=contas.filter(c=>c.status!=='paga');
    const pagas=contas.filter(c=>c.status==='paga');
    const vencidas=pendentes.filter(c=>diasAte(c.venc)<0).sort((a,b)=>a.venc<b.venc?-1:1);
    const hoje=pendentes.filter(c=>diasAte(c.venc)===0);
    const avencer=pendentes.filter(c=>diasAte(c.venc)>0).sort((a,b)=>a.venc<b.venc?-1:1);
    let html='',algum=false;
    if(vencidas.length){algum=true;html+=grupoHdr('var(--expense)','🔴 Vencidas',vencidas)+vencidas.map(rowHTML).join('');}
    if(hoje.length){algum=true;html+=grupoHdr('var(--warning)','🟡 Vence hoje',hoje)+hoje.map(rowHTML).join('');}
    if(avencer.length){algum=true;html+=grupoHdr('var(--border-strong)','🟠 A vencer',avencer)+avencer.map(rowHTML).join('');}
    if(pagas.length){algum=true;html+=acordeaoHdr('fin-pagas-body',filtroCard==='receber'?'Contas Recebidas':'Contas Pagas',pagas);}
    if(!algum){
      const msg=filtroCard==='receber'?'Nada a receber em aberto':'Nada a pagar em aberto';
      html=`<div class="fin-empty">${msg}</div>`;
    }
    return html;
  }

  // ── Modo Semana: 1 bloco por semana seg→dom (T45/T63 carry-over) ───────────
  function buildListaSemana(){
    const contas=filtered();
    const hojeIso=HOJE.toISOString().slice(0,10);
    const hojeYM_=HOJE.toISOString().slice(0,7);
    const esMesCorrente=mesAtivo===hojeYM_;
    const semanas=semanasMes(mesAtivo);
    const MESES_C=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const TITULO={
      meta:'Meta da semana',acumulo:'Semana com acúmulo',vencidas:'Em aberto',
      fechada:'Semana fechada ✅',suave:'Semana tranquila 🍃',previa:'Próximas contas',
      'rec-previsto':'A receber','rec-recebido':'Tudo recebido ✅',
      'rec-atraso':'A receber — em aberto','rec-suave':'Semana tranquila 🍃'
    };

    // Carry-over: vencidas pendentes a pagar de semanas PASSADAS (apenas no mês corrente)
    let atrasado=0,atrasadoN=0;
    if(esMesCorrente&&filtroCard==='pagar'){
      const pagarPend=contasMes().filter(c=>c.tipo==='pagar'&&c.status!=='paga');
      semanas.forEach(s=>{
        if(s.fim.toISOString().slice(0,10)<hojeIso){
          const si2=s.segmIni.toISOString().slice(0,10);
          const sf2=s.segmFim.toISOString().slice(0,10);
          const v=pagarPend.filter(c=>c.venc>=si2&&c.venc<=sf2);
          atrasado+=v.reduce((t,c)=>t+c.valor,0);
          atrasadoN+=v.length;
        }
      });
    }

    let html='';
    semanas.forEach(sem=>{
      const si=sem.segmIni.toISOString().slice(0,10);
      const sf=sem.segmFim.toISOString().slice(0,10);
      const domIso=sem.fim.toISOString().slice(0,10);
      const itens=contas.filter(c=>c.venc>=si&&c.venc<=sf).sort((a,b)=>a.venc<b.venc?-1:1);
      const estaSemanaBool=hojeIso>=si&&hojeIso<=domIso;
      const isPast=esMesCorrente?domIso<hojeIso:(mesAtivo<hojeYM_);
      const pendSem=itens.filter(c=>c.status!=='paga');
      const apagar=pendSem.filter(c=>c.tipo==='pagar').reduce((t,c)=>t+c.valor,0);
      const areceber=pendSem.filter(c=>c.tipo==='receber').reduce((t,c)=>t+c.valor,0);
      const diasRestSem=Math.max(0,Math.round((sem.fim-HOJE)/86400000));
      const mes=MESES_C[sem.segmIni.getMonth()];
      const hdr=`Semana ${sem.n} · ${sem.segmIni.getDate()}–${sem.segmFim.getDate()} ${mes}`;

      // ── Determinar estado do bloco ──
      let estado;
      if(filtroCard==='pagar'){
        const temPagarItems=itens.filter(c=>c.tipo==='pagar').length>0;
        if(estaSemanaBool){
          if(apagar<=0&&atrasado<=0)estado=temPagarItems?'fechada':'suave';
          else estado=atrasado>0?'acumulo':'meta';
        } else if(isPast){
          const temPagarItems2=itens.filter(c=>c.tipo==='pagar').length>0;
          estado=apagar>0?'vencidas':temPagarItems2?'fechada':'suave';
        } else {
          estado=apagar>0?'previa':'suave';
        }
      } else {
        const temRecItems=itens.filter(c=>c.tipo==='receber').length>0;
        if(isPast){
          estado=areceber>0?'rec-atraso':temRecItems?'rec-recebido':'rec-suave';
        } else {
          estado=areceber>0?'rec-previsto':temRecItems?'rec-recebido':'rec-suave';
        }
      }

      // ── Montar card Mentor por estado ──
      let mentorSemHTML='';
      if(typeof Mentor!=='undefined'&&typeof Mentor.fraseSemana==='function'){
        const pendN=pendSem.filter(c=>c.tipo===filtroCard).length;
        const nVenc=estado==='vencidas'?pendN:atrasadoN;
        const totalAtual=filtroCard==='pagar'?apagar+(estaSemanaBool?atrasado:0):areceber;
        const diasMeta=Math.max(1,diasRestSem);
        const metaDia=totalAtual>0?Math.ceil(totalAtual/diasMeta):0;
        const metaTeto=diasRestSem===0&&totalAtual>0;
        const frase=Mentor.fraseSemana({estado,programado:filtroCard==='pagar'?apagar:areceber,atrasado,atrasadoN:nVenc,total:totalAtual,dias:diasRestSem,meta:metaDia,tipo:filtroCard});

        // Cores e estilo por estado
        const COR={
          meta:'var(--brand)',acumulo:'var(--warning)',vencidas:'var(--warning)',
          fechada:'var(--income)',suave:'var(--income)',previa:'var(--brand)',
          'rec-previsto':'var(--income)','rec-recebido':'var(--income)',
          'rec-atraso':'var(--warning)','rec-suave':'var(--brand)'
        };
        const COR_S={
          meta:'var(--brand-soft)',acumulo:'var(--warning-soft)',vencidas:'var(--warning-soft)',
          fechada:'var(--income-soft)',suave:'var(--income-soft)',previa:'var(--brand-soft)',
          'rec-previsto':'var(--income-soft)','rec-recebido':'var(--income-soft)',
          'rec-atraso':'var(--warning-soft)','rec-suave':'var(--brand-soft)'
        };
        const RICO=new Set(['meta','acumulo','vencidas']);
        const c=COR[estado]||'var(--brand)';
        const cs=COR_S[estado]||'var(--brand-soft)';
        const titulo=TITULO[estado]||'Mentor';
        const _ico=`<div class="mtr-ico">${svg('spark',14)}</div>`;
        const _tag=`<span class="mtr-spot-tag">Mentor</span>`;

        if(RICO.has(estado)){
          let heroHTML='';
          if((estado==='meta'||estado==='acumulo')&&!metaTeto){
            heroHTML=`<div class="mtr-side fin-mentor-hero-side"><span class="fin-mentor-hero-val">${fmt(metaDia)}</span><span class="fin-mentor-hero-leg">por dia</span>`;
            if(estado==='acumulo'&&atrasado>0)heroHTML+=`<span class="fin-sem-atraso-badge">+${fmt(atrasado)} em atraso</span>`;
            heroHTML+='</div>';
          } else if(metaTeto){
            heroHTML=`<div class="mtr-side fin-sem-teto">foco no que der hoje</div>`;
          }
          mentorSemHTML=`<div class="fin-mentor-sem mtr-card fin-sem-${estado}" style="--c:${c};--cs:${cs}">${_tag}${_ico}<div class="mtr-main"><div class="mtr-t">${titulo}</div><div class="mtr-s">${frase||''}</div></div>${heroHTML}</div>`;
        } else {
          mentorSemHTML=`<div class="fin-mentor-sem mtr-card fin-sem-${estado} fin-sem-compacto" style="--c:${c};--cs:${cs}">${_ico}<div class="mtr-main"><div class="mtr-s">${frase||''}</div></div></div>`;
        }
      }

      html+=`<div class="fin-sem-bloco${estaSemanaBool?' esta-semana':''}">
        <div class="fin-sem-hdr">
          <span class="fin-sem-nome">${hdr}${estaSemanaBool?` <span class="fin-semana-badge">Esta Semana</span>`:''}</span>
          <span class="fin-sem-meta">${pendSem.length} conta${pendSem.length!==1?'s':''} · ${filtroCard==='receber'?`receber ${fmt(areceber)}`:`pagar ${fmt(apagar)}`}</span>
        </div>
        ${itens.length?itens.map(rowHTML).join(''):`<div class="fin-sem-vazio">Nenhuma conta nesta semana 🍃</div>`}
        ${mentorSemHTML}
      </div>`;
    });
    if(!html)html=`<div class="fin-empty">Tá tudo em dia ✨</div>`;
    return html;
  }

  // ── Despacha para o modo ativo (T43) ─────────────────────────────────────
  function buildLista(){return viewMode==='semana'?buildListaSemana():buildListaMes();}

  // ── Render lista com micro-fade ──────────────────────────────────────────
  function renderLista(){
    const grupos=document.getElementById('fin-grupos');
    if(!grupos)return;
    grupos.classList.add('fade');
    setTimeout(()=>{grupos.innerHTML=buildLista();bindLista(grupos);grupos.classList.remove('fade');},150);
  }

  // ── Bind lista ───────────────────────────────────────────────────────────
  function bindLista(scope){
    const toggle=scope.querySelector('[data-pagas]');
    if(toggle)toggle.onclick=()=>{
      pagasAberta=!pagasAberta;
      toggle.setAttribute('aria-expanded',String(pagasAberta));
      const body=document.getElementById('fin-pagas-body');
      if(body)body.classList.toggle('aberta',pagasAberta);
    };
    scope.querySelectorAll('.lrow[data-qid]').forEach(row=>{
      const open=()=>openQuick(+row.dataset.qid);
      row.addEventListener('click',open);
      row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    });
  }

  // ── Ação rápida (T37) ────────────────────────────────────────────────────
  function openQuick(id){
    const c=DB.contas.find(x=>x.id===id);if(!c)return;
    const menu=document.getElementById('fin-quick-menu');
    const over=document.getElementById('fin-quick-overlay');
    if(!menu||!over)return;
    menu.querySelector('.qm-label').textContent=c.descricao;
    const acts=menu.querySelector('.qm-actions');
    acts.innerHTML=
      (c.status!=='paga'?`<button class="qm-btn success" data-qpay>${svg('tick',16)} Marcar como ${c.tipo==='receber'?'recebido':'pago'}</button>`:'')+
      `<button class="qm-btn" data-qedit>${svg('pencil',16)} Editar</button>`+
      `<button class="qm-btn danger" data-qdel>${svg('trash',16)} Excluir</button>`;
    acts.querySelector('[data-qpay]')?.addEventListener('click',()=>{closeQuick();pay(id);});
    acts.querySelector('[data-qedit]')?.addEventListener('click',()=>{closeQuick();form(id);});
    acts.querySelector('[data-qdel]')?.addEventListener('click',()=>{closeQuick();del(id);});
    menu.classList.add('aberto');over.classList.add('aberto');
  }
  function closeQuick(){
    document.getElementById('fin-quick-menu')?.classList.remove('aberto');
    document.getElementById('fin-quick-overlay')?.classList.remove('aberto');
  }

  // ── Render principal ─────────────────────────────────────────────────────
  function render(){
    const root=document.getElementById('contas-root');if(!root)return;

    const{receber:pendR,pagar:pendP,vencidas}=calcSaldos();
    const{receber:totR,pagar:totP,saldo:totS}=calcTotais();
    const nContas=contasMes().length;
    // Dados de progresso por tipo (T57 → T58 usa para barra visual)
    const _todas=contasMes();
    const pagasNPagar=_todas.filter(c=>c.tipo==='pagar'&&c.status==='paga').length;
    const totalNPagar=_todas.filter(c=>c.tipo==='pagar').length;
    const pagasNReceber=_todas.filter(c=>c.tipo==='receber'&&c.status==='paga').length;
    const totalNReceber=_todas.filter(c=>c.tipo==='receber').length;
    const hojeYM=HOJE.toISOString().slice(0,7);
    // Mentor rodapé — anatomia .mtr-card (T47 · R4 T55)
    let mentorRodHTML='';
    if(viewMode==='mes'&&typeof Mentor!=='undefined'&&typeof Mentor.fraseMeta==='function'){
      const _ico=`<div class="mtr-ico">${svg('spark',18)}</div>`;
      const _tag=`<span class="mtr-spot-tag">Mentor</span>`;
      if(mesAtivo>hojeYM){
        mentorRodHTML=`<div class="fin-mentor-rod mtr-card fin-mentor-futuro" style="--c:var(--brand);--cs:var(--brand-soft)" aria-label="Mentor futuro">${_tag}${_ico}<div class="mtr-main"><div class="mtr-t">Mês futuro</div><div class="mtr-s">Os dados aparecem quando chegar.</div></div></div>`;
      } else if(mesAtivo<hojeYM){
        const pPassado=contasMes().filter(c=>c.tipo==='pagar'&&c.status==='paga').reduce((s,c)=>s+c.valor,0);
        mentorRodHTML=`<div class="fin-mentor-rod mtr-card fin-mentor-passado" style="--c:var(--brand);--cs:var(--brand-soft)" aria-label="Mentor passado">${_tag}${_ico}<div class="mtr-main"><div class="mtr-t">Mês fechado</div><div class="mtr-s">Você pagou ${fmt(pPassado)} neste período.</div></div></div>`;
      } else if(pendP<=0){
        mentorRodHTML=`<div class="fin-mentor-rod mtr-card fin-mentor-ok" style="--c:var(--income);--cs:var(--income-soft)" aria-label="Mentor ok">${_tag}${_ico}<div class="mtr-main"><div class="mtr-t">Mês fechado 👏</div><div class="mtr-s">Nada mais a pagar este mês!</div></div></div>`;
      } else {
        const ultDia=new Date(+mesAtivo.slice(0,4),+mesAtivo.slice(5,7),0);
        const diasRest=Math.max(1,Math.ceil((ultDia-HOJE)/86400000)+1);
        const metaDia=Math.ceil(pendP/diasRest);
        const fraseRod=Mentor.fraseMeta({devo:pendP,dias:diasRest});
        mentorRodHTML=`<div class="fin-mentor-rod mtr-card" style="--c:var(--brand);--cs:var(--brand-soft)" aria-label="Mentor meta diária">${_tag}${_ico}<div class="mtr-main"><div class="mtr-t">Meta diária</div><div class="mtr-s">${fraseRod||''}</div></div><div class="mtr-side fin-mentor-hero-side"><span class="fin-mentor-hero-val">${fmt(metaDia)}</span><span class="fin-mentor-hero-leg">por dia</span></div></div>`;
      }
    }
    const catsOpts=CATS.map(c=>`<option value="${c.id}"${filtrocat===c.id?' selected':''}>${c.nome}</option>`).join('');
    const filtroAtivo=filtroBusca||(filtrocat!=='todas');

    root.innerHTML=`
      <div class="fin-resumo" aria-label="Resumo financeiro">
        <div class="fin-nav-mes">
          <button type="button" data-mes="-1" aria-label="Mês anterior">‹</button>
          <b>${mesLabel(mesAtivo)}</b>
          <button type="button" data-mes="1" aria-label="Próximo mês">›</button>
          ${mesAtivo!==hojeYM?`<button type="button" class="fin-hoje-btn" data-hoje title="Voltar ao mês atual">↩ hoje</button>`:''}
        </div>
        <div class="fin-totais">
          <div class="fin-total-col">
            <div class="fin-total-label">Total a Receber</div>
            <div class="fin-total-val" style="color:var(--income)">${fmt(totR)}</div>
          </div>
          <div class="fin-total-div"></div>
          <div class="fin-total-col" style="text-align:right">
            <div class="fin-total-label">Total a Pagar</div>
            <div class="fin-total-val" style="color:var(--expense)">${fmt(totP)}</div>
          </div>
        </div>
        <div class="fin-saldo-hero">
          <div class="fin-saldo-label">Saldo previsto</div>
          <div class="fin-saldo-val ${totS>=0?'positivo':'negativo'}">${totS<0?'−':''}${fmt(Math.abs(totS))}</div>
        </div>
        <div class="fin-chips" role="group" aria-label="Filtrar contas">
          <button type="button" class="fin-chip${filtroCard==='receber'?' ativo':''}" data-filtro="receber" aria-pressed="${filtroCard==='receber'}" data-pagas="${pagasNReceber}" data-total="${totalNReceber}"><span class="fin-chip-label">A Receber</span><span class="fin-chip-val">${fmt(pendR)}</span><div class="fin-chip-prog-wrap"><div class="fin-chip-prog" role="progressbar" aria-valuenow="${pagasNReceber}" aria-valuemax="${totalNReceber||1}" aria-label="${pagasNReceber} de ${totalNReceber} recebidas"><div class="fin-chip-bar" style="width:${totalNReceber>0?Math.round(pagasNReceber/totalNReceber*100):0}%"></div></div><span class="fin-chip-frac">${pagasNReceber}/${totalNReceber}</span></div></button>
          <button type="button" class="fin-chip${filtroCard==='pagar'?' ativo':''}" data-filtro="pagar" aria-pressed="${filtroCard==='pagar'}" data-pagas="${pagasNPagar}" data-total="${totalNPagar}"><span class="fin-chip-label">A Pagar</span><span class="fin-chip-val">${fmt(pendP)}</span><div class="fin-chip-prog-wrap"><div class="fin-chip-prog" role="progressbar" aria-valuenow="${pagasNPagar}" aria-valuemax="${totalNPagar||1}" aria-label="${pagasNPagar} de ${totalNPagar} pagas"><div class="fin-chip-bar" style="width:${totalNPagar>0?Math.round(pagasNPagar/totalNPagar*100):0}%"></div></div><span class="fin-chip-frac">${pagasNPagar}/${totalNPagar}</span></div></button>
        </div>
        <div class="fin-view-toggle" role="tablist" aria-label="Modo de visualização">
          <button type="button" class="fin-vtab${viewMode==='mes'?' on':''}" data-view="mes" role="tab" aria-selected="${viewMode==='mes'}">Mês</button>
          <button type="button" class="fin-vtab${viewMode==='semana'?' on':''}" data-view="semana" role="tab" aria-selected="${viewMode==='semana'}">Semana</button>
        </div>
      </div>
      <div class="fin-filtros-bar">
        <button type="button" class="fin-filtros-btn${filtroAtivo?' ativo':''}" data-filtros-toggle aria-expanded="${filtrosAberto}" aria-controls="fin-filtros-panel">
          ${svg('search',13)} Filtros${filtroAtivo?' ●':''}
        </button>
        <button class="btn btn-primary" data-add>${svg('plus',16)} Nova conta</button>
      </div>
      <div id="fin-filtros-panel" class="fin-filtros-panel${filtrosAberto?' aberto':''}">
        <div class="filtros-row">
          <input class="field" type="text" placeholder="Buscar por descrição…" data-fbusca value="${filtroBusca.replace(/"/g,'&quot;')}">
          <select class="field" data-fcat><option value="todas"${filtrocat==='todas'?' selected':''}>Todas as categorias</option>${catsOpts}</select>
        </div>
      </div>
      <div id="fin-grupos" class="fin-grupos" role="list" aria-live="polite" aria-label="Lista de contas"></div>
      ${mentorRodHTML}
      <div id="fin-quick-overlay" class="fin-quick-overlay" data-close-quick></div>
      <div id="fin-quick-menu" class="fin-quick-menu" role="dialog" aria-modal="true" aria-label="Ações rápidas">
        <div class="qm-label"></div>
        <div class="qm-actions"></div>
        <button class="btn" style="width:100%;margin-top:var(--s-3)" data-close-quick>Cancelar</button>
      </div>`;

    // Binds
    root.querySelectorAll('[data-mes]').forEach(b=>b.onclick=()=>navMes(+b.dataset.mes));
    root.querySelector('[data-hoje]')?.addEventListener('click',()=>{mesAtivo=HOJE.toISOString().slice(0,7);render();});
    root.querySelectorAll('.fin-chip').forEach(btn=>btn.onclick=()=>{
      filtroCard=btn.dataset.filtro;render();
    });
    root.querySelectorAll('.fin-vtab').forEach(btn=>btn.onclick=()=>{
      viewMode=btn.dataset.view;render();
    });
    root.querySelector('[data-filtros-toggle]').onclick=()=>{
      filtrosAberto=!filtrosAberto;
      document.getElementById('fin-filtros-panel')?.classList.toggle('aberto',filtrosAberto);
      root.querySelector('[data-filtros-toggle]')?.classList.toggle('ativo',filtrosAberto);
      root.querySelector('[data-filtros-toggle]')?.setAttribute('aria-expanded',String(filtrosAberto));
    };
    root.querySelector('[data-fbusca]').oninput=e=>{filtroBusca=e.target.value;renderLista();};
    root.querySelector('[data-fcat]').onchange=e=>{filtrocat=e.target.value;renderLista();};
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-close-quick]').forEach(el=>el.onclick=closeQuick);
    renderLista();
  }

  // ── CRUD (preservados intactos) ──────────────────────────────────────────
  function pay(id){
    const c=DB.contas.find(x=>x.id===id);if(!c)return;
    c.status='paga';c.pagoEm=offset(0);
    DB.transacoes.unshift({id:nid(),tipo:c.tipo==='pagar'?'saida':'entrada',descricao:c.descricao,valor:c.valor,cat:c.cat,metodo:c.metodo,data:offset(0)});
    // Recorrência rolável: gera a próxima ao pagar (valor herdado = valor vigente)
    if(c.recorrente&&c.recorrenteAtivo)
      DB.contas.push({id:nid(),tipo:c.tipo,descricao:c.descricao,valor:c.valor,cat:c.cat,metodo:c.metodo,venc:addMonths(c.venc,1),status:'pendente',recorrente:true,recorrenteAtivo:true,serieId:c.serieId});
    Toast.show('Conta paga · transação registrada');render();
  }
  function del(id){const c=DB.contas.find(x=>x.id===id);if(!c)return;Modal.confirm('Excluir conta?',`"${c.descricao}" será removida permanentemente.`,()=>{DB.contas=DB.contas.filter(x=>x.id!==id);Toast.show('Conta excluída');render();});}
  function form(id){
    const c=id?DB.contas.find(x=>x.id===id):null;
    const segHandler=`this.closest('.fin-seg-tipo').querySelectorAll('.fin-seg-t').forEach(b=>{b.classList.toggle('on',b===this)});document.getElementById('fin-parc-row').style.display=this.dataset.seg==='parcelado'?'':'none'`;
    const body=`
      <div class="seg-in">
        <label class="segopt"><input type="radio" name="ctipo" value="pagar"${!c||c.tipo==='pagar'?' checked':''}><span>A pagar</span></label>
        <label class="segopt"><input type="radio" name="ctipo" value="receber"${c&&c.tipo==='receber'?' checked':''}><span>A receber</span></label>
      </div>
      <div class="fg"><label>Descrição</label><input class="field" id="f-desc" value="${c?c.descricao.replace(/"/g,'&quot;'):''}" placeholder="Ex: Aluguel"></div>
      <div class="fg"><label>Observação <span style="font-size:11px;color:var(--text-3)">(opcional)</span></label>
        <textarea class="field" id="f-obs" rows="2" placeholder="Lembrete, nota…" style="resize:vertical;min-height:40px">${c?.obs||''}</textarea>
      </div>
      <div class="frow">
        <div class="fg"><label>Valor (R$)</label><input class="field" id="f-valor" type="number" step="0.01" min="0" value="${c?c.valor:''}" placeholder="0,00"></div>
        <div class="fg"><label>Vencimento</label><input class="field" id="f-venc" type="date" value="${c?c.venc:offset(0)}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Categoria</label><select class="field" id="f-cat">${CATS.map(x=>`<option value="${x.id}"${c&&c.cat===x.id?' selected':''}>${x.nome}</option>`).join('')}</select></div>
        <div class="fg"><label>Método</label><select class="field" id="f-met">${['Pix','Dinheiro','Débito','Crédito','Transferência'].map(m=>`<option${c&&c.metodo===m?' selected':''}>${m}</option>`).join('')}</select></div>
      </div>
      ${id
        ?(c?.recorrente&&c?.recorrenteAtivo?`<label class="fin-modal-rec-toggle"><input type="checkbox" id="f-desativar-rec"> <span>Desativar recorrência <span style="font-size:11px;color:var(--text-3)">(para de gerar a próxima)</span></span></label>`:'')
        :`<div class="fg" style="margin-top:var(--s-1)"><label style="margin-bottom:var(--s-2);display:block">Tipo de lançamento</label>
        <div class="fin-seg-tipo" role="group" aria-label="Tipo de lançamento">
          <button type="button" class="fin-seg-t on" data-seg="avulso" onclick="${segHandler}">Avulso</button>
          <button type="button" class="fin-seg-t" data-seg="recorrente" onclick="${segHandler}">Recorrente</button>
          <button type="button" class="fin-seg-t" data-seg="parcelado" onclick="${segHandler}">Parcelado</button>
        </div></div>
        <div id="fin-parc-row" class="frow" style="display:none">
          <div class="fg"><label>Parcelas</label><input class="field" id="f-parc" type="number" min="2" max="18" value="2" oninput="const v=parseFloat(document.getElementById('f-valor').value)||0;const n=Math.min(18,Math.max(2,+this.value||2));const p=document.getElementById('f-parc-prev');if(p)p.textContent=v>0?n+'× de '+fmt(v):''"></div>
          <div class="fg" style="display:flex;align-items:flex-end;padding-bottom:6px"><span id="f-parc-prev" style="font-size:12.5px;color:var(--brand-text)"></span></div>
        </div>`
      }`;
    Modal.open(id?'Editar conta':'Nova conta',body,(back)=>{
      const desc=back.querySelector('#f-desc').value.trim();
      const valor=parseFloat(back.querySelector('#f-valor').value);
      const venc=back.querySelector('#f-venc').value;
      const cat=back.querySelector('#f-cat').value;
      const met=back.querySelector('#f-met').value;
      const tipo=back.querySelector('input[name=ctipo]:checked').value;
      const obs=back.querySelector('#f-obs')?.value.trim()||'';
      if(!desc||!(valor>0)||!venc){Toast.show('Preencha descrição, valor e vencimento','err');return false;}
      if(c){
        Object.assign(c,{descricao:desc,valor,venc,cat,metodo:met,tipo});
        if(obs)c.obs=obs; else delete c.obs;
        if(back.querySelector('#f-desativar-rec')?.checked)c.recorrenteAtivo=false;
        Toast.show('Conta atualizada');
      }else{
        const segTipo=back.querySelector('.fin-seg-t.on')?.dataset.seg||'avulso';
        if(segTipo==='recorrente'){
          const sid=nid();
          DB.contas.push({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,venc,status:'pendente',recorrente:true,recorrenteAtivo:true,serieId:sid,...(obs&&{obs})});
          Toast.show('Conta recorrente criada');
        }else if(segTipo==='parcelado'){
          const parc=Math.min(18,Math.max(2,parseInt(back.querySelector('#f-parc')?.value)||2));
          const sid=nid();
          for(let i=0;i<parc;i++)DB.contas.push({id:nid(),tipo,descricao:`${desc} (${i+1}/${parc})`,valor,cat,metodo:met,venc:addMonths(venc,i),status:'pendente',parcela:`${i+1}/${parc}`,serieId:sid,...(i===0&&obs&&{obs})});
          Toast.show(`${parc} parcelas criadas`);
        }else{
          DB.contas.push({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,venc,status:'pendente',...(obs&&{obs})});
          Toast.show('Conta criada');
        }
      }
      render();
    },id?'Salvar':'Adicionar');
  }
  return{render,form,pay};
})();

const Transacoes=(()=>{
  function mStart(){const d=new Date(HOJE);d.setDate(1);return d.toISOString().slice(0,10);}
  function mEnd(){const d=new Date(HOJE);d.setMonth(d.getMonth()+1,0);return d.toISOString().slice(0,10);}
  let f={tipo:'todas',cat:'todas',di:mStart(),df:mEnd(),q:''};
  const setF=(k,v)=>{f[k]=v;render();};
  function diaLabel(iso){const n=diasAte(iso);if(n===0)return 'Hoje';if(n===-1)return 'Ontem';const d=new Date(iso+'T00:00:00');const ds=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];const ms=['jan','fev','mar','abr','maio','jun','jul','ago','set','out','nov','dez'];return `${ds[d.getDay()]}, ${d.getDate()} de ${ms[d.getMonth()]}`;}
  function filtered(){
    return DB.transacoes.filter(t=>{
      if(f.tipo!=='todas'&&t.tipo!==f.tipo)return false;
      if(f.cat!=='todas'&&t.cat!==f.cat)return false;
      if(f.di&&t.data<f.di)return false;
      if(f.df&&t.data>f.df)return false;
      if(f.q&&!t.descricao.toLowerCase().includes(f.q.toLowerCase()))return false;
      return true;
    }).sort((a,b)=>a.data<b.data?1:a.data>b.data?-1:0);
  }
  function rowHTML(t){
    const cat=CATS.find(x=>x.id===t.cat)||{nome:'—',cor:'#8A867C',icone:'box'};
    return `<div class="lrow">
      <div class="li" style="background:${t.tipo==='entrada'?'var(--income-soft)':'var(--expense-soft)'};color:${t.tipo==='entrada'?'var(--income)':'var(--expense)'}">${svg(t.tipo==='entrada'?'arrowdown':'arrowup',18)}</div>
      <div class="lmain"><div class="lt">${t.descricao}</div><div class="ls"><span class="tagcat" style="background:${cat.cor}20;color:${cat.cor}">${cat.nome}</span><span>·</span><span>${t.metodo}</span></div></div>
      <div class="lval ${t.tipo==='entrada'?'in':'out'}">${t.tipo==='entrada'?'+':'−'}${fmt(t.valor)}</div>
      <div class="lacts"><button title="Editar" data-edit="${t.id}">${svg('pencil',15)}</button><button class="del" title="Excluir" data-del="${t.id}">${svg('trash',15)}</button></div>
    </div>`;
  }
  const emptyHTML=()=>`<div class="empty"><div class="eico">${svg('repeat',24)}</div><h4>Nenhuma transação no período</h4><p>Ajuste os filtros ou registre uma entrada/saída.</p></div>`;
  function listHTML(){
    const it=filtered();if(!it.length)return emptyHTML();
    const g={};it.forEach(t=>{(g[t.data]=g[t.data]||[]).push(t);});
    return Object.keys(g).sort((a,b)=>a<b?1:-1).map(d=>`<div class="daygroup">${diaLabel(d)}</div>${g[d].map(rowHTML).join('')}`).join('');
  }
  function bindRows(s){
    s.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    s.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
  }
  function renderList(){const c=document.querySelector('.tx-list');if(c){c.innerHTML=listHTML();bindRows(c);}}
  function render(){
    const root=document.getElementById('tx-root');if(!root)return;
    const it=filtered();
    const ent=it.filter(t=>t.tipo==='entrada').reduce((s,t)=>s+t.valor,0);
    const sai=it.filter(t=>t.tipo==='saida').reduce((s,t)=>s+t.valor,0);
    const saldo=ent-sai;
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('arrowdown',14)}</span>Entradas</div><div class="kv" style="color:var(--income)">${fmt(ent)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('arrowup',14)}</span>Saídas</div><div class="kv" style="color:var(--expense)">${fmt(sai)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('wallet',14)}</span>Saldo do período</div><div class="kv" style="color:${saldo>=0?'var(--income)':'var(--expense)'}">${saldo<0?'−':''}${fmt(Math.abs(saldo))}</div></div>
      </div>
      <div class="toolbar">
        <div class="seg">${['todas','entrada','saida'].map(t=>`<button class="${f.tipo===t?'on':''}" data-tipo="${t}">${t==='todas'?'Todas':t==='entrada'?'Entradas':'Saídas'}</button>`).join('')}</div>
        <select class="field" data-fcat><option value="todas">Categorias</option>${CATS.map(c=>`<option value="${c.id}"${f.cat===c.id?' selected':''}>${c.nome}</option>`).join('')}</select>
        <input class="field" type="date" data-fdi value="${f.di}" style="max-width:148px">
        <input class="field" type="date" data-fdf value="${f.df}" style="max-width:148px">
        <input class="field grow" placeholder="Buscar…" data-fq value="${f.q}">
        <button class="btn btn-primary" data-add>${svg('plus',16)} Nova transação</button>
      </div>
      <div class="tx-list">${listHTML()}</div>`;
    root.querySelectorAll('[data-tipo]').forEach(b=>b.onclick=()=>setF('tipo',b.dataset.tipo));
    root.querySelector('[data-fcat]').onchange=e=>setF('cat',e.target.value);
    root.querySelector('[data-fdi]').onchange=e=>setF('di',e.target.value);
    root.querySelector('[data-fdf]').onchange=e=>setF('df',e.target.value);
    const q=root.querySelector('[data-fq]');q.oninput=e=>{f.q=e.target.value;renderList();};
    root.querySelector('[data-add]').onclick=()=>form();
    bindRows(root);
  }
  function del(id){const t=DB.transacoes.find(x=>x.id===id);if(!t)return;Modal.confirm('Excluir transação?',`"${t.descricao}" será removida.`,()=>{DB.transacoes=DB.transacoes.filter(x=>x.id!==id);Toast.show('Transação excluída');render();});}
  function form(id){
    const t=id?DB.transacoes.find(x=>x.id===id):null;
    const body=`
      <div class="seg-in">
        <label class="segopt"><input type="radio" name="ttipo" value="entrada"${t&&t.tipo==='entrada'?' checked':''}><span>Entrada</span></label>
        <label class="segopt"><input type="radio" name="ttipo" value="saida"${!t||t.tipo==='saida'?' checked':''}><span>Saída</span></label>
      </div>
      <div class="fg"><label>Descrição</label><input class="field" id="t-desc" value="${t?t.descricao.replace(/"/g,'&quot;'):''}" placeholder="Ex: Venda, mercado…"></div>
      <div class="frow">
        <div class="fg"><label>Valor (R$)</label><input class="field" id="t-valor" type="number" step="0.01" min="0" value="${t?t.valor:''}" placeholder="0,00"></div>
        <div class="fg"><label>Data</label><input class="field" id="t-data" type="date" value="${t?t.data:offset(0)}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Categoria</label><select class="field" id="t-cat">${CATS.map(x=>`<option value="${x.id}"${t&&t.cat===x.id?' selected':''}>${x.nome}</option>`).join('')}</select></div>
        <div class="fg"><label>Método</label><select class="field" id="t-met">${['Pix','Dinheiro','Débito','Crédito','Transferência'].map(m=>`<option${t&&t.metodo===m?' selected':''}>${m}</option>`).join('')}</select></div>
      </div>`;
    Modal.open(id?'Editar transação':'Nova transação',body,(back)=>{
      const desc=back.querySelector('#t-desc').value.trim();
      const valor=parseFloat(back.querySelector('#t-valor').value);
      const data=back.querySelector('#t-data').value;
      const cat=back.querySelector('#t-cat').value;
      const met=back.querySelector('#t-met').value;
      const tipo=back.querySelector('input[name=ttipo]:checked').value;
      if(!desc||!(valor>0)||!data){Toast.show('Preencha descrição, valor e data','err');return false;}
      if(t){Object.assign(t,{descricao:desc,valor,data,cat,metodo:met,tipo});Toast.show('Transação atualizada');}
      else{DB.transacoes.unshift({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,data});Toast.show('Transação registrada');}
      render();
    },id?'Salvar':'Adicionar');
  }
  return {render};
})();

