/* ═══ FINANCEIRO DO NEGÓCIO (modo Negócio) — Etapa 25A ═══
   💵 Caixa: fluxo por REGIME DE CAIXA agregando o que já existe (vendas pagas,
   fiado recebido, sinais de encomendas, despesas pagas, avulsos) + projeção 30d.
   📑 Despesas: CRUD de DB.despesasNeg (recorrente/parcelada estilo Kyte).
   Só LÊ DB.vendas/DB.encomendas/DB.fornecedores. MEI/Metas = Etapa 25B. */
const Financeiro=(()=>{
  let aba='caixa';
  let mesSel=offset(0).slice(0,7), catFiltro='';          // estado da aba Despesas
  let periodo='30d', dataIni='', dataFim='';              // estado da aba Caixa

  const esc=s=>(s+'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const hoje=()=>offset(0);
  const CATS=['insumos','embalagem','aluguel','luz/água','marketing','taxas','outros'];
  const CATCOR={insumos:'var(--brand)',embalagem:'var(--info)',aluguel:'var(--expense)','luz/água':'var(--warning)',marketing:'var(--brand-text)',taxas:'var(--income)',outros:'var(--text-3)'};
  const dAte=iso=>Math.round((new Date(iso+'T00:00:00')-new Date(hoje()+'T00:00:00'))/86400000);
  const dmy=iso=>{const p=(iso||'').split('-');return p.length===3?`${p[2]}/${p[1]}`:iso||'—';};
  const ymOf=iso=>(iso||'').slice(0,7);
  const addMes=(ym,n)=>{const a=+ym.slice(0,4),m=+ym.slice(5,7);const d=new Date(a,m-1+n,1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;};
  const MESES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const mesLabel=ym=>`${MESES[+ym.slice(5,7)-1]} ${ym.slice(0,4)}`;
  // mesma data de vencimento no mês ym (clampa dia 31 → último dia do mês)
  const diaNoMes=(ym,venc)=>{const dia=+venc.slice(8,10);const a=+ym.slice(0,4),m=+ym.slice(5,7);const last=new Date(a,m,0).getDate();return `${ym}-${String(Math.min(dia,last)).padStart(2,'0')}`;};
  const totalEnc=e=>(e.itens||[]).reduce((s,it)=>s+(+it.qtd||0)*(+it.valor||0),0);
  const restEnc=e=>Math.max(0,totalEnc(e)-(+e.sinal||0));

  function segBar(){
    const btn=(k,l)=>`<button class="${aba===k?'on':''}" data-faba="${k}">${l}</button>`;
    return `<div class="toolbar" style="margin-bottom:var(--s-3)"><div class="seg enc-seg">
      ${btn('caixa','💵 Caixa')}${btn('despesas','📑 Despesas')}
    </div></div>`;
  }

  function render(){
    const root=document.getElementById('financeiro-root');if(!root)return;
    root.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Financeiro</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">Caixa e despesas do negócio · regime de caixa</p>
        </div>
      </div>
      ${segBar()}
      <div id="fin-body"></div>`;
    root.querySelectorAll('[data-faba]').forEach(b=>b.onclick=()=>{aba=b.dataset.faba;render();});
    const body=root.querySelector('#fin-body');
    if(aba==='caixa')renderCaixa(body);else renderDespesas(body);
  }

  /* ════════ 📑 DESPESAS ════════ */
  // Despesas do mês = registros reais do mês + instâncias VIRTUAIS das recorrentes
  // (geradas na leitura, sem job — materializam ao pagar; técnica da Tarefa-03)
  function despesasDoMes(ymSel){
    const reais=DB.despesasNeg.filter(d=>ymOf(d.vencimento)===ymSel);
    const virt=DB.despesasNeg
      .filter(b=>b.recorrencia==='mensal'&&ymOf(b.vencimento)<ymSel&&!reais.some(r=>r._recorrenteDe===b.id))
      .map(b=>({...b,id:'v-'+b.id+'-'+ymSel,_baseId:b.id,virtual:true,pago:false,pagoEm:null,vencimento:diaNoMes(ymSel,b.vencimento)}));
    return reais.concat(virt);
  }

  function pagarDespesa(d){
    if(d.virtual){
      const b=DB.despesasNeg.find(x=>x.id===d._baseId);if(!b)return;
      DB.despesasNeg.push({...b,id:nid(),recorrencia:null,_recorrenteDe:b.id,vencimento:d.vencimento,pago:true,pagoEm:hoje()});
    }else{d.pago=true;d.pagoEm=hoje();}
    Toast.show('Despesa paga');render();
  }

  function despCard(d){
    const cor=CATCOR[d.categoria]||'var(--text-3)';
    const venc=dAte(d.vencimento);
    const status=d.pago
      ?`<span class="fin-st pago">${svg('tick',12)} Pago ${dmy(d.pagoEm)}</span>`
      :venc<0?`<span class="fin-st atrasada">Atrasada · ${dmy(d.vencimento)}</span>`
      :`<span class="fin-st apagar">${venc===0?'Vence hoje':`Vence em ${venc}d`}</span>`;
    return `<div class="fin-card">
      <div class="fin-card-l">
        <div class="fin-desc">${esc(d.desc)}${d.virtual?` <span class="chip-mini" title="Gerada da recorrência">🔁 do mês</span>`:''}</div>
        <div class="fin-meta">
          <span class="tagcat" style="background:color-mix(in srgb,${cor} 14%,transparent);color:${cor}">${esc(d.categoria)}</span>
          <span class="chip-mini">${d.tipo==='fixa'?'Fixa':'Variável'}</span>
          ${d.recorrencia==='mensal'?`<span class="chip-mini">${svg('repeat',11)} mensal</span>`:''}
          ${d.parcelas?`<span class="chip-mini">parcela ${d.parcelas.atual}/${d.parcelas.total}</span>`:''}
          ${status}
        </div>
      </div>
      <div class="fin-card-r">
        <div class="fin-val">${fmt(d.valor)}</div>
        <div class="fin-acts">
          ${!d.pago?`<button class="btn btn-primary btn-sm" data-pagar="${d.id}">${svg('tick',13)} Paguei</button>`:''}
          ${!d.virtual?`<button class="btn-icon" title="Editar" data-editd="${d.id}">${svg('pencil',14)}</button>
          <button class="btn-icon" title="Excluir" data-deld="${d.id}" style="color:var(--expense)">${svg('trash',14)}</button>`:''}
        </div>
      </div>
    </div>`;
  }

  function renderDespesas(root){
    const todas=despesasDoMes(mesSel);
    const lista=todas.filter(d=>!catFiltro||d.categoria===catFiltro)
      .slice().sort((a,b)=>(a.pago-b.pago)||a.vencimento.localeCompare(b.vencimento));
    const total=todas.reduce((s,d)=>s+d.valor,0);
    const pago=todas.filter(d=>d.pago).reduce((s,d)=>s+d.valor,0);
    const totalPrev=despesasDoMes(addMes(mesSel,-1)).reduce((s,d)=>s+d.valor,0);
    const dpct=totalPrev>0?Math.round((total-totalPrev)/totalPrev*100):0;
    // delta invertido: despesa subir é ruim (vermelho), cair é bom (verde)
    const deltaHTML=totalPrev>0&&Math.abs(dpct)>2
      ?`<div class="delta" style="background:var(--${dpct>0?'expense':'income'}-soft);color:var(--${dpct>0?'expense':'income'})">${dpct>0?'▲':'▼'} ${Math.abs(dpct)}%</div>`:'';
    const porCat=CATS.map(c=>({c,v:todas.filter(d=>d.categoria===c).reduce((s,d)=>s+d.valor,0)})).filter(x=>x.v>0);
    const cont=c=>todas.filter(d=>d.categoria===c).length;

    root.innerHTML=`
      <div class="toolbar fin-mes" style="margin-bottom:var(--s-3)">
        <button class="btn-icon" data-mprev title="Mês anterior">‹</button>
        <b>${mesLabel(mesSel)}</b>
        <button class="btn-icon" data-mnext title="Próximo mês">›</button>
        <div style="flex:1"></div>
        <button class="btn btn-primary btn-sm" data-novad>${svg('plus',15)} Nova despesa</button>
      </div>
      <div class="page-kpis" style="margin-bottom:var(--s-4)">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('wallet',14)}</span>Total do mês</div><div style="display:flex;align-items:flex-end;gap:8px"><div class="kv">${fmt(total)}</div>${deltaHTML}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('tick',14)}</span>Pago</div><div class="kv">${fmt(pago)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--warning-soft);color:var(--warning)">${svg('calendar',14)}</span>A pagar</div><div class="kv" style="color:${total-pago>0?'var(--warning)':'var(--text-1)'}">${fmt(total-pago)}</div></div>
      </div>
      ${porCat.length?`<div class="card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--expense-soft);color:var(--expense)">${svg('chart',16)}</div><h3>Por categoria</h3></div>
        <div class="fin-donut">
          ${Charts.donut(porCat.map(x=>({value:x.v,cor:CATCOR[x.c]})),150)}
          <div class="fin-legend">${porCat.map(x=>`<div class="fin-leg"><span class="dot" style="background:${CATCOR[x.c]}"></span>${esc(x.c)}<b>${fmt(x.v)}</b></div>`).join('')}</div>
        </div>
      </div>`:''}
      <div class="sav-chips" style="margin-bottom:var(--s-3)">
        <button class="sav-chip${!catFiltro?' on':''}" data-fcat="">Todas <b>${todas.length}</b></button>
        ${CATS.filter(c=>cont(c)>0).map(c=>`<button class="sav-chip${catFiltro===c?' on':''}" data-fcat="${esc(c)}">${esc(c)} <b>${cont(c)}</b></button>`).join('')}
      </div>
      ${lista.length===0
        ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">📑</div><h4>Nenhuma despesa ${catFiltro?'nessa categoria':'nesse mês'}</h4><p style="color:var(--text-3)">Registre aluguel, insumos, contas… pro caixa não mentir.</p></div>`
        :`<div class="fin-lista">${lista.map(despCard).join('')}</div>`}`;

    root.querySelector('[data-mprev]').onclick=()=>{mesSel=addMes(mesSel,-1);render();};
    root.querySelector('[data-mnext]').onclick=()=>{mesSel=addMes(mesSel,1);render();};
    root.querySelector('[data-novad]').onclick=()=>formDespesa();
    root.querySelectorAll('[data-fcat]').forEach(b=>b.onclick=()=>{catFiltro=b.dataset.fcat;render();});
    const todasById=id=>todas.find(d=>(d.id+'')===id);
    root.querySelectorAll('[data-pagar]').forEach(b=>b.onclick=()=>{const d=todasById(b.dataset.pagar);if(d)pagarDespesa(d);});
    root.querySelectorAll('[data-editd]').forEach(b=>b.onclick=()=>formDespesa(+b.dataset.editd));
    root.querySelectorAll('[data-deld]').forEach(b=>b.onclick=()=>{
      const d=DB.despesasNeg.find(x=>x.id===+b.dataset.deld);if(!d)return;
      Modal.confirm('Excluir despesa?',`"${esc(d.desc)}" será removida.`,()=>{DB.despesasNeg=DB.despesasNeg.filter(x=>x.id!==d.id);Toast.show('Despesa excluída');render();});
    });
  }

  function formDespesa(id){
    const d=id?DB.despesasNeg.find(x=>x.id===+id):null;
    const fornOpts=DB.fornecedores.map(f=>`<option value="${f.id}"${d&&d.fornecedorId===f.id?' selected':''}>${esc(f.nome)}</option>`).join('');
    Modal.open(d?'Editar despesa':'Nova despesa',`
      <div class="fg"><label>Descrição</label><input class="field" id="fd-desc" value="${d?esc(d.desc):''}" placeholder="Ex: Aluguel da cozinha"></div>
      <div class="frow">
        <div class="fg"><label>Valor (R$)</label><input class="field" id="fd-valor" type="number" min="0" step="0.01" value="${d?d.valor:''}"></div>
        <div class="fg"><label>Categoria</label><input class="field" id="fd-cat" list="fd-cats" value="${d?esc(d.categoria):''}" placeholder="insumos, aluguel…"><datalist id="fd-cats">${CATS.map(c=>`<option value="${c}">`).join('')}</datalist></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Tipo</label><select class="field" id="fd-tipo"><option value="variavel"${!d||d.tipo==='variavel'?' selected':''}>Variável</option><option value="fixa"${d&&d.tipo==='fixa'?' selected':''}>Fixa</option></select></div>
        <div class="fg"><label>Recorrência</label><select class="field" id="fd-rec"><option value="">Nenhuma</option><option value="mensal"${d&&d.recorrencia==='mensal'?' selected':''}>Mensal 🔁</option></select></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Parcela (nº)</label><input class="field" id="fd-patual" type="number" min="1" step="1" value="${d&&d.parcelas?d.parcelas.atual:''}" placeholder="Ex: 3"></div>
        <div class="fg"><label>De (total)</label><input class="field" id="fd-ptotal" type="number" min="1" step="1" value="${d&&d.parcelas?d.parcelas.total:''}" placeholder="Ex: 6"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Vencimento</label><input class="field" id="fd-venc" type="date" value="${d?d.vencimento:hoje()}"></div>
        <div class="fg"><label>Fornecedor (opcional)</label><select class="field" id="fd-forn"><option value="">—</option>${fornOpts}</select></div>
      </div>
      <label class="fin-check"><input type="checkbox" id="fd-pago"${d&&d.pago?' checked':''}> Já está paga</label>`,
      b=>{
        const desc=b.querySelector('#fd-desc').value.trim();
        const valor=+b.querySelector('#fd-valor').value||0;
        if(!desc){Toast.show('Informe a descrição','err');return false;}
        if(valor<=0){Toast.show('Informe o valor','err');return false;}
        const pa=+b.querySelector('#fd-patual').value||0,pt=+b.querySelector('#fd-ptotal').value||0;
        const pago=b.querySelector('#fd-pago').checked;
        const dd={desc,valor,categoria:b.querySelector('#fd-cat').value.trim()||'outros',
          tipo:b.querySelector('#fd-tipo').value,recorrencia:b.querySelector('#fd-rec').value||null,
          parcelas:pa>0&&pt>0?{atual:pa,total:pt}:null,
          vencimento:b.querySelector('#fd-venc').value||hoje(),
          fornecedorId:+b.querySelector('#fd-forn').value||null,
          pago,pagoEm:pago?(d&&d.pagoEm)||hoje():null};
        if(d){Object.assign(d,dd);Toast.show('Despesa atualizada');}
        else{DB.despesasNeg.push(Object.assign({id:nid()},dd));Toast.show('Despesa adicionada');}
        render();
      },d?'Salvar':'Adicionar');
  }

  /* ════════ 💵 CAIXA ════════ */
  const PERIODOS=[{k:'hoje',l:'Hoje'},{k:'7d',l:'7 dias'},{k:'30d',l:'30 dias'},{k:'mes',l:'Mês atual'},{k:'custom',l:'Custom'}];
  function periodoRange(p){
    if(p==='hoje')return [hoje(),hoje()];
    if(p==='7d')return [offset(-6),hoje()];
    if(p==='30d')return [offset(-29),hoje()];
    if(p==='mes'){const d=new Date(HOJE);return [new Date(d.getFullYear(),d.getMonth(),1).toISOString().slice(0,10),hoje()];}
    return [dataIni||offset(-29),dataFim||hoje()];
  }

  // Motor: linha do tempo de eventos de caixa (regime de caixa — quando o dinheiro mexe)
  function eventosCaixa(ini,fim){
    const ev=[];
    DB.vendas.forEach(v=>{
      if(v.pagamento!=='a_prazo')ev.push({data:v.data,tipo:'venda',desc:`Venda — ${v.clienteNome||'balcão'}`,valor:+v.total});
      else if(v.status==='pago')ev.push({data:v.recebidoEm||v.data,tipo:'fiado',desc:`Fiado recebido — ${v.clienteNome||'cliente'}`,valor:+v.total});
    });
    DB.encomendas.forEach(e=>{if(+e.sinal>0)ev.push({data:e.criadaEm||e.data,tipo:'sinal',desc:`Sinal — ${esc(e.cliente)}`,valor:+e.sinal});});
    DB.despesasNeg.forEach(d=>{if(d.pago&&d.pagoEm)ev.push({data:d.pagoEm,tipo:'despesa',desc:d.desc,valor:-d.valor});});
    DB.caixaAvulso.forEach(a=>ev.push({data:a.data,tipo:'avulso',desc:a.desc,valor:a.tipo==='entrada'?+a.valor:-a.valor}));
    return ev.filter(e=>e.data>=ini&&e.data<=fim).sort((a,b)=>a.data.localeCompare(b.data));
  }

  // Projeção 30 dias: saldo atual + compromissos (despesas a pagar/recorrentes) + restantes de encomendas
  function projecao30(){
    const h=hoje(),fim30=offset(30);
    const saldoAtual=eventosCaixa('0000-01-01',h).reduce((s,e)=>s+e.valor,0);
    const fut={};
    DB.despesasNeg.forEach(d=>{
      if(d.pago)return;
      if(d.vencimento<=h)fut[offset(1)]=(fut[offset(1)]||0)-d.valor;             // atrasada: pesa já
      else if(d.vencimento<=fim30)fut[d.vencimento]=(fut[d.vencimento]||0)-d.valor;
    });
    DB.despesasNeg.filter(b=>b.recorrencia==='mensal').forEach(b=>{
      for(let k=1;k<=2;k++){
        const ym2=addMes(ymOf(b.vencimento),k),dt=diaNoMes(ym2,b.vencimento);
        if(dt>h&&dt<=fim30&&!DB.despesasNeg.some(r=>r._recorrenteDe===b.id&&ymOf(r.vencimento)===ym2))
          fut[dt]=(fut[dt]||0)-b.valor;
      }
    });
    DB.encomendas.forEach(e=>{
      if(e.status!=='entregue'&&e.data>h&&e.data<=fim30){const r=restEnc(e);if(r>0)fut[e.data]=(fut[e.data]||0)+r;}
    });
    let s=saldoAtual,diaNeg=null;const vals=[saldoAtual];
    for(let i=1;i<=30;i++){const dt=offset(i);s+=fut[dt]||0;vals.push(s);if(s<0&&diaNeg===null)diaNeg=dt;}
    return {saldoAtual,vals,diaNeg};
  }

  const EVICON={venda:'cart',fiado:'repeat',sinal:'package',despesa:'wallet',avulso:'zap'};
  const EVLBL={venda:'Venda',fiado:'Fiado',sinal:'Sinal',despesa:'Despesa',avulso:'Avulso'};

  function renderCaixa(root){
    const [ini,fim]=periodoRange(periodo);
    const evs=eventosCaixa(ini,fim);
    const entradas=evs.filter(e=>e.valor>0).reduce((s,e)=>s+e.valor,0);
    const saidas=evs.filter(e=>e.valor<0).reduce((s,e)=>s-e.valor,0);
    const fiadoPend=DB.vendas.filter(v=>v.pagamento==='a_prazo'&&v.status!=='pago').reduce((s,v)=>s+v.total,0);
    const encPend=DB.encomendas.filter(e=>e.status!=='entregue').reduce((s,e)=>s+restEnc(e),0);
    // saldo acumulado dia a dia (parte do saldo real anterior ao período)
    const saldoAntes=eventosCaixa('0000-01-01',offset(dAte(ini)-1)).reduce((s,e)=>s+e.valor,0);
    const nDias=Math.max(1,dAte(fim)-dAte(ini)+1);
    let acc=saldoAntes;const porDia={};evs.forEach(e=>{porDia[e.data]=(porDia[e.data]||0)+e.valor;});
    const acum=[];for(let i=0;i<nDias;i++){const dt=offset(dAte(ini)+i);acc+=porDia[dt]||0;acum.push(acc);}
    const proj=projecao30();

    root.innerHTML=`
      <div class="toolbar" style="margin-bottom:var(--s-3)">
        <div class="seg">${PERIODOS.map(p=>`<button class="${periodo===p.k?'on':''}" data-cp="${p.k}">${p.l}</button>`).join('')}</div>
        <div style="flex:1"></div>
        <button class="btn btn-primary btn-sm" data-avulso>${svg('plus',15)} Lançamento</button>
      </div>
      ${periodo==='custom'?`<div style="display:flex;gap:var(--s-2);margin-bottom:var(--s-3)">
        <input class="field" id="fin-ini" type="date" value="${dataIni}" style="flex:1">
        <input class="field" id="fin-fim" type="date" value="${dataFim}" style="flex:1">
      </div>`:''}
      <div class="page-kpis" style="margin-bottom:var(--s-4)">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('trendup',14)}</span>Entradas</div><div class="kv" style="color:var(--income)">${fmt(entradas)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--expense-soft);color:var(--expense)">${svg('wallet',14)}</span>Saídas</div><div class="kv" style="color:var(--expense)">${fmt(saidas)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('activity',14)}</span>Saldo do período</div><div class="kv" style="color:${entradas-saidas>=0?'var(--text-1)':'var(--expense)'}">${fmt(entradas-saidas)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('package',14)}</span>💰 A receber</div><div class="kv">${fmt(fiadoPend+encPend)}</div><div class="fin-kpi-sub">fiado ${fmt(fiadoPend)} · encomendas ${fmt(encPend)}</div></div>
      </div>
      <div class="card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('trendup',16)}</div><h3>Saldo acumulado</h3></div>
        ${acum.length>1?Charts.line(acum,150):'<div class="empty"><p>Período de 1 dia — amplie pra ver a evolução.</p></div>'}
      </div>
      <div class="card${proj.diaNeg?' fin-proj-neg':''}" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--${proj.diaNeg?'expense':'info'}-soft);color:var(--${proj.diaNeg?'expense':'info'})">${svg('calendar',16)}</div><h3>📅 Próximos 30 dias (projetado)</h3></div>
        ${proj.diaNeg
          ?`<div class="fin-alert">⚠️ Pelo ritmo atual, seu caixa fica <b>negativo dia ${dmy(proj.diaNeg)}</b>. Antecipe recebimentos ou segure despesas.</div>`
          :`<div class="fin-ok">✓ Caixa projetado se mantém positivo nos próximos 30 dias.</div>`}
        ${Charts.line(proj.vals,140)}
        <div class="fin-kpi-sub" style="margin-top:var(--s-2)">Hoje: <b>${fmt(proj.saldoAtual)}</b> · Em 30 dias: <b style="color:${proj.vals[30]>=0?'var(--income)':'var(--expense)'}">${fmt(proj.vals[30])}</b> <span style="color:var(--text-3)">(inclui despesas programadas e restantes de encomendas)</span></div>
      </div>
      <div class="card">
        <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('file',16)}</div><h3>Extrato do período</h3></div>
        ${evs.length===0
          ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">💵</div><h4>Nenhuma movimentação</h4><p style="color:var(--text-3)">Venda, despesa paga ou lançamento aparecem aqui.</p></div>`
          :`<div class="fin-extrato">${evs.slice().reverse().map(e=>`
            <div class="fin-ev">
              <span class="fin-ev-ico ${e.valor>=0?'in':'out'}">${svg(EVICON[e.tipo],14)}</span>
              <div class="fin-ev-mid"><div class="fin-ev-desc">${esc(e.desc)}</div><div class="fin-ev-sub">${EVLBL[e.tipo]} · ${dmy(e.data)}</div></div>
              <b class="fin-ev-val ${e.valor>=0?'in':'out'}">${e.valor>=0?'+':'−'} ${fmt(Math.abs(e.valor))}</b>
            </div>`).join('')}</div>`}
      </div>`;

    root.querySelectorAll('[data-cp]').forEach(b=>b.onclick=()=>{periodo=b.dataset.cp;render();});
    if(root.querySelector('#fin-ini'))root.querySelector('#fin-ini').onchange=e=>{dataIni=e.target.value;render();};
    if(root.querySelector('#fin-fim'))root.querySelector('#fin-fim').onchange=e=>{dataFim=e.target.value;render();};
    root.querySelector('[data-avulso]').onclick=()=>{
      Modal.open('Novo lançamento',`
        <div class="fg"><label>Tipo</label><select class="field" id="fa-tipo"><option value="entrada">➕ Entrada</option><option value="saida">➖ Saída</option></select></div>
        <div class="fg"><label>Descrição</label><input class="field" id="fa-desc" placeholder="Ex: Troco, venda extra…"></div>
        <div class="frow">
          <div class="fg"><label>Valor (R$)</label><input class="field" id="fa-valor" type="number" min="0" step="0.01"></div>
          <div class="fg"><label>Data</label><input class="field" id="fa-data" type="date" value="${hoje()}"></div>
        </div>`,
        b=>{
          const desc=b.querySelector('#fa-desc').value.trim(),valor=+b.querySelector('#fa-valor').value||0;
          if(!desc){Toast.show('Informe a descrição','err');return false;}
          if(valor<=0){Toast.show('Informe o valor','err');return false;}
          DB.caixaAvulso.push({id:nid(),tipo:b.querySelector('#fa-tipo').value,desc,valor,data:b.querySelector('#fa-data').value||hoje()});
          Toast.show('Lançamento registrado');render();
        },'Lançar');
    };
  }

  return {render};
})();
