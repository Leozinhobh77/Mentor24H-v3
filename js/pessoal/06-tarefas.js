const Tarefas=(()=>{
  const COLS=[{id:'todo',nome:'A fazer',cor:'var(--text-4)'},{id:'doing',nome:'Fazendo',cor:'var(--info)'},{id:'done',nome:'Feito',cor:'var(--income)'}];
  const PR={alta:'Alta',media:'Média',baixa:'Baixa'};
  const ORDER=['todo','doing','done'];
  let filtro='todas', dragId=null;
  function cardHTML(t){
    const subsTot=t.subs?t.subs.length:0, subsDone=t.subs?t.subs.filter(s=>s.done).length:0;
    const idx=ORDER.indexOf(t.coluna);
    const late=t.prazo&&t.coluna!=='done'&&diasAte(t.prazo)<0;
    return `<div class="kcard p-${t.prioridade}" draggable="true" data-id="${t.id}">
      <div class="kc-top">
        <span class="kc-prio">${PR[t.prioridade]}</span>
        <div class="kc-acts">
          <button data-edit="${t.id}" title="Editar">${svg('pencil',13)}</button>
          <button data-del="${t.id}" title="Excluir">${svg('trash',13)}</button>
        </div>
      </div>
      <div class="kc-title">${t.titulo}</div>
      ${t.descricao?`<div class="kc-desc">${t.descricao}</div>`:''}
      ${t.tags&&t.tags.length?`<div class="kc-tags">${t.tags.map(x=>`<span class="kc-tag">${x}</span>`).join('')}</div>`:''}
      ${subsTot?`<div class="kc-subs">${t.subs.map((s,i)=>`<div class="ksub ${s.done?'on':''}" data-sub="${t.id}:${i}"><span class="kx">${svg('tick',10)}</span><span>${s.t}</span></div>`).join('')}</div>`:''}
      <div class="kc-foot">
        ${t.prazo?`<span class="kc-prazo ${late?'late':''}">${svg('calendar',11)} ${venceTxt(t.prazo).replace('Vence ','')}</span>`:''}${subsTot?`<span class="kc-prazo">${svg('check',11)} ${subsDone}/${subsTot}</span>`:''}
        <div class="kc-move">
          <button data-mv="${t.id}:-1" ${idx===0?'disabled':''} title="Voltar">${svg('chevleft',14)}</button>
          <button data-mv="${t.id}:1" ${idx===ORDER.length-1?'disabled':''} title="Avançar">${svg('chevright',14)}</button>
        </div>
      </div>
    </div>`;
  }
  function render(){
    const root=document.getElementById('tarefas-root');if(!root)return;
    const all=DB.tarefas;
    const vis=t=>filtro==='todas'||t.prioridade===filtro;
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('check',14)}</span>Total de tarefas</div><div class="kv">${all.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('play',14)}</span>Em andamento</div><div class="kv" style="color:var(--info)">${all.filter(t=>t.coluna==='doing').length}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('tick',14)}</span>Concluídas</div><div class="kv" style="color:var(--income)">${all.filter(t=>t.coluna==='done').length}</div></div>
      </div>
      <div class="toolbar">
        <select class="field" data-fp><option value="todas">Todas prioridades</option><option value="alta"${filtro==='alta'?' selected':''}>Alta</option><option value="media"${filtro==='media'?' selected':''}>Média</option><option value="baixa"${filtro==='baixa'?' selected':''}>Baixa</option></select>
        <div class="grow"></div>
        <button class="btn btn-primary" data-add>${svg('plus',16)} Nova tarefa</button>
      </div>
      <div class="kanban">
        ${COLS.map(col=>{const items=all.filter(t=>t.coluna===col.id&&vis(t));return `<div class="kcol" data-col="${col.id}">
          <div class="kcol-h"><span class="dot" style="background:${col.cor}"></span><span class="nm">${col.nome}</span><span class="ct">${items.length}</span></div>
          ${items.length?items.map(cardHTML).join(''):'<div class="kdrop-hint">arraste aqui</div>'}
        </div>`;}).join('')}
      </div>`;
    bind(root);
  }
  function bind(root){
    root.querySelector('[data-fp]').onchange=e=>{filtro=e.target.value;render();};
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=e=>{e.stopPropagation();form(+b.dataset.edit);});
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=e=>{e.stopPropagation();del(+b.dataset.del);});
    root.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{const p=b.dataset.sub.split(':');toggleSub(+p[0],+p[1]);});
    root.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const p=b.dataset.mv.split(':');move(+p[0],+p[1]);});
    root.querySelectorAll('.kcard').forEach(card=>{
      card.addEventListener('dragstart',e=>{dragId=+card.dataset.id;card.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
      card.addEventListener('dragend',()=>{card.classList.remove('dragging');root.querySelectorAll('.kcol').forEach(c=>c.classList.remove('drop'));});
    });
    root.querySelectorAll('.kcol').forEach(col=>{
      col.addEventListener('dragover',e=>{e.preventDefault();col.classList.add('drop');});
      col.addEventListener('dragleave',e=>{if(!col.contains(e.relatedTarget))col.classList.remove('drop');});
      col.addEventListener('drop',e=>{e.preventDefault();col.classList.remove('drop');if(dragId!=null){const t=DB.tarefas.find(x=>x.id===dragId);if(t)t.coluna=col.dataset.col;dragId=null;render();}});
    });
  }
  function move(id,dir){const t=DB.tarefas.find(x=>x.id===id);if(!t)return;const i=ORDER.indexOf(t.coluna)+dir;if(i>=0&&i<ORDER.length){t.coluna=ORDER[i];render();}}
  function toggleSub(id,i){const t=DB.tarefas.find(x=>x.id===id);if(t&&t.subs[i]){t.subs[i].done=!t.subs[i].done;render();}}
  function del(id){const t=DB.tarefas.find(x=>x.id===id);if(!t)return;Modal.confirm('Excluir tarefa?',`"${t.titulo}" será removida.`,()=>{DB.tarefas=DB.tarefas.filter(x=>x.id!==id);Toast.show('Tarefa excluída');render();});}
  function form(id){
    const t=id?DB.tarefas.find(x=>x.id===id):null;
    const body=`
      <div class="fg"><label>Título</label><input class="field" id="t-tit" value="${t?t.titulo.replace(/"/g,'&quot;'):''}" placeholder="Ex: Responder cliente"></div>
      <div class="fg"><label>Descrição (opcional)</label><input class="field" id="t-desc" value="${t&&t.descricao?t.descricao.replace(/"/g,'&quot;'):''}" placeholder="Detalhes…"></div>
      <div class="frow">
        <div class="fg"><label>Prioridade</label><select class="field" id="t-pr">${['alta','media','baixa'].map(p=>`<option value="${p}"${(t?t.prioridade:'media')===p?' selected':''}>${PR[p]}</option>`).join('')}</select></div>
        <div class="fg"><label>Coluna</label><select class="field" id="t-col">${COLS.map(c=>`<option value="${c.id}"${(t?t.coluna:'todo')===c.id?' selected':''}>${c.nome}</option>`).join('')}</select></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Prazo (opcional)</label><input class="field" id="t-prazo" type="date" value="${t&&t.prazo?t.prazo:''}"></div>
        <div class="fg"><label>Tags (vírgula)</label><input class="field" id="t-tags" value="${t&&t.tags?t.tags.join(', '):''}" placeholder="Negócio, Urgente"></div>
      </div>
      <div class="fg"><label>Subtarefas</label><div id="t-subs"></div><button type="button" class="btn btn-soft" id="t-addsub" style="margin-top:8px;align-self:flex-start">${svg('plus',14)} Adicionar item</button></div>`;
    const back=Modal.open(id?'Editar tarefa':'Nova tarefa',body,(b)=>{
      const tit=b.querySelector('#t-tit').value.trim();
      if(!tit){Toast.show('Informe um título','err');return false;}
      const data={titulo:tit,descricao:b.querySelector('#t-desc').value.trim(),prioridade:b.querySelector('#t-pr').value,coluna:b.querySelector('#t-col').value,prazo:b.querySelector('#t-prazo').value||null,tags:b.querySelector('#t-tags').value.split(',').map(x=>x.trim()).filter(Boolean),subs:[...b.querySelectorAll('.subrow')].map(r=>({t:r.querySelector('input').value.trim(),done:r.dataset.done==='1'})).filter(s=>s.t)};
      if(t){Object.assign(t,data);Toast.show('Tarefa atualizada');}
      else{DB.tarefas.push(Object.assign({id:nid()},data));Toast.show('Tarefa criada');}
      render();
    },id?'Salvar':'Criar tarefa');
    const wrap=back.querySelector('#t-subs');
    const addSub=(val,done)=>{const row=document.createElement('div');row.className='subrow';row.dataset.done=done?'1':'0';row.style.cssText='display:flex;gap:8px;align-items:center;margin-bottom:6px';row.innerHTML=`<input class="field" style="flex:1" value="${(val||'').replace(/"/g,'&quot;')}" placeholder="Item da checklist"><button type="button" class="icon-mini-btn" data-rm>${svg('x',14)}</button>`;row.querySelector('[data-rm]').onclick=()=>row.remove();wrap.appendChild(row);};
    (t&&t.subs?t.subs:[]).forEach(s=>addSub(s.t,s.done));
    back.querySelector('#t-addsub').onclick=()=>addSub('',false);
  }
  return {render};
})();

