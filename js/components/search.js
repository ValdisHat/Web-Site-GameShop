import { ProductFilter } from './productFilter.js';

export class Search {
    constructor({ inputSelector, suggestionsSelector, products, onSearch }) {
        this.input = document.querySelector(inputSelector);
        this.suggestionsList = document.querySelector(suggestionsSelector);
        this.products = products;
        this.onSearch = onSearch;
        this.maxSuggestions = 5;
    }

    init() {
        if (!this.input || !this.suggestionsList) {
            console.error('Search: input или suggestionsList не найден');
            return;
        }

        this.input.addEventListener('input', () => {
            this.renderSuggestions();
        });

        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.runSearch();
            }
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.search')) {
                this.clearSuggestions();
            }
        });
    }

    runSearch() {
        const query = this.input.value.trim();

        const filteredProducts = ProductFilter.filter(this.products, query);

        this.clearSuggestions();

        if (this.onSearch) {
            this.onSearch(filteredProducts, query);
        }
    }

    renderSuggestions() {
        const query = this.input.value.trim();
        const suggestions = ProductFilter.getSuggestions(
            this.products,
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

        this.addSuggestionListeners();
    }

    addSuggestionListeners() {
        const items = this.suggestionsList.querySelectorAll('.search-suggestion-item');

        items.forEach((item) => {
            item.addEventListener('click', () => {
                this.input.value = item.textContent.trim();
                this.runSearch();
            });
        });
    }

    clearSuggestions() {
        this.suggestionsList.innerHTML = '';
    }
}