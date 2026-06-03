/* ═══ DOCUMENTOS (modo Negócio) — Etapa 23A ═══
   Hub de documentos. Aba CATÁLOGO/CARDÁPIO com MODELOS salvos (DB.catalogos):
   criar 1x, reusar sempre → preview premium no app + envio formatado pro WhatsApp.
   Orçamento/Recibo entram no 23B/23C (abas placeholder). Só LÊ DB.produtos/DB.negocio. */
const Documentos=(()=>{
  let aba='catalogo';

  const esc=s=>(s+'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const CAT_COR={Doces:'#D9608C',Salgados:'#E08A3C',Tortas:'#C2783A',Massas:'#C9A227',Kits:'#7C5CD0',Bebidas:'#3C9BD0',Embalagens:'#6B8E6B',Personalizados:'#8E6E53'};
  const catCor=c=>CAT_COR[c]||'#8A867C';
  const inicial=s=>(s||'?').trim().charAt(0).toUpperCase();
  const byId=id=>DB.catalogos.find(x=>x.id===+id);
  const itens=c=>(c.produtoIds||[]).map(id=>DB.produtos.find(p=>p.id===id)).filter(Boolean);
  // agrupa produtos por categoria preservando a ordem de aparição
  function porCategoria(prods){
    const m=new Map();
    prods.forEach(p=>{if(!m.has(p.categoria))m.set(p.categoria,[]);m.get(p.categoria).push(p);});
    return [...m.entries()];
  }

  function segBar(){
    return `<div class="toolbar" style="margin-bottom:var(--s-3)">
      <div class="seg">
        <button class="${aba==='catalogo'?'on':''}" data-aba="catalogo">${svg('book',14)} Catálogo</button>
        <button class="${aba==='orcamento'?'on':''}" data-aba="orcamento">${svg('file',14)} Orçamento</button>
        <button class="${aba==='recibo'?'on':''}" data-aba="recibo">${svg('card',14)} Recibo</button>
      </div>
    </div>`;
  }

  function cardHTML(c){
    const n=itens(c).length;
    return `<div class="doc-card">
      <div class="doc-card-h">
        <div class="doc-card-ico">${svg('book',20)}</div>
        <div class="doc-card-tx">
          <div class="doc-card-nome">${esc(c.nome)}</div>
          <div class="doc-card-sub">${n} ${n===1?'item':'itens'}</div>
        </div>
      </div>
      <div class="doc-card-acts">
        <button class="btn btn-primary btn-sm" data-wa="${c.id}">${svg('chat',14)} Enviar</button>
        <button class="btn btn-ghost btn-sm" data-ver="${c.id}">${svg('eye',14)} Ver</button>
        <button class="btn-icon" title="Editar" data-edit="${c.id}">${svg('pencil',15)}</button>
        <button class="btn-icon" title="Duplicar" data-dup="${c.id}">${svg('copy',15)}</button>
        <button class="btn-icon" title="Excluir" data-del="${c.id}" style="color:var(--expense)">${svg('trash',15)}</button>
      </div>
    </div>`;
  }

  function catalogoHTML(){
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Documentos</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">Modelos de cardápio/catálogo reutilizáveis · crie 1x, reuse sempre</p>
        </div>
        <button class="btn btn-primary btn-sm" data-novo>${svg('plus',16)} Novo cardápio</button>
      </div>
      ${DB.catalogos.length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">📄</div><p style="color:var(--text-3)">Nenhum cardápio ainda. Crie o primeiro!</p></div>`
        :`<div class="doc-grid">${DB.catalogos.map(cardHTML).join('')}</div>`}`;
  }

  function orcamentoHTML(){
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Orçamentos</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">Modelos de orçamento reutilizáveis · cliente, itens, total, validade</p>
        </div>
        <button class="btn btn-primary btn-sm" data-novo-orc>${svg('plus',16)} Novo orçamento</button>
      </div>
      ${DB.orcamentos.length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">📄</div><p style="color:var(--text-3)">Nenhum orçamento ainda. Crie o primeiro!</p></div>`
        :`<div class="doc-grid">${DB.orcamentos.map(cardHTMLOrc).join('')}</div>`}`;
  }

  function render(){
    const root=document.getElementById('documentos-root');if(!root)return;
    root.innerHTML=`${segBar()}${aba==='recibo'?reciboHTML():aba==='orcamento'?orcamentoHTML():catalogoHTML()}`;
    bind(root);
  }

  function bind(root){
    root.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>{aba=b.dataset.aba;render();});
    if(aba==='orcamento')bindOrc(root);else if(aba==='recibo')bindReb(root);else bindCat(root);
  }

  function bindCat(root){
    const nv=root.querySelector('[data-novo]');if(nv)nv.onclick=()=>form();
    root.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.wa);if(c)enviarWAtxt(waText(c));});
    root.querySelectorAll('[data-ver]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.ver);if(c)verModal(c.nome,previewWA(c),previewPDF(c),waText(c));});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-dup]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.dup);if(c){DB.catalogos.push({id:nid(),nome:c.nome+' (cópia)',produtoIds:[...c.produtoIds],obs:c.obs});Toast.show('Cardápio duplicado');render();}});
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.del);if(c)Modal.confirm('Excluir cardápio?',`"${esc(c.nome)}" será removido permanentemente.`,()=>{DB.catalogos=DB.catalogos.filter(x=>x.id!==c.id);Toast.show('Cardápio excluído');render();});});
  }

  function bindOrc(root){
    const oById=id=>DB.orcamentos.find(x=>x.id===+id);
    const nv=root.querySelector('[data-novo-orc]');if(nv)nv.onclick=()=>formOrc();
    root.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>{const o=oById(b.dataset.wa);if(o)enviarWAtxt(waTextOrc(o));});
    root.querySelectorAll('[data-ver]').forEach(b=>b.onclick=()=>{const o=oById(b.dataset.ver);if(o)verModal(o.nome,previewWAOrc(o),previewPDFOrc(o),waTextOrc(o));});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>formOrc(+b.dataset.edit));
    root.querySelectorAll('[data-dup]').forEach(b=>b.onclick=()=>{const o=oById(b.dataset.dup);if(o){DB.orcamentos.push({id:nid(),nome:o.nome+' (cópia)',cliente:o.cliente,itens:o.itens.map(it=>({...it})),validadeDias:o.validadeDias,condicoes:o.condicoes,prazo:o.prazo});Toast.show('Orçamento duplicado');render();}});
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const o=oById(b.dataset.del);if(o)Modal.confirm('Excluir orçamento?',`"${esc(o.nome)}" será removido permanentemente.`,()=>{DB.orcamentos=DB.orcamentos.filter(x=>x.id!==o.id);Toast.show('Orçamento excluído');render();});});
  }

  function reciboHTML(){
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Recibos</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">Comprovantes reutilizáveis · cliente, valor por extenso, referente, forma de pagamento</p>
        </div>
        <button class="btn btn-primary btn-sm" data-novo-reb>${svg('plus',16)} Novo recibo</button>
      </div>
      ${DB.recibos.length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">🧾</div><p style="color:var(--text-3)">Nenhum recibo ainda. Crie o primeiro!</p></div>`
        :`<div class="doc-grid">${DB.recibos.map(cardHTMLReb).join('')}</div>`}`;
  }

  function bindReb(root){
    const rById=id=>DB.recibos.find(x=>x.id===+id);
    const nv=root.querySelector('[data-novo-reb]');if(nv)nv.onclick=()=>formReb();
    root.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>{const r=rById(b.dataset.wa);if(r)enviarWAtxt(waTextReb(r));});
    root.querySelectorAll('[data-ver]').forEach(b=>b.onclick=()=>{const r=rById(b.dataset.ver);if(r)verModal(r.nome,previewWAReb(r),previewPDFReb(r),waTextReb(r));});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>formReb(+b.dataset.edit));
    root.querySelectorAll('[data-dup]').forEach(b=>b.onclick=()=>{const r=rById(b.dataset.dup);if(r){DB.recibos.push({id:nid(),nome:r.nome+' (cópia)',cliente:r.cliente,valor:r.valor,referente:r.referente,formaPgto:r.formaPgto,data:r.data});Toast.show('Recibo duplicado');render();}});
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const r=rById(b.dataset.del);if(r)Modal.confirm('Excluir recibo?',`"${esc(r.nome)}" será removido permanentemente.`,()=>{DB.recibos=DB.recibos.filter(x=>x.id!==r.id);Toast.show('Recibo excluído');render();});});
  }

  function form(id){
    const c=id?byId(id):null;
    const sel=new Set(c?c.produtoIds:[]);
    const grupos=porCategoria(DB.produtos);
    const checks=grupos.map(([cat,ps])=>`
      <div class="doc-pick-cat">
        <div class="doc-pick-lbl">${esc(cat)}</div>
        ${ps.map(p=>`<label class="doc-pick-item"><input type="checkbox" value="${p.id}"${sel.has(p.id)?' checked':''}>
          <span class="doc-pick-cap" style="background:${catCor(p.categoria)}22;color:${catCor(p.categoria)}">${p.emoji||esc(inicial(p.nome))}</span>
          <span class="doc-pick-nome">${esc(p.nome)}</span><span class="doc-pick-preco">${fmt(p.preco)}</span></label>`).join('')}
      </div>`).join('');
    Modal.open(id?'Editar cardápio':'Novo cardápio',`
      <div class="frow">
        <div class="fg"><label>Nome do cardápio</label><input class="field" id="dc-nome" value="${c?esc(c.nome):''}" placeholder="Ex: Cardápio Completo"></div>
        <div class="fg"><label>Observação (rodapé)</label><input class="field" id="dc-obs" value="${c?esc(c.obs||''):'Consulte a taxa de entrega'}" placeholder="Consulte a taxa de entrega"></div>
      </div>
      <div class="fg"><label>Produtos no cardápio</label><div class="doc-pick">${checks}</div></div>
    `,(b)=>{
      const nome=b.querySelector('#dc-nome').value.trim();
      if(!nome){Toast.show('Dê um nome ao cardápio','err');return false;}
      const ids=[...b.querySelectorAll('.doc-pick input:checked')].map(i=>+i.value);
      if(ids.length===0){Toast.show('Escolha ao menos 1 produto','err');return false;}
      const obs=b.querySelector('#dc-obs').value.trim();
      if(c){c.nome=nome;c.produtoIds=ids;c.obs=obs;Toast.show('Cardápio atualizado');}
      else{DB.catalogos.push({id:nid(),nome,produtoIds:ids,obs});Toast.show('Cardápio criado');}
      render();
    },id?'Salvar':'Criar');
  }

  // previewWA = EXATAMENTE o texto do WhatsApp (bolha estilo zap, com *negrito* e _itálico_ interpretados)
  function previewWA(c){
    const html=esc(waText(c))
      .replace(/\*([^*\n]+)\*/g,'<strong>$1</strong>')
      .replace(/_([^_\n]+)_/g,'<em>$1</em>');
    return `<div class="doc-preview"><div class="doc-wa-bubble">${html}</div></div>`;
  }

  // previewPDF = versão elegante/Premium (marca + categorias + cards + preços) — usada no toggle e no PDF
  function previewPDF(c){
    const n=DB.negocio;
    const corpo=porCategoria(itens(c)).map(([cat,ps])=>`
      <div class="doc-pv-sec">
        <div class="doc-pv-cat">${esc(cat)}</div>
        ${ps.map(p=>`<div class="doc-pv-item">
          <span class="doc-pv-cap" style="background:${catCor(p.categoria)}22;color:${catCor(p.categoria)}">${p.emoji||esc(inicial(p.nome))}</span>
          <span class="doc-pv-nome">${esc(p.nome)}${p.descricao?`<span class="doc-pv-desc">${esc(p.descricao)}</span>`:''}</span>
          <span class="doc-pv-preco">${fmt(p.preco)}</span>
        </div>`).join('')}
      </div>`).join('');
    return `<div class="doc-preview doc-pdf">
      <div class="doc-pv-head">
        <div class="doc-pv-logo">${esc(n.logo||inicial(n.nome))}</div>
        <div><div class="doc-pv-marca">${esc(n.nome)}</div><div class="doc-pv-seg">${esc(n.slogan||n.segmento||'')}</div></div>
      </div>
      ${corpo}
      <div class="doc-pv-foot">${svg('chat',13)} ${esc(n.whatsapp||'')}${c.obs?` · ${esc(c.obs)}`:''}</div>
    </div>`;
  }

  // baixarPDFdoc = abre janela com o HTML elegante (catálogo OU orçamento) + CSS de impressão e chama print() (sem libs)
  function baixarPDFdoc(titulo,pdfHTML){
    const w=window.open('','_blank');if(!w)return;
    const css=`*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;color:#1b1a16;background:#fff;padding:32px;max-width:620px;margin:0 auto}
.doc-pv-head{display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:1px solid #e7e3da;margin-bottom:16px}
.doc-pv-logo{width:54px;height:54px;border-radius:13px;background:rgba(22,138,124,.10);color:#0f6f63;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}
.doc-pv-marca{font-size:21px;font-weight:800}
.doc-pv-seg{font-size:13px;color:#8a867c;margin-top:2px}
.doc-pv-sec{margin-bottom:14px;page-break-inside:avoid}
.doc-pv-cat{font-size:12px;font-weight:800;color:#0f6f63;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
.doc-pv-item{display:flex;align-items:center;gap:11px;padding:7px 0;border-bottom:1px solid #f2efe9}
.doc-pv-cap{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.doc-pv-nome{flex:1;min-width:0;font-size:14px;font-weight:600;display:flex;flex-direction:column}
.doc-pv-desc{font-size:11.5px;font-weight:400;color:#8a867c;margin-top:1px}
.doc-pv-preco{font-weight:800;font-size:14px;white-space:nowrap}
.doc-pv-foot{display:flex;align-items:center;gap:6px;padding-top:14px;border-top:1px solid #e7e3da;font-size:13px;color:#56524a;font-weight:600;margin-top:8px}
.orc-total-box{display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:11px 14px;border-radius:11px;background:rgba(22,138,124,.10);color:#0f6f63;font-weight:800;font-size:17px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.orc-meta{margin-top:10px;display:flex;flex-direction:column;gap:3px}
.orc-meta-line{font-size:12px;color:#8a867c;font-style:italic}
.reb-body{font-size:15px;line-height:1.7;color:#1b1a16}
.reb-ext{font-style:italic;color:#56524a}
.reb-meta{margin-top:14px;display:flex;flex-direction:column;gap:3px;font-size:13px;color:#56524a}
.reb-sign{margin-top:48px;text-align:center}
.reb-sign-line{width:260px;max-width:80%;margin:0 auto;border-top:1px solid #1b1a16}
.reb-sign-name{margin-top:6px;font-size:13px;font-weight:700;color:#1b1a16}
@media print{body{padding:0}}`;
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(titulo)}</title><style>${css}</style></head><body>${pdfHTML}<script>window.onload=function(){window.print();};<\/script></body></html>`);
    w.document.close();
  }

  // Texto formatado pro WhatsApp — no padrão do Léo (moldura, categorias centralizadas, item nome+qtd/preço, rodapé)
  const W=46, LINHA='━'.repeat(23);
  // centraliza com "." + espaços (frase curta centraliza; muito grande = só ". " + texto). Ignora * e _ (somem no WhatsApp).
  function cen(s){const vis=s.replace(/[*_]/g,'').length; if(vis>=W)return '. '+s; return '.'+' '.repeat(Math.max(1,Math.round((W-vis)/2)))+s;}
  function foneFmt(w){const d=(w||'').replace(/\D/g,''); return d.length>=10?`(${d.slice(0,2)}) ${d.slice(2,d.length-4)}-${d.slice(-4)}`:(w||'');}
  function waText(c){
    const n=DB.negocio, L=n.logo?n.logo:'';
    let t='╔══════════════════════╗\n';
    t+=cen(`*${L?L+' ':''}${(n.nome||'').toUpperCase()}${L?' '+L:''}*`)+'\n';
    if(n.slogan||n.segmento)t+=cen(`*${n.slogan||n.segmento}*`)+'\n';
    t+='╚══════════════════════╝\n';
    porCategoria(itens(c)).forEach(([cat,ps])=>{
      t+=LINHA+'\n'+cen(`*${cat.toUpperCase()}*`)+'\n'+LINHA+'\n';
      ps.forEach(p=>{
        t+=`*${p.emoji?p.emoji+' ':''}${p.nome}*\n`;
        t+=`${p.descricao?p.descricao+'   ':''}${fmt(p.preco)}\n`;
      });
    });
    t+=LINHA+'\n\n';
    t+='*📲 PEDIDOS*\n'+foneFmt(n.whatsapp)+'\n\n';
    t+=`*🛵 ${c.obs||'Consulte a taxa de entrega!!!'}*\n`;
    t+='_Obrigado pela preferência!!! 😊🙏🏼_';
    return t;
  }
  function enviarWAtxt(txt){window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');}
  // bolha do WhatsApp a partir de um texto qualquer (mesma transformação da previewWA — usada pelo orçamento)
  function bolha(txt){
    const html=esc(txt).replace(/\*([^*\n]+)\*/g,'<strong>$1</strong>').replace(/_([^_\n]+)_/g,'<em>$1</em>');
    return `<div class="doc-preview"><div class="doc-wa-bubble">${html}</div></div>`;
  }

  // Modal "Ver" — genérico (catálogo OU orçamento): toggle WhatsApp/PDF + ações
  function verModal(titulo,waHTML,pdfHTML,waTxt){
    const body=`
      <div class="doc-ver-bar">
        <div class="seg">
          <button class="on" data-vmodo="wa">${svg('chat',14)} WhatsApp</button>
          <button data-vmodo="pdf">${svg('file',14)} PDF</button>
        </div>
        <button class="btn btn-ghost btn-sm" data-pdf>${svg('file',14)} Baixar PDF</button>
      </div>
      <div id="doc-ver-box">${waHTML}</div>`;
    const back=Modal.open(esc(titulo),body,()=>enviarWAtxt(waTxt),'Enviar WhatsApp');
    const box=back.querySelector('#doc-ver-box');
    back.querySelectorAll('[data-vmodo]').forEach(b=>b.onclick=()=>{
      back.querySelectorAll('[data-vmodo]').forEach(x=>x.classList.toggle('on',x===b));
      box.innerHTML=b.dataset.vmodo==='pdf'?pdfHTML:waHTML;
    });
    back.querySelector('[data-pdf]').onclick=()=>baixarPDFdoc(titulo,pdfHTML);
  }

  /* ═══ ORÇAMENTO (23B) — mesmo motor, estrutura própria ═══ */
  const totalOrc=o=>(o.itens||[]).reduce((s,it)=>s+(+it.qtd||0)*(+it.valor||0),0);

  function cardHTMLOrc(o){
    return `<div class="doc-card">
      <div class="doc-card-h">
        <div class="doc-card-ico">${svg('file',20)}</div>
        <div class="doc-card-tx">
          <div class="doc-card-nome">${esc(o.nome)}</div>
          <div class="doc-card-sub">${o.cliente?esc(o.cliente)+' · ':''}<b style="color:var(--text-1)">${fmt(totalOrc(o))}</b></div>
        </div>
      </div>
      <div class="doc-card-acts">
        <button class="btn btn-primary btn-sm" data-wa="${o.id}">${svg('chat',14)} Enviar</button>
        <button class="btn btn-ghost btn-sm" data-ver="${o.id}">${svg('eye',14)} Ver</button>
        <button class="btn-icon" title="Editar" data-edit="${o.id}">${svg('pencil',15)}</button>
        <button class="btn-icon" title="Duplicar" data-dup="${o.id}">${svg('copy',15)}</button>
        <button class="btn-icon" title="Excluir" data-del="${o.id}" style="color:var(--expense)">${svg('trash',15)}</button>
      </div>
    </div>`;
  }

  function formOrc(id){
    const o=id?DB.orcamentos.find(x=>x.id===+id):null;
    const linhas=o?o.itens.map(it=>({desc:it.desc,qtd:it.qtd,valor:it.valor})):[{desc:'',qtd:1,valor:0}];
    const prodOpts=DB.produtos.map(p=>`<option value="${p.id}">${esc(p.nome)} — ${fmt(p.preco)}</option>`).join('');
    const total=()=>linhas.reduce((s,it)=>s+(+it.qtd||0)*(+it.valor||0),0);
    const rowsHTML=()=>linhas.map((it,i)=>`<div class="orc-row" data-i="${i}">
      <input class="field orc-desc" placeholder="Descrição do item ou serviço" value="${esc(it.desc||'')}">
      <input class="field orc-qtd" type="number" min="0" step="1" value="${it.qtd}" title="Quantidade">
      <input class="field orc-val" type="number" min="0" step="0.01" value="${it.valor}" title="Valor unitário">
      <span class="orc-sub">${fmt((+it.qtd||0)*(+it.valor||0))}</span>
      <button class="btn-icon orc-rm" type="button" title="Remover"${linhas.length<=1?' disabled':''}>${svg('trash',14)}</button>
    </div>`).join('');
    const body=`
      <div class="frow">
        <div class="fg"><label>Nome do orçamento</label><input class="field" id="orc-nome" value="${o?esc(o.nome):''}" placeholder="Ex: Orçamento Festa"></div>
        <div class="fg"><label>Cliente</label><input class="field" id="orc-cli" value="${o?esc(o.cliente||''):''}" placeholder="Nome do cliente"></div>
      </div>
      <div class="fg"><label>Itens</label>
        <div class="orc-head"><span>Descrição</span><span>Qtd</span><span>Valor</span><span>Subtotal</span><span></span></div>
        <div id="orc-itens">${rowsHTML()}</div>
        <div class="orc-add-row">
          <button class="btn btn-ghost btn-sm" id="orc-add" type="button">${svg('plus',14)} Adicionar item</button>
          <select class="field" id="orc-prod" style="width:auto"><option value="">+ Puxar de produto…</option>${prodOpts}</select>
        </div>
      </div>
      <div class="orc-total-row"><span>Total</span><span id="orc-total">${fmt(total())}</span></div>
      <div class="frow">
        <div class="fg"><label>Validade (dias)</label><input class="field" id="orc-dias" type="number" min="0" value="${o?(o.validadeDias||0):7}"></div>
        <div class="fg"><label>Prazo</label><input class="field" id="orc-prazo" value="${o?esc(o.prazo||''):''}" placeholder="Ex: Entrega em até 3 dias"></div>
      </div>
      <div class="fg"><label>Condições</label><input class="field" id="orc-cond" value="${o?esc(o.condicoes||''):''}" placeholder="Ex: 50% de sinal, restante na entrega"></div>`;
    const back=Modal.open(id?'Editar orçamento':'Novo orçamento',body,(b)=>{
      const nome=b.querySelector('#orc-nome').value.trim();
      if(!nome){Toast.show('Dê um nome ao orçamento','err');return false;}
      readDOM();
      const itens=linhas.filter(it=>(it.desc||'').trim()&&(+it.qtd>0));
      if(itens.length===0){Toast.show('Adicione ao menos 1 item','err');return false;}
      const dd={nome,cliente:b.querySelector('#orc-cli').value.trim(),itens,
        validadeDias:+b.querySelector('#orc-dias').value||0,
        prazo:b.querySelector('#orc-prazo').value.trim(),
        condicoes:b.querySelector('#orc-cond').value.trim()};
      if(o){Object.assign(o,dd);Toast.show('Orçamento atualizado');}
      else{DB.orcamentos.push(Object.assign({id:nid()},dd));Toast.show('Orçamento criado');}
      render();
    },id?'Salvar':'Criar');
    const box=back.querySelector('#orc-itens'),totEl=back.querySelector('#orc-total');
    function readDOM(){box.querySelectorAll('.orc-row').forEach((r,i)=>{linhas[i]={desc:r.querySelector('.orc-desc').value,qtd:+r.querySelector('.orc-qtd').value||0,valor:+r.querySelector('.orc-val').value||0};});}
    function bindRows(){box.querySelectorAll('.orc-row').forEach(r=>{
      const i=+r.dataset.i;
      r.querySelectorAll('input').forEach(inp=>inp.oninput=()=>{readDOM();r.querySelector('.orc-sub').textContent=fmt((+r.querySelector('.orc-qtd').value||0)*(+r.querySelector('.orc-val').value||0));totEl.textContent=fmt(total());});
      const rm=r.querySelector('.orc-rm');if(rm)rm.onclick=()=>{readDOM();linhas.splice(i,1);paint();};
    });}
    function paint(){box.innerHTML=rowsHTML();bindRows();totEl.textContent=fmt(total());}
    back.querySelector('#orc-add').onclick=()=>{readDOM();linhas.push({desc:'',qtd:1,valor:0});paint();};
    back.querySelector('#orc-prod').onchange=e=>{const p=DB.produtos.find(x=>x.id===+e.target.value);if(p){readDOM();linhas.push({desc:p.nome,qtd:1,valor:p.preco});paint();}e.target.value='';};
    bindRows();
  }

  // Texto WhatsApp do orçamento (padrão Léo — moldura, cliente, itens, TOTAL, validade/condições/prazo, rodapé)
  function waTextOrc(o){
    const n=DB.negocio, L=n.logo?n.logo:'';
    let t='╔══════════════════════╗\n';
    t+=cen(`*${L?L+' ':''}${(n.nome||'').toUpperCase()}${L?' '+L:''}*`)+'\n';
    t+=cen('*ORÇAMENTO*')+'\n';
    t+='╚══════════════════════╝\n';
    if(o.cliente)t+=`Cliente: *${o.cliente}*\n`;
    t+=LINHA+'\n';
    (o.itens||[]).forEach(it=>{
      const sub=(+it.qtd||0)*(+it.valor||0);
      t+=`*${it.desc}*\n`;
      t+=`${(+it.qtd>1)?`${it.qtd} x ${fmt(it.valor)} = `:''}*${fmt(sub)}*\n`;
    });
    t+=LINHA+'\n';
    t+=`*TOTAL: ${fmt(totalOrc(o))}*\n`;
    if(o.validadeDias)t+=`_Validade: ${o.validadeDias} dias_\n`;
    if(o.condicoes)t+=`_${o.condicoes}_\n`;
    if(o.prazo)t+=`_${o.prazo}_\n`;
    t+=`\n📲 ${foneFmt(n.whatsapp)}\n`;
    t+='_Obrigado pela preferência!!! 😊🙏🏼_';
    return t;
  }
  const previewWAOrc=o=>bolha(waTextOrc(o));

  // Preview PDF elegante do orçamento (reusa .doc-pv-* + total destacado/meta .orc-*)
  function previewPDFOrc(o){
    const n=DB.negocio;
    const linhas=(o.itens||[]).map(it=>{
      const sub=(+it.qtd||0)*(+it.valor||0);
      return `<div class="doc-pv-item">
        <span class="doc-pv-nome">${esc(it.desc)}${(+it.qtd>1)?`<span class="doc-pv-desc">${it.qtd} × ${fmt(it.valor)}</span>`:''}</span>
        <span class="doc-pv-preco">${fmt(sub)}</span>
      </div>`;
    }).join('');
    const meta=[o.validadeDias?`Validade: ${o.validadeDias} dias`:'',o.condicoes,o.prazo].filter(Boolean)
      .map(x=>`<div class="orc-meta-line">${esc(x)}</div>`).join('');
    return `<div class="doc-preview doc-pdf">
      <div class="doc-pv-head">
        <div class="doc-pv-logo">${esc(n.logo||inicial(n.nome))}</div>
        <div><div class="doc-pv-marca">${esc(n.nome)}</div><div class="doc-pv-seg">Orçamento${o.cliente?' · '+esc(o.cliente):''}</div></div>
      </div>
      <div class="doc-pv-sec">${linhas}</div>
      <div class="orc-total-box"><span>TOTAL</span><span>${fmt(totalOrc(o))}</span></div>
      ${meta?`<div class="orc-meta">${meta}</div>`:''}
      <div class="doc-pv-foot">${svg('chat',13)} ${esc(foneFmt(n.whatsapp))}</div>
    </div>`;
  }

  /* ═══ RECIBO (23C) — comprovante, mesmo motor ═══ */
  const dataFmt=iso=>{const p=(iso||'').slice(0,10).split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:'';};

  // número → por extenso em pt-BR (reais + centavos)
  function extenso(v){
    v=Math.round((+v||0)*100)/100;
    const reais=Math.floor(v), cent=Math.round((v-reais)*100);
    const u=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
    const dez=['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
    const cem=['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
    function ate999(n){
      if(n===0)return '';
      if(n===100)return 'cem';
      const c=Math.floor(n/100), resto=n%100; let s='';
      if(c)s+=cem[c];
      if(resto){ if(s)s+=' e '; s+= resto<20?u[resto]:dez[Math.floor(resto/10)]+(resto%10?' e '+u[resto%10]:''); }
      return s;
    }
    function inteiro(n){
      if(n===0)return 'zero';
      const mi=Math.floor(n/1000000), mil=Math.floor((n%1000000)/1000), r=n%1000, parts=[];
      if(mi)parts.push((mi===1?'um':ate999(mi))+(mi===1?' milhão':' milhões'));
      if(mil)parts.push(mil===1?'mil':ate999(mil)+' mil');
      if(r)parts.push(ate999(r));
      return parts.join(', ');
    }
    const out=[];
    if(reais>0)out.push(`${inteiro(reais)} ${reais===1?'real':'reais'}`);
    if(cent>0)out.push(`${inteiro(cent)} ${cent===1?'centavo':'centavos'}`);
    return out.length?out.join(' e '):'zero reais';
  }

  function cardHTMLReb(r){
    return `<div class="doc-card">
      <div class="doc-card-h">
        <div class="doc-card-ico">${svg('card',20)}</div>
        <div class="doc-card-tx">
          <div class="doc-card-nome">${esc(r.nome)}</div>
          <div class="doc-card-sub">${r.cliente?esc(r.cliente)+' · ':''}<b style="color:var(--text-1)">${fmt(r.valor)}</b></div>
        </div>
      </div>
      <div class="doc-card-acts">
        <button class="btn btn-primary btn-sm" data-wa="${r.id}">${svg('chat',14)} Enviar</button>
        <button class="btn btn-ghost btn-sm" data-ver="${r.id}">${svg('eye',14)} Ver</button>
        <button class="btn-icon" title="Editar" data-edit="${r.id}">${svg('pencil',15)}</button>
        <button class="btn-icon" title="Duplicar" data-dup="${r.id}">${svg('copy',15)}</button>
        <button class="btn-icon" title="Excluir" data-del="${r.id}" style="color:var(--expense)">${svg('trash',15)}</button>
      </div>
    </div>`;
  }

  function formReb(id){
    const r=id?DB.recibos.find(x=>x.id===+id):null;
    const body=`
      <div class="frow">
        <div class="fg"><label>Nome do recibo</label><input class="field" id="reb-nome" value="${r?esc(r.nome):''}" placeholder="Ex: Recibo Festa"></div>
        <div class="fg"><label>Cliente (pagador)</label><input class="field" id="reb-cli" value="${r?esc(r.cliente||''):''}" placeholder="Nome do cliente"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Valor (R$)</label><input class="field" id="reb-valor" type="number" min="0" step="0.01" value="${r?r.valor:''}" placeholder="0,00"></div>
        <div class="fg"><label>Forma de pagamento</label><input class="field" id="reb-forma" value="${r?esc(r.formaPgto||''):''}" placeholder="Ex: Pix, Dinheiro, Cartão"></div>
      </div>
      <div class="fg"><label>Referente a</label><input class="field" id="reb-ref" value="${r?esc(r.referente||''):''}" placeholder="Ex: Salgados para festa"></div>
      <div class="fg" style="flex:0 0 50%"><label>Data</label><input class="field" id="reb-data" type="date" value="${r?(r.data||'').slice(0,10):(new Date()).toISOString().slice(0,10)}"></div>
      <div class="reb-extenso-prev" id="reb-ext"></div>`;
    const back=Modal.open(id?'Editar recibo':'Novo recibo',body,(b)=>{
      const nome=b.querySelector('#reb-nome').value.trim();
      if(!nome){Toast.show('Dê um nome ao recibo','err');return false;}
      const valor=+b.querySelector('#reb-valor').value||0;
      if(valor<=0){Toast.show('Informe o valor do recibo','err');return false;}
      const dd={nome,cliente:b.querySelector('#reb-cli').value.trim(),valor,
        referente:b.querySelector('#reb-ref').value.trim(),
        formaPgto:b.querySelector('#reb-forma').value.trim(),
        data:b.querySelector('#reb-data').value||offset(0)};
      if(r){Object.assign(r,dd);Toast.show('Recibo atualizado');}
      else{DB.recibos.push(Object.assign({id:nid()},dd));Toast.show('Recibo criado');}
      render();
    },id?'Salvar':'Criar');
    const valEl=back.querySelector('#reb-valor'),extEl=back.querySelector('#reb-ext');
    const upd=()=>{const v=+valEl.value||0;extEl.textContent=v>0?`(${extenso(v)})`:'';};
    valEl.oninput=upd;upd();
  }

  // Texto WhatsApp do recibo (padrão Léo)
  function waTextReb(r){
    const n=DB.negocio, L=n.logo?n.logo:'';
    let t='╔══════════════════════╗\n';
    t+=cen(`*${L?L+' ':''}${(n.nome||'').toUpperCase()}${L?' '+L:''}*`)+'\n';
    t+=cen('*RECIBO*')+'\n';
    t+='╚══════════════════════╝\n';
    t+=`Recebi de *${r.cliente||'—'}*\n`;
    t+=`a importância de *${fmt(r.valor)}*\n`;
    t+=`_(${extenso(r.valor)})_\n`;
    if(r.referente)t+=`Referente a: ${r.referente}\n`;
    t+=`${r.formaPgto?`Pgto: ${r.formaPgto} · `:''}${n.cidade?n.cidade+', ':''}${dataFmt(r.data)}\n`;
    t+=LINHA+'\n';
    t+=`📲 ${foneFmt(n.whatsapp)}\n`;
    t+='_Obrigado pela preferência!!! 😊🙏🏼_';
    return t;
  }
  const previewWAReb=r=>bolha(waTextReb(r));

  // Preview PDF elegante do recibo (reusa .doc-pv-* + corpo .reb-* + assinatura)
  function previewPDFReb(r){
    const n=DB.negocio;
    return `<div class="doc-preview doc-pdf">
      <div class="doc-pv-head">
        <div class="doc-pv-logo">${esc(n.logo||inicial(n.nome))}</div>
        <div><div class="doc-pv-marca">${esc(n.nome)}</div><div class="doc-pv-seg">Recibo</div></div>
      </div>
      <div class="reb-body">
        Recebi de <b>${esc(r.cliente||'—')}</b> a importância de <b>${fmt(r.valor)}</b>
        <span class="reb-ext">(${esc(extenso(r.valor))})</span>${r.referente?`, referente a <b>${esc(r.referente)}</b>`:''}.
      </div>
      <div class="reb-meta">
        ${r.formaPgto?`<div>Forma de pagamento: <b>${esc(r.formaPgto)}</b></div>`:''}
        <div>${esc(n.cidade?n.cidade+', ':'')}${esc(dataFmt(r.data))}</div>
      </div>
      <div class="reb-sign"><div class="reb-sign-line"></div><div class="reb-sign-name">${esc(n.nome)}</div></div>
      <div class="doc-pv-foot">${svg('chat',13)} ${esc(foneFmt(n.whatsapp))}</div>
    </div>`;
  }

  return {render};
})();
