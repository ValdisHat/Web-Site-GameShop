import { BasePage } from './basePage.js';
import {productCard} from '../components/product-card.js';
import {products} from '../data/products.js';
import { Search } from '../components/search.js';

export class HomePage extends BasePage {
    constructor() {
        super();
        this.productsContainer = document.querySelector('#main-content');
    }
    init() {
        super.init();

        this.renderProducts(products);
        this.initSearch();

    }

    renderProducts(productsArray) {
        if (!this.productsContainer) {
            console.error('Контейнер .products не найден');
            return;
        }

        if (productsArray.length === 0) {
            this.productsContainer.innerHTML = `
                <p class="products__empty">Ничего не найдено</p>
            `;
            return;
        }

        this.productsContainer.innerHTML = productsArray
            .map((product) => {
                const card = new productCard(product);
                return card.render();
            })
            .join('');
    }

    initSearch() {
        const search = new Search({
            inputSelector: '.search-input',
            suggestionsSelector: '.search-suggestions',
            products: products,
            onSearch: (filteredProducts) => {
                this.renderProducts(filteredProducts);
            }
        });

        search.init();
    }



}