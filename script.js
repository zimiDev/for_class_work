let products = [];
const tags = { phone: 'Смартфон', laptop: 'Ноутбук', accessory: 'Аксессуар' };
let filter = 'all';
let query = '';

const grid = document.getElementById('grid');
const searchInput = document.getElementById('searchInput');
const fbtns = document.querySelectorAll('.fbtn');

// JSON fayldan mahsulotlarni yuklab olish
async function fetchProducts() {
  try {
    const res = await fetch('products.json');
    products = await res.json();
    render();
  } catch (err) {
    console.error("Xatolik:", err);
    grid.innerHTML = '<div class="empty">Ошибка загрузки данных</div>';
  }
}

function render() {
  const list = products.filter(p => {
    const ok = filter === 'all' || p.cat === filter;
    const s = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    return ok && s;
  });

  if (!list.length) {
    grid.innerHTML = '<div class="empty">Ничего не найдено</div>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <div class="card-tag">${tags[p.cat]}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-price">${(p.price / 1000).toFixed(0)}K сум</div>
        <div class="card-btns">
          <button>Details</button>
          <button class="btn-add">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

fbtns.forEach(b => b.addEventListener('click', () => {
  fbtns.forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  filter = b.dataset.f;
  render();
}));

searchInput.addEventListener('input', e => {
  query = e.target.value.toLowerCase().trim();
  render();
});

// Loyihani ishga tushirish
fetchProducts();
