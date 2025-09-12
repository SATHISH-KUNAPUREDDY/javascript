const TAX_RATE = 0.08;
const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('toggleCart');
const cartCountEl = document.getElementById('cartCount');
const cartPanel = document.getElementById('cart');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const modal = document.getElementById('modal');
const payBtn = document.getElementById('payBtn');
const cancelPay = document.getElementById('cancelPay');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');  
const sortProducts = document.getElementById('sortProducts');      
let PRODUCTS = [];
let cart = loadCart();

function saveCart(){ localStorage.setItem('demo_cart', JSON.stringify(cart)); }
function loadCart(){ try{ return JSON.parse(localStorage.getItem('demo_cart')) || {}; } catch(e){ return {}; } }

async function fetchProducts(){
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    PRODUCTS = await res.json();
    renderCategoryOptions();   
    renderProducts(PRODUCTS);
  } catch(e){ console.error("Error fetching products:", e); }
}

function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <strong>${p.title}</strong>
      <div class="price">$${p.price.toFixed(2)}</div>
      <div class="small">${p.description.substring(0,80)}...</div>
      <button class="btn add" data-id="${p.id}">Add to cart</button>
    `;
    productsEl.appendChild(div);
  });
  document.querySelectorAll('.product .add').forEach(b =>
    b.addEventListener('click', e => addToCart(+e.currentTarget.dataset.id))
  );
}

function addToCart(id){ cart[id] = (cart[id] || 0) + 1; saveCart(); renderCart(); }
function updateQty(id, qty){ if(qty<=0){ delete cart[id]; } else { cart[id]=qty; } saveCart(); renderCart(); }

function renderCart(){
  cartItemsEl.innerHTML = '';
  const ids = Object.keys(cart).map(Number);
  if(ids.length===0){
    cartItemsEl.innerHTML='<div class="small">Your cart is empty.</div>';
    subtotalEl.textContent='$0.00'; taxEl.textContent='$0.00'; totalEl.textContent='$0.00'; cartCountEl.textContent='0';
    return;
  }
  let subtotal=0;
  ids.forEach(id=>{
    const product = PRODUCTS.find(p=>p.id===id); if(!product) return;
    const qty = cart[id], line = product.price*qty; subtotal+=line;
    const div=document.createElement('div');
    div.className='cart-item';
    div.innerHTML=`
      <img src="${product.image}" alt="">
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><strong>${product.title}</strong><div class="small">$${product.price.toFixed(2)}</div></div>
          <div style="text-align:right">
            <div class="small">$${line.toFixed(2)}</div>
            <button class="small" data-id="${id}" style="background:transparent;border:0;color:#ef4444;cursor:pointer">Remove</button>
          </div>
        </div>
        <div class="qty" style="margin-top:8px">
          <button class="small dec" data-id="${id}">-</button>
          <div style="padding:6px 8px;border-radius:8px;background:#f3f4f6">${qty}</div>
          <button class="small inc" data-id="${id}">+</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  const tax=subtotal*TAX_RATE, total=subtotal+tax;
  subtotalEl.textContent=`$${subtotal.toFixed(2)}`;
  taxEl.textContent=`$${tax.toFixed(2)}`;
  totalEl.textContent=`$${total.toFixed(2)}`;
  cartCountEl.textContent=ids.reduce((s,id)=>s+cart[id],0);

  cartItemsEl.querySelectorAll('.inc').forEach(b=>b.addEventListener('click', e=>updateQty(+e.currentTarget.dataset.id, cart[+e.currentTarget.dataset.id]+1)));
  cartItemsEl.querySelectorAll('.dec').forEach(b=>b.addEventListener('click', e=>updateQty(+e.currentTarget.dataset.id, cart[+e.currentTarget.dataset.id]-1)));
  cartItemsEl.querySelectorAll('[data-id]').forEach(btn=>{ if(btn.textContent.trim()==='Remove') btn.addEventListener('click', e=>{ delete cart[+e.currentTarget.dataset.id]; saveCart(); renderCart(); }); });
}


cartBtn.addEventListener('click', ()=>{ cartPanel.classList.add('open'); cartOverlay.style.display='block'; });
function closeCartFn(){ cartPanel.classList.remove('open'); cartOverlay.style.display='none'; }
document.getElementById('closeCart').addEventListener('click', closeCartFn);
cartOverlay.addEventListener('click', closeCartFn);

clearCartBtn.addEventListener('click', ()=>{ if(!confirm('Clear cart?')) return; cart={}; saveCart(); renderCart(); });

checkoutBtn.addEventListener('click', ()=>{ if(Object.keys(cart).length===0){ alert('Cart is empty'); return; } modal.style.display='flex'; });
cancelPay.addEventListener('click', ()=> modal.style.display='none');
payBtn.addEventListener('click', ()=>{ payBtn.textContent='Processing...'; payBtn.disabled=true; setTimeout(()=>{ cart={}; saveCart(); renderCart(); modal.style.display='none'; payBtn.textContent='Pay'; payBtn.disabled=false; alert('Payment successful! (demo)'); },1200); });

searchInput.addEventListener('input', e=>{
  const q = e.target.value.trim().toLowerCase();
  filterAndSortProducts(q, categoryFilter.value, sortProducts.value);
});

categoryFilter.addEventListener('change', ()=> filterAndSortProducts(searchInput.value.trim().toLowerCase(), categoryFilter.value, sortProducts.value));

sortProducts.addEventListener('change', ()=> filterAndSortProducts(searchInput.value.trim().toLowerCase(), categoryFilter.value, sortProducts.value));

function renderCategoryOptions(){
  const categories = Array.from(new Set(PRODUCTS.map(p=>p.category)));
  categories.forEach(cat=>{
    const opt = document.createElement('option'); opt.value=cat; opt.textContent=cat;
    categoryFilter.appendChild(opt);
  });
}

function filterAndSortProducts(search='', category='all', sort='default'){
  let filtered = PRODUCTS.filter(p => 
    (p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)) &&
    (category === 'all' || p.category === category)
  );

  if(sort === 'price-asc') filtered.sort((a,b)=>a.price-b.price);
  else if(sort === 'price-desc') filtered.sort((a,b)=>b.price-a.price);
  else if(sort === 'title-asc') filtered.sort((a,b)=>a.title.localeCompare(b.title));
  else if(sort === 'title-desc') filtered.sort((a,b)=>b.title.localeCompare(a.title));

  renderProducts(filtered);
}

fetchProducts();
renderCart();
