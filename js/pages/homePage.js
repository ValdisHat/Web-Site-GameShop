// js/pages/homePage.js
import { BasePage } from './basePage.js';
import { getProducts, deleteProduct } from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';
import { getCurrentUser } from '../data/accounts.js';

export class HomePage extends BasePage {
    constructor() {
        super();
        
        this.mainContent = document.getElementById('main-content');
        this.catalogContainer = document.getElementById('select-container');
        
        if (!this.catalogContainer) {
            this.catalogContainer = document.createElement('div');
            this.catalogContainer.id = 'select-container';
            if (this.mainContent) {
                this.mainContent.appendChild(this.catalogContainer);
            }
        }
        
        this.catalogContainer.style.display = 'none';
        
        this.products = [];
        this.filteredProducts = [];
        this.currentFilter = 'all';
        this.currentPlatform = 'all';
        this.currentSort = 'default';
        this.isCatalogVisible = false;
        this.currentUser = null;
        
        this.bindEvents();
    }

    init() {
        super.init();
        this.currentUser = getCurrentUser();
        this.products = getProducts();
        this.filteredProducts = [...this.products];
        this.renderHome();
        this.checkURLParams();
        console.log('✅ Главная страница запущена');
    }

    bindEvents() {
        window.addEventListener('popstate', () => {
            this.checkURLParams();
        });
    }

    checkURLParams() {
        const params = new URLSearchParams(window.location.search);
        const showCatalog = params.get('catalog') === 'true';
        const filterParam = params.get('filter');
        const platformParam = params.get('platform');
        const sortParam = params.get('sort');
        
        if (filterParam) this.currentFilter = filterParam;
        if (platformParam) this.currentPlatform = platformParam;
        if (sortParam) this.currentSort = sortParam;
        
        this.applyFilters();
        
        if (showCatalog) {
            this.showCatalog();
        } else {
            this.hideCatalog();
        }
    }

    renderHome() {
        if (!this.mainContent) return;
        
        const children = this.mainContent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].id !== 'select-container') {
                children[i].remove();
            }
        }

        this.products.forEach(product => {
            const card = this.createProductCard(product, true);
            this.mainContent.appendChild(card);
        });
    }

    showCatalog() {
        this.isCatalogVisible = true;
        
        const children = this.mainContent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].id !== 'select-container') {
                children[i].remove();
            }
        }
        
        this.catalogContainer.style.display = 'block';
        this.catalogContainer.innerHTML = '';
        this.renderCatalogContent();
        this.renderCatalogCards();
    }

    hideCatalog() {
        this.isCatalogVisible = false;
        this.catalogContainer.style.display = 'none';
        this.catalogContainer.innerHTML = '';
        this.renderHome();
        window.history.pushState({}, '', '?');
    }

    renderCatalogContent() {
        const title = document.createElement('h1');
        title.className = 'catalog-title';
        title.textContent = 'Каталог игр';
        this.catalogContainer.appendChild(title);

        const filters = this.createFilters();
        this.catalogContainer.appendChild(filters);

        const resultInfo = document.createElement('div');
        resultInfo.className = 'catalog-result-info';
        resultInfo.textContent = `Найдено: ${this.filteredProducts.length} товаров`;
        this.catalogContainer.appendChild(resultInfo);
    }

    renderCatalogCards() {
        const children = this.mainContent.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].id !== 'select-container') {
                children[i].remove();
            }
        }
        
        this.filteredProducts.forEach(product => {
            const card = this.createProductCard(product, true);
            this.mainContent.appendChild(card);
        });
    }

    createFilters() {
        const container = document.createElement('div');
        container.className = 'catalog-filters';

        const row1 = document.createElement('div');
        row1.className = 'filter-row';

        const label1 = document.createElement('span');
        label1.className = 'filter-label';
        label1.textContent = '📂 Жанры:';
        row1.appendChild(label1);

        const genres = ['all', ...new Set(this.products.map(p => p.genre))];

        genres.forEach(genre => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${this.currentFilter === genre ? 'active' : ''}`;
            btn.textContent = genre === 'all' ? 'Все' : genre;
            btn.dataset.filter = genre;
            btn.addEventListener('click', () => {
                this.currentFilter = genre;
                this.applyFiltersAndUpdateCatalog();
            });
            row1.appendChild(btn);
        });

        container.appendChild(row1);

        const row2 = document.createElement('div');
        row2.className = 'filter-row';

        const label2 = document.createElement('span');
        label2.className = 'filter-label';
        label2.textContent = '💻 Платформа:';
        row2.appendChild(label2);

        const platforms = ['all', ...new Set(this.products.map(p => p.platform))];

        platforms.forEach(platform => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${this.currentPlatform === platform ? 'active' : ''}`;
            btn.textContent = platform === 'all' ? 'Все' : platform;
            btn.dataset.platform = platform;
            btn.addEventListener('click', () => {
                this.currentPlatform = platform;
                this.applyFiltersAndUpdateCatalog();
            });
            row2.appendChild(btn);
        });

        const divider = document.createElement('span');
        divider.className = 'filter-divider';
        divider.textContent = '|';
        row2.appendChild(divider);

        const label3 = document.createElement('span');
        label3.className = 'filter-label';
        label3.textContent = '📊 Сортировка:';
        row2.appendChild(label3);

        const sorts = [
            { value: 'default', label: 'По умолчанию' },
            { value: 'popular', label: '⭐ По популярности' },
            { value: 'price-asc', label: '💰 По возрастанию' },
            { value: 'price-desc', label: '💰 По убыванию' },
            { value: 'name', label: '📝 По названию' }
        ];

        sorts.forEach(sort => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${this.currentSort === sort.value ? 'active' : ''}`;
            btn.textContent = sort.label;
            btn.dataset.sort = sort.value;
            btn.addEventListener('click', () => {
                this.currentSort = sort.value;
                this.applyFiltersAndUpdateCatalog();
            });
            row2.appendChild(btn);
        });

        container.appendChild(row2);

        return container;
    }

    applyFilters() {
        let filtered = [...this.products];

        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(p => p.genre === this.currentFilter);
        }

        if (this.currentPlatform !== 'all') {
            filtered = filtered.filter(p => p.platform === this.currentPlatform);
        }

        switch (this.currentSort) {
            case 'popular':
                filtered.sort((a, b) => (b.quantityOrders || 0) - (a.quantityOrders || 0));
                break;
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                filtered.sort((a, b) => a.id - b.id);
                break;
        }

        this.filteredProducts = filtered;
    }

    applyFiltersAndUpdateCatalog() {
        this.applyFilters();
        
        if (this.isCatalogVisible) {
            this.catalogContainer.innerHTML = '';
            this.renderCatalogContent();
            this.updateActiveButtons();
            this.renderCatalogCards();
        }
        
        const params = new URLSearchParams();
        params.set('catalog', 'true');
        if (this.currentFilter !== 'all') params.set('filter', this.currentFilter);
        if (this.currentPlatform !== 'all') params.set('platform', this.currentPlatform);
        if (this.currentSort !== 'default') params.set('sort', this.currentSort);
        window.history.pushState({}, '', `?${params.toString()}`);
    }

    updateActiveButtons() {
        const filterBtns = this.catalogContainer.querySelectorAll('[data-filter]');
        filterBtns.forEach(btn => {
            btn.className = `filter-btn ${btn.dataset.filter === this.currentFilter ? 'active' : ''}`;
        });

        const platformBtns = this.catalogContainer.querySelectorAll('[data-platform]');
        platformBtns.forEach(btn => {
            btn.className = `filter-btn ${btn.dataset.platform === this.currentPlatform ? 'active' : ''}`;
        });

        const sortBtns = this.catalogContainer.querySelectorAll('[data-sort]');
        sortBtns.forEach(btn => {
            btn.className = `filter-btn ${btn.dataset.sort === this.currentSort ? 'active' : ''}`;
        });
    }

    createProductCard(product, showAddButton = true) {
        const card = document.createElement('div');
        card.className = 'product-card';

        const link = document.createElement('a');
        link.href = `product.html?id=${product.id}`;

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'product-card__image-wrapper';

        const img = document.createElement('img');
        img.className = 'product-image';
        img.src = product.img;
        img.alt = product.title;
        img.onerror = function() {
            this.src = '../img/placeholder.jpg';
        };
        imgWrapper.appendChild(img);

        if (product.discount > 0) {
            const badge = document.createElement('span');
            badge.className = 'discount-badge';
            badge.textContent = `-${product.discount}%`;
            imgWrapper.appendChild(badge);
        }

        link.appendChild(imgWrapper);

        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.title;
        link.appendChild(title);

        const priceDiv = document.createElement('div');
        priceDiv.className = 'price-row';

        if (product.discount > 0) {
            const old = document.createElement('span');
            old.className = 'old-price';
            old.textContent = `${product.price} ₽`;
            priceDiv.appendChild(old);

            const newPrice = document.createElement('span');
            newPrice.className = 'new-price';
            newPrice.textContent = `${Math.round(product.price - (product.price * product.discount / 100))} ₽`;
            priceDiv.appendChild(newPrice);

            const badge = document.createElement('span');
            badge.className = 'discount-badge-small';
            badge.textContent = `${product.discount}%`;
            priceDiv.appendChild(badge);
        } else {
            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = `${product.price} ₽`;
            priceDiv.appendChild(price);
        }

        link.appendChild(priceDiv);

        const meta = document.createElement('div');
        meta.className = 'product-meta';
        
        const genre = document.createElement('span');
        genre.className = 'product-genre-small';
        genre.textContent = `🎮 ${product.genre}`;
        meta.appendChild(genre);

        const platform = document.createElement('span');
        platform.className = 'product-platform-small';
        platform.textContent = `💻 ${product.platform}`;
        meta.appendChild(platform);

        link.appendChild(meta);
        card.appendChild(link);

        if (showAddButton) {
            const addBtn = document.createElement('button');
            addBtn.className = 'add-to-cart-button';
            addBtn.textContent = '🛒 Добавить в корзину';
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                CartUtils.addToCart(product.id, 1);
                this.showNotification(`${product.title} добавлен в корзину!`);
            });
            card.appendChild(addBtn);
        }

        // ===== КНОПКА УДАЛЕНИЯ (ТОЛЬКО ДЛЯ АДМИНА) =====
        if (this.currentUser && this.currentUser.status === 'admin') {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-product-btn';
            deleteBtn.textContent = '🗑️ Удалить товар';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                if (confirm(`Вы уверены, что хотите удалить "${product.title}"?`)) {
                    deleteProduct(product.id);
                    this.products = getProducts();
                    this.filteredProducts = [...this.products];
                    this.applyFilters();
                    
                    // Обновляем отображение
                    if (this.isCatalogVisible) {
                        this.catalogContainer.innerHTML = '';
                        this.renderCatalogContent();
                        this.renderCatalogCards();
                    } else {
                        this.renderHome();
                    }
                    
                    this.showNotification(`"${product.title}" удален!`);
                }
            });
            card.appendChild(deleteBtn);
        }

        return card;
    }

    showNotification(message) {
        const old = document.querySelector('.catalog-notification');
        if (old) old.remove();

        const notification = document.createElement('div');
        notification.className = 'catalog-notification';
        notification.textContent = `✅ ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}