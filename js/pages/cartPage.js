import { BasePage } from './basePage.js';

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.container = document.getElementById('cart-page-container');
        this.modalContainer = document.getElementById('modal-container');
        this.render();
    }
    
    loadCart() {
        const savedCart = localStorage.getItem('gameshop_cart');
        if (savedCart) {
            return JSON.parse(savedCart);
        }
        // Пример данных для демонстрации
        return [
            { id: 1, name: 'Cyberpunk 2077', price: 2999, image: '../img/boxNT.png', quantity: 1 },
            { id: 2, name: 'The Witcher 3', price: 1499, image: '../img/boxNT_Hover.png', quantity: 2 },
            { id: 3, name: 'Elden Ring', price: 3499, image: '../img/LogoForSite.png', quantity: 1 }
        ];
    }
    
    saveCart() {
        localStorage.setItem('gameshop_cart', JSON.stringify(this.cart));
    }
    
    updateQuantity(productId, delta) {
        const item = this.cart.find(i => i.id === productId);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
            this.render();
        }
    }
    
    removeItem(productId) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.saveCart();
        this.render();
    }
    
    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    showModal() {
        const modalHTML = `
            <div id="order-modal" class="modal">
                <div class="modal-content">
                    <h3>✅ Заказ оформлен!</h3>
                    <p>Спасибо за покупку!</p>
                    <button class="modal-close" id="modal-close-btn">Закрыть</button>
                </div>
            </div>
        `;
        
        this.modalContainer.innerHTML = modalHTML;
        
        const modal = document.getElementById('order-modal');
        const closeBtn = document.getElementById('modal-close-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.remove();
                this.cart = [];
                this.saveCart();
                this.render();
            });
        }
    }
    
    renderEmptyCart() {
        return `
            <div class="empty-cart">
                <h2>🛒 Корзина пуста</h2>
                <a href="Home.html" class="continue-shopping">В магазин</a>
            </div>
        `;
    }
    
    renderCartItems() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        return `
            <h1 class="cart-title">Моя корзина</h1>
            
            <div class="cart-grid">
                ${this.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image" 
                             onerror="this.src='../img/LogoForSite.png'">
                        <div class="cart-item-info">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                            
                            <div class="quantity-control">
                                <button class="minus" data-id="${item.id}">-</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="plus" data-id="${item.id}">+</button>
                            </div>
                            
                            <div class="item-total">
                                <strong>Итого:</strong> ${(item.price * item.quantity).toLocaleString()} ₽
                            </div>
                            
                            <button class="remove-btn" data-id="${item.id}">🗑 Удалить</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="cart-summary">
                <div class="summary-content">
                    <div class="total-amount">
                        Общая сумма: <span>${this.getTotal().toLocaleString()} ₽</span>
                    </div>
                    <button id="checkout-button" class="checkout-btn">Оформить заказ</button>
                </div>
            </div>
        `;
    }
    
    render() {
        if (!this.container) {
            console.error('Container not found');
            return;
        }
        
        if (this.cart.length === 0) {
            this.container.innerHTML = this.renderEmptyCart();
            return;
        }
        
        this.container.innerHTML = this.renderCartItems();
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Минус
        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.updateQuantity(id, -1);
            });
        });
        
        // Плюс
        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.updateQuantity(id, 1);
            });
        });
        
        // Удалить
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.removeItem(id);
            });
        });
        
        // Оформить заказ
        const checkoutBtn = document.getElementById('checkout-button');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.showModal();
            });
        }
    }
}

// Экспорт класса CartPage
export class CartPage extends BasePage {
    constructor() {
        super();
        this.cartManager = null;
    }
    
    init() {
        super.init();
        setTimeout(() => {
            this.cartManager = new CartManager();
        }, 100);
    }
}
