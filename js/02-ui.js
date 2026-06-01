const Toast={el:null,
  init(){this.el=document.createElement('div');this.el.className='toasts';document.body.appendChild(this.el);},
  show(msg,type){type=type||'ok';if(!this.el)this.init();const t=document.createElement('div');t.className='toast '+type;t.innerHTML=`${svg(type==='err'?'x':'tick',16)}<span>${msg}</span>`;this.el.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(24px)';setTimeout(()=>t.remove(),260);},2400);}};

const Modal={
  _build(title,bodyHTML,footerHTML,maxw){
    const back=document.createElement('div');back.className='modal-back';
    back.innerHTML=`<div class="modal"${maxw?` style="max-width:${maxw}px"`:''}><div class="modal-h"><h3>${title}</h3><button data-close>${svg('x',18)}</button></div><div class="modal-b">${bodyHTML}</div><div class="modal-f">${footerHTML}</div></div>`;
    document.body.appendChild(back);requestAnimationFrame(()=>back.classList.add('show'));
    const close=()=>{back.classList.remove('show');setTimeout(()=>back.remove(),200);};
    back.querySelectorAll('[data-close]').forEach(b=>b.onclick=close);
    back.addEventListener('mousedown',e=>{if(e.target===back)close();});
    document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc);}});
    return {back,close};
  },
  open(title,bodyHTML,onSave,saveLabel){
    const {back,close}=this._build(title,bodyHTML,`<button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-save>${saveLabel||'Salvar'}</button>`);
    back.querySelector('[data-save]').onclick=()=>{if(onSave(back)!==false)close();};
    return back;
  },
  confirm(title,msg,onYes,yesLabel){
    const {back,close}=this._build(title,`<p style="font-size:14px;color:var(--text-2);line-height:1.55">${msg}</p>`,`<button class="btn btn-ghost" data-close>Cancelar</button><button class="btn" style="background:var(--expense);color:#fff" data-yes>${yesLabel||'Excluir'}</button>`,380);
    back.querySelector('[data-yes]').onclick=()=>{onYes();close();};
  }
};

const Charts={
  donut(items,size){size=size||170;const total=items.reduce((s,i)=>s+i.value,0)||1;const r=size/2,R=r-10,C=2*Math.PI*R;let acc=0;const rings=items.filter(i=>i.value>0).map(it=>{const frac=it.value/total;const seg=`<circle cx="${r}" cy="${r}" r="${R}" fill="none" stroke="${it.cor}" stroke-width="${(size*0.14).toFixed(1)}" stroke-dasharray="${(frac*C).toFixed(2)} ${(C-frac*C).toFixed(2)}" stroke-dashoffset="${(-acc*C).toFixed(2)}" transform="rotate(-90 ${r} ${r})"/>`;acc+=frac;return seg;}).join('');return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="flex-shrink:0">${rings}</svg>`;},
  bars(items,h){h=h||180;const w=Math.max(220,items.length*80);const max=Math.max(...items.map(i=>i.value),1);const gap=w/items.length;const bw=Math.min(60,gap*0.5);const out=items.map((it,i)=>{const bh=Math.max(2,it.value/max*(h-42));const x=i*gap+(gap-bw)/2;const y=h-26-bh;return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="6" fill="${it.cor}"/><text x="${(x+bw/2).toFixed(1)}" y="${(y-7).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${it.short||''}</text><text x="${(x+bw/2).toFixed(1)}" y="${h-8}" text-anchor="middle" font-size="11" font-weight="600" fill="currentColor" opacity=".55">${it.label}</text>`;}).join('');return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" style="color:var(--text-2)" preserveAspectRatio="xMidYMid meet">${out}</svg>`;},
  line(vals,h){h=h||160;const w=600;const max=Math.max(...vals,0),min=Math.min(...vals,0),rng=(max-min)||1;const n=vals.length;const pts=vals.map((v,i)=>[n>1?(i/(n-1)*(w-12)+6):w/2,h-14-((v-min)/rng)*(h-32)]);const d=pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');const area=`${d} L${pts[pts.length-1][0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none"><defs><linearGradient id="lgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--brand)" stop-opacity=".22"/><stop offset="1" stop-color="var(--brand)" stop-opacity="0"/></linearGradient></defs><path d="${area}" fill="url(#lgrad)"/><path d="${d}" fill="none" stroke="var(--brand)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
};

