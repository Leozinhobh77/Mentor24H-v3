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

  let aba='clientes', q='', viewing=null;

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
    return `<div class="toolbar" style="margin-bottom:var(--s-3)">
      <div class="seg">
        <button class="${aba==='clientes'?'on':''}" data-aba="clientes">${svg('users',14)} Clientes</button>
        <button class="${aba==='fornecedores'?'on':''}" data-aba="fornecedores">${svg('box',14)} Fornecedores</button>
      </div>
    </div>`;
  }
  function bindAba(root){
    root.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>{aba=b.dataset.aba;viewing=null;render();});
  }

  /* ── LISTA DE CLIENTES ── */
  function rowHTML(c,m){
    const r=rfm(m);const lim=limiteDe(c);const estouro=m.saldoDevedor>lim;
    return `<div class="ct-item">
      <div class="ct-click" data-open="${c.id}">
        <div class="ct-av" style="background:${avCor(c.nome)}">${ini(c.nome)}</div>
        <div class="ct-main">
          <div class="ct-nm">${c.nome}<span style="font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:var(--r-full);background:${r.bg};color:${r.cor}">${r.e} ${r.l}</span></div>
          <div style="font-size:11.5px;color:var(--text-3);font-weight:600;margin-top:2px">${m.nCompras} compra${m.nCompras!==1?'s':''} · ticket ${fmt(m.ticketMedio)}${m.ultimaCompra?` · últ. ${fmtD(m.ultimaCompra)}`:''}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;padding-right:var(--s-3)">
        ${m.saldoDevedor>0
          ?`<div style="display:flex;align-items:center;gap:4px;font-family:var(--mono);font-weight:800;font-size:13px;color:${estouro?'var(--expense)':'var(--warning)'}" title="${estouro?'Acima do limite de '+fmt(lim):'Saldo devedor'}">${svg(estouro?'alert':'clock',13)} ${fmt(m.saldoDevedor)}</div>`
          :`<span style="font-size:11px;font-weight:700;color:var(--income)">✓ em dia</span>`}
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
    root.innerHTML=`
      ${abaBar()}
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('clock',14)}</span>A receber</div><div class="kv" style="color:${aReceber>0?'var(--warning)':'var(--text-1)'}">${fmt(aReceber)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('users',14)}</span>Clientes</div><div class="kv">${cs.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('alert',14)}</span>Devedores</div><div class="kv">${devedores}</div></div>
      </div>
      ${(reativar.length||nivers.length)?`<div class="card" style="margin-bottom:var(--s-3)">
        <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('zap',16)}</div><h3>Para reativar &amp; lembrar</h3></div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${reativar.map(o=>`<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-2)"><span style="flex:1">💤 <b>${o.c.nome}</b> ${rfm(o.m).l.toLowerCase()}${o.m.ultimaCompra?` · última compra ${fmtD(o.m.ultimaCompra)}`:' · sem compras'}</span>${o.c.telefone?`<a class="docbtn wa" target="_blank" rel="noopener" href="${waLink(o.c.telefone,`Oi ${o.c.nome}! Faz tempo que não te vejo por aqui 😊 Preparei novidades, dá uma passada!`)}" title="Reativar no WhatsApp">${svg('chat',15)}</a>`:''}</div>`).join('')}
          ${nivers.map(o=>{const d=diasAniv(o.c.aniversario);return `<div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-2)"><span style="flex:1">🎂 <b>${o.c.nome}</b> faz aniversário ${d===0?'hoje':'em '+d+'d'}</span>${o.c.telefone?`<a class="docbtn wa" target="_blank" rel="noopener" href="${waLink(o.c.telefone,`Parabéns, ${o.c.nome}! 🎉 Desejo tudo de bom. Passa aqui pra comemorar com um docinho 🎂`)}" title="Parabenizar">${svg('chat',15)}</a>`:''}</div>`;}).join('')}
        </div>
      </div>`:''}
      <div class="toolbar">
        <input class="field grow" placeholder="Buscar cliente…" data-q value="${q}">
      </div>
      <div class="card">
        ${cs.length?cs.map(o=>rowHTML(o.c,o.m)).join(''):`<div class="empty" style="padding:var(--s-6) 0"><div class="eico">${svg('users',24)}</div><h4>Nenhum cliente ainda</h4><p>Clientes aparecem aqui ao registrar vendas ou marcar contatos como "Negócio".</p></div>`}
      </div>`;
    bindAba(root);
    const qi=root.querySelector('[data-q]');if(qi)qi.oninput=e=>{q=e.target.value;render();const n=document.getElementById('clientes-root').querySelector('[data-q]');if(n){n.focus();n.setSelectionRange(q.length,q.length);}};
    root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{viewing=+b.dataset.open;render();});
  }

  /* ── FICHA DO CLIENTE (caderneta + fiado) ── */
  function extratoRow(v){
    const aprazo=v.pagamento==='a_prazo';const restante=v.total-(v.recebido||0);const pend=aprazo&&v.status==='pendente'&&restante>0.001;
    return `<div class="ev-item">
      <div class="ev-time">${v.data.slice(8,10)}/${v.data.slice(5,7)}</div>
      <div class="ev-bar" style="background:${pend?'var(--warning)':'var(--income)'}"></div>
      <div class="ev-main">
        <div class="et">${v.itens.map(i=>`${i.emoji} ${i.nome}×${i.qtd}`).join(', ')}</div>
        <div class="es"><span style="font-family:var(--mono);font-weight:700">${fmt(v.total)}</span> · ${PG[v.pagamento]||v.pagamento} ${pend?`<span style="color:var(--warning);font-weight:700">⏳ deve ${fmt(restante)}</span>`:v.status==='pago'?'<span style="color:var(--income);font-weight:700">✅ pago</span>':''}</div>
      </div>
      ${pend?`<button class="btn btn-primary btn-sm" data-receber="${v.id}" style="font-size:11px;padding:5px 10px">Receber</button>`:''}
    </div>`;
  }
  function renderFicha(c){
    const root=document.getElementById('clientes-root');if(!root)return;
    const m=metricas(c);const r=rfm(m);const tel=(c.telefone||'').replace(/\D/g,'');
    const lim=limiteDe(c);const usoPct=lim?Math.min(100,Math.round(m.saldoDevedor/lim*100)):0;const estouro=m.saldoDevedor>lim;
    const pend=m.vs.filter(v=>v.pagamento==='a_prazo'&&v.status==='pendente');
    const cobrancaMsg=`Oi ${c.nome}! 😊 Passando pra lembrar do valor de ${fmt(m.saldoDevedor)} da(s) sua(s) compra(s)${pend.length?` (a partir de ${fmtD(pend[pend.length-1].data)})`:''}. Quando puder acertar, me avisa? 🙏`;
    root.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:var(--s-5)">
        <button class="btn btn-soft" data-back>${svg('chevleft',16)} Voltar</button>
      </div>
      <div class="bento">
        <div class="card col-12" style="display:flex;align-items:center;gap:var(--s-5);flex-wrap:wrap">
          <div class="ct-av" style="width:64px;height:64px;font-size:22px;background:${avCor(c.nome)}">${ini(c.nome)}</div>
          <div style="flex:1;min-width:160px">
            <div style="font-size:20px;font-weight:800;letter-spacing:-.02em">${c.nome}</div>
            <div style="margin-top:6px"><span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:var(--r-full);background:${r.bg};color:${r.cor}">${r.e} ${r.l}</span></div>
          </div>
          <div style="display:flex;gap:8px">
            ${tel?`<a class="docbtn wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener" title="WhatsApp">${svg('chat',18)}</a><a class="docbtn" href="tel:+55${tel}" title="Ligar">${svg('phone',18)}</a>`:''}
          </div>
        </div>
        <div class="card col-12">
          <div class="kpi-row">
            <div class="kpi-card"><span class="kpi-label">Total gasto</span><span class="kpi-val">${fmt(m.totalGasto)}</span></div>
            <div class="kpi-card"><span class="kpi-label">Compras</span><span class="kpi-val">${m.nCompras}</span></div>
            <div class="kpi-card"><span class="kpi-label">Ticket médio</span><span class="kpi-val">${fmt(m.ticketMedio)}</span></div>
            <div class="kpi-card"><span class="kpi-label">Última compra</span><span class="kpi-val" style="font-size:14px">${fmtD(m.ultimaCompra)}</span></div>
          </div>
        </div>
        <div class="card col-6">
          <div class="card-head"><div class="ico" style="background:${m.saldoDevedor>0?'var(--warning-soft)':'var(--income-soft)'};color:${m.saldoDevedor>0?'var(--warning)':'var(--income)'}">${svg('clock',17)}</div><h3>Caderneta (fiado)</h3></div>
          <div style="font-size:13px;color:var(--text-2);font-weight:600">Saldo devedor</div>
          <div style="font-family:var(--mono);font-size:26px;font-weight:800;color:${m.saldoDevedor>0?(estouro?'var(--expense)':'var(--warning)'):'var(--income)'}">${fmt(m.saldoDevedor)}</div>
          <div style="margin-top:var(--s-3)">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-3);font-weight:600;margin-bottom:4px"><span>Limite de crédito</span><span>${fmt(m.saldoDevedor)} / ${fmt(lim)}</span></div>
            <div class="bar"><div style="height:100%;width:${usoPct}%;background:${estouro?'var(--expense)':usoPct>80?'var(--warning)':'var(--brand)'};transition:width .3s"></div></div>
            ${estouro?`<div style="color:var(--expense);font-weight:700;font-size:11.5px;margin-top:6px;display:flex;align-items:center;gap:5px">${svg('alert',12)} Acima do limite de crédito!</div>`:''}
          </div>
          <div style="display:flex;gap:8px;margin-top:var(--s-4);flex-wrap:wrap">
            <button class="btn btn-soft btn-sm" data-editlim>${svg('pencil',13)} Limite</button>
            ${m.saldoDevedor>0&&tel?`<a class="btn btn-primary btn-sm" href="${waLink(c.telefone,cobrancaMsg)}" target="_blank" rel="noopener" style="text-decoration:none">${svg('chat',14)} Cobrar no WhatsApp</a>`:''}
          </div>
        </div>
        <div class="card col-6">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('zap',17)}</div><h3>Relacionamento</h3></div>
          ${c.aniversario?`<div style="font-size:13px;color:var(--text-2)">🎂 Aniversário: <b>${fmtD(c.aniversario)}</b> · em ${diasAniv(c.aniversario)}d</div>`:`<p style="font-size:12.5px;color:var(--text-4)">Sem aniversário cadastrado.</p>`}
          ${(r.l==='Sumido'||r.l==='Em risco')?`<div style="margin-top:8px;padding:8px 12px;background:var(--warning-soft);border-radius:var(--r-md);font-size:12.5px;color:var(--warning);font-weight:700">⚠️ Cliente ${r.l.toLowerCase()} — vale uma ação de reativação</div>`:''}
          ${c.anotacoes?`<p style="font-size:12.5px;color:var(--text-3);margin-top:8px;line-height:1.5">${c.anotacoes}</p>`:''}
        </div>
        <div class="card col-12">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('repeat',17)}</div><h3>Extrato de compras</h3></div>
          ${m.vs.length?m.vs.map(extratoRow).join(''):`<p style="font-size:12.5px;color:var(--text-4)">Nenhuma compra registrada ainda.</p>`}
        </div>
      </div>`;
    root.querySelector('[data-back]').onclick=()=>{viewing=null;render();};
    root.querySelector('[data-editlim]').onclick=()=>editarLimite(c);
    root.querySelectorAll('[data-receber]').forEach(b=>b.onclick=()=>receberVenda(c,+b.dataset.receber));
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
        ${devo>0?`<div style="font-family:var(--mono);font-weight:800;font-size:13px;color:var(--expense)" title="A pagar">${fmt(devo)}</div>`:''}
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
