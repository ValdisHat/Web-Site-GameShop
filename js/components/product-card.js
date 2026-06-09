export class productCard {
    constructor({ id, title, price, img }) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }

    render() {
        return `
            <div class="product-card" data-id="${this.id}">
                <a href="./product.html?id=${this.id}">
                    <div class="product-card__image-wrapper">
                        <img src="${this.img}" alt="${this.title}" class="product-image">
                    </div>

                    <h3 class="product-title">${this.title}</h3>
                    <p class="product-price">${this.price} руб.</p>
                </a>

                <button class="add-to-cart-button" data-id="${this.id}">
                    Добавить в корзину
                </button>
            </div>
        `;
    }
}