/* ─── ÍCONES (SVG inline, stroke consistente) ─── */
const ICONS={
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  wallet:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M16 12h.01"/><path d="M3 9h13a2 2 0 0 1 2 2"/>',
  repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  heart:'<path d="M19 14c1.5-1.6 3-3.5 3-6a4 4 0 0 0-7-2.6A4 4 0 0 0 8 8c0 2.5 1.5 4.4 3 6l5 5z"/>',
  check:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  flame:'<path d="M12 2c1 3-2 5-2 8a4 4 0 0 0 8 0c0-1-.5-2-1-3 2 1 4 3 4 7a8 8 0 0 1-16 0c0-4 4-6 5-9 1 0 2 0 2-0z"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M17 6a3 3 0 0 1 0 6M21 20c0-2.5-1.3-4.5-3-5.5"/>',
  cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 13h11l2-8H6"/>',
  box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  archive:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M9 13h6"/>',
  chart:'<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6" rx="1"/><rect x="13" y="7" width="3" height="10" rx="1"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  moon:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z"/>',
  sun:'<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  bell:'<path d="M18 9a6 6 0 0 0-12 0c0 6-2 7-2 7h16s-2-1-2-7z"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  trendup:'<path d="m3 16 5-5 4 4 8-8"/><path d="M16 7h5v5"/>',
  zap:'<path d="M13 2 4 13h6l-1 9 9-11h-6z"/>',
  wifi:'<path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/>',
  tick:'<path d="M20 6 9 17l-5-5"/>',
  drop:'<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',
  run:'<circle cx="15" cy="5" r="2"/><path d="M9 21l2-5-3-3 1-5 4 2 3 1M6 13l-1 4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14.5s1.5 2 4 2 4-2 4-2"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
  arrowup:'<path d="M12 19V5M5 12l7-7 7 7"/>',
  arrowdown:'<path d="M12 5v14M5 12l7 7 7-7"/>',
  alert:'<path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
  pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  tag:'<path d="M3 11.5V5a2 2 0 0 1 2-2h6.5a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8l-6.5 6.5a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 11.5z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  play:'<path d="M6 4l14 8-14 8z"/>',
  pause:'<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  chat:'<path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/>',
  menu:'<path d="M3 12h18M3 6h18M3 18h18"/>',
  book:'<path d="M12 7v14"/><path d="M3 5.5C3 4.7 3.7 4 4.5 4H10a2 2 0 0 1 2 2 2 2 0 0 1 2-2h5.5c.8 0 1.5.7 1.5 1.5v12c0 .8-.7 1.5-1.5 1.5H14a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4.5A1.5 1.5 0 0 1 3 17.5z"/>',
  activity:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  star:'<path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6.1 21.3l1.2-6.6L2.5 9.5l6.6-.9z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3 7.5 9 6 9-6"/>',
  cake:'<path d="M4 21h16v-8H4z"/><path d="M4 13a4 4 0 0 1 16 0"/><path d="M12 8.5V5"/><circle cx="12" cy="3.5" r="1.2"/>',
  chevleft:'<path d="M15 18l-6-6 6-6"/>',
  chevright:'<path d="M9 18l6-6-6-6"/>',
};

/* ─── PÁGINAS PLACEHOLDER (preenchidas a cada etapa do checklist) ─── */
const PAGES=[
  ['perfil','user','Perfil','Etapa 16','Conta, preferências e configurações do Mentor24h.'],
];
(function(){
  const content=document.querySelector('.content');
  PAGES.forEach(([id,ic,title,etapa,desc])=>{
    const s=document.createElement('section');
    s.className='page'; s.dataset.page=id;
    s.innerHTML=`<div class="placeholder"><div class="pico">{i:${ic}}</div><span class="tagx">${etapa} · em breve</span><h2>${title}</h2><p>${desc}</p></div>`;
    content.appendChild(s);
  });
})();

document.querySelectorAll('*').forEach(el=>{
  if(el.childNodes.length===1&&el.firstChild.nodeType===3){
    const t=el.textContent.match(/^\{i:(\w+)\}$/);
    if(t&&ICONS[t[1]]) el.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[t[1]]}</svg>`;
  }
});
// resolve {i:x} que ficaram no meio de texto (nav/botões)
document.body.innerHTML=document.body.innerHTML.replace(/\{i:(\w+)\}/g,(m,n)=>
  ICONS[n]?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`:m);

/* ─── SAUDAÇÃO DINÂMICA ─── */
(function(){
  const h=new Date().getHours();
  const txt=h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';
  const el=document.getElementById('greet-h'); if(el)el.textContent=`${txt}, Léo`;
  const dias=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const mes=['jan','fev','mar','abr','maio','jun','jul','ago','set','out','nov','dez'];
  const d=new Date();
  const p=document.getElementById('greet-p'); if(p)p.textContent=`${dias[d.getDay()]}, ${d.getDate()} de ${mes[d.getMonth()]}`;
})();

/* ─── TEMA (alterna em memória; persistência irá pro Supabase) ─── */
const themeBtn=document.getElementById('theme-btn');
themeBtn.addEventListener('click',()=>{
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  document.documentElement.setAttribute('data-theme',dark?'light':'dark');
  themeBtn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${dark?ICONS.sun:ICONS.moon}</svg>`;
});

/* ─── MODO PESSOAL / NEGÓCIO (desktop — mode-switch na topbar) ─── */
document.querySelectorAll('.mode-switch button').forEach(b=>{
  b.addEventListener('click',()=>{
    const mode=b.dataset.mode;
    document.documentElement.setAttribute('data-mode',mode);
    document.querySelectorAll('.mode-switch button').forEach(x=>x.classList.toggle('on',x===b));
    document.querySelectorAll('.mode-pane').forEach(p=>p.classList.toggle('show',p.dataset.pane===mode));
    document.querySelectorAll('[data-ctx]').forEach(g=>g.style.display=(mode==='hibrido'||g.dataset.ctx===mode)?'':'none');
    pintaBriefingDash();
  });
});

/* ─── BOTTOM NAV PREMIUM (mobile) ─── */
(function(){
  const pill=document.querySelector('.bn-pill');
  const bnItems=document.querySelectorAll('.bn-item[data-bn]');

  function switchMode(mode){
    document.documentElement.setAttribute('data-mode',mode);
    document.querySelectorAll('.mode-switch button').forEach(x=>x.classList.toggle('on',x.dataset.mode===mode));
    document.querySelectorAll('.mode-pane').forEach(p=>p.classList.toggle('show',p.dataset.pane===mode));
    document.querySelectorAll('[data-ctx]').forEach(g=>g.style.display=(mode==='hibrido'||g.dataset.ctx===mode)?'':'none');
    if(typeof pintaBriefingDash==='function')pintaBriefingDash();
  }

  function setBnActive(index){
    bnItems.forEach((item,i)=>item.classList.toggle('active',i===index));
    if(pill) pill.style.transform=`translateX(${index*100}%)`;
  }

  bnItems.forEach((item,index)=>{
    item.addEventListener('click',()=>{
      setBnActive(index);
      const bn=item.dataset.bn;
      if(bn==='pessoal'){navigate('dashboard');switchMode('pessoal');}
      else if(bn==='hibrido'){navigate('dashboard');switchMode('hibrido');}
      else if(bn==='negocio'){navigate('dashboard');switchMode('negocio');}
      else if(bn==='vendas') navigate('vendas');
      else if(bn==='perfil') navigate('perfil');
    });
  });

  // Pessoal (índice 1) ativo por padrão — reflete o modo inicial do app
  setBnActive(1);
})();

/* ─── TAREFAS / REMÉDIOS (toggle visual) ─── */
document.querySelectorAll('.task').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('done')));
document.querySelectorAll('.take').forEach(b=>b.addEventListener('click',()=>{
  b.classList.toggle('done');b.textContent=b.classList.contains('done')?'Tomado':'Marcar';
}));

/* ─── HUMOR (mood tracker) ─── */
document.querySelectorAll('.mood-pick').forEach(p=>p.querySelectorAll('.mood').forEach(m=>m.addEventListener('click',()=>{
  p.querySelectorAll('.mood').forEach(x=>x.classList.toggle('on',x===m));
})));

/* ─── ROUTER (navegação SPA) ─── */
const TITLES={financas:'Finanças',transacoes:'Transações',metas:'Metas',agenda:'Agenda',saude:'Saúde',tarefas:'Tarefas',habitos:'Hábitos',estudos:'Estudos',contatos:'Contatos',vendas:'Vendas',produtos:'Produtos',estoque:'Estoque',clientes:'Clientes',relatorios:'Relatórios (Negócio)',mentor:'Mentor',perfil:'Perfil'};
function navigate(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('show',p.dataset.page===page));
  document.querySelectorAll('[data-nav]').forEach(n=>n.classList.toggle('active',n.dataset.nav===page));
  const h=document.getElementById('greet-h'), sp=document.getElementById('greet-p');
  if(page==='dashboard'){
    const hr=new Date().getHours();
    h.textContent=`${hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite'}, Léo`;
    if(sp) sp.style.display='';
    pintaBriefingDash();
  } else {
    h.textContent=TITLES[page]||page;
    if(sp) sp.style.display='none';
  }
  if(page==='financas') Contas.render();
  if(page==='transacoes') Transacoes.render();
  if(page==='metas') Metas.render();
  if(page==='relatorios-fin') Relatorios.render();
  if(page==='categorias') Categorias.render();
  if(page==='tarefas') Tarefas.render();
  if(page==='agenda') Agenda.render();
  if(page==='saude') Saude.render();
  if(page==='habitos') Habitos.render();
  if(page==='metricas') Metricas.render();
  if(page==='contatos') Contatos.render();
  if(page==='estudos') Estudos.render();
  if(page==='produtos') Produtos.render();
  if(page==='estoque') Estoque.render();
  if(page==='vendas') Vendas.render();
  if(page==='clientes') Clientes.render();
  if(page==='relatorios') RelatoriosNeg.render();
  if(page==='mentor') Mentor.render();
  closeDrawer();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.nav)));

/* ─── DRAWER (menu lateral no mobile) ─── */
/* Trava o fundo via position:fixed (overflow:hidden no body não segura o scroll do <html>
   no mobile). Salva e restaura o scrollY ao abrir/fechar. */
let _drawerScrollY=0;
function openDrawer(){
  _drawerScrollY=window.scrollY;
  document.body.classList.add('drawer-open');
  document.body.style.top=`-${_drawerScrollY}px`;
}
function closeDrawer(){
  if(!document.body.classList.contains('drawer-open'))return;
  document.body.classList.remove('drawer-open');
  document.body.style.top='';
  window.scrollTo(0,_drawerScrollY);
}
(function(){
  const mb=document.getElementById('menu-btn'),bd=document.getElementById('side-backdrop');
  if(mb)mb.addEventListener('click',()=>document.body.classList.contains('drawer-open')?closeDrawer():openDrawer());
  if(bd)bd.addEventListener('click',closeDrawer);
})();

/* ═══════════════════════════════════════════════
   ETAPA 2 — DADOS (mock), HELPERS E MÓDULOS
   (vira Supabase numa etapa futura)
═══════════════════════════════════════════════ */
function svg(name,size){return ICONS[name]?`<svg viewBox="0 0 24 24" width="${size||18}" height="${size||18}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`:'';}
const fmt=v=>'R$ '+(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const HOJE=new Date();HOJE.setHours(0,0,0,0);
function offset(d){const x=new Date(HOJE);x.setDate(x.getDate()+d);return x.toISOString().slice(0,10);}
function addMonths(iso,n){const d=new Date(iso+'T00:00:00');d.setMonth(d.getMonth()+n);return d.toISOString().slice(0,10);}
function diasAte(iso){return Math.round((new Date(iso+'T00:00:00')-HOJE)/86400000);}
function venceTxt(iso){const n=diasAte(iso);return n<0?`Venceu há ${-n}d`:n===0?'Vence hoje':n===1?'Vence amanhã':`Vence em ${n}d`;}

const CATS=[
  {id:'moradia',nome:'Moradia',cor:'#2D7FF9',icone:'home'},
  {id:'alimentacao',nome:'Alimentação',cor:'#1F9D55',icone:'cart'},
  {id:'transporte',nome:'Transporte',cor:'#C8860B',icone:'zap'},
  {id:'saude',nome:'Saúde',cor:'#DB4A4A',icone:'heart'},
  {id:'servicos',nome:'Serviços',cor:'#27B6A3',icone:'wifi'},
  {id:'lazer',nome:'Lazer',cor:'#E0568C',icone:'flame'},
  {id:'receita',nome:'Receita',cor:'#1F9D55',icone:'trendup'},
  {id:'outros',nome:'Outros',cor:'#8A867C',icone:'box'},
];
let _seq=1; const nid=()=>_seq++;
const DB={
  contas:[
    {id:nid(),tipo:'pagar',descricao:'Aluguel',valor:1500,cat:'moradia',metodo:'Pix',venc:offset(4),status:'pendente'},
    {id:nid(),tipo:'pagar',descricao:'Energia · CEMIG',valor:187.4,cat:'moradia',metodo:'Pix',venc:offset(1),status:'pendente'},
    {id:nid(),tipo:'pagar',descricao:'Internet fibra',valor:99.9,cat:'servicos',metodo:'Débito',venc:offset(3),status:'pendente',recorrente:true},
    {id:nid(),tipo:'pagar',descricao:'Cartão Nubank',valor:1240,cat:'outros',metodo:'Crédito',venc:offset(6),status:'pendente'},
    {id:nid(),tipo:'pagar',descricao:'Supermercado',valor:432.7,cat:'alimentacao',metodo:'Crédito',venc:offset(-2),status:'pendente'},
    {id:nid(),tipo:'pagar',descricao:'Plano de saúde',valor:320,cat:'saude',metodo:'Débito',venc:offset(9),status:'pendente',recorrente:true},
    {id:nid(),tipo:'pagar',descricao:'Academia',valor:89,cat:'saude',metodo:'Pix',venc:offset(-5),status:'paga'},
    {id:nid(),tipo:'receber',descricao:'Salário',valor:3800,cat:'receita',metodo:'Transferência',venc:offset(0),status:'pendente'},
    {id:nid(),tipo:'receber',descricao:'Freela design',valor:1200,cat:'receita',metodo:'Pix',venc:offset(-1),status:'pendente'},
    {id:nid(),tipo:'pagar',descricao:'Curso de UX (1/3)',valor:200,cat:'lazer',metodo:'Crédito',venc:offset(7),status:'pendente',parcela:'1/3'},
    {id:nid(),tipo:'pagar',descricao:'Curso de UX (2/3)',valor:200,cat:'lazer',metodo:'Crédito',venc:addMonths(offset(7),1),status:'pendente',parcela:'2/3'},
    {id:nid(),tipo:'pagar',descricao:'Curso de UX (3/3)',valor:200,cat:'lazer',metodo:'Crédito',venc:addMonths(offset(7),2),status:'pendente',parcela:'3/3'},
  ],
  transacoes:[
    {id:nid(),tipo:'entrada',descricao:'Venda — brigadeiros',valor:120,cat:'receita',metodo:'Pix',data:offset(0)},
    {id:nid(),tipo:'saida',descricao:'Almoço',valor:38.5,cat:'alimentacao',metodo:'Débito',data:offset(0)},
    {id:nid(),tipo:'saida',descricao:'Uber',valor:23.9,cat:'transporte',metodo:'Crédito',data:offset(0)},
    {id:nid(),tipo:'entrada',descricao:'Freela design',valor:1200,cat:'receita',metodo:'Pix',data:offset(-1)},
    {id:nid(),tipo:'saida',descricao:'Supermercado',valor:215.4,cat:'alimentacao',metodo:'Crédito',data:offset(-1)},
    {id:nid(),tipo:'saida',descricao:'Farmácia',valor:67.3,cat:'saude',metodo:'Pix',data:offset(-2)},
    {id:nid(),tipo:'saida',descricao:'Gasolina',valor:150,cat:'transporte',metodo:'Débito',data:offset(-2)},
    {id:nid(),tipo:'entrada',descricao:'Salário',valor:3800,cat:'receita',metodo:'Transferência',data:offset(-3)},
    {id:nid(),tipo:'saida',descricao:'Aluguel',valor:1500,cat:'moradia',metodo:'Pix',data:offset(-3)},
    {id:nid(),tipo:'saida',descricao:'Cinema',valor:64,cat:'lazer',metodo:'Crédito',data:offset(-4)},
    {id:nid(),tipo:'saida',descricao:'Internet fibra',valor:99.9,cat:'servicos',metodo:'Débito',data:offset(-5)},
  ],
  metas:[
    {id:nid(),nome:'Reserva de emergência',alvo:10000,atual:7200,prazo:offset(120),cor:'#168A7C',icone:'target',status:'ativa',criadoEm:offset(-180)},
    {id:nid(),nome:'Viagem fim de ano',alvo:5000,atual:1700,prazo:offset(210),cor:'#2D7FF9',icone:'calendar',status:'ativa',criadoEm:offset(-60)},
    {id:nid(),nome:'Notebook novo',alvo:4500,atual:4500,prazo:null,cor:'#1F9D55',icone:'box',status:'concluida',criadoEm:offset(-90)},
    {id:nid(),nome:'Curso de inglês',alvo:2400,atual:480,prazo:offset(80),cor:'#C8860B',icone:'flame',status:'ativa',criadoEm:offset(-40)},
  ],
  tarefas:[
    {id:nid(),titulo:'Responder cliente no WhatsApp',descricao:'Orçamento do combo festa',coluna:'doing',prioridade:'alta',tags:['Negócio'],prazo:offset(0),subs:[]},
    {id:nid(),titulo:'Pagar fornecedor de embalagens',coluna:'todo',prioridade:'alta',tags:['Negócio','Financeiro'],prazo:offset(1),subs:[]},
    {id:nid(),titulo:'Repor estoque',descricao:'Itens acabando para o fim de semana',coluna:'todo',prioridade:'media',tags:['Estoque'],subs:[{t:'Listar o que falta',done:true},{t:'Pedir orçamento',done:false},{t:'Fazer pedido',done:false}]},
    {id:nid(),titulo:'Postar no Instagram',coluna:'todo',prioridade:'baixa',tags:['Marketing'],subs:[]},
    {id:nid(),titulo:'Conferir entregas do dia',coluna:'doing',prioridade:'media',tags:['Negócio'],subs:[{t:'Pedido Maria',done:true},{t:'Pedido João',done:false}]},
    {id:nid(),titulo:'Estudar inglês 30min',coluna:'todo',prioridade:'baixa',tags:['Pessoal'],prazo:offset(2),subs:[]},
    {id:nid(),titulo:'Atualizar tabela de preços',coluna:'done',prioridade:'media',tags:['Negócio'],subs:[]},
    {id:nid(),titulo:'Ir à academia',coluna:'done',prioridade:'baixa',tags:['Pessoal'],subs:[]},
  ],
  eventos:[
    {id:nid(),titulo:'Reunião com fornecedor',data:offset(0),hora:'15:00',tipo:'trabalho',lembrete:true},
    {id:nid(),titulo:'Entrega de encomenda',data:offset(0),hora:'18:30',tipo:'trabalho',lembrete:false},
    {id:nid(),titulo:'Consulta Dr. João',data:offset(1),hora:'10:00',tipo:'saude',lembrete:true},
    {id:nid(),titulo:'Aniversário da Maria',data:offset(2),hora:'',tipo:'aniversario',lembrete:true},
    {id:nid(),titulo:'Almoço em família',data:offset(3),hora:'12:30',tipo:'pessoal',lembrete:false},
    {id:nid(),titulo:'Pagar contas do mês',data:offset(5),hora:'09:00',tipo:'pessoal',lembrete:true},
    {id:nid(),titulo:'Dentista',data:offset(7),hora:'14:00',tipo:'saude',lembrete:true},
    {id:nid(),titulo:'Live no Instagram',data:offset(9),hora:'19:00',tipo:'trabalho',lembrete:false},
    {id:nid(),titulo:'Aniversário do João',data:offset(12),hora:'',tipo:'aniversario',lembrete:true},
  ],
  medicamentos:[
    {id:nid(),nome:'Vitamina D',tipo:'comprimido',dose:2000,unidade:'UI',freq:'diario',dias:[],horarios:[{hora:'08:00',qtd:1}],obs:'Após o café da manhã',estoque:26,estoqueMin:5,status:'ativo',inicio:null,fim:null},
    {id:nid(),nome:'Losartana',tipo:'comprimido',dose:50,unidade:'mg',freq:'diario',dias:[],horarios:[{hora:'08:00',qtd:1},{hora:'20:00',qtd:2}],obs:'Pressão · 1 de manhã, 2 à noite',estoque:30,estoqueMin:8,status:'ativo',inicio:null,fim:null},
    {id:nid(),nome:'Ômega 3',tipo:'capsula',dose:1000,unidade:'mg',freq:'diario',dias:[],horarios:[{hora:'21:00',qtd:1}],obs:'',estoque:40,estoqueMin:6,status:'ativo',inicio:null,fim:null},
    {id:nid(),nome:'Insulina',tipo:'injecao',dose:10,unidade:'UI',freq:'diario',dias:[],horarios:[{hora:'07:00',qtd:1},{hora:'19:00',qtd:1}],obs:'Aplicar no abdômen',estoque:5,estoqueMin:3,status:'ativo',inicio:null,fim:null},
    {id:nid(),nome:'Amoxicilina',tipo:'capsula',dose:500,unidade:'mg',freq:'diario',dias:[],horarios:[{hora:'08:00',qtd:1},{hora:'14:00',qtd:1},{hora:'20:00',qtd:1}],obs:'Antibiótico — completar o ciclo',estoque:12,estoqueMin:0,status:'ativo',inicio:offset(-2),fim:offset(3)},
    {id:nid(),nome:'Vitamina C',tipo:'comprimido',dose:1,unidade:'comp.',freq:'dias',dias:[1,3,5],horarios:[{hora:'12:00',qtd:1}],obs:'',estoque:18,estoqueMin:4,status:'ativo',inicio:null,fim:null},
    {id:nid(),nome:'Dipirona',tipo:'gotas',dose:20,unidade:'gota(s)',freq:'sos',dias:[],horarios:[],obs:'Em caso de dor ou febre',estoque:1,estoqueMin:1,status:'ativo',inicio:null,fim:null},
    {id:nid(),nome:'Relaxante muscular',tipo:'comprimido',dose:5,unidade:'mg',freq:'diario',dias:[],horarios:[{hora:'22:00',qtd:1}],obs:'',estoque:8,estoqueMin:3,status:'pausado',inicio:null,fim:null},
  ],
  tomadas:[],
  medicos:[
    {id:nid(),nome:'Dr. João Pereira',especialidade:'Clínico geral',telefone:'31988887777',clinica:'Clínica Vida',plano:'Unimed',obs:'Pediu hemograma no retorno',consultas:[{data:offset(-30),obs:'Check-up anual. Pediu hemograma e colesterol.'},{data:offset(-90),obs:'Pressão elevada. Ajuste na medicação.'}]},
    {id:nid(),nome:'Dra. Ana Costa',especialidade:'Cardiologista',telefone:'31977776666',clinica:'Hospital Santa Lúcia',plano:'Bradesco Saúde',obs:'',consultas:[{data:offset(-45),obs:'ECG normal. Retorno em 3 meses.'},{data:offset(-180),obs:'Primeira consulta. Solicitou ecocardiograma.'}]},
    {id:nid(),nome:'Dra. Marina Reis',especialidade:'Endocrinologista',telefone:'31966665555',clinica:'Consultório Centro',plano:'Particular',obs:'Acompanhamento da insulina',consultas:[{data:offset(-15),obs:'Ajuste na dose da insulina. Glicose controlando bem.'}]},
  ],
  humor:[
    {data:offset(-1),mood:4,nota:'Dia produtivo',fatores:['Exercício','Sono bom']},
    {data:offset(-2),mood:3,nota:'',fatores:['Trabalho pesado']},
    {data:offset(-3),mood:5,nota:'Almoço em família',fatores:['Social','Alimentação ok']},
    {data:offset(-4),mood:2,nota:'Cansado',fatores:['Sono ruim','Estresse']},
    {data:offset(-5),mood:4,nota:'',fatores:['Exercício']},
    {data:offset(-6),mood:3,nota:'',fatores:[]},
  ],
  habitos:[
    {id:nid(),nome:'Beber água',icone:'drop',cor:'#2D7FF9',tipo:'quantidade',meta:8,unidade:'copos',freq:7,horario:'',registros:{[offset(0)]:5,[offset(-1)]:8,[offset(-2)]:6,[offset(-3)]:8,[offset(-4)]:7,[offset(-5)]:4,[offset(-6)]:8,[offset(-7)]:8,[offset(-8)]:8}},
    {id:nid(),nome:'Exercício',icone:'run',cor:'#1F9D55',tipo:'sim_nao',meta:1,unidade:'',freq:3,horario:'07:00',registros:{[offset(-1)]:1,[offset(-3)]:1,[offset(-4)]:1,[offset(-6)]:1,[offset(-8)]:1}},
    {id:nid(),nome:'Ler 20 min',icone:'book',cor:'#168A7C',tipo:'sim_nao',meta:1,unidade:'',freq:7,horario:'21:00',registros:{[offset(0)]:1,[offset(-1)]:1,[offset(-2)]:1,[offset(-4)]:1,[offset(-5)]:1,[offset(-6)]:1}},
    {id:nid(),nome:'Meditar',icone:'smile',cor:'#E0568C',tipo:'sim_nao',meta:1,unidade:'',freq:5,horario:'',registros:{[offset(-1)]:1,[offset(-2)]:1}},
    {id:nid(),nome:'Dormir 8h',icone:'moon',cor:'#C8860B',tipo:'quantidade',meta:8,unidade:'h',freq:7,horario:'',registros:{[offset(-1)]:7,[offset(-2)]:8,[offset(-3)]:6,[offset(-4)]:8}},
  ],
  metricas:[
    {id:nid(),nome:'Peso',unidade:'kg',cor:'#2D7FF9',icone:'activity',tipo:'simples',registros:[{data:offset(-20),v:83.2},{data:offset(-14),v:82.6},{data:offset(-8),v:82.0},{data:offset(-3),v:81.6},{data:offset(0),v:81.4}]},
    {id:nid(),nome:'Pressão',unidade:'mmHg',cor:'#DB4A4A',icone:'heart',tipo:'pressao',registros:[{data:offset(-10),v:{s:124,d:82}},{data:offset(-5),v:{s:120,d:80}},{data:offset(-1),v:{s:118,d:78}}]},
    {id:nid(),nome:'Glicose',unidade:'mg/dL',cor:'#C8860B',icone:'drop',tipo:'simples',registros:[{data:offset(-7),v:98},{data:offset(-4),v:102},{data:offset(-2),v:95},{data:offset(0),v:92}]},
  ],
  estudos:[   // matérias/cursos
    {id:nid(),nome:'Matemática',cor:'#2D7FF9',metaSemanal:5,prova:offset(5)},
    {id:nid(),nome:'História',  cor:'#C8860B',metaSemanal:3,prova:null},
    {id:nid(),nome:'Inglês',    cor:'#27B6A3',metaSemanal:2,prova:offset(20)},
  ],
  sessoesEstudo:[], // {id, materiaId, data:'YYYY-MM-DD', minutos} — seed abaixo
  contatos:[
    {id:nid(),nome:'Maria Souza',telefone:'31988881111',email:'maria@email.com',tags:['Cliente'],contexto:'negocio',aniversario:'1992-05-29',favorito:true,comoConheci:'Indicação',anotacoes:'Compra brigadeiros toda semana',ultimoContato:offset(-3),manterContato:15,proximaAcao:{data:offset(5),nota:'Confirmar pedido para festa'},interacoes:[{data:offset(-3),tipo:'whatsapp',nota:'Pedido de 6 brigadeiros para o fim de semana'},{data:offset(-18),tipo:'presencial',nota:'Entregou encomenda pessoalmente'},{data:offset(-35),tipo:'whatsapp',nota:'Pediu cardápio atualizado'}],datas:[]},
    {id:nid(),nome:'João Pedro',telefone:'31977772222',email:'',tags:['Cliente'],contexto:'negocio',aniversario:'1988-06-02',favorito:false,comoConheci:'Instagram',anotacoes:'',ultimoContato:offset(-1),manterContato:30,proximaAcao:null,interacoes:[{data:offset(-1),tipo:'whatsapp',nota:'Pediu orçamento para 50 unidades'},{data:offset(-15),tipo:'ligacao',nota:'Ligou para saber prazo de entrega'}],datas:[]},
    {id:nid(),nome:'Ana Lima',telefone:'31966663333',email:'ana@email.com',tags:['Cliente','A prazo'],contexto:'negocio',aniversario:'',favorito:false,comoConheci:'',anotacoes:'Deve R$ 90',ultimoContato:offset(-10),manterContato:null,proximaAcao:{data:offset(3),nota:'Cobrar valor pendente de R$ 90'},interacoes:[{data:offset(-10),tipo:'whatsapp',nota:'Recebeu pedido, vai pagar semana que vem'}],datas:[]},
    {id:nid(),nome:'Carla Mãe',telefone:'31955554444',email:'',tags:['Família'],contexto:'pessoal',aniversario:'1965-08-12',favorito:true,comoConheci:'',anotacoes:'',ultimoContato:offset(-2),manterContato:7,proximaAcao:null,interacoes:[{data:offset(-2),tipo:'ligacao',nota:'Ligou para saber como estava'},{data:offset(-9),tipo:'presencial',nota:'Almoço de domingo em família'}],datas:[]},
    {id:nid(),nome:'Pedro Irmão',telefone:'31944445555',email:'',tags:['Família'],contexto:'pessoal',aniversario:'1995-12-01',favorito:false,comoConheci:'',anotacoes:'',ultimoContato:'',manterContato:null,proximaAcao:null,interacoes:[],datas:[]},
    {id:nid(),nome:'Bruno Fornecedor',telefone:'31933336666',email:'bruno@fornec.com',tags:['Fornecedor'],contexto:'negocio',aniversario:'',favorito:false,comoConheci:'',anotacoes:'Embalagens e insumos',ultimoContato:offset(-20),manterContato:30,proximaAcao:{data:offset(10),nota:'Negociar preço para pedido grande'},interacoes:[{data:offset(-20),tipo:'whatsapp',nota:'Confirmou estoque de caixinhas disponível'},{data:offset(-50),tipo:'email',nota:'Enviou catálogo de novos produtos'}],datas:[]},
    {id:nid(),nome:'Lucas Amigo',telefone:'31922227777',email:'lucas@email.com',tags:['Amigos'],contexto:'pessoal',aniversario:'1993-05-30',favorito:false,comoConheci:'Faculdade',anotacoes:'',ultimoContato:offset(-40),manterContato:60,proximaAcao:null,interacoes:[{data:offset(-40),tipo:'whatsapp',nota:'Mandou meme, respondeu rindo'},{data:offset(-65),tipo:'presencial',nota:'Saíram para jantar'}],datas:[]},
  ],
  vendas:[],
  fornecedores:[],
  produtos:[
    // Doces — índices 0-6 (0-2 usados pelo seed de movimentações)
    {id:nid(),nome:'Brigadeiro Tradicional',emoji:'🍫',categoria:'Doces',preco:5.5,custo:1.8,estoque:80,estoqueMin:20,ativo:true,fixado:true},
    {id:nid(),nome:'Beijinho de Coco',emoji:'🥥',categoria:'Doces',preco:5.5,custo:1.9,estoque:45,estoqueMin:20,ativo:true,fixado:true},
    {id:nid(),nome:'Bicho de Pé',emoji:'🍓',categoria:'Doces',preco:5.5,custo:2.0,estoque:12,estoqueMin:20,ativo:true,fixado:false},
    {id:nid(),nome:'Churros Recheado',emoji:'🥐',categoria:'Doces',preco:8.0,custo:2.5,estoque:35,estoqueMin:10,ativo:true,fixado:false},
    {id:nid(),nome:'Brownie',emoji:'🍫',categoria:'Doces',preco:12.0,custo:4.0,estoque:20,estoqueMin:8,ativo:true,fixado:false},
    {id:nid(),nome:'Trufa de Limão',emoji:'🍋',categoria:'Doces',preco:7.0,custo:2.2,estoque:30,estoqueMin:10,ativo:true,fixado:false},
    {id:nid(),nome:'Palha Italiana',emoji:'🍬',categoria:'Doces',preco:5.0,custo:1.6,estoque:50,estoqueMin:15,ativo:true,fixado:false},
    // Kits — índices 7-10
    {id:nid(),nome:'Kit 9 Doces',emoji:'🎁',categoria:'Kits',preco:55.0,custo:18.0,estoque:15,estoqueMin:3,ativo:true,fixado:true},
    {id:nid(),nome:'Kit 16 Doces',emoji:'🎀',categoria:'Kits',preco:95.0,custo:32.0,estoque:10,estoqueMin:2,ativo:true,fixado:true},
    {id:nid(),nome:'Kit 25 Doces',emoji:'🎉',categoria:'Kits',preco:145.0,custo:48.0,estoque:6,estoqueMin:2,ativo:true,fixado:false},
    {id:nid(),nome:'Kit Degustação (5 sabores)',emoji:'🍱',categoria:'Kits',preco:35.0,custo:12.0,estoque:8,estoqueMin:2,ativo:true,fixado:false},
    // Embalagens — índices 11-15 (11-13 usados pelo seed de movimentações como ps[3-5])
    {id:nid(),nome:'Caixa 9 unid.',emoji:'📦',categoria:'Embalagens',preco:12,custo:3.5,estoque:30,estoqueMin:10,ativo:true,fixado:false},
    {id:nid(),nome:'Caixa 16 unid.',emoji:'📫',categoria:'Embalagens',preco:20,custo:6.0,estoque:8,estoqueMin:10,ativo:true,fixado:false},
    {id:nid(),nome:'Papel Chumbo',emoji:'✨',categoria:'Embalagens',preco:2,custo:0.8,estoque:200,estoqueMin:50,ativo:true,fixado:false},
    {id:nid(),nome:'Saco Celofane',emoji:'🛍️',categoria:'Embalagens',preco:0.5,custo:0.15,estoque:500,estoqueMin:100,ativo:true,fixado:false},
    {id:nid(),nome:'Laço Decorativo',emoji:'🎀',categoria:'Embalagens',preco:1.5,custo:0.6,estoque:80,estoqueMin:20,ativo:true,fixado:false},
    // Bebidas — índices 16-18
    {id:nid(),nome:'Suco de Laranja',emoji:'🍊',categoria:'Bebidas',preco:8.0,custo:2.5,estoque:24,estoqueMin:6,ativo:true,fixado:false},
    {id:nid(),nome:'Água Mineral',emoji:'💧',categoria:'Bebidas',preco:3.0,custo:1.2,estoque:48,estoqueMin:12,ativo:true,fixado:false},
    {id:nid(),nome:'Refrigerante Lata',emoji:'🥤',categoria:'Bebidas',preco:5.0,custo:2.0,estoque:36,estoqueMin:12,ativo:true,fixado:false},
    // Personalizados — índice 19
    {id:nid(),nome:'Arte Digital (convite/logo)',emoji:'🎨',categoria:'Personalizados',preco:80.0,custo:0,estoque:999,estoqueMin:0,ativo:true,fixado:false},
  ],
  movimentacoes:[],
};

// Seed movimentações com IDs corretos
(function(){
  const ps=DB.produtos;
  // ps[0]=Brigadeiro, ps[1]=Beijinho, ps[2]=Bicho de Pé
  // ps[11]=Caixa9, ps[12]=Caixa16, ps[13]=Papel Chumbo
  DB.movimentacoes=[
    {id:nid(),produtoId:ps[0].id,tipo:'entrada',qtd:100,obs:'Produção — batch inicial',data:offset(-8)},
    {id:nid(),produtoId:ps[1].id,tipo:'entrada',qtd:60,obs:'Produção inicial',data:offset(-8)},
    {id:nid(),produtoId:ps[2].id,tipo:'entrada',qtd:30,obs:'Produção inicial',data:offset(-8)},
    {id:nid(),produtoId:ps[11].id,tipo:'entrada',qtd:50,obs:'Compra de embalagens',data:offset(-7)},
    {id:nid(),produtoId:ps[12].id,tipo:'entrada',qtd:20,obs:'Compra de embalagens',data:offset(-7)},
    {id:nid(),produtoId:ps[13].id,tipo:'entrada',qtd:300,obs:'Rolo de papel chumbo',data:offset(-7)},
    {id:nid(),produtoId:ps[0].id,tipo:'saida',qtd:12,obs:'Venda — Maria Souza',data:offset(-5)},
    {id:nid(),produtoId:ps[1].id,tipo:'saida',qtd:9,obs:'Venda — João Pedro',data:offset(-5)},
    {id:nid(),produtoId:ps[11].id,tipo:'saida',qtd:12,obs:'Caixas 9un. vendidas',data:offset(-5)},
    {id:nid(),produtoId:ps[13].id,tipo:'saida',qtd:80,obs:'Uso na embalagem',data:offset(-5)},
    {id:nid(),produtoId:ps[0].id,tipo:'saida',qtd:8,obs:'Venda — encomenda festa',data:offset(-3)},
    {id:nid(),produtoId:ps[2].id,tipo:'saida',qtd:18,obs:'Venda — evento especial',data:offset(-3)},
    {id:nid(),produtoId:ps[12].id,tipo:'saida',qtd:12,obs:'Caixas 16un. vendidas',data:offset(-3)},
    {id:nid(),produtoId:ps[13].id,tipo:'saida',qtd:20,obs:'Uso na embalagem',data:offset(-3)},
    {id:nid(),produtoId:ps[1].id,tipo:'saida',qtd:6,obs:'Venda do dia',data:offset(-1)},
  ];
})();

// Seed sessões de estudo (referenciam os IDs reais das matérias)
(function(){
  const es=DB.estudos; if(es.length<3)return;
  const mat=es[0].id, his=es[1].id, ing=es[2].id;
  DB.sessoesEstudo=[
    {id:nid(),materiaId:mat,data:offset(0), minutos:70},
    {id:nid(),materiaId:mat,data:offset(-1),minutos:60},
    {id:nid(),materiaId:mat,data:offset(-3),minutos:50},
    {id:nid(),materiaId:mat,data:offset(-5),minutos:55},
    {id:nid(),materiaId:ing,data:offset(0), minutos:70},
    {id:nid(),materiaId:ing,data:offset(-2),minutos:60},
    {id:nid(),materiaId:his,data:offset(-4),minutos:45},
    {id:nid(),materiaId:his,data:offset(-6),minutos:40},
  ];
})();

// Seed vendas mock
(function(){
  const ps=DB.produtos,cs=DB.contatos;
  const maria=cs.find(c=>c.nome==='Maria Souza'),joao=cs.find(c=>c.nome==='João Pedro');
  DB.vendas=[
    {id:nid(),data:offset(-5),itens:[{produtoId:ps[0].id,nome:ps[0].nome,emoji:ps[0].emoji,preco:ps[0].preco,qtd:12},{produtoId:ps[3].id,nome:ps[3].nome,emoji:ps[3].emoji,preco:ps[3].preco,qtd:3}],subtotal:66+36,desconto:0,total:102,pagamento:'pix',clienteId:maria?maria.id:null,clienteNome:maria?maria.nome:'Maria Souza',status:'pago',obs:''},
    {id:nid(),data:offset(-5),itens:[{produtoId:ps[1].id,nome:ps[1].nome,emoji:ps[1].emoji,preco:ps[1].preco,qtd:9},{produtoId:ps[4].id,nome:ps[4].nome,emoji:ps[4].emoji,preco:ps[4].preco,qtd:3}],subtotal:49.5+60,desconto:0,total:109.5,pagamento:'a_prazo',clienteId:joao?joao.id:null,clienteNome:joao?joao.nome:'João Pedro',status:'pendente',obs:'Prazo: 2 semanas'},
    {id:nid(),data:offset(-3),itens:[{produtoId:ps[0].id,nome:ps[0].nome,emoji:ps[0].emoji,preco:ps[0].preco,qtd:8},{produtoId:ps[2].id,nome:ps[2].nome,emoji:ps[2].emoji,preco:ps[2].preco,qtd:18},{produtoId:ps[4].id,nome:ps[4].nome,emoji:ps[4].emoji,preco:ps[4].preco,qtd:3}],subtotal:44+99+60,desconto:10,total:193,pagamento:'pix',clienteId:null,clienteNome:'',status:'pago',obs:'Encomenda festa'},
    {id:nid(),data:offset(-1),itens:[{produtoId:ps[1].id,nome:ps[1].nome,emoji:ps[1].emoji,preco:ps[1].preco,qtd:6}],subtotal:33,desconto:0,total:33,pagamento:'dinheiro',clienteId:null,clienteNome:'',status:'pago',obs:''},
  ];
})();

// Seed fornecedores + vínculos (Etapa 12)
(function(){
  DB.fornecedores=[
    {id:nid(),nome:'Distribuidora de Embalagens BH',telefone:'31987650001',oqueFornece:'Caixas, sacos, laços e papel chumbo',condicaoPgto:'30 dias',anotacoes:'Pedido mínimo R$ 150. Entrega em 3 dias.'},
    {id:nid(),nome:'Atacado de Doces & Insumos',telefone:'31987650002',oqueFornece:'Chocolate, leite condensado, coberturas',condicaoPgto:'à vista',anotacoes:'Bom preço no chocolate em barra.'},
    {id:nid(),nome:'Bebidas Express',telefone:'31987650003',oqueFornece:'Refrigerantes, sucos e água',condicaoPgto:'15 dias',anotacoes:''},
  ];
  const emb=DB.fornecedores[0],doc=DB.fornecedores[1],beb=DB.fornecedores[2];
  DB.produtos.forEach(p=>{
    if(p.categoria==='Embalagens')p.fornecedorId=emb.id;
    else if(p.categoria==='Doces'||p.categoria==='Kits')p.fornecedorId=doc.id;
    else if(p.categoria==='Bebidas')p.fornecedorId=beb.id;
  });
  DB.contas.push(
    {id:nid(),tipo:'pagar',descricao:'Pedido de embalagens',valor:240,cat:'outros',metodo:'Pix',venc:offset(8),status:'pendente',fornecedorId:emb.id},
    {id:nid(),tipo:'pagar',descricao:'Compra de insumos (chocolate)',valor:380,cat:'alimentacao',metodo:'Pix',venc:offset(12),status:'pendente',fornecedorId:doc.id},
  );
})();

