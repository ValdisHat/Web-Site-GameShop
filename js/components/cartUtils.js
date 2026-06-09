// js/components/cartUtils.js
import { products } from '../data/products.js';

export class CartUtils {
    static getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
    }

    static addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === productId);
        
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        // Рассчитываем цену со скидкой
        const finalPrice = this.getDiscountedPrice(product.price, product.discount);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                title: product.title,
                price: finalPrice,
                originalPrice: product.price,
                discount: product.discount || 0,
                quantity: quantity,
                img: product.img
            });
        }
        
        this.saveCart(cart);
        this.showAddToCartNotification(product.title);
    }

    static getDiscountedPrice(price, discount) {
        if (discount && discount > 0) {
            return Math.round(price - (price * discount / 100));
        }
        return price;
    }

    static removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    }

    static updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    }

    static getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    static getCartItemCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    }

    static updateCartCount() {
        const count = this.getCartItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-block' : 'none';
        });
    }

    static showAddToCartNotification(productTitle) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="cart-notification-content">
                <span>✅ ${productTitle} добавлен в корзину!</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    static clearCart() {
        localStorage.removeItem('cart');
        this.updateCartCount();
    }
}