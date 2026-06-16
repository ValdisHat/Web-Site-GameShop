// cartPage.js
import { BasePage } from './basePage.js';
import { getProducts } from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';

export class CartPage extends BasePage {
    constructor() {
        super();
        this.container = document.getElementById('cart-page-container');
        this.cart = [];
        this.products = [];
    }

    init() {
        super.init();
        this.loadData();
        this.renderCart();
        console.log('Страница корзины запущена');
    }

    loadData() {
        this.cart = CartUtils.getCart();
        this.products = getProducts();
    }

    renderCart() {
        if (!this.container) {
            console.error('Контейнер cart-page-container не найден');
            return;
        }

        this.container.innerHTML = '';

        if (this.cart.length === 0) {
            this.renderEmptyCart();
            return;
        }

        // Заголовок
        const title = document.createElement('h1');
        title.className = 'cart-title';
        title.textContent = '🛒 Корзина';
        this.container.appendChild(title);

        // Сетка товаров
        const grid = document.createElement('div');
        grid.className = 'cart-grid';

        let total = 0;

        this.cart.forEach((cartItem) => {
            const product = this.products.find(p => p.id === cartItem.id);
            if (!product) return;

            const hasDiscount = product.discount && product.discount > 0;
            const discountedPrice = this.getDiscountedPrice(product.price, product.discount);
            const itemTotal = hasDiscount ? discountedPrice * cartItem.quantity : product.price * cartItem.quantity;
            total += itemTotal;

            const item = document.createElement('div');
            item.className = 'cart-item';

            // Изображение
            const img = document.createElement('img');
            img.className = 'cart-item-image';
            img.src = product.img;
            img.alt = product.title;
            item.appendChild(img);

            // Информация
            const info = document.createElement('div');
            info.className = 'cart-item-info';

            const titleLink = document.createElement('a');
            titleLink.className = 'cart-item-title-link';
            titleLink.href = `product.html?id=${product.id}`;
            
            const titleEl = document.createElement('h3');
            titleEl.className = 'cart-item-title';
            titleEl.textContent = product.title;
            titleLink.appendChild(titleEl);
            info.appendChild(titleLink);

            // Цена со скидкой
            const priceDiv = document.createElement('div');
            priceDiv.className = 'cart-item-price';
            
            if (hasDiscount) {
                const oldPriceSpan = document.createElement('span');
                oldPriceSpan.className = 'old-price';
                oldPriceSpan.textContent = `${product.price} ₽`;
                priceDiv.appendChild(oldPriceSpan);

                const newPriceSpan = document.createElement('span');
                newPriceSpan.className = 'new-price';
                newPriceSpan.textContent = `${discountedPrice} ₽`;
                priceDiv.appendChild(newPriceSpan);

                const discountBadge = document.createElement('span');
                discountBadge.className = 'discount-badge-small';
                discountBadge.textContent = `${product.discount}%`;
                priceDiv.appendChild(discountBadge);
            } else {
                const priceSpan = document.createElement('span');
                priceSpan.className = 'price';
                priceSpan.textContent = `${product.price} ₽`;
                priceDiv.appendChild(priceSpan);
            }
            
            info.appendChild(priceDiv);

            // Управление количеством
            const quantityControl = document.createElement('div');
            quantityControl.className = 'quantity-control';

            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.addEventListener('click', () => {
                CartUtils.updateQuantity(product.id, cartItem.quantity - 1);
                this.loadData();
                this.renderCart();
            });
            quantityControl.appendChild(minusBtn);

            const quantitySpan = document.createElement('span');
            quantitySpan.className = 'quantity-value';
            quantitySpan.textContent = cartItem.quantity;
            quantityControl.appendChild(quantitySpan);

            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.addEventListener('click', () => {
                CartUtils.updateQuantity(product.id, cartItem.quantity + 1);
                this.loadData();
                this.renderCart();
            });
            quantityControl.appendChild(plusBtn);

            info.appendChild(quantityControl);

            // Итого за товар
            const itemTotalDiv = document.createElement('div');
            itemTotalDiv.className = 'item-total';
            itemTotalDiv.textContent = `Итого: ${itemTotal} ₽`;
            info.appendChild(itemTotalDiv);

            // Кнопка удаления
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '🗑️ Удалить';
            removeBtn.addEventListener('click', () => {
                CartUtils.removeFromCart(product.id);
                this.loadData();
                this.renderCart();
            });
            info.appendChild(removeBtn);

            item.appendChild(info);
            grid.appendChild(item);
        });

        this.container.appendChild(grid);

        // Итоговая сумма
        const summary = document.createElement('div');
        summary.className = 'cart-summary';

        const summaryContent = document.createElement('div');
        summaryContent.className = 'summary-content';

        const totalDiv = document.createElement('div');
        totalDiv.className = 'total-amount';
        
        const totalText = document.createTextNode('Итого: ');
        totalDiv.appendChild(totalText);
        
        const totalSpan = document.createElement('span');
        totalSpan.textContent = `${total} ₽`;
        totalDiv.appendChild(totalSpan);
        
        summaryContent.appendChild(totalDiv);

        const checkoutBtn = document.createElement('button');
        checkoutBtn.className = 'checkout-btn';
        checkoutBtn.textContent = 'Оформить заказ';
        checkoutBtn.addEventListener('click', () => {
            this.checkout();
        });
        summaryContent.appendChild(checkoutBtn);

        summary.appendChild(summaryContent);
        this.container.appendChild(summary);
    }

    getDiscountedPrice(price, discount) {
        if (discount && discount > 0) {
            return Math.round(price - (price * discount / 100));
        }
        return price;
    }

    renderEmptyCart() {
        this.container.innerHTML = '';

        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-cart';

        const icon = document.createElement('div');
        icon.className = 'empty-cart-icon';
        icon.textContent = '🛒';
        emptyDiv.appendChild(icon);

        const title = document.createElement('h2');
        title.textContent = 'Корзина пуста';
        emptyDiv.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = 'Добавьте товары, чтобы сделать заказ';
        emptyDiv.appendChild(desc);

        const link = document.createElement('a');
        link.className = 'continue-shopping';
        link.href = 'Home.html';
        link.textContent = 'Продолжить покупки';
        emptyDiv.appendChild(link);

        this.container.appendChild(emptyDiv);
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста!', 'error');
            return;
        }

        // Получаем текущие заказы
        const orders = JSON.parse(localStorage.getItem('gameStoreOrders') || '[]');
        
        // Создаем новый заказ
        const order = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            items: this.cart.map(item => {
                const product = this.products.find(p => p.id === item.id);
                const hasDiscount = product?.discount && product.discount > 0;
                const price = hasDiscount 
                    ? this.getDiscountedPrice(product.price, product.discount) 
                    : product?.price || 0;
                return {
                    id: item.id,
                    title: product?.title || 'Товар',
                    price: price,
                    quantity: item.quantity,
                    originalPrice: product?.price || 0,
                    discount: product?.discount || 0,
                    total: price * item.quantity
                };
            }),
            total: this.cart.reduce((sum, item) => {
                const product = this.products.find(p => p.id === item.id);
                if (!product) return sum;
                const hasDiscount = product.discount && product.discount > 0;
                const price = hasDiscount ? this.getDiscountedPrice(product.price, product.discount) : product.price;
                return sum + price * item.quantity;
            }, 0),
            status: 'Ожидает обработки'
        };

        // Добавляем заказ
        orders.push(order);
        localStorage.setItem('gameStoreOrders', JSON.stringify(orders));

        // Очищаем корзину
        CartUtils.clearCart();

        // Показываем уведомление об успехе
        this.showOrderSuccess(order);

        // Обновляем данные
        this.loadData();
        this.renderCart();

        // Отправляем событие об обновлении заказов
        const event = new CustomEvent('ordersUpdated', { detail: { order } });
        document.dispatchEvent(event);
    }

    showOrderSuccess(order) {
        const modal = document.createElement('div');
        modal.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const icon = document.createElement('div');
        icon.className = 'modal-icon';
        icon.textContent = '✅';
        modalContent.appendChild(icon);

        const title = document.createElement('h3');
        title.textContent = 'Заказ оформлен!';
        modalContent.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = 'Спасибо за покупку! Ваш заказ принят.';
        modalContent.appendChild(desc);

        const orderNumber = document.createElement('div');
        orderNumber.className = 'modal-order-number';
        orderNumber.textContent = `Номер заказа: #${order.id}`;
        modalContent.appendChild(orderNumber);

        const totalP = document.createElement('p');
        totalP.textContent = `Сумма заказа: ${order.total} ₽`;
        modalContent.appendChild(totalP);

        // Кнопка "Перейти к заказам"
        const ordersBtn = document.createElement('button');
        ordersBtn.className = 'close-modal-btn';
        ordersBtn.textContent = 'Перейти к заказам';
        ordersBtn.style.marginBottom = '10px';
        ordersBtn.addEventListener('click', () => {
            modal.remove();
            window.location.href = 'orders.html';
        });
        modalContent.appendChild(ordersBtn);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-modal-btn';
        closeBtn.textContent = 'Остаться в корзине';
        closeBtn.style.backgroundColor = 'var(--color-btn-secondary-bg)';
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        modalContent.appendChild(closeBtn);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.cart-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        
        const content = document.createElement('div');
        content.className = 'cart-notification-content';
        content.textContent = message;
        
        notification.appendChild(content);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}