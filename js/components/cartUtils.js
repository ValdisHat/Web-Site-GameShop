// components/CartUtils.js
export class CartUtils {
    static getCart() {
        const user = sessionStorage.getItem('currentUser');
        if (!user) {
            return [];
        }
        const currentUser = JSON.parse(user);

        return JSON.parse(localStorage.getItem(`gameStoreCart_${currentUser.id}`) || '[]');
    }

    static saveCart(cart) {
        const savedUser = sessionStorage.getItem('currentUser');

        if (!savedUser) {
            console.log('Пользователь не найден');
            return;
        }

        const currentUser = JSON.parse(savedUser);

        localStorage.setItem(`gameStoreCart_${currentUser.id}`, JSON.stringify(cart));
    }

    static addToCart(productId) {
        const cart = this.getCart();
        const existing = cart.find(item => item.id === productId);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        
        this.saveCart(cart);
        return cart;
    }



    static get(nameLocal)
    {
        return JSON.parse(localStorage.getItem(nameLocal) || '[]');
    }

    static save(nameLocal, items)
    {
        localStorage.setItem(nameLocal, JSON.stringify(items));
    }


    static updateProductsQuantity(productId, quantity = 0)
    {
        const product = this.get(`gameStoreProducts`);
        const existing = product.find(item => item.id === productId);

        existing.quantityOrders += quantity;

        this.save(`gameStoreProducts`,product);
        return product;
    }

    static popularProduct()
    {
        const product = this.get(`gameStoreProducts`);
        let maxQuantity = null;
        let maxId = null;
        product.forEach(item => {
            if (maxQuantity === null || item.quantityOrders > maxQuantity)
            {
                maxQuantity = item.quantityOrders;
                maxId = item.id;
            } 
        });
        return product.find(item => item.id === maxId);
    }





    static updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const index = cart.findIndex(item => item.id === productId);
        
        if (index !== -1) {
            if (quantity <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = quantity;
            }
            this.saveCart(cart);
        }
        return cart;
    }

    static removeFromCart(productId) {
        const cart = this.getCart();
        const index = cart.findIndex(item => item.id === productId);
        
        if (index !== -1) {
            cart.splice(index, 1);
            this.saveCart(cart);
        }
        return cart;
    }

    static clearCart() {
        const user = sessionStorage.getItem('currentUser');
        if (!user) {
            return [];
        }
        const currentUser = JSON.parse(user);

        localStorage.removeItem(`gameStoreCart_${currentUser.id}`);
        return [];
    }
}