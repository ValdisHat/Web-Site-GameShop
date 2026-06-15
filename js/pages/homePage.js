import { BasePage } from './basePage.js';
import {productCard} from '../components/product-card.js';
import {products} from '../data/products.js';
import { Search } from '../components/search.js';
import { ProductFilter } from '../components/productFilter.js';
import { CartUtils } from '../components/cartUtils.js';

export class HomePage extends BasePage {
   
    constructor() {
        super();
        this.productsContainer = document.querySelector('#main-content');
    }

    
    init() {
        super.init();

        const searchQuery = this.getSearchQueryFromUrl();

        if (searchQuery) {
            const filteredProducts = ProductFilter.filter(products, searchQuery);
            this.renderProducts(filteredProducts);
        } else {
            this.renderProducts(products);
        }

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
        
        productsArray.forEach((product) => {
            const card = new productCard(product);    
            this.productsContainer.appendChild(card.render())
        })

        this.addCartButtonsListeners();
    }

    addCartButtonsListeners() 
    {
        document.querySelectorAll('.add-to-cart-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                

                const productId = Number(button.dataset.id);

                CartUtils.addToCart(productId);

                button.textContent = 'Добавлено';
            });
        });
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


    getSearchQueryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('search') || '';
    }



}