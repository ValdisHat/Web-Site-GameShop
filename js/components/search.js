import { products } from '../data/products.js';
import { ProductFilter } from './productFilter.js';

export class Search {
    constructor() {
        this.input = document.querySelector('.search-input');
        this.suggestionsList = document.querySelector('.search-suggestions');
        this.maxSuggestions = 5;
    }

    init() {
        if (!this.input || !this.suggestionsList) {
            console.error('Search элементы не найдены');
            return;
        }

        this.fillInputFromUrl();

        this.input.addEventListener('input', () => {
            this.renderSuggestions();
        });

        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.goToHomeWithQuery(this.input.value);
            }
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.search')) {
                this.clearSuggestions();
            }
        });
    }

    fillInputFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('search');

        if (query) {
            this.input.value = query;
        }
    }

    goToHomeWithQuery(queryValue) {
        const query = queryValue.trim();

        if (!query) {
            window.location.href = './Home.html';
            return;
        }

        window.location.href = `./Home.html?search=${encodeURIComponent(query)}`;
    }

    renderSuggestions() {
        const query = this.input.value.trim();

        const suggestions = ProductFilter.getSuggestions(
            products,
            query,
            this.maxSuggestions
        );

        if (suggestions.length === 0) {
            this.clearSuggestions();
            return;
        }

        this.suggestionsList.innerHTML = suggestions
            .map((suggestion) => {
                return `
                    <li class="search-suggestion-item">
                        ${suggestion}
                    </li>
                `;
            })
            .join('');

        this.suggestionsList.classList.add('active');
        this.addSuggestionListeners();
    }

    addSuggestionListeners() {
        const items = this.suggestionsList.querySelectorAll('.search-suggestion-item');

        items.forEach((item) => {
            item.addEventListener('click', () => {
                const value = item.textContent.trim();
                this.input.value = value;
                this.clearSuggestions();
                this.goToHomeWithQuery(value);
            });
        });
    }

    clearSuggestions() {
        this.suggestionsList.innerHTML = '';
        this.suggestionsList.classList.remove('active');
    }
}