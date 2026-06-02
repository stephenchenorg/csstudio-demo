/* ============ MISS DIOR demo — shared script ============ */

/* ---------- Product data ---------- */
const PRODUCTS = {
  'white':{
    id:'white',
    page:'white.html',
    name:'純白綁帶套裝',
    sub:'White Tie-Front Set',
    tag:'New In',
    desc:'純白棉質短袖上衣搭配同色褲裙。前襟綁帶設計可調節版型，口袋立體繡字與腰頭織帶細節，清爽而具份量感，是夏日的優雅首選。',
    price:3280,
    colors:['白','黑'],
    sizes:['S','M','L'],
    material:'棉 95% / 彈性纖維 5%',
    images:['images/white-1.webp','images/white-2.webp','images/white-3.webp']
  },
  'black':{
    id:'black',
    page:'black.html',
    name:'經典黑綁帶套裝',
    sub:'Black Tie-Front Set',
    tag:'Best Seller',
    desc:'經典黑棉質短袖上衣搭配同色短褲裙。俐落剪裁與綁帶結，腰頭黑白織帶與精緻繡飾，顯瘦百搭，日常通勤或度假都能輕鬆駕馭。',
    price:3280,
    colors:['黑','白'],
    sizes:['S','M','L'],
    material:'棉 95% / 彈性纖維 5%',
    images:['images/black-1.webp','images/black-2.webp','images/black-3.webp']
  }
};

const fmt = n => 'NT$' + n.toLocaleString('en-US');
const $ = id => document.getElementById(id);
const CART_KEY = 'missdior_cart';

/* ---------- Cart store (localStorage) ---------- */
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){ return []; } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
let cart = loadCart();

function addToCart(item){
  const found = cart.find(i=>i.key===item.key);
  if(found){ found.qty += item.qty; }
  else{ cart.push(item); }
  saveCart(cart); renderCart();
}

/* ---------- Cart render ---------- */
function renderCart(){
  const body = $('drawerBody'); if(!body) return;
  body.innerHTML = '';
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  const count = $('cartCount');
  if(count){ count.textContent = totalQty; count.classList.toggle('show', totalQty>0); }
  if(cart.length===0){
    body.innerHTML = '<div class="cart-empty">您的購物車是空的</div>';
  }else{
    cart.forEach(item=>{
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="ci-info">
          <h4>${item.name}</h4>
          <div class="ci-meta">顏色 ${item.color} · 尺寸 ${item.size}</div>
          <div class="ci-bottom">
            <div class="ci-qty">
              <button data-act="minus">&minus;</button>
              <span>${item.qty}</span>
              <button data-act="plus">+</button>
            </div>
            <div class="ci-price">${fmt(item.price*item.qty)}</div>
          </div>
          <button class="ci-remove">移除</button>
        </div>`;
      row.querySelector('[data-act="minus"]').addEventListener('click',()=>{ item.qty=Math.max(1,item.qty-1); saveCart(cart); renderCart(); });
      row.querySelector('[data-act="plus"]').addEventListener('click',()=>{ item.qty++; saveCart(cart); renderCart(); });
      row.querySelector('.ci-remove').addEventListener('click',()=>{ cart=cart.filter(i=>i.key!==item.key); saveCart(cart); renderCart(); });
      body.appendChild(row);
    });
  }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  if($('cartTotal')) $('cartTotal').textContent = fmt(total);
}

/* ---------- Drawer ---------- */
function openDrawer(){ $('drawer').classList.add('open'); $('drawerOverlay').classList.add('open'); document.body.style.overflow='hidden'; }
function closeDrawer(){ $('drawer').classList.remove('open'); $('drawerOverlay').classList.remove('open'); document.body.style.overflow=''; }

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg){
  const t = $('toast'); if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 2400);
}

/* ---------- Home grid ---------- */
function initHome(){
  const grid = $('productGrid'); if(!grid) return;
  Object.values(PRODUCTS).forEach(p=>{
    const a = document.createElement('a');
    a.className = 'card';
    a.href = p.page;
    a.innerHTML = `
      <div class="card-img">
        <span class="card-tag">${p.tag}</span>
        <img class="main" src="${p.images[0]}" alt="${p.name}" width="1080" height="1440" loading="lazy" decoding="async">
        <img class="alt" src="${p.images[1]}" alt="${p.name} 細節" width="1080" height="1440" loading="lazy" decoding="async">
        <div class="card-quick">查看商品</div>
      </div>
      <div class="card-info">
        <div><h3>${p.name}</h3><div class="desc">${p.sub}</div></div>
        <div class="price">${fmt(p.price)}</div>
      </div>`;
    grid.appendChild(a);
  });
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.15});
  document.querySelectorAll('.card').forEach(c=>io.observe(c));
}

/* ---------- Product page ---------- */
function initProduct(id){
  const p = PRODUCTS[id]; if(!p) return;
  const state = {color:null,size:null,qty:1,img:0};

  // text
  $('pTag').textContent = p.tag;
  $('pTagline').textContent = p.tag;
  $('pTitle').textContent = p.name;
  $('pSub').textContent = p.sub;
  $('pPrice').textContent = fmt(p.price);
  $('pDesc').textContent = p.desc;
  $('pMaterial').textContent = p.material;
  $('crumbName').textContent = p.name;
  document.title = p.name + ' — MISS DIOR';

  // gallery
  const stage = $('pStage');
  p.images.forEach((src,i)=>{
    const im = document.createElement('img');
    im.src = src; im.alt = p.name;
    im.width = 1080; im.height = 1440; im.decoding = 'async';
    im.loading = i===0 ? 'eager' : 'lazy';   // 主圖即時、其餘延遲
    if(i===0){ im.classList.add('active'); im.setAttribute('fetchpriority','high'); }
    stage.insertBefore(im, stage.querySelector('.p-arrow.prev'));
  });
  const thumbsWrap = $('pThumbs');
  p.images.forEach((src,i)=>{
    const b = document.createElement('button');
    if(i===0) b.classList.add('active');
    b.innerHTML = `<img src="${src}" alt="縮圖${i+1}" width="200" height="200" loading="lazy" decoding="async">`;
    b.addEventListener('click',()=>go(i));
    thumbsWrap.appendChild(b);
  });
  const imgs = stage.querySelectorAll('img');
  const thumbs = thumbsWrap.querySelectorAll('button');
  function go(i){
    state.img = (i+imgs.length)%imgs.length;
    imgs.forEach((im,k)=>im.classList.toggle('active',k===state.img));
    thumbs.forEach((b,k)=>b.classList.toggle('active',k===state.img));
  }
  stage.querySelector('.p-arrow.prev').addEventListener('click',e=>{e.stopPropagation();go(state.img-1);});
  stage.querySelector('.p-arrow.next').addEventListener('click',e=>{e.stopPropagation();go(state.img+1);});
  stage.addEventListener('click',e=>{
    if(e.target.tagName==='IMG'){ $('zoomImg').src=p.images[state.img]; $('zoom').classList.add('open'); }
  });

  // colours
  const swatchWrap = $('pSwatches'), cReq = $('reqColor');
  p.colors.forEach(c=>{
    const s = document.createElement('button');
    s.className='swatch'; s.dataset.color=c; s.title=c;
    s.addEventListener('click',()=>{
      state.color=c; cReq.classList.remove('show');
      swatchWrap.querySelectorAll('.swatch').forEach(x=>x.classList.toggle('sel',x===s));
    });
    swatchWrap.appendChild(s);
  });
  // sizes
  const sizeWrap = $('pSizes'), sReq = $('reqSize');
  p.sizes.forEach(sz=>{
    const b = document.createElement('button');
    b.className='size'; b.textContent=sz;
    b.addEventListener('click',()=>{
      state.size=sz; sReq.classList.remove('show');
      sizeWrap.querySelectorAll('.size').forEach(x=>x.classList.toggle('sel',x===b));
    });
    sizeWrap.appendChild(b);
  });
  // qty
  const qVal = $('qtyVal');
  $('qtyMinus').addEventListener('click',()=>{ state.qty=Math.max(1,state.qty-1); qVal.textContent=state.qty; });
  $('qtyPlus').addEventListener('click',()=>{ state.qty++; qVal.textContent=state.qty; });
  // add
  const addBtn = $('pAdd');
  addBtn.addEventListener('click',()=>{
    let ok=true;
    if(!state.color){ cReq.classList.add('show'); ok=false; }
    if(!state.size){ sReq.classList.add('show'); ok=false; }
    if(!ok) return;
    addToCart({
      key:p.id+'-'+state.color+'-'+state.size,
      name:p.name, color:state.color, size:state.size,
      price:p.price, qty:state.qty, img:p.images[0]
    });
    addBtn.classList.add('flash'); setTimeout(()=>addBtn.classList.remove('flash'),600);
    showToast(`已加入購物車 · ${p.name}`);
    openDrawer();
    state.qty=1; qVal.textContent='1';
  });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  // wire shared chrome
  if($('cartBtn')) $('cartBtn').addEventListener('click',openDrawer);
  if($('drawerClose')) $('drawerClose').addEventListener('click',closeDrawer);
  if($('drawerOverlay')) $('drawerOverlay').addEventListener('click',closeDrawer);
  if($('checkoutBtn')) $('checkoutBtn').addEventListener('click',()=>{
    if(cart.length===0){ showToast('購物車是空的'); return; }
    showToast('感謝選購！結帳功能為展示用途。');
  });
  if($('zoom')) $('zoom').addEventListener('click',()=>$('zoom').classList.remove('open'));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if($('zoom') && $('zoom').classList.contains('open')) $('zoom').classList.remove('open');
      else if($('drawer') && $('drawer').classList.contains('open')) closeDrawer();
    }
  });

  // page-specific
  const page = document.body.dataset.page;
  if(page==='home') initHome();
  else if(page==='product') initProduct(document.body.dataset.product);

  renderCart();
});
