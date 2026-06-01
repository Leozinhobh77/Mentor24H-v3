/* ═══════════════════════════════════════════════
   ETAPA 16 — ESTUDOS (modo Pessoal)
   Matérias + timer (Pomodoro/Livre) + sessões + metas + stats.
   Espelha o padrão de Metas/Hábitos. Dados em memória (DB).
═══════════════════════════════════════════════ */
const Estudos=(()=>{
  const DOW=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const fmtH=min=>{min=Math.round(min);const h=Math.floor(min/60),m=min%60;return h&&m?`${h}h${String(m).padStart(2,'0')}`:h?`${h}h`:`${m}min`;};
  const fmtBR=iso=>{const [y,m,d]=iso.split('-');return `${d}/${m}/${y.slice(2)}`;};
  const mat=id=>DB.estudos.find(x=>x.id===id);
  const sessoesDe=id=>DB.sessoesEstudo.filter(s=>s.materiaId===id);
  const minSemana=id=>DB.sessoesEstudo.filter(s=>s.materiaId===id&&diasAte(s.data)>=-6&&diasAte(s.data)<=0).reduce((a,s)=>a+s.minutos,0);
  const minDia=d=>DB.sessoesEstudo.filter(s=>s.data===d).reduce((a,s)=>a+s.minutos,0);
  function streak(){let s=0;for(let i=0;;i++){const d=offset(-i);if(minDia(d)>0)s++;else if(i===0)continue;else break;}return s;}

  // ── Cronômetro (estado vive no closure; sobrevive ao render) ──
  let T={running:false,mode:'pomodoro',materiaId:null,focoSec:0,phase:'foco',phaseSec:0,iv:null};
  const FOCO=1500, PAUSA=300; // 25 / 5 min
  function paintTimer(){
    const el=document.getElementById('st-clock');if(!el)return;
    let txt,sub;
    if(T.mode==='pomodoro'){const lim=T.phase==='foco'?FOCO:PAUSA;const rest=Math.max(0,lim-T.phaseSec);
      txt=`${String(Math.floor(rest/60)).padStart(2,'0')}:${String(rest%60).padStart(2,'0')}`;sub=T.phase==='foco'?'Foco':'Pausa ☕';}
    else{txt=`${String(Math.floor(T.focoSec/60)).padStart(2,'0')}:${String(T.focoSec%60).padStart(2,'0')}`;sub='Livre';}
    el.textContent=txt;const s=document.getElementById('st-phase');if(s)s.textContent=sub;
    const stop=document.querySelector('#estudos-root [data-stop]');           // mantém "Concluir" vivo conforme o tempo corre
    if(stop){const can=T.focoSec>=1;stop.disabled=!can;stop.style.opacity=can?'':'.5';}
  }
  function tick(){
    T.phaseSec++;
    if(T.mode==='pomodoro'){
      if(T.phase==='foco'){T.focoSec++;if(T.phaseSec>=FOCO){T.phase='pausa';T.phaseSec=0;Toast.show('Hora da pausa ☕');}}
      else if(T.phaseSec>=PAUSA){T.phase='foco';T.phaseSec=0;Toast.show('Volta ao foco 🎯');}
    } else T.focoSec++;
    paintTimer();
  }
  function startT(){
    if(!T.materiaId){Toast.show('Escolha uma matéria','err');return;}
    if(T.running)return;T.running=true;T.iv=setInterval(tick,1000);render();
  }
  function pauseT(){T.running=false;if(T.iv)clearInterval(T.iv);render();}
  function stopT(){
    T.running=false;if(T.iv)clearInterval(T.iv);
    const min=Math.round(T.focoSec/60);
    if(min<1){T.focoSec=0;T.phase='foco';T.phaseSec=0;Toast.show('Sessão muito curta');render();return;}
    DB.sessoesEstudo.push({id:nid(),materiaId:T.materiaId,data:offset(0),minutos:min});
    Toast.show(`Sessão registrada: ${fmtH(min)} 📚`);
    T.focoSec=0;T.phase='foco';T.phaseSec=0;render();
  }

  function render(){
    const root=document.getElementById('estudos-root');if(!root)return;
    const hoje=minDia(offset(0));
    const metaTotal=DB.estudos.reduce((a,m)=>a+(m.metaSemanal||0),0);
    const semanaMin=DB.estudos.reduce((a,m)=>a+minSemana(m.id),0);
    const st=streak();
    const provas=DB.estudos.filter(m=>m.prova&&diasAte(m.prova)>=0).sort((a,b)=>diasAte(a.prova)-diasAte(b.prova));
    const prox=provas[0];
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('clock',14)}</span>Hoje</div><div class="kv" style="color:var(--brand-text)">${fmtH(hoje)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('chart',14)}</span>Semana</div><div class="kv">${fmtH(semanaMin)}<small style="font-size:12px;color:var(--text-3);font-weight:600"> / ${metaTotal}h</small></div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('flame',14)}</span>Sequência</div><div class="kv">${st} ${st===1?'dia':'dias'}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--surface-3);color:var(--text-2)">${svg('calendar',14)}</span>Próxima prova</div><div class="kv">${prox?(diasAte(prox.prova)===0?'Hoje':'D-'+diasAte(prox.prova)):'—'}</div></div>
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
          <div id="st-clock" class="st-clock">00:00</div>
          <div id="st-phase" class="st-phase">Foco</div>
        </div>
        <div class="st-mats">${DB.estudos.map(m=>`<button class="st-mat${T.materiaId===m.id?' on':''}" data-pick="${m.id}" style="--c:${m.cor}"><i style="background:${m.cor}"></i>${m.nome}</button>`).join('')||'<span style="font-size:13px;color:var(--text-3)">Cadastre uma matéria abaixo.</span>'}</div>
        <div class="st-ctrl">
          ${T.running
            ?`<button class="btn btn-soft" data-pause>${svg('pause',16)} Pausar</button>`
            :`<button class="btn btn-primary" data-start>${svg('play',16)} ${T.focoSec>0?'Continuar':'Começar'}</button>`}
          <button class="btn" style="background:var(--income);color:#fff" data-stop ${T.focoSec<1?'disabled style="opacity:.5"':''}>${svg('check',16)} Concluir</button>
        </div>
      </div>

      <div class="toolbar"><div style="flex:1;font-size:13px;color:var(--text-3);font-weight:600">${DB.estudos.length} ${DB.estudos.length===1?'matéria':'matérias'}</div><button class="btn btn-primary" data-add>${svg('plus',16)} Nova matéria</button></div>
      <div class="study-grid">${DB.estudos.length?DB.estudos.map(matCard).join(''):`<div class="empty" style="grid-column:1/-1"><div class="eico">${svg('book',24)}</div><h4>Nenhuma matéria ainda</h4><p>Cadastre uma matéria pra começar a registrar seus estudos.</p></div>`}</div>

      ${DB.sessoesEstudo.length?`
      <div class="study-stats">
        <div class="card"><div class="card-h"><h3>Horas por matéria</h3></div>${donutHTML()}</div>
        <div class="card"><div class="card-h"><h3>Últimos 7 dias</h3></div><div class="st-bars">${barsHTML()}</div></div>
      </div>
      <div class="card"><div class="card-h"><h3>Consistência</h3><span style="font-size:11.5px;color:var(--text-3);font-weight:600">${st} ${st===1?'dia':'dias'} seguidos</span></div><div class="heat">${heatHTML()}</div></div>
      <div class="card"><div class="card-h"><h3>Histórico</h3></div>${histHTML()}</div>
      `:''}`;

    // listeners
    root.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{if(T.running)return;T.mode=b.dataset.mode;T.focoSec=0;T.phase='foco';T.phaseSec=0;render();});
    root.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{if(T.running)return;T.materiaId=+b.dataset.pick;render();});
    const q=s=>root.querySelector(s);
    if(q('[data-start]'))q('[data-start]').onclick=startT;
    if(q('[data-pause]'))q('[data-pause]').onclick=pauseT;
    if(q('[data-stop]'))q('[data-stop]').onclick=stopT;
    q('[data-manual]').onclick=()=>manual();
    q('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
    root.querySelectorAll('[data-rms]').forEach(b=>b.onclick=()=>{DB.sessoesEstudo=DB.sessoesEstudo.filter(s=>s.id!==+b.dataset.rms);Toast.show('Sessão removida');render();});
    paintTimer();
  }

  function matCard(m){
    const sem=minSemana(m.id), metaMin=(m.metaSemanal||0)*60;
    const pct=metaMin?Math.min(100,Math.round(sem/metaMin*100)):0;
    const dd=m.prova?diasAte(m.prova):null;
    return `<div class="study-card">
      <div class="sc-h">
        <span class="sc-dot" style="background:${m.cor}"></span>
        <div class="sc-nm">${m.nome}</div>
        <button class="icon-mini-btn" data-edit="${m.id}" title="Editar">${svg('pencil',15)}</button>
        <button class="icon-mini-btn" data-del="${m.id}" title="Excluir">${svg('trash',15)}</button>
      </div>
      <div class="sc-meta"><span>${fmtH(sem)} esta semana</span><span class="pct">${m.metaSemanal?pct+'%':'sem meta'}</span></div>
      <div class="bar lg"><i style="width:${pct}%;background:linear-gradient(90deg,${m.cor}99,${m.cor})"></i></div>
      <div class="sc-foot">
        <span class="chip-mini">${svg('clock',11)} meta ${m.metaSemanal||0}h/sem</span>
        ${m.prova?`<span class="chip-mini${dd>=0&&dd<=7?' urgente':''}">${svg('calendar',11)} prova ${dd<0?'passou':(dd===0?'hoje':'D-'+dd)}</span>`:''}
      </div>
    </div>`;
  }

  function donutHTML(){
    const items=DB.estudos.map(m=>({value:sessoesDe(m.id).reduce((a,s)=>a+s.minutos,0),cor:m.cor,nome:m.nome})).filter(i=>i.value>0);
    if(!items.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem sessões ainda.</p>';
    const leg=items.map(i=>`<div class="lg-row"><span class="lg-dot" style="background:${i.cor}"></span>${i.nome}<b>${fmtH(i.value)}</b></div>`).join('');
    return `<div class="st-donut">${Charts.donut(items,150)}<div class="st-legend">${leg}</div></div>`;
  }
  function barsHTML(){
    const items=[];for(let i=6;i>=0;i--){const d=offset(-i);items.push({value:minDia(d),cor:'var(--brand)',label:DOW[new Date(d+'T00:00').getDay()],short:minDia(d)?fmtH(minDia(d)):''});}
    return Charts.bars(items,170);
  }
  function heatHTML(){let h='';for(let i=34;i>=0;i--){const d=offset(-i);const mn=minDia(d);let bg='var(--surface-3)';if(mn>=60)bg='var(--brand)';else if(mn>0)bg='var(--brand-soft)';h+=`<span style="background:${bg}" title="${d}: ${fmtH(mn)}"></span>`;}return h;}
  function histHTML(){
    const regs=[...DB.sessoesEstudo].sort((a,b)=>a.data<b.data?1:(a.data>b.data?-1:b.id-a.id)).slice(0,12);
    if(!regs.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem sessões.</p>';
    return regs.map(s=>{const m=mat(s.materiaId);return `<div class="hist-row"><span class="sc-dot" style="background:${m?m.cor:'var(--text-4)'}"></span><div class="hist-main"><div class="hist-nm">${m?m.nome:'—'}</div><div class="hist-dt">${fmtBR(s.data)}</div></div><div class="hist-dur">${fmtH(s.minutos)}</div><button class="icon-mini-btn" data-rms="${s.id}">${svg('trash',14)}</button></div>`;}).join('');
  }

  function manual(){
    if(!DB.estudos.length){Toast.show('Cadastre uma matéria primeiro','err');return;}
    const body=`
      <div class="fg"><label>Matéria</label><select class="field" id="se-mat">${DB.estudos.map(m=>`<option value="${m.id}">${m.nome}</option>`).join('')}</select></div>
      <div class="frow">
        <div class="fg"><label>Minutos</label><input class="field" id="se-min" type="number" min="1" step="5" placeholder="Ex: 45"></div>
        <div class="fg"><label>Data</label><input class="field" id="se-data" type="date" value="${offset(0)}"></div>
      </div>`;
    Modal.open('Registrar estudo',body,(b)=>{
      const id=+b.querySelector('#se-mat').value, min=parseInt(b.querySelector('#se-min').value), data=b.querySelector('#se-data').value||offset(0);
      if(!(min>0)){Toast.show('Informe os minutos','err');return false;}
      DB.sessoesEstudo.push({id:nid(),materiaId:id,data,minutos:min});Toast.show('Sessão registrada 📚');render();
    },'Registrar');
  }
  function form(id){
    const m=id?mat(id):null;
    const cores=['#2D7FF9','#168A7C','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
    const curCor=m?m.cor:cores[0];
    const body=`
      <div class="fg"><label>Nome da matéria</label><input class="field" id="se-nome" value="${m?m.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Matemática"></div>
      <div class="frow">
        <div class="fg"><label>Meta semanal (horas)</label><input class="field" id="se-meta" type="number" min="0" step="1" value="${m?m.metaSemanal:''}" placeholder="Ex: 5"></div>
        <div class="fg"><label>Prova (opcional)</label><input class="field" id="se-prova" type="date" value="${m&&m.prova?m.prova:''}"></div>
      </div>
      <div class="fg"><label>Cor</label><div class="swatches" id="se-cores">${cores.map(c=>`<button type="button" class="sw${c===curCor?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>`;
    const back=Modal.open(id?'Editar matéria':'Nova matéria',body,(b)=>{
      const nome=b.querySelector('#se-nome').value.trim();
      const meta=parseInt(b.querySelector('#se-meta').value)||0;
      const prova=b.querySelector('#se-prova').value||null;
      const cor=(b.querySelector('#se-cores .on')||{}).dataset?.cor||curCor;
      if(!nome){Toast.show('Informe o nome','err');return false;}
      if(m){Object.assign(m,{nome,metaSemanal:meta,prova,cor});Toast.show('Matéria atualizada');}
      else{DB.estudos.push({id:nid(),nome,cor,metaSemanal:meta,prova});Toast.show('Matéria criada');}
      render();
    },id?'Salvar':'Criar');
    back.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-cor]').forEach(x=>x.classList.toggle('on',x===b)));
  }
  function del(id){const m=mat(id);if(!m)return;Modal.confirm('Excluir matéria?',`"${m.nome}" e suas sessões serão removidas.`,()=>{DB.estudos=DB.estudos.filter(x=>x.id!==id);DB.sessoesEstudo=DB.sessoesEstudo.filter(s=>s.materiaId!==id);Toast.show('Matéria excluída');render();});}

  return {render};
})();
