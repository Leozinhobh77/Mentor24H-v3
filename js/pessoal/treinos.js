/* ═══════════════════════════════════════════════
   ETAPA 19 — TREINOS (modo Pessoal)
   Planos A/B/C + agenda · registro adaptável por modalidade · frequência ·
   medições · motor de evolução & comparação de períodos (linha, delta, platô, PR).
   Moldes: estudos/leitura (módulo) + relatorios-neg (período). Dados em memória (DB).
═══════════════════════════════════════════════ */
const Treinos=(()=>{
  const DOWK=['dom','seg','ter','qua','qui','sex','sab'];
  const DOWL={dom:'Dom',seg:'Seg',ter:'Ter',qua:'Qua',qui:'Qui',sex:'Sex',sab:'Sáb'};
  const modOf=key=>DB.treinoModalidades.find(m=>m.key===key)||{key,label:key,cor:'#8A867C',ic:'check',tipo:'duracao'};
  const tipoDe=key=>modOf(key).tipo;
  const corMod=key=>modOf(key).cor;
  const MEDIDAS=[['peito','Peito'],['braco','Braço'],['cintura','Cintura'],['quadril','Quadril'],['perna','Perna']];
  const PERIODOS=[{k:'7d',l:'7 dias'},{k:'30d',l:'30 dias'},{k:'mes',l:'Mês'},{k:'3m',l:'3 meses'}];
  const fmtBR=iso=>{const [y,m,d]=iso.split('-');return `${d}/${m}/${y.slice(2)}`;};
  const plano=id=>DB.treinoPlanos.find(p=>p.id===id);
  const sessDia=d=>DB.treinoSessoes.filter(s=>s.data===d);
  const temSessao=d=>DB.treinoSessoes.some(s=>s.data===d);
  function streak(){let s=0;for(let i=0;;i++){const d=offset(-i);if(temSessao(d))s++;else if(i===0)continue;else break;}return s;}
  const freqSemana=()=>DB.treinoSessoes.filter(s=>diasAte(s.data)>=-6&&diasAte(s.data)<=0).length;
  const noPeriodo=(ini,fim)=>DB.treinoSessoes.filter(s=>s.data>=ini&&s.data<=fim);
  const volSessao=s=>s.volume||0;
  const ultimaMedicao=()=>[...DB.treinoMedicoes].sort((a,b)=>a.data<b.data?1:-1)[0]||null;
  const cover=(letra,cor)=>`<div class="read-cover" style="background:linear-gradient(150deg,${cor},${cor}cc);width:38px;height:38px;border-radius:10px;font-size:16px"><span>${letra}</span></div>`;

  // ── período (molde relatorios-neg) ──
  let periodo='3m';
  let medA=null, medB=null, medChart='peso'; // estado do comparador/gráfico de medições
  function periodoRange(p){
    if(p==='7d')return [offset(-6),offset(0)];
    if(p==='30d')return [offset(-29),offset(0)];
    if(p==='mes'){const d=new Date(HOJE);return [new Date(d.getFullYear(),d.getMonth(),1).toISOString().slice(0,10),offset(0)];}
    if(p==='3m')return [offset(-89),offset(0)];
    return [offset(-29),offset(0)];
  }
  function periodoAnteriorRange(ini,fim){const dur=diasAte(fim)-diasAte(ini);return [offset(diasAte(ini)-dur-1),offset(diasAte(ini)-1)];}
  function delta(atual,anterior){if(anterior===0)return {pct:atual>0?100:0,dir:atual>0?'up':'flat'};const pct=Math.round((atual-anterior)/Math.abs(anterior)*100);return {pct:Math.abs(pct),dir:pct>2?'up':pct<-2?'down':'flat'};}
  // dir desejada: 'up' bom p/ treinos/volume; 'down' bom p/ peso/cintura
  function deltaChip(d,bomSe){const bom=(d.dir===bomSe)||(d.dir==='flat'&&false);const cls=d.dir==='flat'?'flat':(bom?'pos':'neg');const arw=d.dir==='up'?'▲':d.dir==='down'?'▼':'■';return `<span class="tre-delta ${cls}">${arw} ${d.pct}%</span>`;}

  // ── PR: maior carga por exercício (musculação) + data ──
  function recordes(){
    const pr={};
    DB.treinoSessoes.filter(s=>tipoDe(s.modalidade)==='forca').forEach(s=>{
      (s.exercicios||[]).forEach(e=>{(e.series||[]).forEach(se=>{
        if(se.carga&&(!pr[e.nome]||se.carga>pr[e.nome].carga))pr[e.nome]={carga:se.carga,data:s.data};
      });});
    });
    return Object.entries(pr).map(([nome,v])=>({nome,...v})).sort((a,b)=>b.carga-a.carga);
  }
  // ── volume semanal (p/ platô) ──
  function volSemanal(nSem){
    const out=[];
    for(let w=nSem-1;w>=0;w--){const ini=offset(-(w*7+6)),fim=offset(-(w*7));
      out.push(noPeriodo(ini,fim).reduce((a,s)=>a+volSessao(s),0));}
    return out; // antigo -> recente
  }
  function plato(){
    const v=volSemanal(4); // 4 semanas
    if(v.length<4||v[3]===0)return false;
    // últimas 3 semanas sem ganho real sobre a 1ª da janela
    return v[3]<=v[0]*1.03 && v[2]<=v[0]*1.03;
  }

  function render(){
    const root=document.getElementById('treinos-root');if(!root)return;
    const st=streak(), freq=freqSemana(), meta=DB.treinoConfig.metaSemanal||0;
    const mesIni=new Date(HOJE.getFullYear(),HOJE.getMonth(),1).toISOString().slice(0,10);
    const noMes=DB.treinoSessoes.filter(s=>s.data>=mesIni).length;
    const med=ultimaMedicao();
    const medMesIni=[...DB.treinoMedicoes].filter(m=>m.data<mesIni).sort((a,b)=>a.data<b.data?1:-1)[0];
    const pesoDelta=med&&medMesIni?+(med.peso-medMesIni.peso).toFixed(1):null;
    const hojeKey=DOWK[HOJE.getDay()];
    const planoHoje=DB.treinoAgenda[hojeKey]?plano(DB.treinoAgenda[hojeKey]):null;
    const feitoHoje=temSessao(offset(0));

    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('flame',14)}</span>Sequência</div><div class="kv">${st} ${st===1?'dia':'dias'}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('check',14)}</span>Esta semana</div><div class="kv" style="color:var(--brand-text)">${freq}<small style="font-size:12px;color:var(--text-3);font-weight:600"> / ${meta}</small></div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('calendar',14)}</span>No mês</div><div class="kv">${noMes}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--surface-3);color:var(--text-2)">${svg('activity',14)}</span>Peso</div><div class="kv">${med?med.peso+'<small style="font-size:12px;color:var(--text-3);font-weight:600">kg</small>':'—'}${pesoDelta!=null?` <span class="tre-delta ${pesoDelta<0?'pos':pesoDelta>0?'neg':'flat'}" style="font-size:11px">${pesoDelta>0?'+':''}${pesoDelta}</span>`:''}</div></div>
      </div>

      <div class="card">
        <div class="card-h"><h3>Treino de hoje · ${DOWL[hojeKey]}</h3>${feitoHoje?'<span class="chip-mini" style="background:var(--income-soft);color:var(--income)">✓ feito</span>':''}</div>
        <div class="tre-today">
          ${planoHoje?`${cover(planoHoje.nome.replace(/[^A-Za-z0-9]/g,'').slice(-1)||'•',planoHoje.cor)}
            <div style="flex:1;min-width:0"><div class="rn-tit">${planoHoje.nome}</div><div class="rn-aut">${modOf(planoHoje.modalidade).label}${planoHoje.exercicios?.length?' · '+planoHoje.exercicios.length+' exercícios':''}</div></div>`
            :`<div style="flex:1"><div class="rn-tit">Dia livre</div><div class="rn-aut">Sem plano na agenda de hoje</div></div>`}
        </div>
        <div class="rn-acts" style="margin-top:12px">
          ${planoHoje&&tipoDe(planoHoje.modalidade)==='forca'&&planoHoje.exercicios?.length?`<button class="btn btn-primary sm" data-exec="${planoHoje.id}">${svg('play',14)} Executar plano</button>`:''}
          ${planoHoje?`<button class="btn btn-soft sm" data-feito="${planoHoje.id}">${svg('check',14)} Marcar feito</button>`:''}
          <button class="btn btn-soft sm" data-avulso>${svg('plus',14)} Treino avulso</button>
        </div>
      </div>

      <div class="card"><div class="card-h"><h3>Planos</h3><div style="display:flex;gap:8px"><button class="btn btn-soft sm" data-modalidades>${svg('activity',14)} Modalidades</button><button class="btn btn-primary sm" data-addplano>${svg('plus',14)} Novo plano</button></div></div>
        <div class="tre-planos">${DB.treinoPlanos.length?DB.treinoPlanos.map(planoRow).join(''):'<p style="font-size:13px;color:var(--text-3)">Crie um plano (A/B/C).</p>'}</div>
        <div class="card-h" style="margin-top:16px"><h3 style="font-size:13px">Agenda semanal</h3></div>
        <div class="tre-agenda">${DOWK.map(k=>{const pid=DB.treinoAgenda[k];const pl=pid?plano(pid):null;return `<button class="tre-day" data-day="${k}"><span class="td-l">${DOWL[k]}</span><span class="td-p" style="${pl?`background:${pl.cor}22;color:${pl.cor}`:''}">${pl?pl.nome.replace('Plano ',''):'—'}</span></button>`;}).join('')}</div>
      </div>

      <div class="study-stats">
        <div class="card"><div class="card-h"><h3>Frequência</h3><span style="font-size:11.5px;color:var(--text-3);font-weight:600">${st} ${st===1?'dia':'dias'} seguidos</span></div><div class="heat">${heatHTML()}</div></div>
        <div class="card"><div class="card-h"><h3>Por modalidade</h3></div>${donutHTML()}</div>
      </div>

      <div class="card">
        <div class="card-h"><h3>Evolução</h3><div class="seg read-tabs">${PERIODOS.map(p=>`<button class="${periodo===p.k?'on':''}" data-per="${p.k}">${p.l}</button>`).join('')}</div></div>
        ${evolucaoHTML()}
      </div>

      <div class="card"><div class="card-h"><h3>Recordes (PR)</h3></div>${prHTML()}</div>

      <div class="card"><div class="card-h"><h3>Medições</h3><button class="btn btn-soft sm" data-medicao>${svg('plus',14)} Registrar</button></div>${medicoesHTML()}</div>

      <div class="card"><div class="card-h"><h3>Histórico</h3></div>${histHTML()}</div>`;

    const q=s=>root.querySelector(s);
    if(q('[data-exec]'))q('[data-exec]').onclick=()=>execPlano(+q('[data-exec]').dataset.exec);
    if(q('[data-feito]'))q('[data-feito]').onclick=()=>marcarFeito(+q('[data-feito]').dataset.feito);
    q('[data-avulso]').onclick=()=>avulso();
    q('[data-addplano]').onclick=()=>planoForm();
    q('[data-medicao]').onclick=()=>medicaoForm();
    q('[data-modalidades]').onclick=()=>modalidadesForm();
    root.querySelectorAll('[data-editmed]').forEach(b=>b.onclick=()=>medicaoForm(+b.dataset.editmed));
    root.querySelectorAll('[data-delmed]').forEach(b=>b.onclick=()=>{const id=+b.dataset.delmed;Modal.confirm('Excluir medição?','Esse registro será removido.',()=>{DB.treinoMedicoes=DB.treinoMedicoes.filter(m=>m.id!==id);Toast.show('Medição excluída');render();});});
    if(q('#med-a'))q('#med-a').onchange=()=>{medA=q('#med-a').value;render();};
    if(q('#med-b'))q('#med-b').onchange=()=>{medB=q('#med-b').value;render();};
    if(q('#med-chart'))q('#med-chart').onchange=()=>{medChart=q('#med-chart').value;render();};
    root.querySelectorAll('[data-per]').forEach(b=>b.onclick=()=>{periodo=b.dataset.per;render();});
    root.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>setDia(b.dataset.day));
    root.querySelectorAll('[data-editp]').forEach(b=>b.onclick=()=>planoForm(+b.dataset.editp));
    root.querySelectorAll('[data-delp]').forEach(b=>b.onclick=()=>delPlano(+b.dataset.delp));
    root.querySelectorAll('[data-rms]').forEach(b=>b.onclick=()=>{DB.treinoSessoes=DB.treinoSessoes.filter(s=>s.id!==+b.dataset.rms);Toast.show('Sessão removida');render();});
  }

  function planoRow(p){
    const ex=p.exercicios?.length?`${p.exercicios.length} exercícios`:(modOf(p.modalidade).label);
    return `<div class="tre-plano-row">${cover(p.nome.replace(/[^A-Za-z0-9]/g,'').slice(-1)||'•',p.cor)}
      <div style="flex:1;min-width:0"><div class="rn-tit">${p.nome}</div><div class="rn-aut">${modOf(p.modalidade).label} · ${ex}</div></div>
      <button class="icon-mini-btn" data-editp="${p.id}">${svg('pencil',15)}</button>
      <button class="icon-mini-btn" data-delp="${p.id}">${svg('trash',15)}</button></div>`;
  }
  function heatHTML(){let h='';for(let i=48;i>=0;i--){const d=offset(-i);const n=sessDia(d).length;let bg='var(--surface-3)';if(n>=1)bg='var(--brand)';h+=`<span style="background:${bg}" title="${d}: ${n} treino(s)"></span>`;}return h;}
  function donutHTML(){
    const by={};DB.treinoSessoes.forEach(s=>{const m=s.modalidade||'outro';by[m]=(by[m]||0)+1;});
    const items=Object.entries(by).map(([k,v])=>({value:v,cor:corMod(k),nome:modOf(k).label})).filter(i=>i.value>0);
    if(!items.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem treinos ainda.</p>';
    const leg=items.map(i=>`<div class="lg-row"><span class="lg-dot" style="background:${i.cor}"></span>${i.nome}<b>${i.value}</b></div>`).join('');
    return `<div class="st-donut">${Charts.donut(items,150)}<div class="st-legend">${leg}</div></div>`;
  }
  function evolucaoHTML(){
    const [ini,fim]=periodoRange(periodo);
    const sess=noPeriodo(ini,fim);
    const [pIni,pFim]=periodoAnteriorRange(ini,fim);
    const sessPrev=noPeriodo(pIni,pFim);
    // linha de volume por sessão (ordem cronológica)
    const ord=[...sess].sort((a,b)=>a.data<b.data?-1:1);
    const volVals=ord.map(s=>volSessao(s));
    // peso no período
    const meds=[...DB.treinoMedicoes].filter(m=>m.data>=ini&&m.data<=fim).sort((a,b)=>a.data<b.data?-1:1);
    const pesoVals=meds.map(m=>m.peso);
    // comparação
    const volTot=sess.reduce((a,s)=>a+volSessao(s),0), volPrev=sessPrev.reduce((a,s)=>a+volSessao(s),0);
    const nT=sess.length, nTPrev=sessPrev.length;
    const pesoAtual=meds.length?meds[meds.length-1].peso:(ultimaMedicao()?.peso||0);
    const medsPrev=[...DB.treinoMedicoes].filter(m=>m.data>=pIni&&m.data<=pFim).sort((a,b)=>a.data<b.data?-1:1);
    const pesoPrev=medsPrev.length?medsPrev[medsPrev.length-1].peso:pesoAtual;
    const cintAtual=meds.length?(meds[meds.length-1].medidas?.cintura||0):0;
    const cintPrev=medsPrev.length?(medsPrev[medsPrev.length-1].medidas?.cintura||0):cintAtual;
    const cmp=[
      ['Treinos',nT,deltaChip(delta(nT,nTPrev),'up')],
      ['Volume',Math.round(volTot).toLocaleString('pt-BR'),deltaChip(delta(volTot,volPrev),'up')],
      ['Peso',pesoAtual?pesoAtual+'kg':'—',deltaChip(delta(pesoAtual,pesoPrev),'down')],
      ['Cintura',cintAtual?cintAtual+'cm':'—',deltaChip(delta(cintAtual,cintPrev),'down')],
    ];
    const platoBadge=plato()?`<div class="tre-plato">${svg('alert',13)} Volume travado nas últimas semanas — varie o treino 🧱</div>`:'';
    return `
      <div class="tre-cmp">${cmp.map(([l,v,d])=>`<div class="tre-cmp-c"><div class="ccl">${l}</div><div class="ccv">${v}</div>${d}</div>`).join('')}</div>
      ${platoBadge}
      <div class="tre-line"><div class="tre-line-t">Volume por treino</div>${volVals.length>1?Charts.line(volVals,150):'<p style="font-size:12px;color:var(--text-3);padding:8px 0">Poucos dados no período.</p>'}</div>
      <div class="tre-line"><div class="tre-line-t">Peso (kg)</div>${pesoVals.length>1?Charts.line(pesoVals,130):'<p style="font-size:12px;color:var(--text-3);padding:8px 0">Poucas medições no período.</p>'}</div>`;
  }
  function prHTML(){
    const prs=recordes().slice(0,5);
    if(!prs.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Faça treinos de musculação pra registrar recordes.</p>';
    return `<div class="tre-prs">${prs.map(p=>`<div class="tre-pr"><div class="prn">${p.nome}</div><div class="prv">${p.carga}<small>kg</small></div><div class="prd">${fmtBR(p.data)}</div></div>`).join('')}</div>`;
  }
  const MEDALL=()=>[['peso','Peso','kg'],['gordura','% gordura','%'],...MEDIDAS.map(([k,l])=>[k,l,'cm'])];
  const medVal=(m,k)=>k==='peso'?m.peso:(k==='gordura'?m.gordura:(m.medidas?.[k]));
  const BOMDOWN=['peso','gordura','cintura','quadril'];
  function medDelta(cur,ref,k,u){
    if(ref==null||cur==null)return '';
    const d=+(cur-ref).toFixed(1);if(d===0)return '<span class="tre-delta flat">■ 0</span>';
    const good=BOMDOWN.includes(k)?d<0:d>0;
    return `<span class="tre-delta ${good?'pos':'neg'}">${d>0?'▲':'▼'} ${Math.abs(d)}${u||''}</span>`;
  }
  function medicoesHTML(){
    const meds=[...DB.treinoMedicoes].sort((a,b)=>a.data<b.data?-1:1); // asc
    if(!meds.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem medições. Toque em "Registrar" pra começar.</p>';
    const desc=[...meds].reverse(), last=desc[0], prev=desc[1];
    const ref30=desc.find(m=>diasAte(last.data)-diasAte(m.data)>=28)||null;
    const ALL=MEDALL();
    const trend=ALL.map(([k,l,u])=>{const cur=medVal(last,k);if(cur==null)return '';
      return `<div class="tre-trend"><div class="ttl">${l}</div><div class="ttv">${cur}<small>${u}</small></div>
        <div class="ttd">${prev?medDelta(cur,medVal(prev,k),k):'<span class="tre-delta flat">—</span>'}${ref30?`<span class="ttd30">30d ${medDelta(cur,medVal(ref30,k),k)}</span>`:''}</div></div>`;}).filter(Boolean).join('');
    // comparar A×B
    const dates=meds.map(m=>m.data);
    const a=medA&&dates.includes(medA)?medA:dates[0];
    const bb=medB&&dates.includes(medB)?medB:dates[dates.length-1];
    const mA=meds.find(m=>m.data===a), mB=meds.find(m=>m.data===bb);
    const opt=sel=>dates.map(d=>`<option value="${d}"${d===sel?' selected':''}>${fmtBR(d)}</option>`).join('');
    const cmpRows=ALL.map(([k,l,u])=>{const va=medVal(mA,k),vb=medVal(mB,k);if(va==null&&vb==null)return '';
      const d=(va!=null&&vb!=null)?+(vb-va).toFixed(1):null, good=d==null?null:(BOMDOWN.includes(k)?d<0:d>0);
      return `<tr><td>${l}</td><td>${va!=null?va+u:'—'}</td><td>${vb!=null?vb+u:'—'}</td><td>${d==null||d===0?'<span class="tre-delta flat">—</span>':`<span class="tre-delta ${good?'pos':'neg'}">${d>0?'▲':'▼'} ${Math.abs(d)}</span>`}</td></tr>`;}).filter(Boolean).join('');
    // gráfico
    const ck=medChart&&ALL.some(m=>m[0]===medChart)?medChart:'peso';
    const cvals=meds.map(m=>medVal(m,ck)).filter(v=>v!=null);
    const chartSel=ALL.map(([k,l])=>`<option value="${k}"${k===ck?' selected':''}>${l}</option>`).join('');
    // histórico
    const hist=desc.map(m=>{const res=MEDIDAS.map(([k,l])=>m.medidas?.[k]!=null?`${l.slice(0,3)} ${m.medidas[k]}`:'').filter(Boolean).slice(0,3).join(' · ');
      return `<div class="hist-row"><div class="hist-main"><div class="hist-nm">${m.peso}kg${m.gordura?` · ${m.gordura}%`:''}</div><div class="hist-dt">${fmtBR(m.data)}${res?' · '+res:''}</div></div><button class="icon-mini-btn" data-editmed="${m.id}">${svg('pencil',14)}</button><button class="icon-mini-btn" data-delmed="${m.id}">${svg('trash',14)}</button></div>`;}).join('');
    return `
      <div class="tre-trends">${trend}</div>
      <div class="tre-medsub">
        <div class="tre-medsub-h">Comparar datas</div>
        <div class="tre-cmpsel"><select class="field" id="med-a">${opt(a)}</select><span class="cmpar">→</span><select class="field" id="med-b">${opt(bb)}</select></div>
        <table class="tre-cmptable"><thead><tr><th>Medida</th><th>${fmtBR(a)}</th><th>${fmtBR(bb)}</th><th>Δ</th></tr></thead><tbody>${cmpRows}</tbody></table>
      </div>
      <div class="tre-medsub">
        <div class="tre-medsub-h">Evolução <select class="field tre-chartsel" id="med-chart">${chartSel}</select></div>
        ${cvals.length>1?Charts.line(cvals,140):'<p style="font-size:12px;color:var(--text-3);padding:8px 0">Poucos dados pra essa medida.</p>'}
      </div>
      <div class="tre-medsub"><div class="tre-medsub-h">Histórico · ${meds.length} ${meds.length===1?'registro':'registros'}</div>${hist}</div>`;
  }
  function histHTML(){
    const regs=[...DB.treinoSessoes].sort((a,b)=>a.data<b.data?1:(a.data>b.data?-1:b.id-a.id)).slice(0,12);
    if(!regs.length)return '<p style="font-size:13px;color:var(--text-3);padding:8px 0">Sem sessões.</p>';
    return regs.map(s=>{const pl=s.planoId?plano(s.planoId):null;const t=tipoDe(s.modalidade);let resumo=modOf(s.modalidade).label;
      if(t==='distancia'&&s.distancia)resumo+=` · ${s.distancia}km`;
      else if(t==='forca'&&s.volume)resumo+=` · vol ${Math.round(s.volume).toLocaleString('pt-BR')}`;
      else if(s.duracao)resumo+=` · ${s.duracao}min`;
      return `<div class="hist-row"><span class="sc-dot" style="background:${corMod(s.modalidade)}"></span><div class="hist-main"><div class="hist-nm">${pl?pl.nome:resumo.split(' · ')[0]}</div><div class="hist-dt">${fmtBR(s.data)} · ${resumo}</div></div><button class="icon-mini-btn" data-rms="${s.id}">${svg('trash',14)}</button></div>`;}).join('');
  }

  // ── ações ──
  function calcVol(exercicios){return (exercicios||[]).reduce((a,e)=>a+(e.series||[]).reduce((b,se)=>b+(se.reps||0)*(se.carga||0),0),0);}
  function marcarFeito(pid){
    const p=plano(pid);if(!p)return;
    const forca=tipoDe(p.modalidade)==='forca';
    const vol=forca?calcVol((p.exercicios||[]).map(e=>({series:Array(e.series||0).fill({reps:e.reps,carga:e.carga})}))):0;
    DB.treinoSessoes.push({id:nid(),data:offset(0),planoId:p.id,modalidade:p.modalidade,exercicios:forca?(p.exercicios||[]).map(e=>({nome:e.nome,series:Array(e.series||0).fill(0).map(()=>({reps:e.reps,carga:e.carga}))})):[],volume:vol});
    Toast.show('Treino marcado ✅ 💪');render();
  }
  function execPlano(pid){
    const p=plano(pid);if(!p||!p.exercicios?.length)return;
    const body=`<p style="font-size:12.5px;color:var(--text-3);margin-bottom:10px">Ajuste reps/carga e salve a sessão.</p>
      ${p.exercicios.map((e,i)=>`<div class="tre-exrow"><div class="exn">${e.nome}</div>
        <input class="field tre-mini" id="ex-r-${i}" type="number" min="0" value="${e.reps}" title="reps">
        <span style="color:var(--text-3)">×</span>
        <input class="field tre-mini" id="ex-c-${i}" type="number" min="0" step="0.5" value="${e.carga}" title="kg"><span style="color:var(--text-3);font-size:12px">kg</span>
        <span style="color:var(--text-4);font-size:11px">${e.series}×</span></div>`).join('')}`;
    Modal.open(`Executar · ${p.nome}`,body,(b)=>{
      const exercicios=p.exercicios.map((e,i)=>{const reps=parseInt(b.querySelector(`#ex-r-${i}`).value)||0,carga=parseFloat(b.querySelector(`#ex-c-${i}`).value)||0;return {nome:e.nome,series:Array(e.series||0).fill(0).map(()=>({reps,carga}))};});
      DB.treinoSessoes.push({id:nid(),data:offset(0),planoId:p.id,modalidade:p.modalidade,exercicios,volume:calcVol(exercicios)});
      Toast.show('Sessão registrada 💪');render();
    },'Salvar sessão');
  }
  function avulso(){
    const body=`
      <div class="fg"><label>Modalidade</label><div class="tre-modsel"><select class="field" id="av-mod">${DB.treinoModalidades.map(m=>`<option value="${m.key}">${m.label}</option>`).join('')}</select><button type="button" class="tre-addmod" id="av-newmod" title="Nova modalidade">${svg('plus',16)}</button></div></div>
      <div id="av-dyn"></div>
      <div class="fg"><label>Data</label><input class="field" id="av-data" type="date" value="${offset(0)}"></div>`;
    const back=Modal.open('Treino avulso',body,(b)=>{
      const mod=b.querySelector('#av-mod').value, data=b.querySelector('#av-data').value||offset(0), t=tipoDe(mod);
      const s={id:nid(),data,planoId:null,modalidade:mod,exercicios:[],volume:0};
      if(t==='distancia'){s.distancia=parseFloat(b.querySelector('#av-dist')?.value)||0;s.tempo=parseInt(b.querySelector('#av-tempo')?.value)||0;s.volume=Math.round(s.distancia*100);if(s.distancia<=0){Toast.show('Informe a distância','err');return false;}}
      else if(t==='forca'){s.volume=parseInt(b.querySelector('#av-vol')?.value)||0;}
      else{s.duracao=parseInt(b.querySelector('#av-dur')?.value)||0;s.intensidade=b.querySelector('#av-int')?.value||'media';s.volume=(s.duracao||0)*5;if(s.duracao<=0){Toast.show('Informe a duração','err');return false;}}
      DB.treinoSessoes.push(s);Toast.show('Treino registrado 💪');render();
    },'Registrar');
    const dyn=back.querySelector('#av-dyn');
    const paint=m=>{const t=tipoDe(m);
      if(t==='distancia')dyn.innerHTML=`<div class="frow"><div class="fg"><label>Distância (km)</label><input class="field" id="av-dist" type="number" min="0" step="0.1" placeholder="5"></div><div class="fg"><label>Tempo (min)</label><input class="field" id="av-tempo" type="number" min="0" placeholder="30"></div></div>`;
      else if(t==='forca')dyn.innerHTML=`<div class="fg"><label>Volume estimado (opcional)</label><input class="field" id="av-vol" type="number" min="0" placeholder="Ex: 9000"></div>`;
      else dyn.innerHTML=`<div class="frow"><div class="fg"><label>Duração (min)</label><input class="field" id="av-dur" type="number" min="0" placeholder="45"></div><div class="fg"><label>Intensidade</label><select class="field" id="av-int"><option value="leve">Leve</option><option value="media" selected>Média</option><option value="forte">Forte</option></select></div></div>`;
    };
    paint(back.querySelector('#av-mod').value);
    back.querySelector('#av-mod').onchange=e=>paint(e.target.value);
    back.querySelector('#av-newmod').onclick=()=>modalidadesForm(()=>{const sel=back.querySelector('#av-mod'),cur=sel.value;sel.innerHTML=DB.treinoModalidades.map(m=>`<option value="${m.key}">${m.label}</option>`).join('');sel.value=cur;paint(sel.value);});
  }
  function setDia(k){
    const opts=[['','— livre —'],...DB.treinoPlanos.map(p=>[p.id,p.nome])];
    const cur=DB.treinoAgenda[k]||'';
    Modal.open(`Agenda · ${DOWL[k]}`,`<div class="fg"><label>Plano deste dia</label><select class="field" id="ag-p">${opts.map(([v,l])=>`<option value="${v}"${String(cur)===String(v)?' selected':''}>${l}</option>`).join('')}</select></div>`,(b)=>{
      const v=b.querySelector('#ag-p').value;DB.treinoAgenda[k]=v?+v:null;Toast.show('Agenda atualizada');render();
    },'Salvar');
  }
  function planoForm(id){
    const p=id?plano(id):null;
    const cores=['#2D7FF9','#168A7C','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
    const curCor=p?p.cor:cores[0], curMod=p?p.modalidade:'musculacao';
    let exs=p?JSON.parse(JSON.stringify(p.exercicios||[])):[];
    const exRow=(e,i)=>`<div class="tre-exrow" data-exrow="${i}"><input class="field" style="flex:1" id="pe-n-${i}" value="${(e.nome||'').replace(/"/g,'&quot;')}" placeholder="Exercício">
      <input class="field tre-mini" id="pe-s-${i}" type="number" min="1" value="${e.series||3}" title="séries">
      <input class="field tre-mini" id="pe-r-${i}" type="number" min="1" value="${e.reps||10}" title="reps">
      <input class="field tre-mini" id="pe-c-${i}" type="number" min="0" step="0.5" value="${e.carga||0}" title="kg">
      <button type="button" class="icon-mini-btn" data-rmex="${i}">${svg('trash',14)}</button></div>`;
    const body=`
      <div class="frow"><div class="fg"><label>Nome</label><input class="field" id="pl-nome" value="${p?p.nome.replace(/"/g,'&quot;'):''}" placeholder="Plano A"></div>
      <div class="fg"><label>Modalidade</label><div class="tre-modsel"><select class="field" id="pl-mod">${DB.treinoModalidades.map(m=>`<option value="${m.key}"${m.key===curMod?' selected':''}>${m.label}</option>`).join('')}</select><button type="button" class="tre-addmod" id="pl-newmod" title="Nova modalidade">${svg('plus',16)}</button></div></div></div>
      <div class="fg"><label>Cor</label><div class="swatches" id="pl-cores">${cores.map(c=>`<button type="button" class="sw${c===curCor?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>
      <div id="pl-exbox"><label style="font-size:11.5px;font-weight:700;color:var(--text-3)">Exercícios (séries · reps · kg)</label><div id="pl-exs">${exs.map(exRow).join('')}</div>
        <button type="button" class="btn btn-soft sm" id="pl-addex" style="margin-top:8px">${svg('plus',14)} Exercício</button></div>`;
    const back=Modal.open(id?'Editar plano':'Novo plano',body,(b)=>{
      const nome=b.querySelector('#pl-nome').value.trim();
      const mod=b.querySelector('#pl-mod').value;
      const cor=(b.querySelector('#pl-cores .on')||{}).dataset?.cor||curCor;
      if(!nome){Toast.show('Informe o nome','err');return false;}
      const exercicios=tipoDe(mod)==='forca'?[...b.querySelectorAll('[data-exrow]')].map(row=>{const i=row.dataset.exrow;return {nome:b.querySelector(`#pe-n-${i}`).value.trim(),series:parseInt(b.querySelector(`#pe-s-${i}`).value)||3,reps:parseInt(b.querySelector(`#pe-r-${i}`).value)||10,carga:parseFloat(b.querySelector(`#pe-c-${i}`).value)||0};}).filter(e=>e.nome):[];
      if(p){Object.assign(p,{nome,modalidade:mod,cor,exercicios});Toast.show('Plano atualizado');}
      else{DB.treinoPlanos.push({id:nid(),nome,modalidade:mod,cor,exercicios});Toast.show('Plano criado');}
      render();
    },id?'Salvar':'Criar');
    back.querySelectorAll('[data-cor]').forEach(x=>x.onclick=()=>back.querySelectorAll('[data-cor]').forEach(y=>y.classList.toggle('on',y===x)));
    const exsBox=back.querySelector('#pl-exs');
    const toggleEx=()=>{back.querySelector('#pl-exbox').style.display=tipoDe(back.querySelector('#pl-mod').value)==='forca'?'':'none';};
    toggleEx();back.querySelector('#pl-mod').onchange=toggleEx;
    back.querySelector('#pl-newmod').onclick=()=>modalidadesForm(()=>{const sel=back.querySelector('#pl-mod'),cur=sel.value;sel.innerHTML=DB.treinoModalidades.map(m=>`<option value="${m.key}">${m.label}</option>`).join('');sel.value=cur;toggleEx();});
    const bindRm=()=>back.querySelectorAll('[data-rmex]').forEach(btn=>btn.onclick=()=>{btn.closest('[data-exrow]').remove();});
    bindRm();
    back.querySelector('#pl-addex').onclick=()=>{const i=Date.now();const div=document.createElement('div');div.innerHTML=exRow({},i);exsBox.appendChild(div.firstElementChild);bindRm();};
  }
  function delPlano(id){const p=plano(id);if(!p)return;Modal.confirm('Excluir plano?',`"${p.nome}" será removido (sessões antigas permanecem).`,()=>{DB.treinoPlanos=DB.treinoPlanos.filter(x=>x.id!==id);Object.keys(DB.treinoAgenda).forEach(k=>{if(DB.treinoAgenda[k]===id)DB.treinoAgenda[k]=null;});Toast.show('Plano excluído');render();});}
  function medicaoForm(id){
    const m=id?DB.treinoMedicoes.find(x=>x.id===id):null;
    const body=`
      <div class="frow"><div class="fg"><label>Peso (kg)</label><input class="field" id="me-peso" type="number" step="0.1" min="0" value="${m?m.peso:''}" placeholder="80"></div>
      <div class="fg"><label>Gordura (%) opc.</label><input class="field" id="me-gord" type="number" step="0.1" min="0" value="${m&&m.gordura?m.gordura:''}" placeholder="18"></div></div>
      <label style="font-size:11.5px;font-weight:700;color:var(--text-3)">Circunferências (cm)</label>
      <div class="tre-medgrid">${MEDIDAS.map(([k,l])=>`<div class="fg"><label>${l}</label><input class="field" id="me-${k}" type="number" step="0.1" min="0" value="${m&&m.medidas?.[k]!=null?m.medidas[k]:''}"></div>`).join('')}</div>
      <div class="fg"><label>Data</label><input class="field" id="me-data" type="date" value="${m?m.data:offset(0)}"></div>`;
    Modal.open(id?'Editar medição':'Registrar medição',body,(b)=>{
      const peso=parseFloat(b.querySelector('#me-peso').value);if(!(peso>0)){Toast.show('Informe o peso','err');return false;}
      const medidas={};MEDIDAS.forEach(([k])=>{const v=parseFloat(b.querySelector(`#me-${k}`).value);if(v>0)medidas[k]=v;});
      const data=b.querySelector('#me-data').value||offset(0), gordura=parseFloat(b.querySelector('#me-gord').value)||null;
      if(m){Object.assign(m,{data,peso,gordura,medidas});Toast.show('Medição atualizada 📏');}
      else{DB.treinoMedicoes.push({id:nid(),data,peso,gordura,medidas});Toast.show('Medição registrada 📏');}
      render();
    },id?'Salvar':'Registrar');
  }

  function modalidadesForm(onDone){
    const TIPOS=[['forca','Força','séries · reps · carga'],['distancia','Distância','km + tempo'],['duracao','Duração','min + intensidade']];
    const ICDEF={forca:'dumbbell',distancia:'run',duracao:'activity'};
    const cores=['#2D7FF9','#6C5CE7','#0FB9B1','#E1740B','#27B6A3','#00A8E8','#1F9D55','#7FB069','#DB4A4A','#E0568C','#C8860B','#9B59B6','#8E6E53','#8A867C'];
    const chips=()=>TIPOS.map(([t,tl,td])=>{
      const list=DB.treinoModalidades.filter(m=>m.tipo===t);
      return `<div class="tre-modgrp"><div class="tre-modgrp-h">${tl} <small>· ${td}</small></div><div class="tre-modchips">${list.map(m=>`<span class="tre-modchip" style="--c:${m.cor}">${svg(m.ic,13)}<span>${m.label}</span><button class="tmc-x" data-rmmod="${m.key}" title="Remover">${svg('x',12)}</button></span>`).join('')||'<span style="font-size:12px;color:var(--text-3)">—</span>'}</div></div>`;
    }).join('');
    const body=`<div id="mod-list">${chips()}</div>
      <div class="tre-modadd">
        <div class="card-h" style="margin:6px 0 2px"><h3 style="font-size:13px">Adicionar modalidade</h3></div>
        <div class="frow"><div class="fg"><label>Nome</label><input class="field" id="nm-nome" placeholder="Ex: Surf"></div>
          <div class="fg"><label>Tipo de registro</label><select class="field" id="nm-tipo">${TIPOS.map(([t,tl,td])=>`<option value="${t}">${tl} — ${td}</option>`).join('')}</select></div></div>
        <div class="fg"><label>Cor</label><div class="swatches" id="nm-cores">${cores.map((c,i)=>`<button type="button" class="sw${i===0?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>
        <button type="button" class="btn btn-primary sm" id="nm-add">${svg('plus',14)} Adicionar modalidade</button>
      </div>`;
    const back=Modal.open('Modalidades de treino',body,()=>{onDone?onDone():render();},'Concluído');
    const refresh=()=>{back.querySelector('#mod-list').innerHTML=chips();bindRm();};
    const bindRm=()=>back.querySelectorAll('[data-rmmod]').forEach(btn=>btn.onclick=()=>{
      const key=btn.dataset.rmmod;
      if(DB.treinoSessoes.some(s=>s.modalidade===key)){Toast.show('Há treinos nessa modalidade — não dá pra remover','err');return;}
      if(DB.treinoPlanos.some(p=>p.modalidade===key)){Toast.show('Há planos usando essa modalidade','err');return;}
      DB.treinoModalidades=DB.treinoModalidades.filter(m=>m.key!==key);Toast.show('Modalidade removida');refresh();
    });
    bindRm();
    back.querySelectorAll('#nm-cores [data-cor]').forEach(x=>x.onclick=()=>back.querySelectorAll('#nm-cores [data-cor]').forEach(y=>y.classList.toggle('on',y===x)));
    back.querySelector('#nm-add').onclick=()=>{
      const nome=back.querySelector('#nm-nome').value.trim();
      if(!nome){Toast.show('Informe o nome','err');return;}
      const tipo=back.querySelector('#nm-tipo').value;
      const cor=(back.querySelector('#nm-cores .on')||{}).dataset?.cor||cores[0];
      let key=nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
      if(!key)key='mod';
      if(DB.treinoModalidades.some(m=>m.key===key)){Toast.show('Já existe uma modalidade assim','err');return;}
      DB.treinoModalidades.push({key,label:nome,cor,ic:ICDEF[tipo],tipo});
      back.querySelector('#nm-nome').value='';Toast.show('Modalidade adicionada 🎉');refresh();
    };
  }

  return {render};
})();
