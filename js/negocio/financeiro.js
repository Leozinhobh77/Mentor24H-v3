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
    return `<div class="toolbar fin-seg-wrap" style="margin-bottom:var(--s-3)"><div class="seg enc-seg fin-seg4">
      ${btn('caixa','💵 Caixa')}${btn('despesas','📑 Despesas')}${btn('mei','🏛️ MEI')}${btn('metas','🎯 Metas')}
    </div></div>`;
  }

  function render(){
    const root=document.getElementById('financeiro-root');if(!root)return;
    root.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--s-4)">
        <div>
          <h2 style="font-size:20px;font-weight:700;color:var(--text-1);margin:0">Financeiro</h2>
          <p style="font-size:13px;color:var(--text-3);margin:4px 0 0">Caixa, despesas, MEI e metas do negócio</p>
        </div>
      </div>
      ${segBar()}
      <div id="fin-body"></div>`;
    root.querySelectorAll('[data-faba]').forEach(b=>b.onclick=()=>{aba=b.dataset.faba;render();});
    const body=root.querySelector('#fin-body');
    if(aba==='caixa')renderCaixa(body);
    else if(aba==='despesas')renderDespesas(body);
    else if(aba==='mei')renderMei(body);
    else renderMetas(body);
  }

  /* ════════ 🏛️ MEI ════════ */
  // ATENÇÃO: MEI conta por COMPETÊNCIA (data da venda, total cheio) — diferente da aba Caixa (regime de caixa)
  function fatAno(){
    const ano=offset(0).slice(0,4);
    return DB.vendas.filter(v=>v.data.startsWith(ano)).reduce((s,v)=>s+(+v.total),0);
  }
  function fatMes(ym){return DB.vendas.filter(v=>v.data.startsWith(ym)).reduce((s,v)=>s+(+v.total),0);}

  function renderMei(root){
    const cfg=DB.negocioFin;
    const ano=offset(0).slice(0,4);
    const mesAtualN=+offset(0).slice(5,7);
    const fat=fatAno();
    const pct=Math.min(Math.round(fat/cfg.meiLimite*100),200);
    const barCor=pct<70?'var(--income)':pct<100?'var(--warning)':'var(--expense)';
    const disp=Math.max(0,cfg.meiLimite-fat);
    // projeção: média mensal × 12
    const fatMeses=[];for(let m=1;m<=mesAtualN;m++)fatMeses.push(fatMes(`${ano}-${String(m).padStart(2,'0')}`));
    const mediaM=fatMeses.reduce((s,v)=>s+v,0)/Math.max(1,mesAtualN);
    const projecao=Math.round(mediaM*12);
    const projEstoura=projecao>cfg.meiLimite;
    // DAS — 12 meses do ano
    const dasRows=[];
    for(let m=1;m<=12;m++){
      const ym=`${ano}-${String(m).padStart(2,'0')}`;
      const rec=DB.dasPagos.find(x=>x.ym===ym)||{ym,pago:false,pagoEm:null};
      const venc=`${ym}-${String(cfg.dasDia).padStart(2,'0')}`;
      const dv=Math.round((new Date(venc+'T00:00:00')-new Date(hoje()+'T00:00:00'))/86400000);
      const eMes=m===mesAtualN;
      let status='';
      if(rec.pago)status=`<span class="fin-das-st pago">${svg('tick',11)} Pago ${dmy(rec.pagoEm)}</span>`;
      else if(eMes&&dv<0)status=`<span class="fin-das-st atrasado">Atrasado</span>`;
      else if(eMes)status=`<span class="fin-das-st avencer">${dv===0?'Vence hoje':`Vence em ${dv}d`}</span>`;
      else if(m<mesAtualN)status=`<span class="fin-das-st atrasado">Em aberto</span>`;
      else status=`<span class="fin-das-st futuro">${dmy(venc)}</span>`;
      dasRows.push(`<div class="fin-das-item${eMes?' atual':''}">
        <span class="fin-das-mes">${MESES[m-1].slice(0,3)}</span>
        <span class="fin-das-val">${fmt(cfg.dasValor)}</span>
        ${status}
        ${!rec.pago&&m<=mesAtualN?`<button class="btn btn-primary btn-sm" data-pagadas="${ym}">${svg('tick',12)} Paguei</button>`:''}
      </div>`);
    }
    // DASN: aviso até maio+1 (vence 31/05)
    const dasnVenc=`${ano}-05-31`;const dasnDv=Math.round((new Date(dasnVenc+'T00:00:00')-new Date(hoje()+'T00:00:00'))/86400000);

    root.innerHTML=`
      <div class="page-kpis" style="margin-bottom:var(--s-4)">
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--brand-soft);color:var(--brand-text)">${svg('activity',14)}</span>Faturado no ano</div><div class="kv" style="color:${barCor}">${fmt(fat)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--income-soft);color:var(--income)">${svg('wallet',14)}</span>Disponível MEI</div><div class="kv">${fmt(disp)}</div></div>
        <div class="kpi"><div class="kl"><span class="ki" style="background:var(--info-soft);color:var(--info)">${svg('chart',14)}</span>% do limite</div><div class="kv" style="color:${barCor}">${pct}%</div></div>
      </div>
      <div class="card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('trendup',16)}</div>
          <h3>Limite MEI ${ano}</h3>
          <button class="btn-icon" data-meicfg style="margin-left:auto" title="Configurar MEI">${svg('pencil',16)}</button>
        </div>
        <div class="fin-mei-label"><span>${fmt(fat)}</span><span style="color:var(--text-3)"> de ${fmt(cfg.meiLimite)}</span></div>
        <div class="fin-mei-bar"><div class="fin-mei-prog" style="width:${Math.min(pct,100)}%;background:${barCor}"></div></div>
        ${pct>=90?`<div class="fin-alert" style="margin-top:var(--s-3)">⚠️ ${pct>=100?'Limite ultrapassado! Desenquadramento retroativo se >R$ 97.200.':'Faturamento em '+pct+'% do limite — atenção ao próximo mês.'}</div>`:''}
        <div class="fin-mei-proj" style="margin-top:var(--s-3)">📊 Nesse ritmo você fecha o ano em <b style="color:${projEstoura?'var(--expense)':'var(--income)'}">${fmt(projecao)}</b>${projEstoura?` <span class="chip-mini" style="background:var(--expense-soft);color:var(--expense)">⚠️ estoura o limite</span>`:''}</div>
        <p style="font-size:11px;color:var(--text-3);margin-top:var(--s-2)">Faturamento por COMPETÊNCIA — data da venda, total cheio (à vista e a prazo).</p>
      </div>
      <div class="card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--expense-soft);color:var(--expense)">${svg('calendar',16)}</div><h3>DAS Mensal · ${fmt(cfg.dasValor)}/mês</h3></div>
        <div class="fin-das-grid">${dasRows.join('')}</div>
      </div>
      ${dasnDv>=0?`<div class="card fin-dasn-card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('file',16)}</div><h3>DASN-SIMEI</h3></div>
        <p style="color:var(--text-2);font-size:13px">Declaração anual obrigatória — prazo: <b>31/05/${ano}</b>${dasnDv>0?` (${dasnDv}d)`:' <span style="color:var(--expense)">hoje!</span>'}.</p>
      </div>`:''}`;

    root.querySelectorAll('[data-pagadas]').forEach(b=>b.onclick=()=>{
      const ym=b.dataset.pagadas,rec=DB.dasPagos.find(x=>x.ym===ym);
      if(rec){rec.pago=true;rec.pagoEm=hoje();}else DB.dasPagos.push({ym,pago:true,pagoEm:hoje()});
      Toast.show('DAS marcado como pago');render();
    });
    root.querySelector('[data-meicfg]').onclick=()=>formMeiCfg();
  }

  function formMeiCfg(){
    const cfg=DB.negocioFin;
    Modal.open('Configurar MEI',`
      <div class="frow">
        <div class="fg"><label>Limite MEI (R$)</label><input class="field" id="mc-lim" type="number" min="1" step="100" value="${cfg.meiLimite}"></div>
        <div class="fg"><label>Valor DAS (R$)</label><input class="field" id="mc-das" type="number" min="0" step="0.01" value="${cfg.dasValor}"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Vencimento DAS (dia)</label><input class="field" id="mc-dia" type="number" min="1" max="28" value="${cfg.dasDia}"></div>
        <div class="fg"><label>Pró-labore (R$)</label><input class="field" id="mc-pl" type="number" min="0" step="100" value="${cfg.proLaboreValor}"></div>
      </div>
      <div class="fg"><label>Dia do pró-labore</label><input class="field" id="mc-pldia" type="number" min="1" max="28" value="${cfg.proLaboreDia}"></div>`,
      b=>{
        cfg.meiLimite=+b.querySelector('#mc-lim').value||cfg.meiLimite;
        cfg.dasValor=+(+b.querySelector('#mc-das').value||cfg.dasValor).toFixed(2);
        cfg.dasDia=+b.querySelector('#mc-dia').value||cfg.dasDia;
        cfg.proLaboreValor=+b.querySelector('#mc-pl').value||cfg.proLaboreValor;
        cfg.proLaboreDia=+b.querySelector('#mc-pldia').value||cfg.proLaboreDia;
        Toast.show('Configuração salva');render();
      },'Salvar');
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

  /* ════════ 🎯 METAS + PRÓ-LABORE + RESERVA ════════ */
  function lucroMes(ym){
    const vendas=DB.vendas.filter(v=>v.data.startsWith(ym));
    const receita=vendas.reduce((s,v)=>s+(+v.total),0);
    let custo=0;
    vendas.forEach(v=>v.itens.forEach(i=>{const p=DB.produtos&&DB.produtos.find(x=>x.id===i.produtoId);if(p)custo+=p.custo*(i.qtd||1);}));
    const despPagas=DB.despesasNeg.filter(d=>d.pago&&ymOf(d.pagoEm)===ym).reduce((s,d)=>s+d.valor,0);
    return receita-custo-despPagas;
  }

  function renderMetas(root){
    const cfg=DB.negocioFin;
    const mesAtual=offset(0).slice(0,7);
    // ── Metas ──
    function progMeta(m){
      if(m.tipo==='faturamento')return fatMes(m.mesRef);
      return Math.max(0,lucroMes(m.mesRef));
    }
    const metasHTML=DB.metasNeg.length===0
      ?`<div class="empty"><div style="font-size:32px;margin-bottom:8px">🎯</div><h4>Nenhuma meta cadastrada</h4><p style="color:var(--text-3)">Defina alvos de faturamento ou lucro pra acompanhar o desempenho.</p></div>`
      :DB.metasNeg.map(m=>{
        const prog=progMeta(m);
        const pct=Math.min(Math.round(prog/m.alvo*100),200);
        const cor=pct>=100?'var(--income)':pct>=70?'var(--warning)':'var(--brand-text)';
        const batida=pct>=100;
        return `<div class="fin-meta-card">
          <div class="fin-meta-top">
            <div>
              <div class="fin-meta-tipo">${m.tipo==='faturamento'?'📈 Faturamento':'💰 Lucro'} · ${mesLabel(m.mesRef)}</div>
              <div class="fin-meta-val"><b style="color:${cor}">${fmt(prog)}</b> <span style="color:var(--text-3)">de ${fmt(m.alvo)}</span> ${batida?'<span class="chip-mini" style="background:var(--income-soft);color:var(--income)">🎉 Batida!</span>':''}</div>
            </div>
            <div class="fin-acts">
              <button class="btn-icon" title="Editar" data-editm="${m.id}">${svg('pencil',14)}</button>
              <button class="btn-icon" title="Excluir" data-delm="${m.id}" style="color:var(--expense)">${svg('trash',14)}</button>
            </div>
          </div>
          <div class="fin-meta-bar"><div style="width:${Math.min(pct,100)}%;background:${cor}"></div></div>
          <div class="fin-meta-pct" style="color:${cor}">${pct}%</div>
        </div>`;
      }).join('');

    // ── Pró-labore ──
    const plMes=DB.proLaboreReg.find(r=>r.ym===mesAtual);
    const plOk=!!plMes;
    const passoLaboreDia=+offset(0).slice(8,10)>=cfg.proLaboreDia;

    // ── Reserva ──
    const saldo=DB.reservaNeg.saldo;
    const ultMovs=DB.reservaNeg.movimentos.slice(-3).reverse();

    root.innerHTML=`
      <div class="card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--brand-soft);color:var(--brand-text)">${svg('target',16)}</div><h3>Metas do negócio</h3>
          <button class="btn btn-primary btn-sm" style="margin-left:auto" data-novam>${svg('plus',14)} Nova meta</button>
        </div>
        ${metasHTML}
      </div>
      <div class="card fin-prolab-card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--income-soft);color:var(--income)">${svg('wallet',16)}</div><h3>Pró-labore</h3></div>
        <p style="font-size:12px;color:var(--text-3);margin:0 0 var(--s-3)">Pró-labore separa o dinheiro da empresa do seu — saúde financeira pra PF e PJ.</p>
        <div style="display:flex;align-items:center;gap:var(--s-3);flex-wrap:wrap">
          <div>
            <div class="fin-meta-tipo">Valor mensal</div>
            <div class="fin-meta-val"><b>${fmt(cfg.proLaboreValor)}</b></div>
          </div>
          <div>
            <div class="fin-meta-tipo">Status ${mesLabel(mesAtual)}</div>
            ${plOk
              ?`<span class="fin-st pago">${svg('tick',12)} Retirado ${dmy(plMes.data)}</span>`
              :`<span class="fin-st ${passoLaboreDia?'apagar':'futuro'}">${passoLaboreDia?'Em aberto':'Aguarda dia '+cfg.proLaboreDia}</span>`}
          </div>
          ${!plOk?`<button class="btn btn-primary" data-retirpl style="margin-left:auto">💸 Retirar pró-labore</button>`:''}
        </div>
      </div>
      <div class="card fin-reserva-card" style="margin-bottom:var(--s-4)">
        <div class="card-head"><div class="ico" style="background:var(--info-soft);color:var(--info)">${svg('archive',16)}</div><h3>Reserva do negócio</h3></div>
        <div class="fin-reserva-saldo">Saldo: <b>${fmt(saldo)}</b></div>
        <div style="display:flex;gap:var(--s-2);margin:var(--s-3) 0">
          <button class="btn btn-primary btn-sm" data-guardar>💰 Guardar</button>
          <button class="btn btn-sm" data-resgatar style="background:var(--surface-2);color:var(--text-2)">↩ Resgatar</button>
        </div>
        ${ultMovs.length?`<div class="fin-lista" style="gap:var(--s-1)">${ultMovs.map(m=>`<div class="fin-card" style="padding:var(--s-2) var(--s-3)">
          <div class="fin-card-l"><div class="fin-desc">${m.tipo==='guardar'?'💰 Guardou':'↩ Resgatou'}</div><div class="fin-meta">${dmy(m.data)}</div></div>
          <div class="fin-card-r"><div class="fin-val" style="color:${m.tipo==='guardar'?'var(--income)':'var(--expense)'}">${m.tipo==='guardar'?'+':'−'} ${fmt(m.valor)}</div></div>
        </div>`).join('')}</div>`:''}
      </div>`;

    root.querySelector('[data-novam]').onclick=()=>formMeta();
    root.querySelectorAll('[data-editm]').forEach(b=>b.onclick=()=>formMeta(+b.dataset.editm));
    root.querySelectorAll('[data-delm]').forEach(b=>b.onclick=()=>{
      Modal.confirm('Excluir meta?','Essa ação não pode ser desfeita.',()=>{DB.metasNeg=DB.metasNeg.filter(x=>x.id!==+b.dataset.delm);render();});
    });
    if(root.querySelector('[data-retirpl]'))root.querySelector('[data-retirpl]').onclick=()=>retirarProLabore();
    if(root.querySelector('[data-guardar]'))root.querySelector('[data-guardar]').onclick=()=>movReserva('guardar');
    if(root.querySelector('[data-resgatar]'))root.querySelector('[data-resgatar]').onclick=()=>movReserva('resgatar');
  }

  function formMeta(id){
    const m=id?DB.metasNeg.find(x=>x.id===id):null;
    const mesAtual=offset(0).slice(0,7);
    Modal.open(m?'Editar meta':'Nova meta',`
      <div class="fg"><label>Tipo</label><select class="field" id="fm-tipo">
        <option value="faturamento"${!m||m.tipo==='faturamento'?' selected':''}>📈 Faturamento</option>
        <option value="lucro"${m&&m.tipo==='lucro'?' selected':''}>💰 Lucro</option>
      </select></div>
      <div class="fg"><label>Alvo (R$)</label><input class="field" id="fm-alvo" type="number" min="1" step="100" value="${m?m.alvo:''}"></div>
      <div class="fg"><label>Mês de referência</label><input class="field" id="fm-mes" type="month" value="${m?m.mesRef:mesAtual}"></div>`,
      b=>{
        const alvo=+b.querySelector('#fm-alvo').value||0;
        const mesRef=b.querySelector('#fm-mes').value||mesAtual;
        if(!alvo){Toast.show('Informe o alvo','err');return false;}
        if(m){m.tipo=b.querySelector('#fm-tipo').value;m.alvo=alvo;m.mesRef=mesRef;}
        else DB.metasNeg.push({id:nid(),tipo:b.querySelector('#fm-tipo').value,alvo,mesRef,criadaEm:hoje()});
        Toast.show(m?'Meta atualizada':'Meta criada');render();
      },m?'Salvar':'Criar');
  }

  function retirarProLabore(){
    const cfg=DB.negocioFin,mesAtual=offset(0).slice(0,7);
    if(DB.proLaboreReg.some(r=>r.ym===mesAtual)){Toast.show('Pró-labore deste mês já retirado','err');return;}
    const h=hoje();
    // 1. Registra retirada
    DB.proLaboreReg.push({id:nid(),valor:cfg.proLaboreValor,ym:mesAtual,data:h});
    // 2. Saída no Caixa do negócio
    DB.caixaAvulso.push({id:nid(),tipo:'saida',desc:'Pró-labore — retirada do dono',valor:cfg.proLaboreValor,data:h});
    // 3. ⭐ PONTE PF/PJ: entrada nas Finanças pessoais (DB.transacoes)
    DB.transacoes.push({id:nid(),tipo:'entrada',descricao:'Pró-labore',valor:cfg.proLaboreValor,cat:'receita',metodo:'Transferência',data:h});
    Toast.show(`💸 Pró-labore retirado! R$ ${fmt(cfg.proLaboreValor)} entrou na sua vida pessoal.`);
    render();
  }

  function movReserva(tipo){
    Modal.open(tipo==='guardar'?'Guardar na reserva':'Resgatar da reserva',`
      <div class="fg"><label>Valor (R$)</label><input class="field" id="mr-val" type="number" min="0.01" step="10"></div>`,
      b=>{
        const valor=+b.querySelector('#mr-val').value||0;
        if(!valor){Toast.show('Informe o valor','err');return false;}
        if(tipo==='resgatar'&&valor>DB.reservaNeg.saldo){Toast.show('Valor maior que o saldo','err');return false;}
        DB.reservaNeg.movimentos.push({id:nid(),tipo,valor,data:hoje()});
        DB.reservaNeg.saldo+=tipo==='guardar'?valor:-valor;
        DB.caixaAvulso.push({id:nid(),tipo:tipo==='guardar'?'saida':'entrada',desc:`Reserva — ${tipo}`,valor,data:hoje()});
        Toast.show(tipo==='guardar'?'Valor guardado na reserva':'Valor resgatado da reserva');
        render();
      },tipo==='guardar'?'Guardar':'Resgatar');
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

  function renderAba(tab){aba=tab;render();}
  return {render,renderAba};
})();
