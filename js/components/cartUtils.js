export class CartUtils {
    static getCart() {
        const savedCart = localStorage.getItem('gameshop_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    static saveCart(cart) {
        localStorage.setItem('gameshop_cart', JSON.stringify(cart));
    }

    static addToCart(productId) {
        const cart = this.getCart();

        const existingItem = cart.find((item) => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                quantity: 1
            });
        }

        this.saveCart(cart);
    }
}