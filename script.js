let products = [];
let currentFilter = 'all';
let searchQuery = '';

const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');

const categoryLabels = { phone: 'Смартфон', laptop: 'Ноутбук', accessory: 'Аксессуар' };


async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        render();
    } catch (error) {
        console.error("Ma'lumot yuklashda xatolik:", error);
        productsGrid.innerHTML = '<div class="empty-state"><p>Ошибка загрузки данных</p></div>';
    }
}

function getFiltered() {
    return products.filter(p => {
        const matchCat = currentFilter === 'all' || p.category === currentFilter;
        const matchSearch = p.name.toLowerCase().includes(searchQuery) || 
                          p.desc.toLowerCase().includes(searchQuery);
        return matchCat && matchSearch;
    });
}

function render() {
    const list = getFiltered();
    productsGrid.innerHTML = '';

    if (!list.length) {
        productsGrid.innerHTML = '<div class="empty-state"><i class="fa-solid fa-box-open"></i><p>Товары не найдены</p></div>';
        return;
    }

    list.forEach((p, i) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.style.animationDelay = (i * 0.06) + 's';
        card.innerHTML = `
          <div class="product-img-wrap">
            <img class="product-img" src="${p.img}" alt="${p.name}" loading="lazy">
            <span class="product-category-tag">${categoryLabels[p.category]}</span>
          </div>
          <div class="product-info">
            <div class="product-name">${p.name}</div>
            <div class="product-desc">${p.desc}</div>
            <div class="product-price">${(p.price / 1000).toFixed(0)}K <span>сум</span></div>
          </div>`;
        productsGrid.appendChild(card);
    });
}


searchInput.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    render();
});


filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeToggle.innerHTML = dark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
});

// Dastlabki yuklash
const savedTheme = localStorage.getItem('theme');
const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme ? savedTheme === 'dark' : preferDark);

fetchProducts();