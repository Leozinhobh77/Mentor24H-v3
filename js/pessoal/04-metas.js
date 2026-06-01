const Metas=(()=>{
  function fmtBR(iso){const [y,m,d]=iso.split('-');return `${d}/${m}/${y.slice(2)}`;}
  const emptyHTML=()=>`<div class="empty" style="grid-column:1/-1"><div class="eico">${svg('target',24)}</div><h4>Nenhuma meta ainda</h4><p>Crie uma caixinha pra começar a guardar com objetivo.</p></div>`;
  function cardHTML(m){
    const pct=Math.min(100,Math.round(m.atual/m.alvo*100));
    const falta=Math.max(0,m.alvo-m.atual);
    let ritmo='';
    if(m.status==='ativa'&&falta>0&&m.prazo){
      const dias=Math.max(1,diasAte(m.prazo));
      const diario=falta/dias, semanal=falta/(dias/7), mensal=falta/(dias/30);
      const total=Math.max(1,Math.round((new Date(m.prazo)-new Date(m.criadoEm))/86400000));
      const pass=Math.min(total,Math.max(0,Math.round((HOJE-new Date(m.criadoEm))/86400000)));
      const esperado=pass/total*m.alvo;
      const atraso=m.atual<esperado*0.95;
      const dif=Math.max(0,esperado-m.atual);
      ritmo=`<div class="ritmo${atraso?' atraso':''}"><div class="rl">Para atingir até ${fmtBR(m.prazo)}</div><div class="rv" style="color:${m.cor}">${fmt(diario)}<small>/dia</small></div><div class="rs">${fmt(semanal)}/sem · ${fmt(mensal)}/mês</div>${atraso?`<div class="rwarn">${svg('alert',12)} ${fmt(dif)} atrás do ritmo</div>`:''}</div>`;
    } else if(m.status==='concluida'){
      ritmo=`<div class="ritmo" style="background:var(--income-soft);border-color:transparent"><div class="rv" style="color:var(--income);font-size:15px">🎉 Meta concluída!</div></div>`;
    } else if(falta>0){
      ritmo=`<div class="ritmo"><div class="rl">Falta para a meta</div><div class="rv">${fmt(falta)}</div><div class="rs">Sem prazo definido</div></div>`;
    }
    return `<div class="meta-card ${m.status}">
      <div class="meta-h">
        <div class="meta-ic" style="background:${m.cor}22;color:${m.cor}">${svg(m.icone,22)}</div>
        <div class="mn">${m.nome}</div>
        <button class="icon-mini-btn" data-edit="${m.id}" title="Editar">${svg('pencil',15)}</button>
        <button class="icon-mini-btn" data-del="${m.id}" title="Excluir">${svg('trash',15)}</button>
      </div>
      <div class="meta-amt"><div class="meta-cur" style="color:${m.cor}">${fmt(m.atual)}</div><div class="meta-tgt"><span class="pct">${pct}%</span> de ${fmt(m.alvo)}</div></div>
      <div class="bar lg"><i style="width:${pct}%;background:linear-gradient(90deg,${m.cor}99,${m.cor})"></i></div>
      ${m.prazo?`<div class="meta-prazo"><span class="chip-mini">${svg('calendar',11)} ${fmtBR(m.prazo)}</span><span class="chip-mini">${Math.max(0,diasAte(m.prazo))} dias restantes</span></div>`:''}
      ${ritmo}
      <div class="meta-foot">
        ${m.status==='ativa'?`<button class="btn btn-primary" data-dep="${m.id}">${svg('plus',15)} Guardar</button>`:''}
        <button class="btn btn-soft" data-saq="${m.id}">${svg('arrowdown',15)} Retirar</button>
      </div>
    </div>`;
  }
  function render(){
    const root=document.getElementById('metas-root');if(!root)return;
    const total=DB.metas.reduce((s,m)=>s+m.atual,0);
    const ativas=DB.metas.filter(m=>m.status==='ativa').length;
    const alvoTotal=DB.metas.reduce((s,m)=>s+m.alvo,0);
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('target',14)}</span>Total guardado</div><div class="kv" style="color:var(--brand-text)">${fmt(total)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('flame',14)}</span>Metas ativas</div><div class="kv">${ativas}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--surface-3);color:var(--text-2)">${svg('arrowup',14)}</span>Soma dos alvos</div><div class="kv">${fmt(alvoTotal)}</div></div>
      </div>
      <div class="toolbar"><div style="flex:1;font-size:13px;color:var(--text-3);font-weight:600">${DB.metas.length} ${DB.metas.length===1?'meta':'metas'}</div><button class="btn btn-primary" data-add>${svg('plus',16)} Nova meta</button></div>
      <div class="metas-grid">${DB.metas.length?DB.metas.map(cardHTML).join(''):emptyHTML()}</div>`;
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
    root.querySelectorAll('[data-dep]').forEach(b=>b.onclick=()=>mov(+b.dataset.dep,'dep'));
    root.querySelectorAll('[data-saq]').forEach(b=>b.onclick=()=>mov(+b.dataset.saq,'saq'));
  }
  function mov(id,tipo){
    const m=DB.metas.find(x=>x.id===id);if(!m)return;
    const dep=tipo==='dep';
    const back=Modal.open(dep?`Guardar em "${m.nome}"`:`Retirar de "${m.nome}"`,
      `<div class="fg"><label>Valor (R$)</label><input class="field" id="m-val" type="number" step="0.01" min="0" placeholder="0,00"></div>
       <div style="display:flex;gap:8px;flex-wrap:wrap">${[50,100,200,500].map(v=>`<button type="button" class="chip-mini" data-quick="${v}" style="cursor:pointer;padding:8px 13px;font-size:12px">R$ ${v}</button>`).join('')}</div>`,
      (b)=>{
        const v=parseFloat(b.querySelector('#m-val').value);
        if(!(v>0)){Toast.show('Informe um valor válido','err');return false;}
        if(dep){m.atual+=v;DB.transacoes.unshift({id:nid(),tipo:'saida',descricao:`Guardado · ${m.nome}`,valor:v,cat:'outros',metodo:'Transferência',data:offset(0)});if(m.atual>=m.alvo){m.status='concluida';Toast.show('🎉 Meta concluída!');}else Toast.show('Valor guardado');}
        else{if(v>m.atual){Toast.show('Valor maior que o guardado','err');return false;}m.atual-=v;DB.transacoes.unshift({id:nid(),tipo:'entrada',descricao:`Resgate · ${m.nome}`,valor:v,cat:'receita',metodo:'Transferência',data:offset(0)});if(m.status==='concluida'&&m.atual<m.alvo)m.status='ativa';Toast.show('Valor retirado');}
        render();
      },dep?'Guardar':'Retirar');
    back.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>{back.querySelector('#m-val').value=b.dataset.quick;});
  }
  function form(id){
    const m=id?DB.metas.find(x=>x.id===id):null;
    const cores=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C'];
    const icones=['target','flame','calendar','box','heart','cart','home','zap'];
    const curCor=m?m.cor:cores[0], curIc=m?m.icone:icones[0];
    const body=`
      <div class="fg"><label>Nome da meta</label><input class="field" id="g-nome" value="${m?m.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Reserva de emergência"></div>
      <div class="frow">
        <div class="fg"><label>Valor alvo (R$)</label><input class="field" id="g-alvo" type="number" step="0.01" min="0" value="${m?m.alvo:''}" placeholder="0,00"></div>
        <div class="fg"><label>Prazo (opcional)</label><input class="field" id="g-prazo" type="date" value="${m&&m.prazo?m.prazo:''}"></div>
      </div>
      <div class="fg"><label>Cor</label><div class="swatches" id="g-cores">${cores.map(c=>`<button type="button" class="sw${c===curCor?' on':''}" data-cor="${c}" style="background:${c}"></button>`).join('')}</div></div>
      <div class="fg"><label>Ícone</label><div class="icpick" id="g-icones">${icones.map(ic=>`<button type="button" class="icp${ic===curIc?' on':''}" data-ic="${ic}">${svg(ic,18)}</button>`).join('')}</div></div>`;
    const back=Modal.open(id?'Editar meta':'Nova meta',body,(b)=>{
      const nome=b.querySelector('#g-nome').value.trim();
      const alvo=parseFloat(b.querySelector('#g-alvo').value);
      const prazo=b.querySelector('#g-prazo').value||null;
      const cor=(b.querySelector('#g-cores .on')||{}).dataset?.cor||curCor;
      const ic=(b.querySelector('#g-icones .on')||{}).dataset?.ic||curIc;
      if(!nome||!(alvo>0)){Toast.show('Preencha nome e valor alvo','err');return false;}
      if(m){Object.assign(m,{nome,alvo,prazo,cor,icone:ic});m.status=m.atual>=m.alvo?'concluida':'ativa';Toast.show('Meta atualizada');}
      else{DB.metas.push({id:nid(),nome,alvo,atual:0,prazo,cor,icone:ic,status:'ativa',criadoEm:offset(0)});Toast.show('Meta criada');}
      render();
    },id?'Salvar':'Criar meta');
    back.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-cor]').forEach(x=>x.classList.toggle('on',x===b)));
    back.querySelectorAll('[data-ic]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-ic]').forEach(x=>x.classList.toggle('on',x===b)));
  }
  function del(id){const m=DB.metas.find(x=>x.id===id);if(!m)return;Modal.confirm('Excluir meta?',`"${m.nome}" e seu progresso serão removidos.`,()=>{DB.metas=DB.metas.filter(x=>x.id!==id);Toast.show('Meta excluída');render();});}
  return {render};
})();

