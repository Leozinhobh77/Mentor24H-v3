const Contatos=(()=>{
  const AVCOR=['#168A7C','#2D7FF9','#1F9D55','#C8860B','#DB4A4A','#E0568C','#7B6CFF','#27B6A3'];
  const INT_TIPOS={whatsapp:{l:'WhatsApp',e:'💬',c:'var(--income)'},ligacao:{l:'Ligação',e:'📞',c:'var(--brand)'},presencial:{l:'Presencial',e:'🤝',c:'var(--warning)'},email:{l:'E-mail',e:'📧',c:'var(--info)'}};
  function relScore(c){if(!c.manterContato)return null;const dd=c.ultimoContato?-diasAte(c.ultimoContato):null;if(dd===null)return{l:'Sem contato',e:'❄️',cor:'var(--text-3)'};const r=dd/c.manterContato;if(r<0.5)return{l:'Frequente',e:'🔥',cor:'var(--income)'};if(r<1)return{l:'Em dia',e:'💚',cor:'var(--income)'};if(r<1.5)return{l:'Atrasado',e:'⚠️',cor:'var(--warning)'};return{l:'Esfriando',e:'❄️',cor:'var(--expense)'};}
  function tipoRadios(name){return Object.entries(INT_TIPOS).map(([k,v])=>`<label style="display:flex;align-items:center;gap:5px;padding:8px 12px;border-radius:var(--r-md);background:var(--surface-2);cursor:pointer;font-size:13px;font-weight:600"><input type="radio" name="${name}" value="${k}" style="accent-color:var(--brand)"> ${v.e} ${v.l}</label>`).join('')}
  const hash=s=>[...(s||'')].reduce((a,c)=>a+c.charCodeAt(0),0);
  const avCor=n=>AVCOR[hash(n)%AVCOR.length];
  const ini=n=>n.trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';
  const CTX={pessoal:'Pessoal',negocio:'Negócio',ambos:'Ambos'};
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
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:var(--s-5)">
        <button class="btn btn-soft" data-back>${svg('chevleft',16)} Voltar</button>
        <div style="flex:1"></div>
        <button class="icon-mini-btn" data-favf title="Favorito" style="${c.favorito?'color:var(--warning)':''}">${svg('star',16)}</button>
        <button class="icon-mini-btn" data-editf title="Editar">${svg('pencil',16)}</button>
        <button class="icon-mini-btn" data-delf title="Excluir">${svg('trash',16)}</button>
      </div>
      <div class="bento">
        <div class="card col-12" style="display:flex;align-items:center;gap:var(--s-5);flex-wrap:wrap">
          <div class="ct-av" style="width:64px;height:64px;font-size:22px;background:${avCor(c.nome)}">${ini(c.nome)}</div>
          <div style="flex:1;min-width:160px">
            <div style="font-size:20px;font-weight:800;letter-spacing:-.02em">${c.nome}</div>
            <div style="font-size:12.5px;color:var(--text-3);font-weight:600;margin-top:2px">${CTX[c.contexto]||''}${c.comoConheci?` · conheci por ${c.comoConheci}`:''}</div>
            <div class="ct-tags" style="margin-top:7px">${(c.tags||[]).map(t=>`<span class="ct-tag" style="background:${avCor(t)}22;color:${avCor(t)}">${t}</span>`).join('')}</div>
            ${score?`<span class="rel-score" style="color:${score.cor}">${score.e} ${score.l}</span>`:''}
          </div>
          <div style="display:flex;gap:8px">
            ${tel?`<a class="docbtn wa" href="https://wa.me/55${tel}" target="_blank" rel="noopener" title="WhatsApp">${svg('chat',18)}</a><a class="docbtn" href="tel:+55${tel}" title="Ligar">${svg('phone',18)}</a>`:''}
            ${c.email?`<a class="docbtn" href="mailto:${c.email}" title="E-mail">${svg('mail',18)}</a>`:''}
          </div>
        </div>
        <div class="card col-6">
          <div class="card-head"><div class="ico" style="background:${precisa?'var(--expense-soft)':'var(--brand-soft)'};color:${precisa?'var(--expense)':'var(--brand-text)'}">${svg('clock',17)}</div><h3>Manter contato</h3></div>
          <div style="font-size:13px;color:var(--text-2);font-weight:600">Último contato: <b style="color:${precisa?'var(--expense)':'var(--text-1)'}">${ultTxt}</b></div>
          ${precisa?`<div style="color:var(--expense);font-weight:700;font-size:12px;margin-top:6px;display:flex;align-items:center;gap:5px">${svg('alert',12)} Hora de reconectar!</div>`:''}
          <div class="fg" style="margin-top:var(--s-4)"><label>Lembrar de falar a cada</label><select class="field" data-freq><option value="">Não lembrar</option>${[7,15,30,60,90].map(n=>`<option value="${n}"${c.manterContato===n?' selected':''}>${n} dias</option>`).join('')}</select></div>
          ${c.proximaAcao?`<div class="prox-acao">${svg('zap',13)} <span style="flex:1"><b>Próxima ação:</b> ${c.proximaAcao.nota}</span><span style="font-size:11px;color:var(--info);font-weight:700;white-space:nowrap">${fmtD(c.proximaAcao.data)}</span><button class="icon-mini-btn" data-rmprox style="width:24px;height:24px">${svg('x',12)}</button></div>`:''}
          <div style="display:flex;gap:8px;margin-top:var(--s-4)">
            <button class="btn btn-primary" data-falei style="flex:1">${svg('tick',15)} Falei hoje</button>
            <button class="btn btn-soft" data-addprox style="flex:1">${svg('zap',14)} ${c.proximaAcao?'Editar ação':'+ Próxima ação'}</button>
          </div>
        </div>
        <div class="card col-6">
          <div class="card-head"><div class="ico" style="background:var(--warning-soft);color:var(--warning)">${svg('cake',17)}</div><h3>Datas importantes</h3></div>
          ${c.aniversario?`<div class="ev-item"><div class="ev-bar" style="background:var(--warning)"></div><div class="ev-main"><div class="et">🎂 Aniversário</div><div class="es">${fmtD(c.aniversario)} · em ${diasProx(c.aniversario)}d</div></div></div>`:''}
          ${datas.map((d,i)=>`<div class="ev-item"><div class="ev-bar" style="background:var(--brand)"></div><div class="ev-main"><div class="et">${d.label}</div><div class="es">${fmtD(d.data)} · em ${diasProx(d.data)}d</div></div><button class="icon-mini-btn" data-rmdata="${i}">${svg('x',14)}</button></div>`).join('')}
          ${!c.aniversario&&!datas.length?`<p style="font-size:12.5px;color:var(--text-4)">Nenhuma data ainda.</p>`:''}
          <button class="btn btn-soft" data-adddata style="margin-top:10px;width:100%">${svg('plus',14)} Adicionar data</button>
        </div>
        ${c.anotacoes?`<div class="card col-12"><div class="card-head"><div class="ico" style="background:var(--surface-3);color:var(--text-2)">${svg('book',17)}</div><h3>Anotações</h3></div><p style="font-size:13.5px;color:var(--text-2);line-height:1.5">${c.anotacoes}</p></div>`:''}
        <div class="card col-12">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('repeat',17)}</div><h3>Histórico de interações</h3><button class="btn btn-primary" data-addint style="font-size:12px;padding:7px 12px">${svg('plus',14)} Registrar</button></div>
          ${ints.length?ints.map((it,i)=>{const tp=INT_TIPOS[it.tipo]||{l:'Contato',e:'💬',c:'var(--info)'};return`<div class="ev-item"><div class="ev-time">${it.data.slice(8,10)}/${it.data.slice(5,7)}</div><div class="ev-bar" style="background:${tp.c}"></div><div class="ev-main"><div class="et"><span style="font-size:13px">${tp.e}</span> ${it.nota||tp.l}</div><div class="es"><span class="int-tipo" style="color:${tp.c}">${tp.l}</span></div></div><button class="icon-mini-btn" data-rmint="${i}">${svg('x',14)}</button></div>`;}).join(''):`<p style="font-size:12.5px;color:var(--text-4)">Nenhuma interação registrada. Use "Registrar" pra começar a timeline.</p>`}
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
    const body=`
      <div class="fg"><label>Nome</label><input class="field" id="c-nome" value="${c?c.nome.replace(/"/g,'&quot;'):''}" placeholder="Nome completo"></div>
      <div class="frow"><div class="fg"><label>Telefone / WhatsApp</label><input class="field" id="c-tel" value="${c?c.telefone||'':''}" placeholder="(31) 98888-7777"></div><div class="fg"><label>E-mail</label><input class="field" id="c-email" value="${c&&c.email?c.email.replace(/"/g,'&quot;'):''}" placeholder="email@exemplo.com"></div></div>
      <div class="frow"><div class="fg"><label>Contexto</label><select class="field" id="c-ctx"><option value="pessoal"${!c||c.contexto==='pessoal'?' selected':''}>Pessoal</option><option value="negocio"${c&&c.contexto==='negocio'?' selected':''}>Negócio</option><option value="ambos"${c&&c.contexto==='ambos'?' selected':''}>Ambos</option></select></div><div class="fg"><label>Aniversário</label><input class="field" id="c-aniv" type="date" value="${c&&c.aniversario?c.aniversario:''}"></div></div>
      <div class="fg"><label>Tags (vírgula)</label><input class="field" id="c-tags" value="${c&&c.tags?c.tags.join(', '):''}" placeholder="Família, Cliente, Fornecedor"></div>
      <div class="fg"><label>Como conheci (opcional)</label><input class="field" id="c-como" value="${c&&c.comoConheci?c.comoConheci.replace(/"/g,'&quot;'):''}" placeholder="Indicação, Instagram…"></div>
      <div class="fg"><label>Anotações</label><input class="field" id="c-obs" value="${c&&c.anotacoes?c.anotacoes.replace(/"/g,'&quot;'):''}" placeholder="Preferências, observações…"></div>
      <label class="fg" style="flex-direction:row;align-items:center;gap:9px;cursor:pointer"><input type="checkbox" id="c-fav" ${c&&c.favorito?'checked':''} style="width:18px;height:18px;accent-color:var(--brand)"><span style="font-size:13px;color:var(--text-2);font-weight:600">Marcar como favorito</span></label>`;
    Modal.open(id?'Editar contato':'Novo contato',body,(b)=>{
      const nome=b.querySelector('#c-nome').value.trim();if(!nome){Toast.show('Informe o nome','err');return false;}
      const dd={nome,telefone:b.querySelector('#c-tel').value.trim(),email:b.querySelector('#c-email').value.trim(),contexto:b.querySelector('#c-ctx').value,aniversario:b.querySelector('#c-aniv').value||'',tags:b.querySelector('#c-tags').value.split(',').map(x=>x.trim()).filter(Boolean),comoConheci:b.querySelector('#c-como').value.trim(),anotacoes:b.querySelector('#c-obs').value.trim(),favorito:b.querySelector('#c-fav').checked};
      if(c){Object.assign(c,dd);Toast.show('Contato atualizado');}else{DB.contatos.push(Object.assign({id:nid(),ultimoContato:'',manterContato:null,interacoes:[],datas:[]},dd));Toast.show('Contato adicionado');}
      render();
    },id?'Salvar':'Adicionar');
  }
  return {render};
})();

/* ═══════════════════════════════════════════════
   ETAPA 12 — CLIENTES (CRM/Caderneta) + FORNECEDORES
   Clientes = VIEW sobre DB.contatos + DB.vendas (sem DB.clientes).
═══════════════════════════════════════════════ */
