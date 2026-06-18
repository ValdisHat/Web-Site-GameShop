// components/product-card.js
export class productCard {
    constructor(product) {
        this.product = product;
    }

    render() {
        const card = document.createElement('div');
        card.className = 'product-card';

        const link = document.createElement('a');
        link.href = `product.html?id=${this.product.id}`;

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-card__image-wrapper';

        const img = document.createElement('img');
        img.className = 'product-image';
        img.src = this.product.img;
        img.alt = this.product.title;
        img.loading = 'lazy';
        imageWrapper.appendChild(img);

        const hasDiscount = this.product.discount && this.product.discount > 0;

        if (hasDiscount) {
            const discountBadge = document.createElement('div');
            discountBadge.className = 'discount-badge';
            discountBadge.textContent = `-${this.product.discount}%`;
            imageWrapper.appendChild(discountBadge);
        }

        link.appendChild(imageWrapper);

        const infoContainer = document.createElement('div');
        infoContainer.className = 'product-info-container';

        const title = document.createElement('h3');
        title.className = 'product-title';
        title.textContent = this.product.title;
        infoContainer.appendChild(title);

        const genre = document.createElement('p');
        genre.className = 'product-genre';
        genre.textContent = this.product.genre;
        infoContainer.appendChild(genre);

        // Блок с ценой
        const priceBlock = document.createElement('div');
        priceBlock.className = 'product-price';

        if (hasDiscount) {
            const discountedPrice = this.getDiscountedPrice(this.product.price, this.product.discount);
            
            // Создаем строку цены
            const priceRow = document.createElement('div');
            priceRow.className = 'price-row';
            
            // Старая цена
            const oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';
            oldPrice.textContent = `${this.product.price} ₽`;
            priceRow.appendChild(oldPrice);

            // Новая цена
            const newPrice = document.createElement('span');
            newPrice.className = 'new-price';
            newPrice.textContent = `${discountedPrice} ₽`;
            priceRow.appendChild(newPrice);

            // Бейдж скидки
            const discountBadgeSmall = document.createElement('span');
            discountBadgeSmall.className = 'discount-badge-small';
            discountBadgeSmall.textContent = `${this.product.discount}%`;
            priceRow.appendChild(discountBadgeSmall);

            priceBlock.appendChild(priceRow);
        } else {
            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = `${this.product.price} ₽`;
            priceBlock.appendChild(price);
        }

        infoContainer.appendChild(priceBlock);
        link.appendChild(infoContainer);
        card.appendChild(link);

        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart-button';
        addButton.dataset.id = this.product.id;
        
        const cartIcon = document.createElement('span');
        cartIcon.className = 'cart-icon';
        cartIcon.textContent = '🛒';
        addButton.appendChild(cartIcon);
        
        const buttonText = document.createTextNode(' Добавить в корзину');
        addButton.appendChild(buttonText);
        
        card.appendChild(addButton);

        return card;
    }

    getDiscountedPrice(price, discount) {
        if (discount && discount > 0) {
            return Math.round(price - (price * discount / 100));
        }
        return price;
    }
}