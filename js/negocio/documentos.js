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
        <button class="seg-soon" disabled title="Em breve (23B)">${svg('file',14)} Orçamento</button>
        <button class="seg-soon" disabled title="Em breve (23C)">${svg('card',14)} Recibo</button>
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

  function render(){
    const root=document.getElementById('documentos-root');if(!root)return;
    root.innerHTML=`
      ${segBar()}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Documentos</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">Modelos de cardápio/catálogo reutilizáveis · crie 1x, reuse sempre</p>
        </div>
        <button class="btn btn-primary btn-sm" data-novo>${svg('plus',16)} Novo cardápio</button>
      </div>
      ${DB.catalogos.length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">📄</div><p style="color:var(--text-3)">Nenhum cardápio ainda. Crie o primeiro!</p></div>`
        :`<div class="doc-grid">${DB.catalogos.map(cardHTML).join('')}</div>`}
    `;
    bind(root);
  }

  function bind(root){
    root.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>{aba=b.dataset.aba;render();});
    const nv=root.querySelector('[data-novo]');if(nv)nv.onclick=()=>form();
    root.querySelectorAll('[data-wa]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.wa);if(c)enviarWA(c);});
    root.querySelectorAll('[data-ver]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.ver);if(c)Modal.open(esc(c.nome),previewHTML(c),()=>enviarWA(c),'Enviar WhatsApp');});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-dup]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.dup);if(c){DB.catalogos.push({id:nid(),nome:c.nome+' (cópia)',produtoIds:[...c.produtoIds],obs:c.obs});Toast.show('Cardápio duplicado');render();}});
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const c=byId(b.dataset.del);if(c)Modal.confirm('Excluir cardápio?',`"${esc(c.nome)}" será removido permanentemente.`,()=>{DB.catalogos=DB.catalogos.filter(x=>x.id!==c.id);Toast.show('Cardápio excluído');render();});});
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

  // Preview = EXATAMENTE o texto do WhatsApp (bolha estilo zap, com *negrito* e _itálico_ interpretados)
  function previewHTML(c){
    const html=esc(waText(c))
      .replace(/\*([^*\n]+)\*/g,'<strong>$1</strong>')
      .replace(/_([^_\n]+)_/g,'<em>$1</em>');
    return `<div class="doc-preview"><div class="doc-wa-bubble">${html}</div></div>`;
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
  function enviarWA(c){window.open('https://wa.me/?text='+encodeURIComponent(waText(c)),'_blank');}

  return {render};
})();
