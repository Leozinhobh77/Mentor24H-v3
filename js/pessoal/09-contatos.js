const Contatos=(()=>{
  /* ── CONSTANTES ─────────────────────────────────────────── */
  const AVCOR=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
  const INT_TIPOS={
    whatsapp:{l:'WhatsApp',e:'💬',c:'var(--income)'},
    ligacao:{l:'Ligação',e:'📞',c:'var(--brand)'},
    presencial:{l:'Presencial',e:'🤝',c:'var(--warning)'},
    email:{l:'E-mail',e:'📧',c:'var(--info)'}
  };
  // E2 — países para seletor DDI (emoji bandeira, sem fetch)
  const PAISES=[
    {e:'🇧🇷',n:'Brasil',v:'+55'},
    {e:'🇺🇸',n:'EUA',v:'+1'},
    {e:'🇵🇹',n:'Portugal',v:'+351'},
    {e:'🇦🇷',n:'Argentina',v:'+54'},
    {e:'🇨🇱',n:'Chile',v:'+56'}
  ];

  /* ── HELPERS CORE (preservados) ─────────────────────────── */
  function relScore(c){
    if(!c.manterContato)return null;
    const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;
    if(dd===null)return{l:'Sem contato',e:'❄️',cor:'var(--text-3)'};
    const r=dd/c.manterContato;
    if(r<0.5)return{l:'Frequente',e:'🔥',cor:'var(--income)'};
    if(r<1)return{l:'Em dia',e:'💚',cor:'var(--income)'};
    if(r<1.5)return{l:'Atrasado',e:'⚠️',cor:'var(--warning)'};
    return{l:'Esfriando',e:'❄️',cor:'var(--expense)'};
  }
  const hash=s=>[...(s||'')].reduce((a,c)=>a+c.charCodeAt(0),0);
  const avCor=n=>AVCOR[hash(n)%AVCOR.length];
  const ini=n=>n.trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';
  const CTX={pessoal:'Pessoal',negocio:'Negócio',ambos:'Ambos'};
  let f={q:'',ctx:'todos',tag:'todas'};
  let viewing=null;
  function diasAniv(av){
    if(!av)return null;
    const[,mm,dd]=av.split('-');
    const h=new Date();h.setHours(0,0,0,0);
    let nx=new Date(h.getFullYear(),+mm-1,+dd);
    if(nx<h)nx=new Date(h.getFullYear()+1,+mm-1,+dd);
    return Math.round((nx-h)/86400000);
  }
  const allTags=()=>{const s=new Set();DB.contatos.forEach(c=>(c.tags||[]).forEach(t=>s.add(t)));return[...s];};
  const fmtD=s=>{const p=s.split('-');return`${p[2]}/${p[1]}/${p[0].slice(2)}`;};
  const diasProx=av=>{const[,mm,d2]=av.split('-');const h=new Date();h.setHours(0,0,0,0);let nx=new Date(h.getFullYear(),+mm-1,+d2);if(nx<h)nx=new Date(h.getFullYear()+1,+mm-1,+d2);return Math.round((nx-h)/86400000);};

  /* ── E1 · CAMPO PADRÃO ───────────────────────────────────── */
  function fld(id,label,{type='text',im='',ph='',val='',req=false}={}){
    const imAttr=im?` inputmode="${im}"`:'';
    return`<div class="fg ct-field" data-field="${id}"><label>${label}${req?'<span class="ct-req"> *</span>':''}</label><input class="field" id="${id}" type="${type}"${imAttr} placeholder="${ph}" value="${val}"><div class="ct-err" id="${id}-err"></div></div>`;
  }
  function validEmail(v){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());}
  function setErr(b,id,msg){const e=b&&b.querySelector?b.querySelector(`#${id}-err`):document.getElementById(`${id}-err`);if(e)e.textContent=msg;const i=b&&b.querySelector?b.querySelector(`#${id}`):document.getElementById(id);if(i)i.classList.toggle('ct-field-err',!!msg);}

  /* ── E2 · TELEFONE INTERNACIONAL (vanilla, file://) ─────── */
  // Parse tolerante: extrai dígitos e DDI de qualquer formato
  function phoneParse(raw){
    const s=String(raw||'').trim();
    if(!s)return{digits:'',ddi:'+55'};
    if(s.startsWith('+')){
      // E.164: tenta extrair DDI de 1-3 dígitos
      const m=s.match(/^\+(\d{1,3})(\d+)$/);
      if(m)return{digits:m[2],ddi:'+'+m[1]};
    }
    return{digits:s.replace(/\D/g,''),ddi:'+55'};
  }
  function phoneMaskBR(digits){
    const d=digits.replace(/\D/g,'');
    if(!d.length)return'';
    if(d.length<=2)return`(${d}`;
    if(d.length<=6)return`(${d.slice(0,2)}) ${d.slice(2)}`;
    if(d.length<=10)return`(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return`(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`;
  }
  function phoneE164(digits,ddi='+55'){
    const d=digits.replace(/\D/g,'');
    return d?`${ddi}${d}`:'';
  }
  // Retorna links wa.me / tel: a partir de qualquer formato salvo
  function phoneLinks(raw){
    if(!raw)return null;
    const{digits,ddi}=phoneParse(raw);
    if(!digits)return null;
    const ddiNum=ddi.replace('+','');
    return{wa:`https://wa.me/${ddiNum}${digits}`,tel:`tel:${ddi}${digits}`};
  }
  function phoneField(id,raw=''){
    const{digits,ddi}=phoneParse(raw);
    const opts=PAISES.map(p=>`<option value="${p.v}"${p.v===ddi?' selected':''}>${p.e} ${p.v}</option>`).join('');
    return`<div class="fg ct-field" data-field="${id}"><label>Telefone / WhatsApp</label><div class="ct-tel-wrap"><select class="ct-tel-ddi field" id="${id}-ddi">${opts}</select><input class="field ct-tel-num" id="${id}" type="tel" inputmode="tel" placeholder="(XX) 9XXXX-XXXX" value="${phoneMaskBR(digits)}"></div><div class="ct-err" id="${id}-err"></div></div>`;
  }
  function initPhone(numId,ddiId){
    const n=document.getElementById(numId);
    if(!n)return;
    n.oninput=function(){
      const ddiEl=document.getElementById(ddiId);
      if(!ddiEl||ddiEl.value==='+55'){
        const pos=this.selectionStart;const old=this.value;
        const masked=phoneMaskBR(old.replace(/\D/g,''));
        this.value=masked;
        const delta=masked.length-old.length;
        const np=Math.max(0,pos+delta);this.setSelectionRange(np,np);
      }
    };
  }

  /* ── E3 · CHIP INPUT DE TAGS ─────────────────────────────── */
  function chipInput(id,tags=[]){
    const chips=tags.map(t=>`<span class="ct-chip-tag">${t}<button type="button" class="ct-chip-rm" aria-label="Remover ${t}">✕</button></span>`).join('');
    return`<div class="fg ct-field"><label>Tags</label><div class="ct-chip-wrap" id="${id}-wrap"><div class="ct-chips" id="${id}-chips">${chips}</div><input class="ct-chip-in" id="${id}" placeholder="Adicionar tag…" autocomplete="off"></div><div class="ct-err" id="${id}-err"></div></div>`;
  }
  function getChipTags(id){
    return[...document.querySelectorAll(`#${id}-chips .ct-chip-tag`)].map(el=>el.childNodes[0].textContent.trim());
  }
  function initChips(id){
    const chipsEl=document.getElementById(`${id}-chips`);
    const inp=document.getElementById(id);
    const wrap=document.getElementById(`${id}-wrap`);
    if(!inp||!chipsEl||!wrap)return;
    function add(v){
      v.split(',').map(x=>x.trim()).filter(Boolean).forEach(t=>{
        const ex=[...chipsEl.querySelectorAll('.ct-chip-tag')].map(el=>el.childNodes[0].textContent.trim());
        if(ex.includes(t))return;
        const sp=document.createElement('span');sp.className='ct-chip-tag';
        sp.innerHTML=`${t}<button type="button" class="ct-chip-rm" aria-label="Remover ${t}">✕</button>`;
        sp.querySelector('.ct-chip-rm').onclick=()=>sp.remove();
        chipsEl.appendChild(sp);
      });
      inp.value='';
    }
    inp.onkeydown=e=>{
      if(e.key==='Enter'||e.key===','){e.preventDefault();if(inp.value.trim())add(inp.value);}
      if(e.key==='Backspace'&&!inp.value){const l=chipsEl.querySelector('.ct-chip-tag:last-child');if(l)l.remove();}
    };
    inp.onblur=()=>{if(inp.value.trim())add(inp.value);};
    wrap.onclick=e=>{if(e.target===wrap||e.target.classList.contains('ct-chips'))inp.focus();};
    chipsEl.querySelectorAll('.ct-chip-rm').forEach(b=>b.onclick=()=>b.parentElement.remove());
  }

  /* ── E4 · BADGE DE SCORE ─────────────────────────────────── */
  function scoreBadge(c){
    const s=relScore(c);
    if(!s)return'';
    return`<span class="ct-score-badge" style="color:${s.cor};background:${s.cor.replace(')',',0.12)').replace('var','rgba').replace('--','')}">${s.e} ${s.l}</span>`;
  }
  // Badge com cor inline (tokens CSS sem rgba trick)
  function scoreBadgeHTML(c){
    const s=relScore(c);if(!s)return'';
    return`<span class="ct-score-badge ct-score-${s.e==='🔥'?'hot':s.e==='💚'?'ok':s.e==='⚠️'?'warn':'cold'}">${s.e} ${s.l}</span>`;
  }

  /* ── E5 · BOTÃO-PÍLULA ───────────────────────────────────── */
  function pill(icon,lbl,href,cls=''){
    return href
      ?`<a class="ct-pill ${cls}" href="${href}" target="_blank" rel="noopener" aria-label="${lbl}">${svg(icon,15)}<span>${lbl}</span></a>`
      :``;// onclick version handled inline
  }

  /* ── D7 · CHIPS DE CANAL (substitui tipoRadios) ─────────── */
  function tipoChips(name,sel=''){
    return`<div class="ct-tipo-chips" data-cn="${name}">${Object.entries(INT_TIPOS).map(([k,v])=>`<button type="button" class="ct-tipo-chip${sel===k?' on':''}" data-k="${k}" style="--chip-c:${v.c}">${v.e} ${v.l}</button>`).join('')}</div>`;
  }
  function initTipoChips(name){
    const wrap=document.querySelector(`.ct-tipo-chips[data-cn="${name}"]`);if(!wrap)return;
    wrap.querySelectorAll('.ct-tipo-chip').forEach(b=>{
      b.onclick=()=>{wrap.querySelectorAll('.ct-tipo-chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');};
    });
  }
  function getSelTipo(name){
    const b=document.querySelector(`.ct-tipo-chips[data-cn="${name}"] .ct-tipo-chip.on`);
    return b?b.dataset.k:'whatsapp';
  }

  /* ── FILTER (preservado) ─────────────────────────────────── */
  function filtered(){
    return DB.contatos.filter(c=>{
      if(f.ctx!=='todos'&&c.contexto!==f.ctx&&c.contexto!=='ambos')return false;
      if(f.tag!=='todas'&&!(c.tags||[]).includes(f.tag))return false;
      if(f.q){const q=f.q.toLowerCase();if(!c.nome.toLowerCase().includes(q)&&!(c.telefone||'').includes(q)&&!(c.email||'').toLowerCase().includes(q))return false;}
      return true;
    });
  }

  /* ── T81 · LINHA DA LISTA ────────────────────────────────── */
  function itemHTML(c){
    const links=phoneLinks(c.telefone);
    const da=diasAniv(c.aniversario);
    const tagChips=(c.tags||[]).map(t=>`<span class="ct-tag" style="background:${avCor(t)}22;color:${avCor(t)}">${t}</span>`).join('');
    const anivChip=da!=null&&da<=30?`<span class="ct-tag ct-tag-aniv">🎂 ${da===0?'hoje':da+'d'}</span>`:'';
    return`<div class="ct-item">
  <div class="ct-click" data-open="${c.id}" role="button" tabindex="0" aria-label="Abrir ficha de ${c.nome}">
    <div class="ct-av" style="background:${avCor(c.nome)}">${ini(c.nome)}</div>
    <div class="ct-main">
      <div class="ct-nm">${c.favorito?`<span class="ct-fav-ico" aria-hidden="true">${svg('star',11)}</span>`:''}<span class="ct-nm-txt">${c.nome}</span><span class="ct-ctx">· ${CTX[c.contexto]||''}</span>${scoreBadgeHTML(c)}</div>
      <div class="ct-tags">${tagChips}${anivChip}</div>
    </div>
  </div>
  <div class="ct-acts">
    ${links?`<a class="docbtn wa" href="${links.wa}" target="_blank" rel="noopener" title="WhatsApp" aria-label="WhatsApp ${c.nome}">${svg('chat',16)}</a><a class="docbtn" href="${links.tel}" title="Ligar" aria-label="Ligar para ${c.nome}">${svg('phone',16)}</a>`:''}
    ${c.email?`<a class="docbtn ct-hidem" href="mailto:${c.email}" title="E-mail" aria-label="E-mail ${c.nome}">${svg('mail',16)}</a>`:''}
    <button class="docbtn ct-hidem" data-fav="${c.id}" title="${c.favorito?'Remover favorito':'Adicionar favorito'}" aria-label="${c.favorito?'Remover favorito':'Favoritar'}">${svg('star',15)}</button>
    <button class="docbtn" data-edit="${c.id}" title="Editar" aria-label="Editar ${c.nome}">${svg('pencil',15)}</button>
    <button class="docbtn" data-del="${c.id}" title="Excluir" aria-label="Excluir ${c.nome}">${svg('trash',15)}</button>
  </div>
</div>`;
  }

  /* ── T81 · RENDER DA LISTA ───────────────────────────────── */
  function render(){
    const root=document.getElementById('contatos-root');if(!root)return;
    if(viewing){const cv=DB.contatos.find(x=>x.id===viewing);if(cv){renderFicha(cv);return;}viewing=null;}
    const list=filtered();
    const favs=list.filter(c=>c.favorito).sort((a,b)=>a.nome.localeCompare(b.nome,'pt'));
    const rest=list.filter(c=>!c.favorito).sort((a,b)=>a.nome.localeCompare(b.nome,'pt'));
    let groups='',curL='';
    rest.forEach(c=>{const L=(c.nome.trim()[0]||'#').toUpperCase();if(L!==curL){curL=L;groups+=`<div class="ct-group-label">${L}</div>`;}groups+=itemHTML(c);});

    // KPI data
    const totalC=DB.contatos.length;
    const anivN=DB.contatos.filter(c=>{const d=diasAniv(c.aniversario);return d!=null&&d<=30;}).length;
    const reconN=DB.contatos.filter(c=>{if(!c.manterContato)return false;const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;return dd==null||dd>=c.manterContato;}).length;

    // Faixa de destaque (A3)
    const anivProx=DB.contatos.filter(c=>{const d=diasAniv(c.aniversario);return d!=null&&d<=7;}).sort((a,b)=>diasAniv(a.aniversario)-diasAniv(b.aniversario));
    const reconProx=DB.contatos.filter(c=>{if(!c.manterContato)return false;const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;return dd==null||dd>=c.manterContato;});
    const faixaHTML=(anivProx.length||reconProx.length)?`<div class="ct-faixa">
      ${reconProx.length?`<div class="ct-faixa-item ct-faixa-rec" data-faixa-ctx="${reconProx.map(x=>x.id).join(',')}">${svg('clock',13)} <b>${reconProx.length}</b> para reconectar</div>`:''}
      ${anivProx.length?`<div class="ct-faixa-item ct-faixa-aniv">🎂 <b>${anivProx[0].nome}</b>${anivProx.length>1?` +${anivProx.length-1} outros`:''} · aniversário em breve</div>`:''}
    </div>`:'';

    // Tags como chips roláveis (A2)
    const tags=allTags();
    const tagChipsFilter=`<div class="ct-tag-filter-wrap"><div class="ct-tag-chips" role="group" aria-label="Filtrar por tag"><button class="ct-tag-fc${f.tag==='todas'?' on':''}" data-tag="todas">Todas</button>${tags.map(t=>`<button class="ct-tag-fc${f.tag===t?' on':''}" data-tag="${t}">${t}</button>`).join('')}</div></div>`;

    root.innerHTML=`
      <!-- A1 KPIs enxutos -->
      <div class="ct-kpis">
        <div class="ct-kpi-pill"><span class="ct-kpi-ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('users',13)}</span><span class="ct-kpi-val">${totalC}</span><span class="ct-kpi-lbl">Contatos</span></div>
        <div class="ct-kpi-pill"><span class="ct-kpi-ico" style="background:var(--warning-soft);color:var(--warning)">🎂</span><span class="ct-kpi-val">${anivN}</span><span class="ct-kpi-lbl">Aniversários 30d</span></div>
        <div class="ct-kpi-pill ct-kpi-rec${reconN?'':' ct-kpi-zero'}"><span class="ct-kpi-ico" style="background:${reconN?'var(--info-soft)':'var(--surface-3)'};color:${reconN?'var(--info)':'var(--text-4)'}">${svg('clock',13)}</span><span class="ct-kpi-val">${reconN}</span><span class="ct-kpi-lbl">Reconectar</span></div>
      </div>
      <!-- A3 Faixa de destaque -->
      ${faixaHTML}
      <!-- A2 Barra de ferramentas -->
      <div class="ct-toolbar">
        <div class="ct-search-wrap"><span class="ct-search-ico" aria-hidden="true">${svg('search',15)}</span><input class="ct-search-inp" placeholder="Buscar contato…" data-q value="${f.q}" aria-label="Buscar contato">${f.q?`<button class="ct-search-clr" data-clear-q aria-label="Limpar busca">✕</button>`:''}</div>
        <div class="ct-toolbar-row">
          <div class="ct-seg" role="group" aria-label="Filtrar por contexto">${['todos','pessoal','negocio'].map(x=>`<button class="${f.ctx===x?'on':''}" data-ctx="${x}">${x==='todos'?'Todos':CTX[x]}</button>`).join('')}</div>
          <button class="btn btn-primary ct-btn-add" data-add aria-label="Novo contato">${svg('plus',15)} Novo</button>
        </div>
        ${tags.length?tagChipsFilter:''}
      </div>
      <!-- Lista -->
      <div class="card ct-list-card">
        ${list.length
          ?`${favs.length?`<div class="ct-group-label">★ Favoritos</div>${favs.map(itemHTML).join('')}`:''}${groups}`
          :`<div class="ct-empty"><div class="ct-empty-ico">${svg('users',28)}</div><h4>${f.q||f.tag!=='todas'?'Nenhum resultado encontrado':'Nenhum contato ainda'}</h4><p>${f.q||f.tag!=='todas'?'Tente outros termos ou limpe os filtros.':'Adicione seus contatos pessoais e clientes.'}</p>${f.q||f.tag!=='todas'?`<button class="btn btn-soft" data-clear-all>Limpar filtros</button>`:`<button class="btn btn-primary" data-add>${svg('plus',15)} Novo contato</button>`}</div>`
        }
      </div>`;

    // Event listeners
    root.querySelectorAll('[data-ctx]').forEach(b=>b.onclick=()=>{f.ctx=b.dataset.ctx;render();});
    root.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{f.tag=b.dataset.tag;render();});
    const qEl=root.querySelector('[data-q]');
    if(qEl)qEl.oninput=e=>{f.q=e.target.value;render();const nq=root.querySelector('[data-q]');if(nq){nq.focus();nq.setSelectionRange(f.q.length,f.q.length);}};
    const clrQ=root.querySelector('[data-clear-q]');if(clrQ)clrQ.onclick=()=>{f.q='';render();};
    const clrAll=root.querySelector('[data-clear-all]');if(clrAll)clrAll.onclick=()=>{f.q='';f.tag='todas';render();};
    root.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>form());
    root.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const c=DB.contatos.find(x=>x.id===+b.dataset.fav);if(!c)return;c.favorito=!c.favorito;Toast.show(c.favorito?'Adicionado aos favoritos':'Removido dos favoritos');render();});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const c=DB.contatos.find(x=>x.id===+b.dataset.del);if(!c)return;Modal.confirm('Excluir contato?',`"${c.nome}" será removido permanentemente.`,()=>{DB.contatos=DB.contatos.filter(x=>x.id!==c.id);Toast.show('Contato excluído');render();});});
    root.querySelectorAll('[data-open]').forEach(b=>{b.onclick=()=>{viewing=+b.dataset.open;render();};b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();viewing=+b.dataset.open;render();}};});
  }

  /* ── T82 · FICHA ─────────────────────────────────────────── */
  function renderFicha(c){
    const root=document.getElementById('contatos-root');if(!root)return;
    const links=phoneLinks(c.telefone);
    const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;
    const ultTxt=dd==null?'Nunca registrado':dd===0?'Falaram hoje':dd===1?'Falaram ontem':`Há ${dd} dias`;
    const precisa=c.manterContato!=null&&(dd==null||dd>=c.manterContato);
    const ints=[...(c.interacoes||[])].sort((a,b)=>a.data<b.data?1:-1);
    const datas=[...(c.datas||[])];
    const score=relScore(c);

    root.innerHTML=`
      <!-- C1 Header compacto -->
      <div class="ct-ficha-hdr">
        <button class="btn btn-soft ct-back-btn" data-back aria-label="Voltar">${svg('chevleft',15)} Voltar</button>
        <div class="ct-ficha-hdr-acts">
          <button class="icon-mini-btn${c.favorito?' ct-fav-on':''}" data-favf title="${c.favorito?'Remover favorito':'Favoritar'}">${svg('star',16)}</button>
          <button class="icon-mini-btn" data-editf title="Editar">${svg('pencil',16)}</button>
          <button class="icon-mini-btn ct-del-btn" data-delf title="Excluir">${svg('trash',16)}</button>
        </div>
      </div>
      <!-- C2 HERO -->
      <div class="ct-hero">
        <div class="ct-av ct-av-lg" style="background:${avCor(c.nome)}">${ini(c.nome)}</div>
        <div class="ct-hero-body">
          <div class="ct-hero-nome">${c.nome}</div>
          <div class="ct-hero-ctx">${CTX[c.contexto]||''}${c.comoConheci?` · conheci por ${c.comoConheci}`:''}</div>
          ${(c.tags||[]).length?`<div class="ct-tags ct-hero-tags">${(c.tags||[]).map(t=>`<span class="ct-tag" style="background:${avCor(t)}22;color:${avCor(t)}">${t}</span>`).join('')}</div>`:''}
          ${score?`<div class="ct-hero-score">${scoreBadgeHTML(c)}</div>`:''}
          <!-- E5 Ações em pílula -->
          <div class="ct-pills">
            ${links?`<a class="ct-pill ct-pill-wa" href="${links.wa}" target="_blank" rel="noopener" aria-label="WhatsApp">${svg('chat',14)}<span>WhatsApp</span></a><a class="ct-pill" href="${links.tel}" aria-label="Ligar">${svg('phone',14)}<span>Ligar</span></a>`:''}
            ${c.email?`<a class="ct-pill" href="mailto:${c.email}" aria-label="E-mail">${svg('mail',14)}<span>E-mail</span></a>`:''}
            <button type="button" class="ct-pill" data-addint-quick aria-label="Registrar contato">${svg('repeat',14)}<span>Registrar</span></button>
          </div>
        </div>
      </div>
      <!-- C3–C6 Bento compacto -->
      <div class="bento">
        <!-- C3 Manter contato -->
        <div class="card col-6">
          <div class="card-head"><div class="ico" style="background:${precisa?'var(--expense-soft)':'var(--brand-soft)'};color:${precisa?'var(--expense)':'var(--brand-text)'}">${svg('clock',16)}</div><h3>Manter contato</h3></div>
          <div class="ct-ult-contato">Último: <b style="color:${precisa?'var(--expense)':'var(--text-1)'}">${ultTxt}</b></div>
          ${precisa?`<div class="ct-reconectar-alerta">${svg('alert',12)} Hora de reconectar!</div>`:''}
          <div class="fg" style="margin-top:var(--s-3)"><label>Lembrar a cada</label><select class="field" data-freq><option value="">Não lembrar</option>${[7,15,30,60,90].map(n=>`<option value="${n}"${c.manterContato===n?' selected':''}>${n} dias</option>`).join('')}</select></div>
          ${c.proximaAcao?`<div class="ct-prox-acao">${svg('zap',12)} <span class="ct-prox-txt"><b>Próxima:</b> ${c.proximaAcao.nota}</span><span class="ct-prox-dt">${fmtD(c.proximaAcao.data)}</span><button class="icon-mini-btn" data-rmprox style="width:24px;height:24px" aria-label="Remover próxima ação">${svg('x',11)}</button></div>`:''}
          <div class="ct-acao-btns">
            <button class="btn btn-primary" data-falei>${svg('tick',14)} Falei hoje</button>
            <button class="btn btn-soft" data-addprox>${svg('zap',13)} ${c.proximaAcao?'Editar ação':'+ Próxima ação'}</button>
          </div>
        </div>
        <!-- C4 Datas importantes -->
        <div class="card col-6">
          <div class="card-head"><div class="ico" style="background:var(--warning-soft);color:var(--warning)">${svg('cake',16)}</div><h3>Datas importantes</h3></div>
          ${c.aniversario?`<div class="ev-item"><div class="ev-bar" style="background:var(--warning)"></div><div class="ev-main"><div class="et">🎂 Aniversário</div><div class="es">${fmtD(c.aniversario)} · em ${diasProx(c.aniversario)}d</div></div></div>`:''}
          ${datas.map((d,i)=>`<div class="ev-item"><div class="ev-bar" style="background:var(--brand)"></div><div class="ev-main"><div class="et">${d.label}</div><div class="es">${fmtD(d.data)} · em ${diasProx(d.data)}d</div></div><button class="icon-mini-btn" data-rmdata="${i}" aria-label="Remover data">${svg('x',13)}</button></div>`).join('')}
          ${!c.aniversario&&!datas.length?`<p class="ct-empty-txt">Nenhuma data ainda.</p>`:''}
          <button class="btn btn-soft ct-add-btn" data-adddata>${svg('plus',13)} Adicionar data</button>
        </div>
        <!-- C5 Anotações -->
        ${c.anotacoes?`<div class="card col-12"><div class="card-head"><div class="ico" style="background:var(--surface-3);color:var(--text-2)">${svg('book',16)}</div><h3>Anotações</h3></div><p class="ct-anot-txt">${c.anotacoes}</p></div>`:''}
        <!-- C6 Histórico -->
        <div class="card col-12">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('repeat',16)}</div><h3>Histórico de interações</h3><button class="btn btn-primary ct-reg-btn" data-addint>${svg('plus',13)} Registrar</button></div>
          ${ints.length?ints.map((it,i)=>{const tp=INT_TIPOS[it.tipo]||{l:'Contato',e:'💬',c:'var(--info)'};return`<div class="ev-item"><div class="ev-time">${it.data.slice(8,10)}/${it.data.slice(5,7)}</div><div class="ev-bar" style="background:${tp.c}"></div><div class="ev-main"><div class="et"><span>${tp.e}</span> ${it.nota||tp.l}</div><div class="es ct-int-tipo" style="color:${tp.c}">${tp.l}</div></div><button class="icon-mini-btn" data-rmint="${i}" aria-label="Remover interação">${svg('x',13)}</button></div>`;}).join(''):`<p class="ct-empty-txt">Nenhuma interação. Use "Registrar" para começar a timeline.</p>`}
        </div>
      </div>`;

    // Event listeners
    root.querySelector('[data-back]').onclick=()=>{viewing=null;render();};
    root.querySelector('[data-favf]').onclick=()=>{c.favorito=!c.favorito;renderFicha(c);};
    root.querySelector('[data-editf]').onclick=()=>form(c.id);
    root.querySelector('[data-delf]').onclick=()=>Modal.confirm('Excluir contato?',`"${c.nome}" será removido permanentemente.`,()=>{DB.contatos=DB.contatos.filter(x=>x.id!==c.id);viewing=null;Toast.show('Contato excluído');render();});
    root.querySelector('[data-freq]').onchange=e=>{c.manterContato=e.target.value?+e.target.value:null;renderFicha(c);};

    // Ação rápida Registrar (do hero)
    const aqBtn=root.querySelector('[data-addint-quick]');
    if(aqBtn)aqBtn.onclick=()=>openRegistrar(c);

    // D3 Falei hoje
    root.querySelector('[data-falei]').onclick=()=>{
      Modal.open('Como foi o contato?',
        `<div class="fg"><label>Canal</label>${tipoChips('fi-tipo')}</div><div class="fg ct-field"><label>Nota (opcional)</label><input class="field" id="fi-nota" placeholder="Sobre o que conversaram?"></div>`,
        (b)=>{
          const tipo=getSelTipo('fi-tipo');
          const nota=b.querySelector('#fi-nota').value.trim()||INT_TIPOS[tipo].l;
          c.ultimoContato=offset(0);(c.interacoes=c.interacoes||[]).push({data:offset(0),tipo,nota});
          Toast.show('Registrado! 👍');renderFicha(c);
        },'Registrar');
      setTimeout(()=>initTipoChips('fi-tipo'),0);
    };

    // D4 Próxima ação
    root.querySelector('[data-addprox]').onclick=()=>{
      Modal.open(c.proximaAcao?'Editar próxima ação':'Nova próxima ação',
        `<div class="fg ct-field"><label>O que fazer <span class="ct-req">*</span></label><input class="field" id="pa-nota" value="${c.proximaAcao?c.proximaAcao.nota.replace(/"/g,'&quot;'):''}" placeholder="Ex: Enviar proposta, ligar para confirmar…"><div class="ct-err" id="pa-nota-err"></div></div><div class="fg"><label>Data</label><input class="field" id="pa-data" type="date" value="${c.proximaAcao?c.proximaAcao.data:offset(7)}"></div>`,
        (b)=>{
          const nota=b.querySelector('#pa-nota').value.trim();
          const data=b.querySelector('#pa-data').value;
          if(!nota){setErr(b,'pa-nota','Descreva a ação');return false;}
          c.proximaAcao={nota,data};Toast.show('Próxima ação salva');renderFicha(c);
        },'Salvar');
    };
    if(root.querySelector('[data-rmprox]'))root.querySelector('[data-rmprox]').onclick=()=>{c.proximaAcao=null;renderFicha(c);};

    // D5 Nova data
    root.querySelector('[data-adddata]').onclick=()=>{
      Modal.open('Nova data importante',
        `<div class="fg ct-field"><label>Descrição <span class="ct-req">*</span></label><input class="field" id="dl" placeholder="Ex: Casamento, formatura"><div class="ct-err" id="dl-err"></div></div><div class="fg"><label>Data</label><input class="field" id="ddt" type="date" value="${offset(0)}"></div>`,
        (b)=>{
          const label=b.querySelector('#dl').value.trim();const data=b.querySelector('#ddt').value;
          if(!label){setErr(b,'dl','Informe uma descrição');return false;}
          if(!data){Toast.show('Informe a data','err');return false;}
          (c.datas=c.datas||[]).push({label,data});Toast.show('Data adicionada');renderFicha(c);
        },'Adicionar');
    };
    root.querySelectorAll('[data-rmdata]').forEach(b=>b.onclick=()=>{const d=datas[+b.dataset.rmdata];c.datas=c.datas.filter(x=>x!==d);renderFicha(c);});

    // D6 Registrar interação
    root.querySelector('[data-addint]').onclick=()=>openRegistrar(c);
    root.querySelectorAll('[data-rmint]').forEach(b=>b.onclick=()=>{const it=ints[+b.dataset.rmint];c.interacoes=c.interacoes.filter(x=>x!==it);renderFicha(c);});
  }

  /* D6 · helper de registrar interação (reutilizado por addint e addint-quick) */
  function openRegistrar(c){
    Modal.open('Registrar interação',
      `<div class="fg"><label>Canal</label>${tipoChips('it-tipo')}</div><div class="fg"><label>Data</label><input class="field" id="idt" type="date" value="${offset(0)}"></div><div class="fg ct-field"><label>Nota</label><input class="field" id="int" placeholder="Sobre o que conversaram?"><div class="ct-err" id="int-err"></div></div>`,
      (b)=>{
        const tipo=getSelTipo('it-tipo');
        const data=b.querySelector('#idt').value;const nota=b.querySelector('#int').value.trim();
        if(!data){Toast.show('Informe a data','err');return false;}
        (c.interacoes=c.interacoes||[]).push({data,tipo,nota});
        if(!c.ultimoContato||data>c.ultimoContato)c.ultimoContato=data;
        Toast.show('Interação registrada');renderFicha(c);
      },'Registrar');
    setTimeout(()=>initTipoChips('it-tipo'),0);
  }

  /* ── T80 · FORM NOVO/EDITAR (D1) ─────────────────────────── */
  function form(id){
    const c=id?DB.contatos.find(x=>x.id===id):null;
    const body=`
      ${fld('c-nome','Nome',{ph:'Nome completo',val:c?c.nome.replace(/"/g,'&quot;'):'',req:true})}
      <div class="frow">
        ${phoneField('c-tel',c?c.telefone||'':'')}
        ${fld('c-email','E-mail',{type:'email',im:'email',ph:'email@exemplo.com',val:c&&c.email?c.email.replace(/"/g,'&quot;'):''})}
      </div>
      <div class="frow">
        <div class="fg"><label>Contexto</label><select class="field" id="c-ctx"><option value="pessoal"${!c||c.contexto==='pessoal'?' selected':''}>Pessoal</option><option value="negocio"${c&&c.contexto==='negocio'?' selected':''}>Negócio</option><option value="ambos"${c&&c.contexto==='ambos'?' selected':''}>Ambos</option></select></div>
        ${fld('c-aniv','Aniversário',{type:'date',val:c&&c.aniversario?c.aniversario:''})}
      </div>
      ${chipInput('c-tags',c?c.tags||[]:[])}
      ${fld('c-como','Como conheci',{ph:'Indicação, Instagram…',val:c&&c.comoConheci?c.comoConheci.replace(/"/g,'&quot;'):''})}
      ${fld('c-obs','Anotações',{ph:'Preferências, observações…',val:c&&c.anotacoes?c.anotacoes.replace(/"/g,'&quot;'):''})}
      <label class="fg" style="flex-direction:row;align-items:center;gap:9px;cursor:pointer"><input type="checkbox" id="c-fav" ${c&&c.favorito?'checked':''} style="width:18px;height:18px;accent-color:var(--brand)"><span style="font-size:13px;color:var(--text-2);font-weight:600">Marcar como favorito</span></label>`;

    Modal.open(id?'Editar contato':'Novo contato',body,(b)=>{
      // Limpar erros
      b.querySelectorAll('.ct-err').forEach(e=>e.textContent='');
      b.querySelectorAll('.ct-field-err').forEach(e=>e.classList.remove('ct-field-err'));

      const nome=b.querySelector('#c-nome').value.trim();
      if(!nome){setErr(b,'c-nome','Nome é obrigatório');return false;}

      const emailRaw=b.querySelector('#c-email').value.trim().toLowerCase();
      if(emailRaw&&!validEmail(emailRaw)){setErr(b,'c-email','E-mail inválido');return false;}

      const telNum=b.querySelector('#c-tel').value.trim();
      const telDdi=b.querySelector('#c-tel-ddi')?b.querySelector('#c-tel-ddi').value:'+55';
      const telDigits=telNum.replace(/\D/g,'');
      const telefone=telDigits?phoneE164(telDigits,telDdi):'';

      const tags=getChipTags('c-tags');
      const dd={
        nome,telefone,email:emailRaw,
        contexto:b.querySelector('#c-ctx').value,
        aniversario:b.querySelector('#c-aniv').value||'',
        tags,
        comoConheci:b.querySelector('#c-como').value.trim(),
        anotacoes:b.querySelector('#c-obs').value.trim(),
        favorito:b.querySelector('#c-fav').checked
      };
      if(c){Object.assign(c,dd);Toast.show('Contato atualizado');}
      else{DB.contatos.push(Object.assign({id:nid(),ultimoContato:'',manterContato:null,interacoes:[],datas:[]},dd));Toast.show('Contato adicionado');}
      render();
    },id?'Salvar':'Adicionar');

    // Inicializar componentes interativos após o Modal inserir o DOM
    setTimeout(()=>{
      initChips('c-tags');
      initPhone('c-tel','c-tel-ddi');
    },0);
  }

  return{render};
})();

/* ═══════════════════════════════════════════════
   ETAPA 12 — CLIENTES (CRM/Caderneta) + FORNECEDORES
   Clientes = VIEW sobre DB.contatos + DB.vendas (sem DB.clientes).
═══════════════════════════════════════════════ */
