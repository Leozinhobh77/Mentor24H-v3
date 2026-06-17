const Contatos=(()=>{
  const AVCOR=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
  const INT_TIPOS={whatsapp:{l:'WhatsApp',e:'💬',c:'var(--income)'},ligacao:{l:'Ligação',e:'📞',c:'var(--brand)'},presencial:{l:'Presencial',e:'🤝',c:'var(--warning)'},email:{l:'E-mail',e:'📧',c:'var(--info)'}};
  function relScore(c){if(!c.manterContato)return null;const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;if(dd===null)return{l:'Sem contato',e:'❄️',cor:'var(--text-3)'};const r=dd/c.manterContato;if(r<0.5)return{l:'Frequente',e:'🔥',cor:'var(--income)'};if(r<1)return{l:'Em dia',e:'💚',cor:'var(--income)'};if(r<1.5)return{l:'Atrasado',e:'⚠️',cor:'var(--warning)'};return{l:'Esfriando',e:'❄️',cor:'var(--expense)'};}
  function tipoRadios(name){return Object.entries(INT_TIPOS).map(([k,v])=>`<label style="display:flex;align-items:center;gap:5px;padding:8px 12px;border-radius:var(--r-md);background:var(--surface-2);cursor:pointer;font-size:13px;font-weight:600"><input type="radio" name="${name}" value="${k}" style="accent-color:var(--brand)"> ${v.e} ${v.l}</label>`).join('')}
  const hash=s=>[...(s||'')].reduce((a,c)=>a+c.charCodeAt(0),0);
  const avCor=n=>AVCOR[hash(n)%AVCOR.length];
  const ini=n=>n.trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';
  const CTX={pessoal:'Pessoal',negocio:'Negócio',ambos:'Ambos'};
  const PAISES=[{f:'🇧🇷',d:'+55'},{f:'🇺🇸',d:'+1'},{f:'🇵🇹',d:'+351'},{f:'🇦🇷',d:'+54'},{f:'🇪🇸',d:'+34'},{f:'🇲🇽',d:'+52'},{f:'🇬🇧',d:'+44'}];
  const TIPOS_TEL=['Celular','WhatsApp','Fixo','Trabalho','Outro'];
  const TIPO_ICO={Celular:'📱',WhatsApp:'💬',Fixo:'📞',Trabalho:'💼',Outro:'📟'};
  function ensureTelefones(c){if(!c.telefones){const d=(c.telefone||'').replace(/\D/g,'');c.telefones=d?[{tipo:'Celular',ddi:'+55',numero:d,principal:true}]:[];}}
  function maskBR(raw){const d=raw.replace(/\D/g,'').slice(0,11);if(!d)return'';if(d.length<=2)return'('+d;if(d.length<=6)return'('+d.slice(0,2)+') '+d.slice(2);if(d.length<=10)return'('+d.slice(0,2)+') '+d.slice(2,6)+'-'+d.slice(6);return'('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7);}
  let f={q:'',ctx:'todos',tag:'todas'};
  let viewing=null;
  function diasAniv(av){if(!av)return null;const p=av.split('-');const mm=+p[1],dd=+p[2];const h=new Date();h.setHours(0,0,0,0);let nx=new Date(h.getFullYear(),mm-1,dd);if(nx<h)nx=new Date(h.getFullYear()+1,mm-1,dd);return Math.round((nx-h)/86400000);}
  const allTags=()=>{const s=new Set();DB.contatos.forEach(c=>(c.tags||[]).forEach(t=>s.add(t)));return [...s];};
  function filtered(){
    return DB.contatos.filter(c=>{
      if(f.ctx!=='todos'&&c.contexto!==f.ctx&&c.contexto!=='ambos')return false;
      if(f.tag!=='todas'&&!(c.tags||[]).includes(f.tag))return false;
      if(f.q){const q=f.q.toLowerCase();if(!c.nome.toLowerCase().includes(q)&&!(c.telefone||'').includes(q)&&!(c.email||'').toLowerCase().includes(q))return false;}
      return true;
    });
  }
  function itemHTML(c){
    const tel=(c.telefone||'').replace(/\D/g,'');const da=diasAniv(c.aniversario);const score=relScore(c);
    return `<div class="ct-item">
      <div class="ct-click" data-open="${c.id}">
      <div class="ct-av" style="background:${avCor(c.nome)}">${ini(c.nome)}</div>
      <div class="ct-main">
        <div class="ct-l1">${c.favorito?`<svg class="ct-star" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.6 3.2L6.7 14l-5-4.8 7-.9z"/></svg>`:''}<span class="ct-nm">${c.nome}</span></div>
        <div class="ct-l2">${score?`<span class="ct-score" style="background:${score.cor}22;color:${score.cor}">${score.e} ${score.l}</span><span class="ct-dotsep"></span>`:''}<span class="ct-ctx">${CTX[c.contexto]||''}</span>${(c.tags||[]).map(t=>`<span class="ct-tag" style="background:${avCor(t)}22;color:${avCor(t)}">${t}</span>`).join('')}${da!=null&&da<=30?`<span class="ct-tag" style="background:var(--warning-soft);color:var(--warning)">🎂 ${da===0?'hoje':da+'d'}</span>`:''}</div>
      </div>
      </div>
      <div class="ct-acts">
        ${tel?`<a class="docbtn wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener" title="WhatsApp">${svg('chat',16)}</a><a class="docbtn" href="tel:+55${tel}" title="Ligar">${svg('phone',16)}</a>`:''}
        ${c.email?`<a class="docbtn ct-hidem" href="mailto:${c.email}" title="E-mail">${svg('mail',16)}</a>`:''}
        <button class="docbtn ct-hidem" data-fav="${c.id}" title="Favorito">${svg('star',15)}</button>
        <button class="docbtn" data-edit="${c.id}" title="Editar">${svg('pencil',15)}</button>
        <button class="docbtn" data-del="${c.id}" title="Excluir">${svg('trash',15)}</button>
      </div>
    </div>`;
  }
  function render(){
    const root=document.getElementById('contatos-root');if(!root)return;
    if(viewing){const cv=DB.contatos.find(x=>x.id===viewing);if(cv){renderFicha(cv);return;}viewing=null;}
    const list=filtered();
    const favs=list.filter(c=>c.favorito).sort((a,b)=>a.nome.localeCompare(b.nome,'pt'));
    const rest=list.filter(c=>!c.favorito).sort((a,b)=>a.nome.localeCompare(b.nome,'pt'));
    let groups='',curL='';rest.forEach(c=>{const L=(c.nome.trim()[0]||'#').toUpperCase();if(L!==curL){curL=L;groups+=`<div class="ct-group-label">${L}</div>`;}groups+=itemHTML(c);});
    const tags=allTags();
    const aniv=DB.contatos.filter(c=>{const d=diasAniv(c.aniversario);return d!=null&&d<=30;}).length;
    const reconectar=DB.contatos.filter(c=>{if(c.manterContato==null)return false;const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;return dd==null||dd>=c.manterContato;}).length;
    root.innerHTML=`
      <div class="ct-page">
      <div class="ct-kpis">
        <div class="ct-kpi"><div class="ct-kpi-l"><span class="dot" style="background:var(--brand-soft);color:var(--brand-text)">${svg('users',11)}</span>Contatos</div><div class="ct-kpi-v">${DB.contatos.length}</div></div>
        <div class="ct-kpi"><div class="ct-kpi-l"><span class="dot" style="background:var(--warning-soft);color:var(--warning)">🎂</span>Aniversários</div><div class="ct-kpi-v">${aniv}</div></div>
        <div class="ct-kpi"><div class="ct-kpi-l"><span class="dot" style="background:var(--info-soft);color:var(--info)">${svg('clock',11)}</span>Reconectar</div><div class="ct-kpi-v">${reconectar}</div></div>
      </div>
      <div class="ct-toolbar">
        <div class="ct-search"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-4)" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg><input placeholder="Buscar contato…" data-q value="${f.q}"></div>
        <div class="ct-seg">${['todos','pessoal','negocio'].map(x=>`<button class="${f.ctx===x?'on':''}" data-ctx="${x}">${x==='todos'?'Todos':CTX[x]}</button>`).join('')}</div>
        <div class="ct-chips"><button class="ct-chip${f.tag==='todas'?' on':''}" data-tag="todas">Todas</button>${tags.map(t=>`<button class="ct-chip${f.tag===t?' on':''}" data-tag="${t}">${t}</button>`).join('')}</div>
      </div>
      <button class="ct-newbtn" data-add>${svg('plus',16)} Novo contato</button>
      <div class="ct-list">
        ${list.length?`${favs.length?`<div class="ct-group-label fav">★ Favoritos</div>${favs.map(itemHTML).join('')}`:''}${groups}`:`<div class="empty" style="padding:var(--s-6) var(--s-4)"><div class="eico">${svg('users',24)}</div><h4>Nenhum contato encontrado</h4><p>Adicione seus contatos pessoais e clientes.</p></div>`}
      </div>
      </div>`;
    root.querySelectorAll('[data-ctx]').forEach(b=>b.onclick=()=>{f.ctx=b.dataset.ctx;render();});
    root.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{f.tag=b.dataset.tag;render();});
    const q=root.querySelector('[data-q]');q.oninput=e=>{f.q=e.target.value;render();const nq=document.querySelector('[data-q]');if(nq){nq.focus();nq.setSelectionRange(f.q.length,f.q.length);}};
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-fav]').forEach(b=>b.onclick=()=>{const c=DB.contatos.find(x=>x.id===+b.dataset.fav);c.favorito=!c.favorito;Toast.show(c.favorito?'Adicionado aos favoritos':'Removido dos favoritos');render();});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const c=DB.contatos.find(x=>x.id===+b.dataset.del);Modal.confirm('Excluir contato?',`"${c.nome}" será removido.`,()=>{DB.contatos=DB.contatos.filter(x=>x.id!==c.id);Toast.show('Contato excluído');render();});});
    root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{viewing=+b.dataset.open;render();});
  }
  function renderFicha(c){
    const root=document.getElementById('contatos-root');if(!root)return;
    const tel=(c.telefone||'').replace(/\D/g,'');
    const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;
    const ultTxt=dd==null?'Nunca registrado':dd===0?'Falaram hoje':dd===1?'Falaram ontem':`Há ${dd} dias`;
    const precisa=c.manterContato!=null&&(dd==null||dd>=c.manterContato);
    const ints=[...(c.interacoes||[])].sort((a,b)=>a.data<b.data?1:-1);
    const datas=[...(c.datas||[])];
    const score=relScore(c);
    const fmtD=s=>{const p=s.split('-');return `${p[2]}/${p[1]}/${p[0].slice(2)}`;};
    const diasProx=av=>{const p=av.split('-');const mm=+p[1],d2=+p[2];const h=new Date();h.setHours(0,0,0,0);let nx=new Date(h.getFullYear(),mm-1,d2);if(nx<h)nx=new Date(h.getFullYear()+1,mm-1,d2);return Math.round((nx-h)/86400000);};
    root.innerHTML=`
      <div class="ctf-head">
        <button class="ctf-back" data-back>${svg('chevleft',16)} Voltar</button>
        <div style="flex:1"></div>
        <button class="ctf-ic" data-favf title="Favorito" style="${c.favorito?'color:var(--warning)':''}">${svg('star',16)}</button>
        <button class="ctf-ic" data-editf title="Editar">${svg('pencil',15)}</button>
        <button class="ctf-ic" data-delf title="Excluir">${svg('trash',15)}</button>
      </div>
      <div class="ctf-hero">
        <div class="ct-av" style="width:74px;height:74px;font-size:26px;background:${avCor(c.nome)};margin:0 auto 12px">${ini(c.nome)}</div>
        <div class="ctf-nm">${c.nome}</div>
        <div class="ctf-sub">${CTX[c.contexto]||''}${c.comoConheci?` · conheci por ${c.comoConheci}`:''}</div>
        ${(c.tags||[]).length?`<div class="ctf-chips">${(c.tags||[]).map(t=>`<span class="ct-tag" style="background:${avCor(t)}22;color:${avCor(t)}">${t}</span>`).join('')}</div>`:''}
        ${score?`<div><span class="ctf-score" style="background:${score.cor}22;color:${score.cor}">${score.e} ${score.l}</span></div>`:''}
        ${tel||c.email?`<div class="ctf-pills">
          ${tel?`<a class="ctf-pill ctf-pill-wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener">${svg('chat',16)} WhatsApp</a>`:''}
          ${tel?`<a class="ctf-pill" href="tel:+55${tel}">${svg('phone',15)} Ligar</a>`:''}
          ${c.email?`<a class="ctf-pill" href="mailto:${c.email}">${svg('mail',15)} E-mail</a>`:''}
        </div>`:''}
      </div>
      <div class="ctf-cards">
      <div class="ctf-card">
        <div class="ctf-chead">
          <div class="ctf-cico" style="background:${precisa?'var(--expense-soft)':'var(--brand-soft)'};color:${precisa?'var(--expense)':'var(--brand-text)'}">${svg('clock',16)}</div>
          <h3>Manter contato</h3>
        </div>
        <div class="ctf-kv">Último contato: <b style="color:${precisa?'var(--expense)':'var(--text-1)'}">${ultTxt}</b></div>
        ${precisa?`<div class="ctf-alert">${svg('alert',13)} Hora de reconectar!</div>`:''}
        <div class="ctf-fld">
          <label>Lembrar de falar a cada</label>
          <select class="field" data-freq><option value="">Não lembrar</option>${[7,15,30,60,90].map(n=>`<option value="${n}"${c.manterContato===n?' selected':''}>${n} dias</option>`).join('')}</select>
        </div>
        ${c.proximaAcao?`<div class="ctf-prox">${svg('zap',13)} <span><b>Próxima ação:</b> ${c.proximaAcao.nota} · <span style="color:var(--info);font-weight:700">${fmtD(c.proximaAcao.data)}</span></span><button class="ctf-mini" data-rmprox title="Remover">${svg('x',12)}</button></div>`:''}
        <div class="ctf-btns">
          <button class="ctf-btn ctf-btn-pri" data-falei>${svg('tick',14)} Falei hoje</button>
          <button class="ctf-btn ctf-btn-soft" data-addprox>${svg('zap',14)} ${c.proximaAcao?'Editar ação':'Próxima ação'}</button>
        </div>
      </div>
      <div class="ctf-card">
        <div class="ctf-chead">
          <div class="ctf-cico" style="background:var(--warning-soft);color:var(--warning)">${svg('cake',16)}</div>
          <h3>Datas importantes</h3>
        </div>
        ${c.aniversario?`<div class="ctf-ev"><div class="ctf-ev-bar" style="background:var(--warning)"></div><div class="ctf-ev-em">🎂</div><div class="ctf-ev-mn"><div class="ctf-ev-et">Aniversário</div><div class="ctf-ev-es">${fmtD(c.aniversario)} · em ${diasProx(c.aniversario)}d</div></div></div>`:''}
        ${datas.map((d,i)=>`<div class="ctf-ev"><div class="ctf-ev-bar" style="background:var(--brand)"></div><div class="ctf-ev-em">📅</div><div class="ctf-ev-mn"><div class="ctf-ev-et">${d.label}</div><div class="ctf-ev-es">${fmtD(d.data)} · em ${diasProx(d.data)}d</div></div><button class="ctf-mini" data-rmdata="${i}" title="Remover">${svg('x',12)}</button></div>`).join('')}
        ${!c.aniversario&&!datas.length?`<p style="font-size:12.5px;color:var(--text-4);margin-bottom:10px">Nenhuma data ainda.</p>`:''}
        <button class="ctf-btn ctf-btn-soft ctf-btn-full" data-adddata>${svg('plus',14)} Adicionar data</button>
      </div>
      ${c.anotacoes?`<div class="ctf-card ctf-card--full"><div class="ctf-chead"><div class="ctf-cico" style="background:var(--surface-3);color:var(--text-2)">${svg('book',15)}</div><h3>Anotações</h3></div><p class="ctf-notetxt">${c.anotacoes}</p></div>`:''}
      <div class="ctf-card ctf-card--full">
        <div class="ctf-chead">
          <div class="ctf-cico" style="background:var(--info-soft);color:var(--info)">${svg('repeat',15)}</div>
          <h3>Histórico de interações</h3>
          <button class="ctf-mini" data-addint title="Registrar">+</button>
        </div>
        ${ints.length?ints.map((it,i)=>{const tp=INT_TIPOS[it.tipo]||{l:'Contato',e:'💬',c:'var(--info)'};return`<div class="ctf-ev"><div class="ctf-ev-dt">${it.data.slice(8,10)}/${it.data.slice(5,7)}</div><div class="ctf-ev-bar" style="background:${tp.c}"></div><div class="ctf-ev-mn"><div class="ctf-ev-et">${tp.e} ${it.nota||tp.l}</div><div class="ctf-ev-es" style="color:${tp.c}">${tp.l}</div></div><button class="ctf-mini" data-rmint="${i}" title="Remover">${svg('x',12)}</button></div>`;}).join(''):`<p style="font-size:12.5px;color:var(--text-4)">Nenhuma interação. Use "+" pra começar.</p>`}
      </div>
      </div>`;
    root.querySelector('[data-back]').onclick=()=>{viewing=null;render();};
    root.querySelector('[data-favf]').onclick=()=>{c.favorito=!c.favorito;renderFicha(c);};
    root.querySelector('[data-editf]').onclick=()=>form(c.id);
    root.querySelector('[data-delf]').onclick=()=>Modal.confirm('Excluir contato?',`"${c.nome}" será removido.`,()=>{DB.contatos=DB.contatos.filter(x=>x.id!==c.id);viewing=null;Toast.show('Contato excluído');render();});
    root.querySelector('[data-freq]').onchange=e=>{c.manterContato=e.target.value?+e.target.value:null;renderFicha(c);};
    root.querySelector('[data-falei]').onclick=()=>Modal.open('Como foi o contato?',`<div class="fg"><label>Canal</label><div style="display:flex;gap:8px;flex-wrap:wrap">${tipoRadios('fi-tipo')}</div></div><div class="fg" style="margin-top:var(--s-3)"><label>Nota (opcional)</label><input class="field" id="fi-nota" placeholder="Sobre o que conversaram?"></div>`,(b)=>{const tipo=(b.querySelector('input[name=fi-tipo]:checked')||{}).value||'whatsapp';const nota=b.querySelector('#fi-nota').value.trim()||INT_TIPOS[tipo].l;c.ultimoContato=offset(0);(c.interacoes=c.interacoes||[]).push({data:offset(0),tipo,nota});Toast.show('Registrado! 👍');renderFicha(c);},'Registrar');
    root.querySelector('[data-addprox]').onclick=()=>Modal.open(c.proximaAcao?'Editar próxima ação':'Nova próxima ação',`<div class="fg"><label>O que fazer</label><input class="field" id="pa-nota" value="${c.proximaAcao?c.proximaAcao.nota.replace(/"/g,'&quot;'):''}" placeholder="Ex: Enviar proposta, ligar para confirmar…"></div><div class="fg"><label>Data</label><input class="field" id="pa-data" type="date" value="${c.proximaAcao?c.proximaAcao.data:offset(7)}"></div>`,(b)=>{const nota=b.querySelector('#pa-nota').value.trim(),data=b.querySelector('#pa-data').value;if(!nota){Toast.show('Descreva a ação','err');return false;}c.proximaAcao={nota,data};Toast.show('Próxima ação salva');renderFicha(c);},'Salvar');
    if(root.querySelector('[data-rmprox]'))root.querySelector('[data-rmprox]').onclick=()=>{c.proximaAcao=null;renderFicha(c);};
    root.querySelector('[data-adddata]').onclick=()=>Modal.open('Nova data importante',`<div class="fg"><label>Descrição</label><input class="field" id="dl" placeholder="Ex: Casamento, formatura"></div><div class="fg"><label>Data</label><input class="field" id="ddt" type="date" value="${offset(0)}"></div>`,(b)=>{const label=b.querySelector('#dl').value.trim(),data=b.querySelector('#ddt').value;if(!label||!data){Toast.show('Preencha descrição e data','err');return false;}(c.datas=c.datas||[]).push({label,data});Toast.show('Data adicionada');renderFicha(c);},'Adicionar');
    root.querySelectorAll('[data-rmdata]').forEach(b=>b.onclick=()=>{const d=datas[+b.dataset.rmdata];c.datas=c.datas.filter(x=>x!==d);renderFicha(c);});
    root.querySelector('[data-addint]').onclick=()=>Modal.open('Registrar interação',`<div class="fg"><label>Canal</label><div style="display:flex;gap:8px;flex-wrap:wrap">${tipoRadios('it-tipo')}</div></div><div class="fg" style="margin-top:var(--s-3)"><label>Data</label><input class="field" id="idt" type="date" value="${offset(0)}"></div><div class="fg"><label>Nota</label><input class="field" id="int" placeholder="Sobre o que conversaram?"></div>`,(b)=>{const tipo=(b.querySelector('input[name=it-tipo]:checked')||{}).value||'whatsapp';const data=b.querySelector('#idt').value,nota=b.querySelector('#int').value.trim();if(!data){Toast.show('Informe a data','err');return false;}(c.interacoes=c.interacoes||[]).push({data,tipo,nota});if(!c.ultimoContato||data>c.ultimoContato)c.ultimoContato=data;Toast.show('Interação registrada');renderFicha(c);},'Registrar');
    root.querySelectorAll('[data-rmint]').forEach(b=>b.onclick=()=>{const it=ints[+b.dataset.rmint];c.interacoes=c.interacoes.filter(x=>x!==it);renderFicha(c);});
  }
  function form(id){
    const c=id?DB.contatos.find(x=>x.id===id):null;
    if(c)ensureTelefones(c);
    let tels=c&&c.telefones.length?JSON.parse(JSON.stringify(c.telefones)):[{tipo:'Celular',ddi:'+55',numero:'',principal:true}];
    let tags=c?[...(c.tags||[])]:[];
    function telRowHTML(t,i){
      return`<div class="ct-tel" data-ti="${i}"><div class="ct-tel-top">
        <select class="ct-tel-tipo" data-tipo="${i}">${TIPOS_TEL.map(tp=>`<option value="${tp}"${t.tipo===tp?' selected':''}>${TIPO_ICO[tp]} ${tp}</option>`).join('')}</select>
        <button type="button" class="ct-tel-star${t.principal?' on':''}" data-star="${i}" title="${t.principal?'Principal':'Tornar principal'}">${svg('star',15)}</button>
        <button type="button" class="ct-tel-del" data-tdel="${i}" title="Remover">${svg('trash',14)}</button>
      </div><div class="ct-tel-num">
        <select class="ct-tel-cc" data-cc="${i}">${PAISES.map(p=>`<option value="${p.d}"${t.ddi===p.d?' selected':''}>${p.f} ${p.d}</option>`).join('')}</select>
        <input class="ct-tel-input" data-num="${i}" type="tel" inputmode="tel" value="${t.ddi==='+55'?maskBR(t.numero):t.numero}" placeholder="${t.ddi==='+55'?'(XX) 9XXXX-XXXX':'número'}">
      </div></div>`;
    }
    const body=`
      <div class="ct-form-sec">
        <div class="ct-form-sec-t">${svg('users',13)} Identidade</div>
        <div class="fg"><label>Nome *</label><input class="field" id="cf-nome" value="${c?c.nome.replace(/"/g,'&quot;'):''}" placeholder="Nome completo" autocomplete="off"></div>
      </div>
      <div class="ct-form-sec">
        <div class="ct-form-sec-t">${svg('phone',13)} Telefones</div>
        <div id="ct-tel-list">${tels.map((t,i)=>telRowHTML(t,i)).join('')}</div>
        <button type="button" class="ct-addtel" id="ct-addtel">${svg('plus',14)} Adicionar telefone</button>
      </div>
      <div class="ct-form-sec">
        <div class="ct-form-sec-t">${svg('book',13)} Sobre</div>
        <div class="fg"><label>E-mail</label>
          <div class="ct-email-wrap"><input class="field" id="cf-email" type="email" inputmode="email" value="${c&&c.email?c.email.replace(/"/g,'&quot;'):''}" placeholder="email@exemplo.com"><span class="ct-email-ok" id="ct-email-ok" style="display:none">${svg('tick',16)}</span></div>
          <div class="ct-field-err" id="ct-email-err" style="display:none">E-mail inválido</div>
        </div>
        <div class="frow">
          <div class="fg"><label>Contexto</label><select class="field" id="cf-ctx"><option value="pessoal"${!c||c.contexto==='pessoal'?' selected':''}>Pessoal</option><option value="negocio"${c&&c.contexto==='negocio'?' selected':''}>Negócio</option><option value="ambos"${c&&c.contexto==='ambos'?' selected':''}>Ambos</option></select></div>
          <div class="fg"><label>Aniversário</label><input class="field" id="cf-aniv" type="date" value="${c&&c.aniversario?c.aniversario:''}"></div>
        </div>
        <div class="fg"><label>Tags</label>
          <div class="ct-tagbox" id="ct-tagbox"><input class="ct-taginput" id="ct-taginput" placeholder="+ tag, Enter"></div>
        </div>
        <div class="fg"><label>Como conheci (opcional)</label><input class="field" id="cf-como" value="${c&&c.comoConheci?c.comoConheci.replace(/"/g,'&quot;'):''}" placeholder="Indicação, Instagram…"></div>
        <div class="fg"><label>Anotações</label><input class="field" id="cf-obs" value="${c&&c.anotacoes?c.anotacoes.replace(/"/g,'&quot;'):''}" placeholder="Preferências, observações…"></div>
        <div class="ct-fav-row" id="cf-fav-row">
          <span class="ct-fav-lab">⭐ Marcar como favorito</span>
          <input type="checkbox" id="cf-fav" ${c&&c.favorito?'checked':''} style="display:none">
          <span class="ct-tog${c&&c.favorito?' on':''}" id="cf-fav-tog"></span>
        </div>
      </div>`;
    const back=Modal.open(id?'Editar contato':'Novo contato',body,bk=>{
      const nome=bk.querySelector('#cf-nome').value.trim();
      if(!nome){Toast.show('Informe o nome','err');return false;}
      const email=bk.querySelector('#cf-email').value.trim().toLowerCase();
      if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){Toast.show('E-mail inválido','err');return false;}
      const telefones=tels.filter(t=>t.numero.trim());
      if(telefones.length&&!telefones.some(t=>t.principal))telefones[0].principal=true;
      const pri=telefones.find(t=>t.principal)||telefones[0];
      const telefone=pri?pri.numero.replace(/\D/g,''):'';
      const dd={nome,telefone,telefones,email,contexto:bk.querySelector('#cf-ctx').value,aniversario:bk.querySelector('#cf-aniv').value||'',tags:[...tags],comoConheci:bk.querySelector('#cf-como').value.trim(),anotacoes:bk.querySelector('#cf-obs').value.trim(),favorito:bk.querySelector('#cf-fav').checked};
      if(c){Object.assign(c,dd);Toast.show('Contato atualizado');}
      else{DB.contatos.push(Object.assign({id:nid(),ultimoContato:'',manterContato:null,interacoes:[],datas:[]},dd));Toast.show('Contato adicionado');}
      render();
    },id?'Salvar':'Adicionar');
    // ── Bind phone rows ──────────────────────────────────────
    function bindTels(){
      const tl=back.querySelector('#ct-tel-list');
      tl.querySelectorAll('[data-tipo]').forEach(s=>s.onchange=()=>tels[+s.dataset.tipo].tipo=s.value);
      tl.querySelectorAll('[data-cc]').forEach(s=>s.onchange=()=>{
        const i=+s.dataset.cc;tels[i].ddi=s.value;
        const inp=tl.querySelector(`[data-num="${i}"]`);
        if(inp)inp.placeholder=tels[i].ddi==='+55'?'(XX) 9XXXX-XXXX':'número';
      });
      tl.querySelectorAll('[data-num]').forEach(inp=>inp.addEventListener('input',()=>{
        const i=+inp.dataset.num;
        if(tels[i].ddi==='+55'){
          const pos=inp.selectionStart;
          const dBefore=(inp.value.slice(0,pos).match(/\d/g)||[]).length;
          const masked=maskBR(inp.value);
          inp.value=masked;
          let cnt=0,np=masked.length;
          for(let j=0;j<masked.length;j++){if(/\d/.test(masked[j]))cnt++;if(cnt===dBefore){np=j+1;break;}}
          inp.setSelectionRange(np,np);
          tels[i].numero=masked.replace(/\D/g,'');
        }else{tels[i].numero=inp.value;}
      }));
      tl.querySelectorAll('[data-star]').forEach(btn=>btn.onclick=()=>{
        const i=+btn.dataset.star;tels.forEach((t,j)=>t.principal=j===i);rerenderTels();
      });
      tl.querySelectorAll('[data-tdel]').forEach(btn=>btn.onclick=()=>{
        const i=+btn.dataset.tdel;
        if(tels.length<=1){Toast.show('Ao menos 1 telefone','err');return;}
        const wasPri=tels[i].principal;tels.splice(i,1);
        if(wasPri&&tels.length)tels[0].principal=true;
        rerenderTels();
      });
    }
    function rerenderTels(){
      back.querySelector('#ct-tel-list').innerHTML=tels.map((t,i)=>telRowHTML(t,i)).join('');
      bindTels();
    }
    bindTels();
    back.querySelector('#ct-addtel').onclick=()=>{
      tels.push({tipo:'Celular',ddi:'+55',numero:'',principal:false});
      rerenderTels();
      const ins=back.querySelectorAll('.ct-tel-input');
      if(ins.length)ins[ins.length-1].focus();
    };
    // ── E-mail ───────────────────────────────────────────────
    const emi=back.querySelector('#cf-email');
    const emOk=back.querySelector('#ct-email-ok');
    const emEr=back.querySelector('#ct-email-err');
    function chkEmail(){const v=emi.value.trim();const ok=!v||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);emOk.style.display=v&&ok?'':'none';emEr.style.display=v&&!ok?'':'none';return ok;}
    emi.onblur=chkEmail;emi.oninput=()=>{if(emEr.style.display!=='none')chkEmail();};
    // ── Tags chips ───────────────────────────────────────────
    const tagBox=back.querySelector('#ct-tagbox');
    const tagInp=back.querySelector('#ct-taginput');
    function rerenderTags(){
      tagBox.querySelectorAll('.ct-form-chip').forEach(e=>e.remove());
      tags.forEach(t=>{
        const sp=document.createElement('span');sp.className='ct-form-chip';
        sp.style.cssText=`background:${avCor(t)}22;color:${avCor(t)}`;
        sp.innerHTML=`${t}<button type="button" class="ct-chip-x">×</button>`;
        sp.querySelector('.ct-chip-x').onclick=()=>{tags=tags.filter(x=>x!==t);rerenderTags();};
        tagBox.insertBefore(sp,tagInp);
      });
    }
    rerenderTags();
    tagInp.onkeydown=e=>{
      if(e.key==='Enter'||e.key===','){e.preventDefault();const v=tagInp.value.replace(/,/g,'').trim();if(v&&!tags.includes(v)){tags.push(v);rerenderTags();}tagInp.value='';}
      else if(e.key==='Backspace'&&!tagInp.value&&tags.length){tags.pop();rerenderTags();}
    };
    // ── Favorito toggle ──────────────────────────────────────
    const favTog=back.querySelector('#cf-fav-tog');
    const favInp=back.querySelector('#cf-fav');
    back.querySelector('#cf-fav-row').onclick=()=>{favInp.checked=!favInp.checked;favTog.classList.toggle('on',favInp.checked);};
    // ── Discard confirmation (novo contato) ──────────────────
    if(!id){
      const closeFn=back.querySelector('[data-close]').onclick;
      back.querySelectorAll('[data-close]').forEach(btn=>btn.onclick=()=>{
        const dirty=back.querySelector('#cf-nome').value.trim()||tels.some(t=>t.numero)||tags.length;
        if(dirty&&!confirm('Descartar contato?'))return;
        closeFn?.();
      });
    }
  }
  return {render};
})();

/* ═══════════════════════════════════════════════
   ETAPA 12 — CLIENTES (CRM/Caderneta) + FORNECEDORES
   Clientes = VIEW sobre DB.contatos + DB.vendas (sem DB.clientes).
═══════════════════════════════════════════════ */
