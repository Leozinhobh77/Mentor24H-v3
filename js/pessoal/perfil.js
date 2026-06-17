/* ═══════════════════════════════════════════════
   ETAPA 41 — PERFIL
   5 blocos: Identidade · Negócio/MEI · Resumo · Preferências · Dados & Backup
═══════════════════════════════════════════════ */
const Perfil=(()=>{
  const ico=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||''}</svg>`;
  const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function _stats(){
    const ano=new Date().getFullYear().toString();
    const contatos=(DB.contatos||[]).length;
    const metasAtivas=(DB.metas||[]).filter(m=>m.status==='ativa').length;
    const habitosAtivos=(DB.habitos||[]).length;
    const aReceber=(DB.contas||[]).filter(c=>c.tipo==='receber'&&c.status==='pendente').reduce((s,c)=>s+c.valor,0);
    const aPagar=(DB.contas||[]).filter(c=>c.tipo==='pagar'&&c.status==='pendente').reduce((s,c)=>s+c.valor,0);
    return {contatos,metasAtivas,habitosAtivos,aReceber,aPagar};
  }

  function _mei(){
    const ano=new Date().getFullYear().toString();
    const limite=DB.negocioFin.meiLimite||81000;
    const fat=(DB.transacoes||[]).filter(t=>t.tipo==='entrada'&&(t.data||'').startsWith(ano)).reduce((s,t)=>s+t.valor,0)
             +(DB.caixaAvulso||[]).filter(t=>t.tipo==='entrada'&&(t.data||'').startsWith(ano)).reduce((s,t)=>s+t.valor,0);
    const pct=Math.min(100,Math.round(fat/limite*100));
    return {fat,limite,pct};
  }

  function _exportarJSON(){
    const data=JSON.stringify(DB,null,2);
    const blob=new Blob([data],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='mentor24h-backup.json'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function _parseCSVLine(line){
    const result=[]; let cur=''; let inQ=false;
    for(let i=0;i<line.length;i++){
      const c=line[i];
      if(c==='"'){ if(inQ&&line[i+1]==='"'){cur+='"';i++;} else inQ=!inQ; }
      else if(c===','&&!inQ){ result.push(cur); cur=''; }
      else cur+=c;
    }
    result.push(cur); return result;
  }

  function _exportarCSV(){
    const hdrs=['Nome','Telefone','Email','Contexto','Tags','Aniversário','Favorito','Como Conheci','Anotações'];
    const rows=(DB.contatos||[]).map(c=>[
      c.nome||'', c.telefone||'', c.email||'', c.contexto||'',
      (c.tags||[]).join(';'), c.aniversario||'',
      c.favorito?'Sim':'Não', c.comoConheci||'', c.anotacoes||''
    ]);
    const csv=[hdrs,...rows].map(r=>r.map(f=>`"${String(f).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob=new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`mentor24h-contatos-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function _importarJSON(){
    const input=document.createElement('input');
    input.type='file'; input.accept='.json';
    input.onchange=()=>{
      const file=input.files[0]; if(!file)return;
      const reader=new FileReader();
      reader.onload=e=>{
        try{
          const data=JSON.parse(e.target.result);
          Object.keys(data).forEach(k=>{if(k in DB) DB[k]=data[k];});
          Perfil.render();
          alert('Dados importados com sucesso!');
        }catch(err){alert('Arquivo inválido: '+err.message);}
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function _importarCSV(){
    const inp=document.createElement('input');
    inp.type='file'; inp.accept='.csv';
    inp.onchange=e=>{
      const f=e.target.files[0]; if(!f) return;
      const r=new FileReader();
      r.onload=ev=>{
        try{
          const linhas=ev.target.result.replace(/^﻿/,'').split(/\r?\n/).filter(l=>l.trim());
          if(linhas.length<2){ alert('Arquivo vazio ou sem contatos.'); return; }
          const novos=[];
          for(let i=1;i<linhas.length;i++){
            const c=_parseCSVLine(linhas[i]);
            if(!c[0]) continue;
            novos.push({
              id:nid(), nome:c[0]||'', telefone:c[1]||'', email:c[2]||'',
              contexto:c[3]||'pessoal', tags:c[4]?c[4].split(';').filter(Boolean):[],
              aniversario:c[5]||'', favorito:c[6]==='Sim',
              comoConheci:c[7]||'', anotacoes:c[8]||'',
              ultimoContato:'', manterContato:null, proximaAcao:null, interacoes:[], datas:[]
            });
          }
          DB.contatos.push(...novos);
          alert(`${novos.length} contato(s) importado(s) com sucesso!`);
          Perfil.render();
        }catch(err){ alert('Erro ao ler o arquivo CSV. Verifique o formato.'); }
      };
      r.readAsText(f,'UTF-8');
    };
    document.body.appendChild(inp);
    inp.click();
    document.body.removeChild(inp);
  }

  const MODULOS={
    contatos:{label:'Contatos',chave:'contatos'},
    financas:{label:'Finanças',chaves:['contas','transacoes']},
    habitos:{label:'Hábitos',chave:'habitos'},
    metas:{label:'Metas',chave:'metas'},
  };

  function _limpar(mod){
    const m=MODULOS[mod]; if(!m)return;
    if(!confirm(`Limpar ${m.label}? Esta ação não pode ser desfeita.`))return;
    if(m.chaves) m.chaves.forEach(k=>{ DB[k]=[]; });
    else DB[m.chave]=[];
    Perfil.render();
  }

  function _setTema(next){
    document.documentElement.setAttribute('data-theme',next);
    const btn=document.getElementById('theme-btn');
    if(btn) btn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${next==='dark'?ICONS.moon:ICONS.sun}</svg>`;
    document.querySelectorAll('.prf-theme-btn').forEach(b=>{
      b.classList.toggle('on',b.dataset.theme===next);
    });
  }

  function _setModo(mode){
    document.documentElement.setAttribute('data-mode',mode);
    document.querySelectorAll('.mode-switch button').forEach(x=>x.classList.toggle('on',x.dataset.mode===mode));
    document.querySelectorAll('.mode-pane').forEach(p=>p.classList.toggle('show',p.dataset.pane===mode));
    document.querySelectorAll('[data-ctx]').forEach(g=>g.style.display=(mode==='hibrido'||g.dataset.ctx===mode)?'':'none');
    renderPerfil(mode);
    document.querySelectorAll('.prf-mode-btn').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode));
  }

  function _bind(){
    const r=document.getElementById('perfil-root'); if(!r)return;

    // Identidade — salvar
    r.querySelector('#prf-save-usuario')?.addEventListener('click',()=>{
      DB.usuario.nome=r.querySelector('#prf-nome')?.value||DB.usuario.nome;
      DB.usuario.email=r.querySelector('#prf-email')?.value||'';
      DB.usuario.telefone=r.querySelector('#prf-tel')?.value||'';
      renderPerfil(document.documentElement.getAttribute('data-mode')||'pessoal');
      Perfil.render();
    });

    // Negócio — salvar
    r.querySelector('#prf-save-negocio')?.addEventListener('click',()=>{
      DB.negocio.nome=r.querySelector('#prf-neg-nome')?.value||DB.negocio.nome;
      DB.negocio.cnpj=r.querySelector('#prf-cnpj')?.value||'';
      DB.negocio.razaoSocial=r.querySelector('#prf-razao')?.value||'';
      DB.negocio.cnae=r.querySelector('#prf-cnae')?.value||'';
      renderPerfil(document.documentElement.getAttribute('data-mode')||'pessoal');
      Perfil.render();
    });

    // Tema — botão define o tema diretamente (não toggle)
    r.querySelectorAll('.prf-theme-btn').forEach(b=>{
      b.addEventListener('click',()=>_setTema(b.dataset.theme));
    });

    // Modo padrão
    r.querySelectorAll('.prf-mode-btn').forEach(b=>{
      b.addEventListener('click',()=>_setModo(b.dataset.mode));
    });

    // Export / Import / Limpar
    r.querySelector('#prf-export-json')?.addEventListener('click',_exportarJSON);
    r.querySelector('#prf-export-csv')?.addEventListener('click',_exportarCSV);
    r.querySelector('#prf-import-json')?.addEventListener('click',_importarJSON);
    r.querySelector('#prf-import-csv')?.addEventListener('click',_importarCSV);
    r.querySelectorAll('[data-limpar]').forEach(b=>{
      b.addEventListener('click',()=>_limpar(b.dataset.limpar));
    });
  }

  function render(){
    const root=document.getElementById('perfil-root'); if(!root)return;
    const u=DB.usuario, n=DB.negocio;
    const st=_stats(), mei=_mei();
    const modeAtual=document.documentElement.getAttribute('data-mode')||'pessoal';
    const temaAtual=document.documentElement.getAttribute('data-theme')||'light';

    root.innerHTML=`<div class="prf-wrap">

      <!-- A — IDENTIDADE PESSOAL -->
      <div class="prf-section">
        <div class="prf-section-hdr">
          <div class="prf-avatar">${esc(u.logo)}</div>
          <div>
            <div class="prf-section-title">Identidade Pessoal</div>
            <div class="prf-section-sub">Plano ${esc(u.plano)}</div>
          </div>
        </div>
        <div class="prf-fields">
          <label class="prf-label">Nome</label>
          <input id="prf-nome" class="prf-input" value="${esc(u.nome)}" placeholder="Seu nome">
          <label class="prf-label">E-mail</label>
          <input id="prf-email" class="prf-input" type="email" value="${esc(u.email||'')}" placeholder="seu@email.com">
          <label class="prf-label">Telefone</label>
          <input id="prf-tel" class="prf-input" type="tel" value="${esc(u.telefone||'')}" placeholder="(00) 00000-0000">
        </div>
        <button id="prf-save-usuario" class="prf-action-btn prf-save-btn">${ico('check')} Salvar</button>
      </div>

      <!-- B — NEGÓCIO / MEI -->
      <div class="prf-section">
        <div class="prf-section-hdr">
          <div class="prf-avatar prf-avatar--neg">${esc(n.logo)}</div>
          <div>
            <div class="prf-section-title">Negócio / MEI</div>
            <div class="prf-section-sub">${esc(n.segmento)}</div>
          </div>
        </div>
        <div class="prf-fields">
          <label class="prf-label">Nome do negócio</label>
          <input id="prf-neg-nome" class="prf-input" value="${esc(n.nome)}" placeholder="Nome do negócio">
          <label class="prf-label">CNPJ / CPF</label>
          <input id="prf-cnpj" class="prf-input" value="${esc(n.cnpj||'')}" placeholder="00.000.000/0001-00">
          <label class="prf-label">Razão Social</label>
          <input id="prf-razao" class="prf-input" value="${esc(n.razaoSocial||'')}" placeholder="Razão Social">
          <label class="prf-label">CNAE</label>
          <input id="prf-cnae" class="prf-input" value="${esc(n.cnae||'')}" placeholder="0000-0/00">
        </div>
        <div class="prf-mei-bar-wrap">
          <div class="prf-mei-bar-labels">
            <span>Faturamento ${new Date().getFullYear()}</span>
            <span>${fmt(mei.fat)} / ${fmt(mei.limite)} · <b>${mei.pct}%</b></span>
          </div>
          <div class="prf-bar-bg">
            <div class="prf-bar-fill" style="width:${mei.pct}%"></div>
          </div>
        </div>
        <button id="prf-save-negocio" class="prf-action-btn prf-save-btn">${ico('check')} Salvar</button>
      </div>

      <!-- C — RESUMO DE USO -->
      <div class="prf-section">
        <div class="prf-section-title">Resumo de Uso</div>
        <div class="prf-stat-grid">
          <div class="prf-stat">
            <div class="prf-stat-label">Contatos</div>
            <div class="prf-stat-val">${st.contatos}</div>
          </div>
          <div class="prf-stat">
            <div class="prf-stat-label">Metas ativas</div>
            <div class="prf-stat-val">${st.metasAtivas}</div>
          </div>
          <div class="prf-stat">
            <div class="prf-stat-label">Hábitos</div>
            <div class="prf-stat-val">${st.habitosAtivos}</div>
          </div>
          <div class="prf-stat prf-stat--money">
            <div class="prf-stat-label">A receber</div>
            <div class="prf-stat-val prf-val-in">${fmt(st.aReceber)}</div>
          </div>
          <div class="prf-stat prf-stat--money">
            <div class="prf-stat-label">A pagar</div>
            <div class="prf-stat-val prf-val-out">${fmt(st.aPagar)}</div>
          </div>
        </div>
      </div>

      <!-- D — PREFERÊNCIAS -->
      <div class="prf-section">
        <div class="prf-section-title">Preferências</div>
        <div class="prf-pref-row">
          <span class="prf-pref-label">Tema</span>
          <div class="prf-btn-group">
            <button class="prf-theme-btn${temaAtual==='light'?' on':''}" data-theme="light">${ico('sun')} Claro</button>
            <button class="prf-theme-btn${temaAtual==='dark'?' on':''}" data-theme="dark">${ico('moon')} Escuro</button>
          </div>
        </div>
        <div class="prf-pref-row">
          <span class="prf-pref-label">Modo padrão</span>
          <div class="prf-btn-group">
            <button class="prf-mode-btn${modeAtual==='pessoal'?' on':''}" data-mode="pessoal">${ico('user')} Pessoal</button>
            <button class="prf-mode-btn${modeAtual==='hibrido'?' on':''}" data-mode="hibrido">${ico('layers')} Híbrido</button>
            <button class="prf-mode-btn${modeAtual==='negocio'?' on':''}" data-mode="negocio">${ico('briefcase')} Negócio</button>
          </div>
        </div>
      </div>

      <!-- E — DADOS & BACKUP -->
      <div class="prf-section">
        <div class="prf-section-title">Dados &amp; Backup</div>
        <div class="prf-action-row">
          <button id="prf-export-json" class="prf-action-btn">${ico('file')} Exportar JSON</button>
          <button id="prf-export-csv" class="prf-action-btn">${ico('chart')} Exportar CSV</button>
          <button id="prf-import-json" class="prf-action-btn">${ico('repeat')} Importar JSON</button>
          <button id="prf-import-csv" class="prf-action-btn">${ico('repeat')} Importar CSV</button>
        </div>
        <div class="prf-divider"></div>
        <div class="prf-section-sub prf-danger-label">Limpar módulo (irreversível)</div>
        <div class="prf-action-row">
          <button class="prf-action-btn prf-danger-btn" data-limpar="contatos">${ico('users')} Contatos</button>
          <button class="prf-action-btn prf-danger-btn" data-limpar="financas">${ico('wallet')} Finanças</button>
          <button class="prf-action-btn prf-danger-btn" data-limpar="habitos">${ico('flame')} Hábitos</button>
          <button class="prf-action-btn prf-danger-btn" data-limpar="metas">${ico('target')} Metas</button>
        </div>
      </div>

    </div>`;

    _bind();
  }

  return {render};
})();
