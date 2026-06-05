import { BasePage } from './basePage.js';
import {products} from '../data/products.js';

export class ProductPage extends BasePage {
    constructor() {
        super();
        this.productContainer = 'product-container';
    }
    init() {
        super.init();
        this.renderProduct();
        console.log('Главная страница запущена');
    }


    renderProduct() {
        const productId = this.getProductIdFromUrl();
        const product = products.find((item) => item.id === productId);

        const container = document.getElementById(this.productContainer);

        if (!container) {
            console.error('Контейнер product-container не найден');
            return;
        }

        if (!product) {
            container.innerHTML = `
                <section class="product-page">
                    <h1>Товар не найден</h1>
                    <a href="./Home.html">Вернуться на главную</a>
                </section>
            `;
            return;
        }

        container.innerHTML = `
            <section class="product-page">
                <div class="pp-img-wrap">
                    <img 
                        class="pp-img" 
                        src="${product.img}" 
                        alt="${product.title}"
                    >
                </div>
                <div class="pp-content">
                    <h1 class="pp-title">${product.title}</h1>

                    <p class="pp-description">
                        ${product.description}
                    </p>

                    <ul class="pp-info">
                        <li>Жанр: ${product.genre}</li>
                        <li>Платформа: ${product.platform}</li>
                        <li>Цена: ${product.price} руб.</li>
                    </ul>

                    <button class="pp-button" data-id="${product.id}">
                        Добавить в корзину
                    </button>
                </div>
            </section>
        `;
    }
    getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return Number(params.get('id'));
    }

}