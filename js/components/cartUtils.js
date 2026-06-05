export class CartUtils {
    static storageKey = 'gameshop_cart';

    static getCart() {
        const savedCart = localStorage.getItem(this.storageKey);
        return savedCart ? JSON.parse(savedCart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
    }

    static addToCart(productId) {
        const id = Number(productId);

        if (!Number.isFinite(id)) {
            console.error('Некорректный id товара:', productId);
            return;
        }

        const cart = this.getCart();
        const existingItem = cart.find((item) => Number(item.id) === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                quantity: 1
            });
        }

        this.saveCart(cart);
    }

    static removeFromCart(productId) {
        const id = Number(productId);

        const cart = this.getCart().filter((item) => {
            return Number(item.id) !== id;
        });

        this.saveCart(cart);

        return cart;
    }

    static updateQuantity(productId, delta) {
        const id = Number(productId);
        const cart = this.getCart();

        const item = cart.find((item) => Number(item.id) === id);

        if (!item) {
            return cart;
        }

        item.quantity += delta;

        const updatedCart = cart.filter((item) => item.quantity > 0);

        this.saveCart(updatedCart);

        return updatedCart;
    }

    static clearCart() {
        this.saveCart([]);
    }
}