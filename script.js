let cart = [];
const sideMenu = document.getElementById('side-menu');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const emptyMsg = document.getElementById('empty-cart-msg');
const toast = document.getElementById('toast');
const menuGrid = document.getElementById('menu-grid');
const menuSearch = document.getElementById('menu-search');
const menuCategories = document.getElementById('menu-categories');
const promoTrack = document.getElementById('promo-track');
const promoPrev = document.getElementById('promo-prev');
const promoNext = document.getElementById('promo-next');

const products = [
  {
    name: 'Inferno Burger',
    price: 12.9,
    description: 'Doble carne, habanero, cheddar fundido y cebolla caramelizada.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'Picante',
    badge: 'PICANTE 🔥'
  },
  {
    name: 'Flame Classic',
    price: 10.5,
    description: 'Carne Angus, lechuga orgánica, tomate y salsa especial.',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    category: 'Popular',
    badge: 'POPULAR'
  },
  {
    name: 'Cheesy Volcano',
    price: 14.0,
    description: 'Triple queso con cheddar blanco y tocino crujiente.',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
    category: 'Queso',
    badge: ''
  }
];

let currentCategory = 'Todas';
let searchQuery = '';
let promoIndex = 0;

function toggleMenu() {
  sideMenu.classList.toggle('active');
}

function toggleCart() {
  cartDrawer.classList.toggle('active');
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCart();
  showToast(`¡${name} añadida!`);
}

function renderPromos() {
  if (!promoTrack) return;
  const promos = [
    {
      title: 'Combo Fuego',
      desc: 'Inferno Burger + papas flame + bebida',
      price: 14.9,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'
    },
    {
      title: '2x1 Clásica',
      desc: 'Flame Classic por partida doble',
      price: 10.5,
      image: 'https://images.unsplash.com/photo-1606756790138-8fb2b0caebd8?w=800'
    },
    {
      title: 'Cheesy Lovers',
      desc: 'Cheesy Volcano + extra queso',
      price: 15.9,
      image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800'
    }
  ];
  promoTrack.innerHTML = '';
  promos.forEach(p => {
    const slide = document.createElement('div');
    slide.className = 'min-w-full p-6';
    slide.innerHTML = `
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div class="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-white/5">
          <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-4">
          <h3 class="text-3xl font-extrabold">${p.title}</h3>
          <p class="text-gray-300">${p.desc}</p>
          <div class="flex items-center justify-between">
            <span class="text-3xl font-bold text-yellow-500">$${p.price.toFixed(2)}</span>
            <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl">Agregar</button>
          </div>
        </div>
      </div>
    `;
    slide.querySelector('button').onclick = () => addToCart(p.title, p.price);
    promoTrack.appendChild(slide);
  });
  updatePromoSlider();

  if (promoPrev) promoPrev.onclick = prevPromo;
  if (promoNext) promoNext.onclick = nextPromo;
}

function updatePromoSlider() {
  if (!promoTrack) return;
  promoTrack.style.transform = `translateX(-${promoIndex * 100}%)`;
}

function nextPromo() {
  const len = promoTrack ? promoTrack.children.length : 0;
  if (len === 0) return;
  promoIndex = (promoIndex + 1) % len;
  updatePromoSlider();
}

function prevPromo() {
  const len = promoTrack ? promoTrack.children.length : 0;
  if (len === 0) return;
  promoIndex = (promoIndex - 1 + len) % len;
  updatePromoSlider();
}

function renderCategories() {
  const cats = Array.from(new Set(products.map(p => p.category)));
  const all = ['Todas', ...cats];
  menuCategories.innerHTML = '';
  all.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `px-4 py-2 rounded-full border border-white/10 ${currentCategory === cat ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'} transition-all`;
    btn.innerText = cat;
    btn.onclick = () => {
      currentCategory = cat;
      renderMenu();
      renderCategories();
    };
    menuCategories.appendChild(btn);
  });
}

function renderMenu() {
  const filtered = products.filter(p => {
    const matchesCat = currentCategory === 'Todas' || p.category === currentCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = q === '' || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });
  menuGrid.innerHTML = '';
  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-center text-gray-400 col-span-3 py-10';
    empty.innerText = 'Sin resultados';
    menuGrid.appendChild(empty);
    return;
  }
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'glass p-6 rounded-[2rem] card-hover transition-all duration-300 group';
    const badgeEl = p.badge ? `<span class="absolute top-4 right-4 bg-red-600 text-xs font-bold px-3 py-1 rounded-full">${p.badge}</span>` : '';
    card.innerHTML = `
      <div class="relative h-48 mb-6 rounded-2xl overflow-hidden bg-white/5">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
        ${badgeEl}
      </div>
      <h3 class="text-2xl font-bold">${p.name}</h3>
      <p class="text-gray-400 text-sm mt-2">${p.description}</p>
      <div class="flex justify-between items-center mt-6">
        <span class="text-2xl font-bold text-yellow-500">$${p.price.toFixed(2)}</span>
        <button class="bg-white text-black p-3 rounded-xl hover:bg-yellow-500 transition-colors">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    `;
    const addBtn = card.querySelector('button');
    addBtn.onclick = () => addToCart(p.name, p.price);
    menuGrid.appendChild(card);
  });
}

function updateCart() {
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.appendChild(emptyMsg);
    cartCount.innerText = '0';
    cartTotal.innerText = '$0.00';
    return;
  }

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    const el = document.createElement('div');
    el.className = 'glass p-4 rounded-2xl flex justify-between items-center';
    el.innerHTML = `
      <div>
        <h4 class="font-bold">${item.name}</h4>
        <p class="text-sm text-yellow-500">$${item.price.toFixed(2)} x ${item.qty}</p>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="changeQty(${index}, -1)" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500/20">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-yellow-500/20">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(el);
  });

  cartCount.innerText = count;
  cartTotal.innerText = `$${total.toFixed(2)}`;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

function showToast(msg) {
  toast.innerText = msg;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2000);
}

function checkout() {
  if (cart.length === 0) return showToast("El carrito está vacío 👻");
  showToast("🚀 Procesando pedido...");
  setTimeout(() => {
    cart = [];
    updateCart();
    toggleCart();
    showToast("✅ ¡Pedido enviado!");
  }, 1500);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

if (menuSearch) {
  menuSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderMenu();
  });
}

renderCategories();
renderMenu();
renderPromos();
setInterval(nextPromo, 5000);
