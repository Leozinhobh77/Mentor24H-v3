/* ═══════════════════════════════════════════════
   ETAPA 18 — SÉRIES (modo Pessoal)
   Listas + progresso por episódio + maratona + nota/resenha + stats.
   Molde = leitura.js. Dados em memória (DB).
═══════════════════════════════════════════════ */
const Series=(()=>{
  const DOW=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const LISTAS=[['assistindo','Assistindo'],['quero','Quero assistir'],['concluido','Concluído'],['abandonei','Abandonei']];
  const fmtBR=iso=>{const [y,m,d]=iso.split('-');return `${d}/${m}/${y.slice(2)}`;};
  const serie=id=>DB.series.find(x=>x.id===id);
  const epsDia=d=>DB.sessoesSeries.filter(s=>s.data===d).reduce((a,s)=>a+(s.eps||0),0);
  const temSessao=d=>DB.sessoesSeries.some(s=>s.data===d);
  const assistindo=()=>DB.series.filter(s=>s.lista==='assistindo');
  const concluidas=()=>DB.series.filter(s=>s.lista==='concluido').length;
  const epsAno=()=>DB.sessoesSeries.reduce((a,s)=>a+(s.eps||0),0);
  function streak(){let s=0;for(let i=0;;i++){const d=offset(-i);if(temSessao(d))s++;else if(i===0)continue;else break;}return s;}
  const stars=n=>{if(n==null)return '<span style="color:var(--text-4)">sem nota</span>';const f=Math.floor(n),h=n%1>=0.5;return '<span class="read-stars">'+'★'.repeat(f)+(h?'½':'')+'☆'.repeat(Math.max(0,5-f-(h?1:0)))+'</span>';};
  const cover=s=>`<div class="read-cover" style="background:linear-gradient(150deg,${s.cor},${s.cor}cc)"><span>${(s.titulo||'?').trim()[0]||'?'}</span></div>`;
  const proxEp=s=>`T${s.tempAtual||1}E${(s.epAtual||0)+1}`;

  function regEp(s,n){ // marca n episódios vistos hoje
    const inc=Math.min(n,s.epsTotal-s.epsVistos);
    if(inc<=0){Toast.show('Série já completa');return;}
    s.epsVistos+=inc; s.epAtual=(s.epAtual||0)+inc;
    DB.sessoesSeries.push({id:nid(),serieId:s.id,data:offset(0),eps:inc});
    Toast.show(s.epsVistos>=s.epsTotal?'🎬 Chegou ao fim! Marque "Concluí".':`+${inc} ${inc===1?'episódio':'episódios'} 📺`);
  }

  let filtro='assistindo';

  function render(){
    const root=document.getElementById('series-root');if(!root)return;
    const st=streak(), as=assistindo();
    const lista=filtro==='todos'?DB.series:DB.series.filter(s=>s.lista===filtro);
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('play',14)}</span>Assistindo</div><div class="kv" style="color:var(--brand-text)">${as.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('check',14)}</span>Concluídas</div><div class="kv">${concluidas()}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('flame',14)}</span>Sequência</div><div class="kv">${st} ${st===1?'dia':'dias'}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--surface-3);color:var(--text-2)">${svg('chart',14)}</span>Eps no ano</div><div class="kv">${epsAno()}</div></div>
      </div>

      ${as.length?`<div class="card"><div class="card-h"><h3>Continuar assistindo</h3></div>${as.map(watchCard).join('')}</div>`:''}

      <div class="toolbar">
        <div class="seg read-tabs">${LISTAS.map(([k,l])=>`<button class="${filtro===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div>
        <button class="btn btn-primary" data-add>${svg('plus',16)} Nova série</button>
      </div>
      <div class="study-grid">${lista.length?lista.map(serieCard).join(''):`<div class="empty" style="grid-column:1/-1"><div class="eico">${svg('tv',24)}</div><h4>Nada nesta lista</h4><p>Adicione uma série pra começar.</p></div>`}</div>

      ${DB.sessoesSeries.length?`
      <div class="study-stats">
        <div class="card"><div class="card-h"><h3>Séries por gênero</h3></div>${donutHTML()}</div>
        <div class="card"><div class="card-h"><h3>Episódios · últimos 7 dias</h3></div><div class="st-bars">${barsHTML()}</div></div>
      </div>
      <div class="card"><div class="card-h"><h3>Consistência</h3><span style="font-size:11.5px;color:var(--text-3);font-weight:600">${st} ${st===1?'dia':'dias'} seguidos</span></div><div class="heat">${heatHTML()}</div></div>
      <div class="card"><div class="card-h"><h3>Histórico</h3></div>${histHTML()}</div>
      `:''}`;

    root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{filtro=b.dataset.tab;render();});
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
    root.querySelectorAll('[data-ep]').forEach(b=>b.onclick=()=>{regEp(serie(+b.dataset.ep),1);render();});
    root.querySelectorAll('[data-mar]').forEach(b=>b.onclick=()=>maratona(+b.dataset.mar));
    root.querySelectorAll('[data-fim]').forEach(b=>b.onclick=()=>conclui(+b.dataset.fim));
    root.querySelectorAll('[data-rms]').forEach(b=>b.onclick=()=>{DB.sessoesSeries=DB.sessoesSeries.filter(s=>s.id!==+b.dataset.rms);Toast.show('Sessão removida');render();});
  }

  function watchCard(s){
    const pct=s.epsTotal?Math.min(100,Math.round(s.epsVistos/s.epsTotal*100)):0;
    const fim=s.epsVistos>=s.epsTotal;
    return `<div class="read-now">
      ${cover(s)}
      <div class="read-now-main">
        <div class="rn-tit">${s.titulo}</div>
        <div class="rn-aut">${s.plataforma||''}${s.genero?' · '+s.genero:''} · ${fim?'completa':'próximo '+proxEp(s)}</div>
        <div class="sc-meta"><span>${s.epsVistos} de ${s.epsTotal} eps</span><span class="pct">${pct}%</span></div>
        <div class="bar lg"><i style="width:${pct}%;background:linear-gradient(90deg,${s.cor}99,${s.cor})"></i></div>
        <div class="rn-acts">
          <button class="btn btn-soft sm" data-ep="${s.id}" ${fim?'disabled style="opacity:.5"':''}>${svg('plus',14)} Episódio</button>
          <button class="btn btn-soft sm" data-mar="${s.id}" ${fim?'disabled style="opacity:.5"':''}>${svg('play',14)} Maratona</button>
          <button class="btn sm" style="background:var(--income);color:#fff" data-fim="${s.id}">${svg('check',14)} Concluí</button>
        </div>
      </div>
    </div>`;
  }
  function serieCard(s){
    const pct=s.epsTotal?Math.min(100,Math.round(s.epsVistos/s.epsTotal*100)):0;
    return `<div class="study-card">
      <div class="sc-h">
        ${cover(s)}
        <div style="flex:1;min-width:0">
          <div class="sc-nm">${s.titulo}</div>
          <div class="rn-aut">${s.plataforma||''}${s.genero?' · '+s.genero:''}</div>
        </div>
        <button class="icon-mini-btn" data-edit="${s.id}" title="Editar">${svg('pencil',15)}</button>
        <button class="icon-mini-btn" data-del="${s.id}" title="Excluir">${svg('trash',15)}</button>
      </div>
      ${s.lista==='assistindo'?`<div class="bar lg" style="margin-top:8px"><i style="width:${pct}%;background:linear-gradient(90deg,${s.cor}99,${s.cor})"></i></div>`:''}
      <div class="sc-foot">
        <span class="chip-mini">${LISTAS.find(e=>e[0]===s.lista)?.[1]||s.lista}</span>
        ${s.lista==='concluido'?`<span class="chip-mini">${stars(s.nota)}</span>`:`<span class="chip-mini">${svg('play',11)} ${s.epsVistos}/${s.epsTotal}</span>`}
      </div>
      ${s.lista==='concluido'&&s.resenha?`<p class="read-resenha">"${s.resenha}"</p>`:''}
    </div>`;
  }

  function donutHTML(){
    const byGen={};
    DB.series.forEach(s=>{const g=s.genero||'Outros';if(!byGen[g])byGen[g]={value:0,cor:s.cor,nome:g};byGen[g].value++;});
    const items=Object.values(byGen).filter(i=>i.value>0);
    if(!items.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem séries ainda.</p>';
    const leg=items.map(i=>`<div class="lg-row"><span class="lg-dot" style="background:${i.cor}"></span>${i.nome}<b>${i.value}</b></div>`).join('');
    return `<div class="st-donut">${Charts.donut(items,150)}<div class="st-legend">${leg}</div></div>`;
  }
  function barsHTML(){
    const items=[];for(let i=6;i>=0;i--){const d=offset(-i);const e=epsDia(d);items.push({value:e,cor:'var(--brand)',label:DOW[new Date(d+'T00:00').getDay()],short:e?e+'ep':''});}
    return Charts.bars(items,170);
  }
  function heatHTML(){let h='';for(let i=34;i>=0;i--){const d=offset(-i);const e=epsDia(d);let bg='var(--surface-3)';if(e>=3)bg='var(--brand)';else if(e>0)bg='var(--brand-soft)';h+=`<span style="background:${bg}" title="${d}: ${e} eps"></span>`;}return h;}
  function histHTML(){
    const regs=[...DB.sessoesSeries].sort((a,b)=>a.data<b.data?1:(a.data>b.data?-1:b.id-a.id)).slice(0,12);
    if(!regs.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem sessões.</p>';
    return regs.map(s=>{const sr=serie(s.serieId);return `<div class="hist-row"><span class="sc-dot" style="background:${sr?sr.cor:'var(--text-4)'}"></span><div class="hist-main"><div class="hist-nm">${sr?sr.titulo:'—'}</div><div class="hist-dt">${fmtBR(s.data)} · ${s.eps||0} ${s.eps===1?'episódio':'episódios'}</div></div><button class="icon-mini-btn" data-rms="${s.id}">${svg('trash',14)}</button></div>`;}).join('');
  }

  function maratona(id){
    const s=serie(id);if(!s)return;
    const rest=s.epsTotal-s.epsVistos;
    Modal.open(`Maratona · ${s.titulo}`,`<div class="fg"><label>Quantos episódios você viu? (restam ${rest})</label><input class="field" id="mr-eps" type="number" min="1" max="${rest}" value="1"></div>`,(b)=>{
      const n=parseInt(b.querySelector('#mr-eps').value)||0;
      if(n<=0){Toast.show('Informe os episódios','err');return false;}
      regEp(s,n);render();
    },'Registrar');
  }
  function conclui(id){
    const s=serie(id);if(!s)return;
    const body=`
      <p style="font-size:13px;color:var(--text-2);margin-bottom:10px">Você terminou <b>${s.titulo}</b>! 🎉</p>
      <div class="fg"><label>Nota — <span id="sr-notalbl">2,5</span> <span id="sr-notast" class="read-stars">★★½☆☆</span></label>
        <input type="range" id="sr-nota" min="0" max="5" step="0.5" value="2.5" style="width:100%"></div>
      <div class="fg"><label>Resenha (opcional)</label><textarea class="field" id="sr-res" rows="3" placeholder="O que achou?"></textarea></div>`;
    const back=Modal.open('Concluí ✓',body,(b)=>{
      s.lista='concluido';s.nota=parseFloat(b.querySelector('#sr-nota').value);s.resenha=b.querySelector('#sr-res').value.trim();s.epsVistos=s.epsTotal;
      Toast.show('🎬 Série concluída!');render();
    },'Salvar');
    const r=back.querySelector('#sr-nota'),lbl=back.querySelector('#sr-notalbl'),st=back.querySelector('#sr-notast');
    r.oninput=()=>{const n=parseFloat(r.value);lbl.textContent=n.toFixed(1).replace('.',',');const f=Math.floor(n),h=n%1>=0.5;st.textContent='★'.repeat(f)+(h?'½':'')+'☆'.repeat(Math.max(0,5-f-(h?1:0)));};
  }
  function form(id){
    const s=id?serie(id):null;
    const cores=['#2D7FF9','#168A7C','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
    const curCor=s?s.cor:cores[0];
    const body=`
      <div class="fg"><label>Título</label><input class="field" id="sr-tit" value="${s?s.titulo.replace(/"/g,'&quot;'):''}" placeholder="Ex: Dark"></div>
      <div class="frow">
        <div class="fg"><label>Gênero</label><input class="field" id="sr-gen" value="${s?(s.genero||'').replace(/"/g,'&quot;'):''}" placeholder="Ex: Ficção"></div>
        <div class="fg"><label>Plataforma</label><input class="field" id="sr-plat" value="${s?(s.plataforma||'').replace(/"/g,'&quot;'):''}" placeholder="Ex: Netflix"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Total de episódios</label><input class="field" id="sr-eps" type="number" min="1" value="${s?s.epsTotal:''}" placeholder="Ex: 26"></div>
        <div class="fg"><label>Lista</label><select class="field" id="sr-lista">${LISTAS.map(([k,t])=>`<option value="${k}"${(s?s.lista:'quero')===k?' selected':''}>${t}</option>`).join('')}</select></div>
      </div>
      <div class="fg"><label>Cor</label><div class="swatches" id="sr-cores">${cores.map(c=>`<button type="button" class="sw${c===curCor?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>`;
    const back=Modal.open(id?'Editar série':'Nova série',body,(b)=>{
      const titulo=b.querySelector('#sr-tit').value.trim();
      const epsTotal=parseInt(b.querySelector('#sr-eps').value)||0;
      const lista=b.querySelector('#sr-lista').value;
      const cor=(b.querySelector('#sr-cores .on')||{}).dataset?.cor||curCor;
      if(!titulo||!(epsTotal>0)){Toast.show('Informe título e total de episódios','err');return false;}
      const dd={titulo,genero:b.querySelector('#sr-gen').value.trim()||'Outros',plataforma:b.querySelector('#sr-plat').value.trim(),epsTotal,lista,cor};
      if(s){Object.assign(s,dd);if(s.epsVistos>epsTotal)s.epsVistos=epsTotal;Toast.show('Série atualizada');}
      else{DB.series.push(Object.assign({id:nid(),epsVistos:lista==='concluido'?epsTotal:0,tempAtual:1,epAtual:0,nota:null,resenha:''},dd));Toast.show('Série adicionada');}
      render();
    },id?'Salvar':'Adicionar');
    back.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-cor]').forEach(x=>x.classList.toggle('on',x===b)));
  }
  function del(id){const s=serie(id);if(!s)return;Modal.confirm('Excluir série?',`"${s.titulo}" e suas sessões serão removidas.`,()=>{DB.series=DB.series.filter(x=>x.id!==id);DB.sessoesSeries=DB.sessoesSeries.filter(x=>x.serieId!==id);Toast.show('Série excluída');render();});}

  return {render};
})();
