/* ═══ ENCOMENDAS / PEDIDOS (modo Negócio) — Etapa 24 ═══
   Cliente encomenda pra uma DATA, com itens, sinal e STATUS (A fazer → Produzindo → Pronto → Entregue).
   Avançar status, avisar no WhatsApp, KPIs. Só LÊ DB.produtos/DB.negocio. */
const Encomendas=(()=>{
  let filtro='todas';

  const esc=s=>(s+'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const STATUS=[['afazer','A fazer'],['produzindo','Produzindo'],['pronto','Pronto'],['entregue','Entregue']];
  const STLABEL=Object.fromEntries(STATUS);
  const proxStatus=s=>({afazer:'produzindo',produzindo:'pronto',pronto:'entregue'}[s]||null);
  const total=e=>(e.itens||[]).reduce((s,it)=>s+(+it.qtd||0)*(+it.valor||0),0);
  const restante=e=>Math.max(0,total(e)-(+e.sinal||0));
  const diasAte=iso=>Math.round((new Date(iso+'T00:00:00')-new Date(offset(0)+'T00:00:00'))/86400000);
  function labelData(iso){const d=diasAte(iso);if(d===0)return 'Hoje';if(d===1)return 'Amanhã';if(d===-1)return 'Ontem';const p=iso.split('-');return `${p[2]}/${p[1]}`;}
  const resumoItens=e=>(e.itens||[]).map(it=>`${it.qtd}× ${it.desc}`).join(' · ');

  function kpis(){
    const ativas=DB.encomendas.filter(e=>e.status!=='entregue');
    const hoje=ativas.filter(e=>diasAte(e.data)===0).length;
    const semana=ativas.filter(e=>{const d=diasAte(e.data);return d>=0&&d<=6;}).length;
    const receber=ativas.reduce((s,e)=>s+restante(e),0);
    return `<div class="page-kpis" style="margin-bottom:var(--s-4)">
      <div class="kpi"><div class="kl">Encomendas hoje</div><div class="kv">${hoje}</div></div>
      <div class="kpi"><div class="kl">Na semana</div><div class="kv">${semana}</div></div>
      <div class="kpi"><div class="kl">💰 A receber</div><div class="kv" style="color:var(--income)">${fmt(receber)}</div></div>
    </div>`;
  }

  function segBar(){
    const cont=k=>k==='todas'?DB.encomendas.length:DB.encomendas.filter(e=>e.status===k).length;
    const btn=(k,l)=>`<button class="${filtro===k?'on':''}" data-fst="${k}">${l} <span class="enc-count">${cont(k)}</span></button>`;
    return `<div class="toolbar" style="margin-bottom:var(--s-3)"><div class="seg enc-seg">
      ${btn('todas','Todas')}${STATUS.map(([k,l])=>btn(k,l)).join('')}
    </div></div>`;
  }

  function card(e){
    const t=total(e),r=restante(e),prox=proxStatus(e.status);
    return `<div class="enc-card">
      <div class="enc-top">
        <div class="enc-cliente">${esc(e.cliente||'—')}</div>
        <span class="enc-badge ${e.status}">${STLABEL[e.status]}</span>
      </div>
      <div class="enc-meta">
        <span>${svg('calendar',13)} ${labelData(e.data)}${e.hora?' · '+e.hora:''}</span>
        <span>${e.tipoEntrega==='entrega'?svg('package',13)+' Entrega':svg('archive',13)+' Retirada'}</span>
      </div>
      ${resumoItens(e)?`<div class="enc-itens">${esc(resumoItens(e))}</div>`:''}
      <div class="enc-vals">
        <span>Total <b>${fmt(t)}</b></span>
        <span>Sinal <b>${fmt(e.sinal||0)}</b></span>
        <span class="enc-rest">Restante <b>${fmt(r)}</b></span>
      </div>
      <div class="enc-acts">
        ${prox?`<button class="btn btn-primary btn-sm" data-adv="${e.id}">${svg('arrowup',14)} ${STLABEL[prox]}</button>`:`<span class="enc-done">${svg('tick',14)} Entregue</span>`}
        <button class="btn btn-ghost btn-sm" data-wa="${e.id}">${svg('chat',14)} WhatsApp</button>
        <span class="enc-acts-ico">
          <button class="btn-icon" title="Editar" data-edit="${e.id}">${svg('pencil',15)}</button>
          <button class="btn-icon" title="Excluir" data-del="${e.id}" style="color:var(--expense)">${svg('trash',15)}</button>
        </span>
      </div>
    </div>`;
  }

  function render(){
    const root=document.getElementById('encomendas-root');if(!root)return;
    const lista=DB.encomendas
      .filter(e=>filtro==='todas'||e.status===filtro)
      .slice().sort((a,b)=>a.data.localeCompare(b.data));
    root.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Encomendas</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">Pedidos por data · acompanhe da produção à entrega</p>
        </div>
        <button class="btn btn-primary btn-sm" data-novo>${svg('plus',16)} Nova encomenda</button>
      </div>
      ${kpis()}
      ${segBar()}
      ${lista.length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">📦</div><p style="color:var(--text-3)">Nenhuma encomenda ${filtro==='todas'?'ainda':'nesse status'}.</p></div>`
        :`<div class="enc-grid">${lista.map(card).join('')}</div>`}
    `;
    bind(root);
  }

  function bind(root){
    const byId=id=>DB.encomendas.find(e=>e.id===+id);
    root.querySelectorAll('[data-fst]').forEach(b=>b.onclick=()=>{filtro=b.dataset.fst;render();});
    root.querySelector('[data-novo]').onclick=()=>form();
    root.querySelectorAll('[data-adv]').forEach(b=>b.onclick=()=>{const e=byId(b.dataset.adv);const p=proxStatus(e&&e.status);if(e&&p){e.status=p;Toast.show(`${e.cliente}: ${STLABEL[p]}`);render();}});
    root.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>{const e=byId(b.dataset.wa);if(e)waModal(e);});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const e=byId(b.dataset.del);if(e)Modal.confirm('Excluir encomenda?',`A encomenda de "${esc(e.cliente)}" será removida.`,()=>{DB.encomendas=DB.encomendas.filter(x=>x.id!==e.id);Toast.show('Encomenda excluída');render();});});
  }

  function form(id){
    const e=id?DB.encomendas.find(x=>x.id===+id):null;
    const linhas=e?e.itens.map(it=>({...it})):[{produtoId:null,desc:'',qtd:1,valor:0}];
    const prodOpts=DB.produtos.map(p=>`<option value="${p.id}">${esc(p.nome)} — ${fmt(p.preco)}</option>`).join('');
    const tot=()=>linhas.reduce((s,it)=>s+(+it.qtd||0)*(+it.valor||0),0);
    const rows=()=>linhas.map((it,i)=>`<div class="orc-row" data-i="${i}">
      <input class="field orc-desc" placeholder="Item" value="${esc(it.desc||'')}">
      <input class="field orc-qtd" type="number" min="0" step="1" value="${it.qtd}" title="Qtd">
      <input class="field orc-val" type="number" min="0" step="0.01" value="${it.valor}" title="Valor unit.">
      <span class="orc-sub">${fmt((+it.qtd||0)*(+it.valor||0))}</span>
      <button class="btn-icon orc-rm" type="button" title="Remover"${linhas.length<=1?' disabled':''}>${svg('trash',14)}</button>
    </div>`).join('');
    const body=`
      <div class="frow">
        <div class="fg"><label>Cliente</label><input class="field" id="enc-cli" value="${e?esc(e.cliente||''):''}" placeholder="Nome do cliente"></div>
        <div class="fg"><label>Telefone (WhatsApp)</label><input class="field" id="enc-tel" value="${e?esc(e.telefone||''):''}" placeholder="(31) 9...."></div>
      </div>
      <div class="fg"><label>Itens</label>
        <div class="orc-head"><span>Item</span><span>Qtd</span><span>Valor</span><span>Subtotal</span><span></span></div>
        <div id="enc-itens">${rows()}</div>
        <div class="orc-add-row">
          <button class="btn btn-ghost btn-sm" id="enc-add" type="button">${svg('plus',14)} Adicionar item</button>
          <select class="field" id="enc-prod" style="width:auto"><option value="">+ Puxar de produto…</option>${prodOpts}</select>
        </div>
      </div>
      <div class="orc-total-row"><span>Total</span><span id="enc-total">${fmt(tot())}</span></div>
      <div class="frow">
        <div class="fg"><label>Data de entrega</label><input class="field" id="enc-data" type="date" value="${e?(e.data||'').slice(0,10):offset(1)}"></div>
        <div class="fg"><label>Hora</label><input class="field" id="enc-hora" type="time" value="${e?(e.hora||''):'14:00'}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Entrega</label><select class="field" id="enc-tipo"><option value="retirada"${e&&e.tipoEntrega==='retirada'?' selected':''}>Retirada</option><option value="entrega"${!e||e.tipoEntrega==='entrega'?' selected':''}>Entrega</option></select></div>
        <div class="fg"><label>Sinal pago (R$)</label><input class="field" id="enc-sinal" type="number" min="0" step="0.01" value="${e?(e.sinal||0):0}"></div>
      </div>
      <div class="fg" id="enc-end-wrap"><label>Endereço de entrega</label><input class="field" id="enc-end" value="${e?esc(e.endereco||''):''}" placeholder="Rua, número, bairro"></div>
      <div class="fg"><label>Observação</label><input class="field" id="enc-obs" value="${e?esc(e.obs||''):''}" placeholder="Detalhes do pedido"></div>`;
    const back=Modal.open(id?'Editar encomenda':'Nova encomenda',body,(b)=>{
      const cliente=b.querySelector('#enc-cli').value.trim();
      if(!cliente){Toast.show('Informe o cliente','err');return false;}
      readDOM();
      const itens=linhas.filter(it=>(it.desc||'').trim()&&(+it.qtd>0));
      if(itens.length===0){Toast.show('Adicione ao menos 1 item','err');return false;}
      const dd={cliente,telefone:b.querySelector('#enc-tel').value.trim(),itens,
        data:b.querySelector('#enc-data').value||offset(0),hora:b.querySelector('#enc-hora').value,
        tipoEntrega:b.querySelector('#enc-tipo').value,endereco:b.querySelector('#enc-end').value.trim(),
        sinal:+b.querySelector('#enc-sinal').value||0,obs:b.querySelector('#enc-obs').value.trim()};
      if(e){Object.assign(e,dd);Toast.show('Encomenda atualizada');}
      else{DB.encomendas.push(Object.assign({id:nid(),status:'afazer'},dd));Toast.show('Encomenda criada');}
      render();
    },id?'Salvar':'Criar');
    const box=back.querySelector('#enc-itens'),totEl=back.querySelector('#enc-total');
    function readDOM(){box.querySelectorAll('.orc-row').forEach((r,i)=>{linhas[i]={produtoId:linhas[i]&&linhas[i].produtoId||null,desc:r.querySelector('.orc-desc').value,qtd:+r.querySelector('.orc-qtd').value||0,valor:+r.querySelector('.orc-val').value||0};});}
    function bindRows(){box.querySelectorAll('.orc-row').forEach(r=>{const i=+r.dataset.i;
      r.querySelectorAll('input').forEach(inp=>inp.oninput=()=>{readDOM();r.querySelector('.orc-sub').textContent=fmt((+r.querySelector('.orc-qtd').value||0)*(+r.querySelector('.orc-val').value||0));totEl.textContent=fmt(tot());});
      const rm=r.querySelector('.orc-rm');if(rm)rm.onclick=()=>{readDOM();linhas.splice(i,1);paint();};});}
    function paint(){box.innerHTML=rows();bindRows();totEl.textContent=fmt(tot());}
    back.querySelector('#enc-add').onclick=()=>{readDOM();linhas.push({produtoId:null,desc:'',qtd:1,valor:0});paint();};
    back.querySelector('#enc-prod').onchange=ev=>{const p=DB.produtos.find(x=>x.id===+ev.target.value);if(p){readDOM();linhas.push({produtoId:p.id,desc:p.nome,qtd:1,valor:p.preco});paint();}ev.target.value='';};
    const tipoEl=back.querySelector('#enc-tipo'),endWrap=back.querySelector('#enc-end-wrap');
    const toggleEnd=()=>{endWrap.style.display=tipoEl.value==='entrega'?'':'none';};
    tipoEl.onchange=toggleEnd;toggleEnd();
    bindRows();
  }

  /* ── WhatsApp ── */
  function waConfirma(e){
    const n=DB.negocio;
    let t=`*${n.logo?n.logo+' ':''}${n.nome}*\n`;
    t+=`Oi ${e.cliente}! Confirmando sua encomenda 😊\n\n*Itens:*\n`;
    (e.itens||[]).forEach(it=>{t+=`• ${it.qtd}× ${it.desc} — *${fmt((+it.qtd||0)*(+it.valor||0))}*\n`;});
    t+=`\n*Total:* ${fmt(total(e))}\n`;
    if(+e.sinal>0)t+=`Sinal pago: ${fmt(e.sinal)} · Falta: *${fmt(restante(e))}*\n`;
    t+=`📅 ${labelData(e.data)}${e.hora?' às '+e.hora:''}\n`;
    t+=e.tipoEntrega==='entrega'?`🛵 Entrega${e.endereco?': '+e.endereco:''}\n`:'🛍️ Retirada\n';
    t+='\n_Obrigado pela preferência!!! 😊🙏🏼_';
    return t;
  }
  function waPronto(e){
    const n=DB.negocio;
    let t=`*${n.logo?n.logo+' ':''}${n.nome}*\n`;
    t+=`Oi ${e.cliente}! Sua encomenda está *pronta*! ✅\n`;
    t+=e.tipoEntrega==='entrega'?'Já vamos sair pra entrega 🛵':'Pode retirar quando quiser 🛍️';
    return t;
  }
  function enviar(e,txt){const tel=(e.telefone||'').replace(/\D/g,'');window.open('https://wa.me/'+(tel?'55'+tel:'')+'?text='+encodeURIComponent(txt),'_blank');}
  function waModal(e){
    const body=`<p style="font-size:14px;color:var(--text-2);line-height:1.55">Escolha a mensagem para <b>${esc(e.cliente)}</b>${e.telefone?'':' <span style="color:var(--text-3)">(sem telefone — você escolhe o contato)</span>'}:</p>`;
    const foot=`<button class="btn btn-ghost" data-close>Cancelar</button>
      <button class="btn btn-ghost" data-msg="confirma">${svg('chat',15)} Confirmar</button>
      <button class="btn btn-primary" data-msg="pronto">${svg('tick',15)} Tá pronto!</button>`;
    const {back,close}=Modal._build('Avisar no WhatsApp',body,foot,420);
    back.querySelector('[data-msg="confirma"]').onclick=()=>{enviar(e,waConfirma(e));close();};
    back.querySelector('[data-msg="pronto"]').onclick=()=>{enviar(e,waPronto(e));close();};
  }

  return {render};
})();
