const Clientes=(()=>{
  const AVCOR=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
  const hash=s=>[...(s||'')].reduce((a,c)=>a+c.charCodeAt(0),0);
  const avCor=n=>AVCOR[hash(n)%AVCOR.length];
  const ini=n=>(n||'').trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';
  const PG={pix:'Pix',dinheiro:'Dinheiro',debito:'Débito',credito:'Crédito',a_prazo:'A prazo'};
  const LIMITE_DEFAULT=200, RFM_SUMIDO=45;
  const limiteDe=c=>c.limiteCredito!=null?c.limiteCredito:LIMITE_DEFAULT;
  const waLink=(tel,msg)=>`https://wa.me/55${(tel||'').replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`;
  const fmtD=iso=>{if(!iso)return '—';const p=iso.split('-');return `${p[2]}/${p[1]}/${p[0].slice(2)}`;};
  function diasAniv(av){if(!av)return null;const p=av.split('-');const mm=+p[1],dd=+p[2];const h=new Date();h.setHours(0,0,0,0);let nx=new Date(h.getFullYear(),mm-1,dd);if(nx<h)nx=new Date(h.getFullYear()+1,mm-1,dd);return Math.round((nx-h)/86400000);}

  let aba='clientes', q='', viewing=null, devedorFirst=true, _popListeners=false;

  /* ── dados derivados ── */
  const vendasDe=cid=>DB.vendas.filter(v=>v.clienteId===cid);
  function metricas(c){
    const vs=vendasDe(c.id).slice().sort((a,b)=>b.data.localeCompare(a.data));
    const totalGasto=vs.reduce((s,v)=>s+v.total,0);
    const nCompras=vs.length;
    const ticketMedio=nCompras?totalGasto/nCompras:0;
    const ultimaCompra=vs.length?vs[0].data:null;
    const saldoDevedor=vs.filter(v=>v.pagamento==='a_prazo'&&v.status==='pendente').reduce((s,v)=>s+(v.total-(v.recebido||0)),0);
    return {vs,totalGasto,nCompras,ticketMedio,ultimaCompra,saldoDevedor};
  }
  function listaClientes(){
    const seen=new Set(),arr=[];
    DB.contatos.forEach(c=>{if((c.contexto==='negocio'||c.contexto==='ambos')&&!seen.has(c.id)){seen.add(c.id);arr.push(c);}});
    DB.vendas.forEach(v=>{if(v.clienteId&&!seen.has(v.clienteId)){const c=DB.contatos.find(x=>x.id===v.clienteId);if(c){seen.add(c.id);arr.push(c);}}});
    return arr;
  }
  // RFM por regra (Recência + Frequência + Valor) — sem IA
  function rfm(m){
    if(m.nCompras===0)return{l:'Novo',e:'✨',cor:'var(--text-3)',bg:'var(--surface-3)'};
    const dd=m.ultimaCompra?-diasAte(m.ultimaCompra):999;
    if(dd>RFM_SUMIDO)return m.nCompras>=3?{l:'Em risco',e:'⚠️',cor:'var(--warning)',bg:'var(--warning-soft)'}:{l:'Sumido',e:'💤',cor:'var(--expense)',bg:'var(--expense-soft)'};
    if(m.nCompras>=3&&m.totalGasto>=200)return{l:'Campeão',e:'🏆',cor:'var(--income)',bg:'var(--income-soft)'};
    if(m.nCompras>=2)return{l:'Fiel',e:'💚',cor:'var(--brand-text)',bg:'var(--brand-soft)'};
    return{l:'Ativo',e:'🙂',cor:'var(--info)',bg:'var(--info-soft)'};
  }
  // Semente para o Mentor (Etapa 14) — insights por regra, função pura
  function insightsClientes(){
    const out=[];
    listaClientes().forEach(c=>{
      const m=metricas(c);
      if(m.saldoDevedor>0){const dd=m.ultimaCompra?-diasAte(m.ultimaCompra):null;out.push({tipo:'fiado',cliente:c.nome,texto:`${c.nome} deve ${fmt(m.saldoDevedor)}${dd!=null?` (última compra há ${dd}d)`:''}`});}
      const r=rfm(m);
      if(r.l==='Sumido'||r.l==='Em risco')out.push({tipo:'winback',cliente:c.nome,texto:`${c.nome} está ${r.l.toLowerCase()} — vale um contato de reativação`});
    });
    return out;
  }

  /* ── render principal ── */
  function render(){
    const root=document.getElementById('clientes-root');if(!root)return;
    if(aba==='fornecedores'){renderFornecedores(root);return;}
    if(viewing){const c=DB.contatos.find(x=>x.id===viewing);if(c){renderFicha(c);return;}viewing=null;}
    renderLista(root);
  }
  function abaBar(){
    return `<div class="ct-toolbar">
      <div class="ct-seg">
        <button class="${aba==='clientes'?'on':''}" data-aba="clientes">${svg('users',14)} Clientes</button>
        <button class="${aba==='fornecedores'?'on':''}" data-aba="fornecedores">${svg('box',14)} Fornecedores</button>
      </div>
    </div>`;
  }
  function bindAba(root){
    root.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>{aba=b.dataset.aba;viewing=null;render();});
  }

  /* ── LISTA DE CLIENTES ── */
  function editarContatoNeg(c){
    Modal.open('Editar contato',`
      <div class="fg"><label>Nome*</label><input class="field" id="ecn-nome" value="${c.nome.replace(/"/g,'&quot;')}"></div>
      <div class="fg"><label>Telefone / WhatsApp</label><input class="field" id="ecn-tel" value="${(c.telefone||'').replace(/"/g,'&quot;')}" placeholder="(31) 90000-0000"></div>
      <div class="fg"><label>Aniversário</label><input class="field" id="ecn-aniv" type="date" value="${c.aniversario||''}"></div>
      <div class="fg"><label>Limite de crédito (R$)</label><input class="field" id="ecn-lim" type="number" min="0" step="10" value="${limiteDe(c)}"></div>
      <div class="fg"><label>Anotações</label><textarea class="field" id="ecn-obs" rows="2" style="resize:vertical">${(c.anotacoes||'').replace(/</g,'&lt;')}</textarea></div>
    `,(b)=>{
      const nome=b.querySelector('#ecn-nome').value.trim();
      if(!nome){Toast.show('Informe o nome','err');return false;}
      c.nome=nome;c.telefone=b.querySelector('#ecn-tel').value.trim();
      c.aniversario=b.querySelector('#ecn-aniv').value||null;
      c.limiteCredito=+b.querySelector('#ecn-lim').value||0;
      c.anotacoes=b.querySelector('#ecn-obs').value.trim();
      Toast.show('Contato atualizado');render();
    },'Salvar');
  }
  function rowHTML(c,m){
    const r=rfm(m);const lim=limiteDe(c);const estouro=m.saldoDevedor>lim;
    const cake=diasAniv(c.aniversario);
    const saldoChip=m.saldoDevedor>0
      ?`<span class="ct-saldo ${estouro?'estouro':'deve'}">⏱ deve ${fmt(m.saldoDevedor)}</span>`
      :`<span class="ct-saldo ok">✓ em dia</span>`;
    return `<div class="ct-itemwrap">
      <div class="ct-item">
        <div class="ct-click" data-open="${c.id}">
          <div class="ct-av" style="background:${avCor(c.nome)}">${ini(c.nome)}</div>
          <div class="ct-main">
            <div class="ct-l1"><span class="ct-nm">${c.nome}</span></div>
            <div class="ct-l2">
              <span class="ct-rfm" style="background:${r.bg};color:${r.cor}">${r.e} ${r.l}</span>
              <span class="ct-meta">${m.nCompras} compra${m.nCompras!==1?'s':''}${m.ultimaCompra?` · últ. ${fmtD(m.ultimaCompra)}`:''}</span>
              ${cake!=null&&cake<=7?`<span class="ct-chip-cake">🎂 ${cake===0?'hoje':cake+'d'}</span>`:''}
              ${saldoChip}
            </div>
          </div>
        </div>
        <div class="ct-acts">
          ${c.telefone?`<a class="docbtn wa" href="${waLink(c.telefone,'Oi '+c.nome+'!')}" target="_blank" rel="noopener" title="WhatsApp" aria-label="WhatsApp ${c.nome}">${svg('chat',17)}</a>`:''}
          <button class="docbtn acts" data-pop="${c.id}" title="Ações rápidas" aria-label="Ações rápidas — ${c.nome}">${svg('zap',17)}</button>
        </div>
      </div>
      <div class="ct-pop" id="ct-pop-${c.id}">
        <div class="ct-pop-h"><div class="ct-pop-av" style="background:${avCor(c.nome)}">${ini(c.nome)}</div><b>${c.nome}</b></div>
        <div class="ct-pop-sec">Enviar pro cliente</div>
        <div class="ct-pop-it" data-act="venda" data-cid="${c.id}"><span class="e">🛒</span> Registrar venda</div>
        <div class="ct-pop-it" data-act="cardapio"><span class="e">📋</span> Enviar cardápio</div>
        <div class="ct-pop-it" data-act="orcamento"><span class="e">🧾</span> Enviar orçamento</div>
        <div class="ct-pop-it" data-act="recibo"><span class="e">📃</span> Enviar recibo</div>
        <div class="ct-pop-div"></div>
        <div class="ct-pop-sec">Contato</div>
        <div class="ct-pop-it" data-act="editar" data-cid="${c.id}"><span class="e">✏️</span> Editar</div>
        <div class="ct-pop-it danger" data-act="excluir" data-cid="${c.id}"><span class="e">🗑️</span> Excluir</div>
      </div>
    </div>`;
  }
  function renderLista(root){
    let cs=listaClientes().map(c=>({c,m:metricas(c)}));
    if(q){const qq=q.toLowerCase();cs=cs.filter(o=>o.c.nome.toLowerCase().includes(qq));}
    cs.sort((a,b)=>b.m.saldoDevedor-a.m.saldoDevedor||a.c.nome.localeCompare(b.c.nome,'pt'));
    const aReceber=cs.reduce((s,o)=>s+o.m.saldoDevedor,0);
    const devedores=cs.filter(o=>o.m.saldoDevedor>0).length;
    const reativar=cs.filter(o=>{const l=rfm(o.m).l;return l==='Sumido'||l==='Em risco';});
    const nivers=cs.filter(o=>{const d=diasAniv(o.c.aniversario);return d!=null&&d<=7;});
    let listHTML='';
    if(devedorFirst){
      const comPend=cs.filter(o=>o.m.saldoDevedor>0);
      const emDia=cs.filter(o=>o.m.saldoDevedor<=0);
      if(comPend.length)listHTML+=`<div class="ct-group deve">Com pendência <span class="cnt">· ${comPend.length}</span></div>`+comPend.map(o=>rowHTML(o.c,o.m)).join('');
      if(emDia.length)listHTML+=`<div class="ct-group ok">Em dia <span class="cnt">· ${emDia.length}</span></div>`+emDia.map(o=>rowHTML(o.c,o.m)).join('');
    } else {
      cs.sort((a,b)=>a.c.nome.localeCompare(b.c.nome,'pt'));
      listHTML=cs.map(o=>rowHTML(o.c,o.m)).join('');
    }
    root.innerHTML=`<div class="ct-page">
      ${abaBar()}
      <div class="ct-kpis">
        <div class="ct-kpi"><div class="ct-kpi-l"><span class="dot" style="background:var(--warning-soft);color:var(--warning)">⏱</span>A receber</div><div class="ct-kpi-v" style="color:${aReceber>0?'var(--warning)':'var(--text-1)'}">${fmt(aReceber)}</div></div>
        <div class="ct-kpi"><div class="ct-kpi-l"><span class="dot" style="background:var(--brand-soft);color:var(--brand-text)">👥</span>Clientes</div><div class="ct-kpi-v">${cs.length}</div></div>
        <div class="ct-kpi"><div class="ct-kpi-l"><span class="dot" style="background:var(--expense-soft);color:var(--expense)">⚠</span>Devedores</div><div class="ct-kpi-v">${devedores}</div></div>
      </div>
      <div class="ct-toolbar">
        <div class="ct-search"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-4)" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></svg><input placeholder="Buscar cliente…" data-q value="${q}"></div>
      </div>
      <div class="ct-filter">
        <span class="ct-filter-lab">Ordem</span>
        <div class="ct-toggle" data-toggle-dev><span>⚠️ Devedores primeiro</span><div class="ct-switch${devedorFirst?' on':''}"></div></div>
      </div>
      ${(reativar.length||nivers.length)?`<div class="ct-nudge">
        <div class="ct-nudge-h"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('zap',14)}</div><h3>Para reativar &amp; lembrar</h3></div>
        ${reativar.map(o=>`<div class="ct-nudge-row"><span class="txt">💤 <b>${o.c.nome}</b> ${rfm(o.m).l.toLowerCase()}${o.m.ultimaCompra?` · última compra ${fmtD(o.m.ultimaCompra)}`:' · sem compras'}</span>${o.c.telefone?`<a class="ct-mini-wa" href="${waLink(o.c.telefone,'Oi '+o.c.nome+'! Faz tempo que não te vejo por aqui 😊 Preparei novidades, dá uma passada!')}" target="_blank" rel="noopener">${svg('chat',15)}</a>`:''}</div>`).join('')}
        ${nivers.map(o=>{const d=diasAniv(o.c.aniversario);return `<div class="ct-nudge-row"><span class="txt">🎂 <b>${o.c.nome}</b> faz aniversário ${d===0?'hoje':'em '+d+'d'}</span>${o.c.telefone?`<a class="ct-mini-wa" href="${waLink(o.c.telefone,'Parabéns, '+o.c.nome+'! 🎉 Desejo tudo de bom. Passa aqui pra comemorar com um docinho 🎂')}" target="_blank" rel="noopener">${svg('chat',15)}</a>`:''}</div>`;}).join('')}
      </div>`:''}
      ${cs.length?listHTML:`<div class="empty" style="padding:var(--s-6) var(--s-4)"><div class="eico">${svg('users',24)}</div><h4>Nenhum cliente ainda</h4><p>Clientes aparecem ao registrar vendas ou marcar contatos como "Negócio".</p></div>`}
    </div>`;
    bindAba(root);
    const qi=root.querySelector('[data-q]');
    if(qi)qi.oninput=e=>{q=e.target.value;render();const n=document.getElementById('clientes-root').querySelector('[data-q]');if(n){n.focus();n.setSelectionRange(q.length,q.length);}};
    root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{viewing=+b.dataset.open;render();});
    const tog=root.querySelector('[data-toggle-dev]');
    if(tog)tog.onclick=()=>{devedorFirst=!devedorFirst;render();};
    // Popover: toggle
    root.querySelectorAll('[data-pop]').forEach(btn=>{
      btn.onclick=e=>{
        e.stopPropagation();
        const pop=root.querySelector('#ct-pop-'+btn.dataset.pop);
        const isOpen=pop&&pop.classList.contains('show');
        root.querySelectorAll('.ct-pop.show').forEach(p=>p.classList.remove('show'));
        if(pop&&!isOpen)pop.classList.add('show');
      };
    });
    // Popover: actions (delegated to root; stopPropagation prevents reaching document)
    root.addEventListener('click',e=>{
      const it=e.target.closest('[data-act]');if(!it)return;
      e.stopPropagation();
      const act=it.dataset.act,cid=it.dataset.cid?+it.dataset.cid:null;
      const c=cid?DB.contatos.find(x=>x.id===cid):null;
      root.querySelectorAll('.ct-pop.show').forEach(p=>p.classList.remove('show'));
      if(act==='venda'&&c)Vendas.novaVenda(c.id);
      else if(act==='excluir'&&c)Modal.confirm('Excluir contato?',`"${c.nome}" será removido permanentemente.`,()=>{DB.contatos=DB.contatos.filter(x=>x.id!==c.id);Toast.show('Contato removido');render();});
      else if(act==='editar'&&c)editarContatoNeg(c);
      else Toast.show('Em breve 🚧');
    });
    // Global close: outside click (skip if inside .ct-pop) + ESC (attach once per page load)
    if(!_popListeners){
      _popListeners=true;
      document.addEventListener('click',e=>{if(e.target.closest('.ct-pop'))return;const r=document.getElementById('clientes-root');if(r)r.querySelectorAll('.ct-pop.show').forEach(p=>p.classList.remove('show'));});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'){const r=document.getElementById('clientes-root');if(r)r.querySelectorAll('.ct-pop.show').forEach(p=>p.classList.remove('show'));}});
    }
  }

  /* ── FICHA DO CLIENTE (caderneta + fiado) — padrão .ctf-* (F2) ── */
  function extratoRow(v){
    const aprazo=v.pagamento==='a_prazo';const restante=v.total-(v.recebido||0);const pend=aprazo&&v.status==='pendente'&&restante>0.001;
    return `<div class="ctf-ev">
      <div class="ctf-ev-dt">${v.data.slice(8,10)}/${v.data.slice(5,7)}</div>
      <div class="ctf-ev-bar" style="background:${pend?'var(--warning)':'var(--income)'}"></div>
      <div class="ctf-ev-mn">
        <div class="ctf-ev-et">${v.itens.map(i=>`${i.emoji} ${i.nome}×${i.qtd}`).join(', ')}</div>
        <div class="ctf-ev-es"><b style="font-family:var(--mono);color:var(--text-1)">${fmt(v.total)}</b> · ${PG[v.pagamento]||v.pagamento}${pend?` · <span style="color:var(--warning);font-weight:700">⏳ deve ${fmt(restante)}</span>`:v.status==='pago'?` · <span style="color:var(--income);font-weight:700">✅ pago</span>`:''}</div>
      </div>
      ${pend?`<button class="btn btn-primary btn-sm" data-receber="${v.id}" style="font-size:11px;padding:6px 11px;flex-shrink:0">Receber</button>`:''}
    </div>`;
  }
  // Janelinha (popover) de ações — reusa o markup/visual da F1 (.ct-pop), com data-fpop/data-fact próprios da ficha
  function popHTML(c){
    return `<div class="ct-pop" id="ctf-pop">
      <div class="ct-pop-h"><div class="ct-pop-av" style="background:${avCor(c.nome)}">${ini(c.nome)}</div><b>${c.nome}</b></div>
      <div class="ct-pop-sec">Enviar pro cliente</div>
      <div class="ct-pop-it" data-fact="venda"><span class="e">🛒</span> Registrar venda</div>
      <div class="ct-pop-it" data-fact="cardapio"><span class="e">📋</span> Enviar cardápio</div>
      <div class="ct-pop-it" data-fact="orcamento"><span class="e">🧾</span> Enviar orçamento</div>
      <div class="ct-pop-it" data-fact="recibo"><span class="e">📃</span> Enviar recibo</div>
      <div class="ct-pop-div"></div>
      <div class="ct-pop-sec">Contato</div>
      <div class="ct-pop-it" data-fact="editar"><span class="e">✏️</span> Editar</div>
      <div class="ct-pop-it danger" data-fact="excluir"><span class="e">🗑️</span> Excluir</div>
    </div>`;
  }
  // Fecha qualquer .ct-pop aberta por clique-fora + ESC (idempotente via _popListeners; compartilhado com a lista)
  function ensurePopListeners(){
    if(_popListeners)return;
    _popListeners=true;
    document.addEventListener('click',e=>{if(e.target.closest('.ct-pop'))return;const r=document.getElementById('clientes-root');if(r)r.querySelectorAll('.ct-pop.show').forEach(p=>p.classList.remove('show'));});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){const r=document.getElementById('clientes-root');if(r)r.querySelectorAll('.ct-pop.show').forEach(p=>p.classList.remove('show'));}});
  }
  function renderFicha(c){
    const root=document.getElementById('clientes-root');if(!root)return;
    const m=metricas(c);const r=rfm(m);const tel=(c.telefone||'').replace(/\D/g,'');
    const lim=limiteDe(c);const usoPct=lim?Math.min(100,Math.round(m.saldoDevedor/lim*100)):0;const estouro=m.saldoDevedor>lim;
    const pend=m.vs.filter(v=>v.pagamento==='a_prazo'&&v.status==='pendente');
    const cobrancaMsg=`Oi ${c.nome}! 😊 Passando pra lembrar do valor de ${fmt(m.saldoDevedor)} da(s) sua(s) compra(s)${pend.length?` (a partir de ${fmtD(pend[pend.length-1].data)})`:''}. Quando puder acertar, me avisa? 🙏`;
    const corSaldo=m.saldoDevedor>0?(estouro?'var(--expense)':'var(--warning)'):'var(--income)';
    const corBar=estouro?'var(--expense)':usoPct>80?'var(--warning)':'var(--brand)';
    const corCadIco=m.saldoDevedor>0?(estouro?'var(--expense)':'var(--warning)'):'var(--income)';
    const bgCadIco=m.saldoDevedor>0?(estouro?'var(--expense-soft)':'var(--warning-soft)'):'var(--income-soft)';
    root.innerHTML=`
      <div class="ctf-head"><button class="ctf-back" data-back>${svg('chevleft',16)} Voltar</button></div>

      <div class="ctf-hero" style="position:relative">
        <div class="ct-av" style="background:${avCor(c.nome)}">${ini(c.nome)}</div>
        <div class="ctf-nm">${c.nome}</div>
        <div><span class="ctf-score" style="background:${r.bg};color:${r.cor}">${r.e} ${r.l}</span></div>
        <div class="ctf-pills">
          ${tel?`<a class="ctf-pill ctf-pill-wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener">${svg('chat',16)} WhatsApp</a>
          <a class="ctf-pill" href="tel:+55${tel}">${svg('phone',16)} Ligar</a>`:''}
          <button class="ctf-pill ctf-pill-acts" data-fpop>${svg('zap',16)} Ações</button>
        </div>
        ${popHTML(c)}
      </div>

      <div class="ctf-cards">
        <div class="ctf-card">
          <div class="ctf-chead"><div class="ctf-cico" style="background:${bgCadIco};color:${corCadIco}">${svg('clock',16)}</div><h3>Caderneta (fiado)</h3></div>
          <div class="cad-lab">Saldo devedor</div>
          <div class="cad-val" style="color:${corSaldo}">${fmt(m.saldoDevedor)}</div>
          <div class="cad-limrow"><span>Limite de crédito</span><span>${fmt(m.saldoDevedor)} / ${fmt(lim)}</span></div>
          <div class="cad-bar"><div style="width:${usoPct}%;background:${corBar}"></div></div>
          ${estouro?`<div class="ctf-alert">${svg('alert',12)} Acima do limite de crédito!</div>`:''}
          <div class="ctf-btns">
            <button class="ctf-btn ctf-btn-soft" data-editlim>${svg('pencil',13)} Limite</button>
            ${m.saldoDevedor>0&&tel?`<a class="ctf-btn ctf-btn-pri" href="${waLink(c.telefone,cobrancaMsg)}" target="_blank" rel="noopener" style="text-decoration:none">${svg('chat',14)} Cobrar no WhatsApp</a>`:''}
          </div>
        </div>

        <div class="ctf-card">
          <div class="ctf-chead"><div class="ctf-cico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('chart',16)}</div><h3>Resumo</h3></div>
          <div class="fk-grid">
            <div class="fk"><div class="fk-l">Total gasto</div><div class="fk-v">${fmt(m.totalGasto)}</div></div>
            <div class="fk"><div class="fk-l">Compras</div><div class="fk-v">${m.nCompras}</div></div>
            <div class="fk"><div class="fk-l">Ticket médio</div><div class="fk-v">${fmt(m.ticketMedio)}</div></div>
            <div class="fk"><div class="fk-l">Última compra</div><div class="fk-v" style="font-size:15px">${fmtD(m.ultimaCompra)}</div></div>
          </div>
        </div>

        <div class="ctf-card">
          <div class="ctf-chead"><div class="ctf-cico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('zap',16)}</div><h3>Relacionamento</h3></div>
          ${c.aniversario?`<div class="ctf-kv">🎂 Aniversário: <b>${fmtD(c.aniversario)}</b> · em ${diasAniv(c.aniversario)}d</div>`:`<div class="ctf-kv" style="color:var(--text-4)">Sem aniversário cadastrado.</div>`}
          ${(r.l==='Sumido'||r.l==='Em risco')?`<div class="ctf-prox" style="background:var(--warning-soft);color:var(--warning)"><span>⚠️ Cliente ${r.l.toLowerCase()} — vale uma ação de reativação</span></div>`:''}
          ${c.anotacoes?`<div class="ctf-notetxt">${c.anotacoes}</div>`:''}
        </div>

        <div class="ctf-card ctf-card--full">
          <div class="ctf-chead"><div class="ctf-cico" style="background:var(--info-soft);color:var(--info)">${svg('repeat',16)}</div><h3>Extrato de compras</h3></div>
          ${m.vs.length?m.vs.map(extratoRow).join(''):`<div class="ctf-kv" style="color:var(--text-4)">Nenhuma compra registrada ainda.</div>`}
        </div>
      </div>`;
    root.querySelector('[data-back]').onclick=()=>{viewing=null;render();};
    const elLim=root.querySelector('[data-editlim]');if(elLim)elLim.onclick=()=>editarLimite(c);
    root.querySelectorAll('[data-receber]').forEach(b=>b.onclick=()=>receberVenda(c,+b.dataset.receber));
    // ⚡ Ações — janelinha da ficha (fecha por clique-fora/ESC via listeners globais do módulo)
    const popBtn=root.querySelector('[data-fpop]'),pop=root.querySelector('#ctf-pop');
    if(popBtn&&pop){
      popBtn.onclick=e=>{e.stopPropagation();const open=pop.classList.contains('show');root.querySelectorAll('.ct-pop.show').forEach(p=>p.classList.remove('show'));if(!open)pop.classList.add('show');};
      root.querySelectorAll('[data-fact]').forEach(it=>{it.onclick=e=>{
        e.stopPropagation();pop.classList.remove('show');
        const act=it.dataset.fact;
        if(act==='venda')Vendas.novaVenda(c.id);
        else if(act==='editar')editarContatoNeg(c);
        else if(act==='excluir')Modal.confirm('Excluir contato?',`"${c.nome}" será removido permanentemente.`,()=>{DB.contatos=DB.contatos.filter(x=>x.id!==c.id);Toast.show('Contato removido');viewing=null;render();});
        else Toast.show('Em breve 🚧');
      };});
    }
    ensurePopListeners();
  }
  function receberVenda(c,vid){
    const v=DB.vendas.find(x=>x.id===vid);if(!v)return;
    const restante=v.total-(v.recebido||0);
    Modal.open('Receber pagamento',`
      <p style="font-size:13px;color:var(--text-3);margin:0 0 var(--s-3)">Compra de ${fmtD(v.data)} · falta <b style="color:var(--warning)">${fmt(restante)}</b>. Receba o total ou um valor parcial.</p>
      <div class="fg"><label>Valor recebido (R$)</label><input class="field" id="rb-val" type="number" step="0.01" min="0.01" max="${restante}" value="${restante.toFixed(2)}"></div>
    `,(b)=>{
      const val=Math.round((+b.querySelector('#rb-val').value||0)*100)/100;
      if(!val||val<=0||val>restante+0.001){Toast.show('Informe um valor entre 0 e '+fmt(restante),'err');return false;}
      v.recebido=Math.round(((v.recebido||0)+val)*100)/100;
      DB.transacoes.unshift({id:nid(),tipo:'entrada',descricao:`Recebimento — ${c.nome}`,valor:val,cat:'receita',metodo:'A prazo',data:offset(0)});
      if(v.recebido>=v.total-0.001){v.status='pago';Toast.show('Fiado quitado! ✅');}
      else Toast.show(`Recebido ${fmt(val)} · resta ${fmt(v.total-v.recebido)}`);
      renderFicha(c);
    },'Receber');
  }
  function editarLimite(c){
    Modal.open('Limite de crédito',`
      <div class="fg"><label>Limite para ${c.nome} (R$)</label><input class="field" id="lim-val" type="number" step="10" min="0" value="${limiteDe(c)}"></div>
      <p style="font-size:12px;color:var(--text-3);margin:0">Acima desse valor em fiado, o cliente é sinalizado em vermelho.</p>
    `,(b)=>{
      const v=+b.querySelector('#lim-val').value;if(isNaN(v)||v<0){Toast.show('Valor inválido','err');return false;}
      c.limiteCredito=v;Toast.show('Limite atualizado');renderFicha(c);
    },'Salvar');
  }

  /* ── FORNECEDORES ── */
  const devoFornecedor=fid=>DB.contas.filter(c=>c.tipo==='pagar'&&c.status==='pendente'&&c.fornecedorId===fid).reduce((s,c)=>s+c.valor,0);
  function fornHTML(f){
    const devo=devoFornecedor(f.id);const tel=(f.telefone||'').replace(/\D/g,'');
    return `<div class="ct-item">
      <div class="ct-click" style="cursor:default">
        <div class="ct-av" style="background:${avCor(f.nome)}">${ini(f.nome)}</div>
        <div class="ct-main">
          <div class="ct-nm">${f.nome}</div>
          <div style="font-size:11.5px;color:var(--text-3);font-weight:600;margin-top:2px">${f.oqueFornece||'—'}${f.condicaoPgto?` · ${f.condicaoPgto}`:''}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;padding-right:var(--s-3)">
        ${devo>0?`<div style="font-family:var(--mono);font-weight:800;font-size:13px;color:var(--expense)" title="A pagar">${fmt(devo)}</div>
        <button class="btn btn-soft btn-sm" data-payf="${f.id}" title="Registrar pagamento (vira saída no caixa)">${svg('tick',13)} Paguei</button>`:''}
        ${tel?`<a class="docbtn wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener" title="WhatsApp">${svg('chat',15)}</a>`:''}
        <button class="docbtn" data-editf="${f.id}" title="Editar">${svg('pencil',15)}</button>
        <button class="docbtn" data-delf="${f.id}" title="Excluir">${svg('trash',15)}</button>
      </div>
    </div>`;
  }
  function reposicaoCard(repo){
    const byForn={};repo.forEach(p=>{const k=p.fornecedorId||'_';(byForn[k]=byForn[k]||[]).push(p);});
    const grupos=Object.entries(byForn).map(([k,prods])=>{
      const f=k!=='_'?DB.fornecedores.find(x=>x.id===+k):null;
      const nome=f?f.nome:'Sem fornecedor definido';
      const chips=prods.map(p=>`${p.emoji} ${p.nome} (${p.estoque}/${p.estoqueMin})`);
      const msg=`Olá${f?' '+f.nome:''}! Preciso repor:\n${prods.map(p=>`• ${p.nome} — tenho ${p.estoque} un.`).join('\n')}\nConsegue me passar disponibilidade e valor? Obrigado!`;
      return `<div style="padding:var(--s-3) 0;border-top:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <b style="font-size:13px;color:var(--text-1)">${nome}</b>
          ${f&&f.telefone?`<a class="btn btn-soft btn-sm" href="${waLink(f.telefone,msg)}" target="_blank" rel="noopener" style="margin-left:auto;text-decoration:none">${svg('chat',13)} Enviar lista</a>`:''}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">${chips.map(t=>`<span style="font-size:11.5px;background:var(--surface-2);color:var(--text-2);padding:3px 9px;border-radius:var(--r-full)">${t}</span>`).join('')}</div>
      </div>`;
    }).join('');
    return `<div class="card" style="margin-bottom:var(--s-3)">
      <div class="card-head"><div class="ico" style="background:var(--warning-soft);color:var(--warning)">${svg('alert',16)}</div><h3>Lista de reposição (estoque baixo)</h3></div>
      ${grupos}
    </div>`;
  }
  function renderFornecedores(root){
    const fs=DB.fornecedores.slice().sort((a,b)=>a.nome.localeCompare(b.nome,'pt'));
    const totalDevo=fs.reduce((s,f)=>s+devoFornecedor(f.id),0);
    const repo=DB.produtos.filter(p=>p.ativo&&p.estoque<p.estoqueMin);
    root.innerHTML=`
      ${abaBar()}
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('box',14)}</span>Fornecedores</div><div class="kv">${fs.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('wallet',14)}</span>A pagar</div><div class="kv" style="color:${totalDevo>0?'var(--expense)':'var(--text-1)'}">${fmt(totalDevo)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('alert',14)}</span>Repor</div><div class="kv">${repo.length}</div></div>
      </div>
      <div class="toolbar"><div style="flex:1"></div><button class="btn btn-primary" data-addf>${svg('plus',16)} Novo fornecedor</button></div>
      ${repo.length?reposicaoCard(repo):''}
      <div class="card">
        ${fs.length?fs.map(fornHTML).join(''):`<div class="empty" style="padding:var(--s-6) 0"><div class="eico">${svg('box',24)}</div><h4>Nenhum fornecedor</h4><p>Cadastre quem te abastece pra controlar o que deve e repor.</p></div>`}
      </div>`;
    bindAba(root);
    root.querySelector('[data-addf]').onclick=()=>formForn();
    root.querySelectorAll('[data-editf]').forEach(b=>b.onclick=()=>formForn(+b.dataset.editf));
    root.querySelectorAll('[data-delf]').forEach(b=>b.onclick=()=>{const f=DB.fornecedores.find(x=>x.id===+b.dataset.delf);Modal.confirm('Excluir fornecedor?',`"${f.nome}" será removido.`,()=>{DB.fornecedores=DB.fornecedores.filter(x=>x.id!==f.id);Toast.show('Fornecedor excluído');render();});});
    // Etapa 25A — "✓ Paguei": abate a dívida (contas pendentes) e vira saída no caixa (DB.despesasNeg)
    root.querySelectorAll('[data-payf]').forEach(b=>b.onclick=()=>{
      const f=DB.fornecedores.find(x=>x.id===+b.dataset.payf);if(!f)return;
      const devo=devoFornecedor(f.id);
      Modal.open(`Pagar ${f.nome}`,`
        <p style="font-size:13px;color:var(--text-2);margin-bottom:var(--s-3)">Dívida atual: <b style="color:var(--expense)">${fmt(devo)}</b></p>
        <div class="fg"><label>Valor pago (R$)</label><input class="field" id="pf-valor" type="number" min="0" step="0.01" value="${devo}"></div>`,
        bb=>{
          const valor=+bb.querySelector('#pf-valor').value||0;
          if(valor<=0){Toast.show('Informe o valor','err');return false;}
          let resta=valor;
          DB.contas.filter(c=>c.tipo==='pagar'&&c.status==='pendente'&&c.fornecedorId===f.id)
            .sort((a,c2)=>(a.venc||'').localeCompare(c2.venc||''))
            .forEach(c=>{if(resta<=0)return;
              if(resta>=c.valor){resta-=c.valor;c.status='paga';}
              else{c.valor-=resta;resta=0;}});
          DB.despesasNeg.push({id:nid(),desc:`Pagamento — ${f.nome}`,categoria:'insumos',valor,tipo:'variavel',recorrencia:null,parcelas:null,pago:true,vencimento:offset(0),pagoEm:offset(0),fornecedorId:f.id});
          Toast.show('Pagamento registrado no caixa');render();
        },'Confirmar pagamento');
    });
  }
  function formForn(id){
    const f=id?DB.fornecedores.find(x=>x.id===id):null;
    Modal.open(id?'Editar fornecedor':'Novo fornecedor',`
      <div class="fg"><label>Nome</label><input class="field" id="ff-nome" value="${f?f.nome.replace(/"/g,'&quot;'):''}" placeholder="Ex: Distribuidora de Embalagens"></div>
      <div class="frow"><div class="fg"><label>Telefone / WhatsApp</label><input class="field" id="ff-tel" value="${f?f.telefone||'':''}" placeholder="(31) 90000-0000"></div><div class="fg"><label>Condição de pagamento</label><input class="field" id="ff-cond" value="${f&&f.condicaoPgto?f.condicaoPgto.replace(/"/g,'&quot;'):''}" placeholder="30 dias, à vista…"></div></div>
      <div class="fg"><label>O que fornece</label><input class="field" id="ff-forn" value="${f&&f.oqueFornece?f.oqueFornece.replace(/"/g,'&quot;'):''}" placeholder="Embalagens, insumos…"></div>
      <div class="fg"><label>Anotações</label><input class="field" id="ff-obs" value="${f&&f.anotacoes?f.anotacoes.replace(/"/g,'&quot;'):''}" placeholder="Observações"></div>
    `,(b)=>{
      const nome=b.querySelector('#ff-nome').value.trim();if(!nome){Toast.show('Informe o nome','err');return false;}
      const dd={nome,telefone:b.querySelector('#ff-tel').value.trim(),condicaoPgto:b.querySelector('#ff-cond').value.trim(),oqueFornece:b.querySelector('#ff-forn').value.trim(),anotacoes:b.querySelector('#ff-obs').value.trim()};
      if(f){Object.assign(f,dd);Toast.show('Fornecedor atualizado');}else{DB.fornecedores.push(Object.assign({id:nid()},dd));Toast.show('Fornecedor adicionado');}
      render();
    },id?'Salvar':'Adicionar');
  }

  return {render,insightsClientes};
})();

/* ═══════════════════════════════════════════════
   ETAPA 13 — RELATÓRIOS DO NEGÓCIO (KPIs, Lucro, ABC, Pagamentos)
═══════════════════════════════════════════════ */
