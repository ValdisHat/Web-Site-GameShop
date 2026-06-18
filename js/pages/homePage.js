// homePage.js
import { BasePage } from './basePage.js';
import { getProducts, deleteProduct } from '../data/products.js';
import { Search } from '../components/search.js';
import { ProductFilter } from '../components/productFilter.js';
import { CartUtils } from '../components/cartUtils.js';

export class HomePage extends BasePage {
   
    constructor() {
        super();
        this.productsContainer = document.querySelector('#main-content');
        this.products = [];
        this.isAdmin = false;
    }

    
    init() {
        super.init();

        // Проверяем статус администратора
        this.checkAdminStatus();

        // Загружаем актуальные товары из localStorage
        this.products = getProducts();

        const searchQuery = this.getSearchQueryFromUrl();

        if (searchQuery) {
            const filteredProducts = ProductFilter.filter(this.products, searchQuery);
            this.renderProducts(filteredProducts);
        } else {
            this.renderProducts(this.products);
        }

        // Инициализируем поиск
        this.initSearch();
    }

    checkAdminStatus() {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.isAdmin = user.status === 'admin';
        }
    }

    renderProducts(productsArray) {
        if (!this.productsContainer) {
            console.error('Контейнер .products не найден');
            return;
        }

        // Очищаем контейнер
        this.productsContainer.innerHTML = '';

        if (productsArray.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'products__empty';
            emptyMessage.textContent = 'Ничего не найдено';
            this.productsContainer.appendChild(emptyMessage);
            return;
        }

        productsArray.forEach((product) => {
            const card = this.createProductCard(product);
            this.productsContainer.appendChild(card);
        });

        this.addCartButtonsListeners();
        this.addDeleteButtonsListeners();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;

        // Создаем ссылку
        const link = document.createElement('a');
        link.href = `product.html?id=${product.id}`;

        // Создаем обертку для изображения
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-card__image-wrapper';

        // Создаем изображение
        const img = document.createElement('img');
        img.className = 'product-image';
        img.src = product.img;
        img.alt = product.title;
        img.loading = 'lazy';
        imageWrapper.appendChild(img);

        link.appendChild(imageWrapper);

        // Контейнер для информации о товаре
        const infoContainer = document.createElement('div');
        infoContainer.className = 'product-info-container';

        // Создаем заголовок
        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = product.title;
        infoContainer.appendChild(title);

        // Создаем жанр
        const genre = document.createElement('p');
        genre.className = 'product-genre';
        genre.textContent = product.genre;
        infoContainer.appendChild(genre);

        // Создаем блок с ценой
        const priceBlock = document.createElement('div');
        priceBlock.className = 'product-price';

        const hasDiscount = product.discount && product.discount > 0;

        if (hasDiscount) {
            const discountedPrice = this.getDiscountedPrice(product.price, product.discount);
            
            const priceRow = document.createElement('div');
            priceRow.className = 'price-row';
            
            const priceLabel = document.createElement('span');
            priceLabel.className = 'price-label';
            priceLabel.textContent = 'Цена:';
            priceRow.appendChild(priceLabel);
            
            const oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';
            oldPrice.textContent = `${product.price}`;
            priceRow.appendChild(oldPrice);

            const newPrice = document.createElement('span');
            newPrice.className = 'new-price';
            newPrice.textContent = `${discountedPrice} ₽`;
            priceRow.appendChild(newPrice);

            const discountBadgeSmall = document.createElement('span');
            discountBadgeSmall.className = 'discount-badge-small';
            discountBadgeSmall.textContent = `${product.discount}%`;
            priceRow.appendChild(discountBadgeSmall);

            priceBlock.appendChild(priceRow);
        } else {
            const priceRow = document.createElement('div');
            priceRow.className = 'price-row';
            
            const priceLabel = document.createElement('span');
            priceLabel.className = 'price-label';
            priceLabel.textContent = 'Цена:';
            priceRow.appendChild(priceLabel);
            
            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = `${product.price} ₽`;
            priceRow.appendChild(price);
            
            priceBlock.appendChild(priceRow);
        }

        infoContainer.appendChild(priceBlock);
        link.appendChild(infoContainer);
        card.appendChild(link);

        // Кнопка "Добавить в корзину"
        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart-button';
        addButton.dataset.id = product.id;
        addButton.textContent = 'Добавить в корзину';
        card.appendChild(addButton);

        // Кнопка удаления (только для администратора)
        if (this.isAdmin) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-product-btn';
            deleteButton.dataset.id = product.id;
            deleteButton.textContent = '🗑️ Удалить товар';
            card.appendChild(deleteButton);
        }

        return card;
    }

    getDiscountedPrice(price, discount) {
        if (discount && discount > 0) {
            return Math.round(price - (price * discount / 100));
        }
        return price;
    }

    addCartButtonsListeners() {
        document.querySelectorAll('.add-to-cart-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const productId = Number(button.dataset.id);

                CartUtils.addToCart(productId);

                button.textContent = '✅ Добавлено';
                button.style.backgroundColor = 'rgb(115, 179, 73)';
                
                setTimeout(() => {
                    button.textContent = 'Добавить в корзину';
                    button.style.backgroundColor = '';
                }, 2000);
            });
        });
    }

    addDeleteButtonsListeners() {
        document.querySelectorAll('.delete-product-btn').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const productId = Number(button.dataset.id);
                const product = this.products.find(p => p.id === productId);
                
                if (confirm(`Вы уверены, что хотите удалить товар "${product?.title || 'Товар'}"?`)) {
                    // Удаляем товар
                    deleteProduct(productId);
                    
                    // Обновляем список товаров
                    this.products = getProducts();
                    this.renderProducts(this.products);
                    
                    // Показываем уведомление
                    this.showNotification('✅ Товар успешно удален!', 'success');
                }
            });
        });
    }

    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.product-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `product-notification ${type}`;
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        content.textContent = message;
        
        notification.appendChild(content);
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.5s ease;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.cssText += `
                animation: slideOutRight 0.5s ease forwards;
            `;
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    initSearch() {
        const search = new Search({
            inputSelector: '.search-input',
            suggestionsSelector: '.search-suggestions',
            products: this.products,
            onSearch: (filteredProducts) => {
                this.renderProducts(filteredProducts);
            }
        });

        search.init();
    }

    getSearchQueryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('search') || '';
    }
}