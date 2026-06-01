const Saude=(()=>{
  const TM={comprimido:{l:'Comprimido',e:'💊',c:'#2D7FF9'},capsula:{l:'Cápsula',e:'💊',c:'#168A7C'},gotas:{l:'Gotas',e:'💧',c:'#27B6A3'},liquido:{l:'Líquido',e:'🥤',c:'#C8860B'},injecao:{l:'Injeção',e:'💉',c:'#DB4A4A'},pomada:{l:'Pomada',e:'🧴',c:'#E0568C'},inalador:{l:'Inalador',e:'🫁',c:'#7B6CFF'},adesivo:{l:'Adesivo',e:'🩹',c:'#8A867C'}};
  const STL={ativo:'Ativo',pausado:'Pausado',encerrado:'Encerrado'};
  const UNI=['mg','ml','mcg','UI','gota(s)','comp.','%'];
  const WD=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  let navDia=offset(0);
  let aba='med';
  const MOODS={5:{e:'😄',l:'Ótimo',c:'#1F9D55'},4:{e:'🙂',l:'Bem',c:'#27B6A3'},3:{e:'😐',l:'Neutro',c:'#C8860B'},2:{e:'😟',l:'Mal',c:'#E0568C'},1:{e:'😣',l:'Péssimo',c:'#DB4A4A'}};
  const FATORES=['Sono bom','Sono ruim','Exercício','Estresse','Alimentação ok','Trabalho pesado','Social','Cansaço'];
  let navHum=offset(0);
  const humorDe=d=>DB.humor.find(h=>h.data===d);
  const hhmm=()=>{const n=new Date();return String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');};
  const reg=(mid,h,data)=>DB.tomadas.find(r=>r.medId===mid&&r.data===(data||offset(0))&&r.hora===h);
  const statusEf=m=>(m.status==='ativo'&&m.fim&&m.fim<offset(0))?'encerrado':m.status;
  const aplicaEm=(m,iso)=>{if(statusEf(m)!=='ativo')return false;if(m.inicio&&iso<m.inicio)return false;if(m.fim&&iso>m.fim)return false;if(m.freq==='sos')return false;if(m.freq==='dias')return (m.dias||[]).includes(new Date(iso+'T00:00:00').getDay());return true;};
  const freqDesc=m=>m.freq==='diario'?'Todos os dias':m.freq==='sos'?'Quando necessário':((m.dias||[]).map(d=>WD[d]).join(', ')||'Dias específicos');
  const qtdAt=(m,h)=>((m.horarios||[]).find(x=>x.hora===h)||{}).qtd||1;
  const perDay=m=>m.freq==='sos'?0:(m.horarios||[]).reduce((s,ho)=>s+(ho.qtd||1),0);
  const diasRest=m=>{const p=perDay(m);return p>0?Math.floor(m.estoque/p):null;};
  const fmtNav=s=>{const d=diasAte(s);if(d===0)return 'Hoje';if(d===-1)return 'Ontem';if(d===1)return 'Amanhã';const dt=new Date(s+'T00:00:00');return `${WD[dt.getDay()]}, ${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}`;};
  function tomar(mid,h){const m=DB.medicamentos.find(x=>x.id===mid);const q=qtdAt(m,h);const r=reg(mid,h);const now=hhmm();if(r&&r.status==='tomado'){DB.tomadas=DB.tomadas.filter(x=>x!==r);m.estoque+=q;}else if(r){r.status='tomado';r.tomadoEm=now;m.estoque-=q;}else{DB.tomadas.push({medId:mid,data:offset(0),hora:h,status:'tomado',tomadoEm:now});m.estoque-=q;}m.estoque=Math.max(0,m.estoque);if(!(r&&r.status==='tomado'))Toast.show('Tomado às '+now);render();}
  function pular(mid,h){const m=DB.medicamentos.find(x=>x.id===mid);const q=qtdAt(m,h);const r=reg(mid,h);if(r&&r.status==='pulado'){DB.tomadas=DB.tomadas.filter(x=>x!==r);}else if(r){if(r.status==='tomado')m.estoque+=q;r.status='pulado';r.tomadoEm='';}else{DB.tomadas.push({medId:mid,data:offset(0),hora:h,status:'pulado',tomadoEm:''});Toast.show('Dose pulada');}render();}
  function sosTomar(mid){const now=hhmm();DB.tomadas.push({medId:mid,data:offset(0),hora:now,status:'tomado',tomadoEm:now});Toast.show('Dose registrada às '+now);render();}
  function ajustar(mid,h){const r=reg(mid,h);if(!r)return;Modal.open('Ajustar horário',`<div class="fg"><label>Horário em que tomou</label><input class="field" id="aj-h" type="time" value="${r.tomadoEm||hhmm()}"></div>`,(b)=>{const v=b.querySelector('#aj-h').value;if(v){r.tomadoEm=v;Toast.show('Horário ajustado');render();}},'Salvar');}
  function pausar(id){const m=DB.medicamentos.find(x=>x.id===id);if(!m)return;if(statusEf(m)==='ativo'){m.status='pausado';Toast.show('Medicamento pausado');}else{m.status='ativo';if(m.fim&&m.fim<offset(0))m.fim=null;Toast.show('Medicamento retomado');}render();}
  function renderMed(){
    const root=document.getElementById('saude-sub');if(!root)return;
    const nowS=hhmm();
    const doses=[];DB.medicamentos.forEach(m=>{if(!aplicaEm(m,offset(0)))return;m.horarios.forEach(ho=>{const r=reg(m.id,ho.hora);doses.push({m,h:ho.hora,qtd:ho.qtd,st:r?r.status:'pendente',tomadoEm:r?r.tomadoEm:''});});});
    doses.sort((a,b)=>a.h<b.h?-1:1);
    const esper=doses.length,tomou=doses.filter(d=>d.st==='tomado').length;
    const ades=esper?Math.round(tomou/esper*100):100;
    let esp7=0,tom7=0;for(let i=6;i>=0;i--){const d=offset(-i);DB.medicamentos.forEach(m=>{if(!aplicaEm(m,d))return;m.horarios.forEach(ho=>{esp7++;const r=reg(m.id,ho.hora,d);if(r&&r.status==='tomado')tom7++;});});}
    const ades7=esp7?Math.round(tom7/esp7*100):100;
    const prox=doses.filter(d=>d.st==='pendente'&&d.h>=nowS)[0]||doses.filter(d=>d.st==='pendente')[0];
    // histórico do dia navegado
    const previstas=[];DB.medicamentos.forEach(m=>{if(!aplicaEm(m,navDia))return;m.horarios.forEach(ho=>{const r=reg(m.id,ho.hora,navDia);previstas.push({m,hora:ho.hora,qtd:ho.qtd,status:r?r.status:'naoreg',tomadoEm:r?r.tomadoEm:''});});});
    const prevKeys=new Set(previstas.map(p=>p.m.id+'|'+p.hora));
    const avulsas=DB.tomadas.filter(r=>r.data===navDia&&!prevKeys.has(r.medId+'|'+r.hora)).map(r=>{const m=DB.medicamentos.find(x=>x.id===r.medId)||{nome:'(removido)',tipo:'comprimido'};return {m,hora:r.hora,qtd:null,status:r.status,tomadoEm:r.tomadoEm,avulsa:true};});
    const lista=[...previstas,...avulsas].sort((a,b)=>a.hora<b.hora?-1:1);
    const tomDia=lista.filter(x=>x.status==='tomado').length;
    const meds=[...DB.medicamentos].sort((a,b)=>(statusEf(a)==='ativo'?0:1)-(statusEf(b)==='ativo'?0:1));
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('heart',14)}</span>Adesão de hoje</div><div class="kv" style="color:var(--brand-text)">${ades}%</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('trendup',14)}</span>Adesão · 7 dias</div><div class="kv" style="color:var(--income)">${ades7}%</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('clock',14)}</span>Próxima dose</div><div class="kv" style="font-size:17px">${prox?`${prox.h} · ${prox.m.nome}`:'Tudo certo ✓'}</div></div>
      </div>
      <div class="toolbar"><div style="flex:1;font-size:13px;color:var(--text-3);font-weight:600">${tomou}/${esper} doses de hoje</div><button class="btn btn-primary" data-add>${svg('plus',16)} Novo medicamento</button></div>
      <div class="bento">
        <div class="card col-7">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('clock',17)}</div><h3>Doses de hoje</h3></div>
          ${doses.length?doses.map(d=>{const t=TM[d.m.tipo];const atras=d.st==='pendente'&&d.h<nowS;return `<div class="dose-row ${d.st} ${atras?'atrasada':''}">
            <div class="dose-time">${d.h}</div>
            <div class="med-ic" style="background:${t.c}22">${t.e}</div>
            <div class="dose-main">
              <div class="dt-line"><span class="dt">${d.m.nome}</span>${d.st==='tomado'?`<button class="taken" data-adj="${d.m.id}|${d.h}" title="Ajustar horário">✓ ${d.tomadoEm||d.h}</button>`:(atras?`<span class="late-badge">atrasada</span>`:'')}</div>
              <div class="dss">${d.qtd>1?`<b>${d.qtd}×</b> `:''}${d.m.dose} ${d.m.unidade} · ${t.l}${d.m.obs?` · ${d.m.obs}`:''}</div>
            </div>
            <div class="dose-acts"><button class="dbtn take" data-tomar="${d.m.id}|${d.h}">${d.st==='tomado'?'✓ Tomado':'Tomar'}</button><button class="dbtn skip" data-pular="${d.m.id}|${d.h}">${d.st==='pulado'?'Pulado':'Pular'}</button></div>
          </div>`;}).join(''):`<div class="empty" style="padding:var(--s-6) 0"><div class="eico">${svg('tick',24)}</div><h4>Nenhuma dose programada hoje</h4><p>Adicione um medicamento ou aproveite o dia 😊</p></div>`}
        </div>
        <div class="card col-5">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('box',17)}</div><h3>Meus medicamentos</h3></div>
          ${meds.length?meds.map(m=>{const t=TM[m.tipo];const ef=statusEf(m);const dr=diasRest(m);const baixo=ef==='ativo'&&((m.estoqueMin&&m.estoque<=m.estoqueMin)||(dr!=null&&dr<=7));const horStr=m.freq==='sos'?'Quando necessário':m.horarios.map(ho=>`${ho.hora}${ho.qtd>1?` (${ho.qtd})`:''}`).join(' · ');return `<div class="med-card ${ef!=='ativo'?'off':''}">
            <div class="med-ic" style="background:${t.c}22">${t.e}</div>
            <div class="mc-main">
              <div class="mc-t">${m.nome} <span style="color:var(--text-3);font-weight:500">${m.dose} ${m.unidade}</span> <span class="badge-st st-${ef}">${STL[ef]}</span></div>
              <div class="mc-s">${t.l} · ${horStr}</div>
              ${m.fim?`<div class="mc-s" style="display:flex;align-items:center;gap:5px;margin-top:3px">${svg('calendar',11)} Tratamento até ${fmtNav(m.fim)}</div>`:''}
              <div class="mc-s ${baixo?'estoque-warn':''}" style="margin-top:5px;display:flex;align-items:center;gap:5px">${baixo?svg('alert',11):''}Estoque: ${m.estoque}${dr!=null&&ef==='ativo'?` · ~${dr}d`:''}${baixo?' · repor':''}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
              ${m.freq==='sos'&&ef==='ativo'?`<button class="dbtn take" data-sos="${m.id}">Tomei</button>`:''}
              <div style="display:flex;gap:3px">
                <button class="icon-mini-btn" data-pause="${m.id}" title="${ef==='ativo'?'Pausar':'Retomar'}">${svg(ef==='ativo'?'pause':'play',15)}</button>
                <button class="icon-mini-btn" data-edit="${m.id}">${svg('pencil',15)}</button>
                <button class="icon-mini-btn" data-del="${m.id}">${svg('trash',15)}</button>
              </div>
            </div>
          </div>`;}).join(''):`<div class="empty" style="padding:var(--s-6) 0"><p>Nenhum medicamento cadastrado.</p></div>`}
        </div>
        <div class="card col-12">
          <div class="card-head"><div class="ico" style="background:var(--surface-3);color:var(--text-2)">${svg('repeat',17)}</div><h3>Histórico de doses</h3></div>
          <div class="hist-nav"><button class="icon-btn" data-hprev title="Dia anterior">${svg('chevleft',18)}</button><div class="hl">${fmtNav(navDia)}<div class="hsum">${tomDia} de ${previstas.length} doses tomadas</div></div><button class="icon-btn" data-hnext title="Próximo dia">${svg('chevright',18)}</button></div>
          ${lista.length?lista.map(it=>{const t=TM[it.m.tipo]||TM.comprimido;const bcls=it.status==='tomado'?'st-paga':it.status==='pulado'?'st-vencida':'st-encerrado';const blbl=it.status==='tomado'?`Tomado${it.tomadoEm?' às '+it.tomadoEm:''}`:it.status==='pulado'?'Pulado':'Não registrada';return `<div class="dose-row"><div class="dose-time">${it.hora}</div><div class="med-ic" style="background:${t.c}22;width:32px;height:32px;font-size:15px">${t.e}</div><div class="dose-main"><div class="dt">${it.m.nome}${it.qtd&&it.qtd>1?` <span style="color:var(--text-3);font-weight:500">${it.qtd}×</span>`:''}</div><div class="dss">${it.avulsa?'Avulsa':t.l}</div></div><span class="badge-st ${bcls}">${blbl}</span></div>`;}).join(''):`<div class="empty" style="padding:var(--s-5) 0"><p>Nada programado nem registrado neste dia.</p></div>`}
        </div>
      </div>`;
    bind(root);
  }
  function bind(root){
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-tomar]').forEach(b=>b.onclick=()=>{const p=b.dataset.tomar.split('|');tomar(+p[0],p[1]);});
    root.querySelectorAll('[data-pular]').forEach(b=>b.onclick=()=>{const p=b.dataset.pular.split('|');pular(+p[0],p[1]);});
    root.querySelectorAll('[data-adj]').forEach(b=>b.onclick=()=>{const p=b.dataset.adj.split('|');ajustar(+p[0],p[1]);});
    root.querySelectorAll('[data-sos]').forEach(b=>b.onclick=()=>sosTomar(+b.dataset.sos));
    root.querySelectorAll('[data-pause]').forEach(b=>b.onclick=()=>pausar(+b.dataset.pause));
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
    root.querySelector('[data-hprev]').onclick=()=>{navDia=addMonths(navDia,0);const d=new Date(navDia+'T00:00:00');d.setDate(d.getDate()-1);navDia=d.toISOString().slice(0,10);render();};
    root.querySelector('[data-hnext]').onclick=()=>{const d=new Date(navDia+'T00:00:00');d.setDate(d.getDate()+1);navDia=d.toISOString().slice(0,10);render();};
  }
  function del(id){const m=DB.medicamentos.find(x=>x.id===id);if(!m)return;Modal.confirm('Excluir medicamento?',`"${m.nome}" e seu histórico serão removidos.`,()=>{DB.medicamentos=DB.medicamentos.filter(x=>x.id!==id);DB.tomadas=DB.tomadas.filter(r=>r.medId!==id);Toast.show('Medicamento excluído');render();});}
  function form(id){
    const m=id?DB.medicamentos.find(x=>x.id===id):null;
    const body=`
      <div class="fg"><label>Nome do medicamento</label><input class="field" id="s-nome" value="${m?m.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Losartana"></div>
      <div class="frow">
        <div class="fg"><label>Tipo</label><select class="field" id="s-tipo">${Object.keys(TM).map(k=>`<option value="${k}"${(m?m.tipo:'comprimido')===k?' selected':''}>${TM[k].e} ${TM[k].l}</option>`).join('')}</select></div>
        <div class="fg"><label>Status</label><select class="field" id="s-status">${['ativo','pausado','encerrado'].map(s=>`<option value="${s}"${(m?m.status:'ativo')===s?' selected':''}>${STL[s]}</option>`).join('')}</select></div>
      </div>
      <div class="fg"><label>Dose</label><div style="display:flex;gap:6px"><input class="field" id="s-dose" type="number" step="any" min="0" value="${m?m.dose:''}" placeholder="50" style="flex:1;min-width:0"><select class="field" id="s-uni" style="max-width:88px">${UNI.map(u=>`<option${m&&m.unidade===u?' selected':''}>${u}</option>`).join('')}</select></div></div>
      <div class="fg"><label>Frequência</label><select class="field" id="s-freq"><option value="diario"${(m?m.freq:'diario')==='diario'?' selected':''}>Todos os dias</option><option value="dias"${m&&m.freq==='dias'?' selected':''}>Dias específicos</option><option value="sos"${m&&m.freq==='sos'?' selected':''}>Quando necessário</option></select></div>
      <div class="fg" id="s-diasbox" style="display:none"><label>Dias da semana</label><div class="wday" id="s-dias">${WD.map((d,i)=>`<button type="button" data-d="${i}"${m&&m.dias&&m.dias.includes(i)?' class="on"':''}>${d}</button>`).join('')}</div></div>
      <div class="fg" id="s-horbox"><label>Horários e quantidade</label><div id="s-horarios"></div><button type="button" class="btn btn-soft" id="s-addhora" style="margin-top:8px;align-self:flex-start">${svg('plus',14)} Adicionar horário</button></div>
      <div class="fg"><label>Observação (opcional)</label><input class="field" id="s-obs" value="${m&&m.obs?m.obs.replace(/"/g,'&quot;'):''}" placeholder="Ex: Tomar em jejum"></div>
      <div class="frow">
        <div class="fg"><label>Estoque atual</label><input class="field" id="s-est" type="number" min="0" value="${m?m.estoque:''}" placeholder="30"></div>
        <div class="fg"><label>Avisar quando ≤</label><input class="field" id="s-min" type="number" min="0" value="${m?m.estoqueMin:5}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Início do tratamento</label><input class="field" id="s-ini" type="date" value="${m&&m.inicio?m.inicio:''}"></div>
        <div class="fg"><label>Fim (opcional)</label><input class="field" id="s-fim" type="date" value="${m&&m.fim?m.fim:''}"></div>
      </div>`;
    const back=Modal.open(id?'Editar medicamento':'Novo medicamento',body,(b)=>{
      const nome=b.querySelector('#s-nome').value.trim();
      if(!nome){Toast.show('Informe o nome','err');return false;}
      const freq=b.querySelector('#s-freq').value;
      const horarios=freq==='sos'?[]:[...b.querySelectorAll('.hrow')].map(r=>({hora:r.querySelector('[type=time]').value,qtd:parseFloat(r.querySelector('[type=number]').value)||1})).filter(h=>h.hora).sort((a,b)=>a.hora<b.hora?-1:1);
      if(freq!=='sos'&&!horarios.length){Toast.show('Adicione ao menos um horário','err');return false;}
      const dd={nome,tipo:b.querySelector('#s-tipo').value,status:b.querySelector('#s-status').value,dose:parseFloat(b.querySelector('#s-dose').value)||0,unidade:b.querySelector('#s-uni').value,freq,dias:[...b.querySelectorAll('#s-dias .on')].map(x=>+x.dataset.d),horarios,obs:b.querySelector('#s-obs').value.trim(),estoque:parseInt(b.querySelector('#s-est').value)||0,estoqueMin:parseInt(b.querySelector('#s-min').value)||0,inicio:b.querySelector('#s-ini').value||null,fim:b.querySelector('#s-fim').value||null};
      if(m){Object.assign(m,dd);Toast.show('Medicamento atualizado');}
      else{DB.medicamentos.push(Object.assign({id:nid()},dd));Toast.show('Medicamento adicionado');}
      render();
    },id?'Salvar':'Adicionar');
    const freqSel=back.querySelector('#s-freq'),diasBox=back.querySelector('#s-diasbox'),horBox=back.querySelector('#s-horbox'),horWrap=back.querySelector('#s-horarios');
    const addHora=(hr,q)=>{const row=document.createElement('div');row.className='hrow';row.style.cssText='display:flex;gap:8px;margin-bottom:6px;align-items:center';row.innerHTML=`<input class="field" type="time" style="flex:1" value="${hr||'08:00'}"><div style="display:flex;align-items:center;gap:5px"><input class="field" type="number" min="1" step="any" style="width:62px" value="${q||1}"><span style="font-size:11px;color:var(--text-3);font-weight:600">un.</span></div><button type="button" class="icon-mini-btn" data-rm>${svg('x',14)}</button>`;row.querySelector('[data-rm]').onclick=()=>row.remove();horWrap.appendChild(row);};
    const syncFreq=()=>{const f=freqSel.value;diasBox.style.display=f==='dias'?'':'none';horBox.style.display=f==='sos'?'none':'';};
    freqSel.onchange=syncFreq;syncFreq();
    (m&&m.horarios&&m.horarios.length?m.horarios:[{hora:'08:00',qtd:1}]).forEach(ho=>addHora(ho.hora,ho.qtd));
    back.querySelector('#s-addhora').onclick=()=>addHora();
    back.querySelectorAll('#s-dias button').forEach(b=>b.onclick=()=>b.classList.toggle('on'));
  }
  function render(){
    const root=document.getElementById('saude-root');if(!root)return;
    root.innerHTML=`<div class="sub-tabs">
      <button data-aba="med" class="${aba==='med'?'on':''}">${svg('heart',15)} Medicamentos</button>
      <button data-aba="humor" class="${aba==='humor'?'on':''}">${svg('smile',15)} Humor</button>
      <button data-aba="medicos" class="${aba==='medicos'?'on':''}">${svg('users',15)} Médicos</button>
    </div><div id="saude-sub"></div>`;
    root.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>{aba=b.dataset.aba;render();});
    if(aba==='humor')renderHumor();else if(aba==='medicos')renderMedicos();else renderMed();
  }
  function renderHumor(){
    const root=document.getElementById('saude-sub');if(!root)return;
    const hojeH=humorDe(offset(0));
    const last14=DB.humor.filter(h=>diasAte(h.data)>=-13&&diasAte(h.data)<=0);
    const avg=last14.length?Math.round(last14.reduce((s,h)=>s+h.mood,0)/last14.length):0;
    let streak=0;for(let i=0;;i++){if(humorDe(offset(-i)))streak++;else break;}
    const cur=humorDe(navHum);
    const faixa=[];for(let i=13;i>=0;i--){const d=offset(-i);faixa.push({d,h:humorDe(d)});}
    const lineData=faixa.filter(f=>f.h).map(f=>f.h.mood);
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('smile',14)}</span>Humor de hoje</div><div class="kv" style="font-size:22px">${hojeH?MOODS[hojeH.mood].e+' '+MOODS[hojeH.mood].l:'—'}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('trendup',14)}</span>Média · 14 dias</div><div class="kv" style="font-size:22px">${avg?MOODS[avg].e+' '+MOODS[avg].l:'—'}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('flame',14)}</span>Sequência</div><div class="kv">${streak} ${streak===1?'dia':'dias'}</div></div>
      </div>
      <div class="bento">
        <div class="card col-7">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('smile',17)}</div><h3>Como você está? · ${fmtNav(navHum)}</h3></div>
          <div class="mood-big">${[5,4,3,2,1].map(v=>`<button data-mood="${v}" class="${cur&&cur.mood===v?'on':''}" style="color:${MOODS[v].c}">${MOODS[v].e}<span class="ml">${MOODS[v].l}</span></button>`).join('')}</div>
          <div class="fg"><label>Fatores do dia</label><div class="fatores" id="hum-fat">${FATORES.map(f=>`<button type="button" class="fator ${cur&&cur.fatores&&cur.fatores.includes(f)?'on':''}" data-fat="${f}">${f}</button>`).join('')}</div></div>
          <div class="fg" style="margin-top:var(--s-4)"><label>Anotação do dia</label><input class="field" id="hum-nota" value="${cur&&cur.nota?cur.nota.replace(/"/g,'&quot;'):''}" placeholder="Como foi o dia?"></div>
          <div style="display:flex;gap:10px;align-items:center;margin-top:var(--s-4)">
            <button class="btn btn-primary" id="hum-save">${svg('tick',15)} Salvar registro</button>
            <div class="hist-nav" style="margin:0;flex:1"><button class="icon-btn" data-hprev>${svg('chevleft',18)}</button><div class="hl">${fmtNav(navHum)}</div><button class="icon-btn" data-hnext>${svg('chevright',18)}</button></div>
          </div>
        </div>
        <div class="card col-5">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('chart',17)}</div><h3>Últimos 14 dias</h3></div>
          <div class="faixa">${faixa.map(f=>`<div class="fd ${f.d===navHum?'sel':''}" data-fday="${f.d}"><div class="fb" style="${f.h?`background:${MOODS[f.h.mood].c}`:''}"></div><div class="fl">${new Date(f.d+'T00:00:00').getDate()}</div></div>`).join('')}</div>
          ${lineData.length>1?`<div style="margin-top:var(--s-5)"><div class="eyebrow" style="margin-bottom:8px">Tendência do humor</div>${Charts.line(lineData,110)}</div>`:''}
          <div style="margin-top:var(--s-5)">${[5,4,3,2,1].map(v=>{const c=last14.filter(h=>h.mood===v).length;const pct=last14.length?Math.round(c/last14.length*100):0;return `<div class="goal" style="margin-bottom:9px"><div class="goal-top"><span class="goal-name" style="font-size:12px">${MOODS[v].e} ${MOODS[v].l}</span><span class="goal-val mono">${c}</span></div><div class="bar"><i style="width:${pct}%;background:${MOODS[v].c}"></i></div></div>`;}).join('')}</div>
        </div>
      </div>`;
    let pendMood=cur?cur.mood:null;
    root.querySelectorAll('[data-mood]').forEach(b=>b.onclick=()=>{pendMood=+b.dataset.mood;root.querySelectorAll('[data-mood]').forEach(x=>x.classList.toggle('on',x===b));});
    root.querySelectorAll('[data-fat]').forEach(b=>b.onclick=()=>b.classList.toggle('on'));
    root.querySelector('#hum-save').onclick=()=>{
      if(!pendMood){Toast.show('Escolha como você está','err');return;}
      const fatores=[...root.querySelectorAll('#hum-fat .on')].map(x=>x.dataset.fat);
      const nota=root.querySelector('#hum-nota').value.trim();
      const ex=humorDe(navHum);
      if(ex){ex.mood=pendMood;ex.fatores=fatores;ex.nota=nota;}else{DB.humor.push({data:navHum,mood:pendMood,fatores,nota});}
      Toast.show('Humor registrado');render();
    };
    root.querySelector('[data-hprev]').onclick=()=>{const d=new Date(navHum+'T00:00:00');d.setDate(d.getDate()-1);navHum=d.toISOString().slice(0,10);render();};
    root.querySelector('[data-hnext]').onclick=()=>{const d=new Date(navHum+'T00:00:00');d.setDate(d.getDate()+1);navHum=d.toISOString().slice(0,10);render();};
    root.querySelectorAll('[data-fday]').forEach(b=>b.onclick=()=>{navHum=b.dataset.fday;render();});
  }
  function renderMedicos(){
    const root=document.getElementById('saude-sub');if(!root)return;
    const prox=DB.eventos.filter(e=>e.tipo==='saude'&&diasAte(e.data)>=0).sort((a,b)=>a.data<b.data?-1:1)[0];
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('users',14)}</span>Médicos</div><div class="kv">${DB.medicos.length}</div></div>
        <div class="kpi" style="grid-column:span 2"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('calendar',14)}</span>Próxima consulta</div><div class="kv" style="font-size:16px">${prox?`${prox.titulo} · ${fmtNav(prox.data)}${prox.hora?' '+prox.hora:''}`:'Nenhuma agendada'}</div></div>
      </div>
      <div class="toolbar"><div style="flex:1;font-size:13px;color:var(--text-3);font-weight:600">${DB.medicos.length} médicos</div><button class="btn btn-primary" data-add>${svg('plus',16)} Novo médico</button></div>
      <div class="card">
        ${DB.medicos.length?DB.medicos.map(d=>{
          const ini=d.nome.replace(/^(Dr|Dra)\.?\s*/i,'').trim().charAt(0).toUpperCase();
          const tel=(d.telefone||'').replace(/\D/g,'');
          const cons=(d.consultas||[]).slice().sort((a,b)=>b.data.localeCompare(a.data));
          const ultima=cons[0];
          return `<div class="med-doc" style="flex-direction:column;align-items:stretch">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="dav">${ini||'M'}</div>
              <div class="mc-main" style="flex:1;min-width:0">
                <div class="mc-t">${d.nome}</div>
                <div class="mc-s">${d.especialidade||''}${d.clinica?` · ${d.clinica}`:''}</div>
                <div class="med-doc-meta">
                  ${d.plano?`<span>${svg('card',11)} ${d.plano}</span>`:''}
                  ${ultima?`<span>${svg('calendar',11)} Última: ${fmtNav(ultima.data)}</span>`:'<span style="color:var(--text-4)">Sem consultas</span>'}
                </div>
              </div>
              <div style="display:flex;gap:5px;align-self:flex-start">
                ${tel?`<a class="docbtn wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener" title="WhatsApp">${svg('chat',16)}</a><a class="docbtn" href="tel:+55${tel}" title="Ligar">${svg('phone',16)}</a>`:''}
                <button class="docbtn" data-edit="${d.id}" title="Editar">${svg('pencil',15)}</button>
                <button class="docbtn" data-del="${d.id}" title="Excluir">${svg('trash',15)}</button>
              </div>
            </div>
            <div class="med-doc-acts">
              <button class="btn btn-soft" style="font-size:12px;padding:6px 12px" data-nova-cons="${d.id}">${svg('plus',13)} Nova consulta</button>
              <button class="btn btn-soft" style="font-size:12px;padding:6px 12px" data-agendar="${d.id}">${svg('calendar',13)} Agendar consulta</button>
              ${cons.length?`<button class="btn btn-ghost" style="font-size:12px;padding:6px 12px" data-toggle-cons="${d.id}">${svg('activity',13)} ${cons.length} consulta${cons.length>1?'s':''} ▾</button>`:''}
            </div>
            ${cons.length?`<div class="cons-list" id="cons-${d.id}">${cons.map(c=>`<div class="cons-row"><span class="cons-date">${fmtNav(c.data)}</span><span class="cons-obs">${c.obs||'Sem observações'}</span><button class="docbtn" style="width:26px;height:26px" data-del-cons="${d.id}|${c.data}" title="Remover">${svg('x',12)}</button></div>`).join('')}</div>`:''}
          </div>`;
        }).join(''):`<div class="empty" style="padding:var(--s-6) 0"><div class="eico">${svg('users',24)}</div><h4>Nenhum médico cadastrado</h4><p>Adicione seus médicos para acesso rápido.</p></div>`}
      </div>`;
    root.querySelector('[data-add]').onclick=()=>formDoc();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>formDoc(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const id=+b.dataset.del;const d=DB.medicos.find(x=>x.id===id);Modal.confirm('Excluir médico?',`"${d.nome}" será removido.`,()=>{DB.medicos=DB.medicos.filter(x=>x.id!==id);Toast.show('Médico excluído');render();});});
    root.querySelectorAll('[data-nova-cons]').forEach(b=>b.onclick=()=>formCons(+b.dataset.novaCons));
    root.querySelectorAll('[data-agendar]').forEach(b=>b.onclick=()=>{
      const d=DB.medicos.find(x=>x.id===+b.dataset.agendar);if(!d)return;
      Modal.open('Agendar consulta',`<div class="fg"><label>Data</label><input class="field" id="ag-data" type="date" value="${offset(7)}"></div><div class="fg"><label>Horário</label><input class="field" id="ag-hora" type="time" value="09:00"></div><div class="fg"><label>Observação (opcional)</label><input class="field" id="ag-obs" placeholder="Ex: levar exames"></div>`,(b2)=>{
        const data=b2.querySelector('#ag-data').value;if(!data){Toast.show('Informe a data','err');return false;}
        DB.eventos.push({id:nid(),titulo:`Consulta — ${d.nome}`,data,hora:b2.querySelector('#ag-hora').value,tipo:'saude',obs:b2.querySelector('#ag-obs').value.trim()});
        Toast.show('Consulta agendada');
      },'Agendar');
    });
    root.querySelectorAll('[data-toggle-cons]').forEach(b=>b.onclick=()=>{const el=document.getElementById('cons-'+b.dataset.toggleCons);if(el){el.classList.toggle('open');b.textContent=el.classList.contains('open')?'▴ Fechar consultas':'▾ '+((DB.medicos.find(x=>x.id===+b.dataset.toggleCons)||{}).consultas||[]).length+' consulta(s)';}});
    root.querySelectorAll('[data-del-cons]').forEach(b=>b.onclick=()=>{const[mid,data]=b.dataset.delCons.split('|');const d=DB.medicos.find(x=>x.id===+mid);if(d){d.consultas=d.consultas.filter(c=>c.data!==data);Toast.show('Consulta removida');render();}});
  }
  function formCons(medId){
    const d=DB.medicos.find(x=>x.id===medId);if(!d)return;
    if(!d.consultas)d.consultas=[];
    Modal.open(`Nova consulta — ${d.nome}`,`<div class="fg"><label>Data da consulta</label><input class="field" id="c-data" type="date" value="${offset(0)}"></div><div class="fg"><label>Observações</label><textarea class="field" id="c-obs" rows="3" placeholder="Ex: Pediu exame de sangue, pressão ok..."style="resize:vertical"></textarea></div>`,(b)=>{
      const data=b.querySelector('#c-data').value;if(!data){Toast.show('Informe a data','err');return false;}
      d.consultas.push({data,obs:b.querySelector('#c-obs').value.trim()});
      Toast.show('Consulta registrada');render();
    },'Salvar');
  }
  function formDoc(id){
    const d=id?DB.medicos.find(x=>x.id===id):null;
    const body=`
      <div class="fg"><label>Nome</label><input class="field" id="d-nome" value="${d?d.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Dr. João Pereira"></div>
      <div class="frow"><div class="fg"><label>Especialidade</label><input class="field" id="d-esp" value="${d&&d.especialidade?d.especialidade.replace(/"/g,'&quot;'):''}" placeholder="Cardiologista"></div><div class="fg"><label>Telefone / WhatsApp</label><input class="field" id="d-tel" value="${d&&d.telefone?d.telefone:''}" placeholder="(31) 98888-7777"></div></div>
      <div class="frow"><div class="fg"><label>Clínica / Local</label><input class="field" id="d-cli" value="${d&&d.clinica?d.clinica.replace(/"/g,'&quot;'):''}" placeholder="Clínica Vida"></div><div class="fg"><label>Plano de saúde</label><input class="field" id="d-plano" value="${d&&d.plano?d.plano.replace(/"/g,'&quot;'):''}" placeholder="Unimed, Particular…"></div></div>
      <div class="fg"><label>Anotações</label><input class="field" id="d-obs" value="${d&&d.obs?d.obs.replace(/"/g,'&quot;'):''}" placeholder="Ex: pediu exame de sangue"></div>`;
    Modal.open(id?'Editar médico':'Novo médico',body,(b)=>{
      const nome=b.querySelector('#d-nome').value.trim();
      if(!nome){Toast.show('Informe o nome','err');return false;}
      const dd={nome,especialidade:b.querySelector('#d-esp').value.trim(),telefone:b.querySelector('#d-tel').value.trim(),clinica:b.querySelector('#d-cli').value.trim(),plano:b.querySelector('#d-plano').value.trim(),obs:b.querySelector('#d-obs').value.trim()};
      if(d){Object.assign(d,dd);Toast.show('Médico atualizado');}else{DB.medicos.push(Object.assign({id:nid(),consultas:[]},dd));Toast.show('Médico adicionado');}
      render();
    },id?'Salvar':'Adicionar');
  }
  return {render};
})();

// seed histórico de doses (mock)
(function(){const M=DB.medicamentos;[[0,-1,'08:00','tomado','08:12'],[0,-2,'08:00','tomado','08:05'],[1,-1,'08:00','tomado','08:20'],[1,-1,'20:00','pulado',''],[2,-1,'21:00','tomado','21:30'],[1,-2,'08:00','tomado','08:10'],[3,-1,'07:00','tomado','07:05'],[3,-1,'19:00','tomado','19:15'],[4,-1,'08:00','tomado','08:30'],[4,-1,'14:00','tomado','14:10']].forEach(a=>{if(M[a[0]])DB.tomadas.push({medId:M[a[0]].id,data:offset(a[1]),hora:a[2],status:a[3],tomadoEm:a[4]});});})();

const Habitos=(()=>{
  const cumprido=(h,d)=>{const v=h.registros[d]||0;return h.tipo==='quantidade'?v>=h.meta:v>=1;};
  const valor=(h,d)=>h.registros[d]||0;
  function streak(h){let s=0;for(let i=0;;i++){const d=offset(-i);if(cumprido(h,d))s++;else if(i===0)continue;else break;}return s;}
  function recorde(h){let best=0,run=0;for(let i=120;i>=0;i--){if(cumprido(h,offset(-i))){run++;best=Math.max(best,run);}else run=0;}return best;}
  function semana(h){let c=0;for(let i=0;i<7;i++)if(cumprido(h,offset(-i)))c++;return c;}
  function toggle(id){const h=DB.habitos.find(x=>x.id===id);const d=offset(0);h.registros[d]=h.registros[d]?0:1;Toast.show(h.registros[d]?'Feito! 🔥':'Desmarcado');render();}
  function qty(id,delta){const h=DB.habitos.find(x=>x.id===id);const d=offset(0);h.registros[d]=Math.max(0,(h.registros[d]||0)+delta);render();}
  function cardHTML(h){
    const st=streak(h),rec=recorde(h),sem=semana(h),hoje=offset(0);
    const done=cumprido(h,hoje),v=valor(h,hoje);
    let heat='';for(let i=34;i>=0;i--){const d=offset(-i);const dv=valor(h,d);let bg='var(--surface-3)';if(cumprido(h,d))bg=h.cor;else if(dv>0)bg=h.cor+'66';heat+=`<span style="background:${bg}" title="${d}"></span>`;}
    return `<div class="card" style="padding:var(--s-5)">
      <div style="display:flex;align-items:center;gap:11px;margin-bottom:13px">
        <div class="meta-ic" style="width:40px;height:40px;border-radius:11px;background:${h.cor}22;color:${h.cor}">${svg(h.icone,18)}</div>
        <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13.5px">${h.nome}</div><div style="font-size:11.5px;color:var(--text-3);font-weight:500;display:flex;gap:8px;align-items:center;margin-top:3px;flex-wrap:wrap"><span class="streak-chip">${svg('flame',11)} ${st}</span><span>recorde ${rec}</span>${h.horario?`<span>· ${h.horario}</span>`:''}</div></div>
        <button class="icon-mini-btn" data-edit="${h.id}">${svg('pencil',15)}</button>
        <button class="icon-mini-btn" data-del="${h.id}">${svg('trash',15)}</button>
      </div>
      ${h.tipo==='quantidade'?`<div class="qty"><button data-minus="${h.id}">−</button><div style="flex:1;text-align:center"><span class="qv" style="color:${done?h.cor:'var(--text-1)'}">${v}</span><span style="color:var(--text-3);font-weight:600"> / ${h.meta} ${h.unidade}</span></div><button data-plus="${h.id}">+</button></div><div class="bar" style="margin-top:10px"><i style="width:${Math.min(100,v/h.meta*100)}%;background:${h.cor}"></i></div>`:`<button class="hdone ${done?'on':''}" data-toggle="${h.id}">${done?svg('tick',16)+' Concluído hoje':'Marcar feito hoje'}</button>`}
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);font-weight:600;margin-top:12px"><span>Meta: ${h.freq>=7?'todo dia':h.freq+'×/semana'}</span><span>${sem}/${h.freq>=7?7:h.freq} esta semana</span></div>
      <div class="heat">${heat}</div>
    </div>`;
  }
  function render(){
    const root=document.getElementById('habitos-root');if(!root)return;
    const hoje=offset(0);
    const feitos=DB.habitos.filter(h=>cumprido(h,hoje)).length;
    const best=DB.habitos.reduce((m,h)=>Math.max(m,streak(h)),0);
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('check',14)}</span>Concluídos hoje</div><div class="kv">${feitos}/${DB.habitos.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('flame',14)}</span>Melhor sequência</div><div class="kv" style="color:var(--warning)">${best} dias</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('target',14)}</span>Hábitos</div><div class="kv">${DB.habitos.length}</div></div>
      </div>
      <div class="toolbar"><div style="flex:1;font-size:13px;color:var(--text-3);font-weight:600">${DB.habitos.length} hábitos</div><button class="btn btn-primary" data-add>${svg('plus',16)} Novo hábito</button></div>
      <div class="metas-grid">${DB.habitos.length?DB.habitos.map(cardHTML).join(''):`<div class="empty" style="grid-column:1/-1"><div class="eico">${svg('flame',24)}</div><h4>Nenhum hábito ainda</h4><p>Crie um hábito pra começar a construir consistência.</p></div>`}</div>`;
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>toggle(+b.dataset.toggle));
    root.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>qty(+b.dataset.plus,1));
    root.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>qty(+b.dataset.minus,-1));
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
  }
  function del(id){const h=DB.habitos.find(x=>x.id===id);if(!h)return;Modal.confirm('Excluir hábito?',`"${h.nome}" e seu histórico serão removidos.`,()=>{DB.habitos=DB.habitos.filter(x=>x.id!==id);Toast.show('Hábito excluído');render();});}
  function form(id){
    const h=id?DB.habitos.find(x=>x.id===id):null;
    const cores=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C'];
    const icones=['drop','run','book','moon','smile','flame','heart','target','check'];
    const curCor=h?h.cor:cores[0],curIc=h?h.icone:icones[0];
    const body=`
      <div class="fg"><label>Nome do hábito</label><input class="field" id="h-nome" value="${h?h.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Beber água"></div>
      <div class="frow">
        <div class="fg"><label>Tipo</label><select class="field" id="h-tipo"><option value="sim_nao"${!h||h.tipo==='sim_nao'?' selected':''}>Sim / Não</option><option value="quantidade"${h&&h.tipo==='quantidade'?' selected':''}>Quantidade</option></select></div>
        <div class="fg"><label>Meta</label><select class="field" id="h-freq">${[1,2,3,4,5,6,7].map(n=>`<option value="${n}"${(h?h.freq:7)===n?' selected':''}>${n===7?'Todo dia':n+'× por semana'}</option>`).join('')}</select></div>
      </div>
      <div class="frow" id="h-qtybox" style="display:none">
        <div class="fg"><label>Meta diária</label><input class="field" id="h-meta" type="number" min="1" step="any" value="${h&&h.meta?h.meta:8}"></div>
        <div class="fg"><label>Unidade</label><input class="field" id="h-uni" value="${h&&h.unidade?h.unidade:''}" placeholder="copos, min, h…"></div>
      </div>
      <div class="fg"><label>Lembrete (opcional)</label><input class="field" id="h-hora" type="time" value="${h&&h.horario?h.horario:''}"></div>
      <div class="fg"><label>Cor</label><div class="swatches" id="h-cores">${cores.map(c=>`<button type="button" class="sw${c===curCor?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>
      <div class="fg"><label>Ícone</label><div class="icpick" id="h-icones">${icones.map(ic=>`<button type="button" class="icp${ic===curIc?' on':''}" data-ic="${ic}">${svg(ic,18)}</button>`).join('')}</div></div>`;
    const back=Modal.open(id?'Editar hábito':'Novo hábito',body,(b)=>{
      const nome=b.querySelector('#h-nome').value.trim();
      if(!nome){Toast.show('Informe o nome','err');return false;}
      const tipo=b.querySelector('#h-tipo').value;
      const dd={nome,tipo,freq:+b.querySelector('#h-freq').value,meta:tipo==='quantidade'?(parseFloat(b.querySelector('#h-meta').value)||1):1,unidade:tipo==='quantidade'?b.querySelector('#h-uni').value.trim():'',horario:b.querySelector('#h-hora').value||'',cor:(b.querySelector('#h-cores .on')||{}).dataset?.cor||curCor,icone:(b.querySelector('#h-icones .on')||{}).dataset?.ic||curIc};
      if(h){Object.assign(h,dd);Toast.show('Hábito atualizado');}else{DB.habitos.push(Object.assign({id:nid(),registros:{}},dd));Toast.show('Hábito criado');}
      render();
    },id?'Salvar':'Criar hábito');
    const tipoSel=back.querySelector('#h-tipo'),qtyBox=back.querySelector('#h-qtybox');
    const syncTipo=()=>{qtyBox.style.display=tipoSel.value==='quantidade'?'grid':'none';};
    tipoSel.onchange=syncTipo;syncTipo();
    back.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-cor]').forEach(x=>x.classList.toggle('on',x===b)));
    back.querySelectorAll('[data-ic]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-ic]').forEach(x=>x.classList.toggle('on',x===b)));
  }
  return {render};
})();

const Metricas=(()=>{
  const valFmt=(m,r)=>m.tipo==='pressao'?`${r.v.s}/${r.v.d}`:`${r.v}`;
  const num=(m,r)=>m.tipo==='pressao'?r.v.s:r.v;
  function cardHTML(m){
    const regs=[...m.registros].sort((a,b)=>a.data<b.data?-1:1);
    const last=regs[regs.length-1],prev=regs[regs.length-2];
    let delta='<span style="color:var(--text-4);font-size:11.5px">Sem comparação ainda</span>';
    if(last&&prev){const d=num(m,last)-num(m,prev);const ar=d>0?'▲':d<0?'▼':'•';delta=`<span style="color:var(--text-3);font-size:11.5px;font-weight:600">${ar} ${Math.abs(d).toFixed(d%1?1:0)} ${m.unidade} vs. anterior</span>`;}
    const spark=regs.length>1?Charts.line(regs.map(r=>num(m,r)),70):'';
    return `<div class="card" style="padding:var(--s-5)">
      <div style="display:flex;align-items:center;gap:11px;margin-bottom:12px">
        <div class="meta-ic" style="width:40px;height:40px;border-radius:11px;background:${m.cor}22;color:${m.cor}">${svg(m.icone,18)}</div>
        <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13.5px">${m.nome}</div><div style="font-size:11px;color:var(--text-4)">${regs.length} registro(s)</div></div>
        <button class="icon-mini-btn" data-edit="${m.id}">${svg('pencil',15)}</button>
        <button class="icon-mini-btn" data-del="${m.id}">${svg('trash',15)}</button>
      </div>
      <div style="display:flex;align-items:baseline;gap:7px"><span style="font-size:28px;font-weight:800;font-family:var(--mono);letter-spacing:-.02em;color:${m.cor}">${last?valFmt(m,last):'—'}</span><span style="color:var(--text-3);font-weight:600;font-size:13px">${m.unidade}</span></div>
      <div style="margin-top:4px">${delta}</div>
      ${spark}
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary" data-reg="${m.id}" style="flex:1">${svg('plus',15)} Registrar</button><button class="btn btn-soft" data-hist="${m.id}" title="Histórico">${svg('repeat',15)}</button></div>
    </div>`;
  }
  function render(){
    const root=document.getElementById('metricas-root');if(!root)return;
    root.innerHTML=`
      <div class="toolbar"><div style="flex:1;font-size:13px;color:var(--text-3);font-weight:600">${DB.metricas.length} métricas acompanhadas</div><button class="btn btn-primary" data-add>${svg('plus',16)} Nova métrica</button></div>
      <div class="metas-grid">${DB.metricas.length?DB.metricas.map(cardHTML).join(''):`<div class="empty" style="grid-column:1/-1"><div class="eico">${svg('activity',24)}</div><h4>Nenhuma métrica</h4><p>Acompanhe peso, pressão, glicose e o que mais quiser.</p></div>`}</div>`;
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-reg]').forEach(b=>b.onclick=()=>registrar(+b.dataset.reg));
    root.querySelectorAll('[data-hist]').forEach(b=>b.onclick=()=>historico(+b.dataset.hist));
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
  }
  function registrar(id){
    const m=DB.metricas.find(x=>x.id===id);
    const body=m.tipo==='pressao'
      ?`<div class="frow"><div class="fg"><label>Sistólica</label><input class="field" id="mr-s" type="number" min="0" placeholder="120"></div><div class="fg"><label>Diastólica</label><input class="field" id="mr-d" type="number" min="0" placeholder="80"></div></div><div class="fg"><label>Data</label><input class="field" id="mr-data" type="date" value="${offset(0)}"></div>`
      :`<div class="frow"><div class="fg"><label>Valor (${m.unidade})</label><input class="field" id="mr-v" type="number" step="any" placeholder="0"></div><div class="fg"><label>Data</label><input class="field" id="mr-data" type="date" value="${offset(0)}"></div></div>`;
    Modal.open(`Registrar · ${m.nome}`,body,(b)=>{
      const data=b.querySelector('#mr-data').value;if(!data){Toast.show('Informe a data','err');return false;}
      if(m.tipo==='pressao'){const s=parseFloat(b.querySelector('#mr-s').value),d=parseFloat(b.querySelector('#mr-d').value);if(!(s>0)||!(d>0)){Toast.show('Preencha sistólica e diastólica','err');return false;}m.registros=m.registros.filter(r=>r.data!==data);m.registros.push({data,v:{s,d}});}
      else{const v=parseFloat(b.querySelector('#mr-v').value);if(!(v>0)){Toast.show('Informe um valor','err');return false;}m.registros=m.registros.filter(r=>r.data!==data);m.registros.push({data,v});}
      Toast.show('Registro adicionado');render();
    },'Registrar');
  }
  function historico(id){
    const m=DB.metricas.find(x=>x.id===id);
    const regs=[...m.registros].sort((a,b)=>a.data<b.data?1:-1);
    const body=regs.length?regs.map(r=>`<div class="dose-row"><div class="dose-time">${r.data.slice(8,10)}/${r.data.slice(5,7)}</div><div class="dose-main"><div class="dt">${valFmt(m,r)} <span style="color:var(--text-3);font-weight:500">${m.unidade}</span></div></div><button class="icon-mini-btn" data-rmr="${r.data}">${svg('trash',14)}</button></div>`).join(''):`<div class="empty" style="padding:var(--s-5) 0"><p>Sem registros.</p></div>`;
    const back=Modal.open(`Histórico · ${m.nome}`,body,()=>{},'Fechar');
    back.querySelectorAll('[data-rmr]').forEach(b=>b.onclick=()=>{m.registros=m.registros.filter(r=>r.data!==b.dataset.rmr);Toast.show('Registro removido');back.querySelector('[data-close]').click();render();});
  }
  function del(id){const m=DB.metricas.find(x=>x.id===id);if(!m)return;Modal.confirm('Excluir métrica?',`"${m.nome}" e todos os registros serão removidos.`,()=>{DB.metricas=DB.metricas.filter(x=>x.id!==id);Toast.show('Métrica excluída');render();});}
  function form(id){
    const m=id?DB.metricas.find(x=>x.id===id):null;
    const cores=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C'];
    const icones=['activity','heart','drop','flame','target','trendup'];
    const curCor=m?m.cor:cores[0],curIc=m?m.icone:icones[0];
    const body=`
      <div class="fg"><label>Nome da métrica</label><input class="field" id="m-nome" value="${m?m.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Peso, Horas de sono"></div>
      <div class="frow">
        <div class="fg"><label>Unidade</label><input class="field" id="m-uni" value="${m?m.unidade:''}" placeholder="kg, mg/dL, h…"></div>
        <div class="fg"><label>Tipo</label><select class="field" id="m-tipo"${id?' disabled':''}><option value="simples"${!m||m.tipo==='simples'?' selected':''}>Valor único</option><option value="pressao"${m&&m.tipo==='pressao'?' selected':''}>Pressão (sis/dia)</option></select></div>
      </div>
      <div class="fg"><label>Cor</label><div class="swatches" id="m-cores">${cores.map(c=>`<button type="button" class="sw${c===curCor?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>
      <div class="fg"><label>Ícone</label><div class="icpick" id="m-icones">${icones.map(ic=>`<button type="button" class="icp${ic===curIc?' on':''}" data-ic="${ic}">${svg(ic,18)}</button>`).join('')}</div></div>`;
    const back=Modal.open(id?'Editar métrica':'Nova métrica',body,(b)=>{
      const nome=b.querySelector('#m-nome').value.trim();if(!nome){Toast.show('Informe o nome','err');return false;}
      const dd={nome,unidade:b.querySelector('#m-uni').value.trim(),tipo:b.querySelector('#m-tipo').value,cor:(b.querySelector('#m-cores .on')||{}).dataset?.cor||curCor,icone:(b.querySelector('#m-icones .on')||{}).dataset?.ic||curIc};
      if(m){Object.assign(m,dd);Toast.show('Métrica atualizada');}else{DB.metricas.push(Object.assign({id:nid(),registros:[]},dd));Toast.show('Métrica criada');}
      render();
    },id?'Salvar':'Criar');
    back.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-cor]').forEach(x=>x.classList.toggle('on',x===b)));
    back.querySelectorAll('[data-ic]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-ic]').forEach(x=>x.classList.toggle('on',x===b)));
  }
  return {render};
})();

