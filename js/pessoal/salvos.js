/* ═══════════════════════════════════════════════
   ETAPA 20 — SALVOS (modo Pessoal)
   Bookmark universal de qualquer link: rede auto-detectada do domínio,
   categoria/criador/tags, favorito, pra-ver/já-vi, cards + detalhe, busca.
   Molde = leitura.js / series.js. Dados em memória (DB). Online-only.
   ⚠️ Offline NÃO puxa título/thumb real (precisa servidor) → Backlog.
      DÁ pra detectar a REDE pelo domínio (offline) — feito aqui.
═══════════════════════════════════════════════ */
const Salvos=(()=>{
  // Cores OFICIAIS das redes (o que mais importa visualmente); ícone com fallback genérico.
  const REDES={
    youtube:  {label:'YouTube',  cor:'#FF0000', ic:'youtube'},
    instagram:{label:'Instagram',cor:'#E1306C', ic:'instagram'},
    tiktok:   {label:'TikTok',   cor:'#111827', ic:'tiktok'},
    pinterest:{label:'Pinterest',cor:'#E60023', ic:'bookmark'},
    x:        {label:'X',        cor:'#111827', ic:'x'},
    spotify:  {label:'Spotify',  cor:'#1DB954', ic:'play'},
    site:     {label:'Site',     cor:'#2D7FF9', ic:'globe'},
  };
  const rede=k=>REDES[k]||REDES.site;
  const ABAS=[['tudo','Tudo'],['youtube','YouTube'],['instagram','Instagram'],['tiktok','TikTok'],['site','Sites']];

  const fmtBR=iso=>{const [y,m,d]=iso.split('-');return `${d}/${m}/${y.slice(2)}`;};
  const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const item=id=>DB.salvos.find(x=>x.id===id);

  // Detecta a rede pelo domínio do link (offline). Usado no "colar e pronto".
  function detectarRede(url){
    const u=(url||'').toLowerCase();
    if(/youtube\.com|youtu\.be/.test(u))return 'youtube';
    if(/instagram\.com/.test(u))return 'instagram';
    if(/tiktok\.com/.test(u))return 'tiktok';
    if(/pinterest\.|pin\.it/.test(u))return 'pinterest';
    if(/(?:\/\/|\.)x\.com|twitter\.com/.test(u))return 'x';
    if(/spotify\.com/.test(u))return 'spotify';
    return 'site';
  }

  // estado da sessão
  let aba='tudo', catFiltro=null, criadorFiltro=null, busca='';

  function lista(){
    let arr=DB.salvos.slice();
    if(aba==='fav')arr=arr.filter(s=>s.favorito);
    else if(aba==='youtube'||aba==='instagram'||aba==='tiktok')arr=arr.filter(s=>s.rede===aba);
    else if(aba==='site')arr=arr.filter(s=>!['youtube','instagram','tiktok'].includes(s.rede));
    if(catFiltro)arr=arr.filter(s=>(s.categoria||'')===catFiltro);
    if(criadorFiltro)arr=arr.filter(s=>(s.criador||'')===criadorFiltro);
    if(busca){const q=busca.toLowerCase();
      arr=arr.filter(s=>[s.titulo,s.criador,s.nota,s.categoria,(s.tags||[]).join(' ')].some(x=>(x||'').toLowerCase().includes(q)));}
    // ordem normal: mais recentes primeiro (favoritos só quando o filtro ❤️ está ativo)
    return arr.sort((a,b)=>(a.data<b.data?1:a.data>b.data?-1:0));
  }
  function categorias(){
    const m={};DB.salvos.forEach(s=>{const c=s.categoria||'Outros';m[c]=(m[c]||0)+1;});
    return Object.entries(m).map(([nome,n])=>({nome,n})).sort((a,b)=>b.n-a.n);
  }

  function render(){
    const root=document.getElementById('salvos-root');if(!root)return;
    const total=DB.salvos.length, favs=DB.salvos.filter(s=>s.favorito).length;
    const cats=categorias(), arr=lista();
    root.innerHTML=`
      <div class="sav-head">
        <button class="btn btn-primary" data-add>${svg('plus',16)} Salvar link</button>
        <div class="sav-search">${svg('search',15)}<input id="sav-q" placeholder="Buscar título, criador, tag…" value="${esc(busca)}"></div>
        <button class="btn btn-soft" data-surpresa title="Sorteia um item de 'pra ver depois'">${svg('dice',15)} Me surpreender</button>
      </div>

      <div class="seg sav-abas">${ABAS.map(([k,l])=>`<button class="${aba===k?'on':''}" data-aba="${k}">${l}</button>`).join('')}</div>

      <div class="sav-chips">
        <button class="sav-chip${!catFiltro?' on':''}" data-cat="">Todas</button>
        ${cats.map(c=>`<button class="sav-chip${catFiltro===c.nome?' on':''}" data-cat="${esc(c.nome)}">${esc(c.nome)} <b>${c.n}</b></button>`).join('')}
      </div>

      ${criadorFiltro?`<div class="sav-criadorbar">${svg('user',13)} Criador: <b>${esc(criadorFiltro)}</b> <button data-clearcri title="Limpar">${svg('x',13)}</button></div>`:''}

      <div class="sav-statbar">
        <span class="sav-stat">${svg('bookmark',14)} <b>${total}</b> ${total===1?'salvo':'salvos'}</span>
        <button class="sav-stat sav-stat-fav${aba==='fav'?' on':''}" data-favtoggle title="${aba==='fav'?'Mostrar tudo':'Ver só favoritos'}">${svg('heart',13)} <b>${favs}</b> Favoritos</button>
        ${(aba!=='tudo'||catFiltro||criadorFiltro||busca)?`<span class="sav-shown">mostrando ${arr.length}</span>`:''}
      </div>
      <div class="sav-grid">${arr.length?arr.map(card).join(''):
        `<div class="empty" style="grid-column:1/-1"><div class="eico">${svg('bookmark',24)}</div><h4>Nada salvo aqui</h4><p>Cole um link e guarde pra ver depois.</p></div>`}</div>`;

    // listeners
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelector('[data-surpresa]').onclick=()=>surpresa();
    root.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>{aba=b.dataset.aba;render();});
    const ft=root.querySelector('[data-favtoggle]');if(ft)ft.onclick=()=>{aba=(aba==='fav'?'tudo':'fav');render();};
    root.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{catFiltro=b.dataset.cat||null;render();});
    const cc=root.querySelector('[data-clearcri]');if(cc)cc.onclick=()=>{criadorFiltro=null;render();};
    root.querySelectorAll('[data-open]').forEach(c=>c.onclick=()=>detalhe(+c.dataset.open));
    root.querySelectorAll('[data-fav]').forEach(b=>b.onclick=e=>{e.stopPropagation();toggleFav(+b.dataset.fav);});
    root.querySelectorAll('[data-criador]').forEach(b=>b.onclick=e=>{e.stopPropagation();criadorFiltro=b.dataset.criador;render();});
    root.querySelectorAll('[data-stop]').forEach(a=>a.onclick=e=>e.stopPropagation());
    const q=root.querySelector('#sav-q');
    if(q)q.oninput=()=>{busca=q.value;const pos=q.selectionStart;render();const nq=document.getElementById('sav-q');if(nq){nq.focus();nq.setSelectionRange(pos,pos);}};
  }

  function card(s){
    const r=rede(s.rede);
    return `<div class="sav-card" data-open="${s.id}" style="--rede:${r.cor}">
      <button class="sav-fav${s.favorito?' on':''}" data-fav="${s.id}" title="Favorito">${svg('heart',15)}</button>
      <span class="sav-badge">${svg(r.ic,11)} ${r.label}</span>
      <div class="sav-tit">${esc(s.titulo)}</div>
      <div class="sav-meta">
        ${s.criador?`<button class="sav-criador" data-criador="${esc(s.criador)}">${svg('user',10)} ${esc(s.criador)}</button>`:''}
        ${s.categoria?`<span class="chip-mini">${esc(s.categoria)}</span>`:''}
      </div>
      <div class="sav-foot">
        <span class="sav-status ${s.status}">${s.status==='ver'?'👀 Pra ver':'✓ Já vi'}</span>
        <a class="sav-open" href="${esc(s.url)}" target="_blank" rel="noopener" data-stop>Abrir ${svg('chevright',13)}</a>
      </div>
    </div>`;
  }

  function detalhe(id){
    const s=item(id);if(!s)return;
    const r=rede(s.rede);
    const body=`
      <div class="sav-det-top" style="--rede:${r.cor}">
        <span class="sav-badge" style="background:${r.cor}">${svg(r.ic,12)} ${r.label}</span>
        <span class="sav-det-cat">${esc(s.categoria||'Outros')}${s.criador?' · '+esc(s.criador):''}</span>
      </div>
      <a class="sav-open-big" href="${esc(s.url)}" target="_blank" rel="noopener">${svg('link',16)} Abrir link</a>
      <div class="sav-url" title="${esc(s.url)}">${esc(s.url)}</div>
      ${s.tags&&s.tags.length?`<div class="sav-tags">${s.tags.map(t=>`<span class="chip-mini">#${esc(t)}</span>`).join('')}</div>`:''}
      ${s.nota?`<p class="sav-det-nota">"${esc(s.nota)}"</p>`:''}
      <div class="sav-det-row">
        <span class="sav-status ${s.status}">${s.status==='ver'?'👀 Pra ver':'✓ Já vi'}</span>
        <span class="sav-fav-lbl${s.favorito?' on':''}">${svg('heart',14)} ${s.favorito?'Favorito':'Sem favorito'}</span>
        <span class="sav-det-data">${fmtBR(s.data)}</span>
      </div>
      <div class="sav-det-acts">
        <button class="btn btn-soft sm" data-copy>${svg('link',14)} Copiar link</button>
        <button class="btn btn-soft sm" data-toggle>${s.status==='ver'?svg('check',14)+' Marcar visto':svg('repeat',14)+' Pra ver'}</button>
        <button class="btn btn-soft sm" data-del>${svg('trash',14)} Excluir</button>
      </div>`;
    const back=Modal.open(s.titulo,body,()=>{form(id);},'Editar');
    back.querySelector('[data-copy]').onclick=()=>{
      if(navigator.clipboard)navigator.clipboard.writeText(s.url).catch(()=>{});
      Toast.show('Link copiado 📋');
    };
    back.querySelector('[data-toggle]').onclick=()=>{
      s.status=s.status==='ver'?'visto':'ver';
      back.querySelector('[data-close]').click();render();
      Toast.show(s.status==='visto'?'Marcado como visto ✓':'Voltou pra "pra ver" 👀');
    };
    back.querySelector('[data-del]').onclick=()=>{back.querySelector('[data-close]').click();del(id);};
  }

  function toggleFav(id){const s=item(id);if(!s)return;s.favorito=!s.favorito;render();}

  function del(id){
    const s=item(id);if(!s)return;
    Modal.confirm('Excluir salvo?',`"${esc(s.titulo)}" será removido.`,()=>{
      DB.salvos=DB.salvos.filter(x=>x.id!==id);Toast.show('Salvo excluído');render();
    });
  }

  function surpresa(){
    const pool=DB.salvos.filter(s=>s.status==='ver');
    if(!pool.length){Toast.show('Nada em "pra ver depois" 🎉');return;}
    detalhe(pool[Math.floor(Math.random()*pool.length)].id);
  }

  function form(id){
    const s=id?item(id):null;
    const cats=[...new Set(DB.salvos.map(x=>x.categoria).filter(Boolean))];
    const body=`
      <div class="fg"><label>Link (URL)</label><input class="field" id="sv-url" value="${esc(s?s.url:'')}" placeholder="Cole o link (YouTube, Instagram, TikTok, site…)"></div>
      <div class="sav-detected" id="sv-badge"></div>
      <div class="fg"><label>Título</label><input class="field" id="sv-tit" value="${esc(s?s.titulo:'')}" placeholder="Ex: Receita de bolo de cenoura"></div>
      <div class="frow">
        <div class="fg"><label>Categoria</label><input class="field" id="sv-cat" list="sv-cats" value="${esc(s?s.categoria:'')}" placeholder="Ex: Receitas"><datalist id="sv-cats">${cats.map(c=>`<option value="${esc(c)}">`).join('')}</datalist></div>
        <div class="fg"><label>Criador</label><input class="field" id="sv-cri" value="${esc(s?s.criador:'')}" placeholder="Ex: @canal"></div>
      </div>
      <div class="fg"><label>Tags (separadas por vírgula)</label><input class="field" id="sv-tags" value="${esc(s?(s.tags||[]).join(', '):'')}" placeholder="Ex: doce, rápido"></div>
      <div class="fg"><label>Nota (opcional)</label><textarea class="field" id="sv-nota" rows="2" placeholder="Por que salvou?">${esc(s?s.nota:'')}</textarea></div>
      <div class="frow">
        <div class="fg"><label>Status</label><select class="field" id="sv-st"><option value="ver"${(s?s.status:'ver')==='ver'?' selected':''}>Pra ver depois</option><option value="visto"${s&&s.status==='visto'?' selected':''}>Já vi</option></select></div>
        <div class="fg"><label>Favorito</label><label class="sav-favchk"><input type="checkbox" id="sv-fav"${s&&s.favorito?' checked':''}> ❤️ Marcar como favorito</label></div>
      </div>`;
    const back=Modal.open(id?'Editar salvo':'Salvar link',body,(b)=>{
      const url=b.querySelector('#sv-url').value.trim();
      const titulo=b.querySelector('#sv-tit').value.trim();
      if(!url){Toast.show('Cole um link','err');return false;}
      if(!titulo){Toast.show('Dê um título','err');return false;}
      const dd={
        url,titulo,
        rede:detectarRede(url),
        categoria:b.querySelector('#sv-cat').value.trim()||'Outros',
        criador:b.querySelector('#sv-cri').value.trim(),
        tags:b.querySelector('#sv-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
        nota:b.querySelector('#sv-nota').value.trim(),
        status:b.querySelector('#sv-st').value,
        favorito:b.querySelector('#sv-fav').checked,
      };
      if(s){Object.assign(s,dd);Toast.show('Salvo atualizado');}
      else{DB.salvos.push(Object.assign({id:nid(),data:offset(0)},dd));Toast.show('Link salvo 🔖');}
      render();
    },id?'Salvar':'Salvar link');
    const urlEl=back.querySelector('#sv-url'),badge=back.querySelector('#sv-badge');
    const paintBadge=()=>{const v=urlEl.value.trim();if(!v){badge.innerHTML='';return;}const r=rede(detectarRede(v));
      badge.innerHTML=`<span class="sav-badge sav-badge-lg" style="background:${r.cor}">${svg(r.ic,13)} Rede detectada: ${r.label}</span>`;};
    urlEl.oninput=paintBadge;paintBadge();
  }

  return {render};
})();
