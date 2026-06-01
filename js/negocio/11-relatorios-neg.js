const RelatoriosNeg=(()=>{
  const PERIODOS=[{k:'hoje',l:'Hoje'},{k:'7d',l:'7 dias'},{k:'30d',l:'30 dias'},{k:'mes',l:'Mês atual'},{k:'custom',l:'Custom'}];
  const ABC_PCT_A=0.8; // Top 80% do lucro acumulado = classe A
  let periodo='30d', dataIni='', dataFim='', rankBy='lucro';

  function diasAntesHoje(iso){if(!iso)return 999;return -diasAte(iso);}
  function periodoRange(p){
    if(p==='hoje')return [offset(0),offset(0)];
    if(p==='7d')return [offset(-6),offset(0)];
    if(p==='30d')return [offset(-29),offset(0)];
    if(p==='mes'){const d=new Date(HOJE);return [new Date(d.getFullYear(),d.getMonth(),1).toISOString().slice(0,10),offset(0)];}
    return [dataIni,dataFim];
  }
  function periodoAnteriorRange(p,ini,fim){
    const duracao=diasAte(fim)-diasAte(ini);
    if(p==='mes'){const d=new Date(ini);const prevMês=d.getMonth()===0?new Date(d.getFullYear()-1,11,1):new Date(d.getFullYear(),d.getMonth()-1,1);const prevFim=new Date(d.getFullYear(),d.getMonth(),0).toISOString().slice(0,10);return [prevMês.toISOString().slice(0,10),prevFim];}
    return [offset(diasAte(ini)-duracao-1),offset(diasAte(ini)-1)];
  }
  function delta(atual,anterior){
    if(anterior===0)return {pct:0,dir:'flat'};
    const pct=Math.round((atual-anterior)/anterior*100);
    return {pct:Math.abs(pct),dir:pct>2?'up':pct<-2?'down':'flat'};
  }
  function vendasNoPeriodo(ini,fim){
    return DB.vendas.filter(v=>v.data>=ini&&v.data<=fim).slice().sort((a,b)=>b.data.localeCompare(a.data));
  }
  function calcKPIs(vendas){
    const receita=vendas.reduce((s,v)=>s+v.total,0);
    const nVendas=vendas.length;
    const ticketMedio=nVendas?receita/nVendas:0;
    let custoTotal=0;
    vendas.forEach(v=>{
      v.itens.forEach(i=>{
        if(!i.produtoId)return;
        const p=DB.produtos.find(x=>x.id===i.produtoId);
        if(p)custoTotal+=p.custo*i.qtd;
      });
    });
    const lucro=receita-custoTotal;
    const margemBruta=receita>0?(lucro/receita)*100:0;
    return {receita,nVendas,ticketMedio,custoTotal,lucro,margemBruta};
  }
  function agregaPorProduto(vendas){
    const por={};
    vendas.forEach(v=>{
      v.itens.forEach(i=>{
        if(!i.produtoId)return;
        const p=DB.produtos.find(x=>x.id===i.produtoId);
        if(!p)return;
        const k=i.produtoId;
        if(!por[k])por[k]={produtoId:p.id,nome:p.nome,emoji:p.emoji,categoria:p.categoria,qtd:0,receita:0,custo:0};
        por[k].qtd+=i.qtd;
        por[k].receita+=i.preco*i.qtd;
        por[k].custo+=p.custo*i.qtd;
      });
    });
    return Object.values(por).map(x=>({...x,lucro:x.receita-x.custo,margem:x.receita>0?((x.receita-x.custo)/x.receita)*100:0}));
  }
  function classifyABC(prods,comParados){
    if(comParados){
      const todosProds=DB.produtos.filter(p=>p.ativo).map(p=>{const vendido=prods.find(x=>x.produtoId===p.id);return vendido||{produtoId:p.id,nome:p.nome,emoji:p.emoji,categoria:p.categoria,qtd:0,receita:0,custo:0,lucro:0};});
      const comVenda=todosProds.filter(p=>p.qtd>0).sort((a,b)=>b.lucro-a.lucro);
      const totalLucro=comVenda.reduce((s,p)=>s+p.lucro,0);
      let acum=0;
      const classified=comVenda.map(p=>{acum+=p.lucro;const pct=totalLucro>0?(acum/totalLucro):0;return {...p,classe:pct<ABC_PCT_A?'A':'B'};});
      const parados=todosProds.filter(p=>p.qtd===0).map(p=>({...p,classe:'C'}));
      return classified.concat(parados);
    }else{
      const sorted=prods.slice().sort((a,b)=>b.lucro-a.lucro);
      const totalLucro=sorted.reduce((s,p)=>s+p.lucro,0);
      let acum=0;
      return sorted.map(p=>{acum+=p.lucro;const pct=totalLucro>0?(acum/totalLucro):0;return {...p,classe:pct<ABC_PCT_A?'A':'B'};});
    }
  }
  function agregatePorFormaPgto(vendas){
    const por={};
    ['pix','dinheiro','debito','credito','a_prazo'].forEach(k=>{por[k]=0;});
    vendas.forEach(v=>{por[v.pagamento]=(por[v.pagamento]||0)+v.total;});
    return por;
  }
  function saldoFiado(){
    return DB.vendas.filter(v=>v.pagamento==='a_prazo'&&v.status==='pendente').reduce((s,v)=>s+(v.total-(v.recebido||0)),0);
  }
  function agregaRecebitaCustoLucroPorDia(vendas){
    const dias={};
    vendas.forEach(v=>{
      if(!dias[v.data])dias[v.data]={data:v.data,receita:0,custo:0};
      dias[v.data].receita+=v.total;
      v.itens.forEach(i=>{
        if(!i.produtoId)return;
        const p=DB.produtos.find(x=>x.id===i.produtoId);
        if(p)dias[v.data].custo+=p.custo*i.qtd;
      });
    });
    return Object.values(dias).map(d=>({...d,lucro:d.receita-d.custo})).sort((a,b)=>a.data.localeCompare(b.data));
  }
  function agregaLucroPorCategoria(prods){
    const por={};
    prods.forEach(p=>{
      if(!por[p.categoria])por[p.categoria]={categoria:p.categoria,lucro:0,receita:0,qtd:0};
      por[p.categoria].lucro+=p.lucro;
      por[p.categoria].receita+=p.receita;
      por[p.categoria].qtd+=p.qtd;
    });
    return Object.values(por).sort((a,b)=>b.lucro-a.lucro);
  }

  function render(){
    const root=document.getElementById('relneg-root');if(!root)return;
    const [ini,fim]=periodoRange(periodo);
    const vendas=vendasNoPeriodo(ini,fim);
    const kpis=calcKPIs(vendas);
    const [prevIni,prevFim]=periodoAnteriorRange(periodo,ini,fim);
    const vendasPrev=vendasNoPeriodo(prevIni,prevFim);
    const kpisPrev=calcKPIs(vendasPrev);
    const prodsRaw=agregaPorProduto(vendas);
    const prods=classifyABC(prodsRaw,false);
    const prodsComParados=classifyABC(prodsRaw,true);
    const pgto=agregatePorFormaPgto(vendas);
    const fiado=saldoFiado();
    const topVendidos=prodsRaw.slice().sort((a,b)=>b[rankBy]-a[rankBy]).slice(0,8);
    const diaEvolution=agregaRecebitaCustoLucroPorDia(vendas).map(d=>d.receita);
    const pgtoLabel={pix:'Pix',dinheiro:'Dinheiro',debito:'Débito',credito:'Crédito',a_prazo:'A prazo'};
    const rankLabel={lucro:'Lucro',receita:'Receita',qtd:'Quantidade'};

    root.innerHTML=`
      <div class="toolbar" style="margin-bottom:var(--s-4)">
        <div class="seg">${PERIODOS.map(p=>`<button class="${periodo===p.k?'on':''}" data-p="${p.k}">${p.l}</button>`).join('')}</div>
      </div>
      ${periodo==='custom'?`<div style="display:flex;gap:var(--s-2);margin-bottom:var(--s-4)">
        <input class="field" id="relneg-ini" type="date" value="${dataIni}" style="flex:1">
        <input class="field" id="relneg-fim" type="date" value="${dataFim}" style="flex:1">
      </div>`:''}
      <div class="page-kpis">
        ${['receita','nVendas','ticketMedio','lucro','margemBruta'].map((k,idx)=>{
          const labels=['Receita','Vendas','Ticket','Lucro','Margem'];
          const icons=['wallet','cart','zap','trendup','activity'];
          const colors=['income','brand-text','info','income','warning'];
          const d=delta(kpis[k],kpisPrev[k]);
          const val=k==='nVendas'?kpis[k]:(k==='margemBruta'?Math.round(kpis[k]):fmt(kpis[k]));
          const unit=k==='margemBruta'?'%':'';
          return `<div class="kpi"><div class="kl"><span class="ki" style="background:var(--${colors[idx]}-soft);color:var(--${colors[idx]})">${svg(icons[idx],14)}</span>${labels[idx]}</div><div style="display:flex;align-items:flex-end;gap:8px"><div class="kv">${val}${unit}</div>${d.dir!=='flat'?`<div class="delta" style="background:var(--${d.dir==='up'?'income':'expense'}-soft);color:var(--${d.dir==='up'?'income':'expense'})">${d.dir==='up'?'▲':'▼'} ${d.pct}%</div>`:''}</div></div>`;
        }).join('')}
      </div>
      <div class="bento">
        <div class="card col-12">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('trendup',16)}</div><h3>Vendas no período</h3></div>
          ${diaEvolution.length>1?Charts.line(diaEvolution,160):'<div class="empty"><p>Dados insuficientes para o gráfico.</p></div>'}
        </div>
        <div class="card col-12">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('chart',16)}</div><h3>Receita × Custo × Lucro</h3></div>
          ${vendas.length>0?`<div style="display:flex;flex-direction:column;gap:var(--s-3)">
            <div style="display:flex;gap:var(--s-3);font-size:12px">
              <div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;background:var(--income);border-radius:2px"></span><span>Receita</span></div>
              <div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;background:var(--expense);border-radius:2px"></span><span>Custo</span></div>
              <div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;background:var(--brand-text);border-radius:2px"></span><span>Lucro</span></div>
            </div>
            ${Charts.bars([
              {label:'Receita',value:kpis.receita,cor:'var(--income)'},
              {label:'Custo',value:kpis.custoTotal,cor:'var(--expense)'},
              {label:'Lucro',value:kpis.lucro,cor:'var(--brand-text)'}
            ],180)}
          </div>`:`<div class="empty"><p>Sem vendas no período.</p></div>`}
        </div>
        <div class="card col-7">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('box',16)}</div><h3>Top Vendidos (por ${rankLabel[rankBy]})</h3><div style="display:flex;gap:4px;margin-left:auto"><button class="${rankBy==='lucro'?'on':''}" data-rank="lucro" style="padding:4px 10px;border-radius:6px;background:var(--surface-2);font-size:11px;font-weight:600;border:none;color:var(--text-3);cursor:pointer;transition:.16s">Lucro</button><button class="${rankBy==='receita'?'on':''}" data-rank="receita" style="padding:4px 10px;border-radius:6px;background:var(--surface-2);font-size:11px;font-weight:600;border:none;color:var(--text-3);cursor:pointer;transition:.16s">Receita</button><button class="${rankBy==='qtd'?'on':''}" data-rank="qtd" style="padding:4px 10px;border-radius:6px;background:var(--surface-2);font-size:11px;font-weight:600;border:none;color:var(--text-3);cursor:pointer;transition:.16s">Qtd</button></div></div>
          <div style="display:flex;flex-direction:column;gap:var(--s-2)">${topVendidos.map(p=>{const val=rankBy==='qtd'?p.qtd:rankBy==='receita'?p.receita:p.lucro;return `<div style="display:flex;justify-content:space-between;align-items:center;padding:var(--s-2);background:var(--surface-2);border-radius:var(--r-md)"><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:700;color:${p.classe==='A'?'var(--income)':p.classe==='B'?'var(--info)':'var(--text-3)'};font-size:11px;min-width:18px">${p.classe}</span><span>${p.emoji} ${p.nome}</span></div><span style="font-family:var(--mono);font-weight:800;color:var(--income)">${rankBy==='qtd'?val:fmt(val)}</span></div>`;}).join('')}</div>
        </div>
        <div class="card col-5">
          <div class="card-head"><div class="ico" style="background:var(--warning-soft);color:var(--warning)">${svg('alert',16)}</div><h3>Pagamentos</h3></div>
          <div style="display:flex;flex-direction:column;gap:6px">${Object.entries(pgto).map(([k,v])=>`<div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-2);padding:4px 0"><span>${pgtoLabel[k]}</span><span style="font-family:var(--mono);font-weight:700;color:${k==='a_prazo'?'var(--warning)':'var(--income)'}">${fmt(v)}</span></div>`).join('')}</div>
          ${fiado>0?`<div style="margin-top:var(--s-3);padding:var(--s-3);background:var(--warning-soft);border-radius:var(--r-md)"><div style="font-size:11px;color:var(--warning);font-weight:700">A RECEBER (fiado)</div><div style="font-family:var(--mono);font-size:16px;font-weight:800;color:var(--warning)">${fmt(fiado)}</div></div>`:''}
        </div>
        <div class="card col-7">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('pie',16)}</div><h3>Lucro por Categoria</h3></div>
          <div style="display:flex;flex-direction:column;gap:var(--s-1);font-size:13px">${agregaLucroPorCategoria(prods).map(c=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--surface-2)"><span style="color:var(--text-2)">${c.categoria}</span><span style="font-family:var(--mono);font-weight:700;color:var(--income)">${fmt(c.lucro)}</span></div>`).join('')}</div>
        </div>
        <div class="card col-5">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('trendup',16)}</div><h3>Classificação ABC</h3></div>
          <div style="display:flex;flex-direction:column;gap:var(--s-2);font-size:13px">
            ${['A','B','C'].map(cl=>{const items=prodsComParados.filter(p=>p.classe===cl);const lucroTotal=items.reduce((s,p)=>s+p.lucro,0);const desc=cl==='C'?`(${items.length} sem venda)`:cl==='B'?`(${items.length} prod.)`:cl==='A'?`(${items.length} prod.)`:'';return `<div style="padding:var(--s-2);background:var(--surface-2);border-radius:var(--r-md)"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-weight:800;color:${cl==='A'?'var(--income)':cl==='B'?'var(--info)':'var(--text-3)'};font-size:14px">${cl}</span><span style="color:var(--text-3);font-size:11px">${desc}</span></div><div style="font-family:var(--mono);font-weight:800;color:var(--income)">${cl==='C'?'-':fmt(lucroTotal)}</div></div>`;}).join('')}
          </div>
        </div>
      </div>`;

    root.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{periodo=b.dataset.p;render();});
    root.querySelectorAll('[data-rank]').forEach(b=>b.onclick=()=>{rankBy=b.dataset.rank;render();});
    const ini_inp=root.querySelector('#relneg-ini');
    const fim_inp=root.querySelector('#relneg-fim');
    if(ini_inp)ini_inp.onchange=()=>{dataIni=ini_inp.value;render();};
    if(fim_inp)fim_inp.onchange=()=>{dataFim=fim_inp.value;render();};
  }

  return {render};
})();

/* ═══════════════════════════════════════════════
   ETAPA 11 — VENDAS (PDV + HISTÓRICO)
═══════════════════════════════════════════════ */
