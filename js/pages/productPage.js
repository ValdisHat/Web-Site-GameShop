import { BasePage } from './basePage.js';
import {products} from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';

export class ProductPage extends BasePage {
    constructor() {
        super();
        this.container = document.getElementById('product-container');
    }
    init() {
        super.init();
        this.renderProduct();
        this.addCartButtonListener();
        console.log('Главная страница запущена');
    }


    renderProduct() {
        const productId = this.getProductIdFromUrl();
        const product = products.find((item) => item.id === productId);

        

        if (!this.container) {
            console.error('Контейнер product-container не найден');
            return;
        }

        if (!product) {
            this.productUndefind();
            return;
        }


        const section = document.createElement("section");
        section.className = "product-page";

        const wrapper = document.createElement("div")
        wrapper.className = "pp-img-wrap";

        const img = document.createElement("img");
        img.className = "pp-img";
        img.src = product.img;
        img.alt = product.title;

        wrapper.appendChild(img);
        

        const content = document.createElement("div");
        content.className = "pp-content";

        const h1 = document.createElement("h1");
        h1.className = "pp-title";

        const p = document.createElement("p");
        p.className = "pp-description";
        p.textContent = product.description;
        
        const ul = this.createUl("pp-info",product);

        const button = document.createElement("button");
        button.className = "pp-button add-to-cart-button";
        button.dataset.id = product.id;
        button.textContent = "Добавить в корзину"

        content.appendChild(h1);
        content.appendChild(p);
        content.appendChild(ul);
        content.appendChild(button);

        section.appendChild(wrapper);
        section.appendChild(content);

        this.container.appendChild(section);
    }

    getProductIdFromUrl() 
    {
        const params = new URLSearchParams(window.location.search);
        return Number(params.get('id'));
    }

    addCartButtonListener() 
    {
        const button = document.querySelector('.add-to-cart-button');

        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            const productId = Number(button.dataset.id);

            CartUtils.addToCart(productId);

            button.textContent = 'Добавлено';
        });
    }

    createUl(className, product)
    {
        const ul = document.createElement("ul");
        ul.className = className
        
        const li_genre = document.createElement("li");
        li_genre.textContent = `Жанр: ${product.genre}`;

        const li_platform = document.createElement("li");
        li_platform.textContent = `Платформа: ${product.platform}`;

        const li_price = document.createElement("li");
        li_price.textContent = `Цена: ${product.price} руб.`;
        
        ul.appendChild(li_genre);
        ul.appendChild(li_platform);
        ul.appendChild(li_price);
        
        return ul;
    }

    productUndefind()
    {
        const section = document.createElement("section");
        section.className = "product-page";

        const h1 = document.createElement("h1");
        h1.textContent = "Товар не найден!"

        section.appendChild(h1);
        this.container.appendChild(section);
    }
}

