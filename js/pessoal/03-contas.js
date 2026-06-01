const Contas=(()=>{
  let f={tipo:'todas',status:'todas',cat:'todas',q:''};
  const setF=(k,v)=>{f[k]=v;render();};
  function filtered(){
    return DB.contas.filter(c=>{
      if(f.tipo!=='todas'&&c.tipo!==f.tipo)return false;
      if(f.status==='paga'&&c.status!=='paga')return false;
      if(f.status==='pendente'&&c.status!=='pendente')return false;
      if(f.status==='vencida'&&!(c.status==='pendente'&&diasAte(c.venc)<0))return false;
      if(f.cat!=='todas'&&c.cat!==f.cat)return false;
      if(f.q&&!c.descricao.toLowerCase().includes(f.q.toLowerCase()))return false;
      return true;
    }).sort((a,b)=>a.venc<b.venc?-1:a.venc>b.venc?1:0);
  }
  function rowHTML(c){
    const cat=CATS.find(x=>x.id===c.cat)||{nome:'—',cor:'#8A867C',icone:'box'};
    const vencido=c.status==='pendente'&&diasAte(c.venc)<0;
    const st=c.status==='paga'?'paga':vencido?'vencida':'pendente';
    const lbl=c.status==='paga'?'Paga':vencido?'Vencida':'Pendente';
    return `<div class="lrow ${c.status==='paga'?'paga':''}">
      <div class="li" style="background:${cat.cor}22;color:${cat.cor}">${svg(cat.icone,18)}</div>
      <div class="lmain">
        <div class="lt">${c.descricao}</div>
        <div class="ls"><span class="tagcat" style="background:${cat.cor}20;color:${cat.cor}">${cat.nome}</span><span>·</span><span>${c.status==='paga'?'Paga':venceTxt(c.venc)}</span>${c.recorrente?`<span>·</span><span>${svg('repeat',11)} mensal</span>`:''}<span>·</span><span>${c.metodo}</span></div>
      </div>
      <span class="badge-st st-${st}">${lbl}</span>
      <div class="lval ${c.tipo==='pagar'?'out':'in'}">${c.tipo==='pagar'?'−':'+'}${fmt(c.valor)}</div>
      <div class="lacts">
        ${c.status!=='paga'?`<button class="ok" title="Marcar paga" data-pay="${c.id}">${svg('tick',15)}</button>`:''}
        <button title="Editar" data-edit="${c.id}">${svg('pencil',15)}</button>
        <button class="del" title="Excluir" data-del="${c.id}">${svg('trash',15)}</button>
      </div>
    </div>`;
  }
  const emptyHTML=()=>`<div class="empty"><div class="eico">${svg('wallet',24)}</div><h4>Nenhuma conta encontrada</h4><p>Ajuste os filtros ou toque em "Nova conta" para adicionar.</p></div>`;
  const listHTML=()=>{const it=filtered();return it.length?it.map(rowHTML).join(''):emptyHTML();};
  function bindRows(scope){
    scope.querySelectorAll('[data-pay]').forEach(b=>b.onclick=()=>pay(+b.dataset.pay));
    scope.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    scope.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
  }
  function renderList(){const c=document.querySelector('.contas-list');if(c){c.innerHTML=listHTML();bindRows(c);}}
  function render(){
    const root=document.getElementById('contas-root');if(!root)return;
    const pend=DB.contas.filter(c=>c.status==='pendente');
    const aPagar=pend.filter(c=>c.tipo==='pagar').reduce((s,c)=>s+c.valor,0);
    const aReceber=pend.filter(c=>c.tipo==='receber').reduce((s,c)=>s+c.valor,0);
    const vencidas=pend.filter(c=>diasAte(c.venc)<0).reduce((s,c)=>s+c.valor,0);
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('arrowup',14)}</span>A pagar</div><div class="kv" style="color:var(--expense)">${fmt(aPagar)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('arrowdown',14)}</span>A receber</div><div class="kv" style="color:var(--income)">${fmt(aReceber)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('alert',14)}</span>Vencidas</div><div class="kv">${fmt(vencidas)}</div></div>
      </div>
      <div class="toolbar">
        <div class="seg">${['todas','pagar','receber'].map(t=>`<button class="${f.tipo===t?'on':''}" data-tipo="${t}">${t==='todas'?'Todas':t==='pagar'?'A pagar':'A receber'}</button>`).join('')}</div>
        <select class="field" data-fstatus><option value="todas">Todos status</option><option value="pendente"${f.status==='pendente'?' selected':''}>Pendentes</option><option value="vencida"${f.status==='vencida'?' selected':''}>Vencidas</option><option value="paga"${f.status==='paga'?' selected':''}>Pagas</option></select>
        <select class="field" data-fcat><option value="todas">Categorias</option>${CATS.map(c=>`<option value="${c.id}"${f.cat===c.id?' selected':''}>${c.nome}</option>`).join('')}</select>
        <input class="field grow" placeholder="Buscar conta…" data-fq value="${f.q}">
        <button class="btn btn-primary" data-add>${svg('plus',16)} Nova conta</button>
      </div>
      <div class="contas-list">${listHTML()}</div>`;
    root.querySelectorAll('[data-tipo]').forEach(b=>b.onclick=()=>setF('tipo',b.dataset.tipo));
    root.querySelector('[data-fstatus]').onchange=e=>setF('status',e.target.value);
    root.querySelector('[data-fcat]').onchange=e=>setF('cat',e.target.value);
    const q=root.querySelector('[data-fq]');q.oninput=e=>{f.q=e.target.value;renderList();};
    root.querySelector('[data-add]').onclick=()=>form();
    bindRows(root);
  }
  function pay(id){const c=DB.contas.find(x=>x.id===id);if(c){c.status='paga';DB.transacoes.unshift({id:nid(),tipo:c.tipo==='pagar'?'saida':'entrada',descricao:c.descricao,valor:c.valor,cat:c.cat,metodo:c.metodo,data:offset(0)});Toast.show('Conta paga · transação registrada');render();}}
  function del(id){const c=DB.contas.find(x=>x.id===id);if(!c)return;Modal.confirm('Excluir conta?',`"${c.descricao}" será removida permanentemente.`,()=>{DB.contas=DB.contas.filter(x=>x.id!==id);Toast.show('Conta excluída');render();});}
  function form(id){
    const c=id?DB.contas.find(x=>x.id===id):null;
    const body=`
      <div class="seg-in">
        <label class="segopt"><input type="radio" name="ctipo" value="pagar"${!c||c.tipo==='pagar'?' checked':''}><span>A pagar</span></label>
        <label class="segopt"><input type="radio" name="ctipo" value="receber"${c&&c.tipo==='receber'?' checked':''}><span>A receber</span></label>
      </div>
      <div class="fg"><label>Descrição</label><input class="field" id="f-desc" value="${c?c.descricao.replace(/"/g,'&quot;'):''}" placeholder="Ex: Aluguel"></div>
      <div class="frow">
        <div class="fg"><label>Valor (R$)</label><input class="field" id="f-valor" type="number" step="0.01" min="0" value="${c?c.valor:''}" placeholder="0,00"></div>
        <div class="fg"><label>Vencimento</label><input class="field" id="f-venc" type="date" value="${c?c.venc:offset(0)}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Categoria</label><select class="field" id="f-cat">${CATS.map(x=>`<option value="${x.id}"${c&&c.cat===x.id?' selected':''}>${x.nome}</option>`).join('')}</select></div>
        <div class="fg"><label>Método</label><select class="field" id="f-met">${['Pix','Dinheiro','Débito','Crédito','Transferência'].map(m=>`<option${c&&c.metodo===m?' selected':''}>${m}</option>`).join('')}</select></div>
      </div>
      ${id?'':`<div class="frow"><div class="fg"><label>Repetir</label><select class="field" id="f-rep"><option value="nao">Não repetir</option><option value="mensal">Mensal (6×)</option></select></div><div class="fg"><label>Parcelas</label><input class="field" id="f-parc" type="number" min="1" max="48" value="1"></div></div>`}`;
    Modal.open(id?'Editar conta':'Nova conta',body,(back)=>{
      const desc=back.querySelector('#f-desc').value.trim();
      const valor=parseFloat(back.querySelector('#f-valor').value);
      const venc=back.querySelector('#f-venc').value;
      const cat=back.querySelector('#f-cat').value;
      const met=back.querySelector('#f-met').value;
      const tipo=back.querySelector('input[name=ctipo]:checked').value;
      if(!desc||!(valor>0)||!venc){Toast.show('Preencha descrição, valor e vencimento','err');return false;}
      if(c){Object.assign(c,{descricao:desc,valor,venc,cat,metodo:met,tipo});Toast.show('Conta atualizada');}
      else{
        const rep=back.querySelector('#f-rep').value;
        const parc=Math.min(48,Math.max(1,parseInt(back.querySelector('#f-parc').value)||1));
        if(parc>1){for(let i=0;i<parc;i++)DB.contas.push({id:nid(),tipo,descricao:`${desc} (${i+1}/${parc})`,valor,cat,metodo:met,venc:addMonths(venc,i),status:'pendente',parcela:`${i+1}/${parc}`});Toast.show(`${parc} parcelas criadas`);}
        else if(rep==='mensal'){for(let i=0;i<6;i++)DB.contas.push({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,venc:addMonths(venc,i),status:'pendente',recorrente:true});Toast.show('Conta recorrente criada');}
        else{DB.contas.push({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,venc,status:'pendente'});Toast.show('Conta criada');}
      }
      render();
    },id?'Salvar':'Adicionar');
  }
  return {render,form,pay};
})();

const Transacoes=(()=>{
  function mStart(){const d=new Date(HOJE);d.setDate(1);return d.toISOString().slice(0,10);}
  function mEnd(){const d=new Date(HOJE);d.setMonth(d.getMonth()+1,0);return d.toISOString().slice(0,10);}
  let f={tipo:'todas',cat:'todas',di:mStart(),df:mEnd(),q:''};
  const setF=(k,v)=>{f[k]=v;render();};
  function diaLabel(iso){const n=diasAte(iso);if(n===0)return 'Hoje';if(n===-1)return 'Ontem';const d=new Date(iso+'T00:00:00');const ds=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];const ms=['jan','fev','mar','abr','maio','jun','jul','ago','set','out','nov','dez'];return `${ds[d.getDay()]}, ${d.getDate()} de ${ms[d.getMonth()]}`;}
  function filtered(){
    return DB.transacoes.filter(t=>{
      if(f.tipo!=='todas'&&t.tipo!==f.tipo)return false;
      if(f.cat!=='todas'&&t.cat!==f.cat)return false;
      if(f.di&&t.data<f.di)return false;
      if(f.df&&t.data>f.df)return false;
      if(f.q&&!t.descricao.toLowerCase().includes(f.q.toLowerCase()))return false;
      return true;
    }).sort((a,b)=>a.data<b.data?1:a.data>b.data?-1:0);
  }
  function rowHTML(t){
    const cat=CATS.find(x=>x.id===t.cat)||{nome:'—',cor:'#8A867C',icone:'box'};
    return `<div class="lrow">
      <div class="li" style="background:${t.tipo==='entrada'?'var(--income-soft)':'var(--expense-soft)'};color:${t.tipo==='entrada'?'var(--income)':'var(--expense)'}">${svg(t.tipo==='entrada'?'arrowdown':'arrowup',18)}</div>
      <div class="lmain"><div class="lt">${t.descricao}</div><div class="ls"><span class="tagcat" style="background:${cat.cor}20;color:${cat.cor}">${cat.nome}</span><span>·</span><span>${t.metodo}</span></div></div>
      <div class="lval ${t.tipo==='entrada'?'in':'out'}">${t.tipo==='entrada'?'+':'−'}${fmt(t.valor)}</div>
      <div class="lacts"><button title="Editar" data-edit="${t.id}">${svg('pencil',15)}</button><button class="del" title="Excluir" data-del="${t.id}">${svg('trash',15)}</button></div>
    </div>`;
  }
  const emptyHTML=()=>`<div class="empty"><div class="eico">${svg('repeat',24)}</div><h4>Nenhuma transação no período</h4><p>Ajuste os filtros ou registre uma entrada/saída.</p></div>`;
  function listHTML(){
    const it=filtered();if(!it.length)return emptyHTML();
    const g={};it.forEach(t=>{(g[t.data]=g[t.data]||[]).push(t);});
    return Object.keys(g).sort((a,b)=>a<b?1:-1).map(d=>`<div class="daygroup">${diaLabel(d)}</div>${g[d].map(rowHTML).join('')}`).join('');
  }
  function bindRows(s){
    s.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(+b.dataset.edit));
    s.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>del(+b.dataset.del));
  }
  function renderList(){const c=document.querySelector('.tx-list');if(c){c.innerHTML=listHTML();bindRows(c);}}
  function render(){
    const root=document.getElementById('tx-root');if(!root)return;
    const it=filtered();
    const ent=it.filter(t=>t.tipo==='entrada').reduce((s,t)=>s+t.valor,0);
    const sai=it.filter(t=>t.tipo==='saida').reduce((s,t)=>s+t.valor,0);
    const saldo=ent-sai;
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('arrowdown',14)}</span>Entradas</div><div class="kv" style="color:var(--income)">${fmt(ent)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('arrowup',14)}</span>Saídas</div><div class="kv" style="color:var(--expense)">${fmt(sai)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('wallet',14)}</span>Saldo do período</div><div class="kv" style="color:${saldo>=0?'var(--income)':'var(--expense)'}">${saldo<0?'−':''}${fmt(Math.abs(saldo))}</div></div>
      </div>
      <div class="toolbar">
        <div class="seg">${['todas','entrada','saida'].map(t=>`<button class="${f.tipo===t?'on':''}" data-tipo="${t}">${t==='todas'?'Todas':t==='entrada'?'Entradas':'Saídas'}</button>`).join('')}</div>
        <select class="field" data-fcat><option value="todas">Categorias</option>${CATS.map(c=>`<option value="${c.id}"${f.cat===c.id?' selected':''}>${c.nome}</option>`).join('')}</select>
        <input class="field" type="date" data-fdi value="${f.di}" style="max-width:148px">
        <input class="field" type="date" data-fdf value="${f.df}" style="max-width:148px">
        <input class="field grow" placeholder="Buscar…" data-fq value="${f.q}">
        <button class="btn btn-primary" data-add>${svg('plus',16)} Nova transação</button>
      </div>
      <div class="tx-list">${listHTML()}</div>`;
    root.querySelectorAll('[data-tipo]').forEach(b=>b.onclick=()=>setF('tipo',b.dataset.tipo));
    root.querySelector('[data-fcat]').onchange=e=>setF('cat',e.target.value);
    root.querySelector('[data-fdi]').onchange=e=>setF('di',e.target.value);
    root.querySelector('[data-fdf]').onchange=e=>setF('df',e.target.value);
    const q=root.querySelector('[data-fq]');q.oninput=e=>{f.q=e.target.value;renderList();};
    root.querySelector('[data-add]').onclick=()=>form();
    bindRows(root);
  }
  function del(id){const t=DB.transacoes.find(x=>x.id===id);if(!t)return;Modal.confirm('Excluir transação?',`"${t.descricao}" será removida.`,()=>{DB.transacoes=DB.transacoes.filter(x=>x.id!==id);Toast.show('Transação excluída');render();});}
  function form(id){
    const t=id?DB.transacoes.find(x=>x.id===id):null;
    const body=`
      <div class="seg-in">
        <label class="segopt"><input type="radio" name="ttipo" value="entrada"${t&&t.tipo==='entrada'?' checked':''}><span>Entrada</span></label>
        <label class="segopt"><input type="radio" name="ttipo" value="saida"${!t||t.tipo==='saida'?' checked':''}><span>Saída</span></label>
      </div>
      <div class="fg"><label>Descrição</label><input class="field" id="t-desc" value="${t?t.descricao.replace(/"/g,'&quot;'):''}" placeholder="Ex: Venda, mercado…"></div>
      <div class="frow">
        <div class="fg"><label>Valor (R$)</label><input class="field" id="t-valor" type="number" step="0.01" min="0" value="${t?t.valor:''}" placeholder="0,00"></div>
        <div class="fg"><label>Data</label><input class="field" id="t-data" type="date" value="${t?t.data:offset(0)}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Categoria</label><select class="field" id="t-cat">${CATS.map(x=>`<option value="${x.id}"${t&&t.cat===x.id?' selected':''}>${x.nome}</option>`).join('')}</select></div>
        <div class="fg"><label>Método</label><select class="field" id="t-met">${['Pix','Dinheiro','Débito','Crédito','Transferência'].map(m=>`<option${t&&t.metodo===m?' selected':''}>${m}</option>`).join('')}</select></div>
      </div>`;
    Modal.open(id?'Editar transação':'Nova transação',body,(back)=>{
      const desc=back.querySelector('#t-desc').value.trim();
      const valor=parseFloat(back.querySelector('#t-valor').value);
      const data=back.querySelector('#t-data').value;
      const cat=back.querySelector('#t-cat').value;
      const met=back.querySelector('#t-met').value;
      const tipo=back.querySelector('input[name=ttipo]:checked').value;
      if(!desc||!(valor>0)||!data){Toast.show('Preencha descrição, valor e data','err');return false;}
      if(t){Object.assign(t,{descricao:desc,valor,data,cat,metodo:met,tipo});Toast.show('Transação atualizada');}
      else{DB.transacoes.unshift({id:nid(),tipo,descricao:desc,valor,cat,metodo:met,data});Toast.show('Transação registrada');}
      render();
    },id?'Salvar':'Adicionar');
  }
  return {render};
})();

