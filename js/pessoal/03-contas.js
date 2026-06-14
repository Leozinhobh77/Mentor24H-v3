const Contas=(()=>{
  // ── Estado ──────────────────────────────────────────────────────────────
  let mesAtivo=HOJE.toISOString().slice(0,7);   // YYYY-MM
  let filtroCard=null;                           // 'pagar'|'receber'|'vencida'|null
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
    if(filtroCard==='pagar')  base=base.filter(c=>c.tipo==='pagar'&&c.status!=='paga');
    if(filtroCard==='receber')base=base.filter(c=>c.tipo==='receber'&&c.status!=='paga');
    if(filtroCard==='vencida')base=base.filter(c=>c.status==='pendente'&&diasAte(c.venc)<0);
    if(filtroBusca)base=base.filter(c=>c.descricao.toLowerCase().includes(filtroBusca.toLowerCase()));
    if(filtrocat!=='todas')base=base.filter(c=>c.cat===filtrocat);
    return base;
  }

  // ── Saldos ───────────────────────────────────────────────────────────────
  function calcSaldos(){
    const pendentes=contasMes().filter(c=>c.status!=='paga');
    const receber=pendentes.filter(c=>c.tipo==='receber').reduce((s,c)=>s+c.valor,0);
    const pagar=pendentes.filter(c=>c.tipo==='pagar').reduce((s,c)=>s+c.valor,0);
    const vencidas=pendentes.filter(c=>diasAte(c.venc)<0).reduce((s,c)=>s+c.valor,0);
    return{receber,pagar,vencidas,saldo:receber-pagar};
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

  // ── Linha de conta ───────────────────────────────────────────────────────
  function rowHTML(c){
    const cat=CATS.find(x=>x.id===c.cat)||{nome:'—',cor:'#8A867C',icone:'box'};
    const isPagar=c.tipo==='pagar';
    const corSoft=isPagar?'var(--expense-soft)':'var(--income-soft)';
    const corIcon=isPagar?'var(--expense)':'var(--income)';
    const sinal=isPagar?'−':'+';
    const extras=(c.recorrente?` <span style="font-size:10px;opacity:.55">↺</span>`:'')+(c.parcela?` <span style="font-size:10px;opacity:.55">(${c.parcela})</span>`:'');
    return `<div class="lrow${c.status==='paga'?' paga':''}" role="listitem" tabindex="0" data-qid="${c.id}" style="cursor:pointer">
      <div class="li" style="background:${corSoft};color:${corIcon}">${svg(isPagar?'arrowup':'arrowdown',18)}</div>
      <div class="lmain" style="pointer-events:none">
        <div class="lt">${c.descricao}${extras}</div>
        <div class="ls"><span class="tagcat" style="background:${cat.cor}20;color:${cat.cor}">${cat.nome}</span><span>·</span><span>${c.status==='paga'?'Paga':venceTxt(c.venc)}</span></div>
      </div>
      <div style="text-align:right;flex-shrink:0;pointer-events:none">
        <div style="font-family:var(--mono);font-size:13.5px;font-weight:700;color:${corIcon};font-variant-numeric:tabular-nums">${sinal}${fmt(c.valor)}</div>
      </div>
    </div>`;
  }

  // ── Build lista agrupada por semanas (T35) ───────────────────────────────
  function buildLista(){
    const contas=filtered();
    const pendentes=contas.filter(c=>c.status!=='paga');
    const pagas=contas.filter(c=>c.status==='paga');
    const vencidas=pendentes.filter(c=>diasAte(c.venc)<0);
    const emAberto=pendentes.filter(c=>diasAte(c.venc)>=0);
    const semanas=semanasMes(mesAtivo);
    const hojeIso=HOJE.toISOString().slice(0,10);
    const fmtDia=iso=>{const d=new Date(iso+'T00:00:00');return d.getDate()+'/'+(d.getMonth()+1);};
    let html='',algum=false;

    // Grupo VENCIDAS
    if(vencidas.length){
      algum=true;
      const sub=vencidas.reduce((s,c)=>s+c.valor,0);
      html+=`<div class="fin-grupo-hdr">
        <span class="fin-grupo-dot" style="background:var(--expense)"></span>
        <span class="fin-grupo-nome">🔴 Vencidas</span>
        <span class="fin-grupo-chip">${vencidas.length}</span>
        <span class="fin-grupo-sub">${fmt(sub)}</span>
      </div>${vencidas.map(rowHTML).join('')}`;
    }

    // Grupos SEMANAS
    semanas.forEach(sem=>{
      const si=sem.segmIni.toISOString().slice(0,10);
      const sf=sem.segmFim.toISOString().slice(0,10);
      const domIso=sem.fim.toISOString().slice(0,10);
      const itens=emAberto.filter(c=>c.venc>=si&&c.venc<=sf);
      if(!itens.length)return;
      algum=true;
      const sub=itens.filter(c=>c.tipo==='pagar').reduce((s,c)=>s+c.valor,0);
      const estaSemanaBool=hojeIso>=si&&hojeIso<=domIso;
      const passada=domIso<hojeIso;
      let pill='';
      if(sub>0&&!passada){
        let denom;
        if(estaSemanaBool){denom=Math.round((sem.fim-HOJE)/86400000)+1;}
        else{denom=Math.round((sem.segmFim-sem.segmIni)/86400000)+1;}
        if(denom>0)pill=`<span class="fin-semana-pill">≈ ${fmt(sub/denom)}/dia</span>`;
      }
      const badge=estaSemanaBool?`<span class="fin-semana-badge">Esta Semana</span>`:'';
      const chipContent=estaSemanaBool
        ?`<span class="fin-grupo-chip" style="background:var(--warning-soft);color:var(--warning)">${Math.max(0,Math.round((sem.fim-HOJE)/86400000))} dias</span>`
        :`<span class="fin-grupo-chip">${itens.length}</span>`;
      html+=`<div class="fin-grupo-hdr">
        <span class="fin-grupo-dot" style="background:${estaSemanaBool?'var(--warning)':'var(--border-strong)'}"></span>
        <span class="fin-grupo-nome">Semana ${sem.n} · ${fmtDia(si)}–${fmtDia(sf)}</span>
        ${chipContent}
        <span class="fin-grupo-sub">${fmt(sub)}</span>
        ${pill}${badge}
      </div>${itens.map(rowHTML).join('')}`;
    });

    // Grupo PAGAS (recolhível)
    if(!filtroCard&&pagas.length){
      algum=true;
      const sub=pagas.reduce((s,c)=>s+c.valor,0);
      html+=`<button type="button" class="fin-grupo-toggle" aria-expanded="${pagasAberta}" aria-controls="fin-pagas-body" data-pagas>
        <span class="fin-grupo-dot" style="background:var(--income)"></span>
        <span class="fin-grupo-nome">Pagas</span>
        <span class="fin-grupo-chip">${pagas.length}</span>
        <span class="fin-grupo-sub">${fmt(sub)}</span>
        <svg class="fin-seta" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div id="fin-pagas-body" class="fin-pagas-body${pagasAberta?' aberta':''}">${pagas.map(rowHTML).join('')}</div>`;
    }

    if(!algum){
      const msg=filtroCard==='pagar'?'Nada a pagar em aberto':filtroCard==='receber'?'Nada a receber em aberto':filtroCard==='vencida'?'Nenhuma conta vencida 🎉':'Tá tudo em dia ✨';
      html=`<div class="fin-empty">${msg}</div>`;
    }
    return html;
  }

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
      (c.status!=='paga'?`<button class="qm-btn success" data-qpay>${svg('tick',16)} Marcar paga</button>`:'')+
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

    // Faixa do Mentor (T39) — filtra por modulo 'Finanças'
    const mentorIns=(typeof Mentor!=='undefined')?Mentor.feed().filter(i=>i.modulo==='Finanças'):[];
    const mentorHTML=mentorIns.length
      ?`<div class="mentor-strip" role="alert" style="margin-bottom:var(--s-4)">
          ${mentorIns.map(i=>`<div class="mtr-card" style="--cs:var(--${i.severidade==='critico'?'expense':'warning'}-soft);--c:var(--${i.severidade==='critico'?'expense':'warning'})">
            <div class="mtr-main"><div class="mtr-t">${i.titulo}</div>${i.texto?`<div class="mtr-s">${i.texto}</div>`:''}</div>
            ${i.acao?`<div class="mtr-side"><button class="mtr-btn" onclick="navigate('${i.acao.navTo||'financas'}')">${i.acao.label}</button></div>`:''}
          </div>`).join('')}
        </div>`:'';

    const{receber,pagar,vencidas,saldo}=calcSaldos();
    const total=receber+pagar||1;
    const donutHTML=typeof donut!=='undefined'?donut([{value:receber,cor:'var(--income)'},{value:pagar,cor:'var(--expense)'}],100):'';
    const catsOpts=CATS.map(c=>`<option value="${c.id}"${filtrocat===c.id?' selected':''}>${c.nome}</option>`).join('');
    const filtroAtivo=filtroBusca||(filtrocat!=='todas');

    root.innerHTML=`
      ${mentorHTML}
      <div class="fin-resumo" aria-label="Resumo financeiro">
        <div class="fin-nav-mes">
          <button type="button" data-mes="-1" aria-label="Mês anterior">‹</button>
          <b>${mesLabel(mesAtivo)}</b>
          <button type="button" data-mes="1" aria-label="Próximo mês">›</button>
        </div>
        <div class="fin-hero">
          <div class="fin-hero-left">
            <div class="fin-hero-label">Saldo previsto</div>
            <div class="fin-hero-val ${saldo>=0?'positivo':'negativo'}">${fmt(Math.abs(saldo))}</div>
            <div class="fin-hero-sub">entra <strong>${fmt(receber)}</strong> · sai <strong>${fmt(pagar)}</strong></div>
            <div class="fin-reserva">${calcReserva()}</div>
          </div>
          <div class="fin-donut-wrap" aria-hidden="true">${donutHTML}</div>
        </div>
        <div class="fin-prop-bar" aria-hidden="true">
          <div class="fin-prop-bar-income" style="width:${(receber/total*100).toFixed(1)}%"></div>
        </div>
        <div class="fin-tira" role="group" aria-label="Filtrar por tipo de conta">
          <button type="button" class="fin-card${filtroCard==='pagar'?' ativo':''}" data-filtro="pagar" aria-pressed="${filtroCard==='pagar'}">
            <div class="fin-card-icon" style="background:var(--expense-soft);color:var(--expense)" aria-hidden="true">${svg('arrowup',16)}</div>
            <span class="fin-card-label">A pagar</span>
            <span class="fin-card-val">${fmt(pagar)}</span>
          </button>
          <button type="button" class="fin-card${filtroCard==='receber'?' ativo':''}" data-filtro="receber" aria-pressed="${filtroCard==='receber'}">
            <div class="fin-card-icon" style="background:var(--income-soft);color:var(--income)" aria-hidden="true">${svg('arrowdown',16)}</div>
            <span class="fin-card-label">A receber</span>
            <span class="fin-card-val">${fmt(receber)}</span>
          </button>
          <button type="button" class="fin-card${vencidas===0?' neutro':''}${filtroCard==='vencida'?' ativo':''}" data-filtro="vencida" aria-pressed="${filtroCard==='vencida'}">
            <div class="fin-card-icon" style="background:var(--warning-soft);color:var(--warning)" aria-hidden="true">${svg('alert',16)}</div>
            <span class="fin-card-label">Vencidas</span>
            <span class="fin-card-val">${fmt(vencidas)}</span>
          </button>
        </div>
      </div>
      <div class="fin-filtros-bar">
        <button type="button" class="fin-filtros-btn${filtroAtivo?' ativo':''}" data-filtros-toggle aria-expanded="${filtrosAberto}" aria-controls="fin-filtros-panel">
          ${svg('search',13)} Filtros${filtroAtivo?' ●':''}
        </button>
        <button class="btn btn-primary" data-add style="margin-left:auto">${svg('plus',16)} Nova conta</button>
      </div>
      <div id="fin-filtros-panel" class="fin-filtros-panel${filtrosAberto?' aberto':''}">
        <div class="filtros-row">
          <input class="field" type="text" placeholder="Buscar por descrição…" data-fbusca value="${filtroBusca.replace(/"/g,'&quot;')}">
          <select class="field" data-fcat><option value="todas"${filtrocat==='todas'?' selected':''}>Todas as categorias</option>${catsOpts}</select>
        </div>
      </div>
      <div id="fin-grupos" class="fin-grupos" role="list" aria-live="polite" aria-label="Lista de contas"></div>
      <div id="fin-quick-overlay" class="fin-quick-overlay" data-close-quick></div>
      <div id="fin-quick-menu" class="fin-quick-menu" role="dialog" aria-modal="true" aria-label="Ações rápidas">
        <div class="qm-label"></div>
        <div class="qm-actions"></div>
        <button class="btn" style="width:100%;margin-top:var(--s-3)" data-close-quick>Cancelar</button>
      </div>`;

    // Binds
    root.querySelectorAll('[data-mes]').forEach(b=>b.onclick=()=>navMes(+b.dataset.mes));
    root.querySelectorAll('.fin-card').forEach(btn=>btn.onclick=()=>{
      filtroCard=filtroCard===btn.dataset.filtro?null:btn.dataset.filtro;render();
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
  function pay(id){const c=DB.contas.find(x=>x.id===id);if(c){c.status='paga';DB.transacoes.unshift({id:nid(),tipo:c.tipo==='pagar'?'saida':'entrada',descricao:c.descricao,valor:c.valor,cat:c.cat,metodo:c.metodo,data:offset(0)});Toast.show('Conta paga · transação registrada');render();}}
  function del(id){const c=DB.contas.find(x=>x.id===id);if(!c)return;Modal.confirm('Excluir conta?',`"${c.descricao}" será removida permanentemente.`,()=>{DB.contas=DB.contas.filter(x=>x.id!==id);Toast.show('Conta excluída');render();});}
  function form(id){
    const c=id?DB.contas.find(x=>x.id===id):null;
    const body=`
      <div class="seg-in">
        <label class="segopt"><input type="radio" name="ctipo" value="pagar"${!c||c.tipo==='pagar'?' checked':''}><span>A pagar</span></label>
        <label class="segopt"><input type="radio" name="ctipo" value="receber"${c&&c.tipo==='receber'?' checked':''}><span>A receber</span></label>
      </div>
      <div class="fg"><label>Descrição</label><input class="field" id="f-desc" value="${c?c.descricao.replace(/"/g,'&quot;'):''}" placeholder="Ex: Aluguel"></div>
      <div class="frow">
        <div class="fg"><label>Valor (R$)</label><input class="field" id="f-valor" type="number" step="0.01" min="0" value="${c?c.valor:''}" placeholder="0,00"></div>
        <div class="fg"><label>Vencimento</label><input class="field" id="f-venc" type="date" value="${c?c.venc:offset(0)}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Categoria</label><select class="field" id="f-cat">${CATS.map(x=>`<option value="${x.id}"${c&&c.cat===x.id?' selected':''}>${x.nome}</option>`).join('')}</select></div>
        <div class="fg"><label>Método</label><select class="field" id="f-met">${['Pix','Dinheiro','Débito','Crédito','Transferência'].map(m=>`<option${c&&c.metodo===m?' selected':''}>${m}</option>`).join('')}</select></div>
      </div>
      ${id?'':`<div class="frow"><div class="fg"><label>Repetir</label><select class="field" id="f-rep"><option value="nao">Não repetir</option><option value="mensal">Mensal (6×)</option></select></div><div class="fg"><label>Parcelas</label><input class="field" id="f-parc" type="number" min="1" max="48" value="1"></div></div>`}`;
    Modal.open(id?'Editar conta':'Nova conta',body,(back)=>{
      const desc=back.querySelector('#f-desc').value.trim();
      const valor=parseFloat(back.querySelector('#f-valor').value);
      const venc=back.querySelector('#f-venc').value;
      const cat=back.querySelector('#f-cat').value;
      const met=back.querySelector('#f-met').value;
      const tipo=back.querySelector('input[name=ctipo]:checked').value;
      if(!desc||!(valor>0)||!venc){Toast.show('Preencha descrição, valor e vencimento','err');return false;}
      if(c){Object.assign(c,{descricao:desc,valor,venc,cat,metodo:met,tipo});Toast.show('Conta atualizada');}
      else{
        const rep=back.querySelector('#f-rep').value;
        const parc=Math.min(48,Math.max(1,parseInt(back.querySelector('#f-parc').value)||1));
        if(parc>1){for(let i=0;i<parc;i++)DB.contas.push({id:nid(),tipo,descricao:`${desc} (${i+1}/${parc})`,valor,cat,metodo:met,venc:addMonths(venc,i),status:'pendente',parcela:`${i+1}/${parc}`});Toast.show(`${parc} parcelas criadas`);}
        else if(rep==='mensal'){for(let i=0;i<6;i++)DB.contas.push({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,venc:addMonths(venc,i),status:'pendente',recorrente:true});Toast.show('Conta recorrente criada');}
        else{DB.contas.push({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,venc,status:'pendente'});Toast.show('Conta criada');}
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

