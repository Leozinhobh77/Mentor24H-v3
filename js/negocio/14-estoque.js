const Estoque=(()=>{
  let filtroTipo='todos',filtroProd='todos';

  function render(){
    const root=document.getElementById('estoque-root');if(!root)return;
    const movs=[...DB.movimentacoes].sort((a,b)=>b.data.localeCompare(a.data));
    const filtered=movs.filter(m=>{
      if(filtroTipo!=='todos'&&m.tipo!==filtroTipo)return false;
      if(filtroProd!=='todos'&&m.produtoId!==+filtroProd)return false;
      return true;
    });
    const baixos=DB.produtos.filter(p=>p.ativo&&p.estoque<p.estoqueMin);
    const totalItens=DB.produtos.reduce((s,p)=>s+p.estoque,0);
    const entradas=DB.movimentacoes.filter(m=>m.tipo==='entrada').reduce((s,m)=>s+m.qtd,0);
    const saidas=DB.movimentacoes.filter(m=>m.tipo==='saida').reduce((s,m)=>s+m.qtd,0);
    const byDate={};
    filtered.forEach(m=>{if(!byDate[m.data])byDate[m.data]=[];byDate[m.data].push(m);});
    root.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Estoque</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">${DB.movimentacoes.length} movimentações registradas</p>
        </div>
        <button class="btn btn-ghost btn-sm" id="est-btn-produtos">${svg('box',16)} Produtos</button>
      </div>
      ${baixos.length>0?`
      <div style="background:#DB4A4A15;border:1px solid var(--expense);border-radius:var(--r-lg);padding:var(--s-4);margin-bottom:var(--s-4)">
        <div style="display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--expense);margin-bottom:var(--s-2)">${svg('alert',15)} ${baixos.length} produto${baixos.length!==1?'s':''} com estoque baixo</div>
        ${baixos.map(p=>`<div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;color:var(--text-2);padding:3px 0">${p.emoji} ${p.nome}<span style="color:var(--expense);font-weight:700">${p.estoque} / mín ${p.estoqueMin}</span></div>`).join('')}
      </div>
      `:''}
      <div class="kpi-row" style="margin-bottom:var(--s-4)">
        <div class="kpi-card"><span class="kpi-label">Total em estoque</span><span class="kpi-val">${totalItens}</span></div>
        <div class="kpi-card"><span class="kpi-label">Entradas (total)</span><span class="kpi-val" style="color:var(--income)">+${entradas}</span></div>
        <div class="kpi-card"><span class="kpi-label">Saídas (total)</span><span class="kpi-val" style="color:var(--expense)">−${saidas}</span></div>
      </div>
      <div class="card" style="margin-bottom:var(--s-4)">
        <div style="font-size:13px;font-weight:700;color:var(--text-1);margin-bottom:var(--s-3)">Posição por produto</div>
        ${DB.produtos.map(p=>{
          const pct=p.estoqueMin>0?Math.min(100,Math.round(p.estoque/p.estoqueMin*100)):100;
          const cor=p.estoque<p.estoqueMin?'var(--expense)':p.estoque<p.estoqueMin*1.5?'var(--warning)':'var(--income)';
          return `<div style="display:flex;align-items:center;gap:var(--s-3);margin-bottom:var(--s-3)">
            <span style="font-size:18px;width:24px;text-align:center">${p.emoji}</span>
            <div style="flex:1;min-width:0">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:12px;font-weight:600;color:var(--text-1)">${p.nome}</span>
                <span style="font-size:12px;font-weight:700;color:${cor}">${p.estoque} unid.</span>
              </div>
              <div style="height:5px;background:var(--border);border-radius:3px"><div style="height:5px;width:${pct}%;background:${cor};border-radius:3px;transition:width .3s"></div></div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-3)">
        <div style="font-size:15px;font-weight:700;color:var(--text-1)">Movimentações</div>
        <div style="display:flex;gap:var(--s-2)">
          <select class="field" id="est-tipo" style="width:auto;font-size:12px;padding:6px 10px">
            <option value="todos">Todos</option>
            <option value="entrada"${filtroTipo==='entrada'?' selected':''}>Entradas</option>
            <option value="saida"${filtroTipo==='saida'?' selected':''}>Saídas</option>
            <option value="ajuste"${filtroTipo==='ajuste'?' selected':''}>Ajustes</option>
          </select>
          <select class="field" id="est-prod" style="width:auto;font-size:12px;padding:6px 10px">
            <option value="todos">Todos produtos</option>
            ${DB.produtos.map(p=>`<option value="${p.id}"${filtroProd===String(p.id)?' selected':''}>${p.emoji} ${p.nome}</option>`).join('')}
          </select>
        </div>
      </div>
      ${Object.keys(byDate).length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">📊</div><p style="color:var(--text-3)">Nenhuma movimentação encontrada</p></div>`
        :`<div class="mov-list">
        ${Object.entries(byDate).map(([data,ms])=>{
          const d=new Date(data+'T00:00:00');
          const mes=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
          const label=data===offset(0)?'Hoje':data===offset(-1)?'Ontem':`${d.getDate()} ${mes[d.getMonth()]}`;
          return `<div class="date-group"><div class="date-sep">${label}</div>${ms.map(m=>{
            const prod=DB.produtos.find(x=>x.id===m.produtoId)||{nome:'Produto',emoji:'📦'};
            const sinal=m.tipo==='entrada'?'+':m.tipo==='saida'?'−':'~';
            return `<div class="mov-row"><span class="mov-tipo ${m.tipo}">${m.tipo==='entrada'?'Entrada':m.tipo==='saida'?'Saída':'Ajuste'}</span><div class="mov-info"><div class="mov-prod">${prod.emoji} ${prod.nome}</div>${m.obs?`<div class="mov-obs">${m.obs}</div>`:''}</div><div class="mov-qtd ${m.tipo}">${sinal}${m.qtd}</div></div>`;
          }).join('')}</div>`;
        }).join('')}</div>`}
    `;
    updateEstoqueBadge();
    root.querySelector('#est-btn-produtos').onclick=()=>navigate('produtos');
    root.querySelector('#est-tipo').onchange=e=>{filtroTipo=e.target.value;render();};
    root.querySelector('#est-prod').onchange=e=>{filtroProd=e.target.value;render();};
  }

  return {render};
})();

/* ═══════════════════════════════════════════════
   ETAPA 14A — MENTOR (motor de regras + feed, sem IA)
   Fatia 1/2 · frases neutras isoladas em fraseDe() (a 14B troca essa camada)
═══════════════════════════════════════════════ */
function updateMentorBadge(){
  const b=document.getElementById('badge-mentor');if(!b)return;
  const n=Mentor.contarCriticos();
  b.textContent=n;b.style.display=n>0?'':'none';
}
