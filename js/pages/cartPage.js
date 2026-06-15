import { BasePage } from './basePage.js';
import { products } from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';
import { productCardInCart } from '../components/product-card-in-cart.js'

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

        const cartProducts = this.getCartProducts();
        const total = this.getTotal();
        const totalItems = this.getTotalItems();

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
                
                const orders = this.getSavedOrders();
                
                const newOrder = {
                    id: Date.now(),
                    date: new Date().toLocaleString(),
                    items: this.cart.map(item => ({ 
                        id: Number(item.id), 
                        quantity: item.quantity 
                    })),
                    total: total,
                    totalItems: totalItems
                };
                
                orders.unshift(newOrder);
                localStorage.setItem('gameShopOrders', JSON.stringify(orders));
                
                window.dispatchEvent(new CustomEvent('orderCreated', { detail: newOrder }));
                
                this.clearCart();
            });
        }
    }

    getSavedOrders() {
        const savedOrders = localStorage.getItem('gameShopOrders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    }


    renderEmptyCart() {

        const div = document.createElement("div");
        div.className = "empty-cart";

        const h2 = document.createElement("h2");
        h2.textContent = "🛒 Корзина пуста";

        const a = document.createElement("a");
        a.className = "continue-shopping";
        a.href = "./Home.html";
        a.textContent = "В магазин";

        div.appendChild(h2);
        div.appendChild(a);

        return div;
    }

    renderCartItems() {
        const cartProducts = this.getCartProducts();
        const totalItems = this.getTotalItems();

        const h1 = document.createElement("h1");
        h1.className = "cart-title";
        h1.textContent = "Моя корзина"
        
        const cart_grid = document.createElement("div");
        cart_grid.className = "cart-grid";

        const cardRender = new productCardInCart();

        cartProducts.forEach(item => {
            cart_grid.appendChild(cardRender.renderCardInCart(item));
        });

        const cart_summary = document.createElement("div");
        cart_summary.className = "cart-summary";

        const summary_content = document.createElement("div");
        summary_content.className = "summary-content";

        const total_items = document.createElement("div");
        total_items.className = "total-items";
        total_items.innerHTML = `Количество товаров:
                        <span>${totalItems}</span>`
        
        const total_amount = document.createElement("div");
        total_amount.className = "total-amount";
        total_amount.innerHTML = `Общая сумма:
                        <span>${this.getTotal().toLocaleString()} ₽</span>`;
        
        const button = document.createElement("button");
        button.className = "checkout-btn";
        button.id = "checkout-button";
        button.textContent = "Оформить заказ";

        summary_content.appendChild(total_items);
        summary_content.appendChild(total_amount);
        summary_content.appendChild(button);

        cart_summary.appendChild(summary_content);

        return [h1,cart_grid,cart_summary];
    }
    

    render() {
        if (!this.container) {
            console.error('cart-page-container не найден');
            return;
        }

        this.container.innerHTML = ""

        if (this.cart.length === 0) {
            this.container.appendChild(this.renderEmptyCart());
            return;
        }

       
        
        const cartItems = this.renderCartItems();

        cartItems.forEach(Item => {
            this.container.appendChild(Item);
        });
        
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