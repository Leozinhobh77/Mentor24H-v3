const Agenda=(()=>{
  const TIPOS={pessoal:{nome:'Pessoal',cor:'#168A7C'},trabalho:{nome:'Trabalho',cor:'#2D7FF9'},saude:{nome:'Saúde',cor:'#DB4A4A'},aniversario:{nome:'Aniversário',cor:'#E0568C'}};
  const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const DOW=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const _t=new Date(); let view={y:_t.getFullYear(),m:_t.getMonth()}; let sel=offset(0); let filtro='todas';
  const visTipo=e=>filtro==='todas'||e.tipo===filtro;
  const iso=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  function fmtDiaLongo(s){const d=new Date(s+'T00:00:00');return `${DOW[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()].toLowerCase()}`;}
  function evRow(e,comData){
    const tp=TIPOS[e.tipo];
    return `<div class="ev-item"${comData?` data-goto="${e.data}"`:''}><div class="ev-time">${e.hora||'—'}</div><div class="ev-bar" style="background:${tp.cor}"></div><div class="ev-main"><div class="et">${e.tipo==='aniversario'?'🎂 ':''}${e.titulo}</div><div class="es">${comData?`<span>${fmtDiaLongo(e.data)}</span>`:`<span style="color:${tp.cor};font-weight:600">${tp.nome}</span>`}${e.lembrete?`<span>·</span><span>${svg('bell',11)} lembrete</span>`:''}</div></div><div class="ev-acts"><button data-edit="${e.id}" title="Editar">${svg('pencil',14)}</button><button data-del="${e.id}" title="Excluir">${svg('trash',14)}</button></div></div>`;
  }
  function render(){
    const root=document.getElementById('agenda-root');if(!root)return;
    const evs=DB.eventos.filter(visTipo);
    const noMes=evs.filter(e=>{const d=new Date(e.data+'T00:00:00');return d.getFullYear()===view.y&&d.getMonth()===view.m;}).length;
    const prox7=evs.filter(e=>diasAte(e.data)>=0&&diasAte(e.data)<=7).length;
    const aniv=evs.filter(e=>e.tipo==='aniversario'&&diasAte(e.data)>=0&&diasAte(e.data)<=30).length;
    const first=new Date(view.y,view.m,1).getDay();
    const dias=new Date(view.y,view.m+1,0).getDate();
    let cells='';for(let i=0;i<first;i++)cells+='<div></div>';
    for(let d=1;d<=dias;d++){const is=iso(view.y,view.m,d);const de=evs.filter(e=>e.data===is);const dots=[...new Set(de.map(e=>e.tipo))].slice(0,4).map(tp=>`<span style="background:${TIPOS[tp].cor}"></span>`).join('');const cls=['cal-day'];if(is===offset(0))cls.push('today');if(is===sel)cls.push('sel');cells+=`<div class="${cls.join(' ')}" data-day="${is}"><span class="dn">${d}</span><div class="cal-dots">${dots}</div></div>`;}
    const evDia=evs.filter(e=>e.data===sel).sort((a,b)=>(a.hora||'~')<(b.hora||'~')?-1:1);
    const prox=evs.filter(e=>diasAte(e.data)>=0).sort((a,b)=>a.data<b.data?-1:a.data>b.data?1:((a.hora||'~')<(b.hora||'~')?-1:1)).slice(0,6);
    root.innerHTML=`
      <div class="page-kpis">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('calendar',14)}</span>Eventos no mês</div><div class="kv">${noMes}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('clock',14)}</span>Próximos 7 dias</div><div class="kv" style="color:var(--info)">${prox7}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('smile',14)}</span>Aniversários (30d)</div><div class="kv">${aniv}</div></div>
      </div>
      <div class="toolbar">
        <select class="field" data-ft><option value="todas">Todos os tipos</option>${Object.keys(TIPOS).map(k=>`<option value="${k}"${filtro===k?' selected':''}>${TIPOS[k].nome}</option>`).join('')}</select>
        <div class="grow"></div>
        <button class="btn btn-primary" data-add>${svg('plus',16)} Novo evento</button>
      </div>
      <div class="bento">
        <div class="card col-7">
          <div class="cal-head"><button class="icon-btn" data-prev>${svg('chevleft',18)}</button><div class="cal-title">${MESES[view.m]} ${view.y}</div><button class="icon-btn" data-next>${svg('chevright',18)}</button><button class="btn btn-soft" data-today style="margin-left:6px">Hoje</button></div>
          <div class="cal-grid">${DOW.map(d=>`<div class="cal-dow">${d}</div>`).join('')}${cells}</div>
        </div>
        <div class="card col-5">
          <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('calendar',17)}</div><h3>${fmtDiaLongo(sel)}</h3></div>
          ${evDia.length?evDia.map(e=>evRow(e,false)).join(''):`<div class="empty" style="padding:var(--s-6) 0"><p>Nenhum evento neste dia.</p></div>`}
          <button class="btn btn-soft" data-addday style="margin-top:10px;width:100%">${svg('plus',15)} Adicionar neste dia</button>
        </div>
        <div class="card col-12">
          <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('clock',17)}</div><h3>Próximos eventos</h3></div>
          ${prox.length?prox.map(e=>evRow(e,true)).join(''):`<div class="empty" style="padding:var(--s-6) 0"><p>Sem eventos futuros.</p></div>`}
        </div>
      </div>`;
    bind(root);
  }
  function bind(root){
    root.querySelector('[data-ft]').onchange=e=>{filtro=e.target.value;render();};
    root.querySelector('[data-add]').onclick=()=>form();
    root.querySelector('[data-addday]').onclick=()=>form(null,sel);
    root.querySelector('[data-prev]').onclick=()=>{view.m--;if(view.m<0){view.m=11;view.y--;}render();};
    root.querySelector('[data-next]').onclick=()=>{view.m++;if(view.m>11){view.m=0;view.y++;}render();};
    root.querySelector('[data-today]').onclick=()=>{const t=new Date();view={y:t.getFullYear(),m:t.getMonth()};sel=offset(0);render();};
    root.querySelectorAll('[data-day]').forEach(c=>c.onclick=()=>{sel=c.dataset.day;render();});
    root.querySelectorAll('[data-goto]').forEach(c=>c.onclick=ev=>{if(ev.target.closest('[data-edit],[data-del]'))return;sel=c.dataset.goto;const d=new Date(sel+'T00:00:00');view={y:d.getFullYear(),m:d.getMonth()};render();});
    root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();form(+b.dataset.edit);});
    root.querySelectorAll('[data-del]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();del(+b.dataset.del);});
  }
  function del(id){const e=DB.eventos.find(x=>x.id===id);if(!e)return;Modal.confirm('Excluir evento?',`"${e.titulo}" será removido.`,()=>{DB.eventos=DB.eventos.filter(x=>x.id!==id);Toast.show('Evento excluído');render();});}
  function form(id,dataPad){
    const e=id?DB.eventos.find(x=>x.id===id):null;
    const body=`
      <div class="fg"><label>Título</label><input class="field" id="e-tit" value="${e?e.titulo.replace(/"/g,'&quot;'):''}" placeholder="Ex: Consulta médica"></div>
      <div class="frow">
        <div class="fg"><label>Data</label><input class="field" id="e-data" type="date" value="${e?e.data:(dataPad||offset(0))}"></div>
        <div class="fg"><label>Hora (opcional)</label><input class="field" id="e-hora" type="time" value="${e&&e.hora?e.hora:''}"></div>
      </div>
      <div class="fg"><label>Tipo</label><select class="field" id="e-tipo">${Object.keys(TIPOS).map(k=>`<option value="${k}"${(e?e.tipo:'pessoal')===k?' selected':''}>${TIPOS[k].nome}</option>`).join('')}</select></div>
      <label class="fg" style="flex-direction:row;align-items:center;gap:9px;cursor:pointer"><input type="checkbox" id="e-lemb" ${e&&e.lembrete?'checked':''} style="width:18px;height:18px;accent-color:var(--brand)"><span style="font-size:13px;color:var(--text-2);font-weight:600">Lembrar antes do evento</span></label>`;
    Modal.open(id?'Editar evento':'Novo evento',body,(b)=>{
      const tit=b.querySelector('#e-tit').value.trim();
      const data=b.querySelector('#e-data').value;
      if(!tit||!data){Toast.show('Informe título e data','err');return false;}
      const dd={titulo:tit,data,hora:b.querySelector('#e-hora').value||'',tipo:b.querySelector('#e-tipo').value,lembrete:b.querySelector('#e-lemb').checked};
      if(e){Object.assign(e,dd);Toast.show('Evento atualizado');}
      else{DB.eventos.push(Object.assign({id:nid()},dd));Toast.show('Evento criado');}
      sel=data;const nd=new Date(data+'T00:00:00');view={y:nd.getFullYear(),m:nd.getMonth()};
      render();
    },id?'Salvar':'Criar evento');
  }
  return {render};
})();

