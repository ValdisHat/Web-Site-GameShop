// js/pages/productPage.js
import { BasePage } from './basePage.js';
import { products } from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';

export class ProductPage extends BasePage {
    constructor() {
        super();
        this.productContainer = 'product-container';
        this.isAdmin = false;
        this.currentProduct = null;
        this.isEditing = false;
    }
    
    init() {
        super.init();
        this.checkAdminStatus();
        this.renderProduct();
        this.addCartButtonListener();
        console.log('Страница товара запущена');
    }

    checkAdminStatus() {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.isAdmin = user.status === 'admin';
        }
    }

    renderProduct() {
        const productId = this.getProductIdFromUrl();
        const product = products.find((item) => item.id === productId);
        this.currentProduct = product;

        const container = document.getElementById(this.productContainer);

        if (!container) {
            console.error('Контейнер product-container не найден');
            const mainContainer = document.getElementById('product-main-container');
            if (mainContainer && !container) {
                const newContainer = document.createElement('div');
                newContainer.id = 'product-container';
                mainContainer.appendChild(newContainer);
                this.renderProduct();
            }
            return;
        }

        if (!product) {
            container.innerHTML = `
                <section class="product-page">
                    <h1>Товар не найден</h1>
                    <a href="./Home.html" class="continue-shopping">Вернуться на главную</a>
                </section>
            `;
            return;
        }

        if (this.isAdmin && this.isEditing) {
            this.renderEditForm(container, product);
        } else {
            this.renderProductView(container, product);
        }
    }

    getDiscountedPrice(price, discount) {
        if (discount && discount > 0) {
            return price - (price * discount / 100);
        }
        return price;
    }

    renderProductView(container, product) {
        const hasDiscount = product.discount && product.discount > 0;
        const discountedPrice = this.getDiscountedPrice(product.price, product.discount);
        
        // Формируем отображение цены со скидкой
        let priceHtml = '';
        if (hasDiscount) {
            priceHtml = `
                <li>💰 Цена: 
                    <span style="text-decoration: line-through; color: var(--color-text-secondary);">${product.price} ₽</span>
                    <span style="color: var(--color-brand); font-weight: bold; font-size: 1.2em;"> ${discountedPrice} ₽</span>
                    <span style="color: var(--color-success); background: rgba(168, 179, 75, 0.2); padding: 2px 8px; border-radius: 20px; margin-left: 8px;"> -${product.discount}% </span>
                </li>
            `;
        } else {
            priceHtml = `<li>💰 Цена: <span style="font-weight: bold; font-size: 1.2em;">${product.price} ₽</span></li>`;
        }

        const adminButtons = this.isAdmin ? `
            <div class="admin-actions">
                <button id="edit-product-btn" class="admin-edit-btn">✏️ Редактировать товар</button>
            </div>
        ` : '';

        container.innerHTML = `
            <section class="product-page">
                <div class="pp-img-wrap">
                    <img 
                        class="pp-img" 
                        src="${product.img || '../img/placeholder.jpg'}" 
                        alt="${product.title}"
                        onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                    >
                </div>
                <div class="pp-content">
                    <h1 class="pp-title">${product.title}</h1>

                    <div class="pp-description">
                        <p>${product.description || 'Описание отсутствует'}</p>
                    </div>

                    <ul class="pp-info">
                        <li>🎮 Жанр: ${product.genre || 'Не указан'}</li>
                        <li>💻 Платформа: ${product.platform || 'Не указана'}</li>
                        ${priceHtml}
                        ${product.releaseDate ? `<li>📅 Дата выхода: ${product.releaseDate}</li>` : ''}
                        ${product.developer ? `<li>👨‍💻 Разработчик: ${product.developer}</li>` : ''}
                    </ul>

                    <button class="pp-button add-to-cart-button" data-id="${product.id}" data-price="${hasDiscount ? discountedPrice : product.price}">
                        🛒 Добавить в корзину
                    </button>
                    
                    ${adminButtons}
                </div>
            </section>
        `;

        if (this.isAdmin) {
            const editBtn = document.getElementById('edit-product-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.isEditing = true;
                    this.renderProduct();
                });
            }
        }
    }

    renderEditForm(container, product) {
        container.innerHTML = `
            <section class="product-page edit-mode">
                <div class="pp-img-wrap">
                    <img 
                        class="pp-img" 
                        id="preview-img"
                        src="${product.img || '../img/placeholder.jpg'}" 
                        alt="${product.title}"
                        onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                    >
                </div>
                <div class="pp-content">
                    <h2>✏️ Редактирование товара</h2>
                    
                    <form id="edit-product-form" class="edit-product-form">
                        <div class="form-group">
                            <label for="edit-title">Название товара:</label>
                            <input type="text" id="edit-title" name="title" value="${this.escapeHtml(product.title)}" required>
                        </div>

                        <div class="form-group">
                            <label for="edit-description">Описание:</label>
                            <textarea id="edit-description" name="description" rows="4" required>${this.escapeHtml(product.description || '')}</textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-genre">Жанр:</label>
                                <input type="text" id="edit-genre" name="genre" value="${this.escapeHtml(product.genre || '')}">
                            </div>

                            <div class="form-group">
                                <label for="edit-platform">Платформа:</label>
                                <input type="text" id="edit-platform" name="platform" value="${this.escapeHtml(product.platform || '')}">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-price">Цена (руб.):</label>
                                <input type="number" id="edit-price" name="price" value="${product.price}" step="1" required>
                            </div>

                            <div class="form-group">
                                <label for="edit-discount">Скидка (%):</label>
                                <input type="number" id="edit-discount" name="discount" value="${product.discount || 0}" min="0" max="99" step="1">
                                <small>Оставьте 0 или пустым, если скидки нет</small>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-releaseDate">Дата выхода:</label>
                                <input type="text" id="edit-releaseDate" name="releaseDate" value="${this.escapeHtml(product.releaseDate || '')}" placeholder="Например: 2024">
                            </div>

                            <div class="form-group">
                                <label for="edit-developer">Разработчик:</label>
                                <input type="text" id="edit-developer" name="developer" value="${this.escapeHtml(product.developer || '')}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="edit-img">URL изображения:</label>
                            <input type="text" id="edit-img" name="img" value="${this.escapeHtml(product.img || '')}" placeholder="/img/game.jpg">
                            <small>Путь к изображению относительно папки html</small>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">💾 Сохранить изменения</button>
                            <button type="button" id="cancel-edit-btn" class="btn btn-secondary">❌ Отменить</button>
                        </div>
                    </form>
                </div>
            </section>
        `;

        // Добавляем предпросмотр изображения
        const imgInput = document.getElementById('edit-img');
        if (imgInput) {
            imgInput.addEventListener('input', (e) => {
                const preview = document.getElementById('preview-img');
                if (preview && e.target.value) {
                    preview.src = e.target.value;
                }
            });
        }

        const cancelBtn = document.getElementById('cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.isEditing = false;
                this.renderProduct();
            });
        }

        const form = document.getElementById('edit-product-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProductChanges();
            });
        }
    }

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    saveProductChanges() {
        const productId = this.getProductIdFromUrl();
        const productIndex = products.findIndex((item) => item.id === productId);
        
        if (productIndex !== -1) {
            const discountValue = Number(document.getElementById('edit-discount').value) || 0;
            
            // Сохраняем изменения
            products[productIndex] = {
                ...products[productIndex],
                title: document.getElementById('edit-title').value,
                description: document.getElementById('edit-description').value,
                genre: document.getElementById('edit-genre').value,
                platform: document.getElementById('edit-platform').value,
                price: Number(document.getElementById('edit-price').value),
                discount: discountValue,
                releaseDate: document.getElementById('edit-releaseDate').value,
                developer: document.getElementById('edit-developer').value,
                img: document.getElementById('edit-img').value
            };
            
            // Показываем уведомление
            this.showNotification('✅ Товар успешно обновлен!', 'success');
            
            // Выходим из режима редактирования и обновляем отображение
            this.isEditing = false;
            this.renderProduct();
            this.addCartButtonListener(); // Обновляем слушатель для кнопки
        }
    }

    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.product-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `product-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return Number(params.get('id'));
    }

    addCartButtonListener() {
        const button = document.querySelector('.add-to-cart-button');
        if (!button) return;

        // Удаляем старый слушатель, если есть
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', (e) => {
            const productId = Number(newButton.dataset.id);
            const price = Number(newButton.dataset.price);
            
            CartUtils.addToCart(productId);
            
            const originalText = newButton.textContent;
            newButton.textContent = '✓ Добавлено!';
            newButton.style.backgroundColor = 'var(--color-success)';
            
            setTimeout(() => {
                newButton.textContent = originalText;
                newButton.style.backgroundColor = '';
            }, 2000);
        });
    }
}