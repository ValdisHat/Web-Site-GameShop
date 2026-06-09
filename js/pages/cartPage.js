import { BasePage } from './basePage.js';
import { products } from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';

class CartManager {
    constructor() {
        this.cart = CartUtils.getCart();

        this.container = document.getElementById('cart-page-container');
        this.modalContainer = document.getElementById('modal-container');

        this.render();
    }

    refreshCart() {
        this.cart = CartUtils.getCart();
    }

    getCartProducts() {
        return this.cart
            .map((cartItem) => {
                const product = products.find((product) => {
                    return Number(product.id) === Number(cartItem.id);
                });

                if (!product) {
                    console.warn('Товар не найден в products.js:', cartItem);
                    return null;
                }

                return {
                    ...product,
                    quantity: cartItem.quantity
                };
            })
            .filter((item) => item !== null);
    }

    updateQuantity(productId, delta) {
        CartUtils.updateQuantity(productId, delta);
        this.refreshCart();
        this.render();
    }

    removeItem(productId) {
        CartUtils.removeFromCart(productId);
        this.refreshCart();
        this.render();
    }

    clearCart() {
        CartUtils.clearCart();
        this.refreshCart();
        this.render();
    }

    getTotal() {
        const cartProducts = this.getCartProducts();

        return cartProducts.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);
    }

    getTotalItems() {
        return this.cart.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);
    }

    showModal() {
        if (!this.modalContainer) {
            console.error('modal-container не найден');
            return;
        }

        const modalHTML = `
            <div id="order-modal" class="modal">
                <div class="modal-content">
                    <h3>✅ Заказ оформлен!</h3>
                    <p>Спасибо за покупку!</p>

                    <button class="modal-close" id="modal-close-btn">
                        Закрыть
                    </button>
                </div>
            </div>
        `;

        this.modalContainer.innerHTML = modalHTML;

        const modal = document.getElementById('order-modal');
        const closeBtn = document.getElementById('modal-close-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (modal) {
                    modal.remove();
                }

                this.clearCart();
            });
        }
    }

    renderEmptyCart() {
        return `
            <div class="empty-cart">
                <h2>🛒 Корзина пуста</h2>

                <a href="./Home.html" class="continue-shopping">
                    В магазин
                </a>
            </div>
        `;
    }

    renderCartItems() {
        const cartProducts = this.getCartProducts();
        const totalItems = this.getTotalItems();

        return `
            <h1 class="cart-title">Моя корзина</h1>

            <div class="cart-grid">
                ${cartProducts.map((item) => `
                    <div class="cart-item" data-id="${item.id}">
                        <a href="./product.html?id=${item.id}" class="cart-item-image-link">
                            <img 
                                src="${item.img}" 
                                alt="${item.title}" 
                                class="cart-item-image"
                                onerror="this.src='./img/LogoForSite.png'"
                            >
                        </a>

                        <div class="cart-item-info">
                            <a href="./product.html?id=${item.id}" class="cart-item-title-link">
                                <h3 class="cart-item-title">
                                    ${item.title}
                                </h3>
                            </a>

                            <div class="cart-item-price">
                                ${item.price.toLocaleString()} ₽
                            </div>

                            <div class="quantity-control">
                                <button class="minus" data-id="${item.id}">
                                    -
                                </button>

                                <span class="quantity-value">
                                    ${item.quantity}
                                </span>

                                <button class="plus" data-id="${item.id}">
                                    +
                                </button>
                            </div>

                            <div class="item-total">
                                <strong>Итого:</strong>
                                ${(item.price * item.quantity).toLocaleString()} ₽
                            </div>

                            <button class="remove-btn" data-id="${item.id}">
                                🗑 Удалить
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="cart-summary">
                <div class="summary-content">
                    <div class="total-items">
                        Количество товаров:
                        <span>${totalItems}</span>
                    </div>

                    <div class="total-amount">
                        Общая сумма:
                        <span>${this.getTotal().toLocaleString()} ₽</span>
                    </div>

                    <button id="checkout-button" class="checkout-btn">
                        Оформить заказ
                    </button>
                </div>
            </div>
        `;
    }

    render() {
        if (!this.container) {
            console.error('cart-page-container не найден');
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
        document.querySelectorAll('.minus').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                this.updateQuantity(id, -1);
            });
        });

        document.querySelectorAll('.plus').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                this.updateQuantity(id, 1);
            });
        });

        document.querySelectorAll('.remove-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                this.removeItem(id);
            });
        });

        const checkoutBtn = document.getElementById('checkout-button');

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.showModal();
            });
        }
    }
}

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