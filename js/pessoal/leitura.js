/* ═══════════════════════════════════════════════
   ETAPA 17 — LEITURA / LIVROS (modo Pessoal)
   Estante + progresso por página + sessões (páginas/tempo) + nota/resenha + meta anual + stats.
   Molde = estudos.js. Dados em memória (DB).
═══════════════════════════════════════════════ */
const Leitura=(()=>{
  const DOW=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const ESTANTES=[['lendo','Lendo'],['quero','Quero ler'],['lido','Lido'],['abandonei','Abandonei']];
  const fmtH=min=>{min=Math.round(min);const h=Math.floor(min/60),m=min%60;return h&&m?`${h}h${String(m).padStart(2,'0')}`:h?`${h}h`:`${m}min`;};
  const fmtBR=iso=>{const [y,m,d]=iso.split('-');return `${d}/${m}/${y.slice(2)}`;};
  const livro=id=>DB.livros.find(x=>x.id===id);
  const pagDia=d=>DB.sessoesLeitura.filter(s=>s.data===d).reduce((a,s)=>a+(s.paginas||0),0);
  const temSessao=d=>DB.sessoesLeitura.some(s=>s.data===d);
  const lendo=()=>DB.livros.filter(l=>l.estante==='lendo');
  const lidosAno=()=>DB.livros.filter(l=>l.estante==='lido').length;
  const paginasAno=()=>DB.sessoesLeitura.reduce((a,s)=>a+(s.paginas||0),0);
  function streak(){let s=0;for(let i=0;;i++){const d=offset(-i);if(temSessao(d))s++;else if(i===0)continue;else break;}return s;}
  const stars=n=>{if(n==null)return '<span style="color:var(--text-4)">sem nota</span>';const f=Math.floor(n),h=n%1>=0.5;return '<span class="read-stars">'+'★'.repeat(f)+(h?'½':'')+'☆'.repeat(Math.max(0,5-f-(h?1:0)))+'</span>';};
  const cover=l=>`<div class="read-cover" style="background:linear-gradient(150deg,${l.cor},${l.cor}cc)"><span>${(l.titulo||'?').trim()[0]||'?'}</span></div>`;

  // ── Timer de leitura (estado no closure; molde Estudos) ──
  let T={running:false,mode:'pomodoro',livroId:null,focoSec:0,phase:'foco',phaseSec:0,iv:null};
  const FOCO=1500, PAUSA=300;
  function resetT(){T.focoSec=0;T.phase='foco';T.phaseSec=0;}
  function paintTimer(){
    const el=document.getElementById('rl-clock');if(!el)return;
    let txt,sub;
    if(T.mode==='pomodoro'){const lim=T.phase==='foco'?FOCO:PAUSA;const rest=Math.max(0,lim-T.phaseSec);
      txt=`${String(Math.floor(rest/60)).padStart(2,'0')}:${String(rest%60).padStart(2,'0')}`;sub=T.phase==='foco'?'Lendo':'Pausa ☕';}
    else{txt=`${String(Math.floor(T.focoSec/60)).padStart(2,'0')}:${String(T.focoSec%60).padStart(2,'0')}`;sub='Livre';}
    el.textContent=txt;const s=document.getElementById('rl-phase');if(s)s.textContent=sub;
    const stop=document.querySelector('#leitura-root [data-stop]');
    if(stop){const can=T.focoSec>=1;stop.disabled=!can;stop.style.opacity=can?'':'.5';}
  }
  function tick(){
    T.phaseSec++;
    if(T.mode==='pomodoro'){
      if(T.phase==='foco'){T.focoSec++;if(T.phaseSec>=FOCO){T.phase='pausa';T.phaseSec=0;Toast.show('Hora da pausa ☕');}}
      else if(T.phaseSec>=PAUSA){T.phase='foco';T.phaseSec=0;Toast.show('Volta à leitura 📖');}
    } else T.focoSec++;
    paintTimer();
  }
  function startT(){
    if(!T.livroId){Toast.show('Escolha um livro','err');return;}
    if(T.running)return;T.running=true;T.iv=setInterval(tick,1000);render();
  }
  function pauseT(){T.running=false;if(T.iv)clearInterval(T.iv);render();}
  function stopT(){
    T.running=false;if(T.iv)clearInterval(T.iv);
    const min=Math.round(T.focoSec/60), lv=livro(T.livroId);
    if(min<1||!lv){resetT();Toast.show('Sessão muito curta');render();return;}
    const body=`<p style="font-size:13px;color:var(--text-2);margin-bottom:10px">Você leu <b>${lv.titulo}</b> por <b>${fmtH(min)}</b>. Até que página chegou?</p>
      <div class="fg"><label>Página atual (de ${lv.paginas})</label><input class="field" id="rl-pg" type="number" min="${lv.paginaAtual}" max="${lv.paginas}" value="${lv.paginaAtual}"></div>`;
    Modal.open('Registrar leitura',body,(b)=>{
      const nova=Math.min(lv.paginas,Math.max(lv.paginaAtual,parseInt(b.querySelector('#rl-pg').value)||lv.paginaAtual));
      const pags=nova-lv.paginaAtual; lv.paginaAtual=nova;
      DB.sessoesLeitura.push({id:nid(),livroId:lv.id,data:offset(0),paginas:pags,minutos:min});
      Toast.show(nova>=lv.paginas?'📖 Chegou ao fim! Marque "Terminei".':`Leitura registrada: ${fmtH(min)} 📖`);
      resetT();render();
    },'Salvar');
  }

  let filtro='lendo';

  function render(){
    const root=document.getElementById('leitura-root');if(!root)return;
    const st=streak(), meta=DB.metaLeitura||0, lidos=lidosAno();
    const metaPct=meta?Math.min(100,Math.round(lidos/meta*100)):0;
    const ls=lendo();
    const lista=filtro==='todos'?DB.livros:DB.livros.filter(l=>l.estante===filtro);
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('book',14)}</span>Lendo agora</div><div class="kv" style="color:var(--brand-text)">${ls.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('target',14)}</span>Meta do ano</div><div class="kv">${lidos}<small style="font-size:12px;color:var(--text-3);font-weight:600"> / ${meta}</small></div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('flame',14)}</span>Sequência</div><div class="kv">${st} ${st===1?'dia':'dias'}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--surface-3);color:var(--text-2)">${svg('chart',14)}</span>Páginas no ano</div><div class="kv">${paginasAno()}</div></div>
      </div>

      <div class="study-timer card">
        <div class="st-head">
          <div class="seg">
            <button class="${T.mode==='pomodoro'?'on':''}" data-mode="pomodoro">Pomodoro</button>
            <button class="${T.mode==='livre'?'on':''}" data-mode="livre">Livre</button>
          </div>
          <button class="btn btn-soft" data-manual>${svg('plus',15)} Registrar</button>
        </div>
        <div class="st-clock-wrap">
          <div id="rl-clock" class="st-clock">00:00</div>
          <div id="rl-phase" class="st-phase">Lendo</div>
        </div>
        <div class="st-mats">${ls.length?ls.map(l=>`<button class="st-mat${T.livroId===l.id?' on':''}" data-pick="${l.id}" style="--c:${l.cor}"><i style="background:${l.cor}"></i>${l.titulo}</button>`).join(''):'<span style="font-size:13px;color:var(--text-3)">Nenhum livro em leitura. Adicione um na estante.</span>'}</div>
        <div class="st-ctrl">
          ${T.running
            ?`<button class="btn btn-soft" data-pause>${svg('pause',16)} Pausar</button>`
            :`<button class="btn btn-primary" data-start>${svg('play',16)} ${T.focoSec>0?'Continuar':'Começar'}</button>`}
          <button class="btn" style="background:var(--income);color:#fff" data-stop ${T.focoSec<1?'disabled style="opacity:.5"':''}>${svg('check',16)} Concluir</button>
        </div>
      </div>

      ${ls.length?`<div class="card"><div class="card-h"><h3>Lendo agora</h3></div>${ls.map(lendoCard).join('')}</div>`:''}

      <div class="card"><div class="card-h"><h3>Meta de leitura ${new Date().getFullYear()}</h3><button class="icon-mini-btn" data-meta title="Definir meta">${svg('pencil',15)}</button></div>
        <div class="sc-meta"><span>${lidos} de ${meta} livros</span><span class="pct">${metaPct}%</span></div>
        <div class="bar lg"><i style="width:${metaPct}%;background:linear-gradient(90deg,var(--brand)99,var(--brand))"></i></div>
      </div>

      <div class="toolbar">
        <div class="seg read-tabs">${ESTANTES.map(([k,l])=>`<button class="${filtro===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div>
        <button class="btn btn-primary" data-add>${svg('plus',16)} Novo livro</button>
      </div>
      <div class="study-grid">${lista.length?lista.map(bookCard).join(''):`<div class="empty" style="grid-column:1/-1"><div class="eico">${svg('book',24)}</div><h4>Nada nesta estante</h4><p>Adicione um livro pra começar.</p></div>`}</div>

      ${DB.sessoesLeitura.length?`
      <div class="study-stats">
        <div class="card"><div class="card-h"><h3>Livros por gênero</h3></div>${donutHTML()}</div>
        <div class="card"><div class="card-h"><h3>Páginas · últimos 7 dias</h3></div><div class="st-bars">${barsHTML()}</div></div>
      </div>
      <div class="card"><div class="card-h"><h3>Consistência</h3><span style="font-size:11.5px;color:var(--text-3);font-weight:600">${st} ${st===1?'dia':'dias'} seguidos</span></div><div class="heat">${heatHTML()}</div></div>
      <div class="card"><div class="card-h"><h3>Histórico</h3></div>${histHTML()}</div>
      `:''}`;

    // listeners
    root.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{if(T.running)return;T.mode=b.dataset.mode;resetT();render();});
    root.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{if(T.running)return;T.livroId=+b.dataset.pick;render();});
    root.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{filtro=b.dataset.tab;render();});
    const q=s=>root.querySelector(s);
    if(q('[data-start]'))q('[data-start]').onclick=startT;
    if(q('[data-pause]'))q('[data-pause]').onclick=pauseT;
    if(q('[data-stop]'))q('[data-stop]').onclick=stopT;
    q('[data-manual]').onclick=()=>manual();
    q('[data-add]').onclick=()=>form();
    q('[data-meta]').onclick=()=>metaForm();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
    root.querySelectorAll('[data-pag]').forEach(b=>b.onclick=()=>atualizarPagina(+b.dataset.pag));
    root.querySelectorAll('[data-reg]').forEach(b=>b.onclick=()=>manual(+b.dataset.reg));
    root.querySelectorAll('[data-fim]').forEach(b=>b.onclick=()=>terminei(+b.dataset.fim));
    root.querySelectorAll('[data-rms]').forEach(b=>b.onclick=()=>{DB.sessoesLeitura=DB.sessoesLeitura.filter(s=>s.id!==+b.dataset.rms);Toast.show('Sessão removida');render();});
    paintTimer();
  }

  function lendoCard(l){
    const pct=l.paginas?Math.min(100,Math.round(l.paginaAtual/l.paginas*100)):0;
    return `<div class="read-now">
      ${cover(l)}
      <div class="read-now-main">
        <div class="rn-tit">${l.titulo}</div>
        <div class="rn-aut">${l.autor||''}</div>
        <div class="sc-meta"><span>pág. ${l.paginaAtual} de ${l.paginas}</span><span class="pct">${pct}%</span></div>
        <div class="bar lg"><i style="width:${pct}%;background:linear-gradient(90deg,${l.cor}99,${l.cor})"></i></div>
        <div class="rn-acts">
          <button class="btn btn-soft sm" data-pag="${l.id}">${svg('pencil',14)} Página</button>
          <button class="btn btn-soft sm" data-reg="${l.id}">${svg('plus',14)} Leitura</button>
          <button class="btn sm" style="background:var(--income);color:#fff" data-fim="${l.id}">${svg('check',14)} Terminei</button>
        </div>
      </div>
    </div>`;
  }
  function bookCard(l){
    const pct=l.paginas?Math.min(100,Math.round(l.paginaAtual/l.paginas*100)):0;
    return `<div class="study-card">
      <div class="sc-h">
        ${cover(l)}
        <div style="flex:1;min-width:0">
          <div class="sc-nm">${l.titulo}</div>
          <div class="rn-aut">${l.autor||''}${l.genero?' · '+l.genero:''}</div>
        </div>
        <button class="icon-mini-btn" data-edit="${l.id}" title="Editar">${svg('pencil',15)}</button>
        <button class="icon-mini-btn" data-del="${l.id}" title="Excluir">${svg('trash',15)}</button>
      </div>
      ${l.estante==='lendo'?`<div class="bar lg" style="margin-top:8px"><i style="width:${pct}%;background:linear-gradient(90deg,${l.cor}99,${l.cor})"></i></div>`:''}
      <div class="sc-foot">
        <span class="chip-mini">${ESTANTES.find(e=>e[0]===l.estante)?.[1]||l.estante}</span>
        ${l.estante==='lido'?`<span class="chip-mini">${stars(l.nota)}</span>`:`<span class="chip-mini">${svg('book',11)} ${l.paginas}p</span>`}
      </div>
      ${l.estante==='lido'&&l.resenha?`<p class="read-resenha">"${l.resenha}"</p>`:''}
    </div>`;
  }

  function donutHTML(){
    const byGen={};
    DB.livros.forEach(l=>{const g=l.genero||'Outros';if(!byGen[g])byGen[g]={value:0,cor:l.cor,nome:g};byGen[g].value++;});
    const items=Object.values(byGen).filter(i=>i.value>0);
    if(!items.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem livros ainda.</p>';
    const leg=items.map(i=>`<div class="lg-row"><span class="lg-dot" style="background:${i.cor}"></span>${i.nome}<b>${i.value}</b></div>`).join('');
    return `<div class="st-donut">${Charts.donut(items,150)}<div class="st-legend">${leg}</div></div>`;
  }
  function barsHTML(){
    const items=[];for(let i=6;i>=0;i--){const d=offset(-i);const p=pagDia(d);items.push({value:p,cor:'var(--brand)',label:DOW[new Date(d+'T00:00').getDay()],short:p?p+'p':''});}
    return Charts.bars(items,170);
  }
  function heatHTML(){let h='';for(let i=34;i>=0;i--){const d=offset(-i);const p=pagDia(d);let bg='var(--surface-3)';if(p>=30)bg='var(--brand)';else if(p>0)bg='var(--brand-soft)';h+=`<span style="background:${bg}" title="${d}: ${p}p"></span>`;}return h;}
  function histHTML(){
    const regs=[...DB.sessoesLeitura].sort((a,b)=>a.data<b.data?1:(a.data>b.data?-1:b.id-a.id)).slice(0,12);
    if(!regs.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem sessões.</p>';
    return regs.map(s=>{const l=livro(s.livroId);return `<div class="hist-row"><span class="sc-dot" style="background:${l?l.cor:'var(--text-4)'}"></span><div class="hist-main"><div class="hist-nm">${l?l.titulo:'—'}</div><div class="hist-dt">${fmtBR(s.data)} · ${s.paginas||0}p${s.minutos?' · '+fmtH(s.minutos):''}</div></div><button class="icon-mini-btn" data-rms="${s.id}">${svg('trash',14)}</button></div>`;}).join('');
  }

  function atualizarPagina(id){
    const l=livro(id);if(!l)return;
    Modal.open(`Página · ${l.titulo}`,`<div class="fg"><label>Página atual (de ${l.paginas})</label><input class="field" id="ap-pg" type="number" min="0" max="${l.paginas}" value="${l.paginaAtual}"></div>`,(b)=>{
      const nova=Math.min(l.paginas,Math.max(0,parseInt(b.querySelector('#ap-pg').value)||0));
      const d=nova-l.paginaAtual;
      if(d>0)DB.sessoesLeitura.push({id:nid(),livroId:l.id,data:offset(0),paginas:d,minutos:0});
      l.paginaAtual=nova;Toast.show('Página atualizada');render();
    },'Salvar');
  }
  function manual(id){
    const ls=lendo();
    if(!ls.length){Toast.show('Coloque um livro em "Lendo" primeiro','err');return;}
    const sel=id||T.livroId||ls[0].id;
    const body=`
      <div class="fg"><label>Livro</label><select class="field" id="rl-liv">${ls.map(l=>`<option value="${l.id}"${l.id===sel?' selected':''}>${l.titulo}</option>`).join('')}</select></div>
      <div class="frow">
        <div class="fg"><label>Páginas lidas</label><input class="field" id="rl-pgs" type="number" min="0" step="1" placeholder="Ex: 20"></div>
        <div class="fg"><label>Minutos (opcional)</label><input class="field" id="rl-min" type="number" min="0" step="5" placeholder="Ex: 30"></div>
      </div>
      <div class="fg"><label>Data</label><input class="field" id="rl-data" type="date" value="${offset(0)}"></div>`;
    Modal.open('Registrar leitura',body,(b)=>{
      const l=livro(+b.querySelector('#rl-liv').value);
      const pgs=parseInt(b.querySelector('#rl-pgs').value)||0, min=parseInt(b.querySelector('#rl-min').value)||0;
      const data=b.querySelector('#rl-data').value||offset(0);
      if(pgs<=0&&min<=0){Toast.show('Informe páginas ou minutos','err');return false;}
      DB.sessoesLeitura.push({id:nid(),livroId:l.id,data,paginas:pgs,minutos:min});
      if(pgs>0)l.paginaAtual=Math.min(l.paginas,l.paginaAtual+pgs);
      Toast.show('Leitura registrada 📖');render();
    },'Registrar');
  }
  function terminei(id){
    const l=livro(id);if(!l)return;
    const body=`
      <p style="font-size:13px;color:var(--text-2);margin-bottom:10px">Você terminou <b>${l.titulo}</b>! 🎉</p>
      <div class="fg"><label>Nota — <span id="rl-notalbl">2,5</span> <span id="rl-notast" class="read-stars">★★½☆☆</span></label>
        <input type="range" id="rl-nota" min="0" max="5" step="0.5" value="2.5" style="width:100%"></div>
      <div class="fg"><label>Resenha (opcional)</label><textarea class="field" id="rl-res" rows="3" placeholder="O que achou?"></textarea></div>`;
    const back=Modal.open('Terminei ✓',body,(b)=>{
      const nota=parseFloat(b.querySelector('#rl-nota').value);
      l.estante='lido';l.nota=nota;l.resenha=b.querySelector('#rl-res').value.trim();l.paginaAtual=l.paginas;
      if(T.livroId===l.id){T.livroId=null;resetT();}
      Toast.show('📚 Livro concluído!');render();
    },'Salvar');
    const r=back.querySelector('#rl-nota'),lbl=back.querySelector('#rl-notalbl'),st=back.querySelector('#rl-notast');
    r.oninput=()=>{const n=parseFloat(r.value);lbl.textContent=n.toFixed(1).replace('.',',');const f=Math.floor(n),h=n%1>=0.5;st.textContent='★'.repeat(f)+(h?'½':'')+'☆'.repeat(Math.max(0,5-f-(h?1:0)));};
  }
  function metaForm(){
    Modal.open('Meta de leitura',`<div class="fg"><label>Quantos livros quer ler em ${new Date().getFullYear()}?</label><input class="field" id="rl-meta" type="number" min="0" step="1" value="${DB.metaLeitura||0}"></div>`,(b)=>{
      DB.metaLeitura=parseInt(b.querySelector('#rl-meta').value)||0;Toast.show('Meta atualizada');render();
    },'Salvar');
  }
  function form(id){
    const l=id?livro(id):null;
    const cores=['#2D7FF9','#168A7C','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
    const curCor=l?l.cor:cores[0];
    const body=`
      <div class="fg"><label>Título</label><input class="field" id="rl-tit" value="${l?l.titulo.replace(/"/g,'&quot;'):''}" placeholder="Ex: O Hobbit"></div>
      <div class="frow">
        <div class="fg"><label>Autor</label><input class="field" id="rl-aut" value="${l?(l.autor||'').replace(/"/g,'&quot;'):''}" placeholder="Ex: Tolkien"></div>
        <div class="fg"><label>Gênero</label><input class="field" id="rl-gen" value="${l?(l.genero||'').replace(/"/g,'&quot;'):''}" placeholder="Ex: Fantasia"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Total de páginas</label><input class="field" id="rl-pgt" type="number" min="1" value="${l?l.paginas:''}" placeholder="Ex: 310"></div>
        <div class="fg"><label>Estante</label><select class="field" id="rl-est">${ESTANTES.map(([k,t])=>`<option value="${k}"${(l?l.estante:'quero')===k?' selected':''}>${t}</option>`).join('')}</select></div>
      </div>
      <div class="fg"><label>Cor</label><div class="swatches" id="rl-cores">${cores.map(c=>`<button type="button" class="sw${c===curCor?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>`;
    const back=Modal.open(id?'Editar livro':'Novo livro',body,(b)=>{
      const titulo=b.querySelector('#rl-tit').value.trim();
      const paginas=parseInt(b.querySelector('#rl-pgt').value)||0;
      const estante=b.querySelector('#rl-est').value;
      const cor=(b.querySelector('#rl-cores .on')||{}).dataset?.cor||curCor;
      if(!titulo||!(paginas>0)){Toast.show('Informe título e total de páginas','err');return false;}
      const dd={titulo,autor:b.querySelector('#rl-aut').value.trim(),genero:b.querySelector('#rl-gen').value.trim()||'Outros',paginas,estante,cor};
      if(l){Object.assign(l,dd);if(l.paginaAtual>paginas)l.paginaAtual=paginas;Toast.show('Livro atualizado');}
      else{DB.livros.push(Object.assign({id:nid(),paginaAtual:estante==='lido'?paginas:0,nota:null,resenha:''},dd));Toast.show('Livro adicionado');}
      render();
    },id?'Salvar':'Adicionar');
    back.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-cor]').forEach(x=>x.classList.toggle('on',x===b)));
  }
  function del(id){const l=livro(id);if(!l)return;Modal.confirm('Excluir livro?',`"${l.titulo}" e suas sessões serão removidos.`,()=>{DB.livros=DB.livros.filter(x=>x.id!==id);DB.sessoesLeitura=DB.sessoesLeitura.filter(s=>s.livroId!==id);Toast.show('Livro excluído');render();});}

  return {render};
})();
