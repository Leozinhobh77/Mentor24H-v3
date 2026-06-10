const Vendas=(()=>{
  let view='pdv';
  let carrinho=[];
  let desconto=0, descontoTipo='pct';
  let pagamento='pix';
  let clienteSel=null;
  let _limiteOk=false;   // libera venda a prazo acima do limite após confirmação do Léo
  // Pagamento dividido
  let dividir=false, pgto2='a_prazo', valor1=0;
  // Filtros histórico
  let filtroStatus='todos', filtroPeriodo='tudo', periodoInicio='', periodoFim='';
  // Catálogo
  let catAtiva='fixados', buscaQ='', gridExpandido=false;
  let parcelas=1;

  const PGTOS=[
    {k:'pix',l:'Pix'},
    {k:'dinheiro',l:'Dinheiro'},
    {k:'debito',l:'Débito'},
    {k:'credito',l:'Crédito'},
    {k:'a_prazo',l:'A prazo'},
  ];
  const PGTO_LABEL={pix:'Pix',dinheiro:'Dinheiro',debito:'Débito',credito:'Crédito',a_prazo:'A prazo'};

  function subtotal(){return carrinho.reduce((s,i)=>s+i.preco*i.qtd,0);}
  function descontoVal(){
    const sub=subtotal();
    if(descontoTipo==='pct') return Math.min(sub,sub*descontoVal_pct()/100);
    return Math.min(sub,desconto);
  }
  function descontoVal_pct(){return descontoTipo==='pct'?desconto:0;}
  function total(){return Math.max(0,subtotal()-descontoVal());}

  function addAoCarrinho(prod){
    const ex=carrinho.find(i=>i.produtoId===prod.id);
    if(ex){if(ex.qtd<prod.estoque){ex.qtd++;renderCarrinho();}else{Toast.show('Estoque insuficiente','err');}return;}
    carrinho.push({produtoId:prod.id,nome:prod.nome,emoji:prod.emoji,preco:prod.preco,qtd:1});
    renderCarrinho();
  }

  function renderCarrinho(){
    const root=document.getElementById('pdv-cart');if(!root)return;
    const sub=subtotal(),desc=descontoVal(),tot=total();
    const qtdTotal=carrinho.reduce((s,i)=>s+i.qtd,0);
    root.querySelector('.pdv-cart-head').textContent=`Carrinho${qtdTotal>0?' ('+qtdTotal+')':''}`;
    const body=root.querySelector('#cart-body');
    if(!body)return;
    if(carrinho.length===0){body.innerHTML='<div class="pdv-cart-empty">Toque nos produtos<br>para adicionar</div>';return;}
    body.innerHTML=carrinho.map((it,idx)=>`
      <div class="pdv-item">
        <span style="font-size:20px">${it.emoji}</span>
        <div class="pdv-item-info">
          <div class="pdv-item-name">${it.nome}</div>
          <div class="pdv-item-price">${fmt(it.preco)} un.</div>
        </div>
        <div class="pdv-qty">
          <button data-minus="${idx}">−</button>
          <span>${it.qtd}</span>
          <button data-plus="${idx}">+</button>
        </div>
        <div style="min-width:52px;text-align:right;font-size:12px;font-weight:700;color:var(--text-1)">${fmt(it.preco*it.qtd)}</div>
        <button data-rm="${idx}" style="color:var(--expense);background:none;border:none;cursor:pointer;padding:2px;display:flex">${svg('x',14)}</button>
      </div>`).join('');

    body.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{const i=carrinho[+b.dataset.minus];if(i.qtd>1){i.qtd--;}else{carrinho.splice(+b.dataset.minus,1);}renderCarrinho();});
    body.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{const i=carrinho[+b.dataset.plus],p=DB.produtos.find(x=>x.id===i.produtoId);if(!p||i.qtd>=p.estoque){Toast.show('Limite do estoque','err');return;}i.qtd++;renderCarrinho();});
    body.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{carrinho.splice(+b.dataset.rm,1);renderCarrinho();});

    // Totais
    const totEl=root.querySelector('#cart-totals');
    if(totEl) totEl.innerHTML=`
      <div class="pdv-total-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
      ${desc>0?`<div class="pdv-total-row" style="color:var(--income)"><span>Desconto</span><span>− ${fmt(desc)}</span></div>`:''}
      <div class="pdv-total-row big"><span>Total</span><span>${fmt(tot)}</span></div>`;
  }

  function render(){
    const root=document.getElementById('vendas-root');if(!root)return;
    if(view==='historico'){renderHistorico();return;}
    const hojeVal=DB.vendas.filter(v=>v.data===offset(0)&&v.status==='pago').reduce((s,v)=>s+v.total,0);
    const semanaVal=DB.vendas.filter(v=>v.data>=offset(-7)&&v.status==='pago').reduce((s,v)=>s+v.total,0);
    const mesVal=DB.vendas.filter(v=>v.data>=offset(-30)&&v.status==='pago').reduce((s,v)=>s+v.total,0);
    const cats=[...new Set(DB.produtos.filter(p=>p.ativo).map(p=>p.categoria))].sort();
    const temFixados=DB.produtos.some(p=>p.ativo&&p.fixado);
    const tot=total();
    const val2=Math.max(0,tot-valor1);

    root.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Vendas</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">PDV — ponto de venda</p>
        </div>
        <button class="btn btn-ghost btn-sm" id="btn-hist">${svg('clock',15)} Histórico</button>
      </div>
      <div class="kpi-row" style="margin-bottom:var(--s-4)">
        <div class="kpi-card"><span class="kpi-label">Hoje</span><span class="kpi-val" style="font-size:16px">${fmt(hojeVal)}</span></div>
        <div class="kpi-card"><span class="kpi-label">7 dias</span><span class="kpi-val" style="font-size:16px">${fmt(semanaVal)}</span></div>
        <div class="kpi-card"><span class="kpi-label">30 dias</span><span class="kpi-val" style="font-size:16px">${fmt(mesVal)}</span></div>
      </div>
      <div class="pdv-layout">
        <div class="pdv-catalog">
          <input class="field" id="pdv-busca" placeholder="Buscar produto no catálogo…" value="${buscaQ}">
          <div class="cat-tabs" id="cat-tabs">
            ${temFixados?`<button class="cat-tab${catAtiva==='fixados'?' on':''}" data-cat="fixados">⭐ Fixados</button>`:''}
            <button class="cat-tab${catAtiva==='todas'?' on':''}" data-cat="todas">Todas</button>
            ${cats.map(c=>`<button class="cat-tab${catAtiva===c?' on':''}" data-cat="${c}">${c}</button>`).join('')}
          </div>
          <div class="pdv-prod-grid" id="pdv-grid"></div>
          <div class="pdv-avulso" id="pdv-avulso">${svg('plus',16)} Item avulso (sem cadastro)</div>
        </div>
        <div class="pdv-cart" id="pdv-cart">
          <div class="pdv-cart-head">Carrinho</div>
          <div id="cart-body"><div class="pdv-cart-empty">Toque nos produtos<br>para adicionar</div></div>
          <div id="cart-totals"></div>
          <div style="padding-top:var(--s-2);border-top:1px solid var(--border)">
            <div style="font-size:11px;font-weight:700;color:var(--text-3);margin-bottom:6px">DESCONTO</div>
            <div style="display:flex;gap:6px;align-items:center">
              <input class="field" id="pdv-desc-val" type="number" min="0" placeholder="0" value="${desconto>0?desconto:''}" style="width:80px;text-align:right">
              <select class="field" id="pdv-desc-tipo" style="width:auto">
                <option value="pct"${descontoTipo==='pct'?' selected':''}>%</option>
                <option value="val"${descontoTipo==='val'?' selected':''}>R$</option>
              </select>
            </div>
          </div>
          <div style="padding-top:var(--s-2);border-top:1px solid var(--border)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <div style="font-size:11px;font-weight:700;color:var(--text-3)">PAGAMENTO</div>
              <button id="pdv-dividir-btn" style="font-size:11px;font-weight:700;color:${dividir?'var(--brand)':'var(--text-3)'};background:none;border:none;cursor:pointer">${dividir?'✕ Cancelar divisão':'+ Dividir pagamento'}</button>
            </div>
            ${!dividir?`
            <div class="pdv-pgto">
              ${PGTOS.map(p=>`<button class="pdv-pgto-btn${pagamento===p.k?' on':''}" data-pgto="${p.k}">${p.l}</button>`).join('')}
            </div>
            ${pagamento==='dinheiro'?`<div style="margin-top:8px;display:flex;align-items:center;gap:8px"><label style="font-size:12px;color:var(--text-3);white-space:nowrap">Recebido:</label><input class="field" id="pdv-recebido" type="number" min="0" placeholder="${tot.toFixed(2)}" style="width:110px;text-align:right"></div>`:''}
            ${pagamento==='credito'?`<div style="margin-top:8px;display:flex;align-items:center;gap:8px"><label style="font-size:12px;color:var(--text-3);white-space:nowrap">Parcelas:</label><select class="field" id="pdv-parcelas" style="width:auto">${[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`<option value="${n}"${parcelas===n?' selected':''}>${n}x</option>`).join('')}</select><span style="font-size:11px;color:var(--text-3)">só registro, sem juros</span></div>`:''}
            `:`
            <div style="display:flex;flex-direction:column;gap:8px">
              <div style="display:flex;gap:8px;align-items:center">
                <select class="field" id="pdv-pgto1" style="flex:1">${PGTOS.map(p=>`<option value="${p.k}"${pagamento===p.k?' selected':''}>${p.l}</option>`).join('')}</select>
                <input class="field" id="pdv-val1" type="number" step="0.01" min="0" max="${tot}" value="${valor1>0?valor1:''}" placeholder="R$ parcial" style="width:110px;text-align:right">
              </div>
              <div style="display:flex;gap:8px;align-items:center">
                <select class="field" id="pdv-pgto2" style="flex:1">${PGTOS.map(p=>`<option value="${p.k}"${pgto2===p.k?' selected':''}>${p.l}</option>`).join('')}</select>
                <div style="width:110px;text-align:right;font-size:13px;font-weight:700;color:var(--text-1);padding:8px 12px;background:var(--surface-2);border-radius:var(--r-md)">${fmt(val2)}</div>
              </div>
              <div style="font-size:11px;color:var(--text-3);text-align:center">O segundo valor é calculado automaticamente</div>
            </div>
            `}
          </div>
          <div style="padding-top:var(--s-2);border-top:1px solid var(--border)">
            <div style="font-size:11px;font-weight:700;color:var(--text-3);margin-bottom:6px">CLIENTE <span style="font-weight:400">(opcional)</span></div>
            <div style="display:flex;gap:6px">
              <div style="flex:1;padding:8px 12px;background:var(--surface-2);border-radius:var(--r-md);font-size:13px;color:${clienteSel?'var(--text-1)':'var(--text-3)'}">${clienteSel?clienteSel.nome:'Sem cliente'}</div>
              <button class="btn btn-ghost btn-sm" id="pdv-sel-cliente">${svg('users',15)}</button>
              ${clienteSel?`<button class="btn btn-ghost btn-sm" id="pdv-rm-cliente" style="color:var(--expense)">${svg('x',14)}</button>`:''}
            </div>
          </div>
          <button class="btn btn-primary" id="pdv-finalizar" style="width:100%;padding:14px;font-size:15px;font-weight:700;border-radius:var(--r-md)">${svg('check',18)} Finalizar Venda</button>
          <button class="btn btn-ghost" id="pdv-limpar" style="width:100%;font-size:12px">Limpar carrinho</button>
        </div>
      </div>`;

    renderGrid();
    root.querySelector('#pdv-busca').oninput=e=>{buscaQ=e.target.value;gridExpandido=false;renderGrid();};
    root.querySelectorAll('.cat-tab').forEach(b=>b.onclick=()=>{catAtiva=b.dataset.cat;buscaQ='';gridExpandido=false;render();});
    root.querySelector('#pdv-avulso').onclick=()=>avulso();
    root.querySelector('#btn-hist').onclick=()=>{view='historico';render();};
    root.querySelector('#pdv-desc-val').oninput=e=>{desconto=+e.target.value||0;renderCarrinho();};
    root.querySelector('#pdv-desc-tipo').onchange=e=>{descontoTipo=e.target.value;renderCarrinho();};
    root.querySelector('#pdv-dividir-btn').onclick=()=>{dividir=!dividir;valor1=0;render();};
    if(!dividir){
      root.querySelectorAll('.pdv-pgto-btn').forEach(b=>b.onclick=()=>{pagamento=b.dataset.pgto;render();});
    } else {
      root.querySelector('#pdv-pgto1').onchange=e=>{pagamento=e.target.value;};
      root.querySelector('#pdv-pgto2').onchange=e=>{pgto2=e.target.value;};
      root.querySelector('#pdv-val1').oninput=e=>{valor1=Math.min(+e.target.value||0,total());renderCarrinho();};
    }
    root.querySelector('#pdv-sel-cliente').onclick=()=>selecionarCliente();
    if(root.querySelector('#pdv-rm-cliente'))root.querySelector('#pdv-rm-cliente').onclick=()=>{clienteSel=null;render();};
    const parcelasEl=root.querySelector('#pdv-parcelas');
    if(parcelasEl)parcelasEl.onchange=e=>{parcelas=+e.target.value;};
    root.querySelector('#pdv-finalizar').onclick=()=>finalizarVenda();
    root.querySelector('#pdv-limpar').onclick=()=>{if(carrinho.length===0)return;Modal.confirm('Limpar carrinho?','Todos os itens serão removidos.',()=>{carrinho=[];desconto=0;dividir=false;valor1=0;clienteSel=null;render();});};
    renderCarrinho();
  }

  function renderGrid(){
    const grid=document.getElementById('pdv-grid');if(!grid)return;
    let prods=DB.produtos.filter(p=>p.ativo);
    if(catAtiva==='fixados') prods=prods.filter(p=>p.fixado);
    else if(catAtiva!=='todas') prods=prods.filter(p=>p.categoria===catAtiva);
    if(buscaQ) prods=prods.filter(p=>p.nome.toLowerCase().includes(buscaQ.toLowerCase()));
    const LIMIT=6;
    const mostrar=gridExpandido?prods:prods.slice(0,LIMIT);
    const temMais=prods.length>LIMIT;
    const cardMap=p=>`
      <div class="pdv-prod-btn${p.estoque<=0?' sem-stock':''}" data-pid="${p.id}" title="${p.nome}">
        <button class="fix-btn${p.fixado?' on':''}" data-fixar="${p.id}">${p.fixado?'⭐':'☆'}</button>
        <div class="pe">${p.emoji}</div>
        <div class="pn">${p.nome}</div>
        <div class="pp">${fmt(p.preco)}</div>
        <div class="pstock">${p.estoque>=999?'∞':p.estoque+' em estoque'}</div>
      </div>`;
    grid.innerHTML=prods.length===0
      ?`<div style="grid-column:1/-1;text-align:center;padding:var(--s-6);color:var(--text-3);font-size:13px">${catAtiva==='fixados'?'Nenhum produto fixado — toque ⭐ nos produtos para fixar':'Nenhum produto encontrado'}</div>`
      :(mostrar.map(cardMap).join('')+
        (temMais?`<div style="grid-column:1/-1;padding:2px 0"><button data-toggle-grid class="btn btn-ghost" style="width:100%;font-size:12px;padding:8px 0;border:1px dashed var(--border);border-radius:var(--r-md)">${gridExpandido?`▲ Ver menos`:`▼ Ver mais (${prods.length-LIMIT} produto${prods.length-LIMIT!==1?'s':''})`}</button></div>`:``));
    grid.querySelectorAll('.pdv-prod-btn').forEach(card=>{
      card.addEventListener('click',e=>{
        if(e.target.closest('[data-fixar]'))return;
        const p=DB.produtos.find(x=>x.id===+card.dataset.pid);
        if(p&&p.estoque>0)addAoCarrinho(p);
      });
    });
    grid.querySelectorAll('[data-fixar]').forEach(b=>b.addEventListener('click',e=>{
      e.stopPropagation();
      const p=DB.produtos.find(x=>x.id===+b.dataset.fixar);
      if(p){p.fixado=!p.fixado;renderGrid();}
    }));
    const toggleBtn=grid.querySelector('[data-toggle-grid]');
    if(toggleBtn)toggleBtn.onclick=()=>{gridExpandido=!gridExpandido;renderGrid();};
  }

  function avulso(){
    Modal.open('Item avulso',`
      <div class="fg"><label>Descrição</label><input class="field" id="av-nome" placeholder="Ex: Embalagem especial, frete…"></div>
      <div class="fg"><label>Preço (R$)</label><input class="field" id="av-preco" type="number" step="0.01" min="0" placeholder="0,00"></div>
      <div class="fg"><label>Quantidade</label><input class="field" id="av-qtd" type="number" min="1" value="1"></div>
    `,(b)=>{
      const nome=b.querySelector('#av-nome').value.trim();
      const preco=+b.querySelector('#av-preco').value;
      const qtd=+b.querySelector('#av-qtd').value||1;
      if(!nome){Toast.show('Informe a descrição','err');return false;}
      if(!preco||preco<=0){Toast.show('Informe o preço','err');return false;}
      carrinho.push({produtoId:null,nome,emoji:'🏷️',preco,qtd});
      renderCarrinho();
    },'Adicionar');
  }

  function selecionarCliente(){
    const lista=DB.contatos.filter(c=>c.contexto==='negocio'||c.contexto==='ambos').concat(DB.contatos.filter(c=>c.contexto==='pessoal'));
    Modal.open('Selecionar cliente',`
      <input class="field" id="cli-busca" placeholder="Buscar…" style="margin-bottom:var(--s-3)">
      <div style="display:flex;flex-direction:column;gap:6px;max-height:320px;overflow-y:auto" id="cli-lista">
        ${lista.map(c=>`<button class="lrow" data-cid="${c.id}" data-cnome="${c.nome.replace(/"/g,'&quot;')}" style="text-align:left;cursor:pointer;padding:var(--s-3) var(--s-4);border-radius:var(--r-md)">
          <div style="font-size:13px;font-weight:700;color:var(--text-1)">${c.nome}</div>
          <div style="font-size:11px;color:var(--text-3)">${c.tags.join(', ')||'—'}</div>
        </button>`).join('')}
      </div>
    `,(b)=>{
      const sel=b.querySelector('.lrow.selected');
      if(!sel){Toast.show('Selecione um cliente','err');return false;}
      clienteSel={id:+sel.dataset.cid,nome:sel.dataset.cnome};
      render();
    },'Confirmar');
    setTimeout(()=>{
      document.querySelectorAll('#cli-lista .lrow').forEach(b=>b.onclick=()=>{
        document.querySelectorAll('#cli-lista .lrow').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
        b.style.background='var(--brand-soft)';b.style.borderColor='var(--brand)';
      });
      const busca=document.getElementById('cli-busca');
      if(busca)busca.oninput=e=>{
        const q=e.target.value.toLowerCase();
        document.querySelectorAll('#cli-lista .lrow').forEach(b=>b.style.display=b.querySelector('div').textContent.toLowerCase().includes(q)?'':'none');
      };
    },50);
  }

  function finalizarVenda(){
    if(carrinho.length===0){Toast.show('Adicione ao menos um produto','err');return;}
    const tot=total();
    // Validação pagamento dividido
    if(dividir){
      if(valor1<=0||valor1>=tot){Toast.show('Informe um valor parcial válido para o 1º método','err');return;}
      if(pagamento===pgto2){Toast.show('Escolha métodos de pagamento diferentes','err');return;}
    }
    let troco=0;
    if(!dividir&&pagamento==='dinheiro'){
      const recebido=+document.getElementById('pdv-recebido')?.value||0;
      if(recebido>0&&recebido<tot){Toast.show('Valor recebido menor que o total','err');return;}
      troco=recebido>0?recebido-tot:0;
    }
    // Hook: alerta de limite de crédito (não bloqueia — decisão do Léo na hora)
    if(clienteSel){
      const aPrazoVal=!dividir
        ?(pagamento==='a_prazo'?tot:0)
        :((pagamento==='a_prazo'?valor1:0)+(pgto2==='a_prazo'?Math.max(0,tot-valor1):0));
      if(aPrazoVal>0&&!_limiteOk){
        const c=DB.contatos.find(x=>x.id===clienteSel.id);
        const lim=c&&c.limiteCredito!=null?c.limiteCredito:200;
        const saldoAtual=DB.vendas.filter(v=>v.clienteId===clienteSel.id&&v.pagamento==='a_prazo'&&v.status==='pendente').reduce((s,v)=>s+(v.total-(v.recebido||0)),0);
        if(saldoAtual+aPrazoVal>lim){
          Modal.confirm('Acima do limite de crédito',`${clienteSel.nome} já deve ${fmt(saldoAtual)} e esta venda a prazo (${fmt(aPrazoVal)}) ultrapassa o limite de ${fmt(lim)}. Vender mesmo assim?`,()=>{_limiteOk=true;finalizarVenda();},'Vender mesmo assim');
          return;
        }
      }
    }
    _limiteOk=false;
    // Montar pagamentos
    const pagamentos=dividir
      ?[{metodo:pagamento,valor:valor1},{metodo:pgto2,valor:Math.max(0,tot-valor1)}]
      :[{metodo:pagamento,valor:tot}];
    const temPrazo=pagamentos.some(p=>p.metodo==='a_prazo');
    const status=temPrazo?'pendente':'pago';
    const pgtoLabel=pagamentos.map(p=>PGTO_LABEL[p.metodo]).join(' + ');
    const venda={
      id:nid(),data:offset(0),
      itens:carrinho.map(i=>({...i})),
      subtotal:subtotal(),desconto:descontoVal(),total:tot,
      pagamento:pagamentos[0].metodo,
      pagamentos,dividido:dividir,
      parcelas:pagamentos.some(p=>p.metodo==='credito')?parcelas:1,
      clienteId:clienteSel?.id||null,clienteNome:clienteSel?.nome||'',
      status,obs:'',
    };
    DB.vendas.unshift(venda);
    venda.itens.forEach(it=>{
      if(!it.produtoId)return;
      const p=DB.produtos.find(x=>x.id===it.produtoId);
      if(p)p.estoque=Math.max(0,p.estoque-it.qtd);
      DB.movimentacoes.push({id:nid(),produtoId:it.produtoId,tipo:'saida',qtd:it.qtd,obs:`Venda #${venda.id}${venda.clienteNome?' — '+venda.clienteNome:''}`,data:offset(0)});
    });
    // Transação: valor pago à vista (não a prazo)
    const valorAvista=pagamentos.filter(p=>p.metodo!=='a_prazo').reduce((s,p)=>s+p.valor,0);
    if(valorAvista>0){
      DB.transacoes.unshift({id:nid(),tipo:'entrada',descricao:`Venda — ${venda.itens.map(i=>i.nome).join(', ')}${venda.clienteNome?' ('+venda.clienteNome+')':''}`,valor:valorAvista,cat:'receita',metodo:pgtoLabel,data:offset(0)});
    }
    const itensVenda=[...carrinho];
    carrinho=[];desconto=0;descontoTipo='pct';dividir=false;valor1=0;clienteSel=null;parcelas=1;
    updateEstoqueBadge();
    recibo(venda,troco,itensVenda,pagamentos);
  }

  function recibo(venda,troco,itens,pagamentos){
    const _pgtoStr=p=>p.metodo==='credito'&&venda.parcelas>1?`Crédito ${venda.parcelas}x`:PGTO_LABEL[p.metodo];
    const pgtoLabel=pagamentos?pagamentos.map(_pgtoStr).join(' + '):_pgtoStr({metodo:venda.pagamento});
    const pgtoDetalhe=pagamentos&&pagamentos.length>1
      ?pagamentos.map(p=>`${PGTO_LABEL[p.metodo]}: ${fmt(p.valor)}${p.metodo==='a_prazo'?' ⏳':' ✅'}`).join('\n')
      :'';
    const whatsText=encodeURIComponent(`🧾 *Recibo — Mentor24h*\n\nData: ${new Date().toLocaleDateString('pt-BR')}\n${venda.clienteNome?'Cliente: '+venda.clienteNome+'\n':''}\n${itens.map(i=>`${i.emoji} ${i.nome} ×${i.qtd} = ${fmt(i.preco*i.qtd)}`).join('\n')}\n${venda.desconto>0?`\nDesconto: − ${fmt(venda.desconto)}`:''}${troco>0?`\nTroco: ${fmt(troco)}`:''}\n\n*Total: ${fmt(venda.total)}*\n💳 Pagamento: ${pgtoLabel}${pgtoDetalhe?'\n'+pgtoDetalhe:''}\n\nObrigado! 🙏`);
    const {back}=Modal._build('Venda registrada!',`
      <div style="text-align:center;margin-bottom:var(--s-4)">
        <div style="font-size:40px;margin-bottom:8px">🎉</div>
        <div style="font-size:24px;font-weight:800;color:var(--brand)">${fmt(venda.total)}</div>
        <div style="font-size:13px;color:var(--text-3);margin-top:4px">${pgtoLabel} · ${venda.clienteNome||'Sem cliente'}</div>
        ${troco>0?`<div style="margin-top:8px;padding:8px 16px;background:var(--brand-soft);border-radius:var(--r-md);font-size:14px;font-weight:700;color:var(--brand)">Troco: ${fmt(troco)}</div>`:''}
        ${pagamentos&&pagamentos.length>1?`<div style="margin-top:8px;background:var(--surface-2);border-radius:var(--r-md);padding:var(--s-3);text-align:left">${pagamentos.map(p=>`<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0"><span>${PGTO_LABEL[p.metodo]}</span><span style="font-weight:700;color:${p.metodo==='a_prazo'?'var(--warning)':'var(--income)'}">${fmt(p.valor)} ${p.metodo==='a_prazo'?'⏳':'✅'}</span></div>`).join('')}</div>`:''}
        ${venda.status==='pendente'?`<div style="margin-top:8px;padding:8px 16px;background:#C8860B22;border-radius:var(--r-md);font-size:12px;font-weight:700;color:var(--warning)">⏳ Parte a prazo — registrar recebimento depois</div>`:''}
      </div>
      <div style="background:var(--surface-2);border-radius:var(--r-md);padding:var(--s-3) var(--s-4);font-size:12px;color:var(--text-2);line-height:1.8">
        ${itens.map(i=>`<div style="display:flex;justify-content:space-between">${i.emoji} ${i.nome} ×${i.qtd}<span style="font-weight:700">${fmt(i.preco*i.qtd)}</span></div>`).join('')}
        ${venda.desconto>0?`<div style="display:flex;justify-content:space-between;color:var(--income)">Desconto<span>− ${fmt(venda.desconto)}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;font-weight:800;color:var(--text-1);border-top:1px solid var(--border);margin-top:6px;padding-top:6px">Total<span>${fmt(venda.total)}</span></div>
      </div>
    `,`<button class="btn btn-ghost" data-close>Fechar</button><a class="btn btn-primary" href="https://wa.me/?text=${whatsText}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:6px;text-decoration:none">${svg('chat',16)} WhatsApp</a>`);
    back.querySelector('[data-close]').addEventListener('click',()=>render(),{once:true});
    setTimeout(()=>render(),100);
  }

  function filteredVendas(){
    return [...DB.vendas].filter(v=>{
      if(filtroPeriodo==='hoje'&&v.data!==offset(0))return false;
      if(filtroPeriodo==='7d'&&v.data<offset(-7))return false;
      if(filtroPeriodo==='mes'&&v.data<offset(-30))return false;
      if(filtroPeriodo==='custom'){
        if(periodoInicio&&v.data<periodoInicio)return false;
        if(periodoFim&&v.data>periodoFim)return false;
      }
      if(filtroStatus!=='todos'&&v.status!==filtroStatus)return false;
      return true;
    }).sort((a,b)=>b.data.localeCompare(a.data));
  }

  function renderHistorico(){
    const root=document.getElementById('vendas-root');if(!root)return;
    const pendentes=DB.vendas.filter(v=>v.status==='pendente').reduce((s,v)=>s+v.total,0);
    const hoje=DB.vendas.filter(v=>v.data===offset(0)&&v.status==='pago').reduce((s,v)=>s+v.total,0);
    const semana=DB.vendas.filter(v=>v.data>=offset(-7)&&v.status==='pago').reduce((s,v)=>s+v.total,0);
    const lista=filteredVendas();
    const totalFiltrado=lista.filter(v=>v.status==='pago').reduce((s,v)=>s+v.total,0);
    const PERIODOS=[['hoje','Hoje'],['7d','7 dias'],['mes','Mês'],['tudo','Tudo'],['custom','Período...']];
    root.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Histórico de Vendas</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">${lista.length} venda${lista.length!==1?'s':''} encontrada${lista.length!==1?'s':''}</p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-pdv">${svg('cart',15)} Nova Venda</button>
      </div>
      ${pendentes>0?`<div style="background:#C8860B15;border:1px solid var(--warning);border-radius:var(--r-lg);padding:var(--s-3) var(--s-4);margin-bottom:var(--s-4);display:flex;align-items:center;gap:10px;font-size:13px"><span style="font-size:18px">⏳</span><span>Você tem <b style="color:var(--warning)">${fmt(pendentes)}</b> a receber (vendas a prazo)</span></div>`:''}
      <div class="kpi-row" style="margin-bottom:var(--s-4)">
        <div class="kpi-card"><span class="kpi-label">Hoje (pago)</span><span class="kpi-val" style="font-size:15px">${fmt(hoje)}</span></div>
        <div class="kpi-card"><span class="kpi-label">7 dias (pago)</span><span class="kpi-val" style="font-size:15px">${fmt(semana)}</span></div>
        <div class="kpi-card"><span class="kpi-label">A receber</span><span class="kpi-val" style="font-size:15px;color:var(--warning)">${fmt(pendentes)}</span></div>
      </div>
      <!-- Filtros de período -->
      <div style="margin-bottom:var(--s-3)">
        <div class="cat-tabs" style="margin-bottom:var(--s-2)">
          ${PERIODOS.map(([k,l])=>`<button class="cat-tab${filtroPeriodo===k?' on':''}" data-fp="${k}">${l}</button>`).join('')}
        </div>
        ${filtroPeriodo==='custom'?`<div style="display:flex;gap:var(--s-2);align-items:center">
          <div style="font-size:12px;color:var(--text-3);font-weight:600;white-space:nowrap">De</div>
          <input class="field" id="fp-inicio" type="date" value="${periodoInicio}" style="flex:1">
          <div style="font-size:12px;color:var(--text-3);font-weight:600;white-space:nowrap">Até</div>
          <input class="field" id="fp-fim" type="date" value="${periodoFim}" style="flex:1">
        </div>`:''}
      </div>
      <!-- Filtros de status -->
      <div style="display:flex;gap:var(--s-2);margin-bottom:var(--s-4);flex-wrap:wrap">
        ${[['todos','Todas'],['pago','Pagas'],['pendente','A prazo'],['cancelado','Canceladas']].map(([k,l])=>`<button class="cat-tab${filtroStatus===k?' on':''}" data-fs="${k}">${l}</button>`).join('')}
        ${filtroPeriodo!=='tudo'?`<span style="margin-left:auto;font-size:12px;color:var(--brand);font-weight:700;align-self:center">Total: ${fmt(totalFiltrado)}</span>`:''}
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--s-2)">
        ${lista.length===0?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">🛒</div><p style="color:var(--text-3)">Nenhuma venda encontrada</p></div>`
        :lista.map(v=>{
          const _ps=p=>p.metodo==='credito'&&v.parcelas>1?`Crédito ${v.parcelas}x`:PGTO_LABEL[p.metodo];
          const pgtoLabel=v.dividido&&v.pagamentos?v.pagamentos.map(_ps).join(' + '):_ps({metodo:v.pagamento});
          const d=new Date(v.data+'T00:00:00');
          const mes=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
          return `<div class="venda-row">
            <div style="min-width:42px;text-align:center">
              <div style="font-size:12px;font-weight:700;color:var(--text-1)">${d.getDate()}</div>
              <div style="font-size:10px;color:var(--text-3)">${mes[d.getMonth()]}</div>
            </div>
            <div class="venda-row-info">
              <div class="venda-cliente">${v.clienteNome||'Sem cliente'}</div>
              <div class="venda-detalhe">${pgtoLabel} · ${v.itens.map(i=>`${i.emoji} ×${i.qtd}`).join(' ')}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <div class="venda-valor">${fmt(v.total)}</div>
              <span class="venda-status ${v.status}">${v.status==='pago'?'✅ Pago':v.status==='pendente'?'⏳ A prazo':'❌ Cancelado'}</span>
              ${v.status==='pendente'?`<button class="btn btn-ghost btn-sm" data-receber="${v.id}" style="font-size:10px;padding:3px 8px">Receber</button>`:''}
            </div>
          </div>`;
        }).join('')}
      </div>`;

    root.querySelector('#btn-pdv').onclick=()=>{view='pdv';render();};
    root.querySelectorAll('[data-fp]').forEach(b=>b.onclick=()=>{filtroPeriodo=b.dataset.fp;if(filtroPeriodo!=='custom'){periodoInicio='';periodoFim='';}renderHistorico();});
    root.querySelectorAll('[data-fs]').forEach(b=>b.onclick=()=>{filtroStatus=b.dataset.fs;renderHistorico();});
    if(root.querySelector('#fp-inicio'))root.querySelector('#fp-inicio').onchange=e=>{periodoInicio=e.target.value;renderHistorico();};
    if(root.querySelector('#fp-fim'))root.querySelector('#fp-fim').onchange=e=>{periodoFim=e.target.value;renderHistorico();};
    root.querySelectorAll('[data-receber]').forEach(b=>b.onclick=()=>{
      const v=DB.vendas.find(x=>x.id===+b.dataset.receber);if(!v)return;
      Modal.confirm('Marcar como recebido?',`Venda de ${fmt(v.total)} para ${v.clienteNome||'sem cliente'} será marcada como paga.`,()=>{
        v.status='pago';
        v.recebidoEm=offset(0); // Etapa 25A — data real do recebimento (regime de caixa)
        DB.transacoes.unshift({id:nid(),tipo:'entrada',descricao:`Recebimento — ${v.itens.map(i=>i.nome).join(', ')}${v.clienteNome?' ('+v.clienteNome+')':''}`,valor:v.total,cat:'receita',metodo:PGTO_LABEL[v.pagamento]||v.pagamento,data:offset(0)});
        Toast.show('Venda marcada como paga');renderHistorico();
      },'Confirmar recebimento');
    });
  }

  return {render};
})();

/* ═══════════════════════════════════════════════
   ETAPA 10 — PRODUTOS + ESTOQUE + PRECIFICAÇÃO
═══════════════════════════════════════════════ */
function updateEstoqueBadge(){
  const b=document.getElementById('badge-estoque');if(!b)return;
  const n=DB.produtos.filter(p=>p.ativo&&p.estoque<p.estoqueMin).length;
  b.textContent=n;b.style.display=n>0?'':'none';
}
