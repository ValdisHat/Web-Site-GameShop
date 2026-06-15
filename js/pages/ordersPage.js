import { BasePage } from './basePage.js';
import { products } from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';

export class OrdersPage extends BasePage {
    constructor() {
        super();
        this.container = document.getElementById('orders-page-container');
        this.modalContainer = document.getElementById('modal-container');
        this.orders = this.loadOrders();
        this.selectedOrder = null;
    }

    loadOrders() {
        const savedOrders = localStorage.getItem('gameShopOrders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    }

    saveOrders() {
        localStorage.setItem('gameShopOrders', JSON.stringify(this.orders));
    }

    addOrder(orderData) {
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            items: orderData.items,
            total: orderData.total,
            totalItems: orderData.totalItems
        };
        
        this.orders.unshift(newOrder);
        this.saveOrders();
        this.render();
    }

    getOrderProducts(orderItems) {
        return orderItems.map((orderItem) => {
            const product = products.find((product) => {
                return Number(product.id) === Number(orderItem.id);
            });

            if (!product) {
                console.warn('Товар не найден в products.js:', orderItem);
                return null;
            }

            return {
                ...product,
                quantity: orderItem.quantity
            };
        }).filter((item) => item !== null);
    }

    renderEmptyOrders() {
        this.container.innerHTML = '';
        
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-orders';
        
        const h2 = document.createElement('h2');
        h2.textContent = '📦 У вас пока нет заказов';
        
        const link = document.createElement('a');
        link.href = './Home.html';
        link.className = 'continue-shopping';
        link.textContent = 'В магазин';
        
        emptyDiv.appendChild(h2);
        emptyDiv.appendChild(link);
        this.container.appendChild(emptyDiv);
    }

    renderOrdersList() {
        this.container.innerHTML = '';
        
        const title = document.createElement('h1');
        title.className = 'orders-title';
        title.textContent = 'Мои заказы';
        this.container.appendChild(title);
        
        const ordersGrid = document.createElement('div');
        ordersGrid.className = 'orders-grid';
        
        this.orders.forEach((order) => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.dataset.id = order.id;
            
            const orderHeader = document.createElement('div');
            orderHeader.className = 'order-header';
            
            const orderId = document.createElement('div');
            orderId.className = 'order-id';
            orderId.textContent = `Заказ #${order.id}`;
            
            const orderDate = document.createElement('div');
            orderDate.className = 'order-date';
            orderDate.textContent = order.date;
            
            orderHeader.appendChild(orderId);
            orderHeader.appendChild(orderDate);
            
            const orderInfo = document.createElement('div');
            orderInfo.className = 'order-info';
            
            const itemsCount = document.createElement('div');
            itemsCount.className = 'order-items-count';
            itemsCount.textContent = `Товаров: ${order.totalItems}`;
            
            const totalAmount = document.createElement('div');
            totalAmount.className = 'order-total';
            totalAmount.textContent = `Сумма: ${order.total.toLocaleString()} ₽`;
            
            orderInfo.appendChild(itemsCount);
            orderInfo.appendChild(totalAmount);
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-order-btn';
            viewBtn.textContent = 'Посмотреть состав заказа';
            viewBtn.dataset.id = order.id;
            
            orderCard.appendChild(orderHeader);
            orderCard.appendChild(orderInfo);
            orderCard.appendChild(viewBtn);
            
            ordersGrid.appendChild(orderCard);
        });
        
        this.container.appendChild(ordersGrid);
        this.attachOrdersListListeners();
    }

    attachOrdersListListeners() {
        document.querySelectorAll('.view-order-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = Number(btn.dataset.id);
                const order = this.orders.find(o => o.id === orderId);
                if (order) {
                    this.showOrderDetails(order);
                }
            });
        });
    }

    showOrderDetails(order) {
        this.selectedOrder = order;
        this.renderOrderDetailsModal();
    }

    renderOrderDetailsModal() {
        if (!this.modalContainer) {
            console.error('modal-container не найден');
            return;
        }
        
        const orderProducts = this.getOrderProducts(this.selectedOrder.items);
        
        const modal = document.createElement('div');
        modal.className = 'modal order-details-modal';
        modal.id = 'order-details-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content order-details-content';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        const title = document.createElement('h2');
        title.textContent = `Заказ #${this.selectedOrder.id}`;
        
        const date = document.createElement('p');
        date.className = 'order-date-detail';
        date.textContent = `Дата: ${this.selectedOrder.date}`;
        
        const productsSection = document.createElement('div');
        productsSection.className = 'order-products-list';
        
        const productsTitle = document.createElement('h3');
        productsTitle.textContent = 'Состав заказа:';
        productsSection.appendChild(productsTitle);
        
        orderProducts.forEach((item) => {
            const productCard = this.createOrderProductCard(item);
            productsSection.appendChild(productCard);
        });
        
        const summary = document.createElement('div');
        summary.className = 'order-summary';
        
        const totalItems = document.createElement('div');
        totalItems.className = 'summary-item';
        totalItems.innerHTML = `<strong>Количество товаров:</strong> ${this.selectedOrder.totalItems}`;
        
        const totalAmount = document.createElement('div');
        totalAmount.className = 'summary-item';
        totalAmount.innerHTML = `<strong>Общая сумма:</strong> ${this.selectedOrder.total.toLocaleString()} ₽`;
        
        summary.appendChild(totalItems);
        summary.appendChild(totalAmount);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'close-modal-btn';
        closeButton.textContent = 'Закрыть';
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
        
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(date);
        modalContent.appendChild(productsSection);
        modalContent.appendChild(summary);
        modalContent.appendChild(closeButton);
        
        modal.appendChild(modalContent);
        this.modalContainer.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    createOrderProductCard(product) {
        const card = document.createElement('div');
        card.className = 'order-product-card';
        
        const imgLink = document.createElement('a');
        imgLink.href = `./product.html?id=${product.id}`;
        imgLink.className = 'order-product-image-link';
        
        const img = document.createElement('img');
        img.src = product.img;
        img.alt = product.title;
        img.className = 'order-product-image';
        img.onerror = () => { img.src = './img/LogoForSite.png'; };
        
        imgLink.appendChild(img);
        
        const info = document.createElement('div');
        info.className = 'order-product-info';
        
        const titleLink = document.createElement('a');
        titleLink.href = `./product.html?id=${product.id}`;
        titleLink.className = 'order-product-title-link';
        
        const title = document.createElement('h4');
        title.textContent = product.title;
        titleLink.appendChild(title);
        
        const price = document.createElement('div');
        price.className = 'order-product-price';
        price.textContent = `${product.price.toLocaleString()} ₽`;
        
        const quantity = document.createElement('div');
        quantity.className = 'order-product-quantity';
        quantity.textContent = `Количество: ${product.quantity}`;
        
        const total = document.createElement('div');
        total.className = 'order-product-total';
        total.innerHTML = `<strong>Итого:</strong> ${(product.price * product.quantity).toLocaleString()} ₽`;
        
        info.appendChild(titleLink);
        info.appendChild(price);
        info.appendChild(quantity);
        info.appendChild(total);
        
        card.appendChild(imgLink);
        card.appendChild(info);
        
        return card;
    }

    render() {
        if (!this.container) {
            console.error('orders-page-container не найден');
            return;
        }

        if (this.orders.length === 0) {
            this.renderEmptyOrders();
        } else {
            this.renderOrdersList();
        }
    }

    init() {
        super.init();
        this.render();
        
        window.addEventListener('orderCreated', (event) => {
            if (event.detail) {
                this.addOrder(event.detail);
            }
        });
    }
}