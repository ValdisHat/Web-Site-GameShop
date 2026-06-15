export class productCard {
    constructor({ id, title, price, img }) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }

    render() {

        const product_div = document.createElement("div");
        product_div.className = "product-card";
        product_div.dataset.id = this.id;

        const a = document.createElement("a");
        a.href = `./product.html?id=${this.id}`;

        const wrapper = document.createElement("div");
        wrapper.className = "product-card__image-wrapper";

        const img = document.createElement("img");
        img.src = this.img;
        img.alt = this.title;
        img.className = "product-image"

        wrapper.appendChild(img);

        const h3 = document.createElement("h3");
        h3.className = "product-title";
        h3.textContent = this.title;
        
        const p = document.createElement("p");
        p.className = "product-price";
        p.textContent = this.price + " руб";

        a.appendChild(wrapper);
        a.appendChild(h3);
        a.appendChild(p);

        const button = document.createElement("button");
        button.className = "add-to-cart-button";
        button.dataset.id = this.id;
        button.textContent = "Добавить в корзину"

        product_div.appendChild(a);
        product_div.appendChild(button);


        return product_div;
    }
}