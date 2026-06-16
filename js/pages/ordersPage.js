// ordersPage.js
import { BasePage } from './basePage.js';
import { getProducts } from '../data/products.js';

export class OrdersPage extends BasePage {
    constructor() {
        super();
        this.container = null;
        this.orders = [];
        this.products = [];
    }

    init() {
        super.init();
        
        // Проверяем наличие контейнера
        this.container = document.getElementById('orders-container');
        this.products = getProducts();
        
        if (!this.container) {
            console.error('❌ Контейнер orders-container не найден!');
            // Создаем контейнер принудительно
            this.container = document.createElement('div');
            this.container.id = 'orders-container';
            document.body.appendChild(this.container);
        }
        
        this.loadOrders();
        this.renderOrders();
        
        // Слушаем событие обновления заказов
        document.addEventListener('ordersUpdated', () => {
            this.loadOrders();
            this.renderOrders();
        });
        
        console.log('✅ Страница заказов запущена');
    }

    loadOrders() {
        this.orders = JSON.parse(localStorage.getItem('gameStoreOrders') || '[]');
        // Сортируем по дате (новые сверху)
        this.orders.sort((a, b) => b.id - a.id);
    }

    renderOrders() {
        if (!this.container) {
            console.error('❌ Контейнер orders-container не найден при рендере');
            return;
        }

        this.container.innerHTML = '';

        const title = document.createElement('h1');
        title.className = 'orders-title';
        title.textContent = '📦 Мои заказы';
        this.container.appendChild(title);

        if (this.orders.length === 0) {
            this.renderEmptyOrders();
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'orders-grid';

        this.orders.forEach((order) => {
            const card = this.createOrderCard(order);
            grid.appendChild(card);
        });

        this.container.appendChild(grid);
    }

    createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';

        // Заголовок заказа
        const header = document.createElement('div');
        header.className = 'order-header';

        const orderId = document.createElement('div');
        orderId.className = 'order-id';
        orderId.textContent = `Заказ #${order.id}`;
        header.appendChild(orderId);

        const orderDate = document.createElement('div');
        orderDate.className = 'order-date';
        orderDate.textContent = order.date || new Date(order.id).toLocaleString();
        header.appendChild(orderDate);

        card.appendChild(header);

        // Информация о заказе
        const info = document.createElement('div');
        info.className = 'order-info';

        const itemsCount = document.createElement('span');
        itemsCount.className = 'order-items-count';
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        itemsCount.textContent = `Товаров: ${totalItems}`;
        info.appendChild(itemsCount);

        const orderTotal = document.createElement('span');
        orderTotal.className = 'order-total';
        orderTotal.textContent = `${order.total} ₽`;
        info.appendChild(orderTotal);

        card.appendChild(info);

        // Кнопка просмотра
        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-order-btn';
        viewBtn.textContent = '📋 Подробнее';
        viewBtn.addEventListener('click', () => {
            this.showOrderDetails(order);
        });
        card.appendChild(viewBtn);

        return card;
    }

    showOrderDetails(order) {
        const modal = document.createElement('div');
        modal.className = 'modal order-details-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Кнопка закрытия
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close-btn';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        modalContent.appendChild(closeBtn);

        // Заголовок
        const title = document.createElement('h2');
        title.textContent = `Заказ #${order.id}`;
        modalContent.appendChild(title);

        // Дата
        const date = document.createElement('div');
        date.className = 'order-date-detail';
        date.textContent = order.date || new Date(order.id).toLocaleString();
        modalContent.appendChild(date);

        // Список товаров
        const productsList = document.createElement('div');
        productsList.className = 'order-products-list';

        const listTitle = document.createElement('h3');
        listTitle.textContent = 'Товары в заказе:';
        productsList.appendChild(listTitle);

        order.items.forEach((item) => {
            const productCard = document.createElement('div');
            productCard.className = 'order-product-card';

            // Находим полную информацию о товаре
            const fullProduct = this.products.find(p => p.id === item.id);
            
            // Изображение товара
            const imageLink = document.createElement('a');
            imageLink.className = 'order-product-image-link';
            imageLink.href = `product.html?id=${item.id}`;
            
            const image = document.createElement('img');
            image.className = 'order-product-image';
            image.src = fullProduct?.img || '../img/placeholder.jpg';
            image.alt = item.title || 'Товар';
            imageLink.appendChild(image);
            productCard.appendChild(imageLink);

            // Информация о товаре
            const info = document.createElement('div');
            info.className = 'order-product-info';

            const titleLink = document.createElement('a');
            titleLink.className = 'order-product-title-link';
            titleLink.href = `product.html?id=${item.id}`;
            
            const name = document.createElement('h4');
            name.textContent = item.title || 'Товар';
            titleLink.appendChild(name);
            info.appendChild(titleLink);

            // Цена со скидкой
            const price = document.createElement('div');
            price.className = 'order-product-price';
            
            // Проверяем наличие скидки
            const hasDiscount = item.discount && item.discount > 0;
            if (hasDiscount) {
                const oldPrice = document.createElement('span');
                oldPrice.className = 'old-price';
                oldPrice.textContent = `${item.originalPrice || item.price} ₽`;
                price.appendChild(oldPrice);

                const newPrice = document.createElement('span');
                newPrice.className = 'new-price';
                newPrice.textContent = `${item.price} ₽`;
                price.appendChild(newPrice);

                const discountBadge = document.createElement('span');
                discountBadge.className = 'discount-badge-small';
                discountBadge.textContent = `${item.discount}%`;
                price.appendChild(discountBadge);
            } else {
                price.textContent = `${item.price} ₽`;
            }
            info.appendChild(price);

            const quantity = document.createElement('div');
            quantity.className = 'order-product-quantity';
            quantity.textContent = `Количество: ${item.quantity}`;
            info.appendChild(quantity);

            const total = document.createElement('div');
            total.className = 'order-product-total';
            total.textContent = `Итого: ${item.total || item.price * item.quantity} ₽`;
            info.appendChild(total);

            productCard.appendChild(info);
            productsList.appendChild(productCard);
        });

        modalContent.appendChild(productsList);

        // Итоговая сумма
        const summary = document.createElement('div');
        summary.className = 'order-summary';

        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const itemsTotal = document.createElement('div');
        itemsTotal.className = 'summary-item';
        itemsTotal.textContent = `Всего товаров: ${totalItems}`;
        summary.appendChild(itemsTotal);

        const totalPrice = document.createElement('div');
        totalPrice.className = 'summary-item';
        totalPrice.innerHTML = `<strong>Итого: ${order.total} ₽</strong>`;
        summary.appendChild(totalPrice);

        modalContent.appendChild(summary);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    renderEmptyOrders() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-orders';

        const icon = document.createElement('div');
        icon.className = 'empty-cart-icon';
        icon.textContent = '📦';
        emptyDiv.appendChild(icon);

        const title = document.createElement('h2');
        title.textContent = 'У вас пока нет заказов';
        emptyDiv.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = 'Перейдите в каталог и выберите товары';
        emptyDiv.appendChild(desc);

        const link = document.createElement('a');
        link.className = 'continue-shopping';
        link.href = 'Home.html';
        link.textContent = 'Перейти в каталог';
        emptyDiv.appendChild(link);

        this.container.appendChild(emptyDiv);
    }
}