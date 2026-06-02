const Produtos=(()=>{
  let filtroQ='',filtroAtivo='todos',filtroCategoria='todas';
  let view='produtos';                 // 'produtos' | 'precificacao'
  let pcProdId=null, pcMode='margem';  // estado da aba Precificação

  function margem(p){if(!p.custo||!p.preco)return 0;return Math.round(((p.preco-p.custo)/p.preco)*100);}
  function estoqueStatus(p){if(p.estoque<=0)return 'sem';if(p.estoque<p.estoqueMin)return 'baixo';return 'ok';}

  // Capa elegante: fundo tonal pela categoria + emoji (ou inicial do nome quando vazio). Imagem real = Backlog.
  const CAT_COR={Doces:'#D9608C',Salgados:'#E08A3C',Tortas:'#C2783A',Massas:'#C9A227',Kits:'#7C5CD0',Bebidas:'#3C9BD0',Embalagens:'#6B8E6B',Personalizados:'#8E6E53'};
  function catCor(cat){return CAT_COR[cat]||'#8A867C';}
  function capa(p){
    const cor=catCor(p.categoria);
    const dentro=p.emoji?p.emoji:`<span class="prod-cover-ini">${(p.nome||'?').trim().charAt(0).toUpperCase()}</span>`;
    return `<div class="prod-cover" style="background:${cor}22;color:${cor}">${dentro}</div>`;
  }

  function segBar(){
    return `<div class="toolbar" style="margin-bottom:var(--s-3)">
      <div class="seg">
        <button class="${view==='produtos'?'on':''}" data-view="produtos">${svg('box',14)} Produtos</button>
        <button class="${view==='precificacao'?'on':''}" data-view="precificacao">${svg('zap',14)} Precificação</button>
      </div>
    </div>`;
  }
  function bindSeg(root){root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;render();});}

  function render(){
    const root=document.getElementById('produtos-root');if(!root)return;
    if(view==='precificacao'){renderPrecificacao(root);return;}
    const categorias=[...new Set(DB.produtos.map(p=>p.categoria))].sort();
    const lista=DB.produtos.filter(p=>{
      if(filtroAtivo==='ativos'&&!p.ativo)return false;
      if(filtroAtivo==='inativos'&&p.ativo)return false;
      if(filtroCategoria!=='todas'&&p.categoria!==filtroCategoria)return false;
      if(filtroQ&&!p.nome.toLowerCase().includes(filtroQ.toLowerCase()))return false;
      return true;
    });
    const ativos=DB.produtos.filter(p=>p.ativo).length;
    const baixos=DB.produtos.filter(p=>p.ativo&&p.estoque<p.estoqueMin).length;
    const mgMedia=DB.produtos.length?Math.round(DB.produtos.reduce((s,p)=>s+margem(p),0)/DB.produtos.length):0;
    root.innerHTML=`
      ${segBar()}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Produtos</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">${ativos} ativo${ativos!==1?'s':''} · ${baixos>0?`<span style="color:var(--expense);font-weight:700">${baixos} c/ estoque baixo</span>`:'estoque ok'}</p>
        </div>
        <button class="btn btn-primary btn-sm" data-new-prod>${svg('plus',16)} Produto</button>
      </div>
      <div class="kpi-row" style="margin-bottom:var(--s-4)">
        <div class="kpi-card"><span class="kpi-label">Total produtos</span><span class="kpi-val">${DB.produtos.length}</span></div>
        <div class="kpi-card"><span class="kpi-label">Estoque baixo</span><span class="kpi-val" style="color:${baixos>0?'var(--expense)':'var(--income)'}">${baixos}</span></div>
        <div class="kpi-card"><span class="kpi-label">Margem média</span><span class="kpi-val" style="color:var(--income)">${mgMedia}%</span></div>
      </div>
      <div class="filter-row" style="margin-bottom:var(--s-4)">
        <input class="field" id="prod-q" placeholder="Buscar produto…" value="${filtroQ}" style="flex:1;max-width:240px">
        <select class="field" id="prod-cat" style="width:auto">
          <option value="todas">Todas categorias</option>
          ${categorias.map(c=>`<option value="${c}"${filtroCategoria===c?' selected':''}>${c}</option>`).join('')}
        </select>
        <select class="field" id="prod-status" style="width:auto">
          <option value="todos"${filtroAtivo==='todos'?' selected':''}>Todos</option>
          <option value="ativos"${filtroAtivo==='ativos'?' selected':''}>Ativos</option>
          <option value="inativos"${filtroAtivo==='inativos'?' selected':''}>Inativos</option>
        </select>
      </div>
      ${lista.length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">📦</div><p style="color:var(--text-3)">Nenhum produto encontrado</p></div>`
        :`<div class="prod-grid">${lista.map(p=>{
          const mg=margem(p);const st=estoqueStatus(p);
          return `<div class="prod-card">
            <div class="prod-head">
              ${capa(p)}
              <div class="prod-info">
                <div class="prod-name">${p.nome}</div>
                <div class="prod-cat">${p.categoria}${!p.ativo?' · <span style="color:var(--text-3)">Inativo</span>':''}</div>
                ${p.descricao?`<div class="prod-desc">${p.descricao}</div>`:''}
                ${st!=='ok'?`<div class="prod-badge-low">${svg('alert',10)} ${st==='sem'?'Sem estoque':'Estoque baixo'}</div>`:''}
              </div>
              <div style="display:flex;flex-direction:column;gap:4px">
                <button class="btn-icon" title="Editar" data-edit="${p.id}">${svg('pencil',15)}</button>
                <button class="btn-icon" title="Excluir" data-del="${p.id}" style="color:var(--expense)">${svg('trash',15)}</button>
              </div>
            </div>
            <div class="prod-prices">
              <div><label>Custo</label><span>${fmt(p.custo)}</span></div>
              <div><label>Venda</label><span>${fmt(p.preco)}</span></div>
              <div><label>Margem</label><span class="mg">${mg}%</span></div>
            </div>
            <div class="prod-estoque-row">
              <span>Estoque: <b style="color:${st!=='ok'?'var(--expense)':'var(--text-1)'}">${p.estoque} unid.</b></span>
              <span style="font-size:11px;color:var(--text-3)">Mín: ${p.estoqueMin}</span>
            </div>
            <div class="prod-actions">
              <button class="btn btn-ghost btn-sm" data-repor="${p.id}">${svg('arrowup',14)} Repor</button>
              <button class="btn btn-ghost btn-sm" data-saida="${p.id}">${svg('arrowdown',14)} Saída</button>
              <button class="btn btn-ghost btn-sm" data-preco="${p.id}">${svg('zap',14)} Precif.</button>
            </div>
          </div>`;
        }).join('')}</div>`}
    `;
    updateEstoqueBadge();
    bindSeg(root);
    root.querySelector('#prod-q').oninput=e=>{filtroQ=e.target.value;render();};
    root.querySelector('#prod-cat').onchange=e=>{filtroCategoria=e.target.value;render();};
    root.querySelector('#prod-status').onchange=e=>{filtroAtivo=e.target.value;render();};
    root.querySelector('[data-new-prod]').onclick=()=>form();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
      const p=DB.produtos.find(x=>x.id===+b.dataset.del);
      if(p)Modal.confirm('Excluir produto?',`"${p.nome}" será removido permanentemente.`,()=>{DB.produtos=DB.produtos.filter(x=>x.id!==+b.dataset.del);Toast.show('Produto excluído');render();});
    });
    root.querySelectorAll('[data-repor]').forEach(b=>b.onclick=()=>movModal(+b.dataset.repor,'entrada'));
    root.querySelectorAll('[data-saida]').forEach(b=>b.onclick=()=>movModal(+b.dataset.saida,'saida'));
    root.querySelectorAll('[data-preco]').forEach(b=>b.onclick=()=>{pcProdId=+b.dataset.preco;view='precificacao';render();});
  }

  function movModal(prodId,tipo){
    const p=DB.produtos.find(x=>x.id===prodId);if(!p)return;
    const label=tipo==='entrada'?'Repor estoque':'Registrar saída';
    Modal.open(`${label} — ${p.nome}`,`
      <div class="fg"><label>Quantidade</label><input class="field" id="mv-qtd" type="number" min="1" value="1" placeholder="Ex: 10"></div>
      <div class="fg"><label>Observação (opcional)</label><input class="field" id="mv-obs" placeholder="Motivo, pedido, produção…"></div>
    `,(b)=>{
      const qtd=+b.querySelector('#mv-qtd').value;
      if(!qtd||qtd<1){Toast.show('Informe a quantidade','err');return false;}
      if(tipo==='saida'&&qtd>p.estoque){Toast.show('Quantidade maior que o estoque disponível','err');return false;}
      const obs=b.querySelector('#mv-obs').value.trim();
      DB.movimentacoes.push({id:nid(),produtoId:prodId,tipo,qtd,obs,data:offset(0)});
      if(tipo==='entrada')p.estoque+=qtd;else p.estoque-=qtd;
      Toast.show(tipo==='entrada'?'Entrada registrada':'Saída registrada');
      render();
    },'Registrar');
  }

  /* ── Precificação (aba) — markup vs margem, com embalagem/frete/taxa ── */
  // C = custo + embalagem + frete (custos diretos R$/un). taxa% = taxa sobre a venda.
  function calcPreco(C,mode,driver,taxa){
    let preco;
    if(mode==='markup') preco=C*(1+driver/100);
    else { if(driver>=100) return null; preco=C/(1-driver/100); }
    if(!isFinite(preco)||preco<=0) return null;
    const markup=C>0?(preco-C)/C*100:0;
    const margem=preco>0?(preco-C)/preco*100:0;
    const lucro=(preco-C)-preco*(taxa/100);
    return {preco,markup,margem,lucro};
  }
  function pcRead(){
    const g=id=>+(document.getElementById(id)?.value)||0;
    return {custo:g('pc-custo'),emb:g('pc-emb'),frete:g('pc-frete'),taxa:g('pc-taxa'),driver:g('pc-driver')};
  }
  function pcUpdate(){
    const v=pcRead();const C=v.custo+v.emb+v.frete;
    const r=calcPreco(C,pcMode,v.driver,v.taxa);
    const set=(id,txt,cor)=>{const el=document.getElementById(id);if(el){el.textContent=txt;if(cor)el.style.color=cor;}};
    if(!r){set('pc-preco','—');set('pc-r-markup','—');set('pc-r-margem','—');set('pc-r-lucro','—');return;}
    set('pc-preco',fmt(r.preco));
    set('pc-r-markup',Math.round(r.markup)+'%');
    set('pc-r-margem',Math.round(r.margem)+'%');
    set('pc-r-lucro',fmt(r.lucro),r.lucro>=0?'var(--income)':'var(--expense)');
  }
  function renderPrecificacao(root){
    const prods=DB.produtos.slice().sort((a,b)=>a.nome.localeCompare(b.nome,'pt'));
    const p=pcProdId?DB.produtos.find(x=>x.id===pcProdId):null;
    const custo0=p?p.custo:0;
    const driver0=pcMode==='margem'?(p?(margem(p)||40):40):60;
    const driverLabel=pcMode==='margem'?'Margem-alvo (%)':'Markup (%)';
    root.innerHTML=`
      ${segBar()}
      <div class="bento">
        <div class="card col-7">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('zap',17)}</div><h3>Calculadora de preço</h3></div>
          <div class="fg"><label>Produto (opcional — pré-preenche o custo)</label>
            <select class="field" id="pc-prod">
              <option value="">— calcular avulso —</option>
              ${prods.map(x=>`<option value="${x.id}"${p&&x.id===p.id?' selected':''}>${x.emoji} ${x.nome}</option>`).join('')}
            </select>
          </div>
          <div class="seg" style="margin-bottom:var(--s-3)">
            <button class="${pcMode==='margem'?'on':''}" data-pcmode="margem">Por margem-alvo</button>
            <button class="${pcMode==='markup'?'on':''}" data-pcmode="markup">Por markup</button>
          </div>
          <div class="frow">
            <div class="fg"><label>Custo do produto (R$)</label><input class="field" id="pc-custo" type="number" step="0.01" min="0" value="${custo0||''}" placeholder="0,00"></div>
            <div class="fg"><label>Embalagem (R$)</label><input class="field" id="pc-emb" type="number" step="0.01" min="0" value="" placeholder="0,00"></div>
          </div>
          <div class="frow">
            <div class="fg"><label>Frete / un. (R$)</label><input class="field" id="pc-frete" type="number" step="0.01" min="0" value="" placeholder="0,00"></div>
            <div class="fg"><label>Taxa de venda (%)</label><input class="field" id="pc-taxa" type="number" step="0.1" min="0" max="99" value="" placeholder="ex: 3"></div>
          </div>
          <div class="fg"><label id="pc-driver-label">${driverLabel}</label><input class="field" id="pc-driver" type="number" step="1" min="0" value="${driver0}" placeholder="0"></div>
        </div>
        <div class="card col-5" style="display:flex;flex-direction:column">
          <div class="card-head"><div class="ico" style="background:var(--income-soft);color:var(--income)">${svg('trendup',17)}</div><h3>Resultado</h3></div>
          <div style="text-align:center;padding:var(--s-3) 0">
            <div style="font-size:11px;color:var(--text-3);font-weight:700;letter-spacing:.04em">PREÇO SUGERIDO</div>
            <div id="pc-preco" style="font-family:var(--mono);font-size:32px;font-weight:800;color:var(--brand)">—</div>
          </div>
          <div style="display:flex;gap:8px;text-align:center">
            <div style="flex:1;background:var(--surface-2);border-radius:var(--r-md);padding:var(--s-3) 6px"><div style="font-size:10.5px;color:var(--text-3);font-weight:700">MARKUP</div><div id="pc-r-markup" style="font-size:17px;font-weight:800;color:var(--text-1)">—</div></div>
            <div style="flex:1;background:var(--surface-2);border-radius:var(--r-md);padding:var(--s-3) 6px"><div style="font-size:10.5px;color:var(--text-3);font-weight:700">MARGEM</div><div id="pc-r-margem" style="font-size:17px;font-weight:800;color:var(--text-1)">—</div></div>
            <div style="flex:1;background:var(--surface-2);border-radius:var(--r-md);padding:var(--s-3) 6px"><div style="font-size:10.5px;color:var(--text-3);font-weight:700">LUCRO/UN</div><div id="pc-r-lucro" style="font-size:17px;font-weight:800;color:var(--income)">—</div></div>
          </div>
          <p style="font-size:11px;color:var(--text-4);margin:var(--s-3) 0 0;line-height:1.5"><b>Markup</b> = sobre o custo · <b>Margem</b> = sobre o preço. Por isso são diferentes.</p>
          <div style="flex:1"></div>
          <button class="btn btn-primary" id="pc-aplicar" ${p?'':'disabled '}style="width:100%;margin-top:var(--s-3)${p?'':';opacity:.5;cursor:not-allowed'}">${svg('check',16)} ${p?`Aplicar a "${p.nome}"`:'Selecione um produto p/ aplicar'}</button>
        </div>
      </div>`;
    bindSeg(root);
    root.querySelector('#pc-prod').onchange=e=>{pcProdId=e.target.value?+e.target.value:null;render();};
    root.querySelectorAll('[data-pcmode]').forEach(b=>b.onclick=()=>{pcMode=b.dataset.pcmode;render();});
    ['pc-custo','pc-emb','pc-frete','pc-taxa','pc-driver'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('input',pcUpdate);});
    const ap=root.querySelector('#pc-aplicar');
    if(ap&&p)ap.onclick=()=>{
      const v=pcRead();const C=v.custo+v.emb+v.frete;
      const r=calcPreco(C,pcMode,v.driver,v.taxa);
      if(!r){Toast.show('Confira os valores (margem deve ser < 100%)','err');return;}
      p.custo=Math.round(C*100)/100;p.preco=Math.round(r.preco*100)/100;
      Toast.show(`"${p.nome}" → ${fmt(p.preco)} (custo ${fmt(p.custo)})`);
      view='produtos';render();
    };
    pcUpdate();
  }

  function form(id){
    const p=id?DB.produtos.find(x=>x.id===id):null;
    const categorias=[...new Set(DB.produtos.map(x=>x.categoria))].sort();
    Modal.open(id?'Editar produto':'Novo produto',`
      <div class="frow">
        <div class="fg" style="flex:0 0 90px"><label>Emoji</label><input class="field" id="pf-emoji" value="${p?p.emoji:'📦'}" placeholder="📦" maxlength="2"></div>
        <div class="fg"><label>Nome do produto</label><input class="field" id="pf-nome" value="${p?p.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Brigadeiro Tradicional"></div>
      </div>
      <div class="fg"><label>Descrição (opcional)</label><input class="field" id="pf-desc" value="${p&&p.descricao?p.descricao.replace(/"/g,'&quot;'):''}" placeholder="Ex: Bandeja com 10 unidades"></div>
      <div class="frow">
        <div class="fg">
          <label>Categoria</label>
          <input class="field" id="pf-cat" value="${p?p.categoria:''}" list="pf-cat-list" placeholder="Doces, Embalagens…">
          <datalist id="pf-cat-list">${categorias.map(c=>`<option value="${c}">`).join('')}</datalist>
        </div>
        <div class="fg"><label>Status</label><select class="field" id="pf-ativo"><option value="1"${!p||p.ativo?' selected':''}>Ativo</option><option value="0"${p&&!p.ativo?' selected':''}>Inativo</option></select></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Custo (R$)</label><input class="field" id="pf-custo" type="number" step="0.01" min="0" value="${p?p.custo:''}" placeholder="0,00"></div>
        <div class="fg"><label>Preço de venda (R$)</label><input class="field" id="pf-preco" type="number" step="0.01" min="0" value="${p?p.preco:''}" placeholder="0,00"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Estoque atual</label><input class="field" id="pf-estoque" type="number" min="0" value="${p?p.estoque:0}" placeholder="0"></div>
        <div class="fg"><label>Estoque mínimo (alerta)</label><input class="field" id="pf-estoquemin" type="number" min="0" value="${p?p.estoqueMin:10}" placeholder="10"></div>
      </div>
    `,(b)=>{
      const nome=b.querySelector('#pf-nome').value.trim();
      if(!nome){Toast.show('Informe o nome do produto','err');return false;}
      const dd={nome,emoji:b.querySelector('#pf-emoji').value.trim(),descricao:b.querySelector('#pf-desc').value.trim(),categoria:b.querySelector('#pf-cat').value.trim()||'Geral',ativo:b.querySelector('#pf-ativo').value==='1',custo:+b.querySelector('#pf-custo').value||0,preco:+b.querySelector('#pf-preco').value||0,estoque:+b.querySelector('#pf-estoque').value||0,estoqueMin:+b.querySelector('#pf-estoquemin').value||0};
      if(p){Object.assign(p,dd);Toast.show('Produto atualizado');}
      else{DB.produtos.push(Object.assign({id:nid()},dd));Toast.show('Produto adicionado');}
      render();
    },id?'Salvar':'Adicionar');
  }

  return {render};
})();

