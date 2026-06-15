import { BasePage } from './basePage.js';
import {products} from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';
import { adminPanel } from "../components/adminPanel.js";

export class ProductPage extends BasePage {
    constructor() {
        super();
        this.container = document.getElementById('product-container');
        this.isAdmin = false;
        this.currentProduct = null;
        this.isEditing = false;
    }
    
    init() {
        super.init();
        this.checkAdminStatus();
        this.renderProduct();
        this.addCartButtonListener();
        console.log('Страница товара запущена');
    }

    checkAdminStatus() {
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.isAdmin = user.status === 'admin';
        }
    }

    renderProduct() {
        this.container.innerHTML="";
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

        const wrapper = this.CreateWrapper("pp-img-wrap","pp-img", product)

        const content = document.createElement("div");
        content.className = "pp-content";



        const h1 = document.createElement("h1");
        h1.className = "pp-title";
        h1.textContent = product.title;

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
        if(this.isAdmin)
        {
            const admin_actions = document.createElement("div");
            admin_actions.className = "admin-actions";

            const edit_product_btn = document.createElement("button");
            edit_product_btn.id = "edit-product-btn";
            edit_product_btn.className = "admin-edit-btn";
            edit_product_btn.textContent = "✏️ Редактировать товар"

            admin_actions.appendChild(edit_product_btn);

            content.appendChild(admin_actions);
        }


        section.appendChild(wrapper);
        section.appendChild(content);

        this.container.appendChild(section);
    
        if (this.isAdmin && this.isEditing) {
            this.renderEditForm(product);
        }
    
    }


    getDiscountedPrice(price, discount) {
        if (discount && discount > 0) {
            return price - (price * discount / 100);
        }
        return price;
    }

    renderEditForm(product) {
        this.container.innerHTML="";

        const section = document.createElement("section")
        section.className = "product-page edit-mode";

        const wrapper = this.CreateWrapper("pp-img-wrap","pp-img", product)

        const pp_content = document.createElement("div");
        pp_content.className = "pp-content";

        const h2 = document.createElement("h2");
        h2.textContent = "✏️ Редактирование товара";

        const admin_panel = new adminPanel();

        const form = admin_panel.createForm(product);

        pp_content.appendChild(h2);
        pp_content.appendChild(form);

        section.appendChild(wrapper);
        section.appendChild(pp_content);

        this.container.appendChild(section);

        const imgInput = document.getElementById('pp-img');
        if (imgInput) {
            imgInput.addEventListener('input', (e) => {
                const preview = document.getElementById('preview-img');
                if (preview && e.target.value) {
                    preview.src = e.target.value;
                }
            });
        }

        const cancelBtn = document.getElementById('cancel-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.isEditing = false;
                this.renderProduct();
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProductChanges();
            });
        }
    }

    saveProductChanges() {
        const productId = this.getProductIdFromUrl();
        const productIndex = products.findIndex((item) => item.id === productId);
        
        if (productIndex !== -1) {
            const discountValue = Number(document.getElementById('edit-discount').value) || 0;
            
            // Сохраняем изменения
            products[productIndex] = {
                ...products[productIndex],
                title: document.getElementById('edit-title').value,
                description: document.getElementById('edit-description').value,
                genre: document.getElementById('edit-genre').value,
                platform: document.getElementById('edit-platform').value,
                price: Number(document.getElementById('edit-price').value),
                discount: discountValue,
                releaseDate: document.getElementById('edit-releaseDate').value,
                developer: document.getElementById('edit-developer').value,
                img: document.getElementById('edit-img').value
            };
            
            // Показываем уведомление
            this.showNotification('✅ Товар успешно обновлен!', 'success');
            
            // Выходим из режима редактирования и обновляем отображение
            this.isEditing = false;
            this.renderProduct();
            this.addCartButtonListener(); // Обновляем слушатель для кнопки
        }
    }

    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.product-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `product-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    getProductIdFromUrl() {
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
            button.style.backgroundColor = "rgb(115, 179, 73)"
        });

        if (this.isAdmin) 
        {
            const editBtn = document.getElementById('edit-product-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.isEditing = true;
                    this.renderProduct();
                });
            }
        }
    }

    CreateWrapper(classWrapper, classImg, product)
    {
        const wrapper = document.createElement("div")
        wrapper.className = classWrapper;

        const img = document.createElement("img");
        img.className = classImg;
        img.src = product.img;
        img.alt = product.title;

        wrapper.appendChild(img);
        return wrapper;
    }

    createUl(className, product)
    {
        const hasDiscount = product.discount && product.discount > 0;
        const discountedPrice = this.getDiscountedPrice(product.price, product.discount);


        const ul = document.createElement("ul");
        ul.className = className
        
        const li_genre = document.createElement("li");
        li_genre.textContent = `🎮 Жанр: ${product.genre}`;

        const li_platform = document.createElement("li");
        li_platform.textContent = `💻 Платформа: ${product.platform}`;

        const li_price = document.createElement("li");
        if (hasDiscount)
        {
            const span_old_price = document.createElement("span");
            span_old_price.id = "old-price";
            span_old_price.textContent = `💰 Цена: ${product.price}`;

            const span_new_price = document.createElement("span");
            span_new_price.id = "new-price"
            span_new_price.textContent = ` ${discountedPrice} ₽`;

            const span_discount = document.createElement("span");
            span_discount.id = "discount";
            span_discount.textContent = `${product.discount}%`;

            li_price.appendChild(span_old_price);
            li_price.appendChild(span_new_price);
            li_price.appendChild(span_discount);
        }
        else
        {
            li_price.textContent = `💰 Цена: ${product.price} ₽`
        }
        
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

