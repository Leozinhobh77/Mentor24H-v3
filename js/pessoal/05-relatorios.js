const Relatorios=(()=>{
  function render(){
    const root=document.getElementById('rel-root');if(!root)return;
    const txs=DB.transacoes;
    const ent=txs.filter(t=>t.tipo==='entrada').reduce((s,t)=>s+t.valor,0);
    const sai=txs.filter(t=>t.tipo==='saida').reduce((s,t)=>s+t.valor,0);
    const saldo=ent-sai;
    const porCat={};txs.filter(t=>t.tipo==='saida').forEach(t=>{porCat[t.cat]=(porCat[t.cat]||0)+t.valor;});
    const catItems=Object.keys(porCat).map(id=>{const c=CATS.find(x=>x.id===id)||{nome:id,cor:'#8A867C'};return {label:c.nome,value:porCat[id],cor:c.cor};}).sort((a,b)=>b.value-a.value);
    const byDate={};txs.forEach(t=>{byDate[t.data]=(byDate[t.data]||0)+(t.tipo==='entrada'?t.valor:-t.valor);});
    let run=0;const lineVals=Object.keys(byDate).sort().map(d=>{run+=byDate[d];return run;});
    const legend=catItems.map(it=>`<div class="lg-item"><span class="lg-dot" style="background:${it.cor}"></span><span class="lg-name">${it.label}</span><span class="lg-val">${fmt(it.value)}</span><span class="lg-pct">${Math.round(it.value/(sai||1)*100)}%</span></div>`).join('');
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('arrowdown',14)}</span>Entradas</div><div class="kv" style="color:var(--income)">${fmt(ent)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('arrowup',14)}</span>Saídas</div><div class="kv" style="color:var(--expense)">${fmt(sai)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('wallet',14)}</span>Saldo</div><div class="kv" style="color:${saldo>=0?'var(--income)':'var(--expense)'}">${saldo<0?'−':''}${fmt(Math.abs(saldo))}</div></div>
      </div>
      <div class="bento">
        <div class="card col-5"><div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('chart',17)}</div><h3>Gastos por categoria</h3></div>${catItems.length?`<div class="donut-wrap">${Charts.donut(catItems,170)}</div><div class="chart-legend">${legend}</div>`:`<div class="empty"><p>Sem saídas registradas.</p></div>`}</div>
        <div class="card col-7"><div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('chart',17)}</div><h3>Entradas x Saídas</h3></div>${Charts.bars([{label:'Entradas',value:ent,cor:'var(--income)'},{label:'Saídas',value:sai,cor:'var(--expense)'}],200)}</div>
        <div class="card col-12"><div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('trendup',17)}</div><h3>Evolução do saldo</h3></div>${lineVals.length>1?Charts.line(lineVals,160):'<div class="empty"><p>Dados insuficientes para o gráfico.</p></div>'}</div>
      </div>`;
  }
  return {render};
})();

const Categorias=(()=>{
  const PROT=['moradia','alimentacao','transporte','saude','servicos','lazer','receita','outros'];
  const uso=id=>DB.contas.filter(c=>c.cat===id).length+DB.transacoes.filter(t=>t.cat===id).length;
  const gasto=id=>DB.transacoes.filter(t=>t.cat===id&&t.tipo==='saida').reduce((s,t)=>s+t.valor,0)+DB.contas.filter(c=>c.cat===id&&c.tipo==='pagar').reduce((s,c)=>s+c.valor,0);
  function render(){
    const root=document.getElementById('cats-root');if(!root)return;
    const totalG=CATS.reduce((s,c)=>s+gasto(c.id),0)||1;
    root.innerHTML=`
      <div class="toolbar"><div style="flex:1;font-size:13px;color:var(--text-3);font-weight:600">${CATS.length} categorias</div><button class="btn btn-primary" data-add>${svg('plus',16)} Nova categoria</button></div>
      <div class="metas-grid">${CATS.map(c=>{const g=gasto(c.id);const pct=Math.round(g/totalG*100);const u=uso(c.id);return `<div class="card" style="padding:var(--s-5)">
        <div style="display:flex;align-items:center;gap:11px;margin-bottom:13px">
          <div class="meta-ic" style="width:40px;height:40px;border-radius:11px;background:${c.cor}22;color:${c.cor}">${svg(c.icone,18)}</div>
          <div style="flex:1;min-width:0"><div style="font-weight:700;font-size:13.5px">${c.nome}</div><div style="font-size:11.5px;color:var(--text-3);font-weight:500">${u} ${u===1?'uso':'usos'} · ${fmt(g)}</div></div>
          <button class="icon-mini-btn" data-edit="${c.id}" title="Editar">${svg('pencil',15)}</button>
          <button class="icon-mini-btn" data-del="${c.id}" title="Excluir">${svg('trash',15)}</button>
        </div>
        <div class="bar"><i style="width:${pct}%;background:${c.cor}"></i></div>
        <div style="display:flex;justify-content:space-between;margin-top:7px;font-size:10.5px;color:var(--text-4);font-family:var(--mono)"><span>${pct}% dos gastos</span><span>${c.cor}</span></div>
      </div>`;}).join('')}</div>`;
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(b.dataset.del));
  }
  function form(id){
    const c=id?CATS.find(x=>x.id===id):null;
    const cores=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C','#8A867C','#27B6A3'];
    const icones=['home','cart','zap','heart','wifi','flame','trendup','box','target','calendar'];
    const curCor=c?c.cor:cores[0],curIc=c?c.icone:icones[0];
    const body=`
      <div class="fg"><label>Nome</label><input class="field" id="c-nome" value="${c?c.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Pets"></div>
      <div class="fg"><label>Cor</label><div class="swatches" id="c-cores">${cores.map(x=>`<button type="button" class="sw${x===curCor?' on':''}" data-cor="${x}" style="background:${x}"></button>`).join('')}</div></div>
      <div class="fg"><label>Ícone</label><div class="icpick" id="c-icones">${icones.map(x=>`<button type="button" class="icp${x===curIc?' on':''}" data-ic="${x}">${svg(x,18)}</button>`).join('')}</div></div>`;
    const back=Modal.open(id?'Editar categoria':'Nova categoria',body,(b)=>{
      const nome=b.querySelector('#c-nome').value.trim();
      const cor=(b.querySelector('#c-cores .on')||{}).dataset?.cor||curCor;
      const ic=(b.querySelector('#c-icones .on')||{}).dataset?.ic||curIc;
      if(!nome){Toast.show('Informe um nome','err');return false;}
      if(c){c.nome=nome;c.cor=cor;c.icone=ic;Toast.show('Categoria atualizada');}
      else{CATS.push({id:'c'+nid(),nome,cor,icone:ic});Toast.show('Categoria criada');}
      render();
    },id?'Salvar':'Criar');
    back.querySelectorAll('[data-cor]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-cor]').forEach(x=>x.classList.toggle('on',x===b)));
    back.querySelectorAll('[data-ic]').forEach(b=>b.onclick=()=>back.querySelectorAll('[data-ic]').forEach(x=>x.classList.toggle('on',x===b)));
  }
  function del(id){
    if(PROT.includes(id)){Toast.show('Categoria padrão não pode ser excluída','err');return;}
    const c=CATS.find(x=>x.id===id);if(!c)return;
    Modal.confirm('Excluir categoria?',`"${c.nome}" será removida.`,()=>{const i=CATS.findIndex(x=>x.id===id);if(i>=0)CATS.splice(i,1);Toast.show('Categoria excluída');render();});
  }
  return {render};
})();

