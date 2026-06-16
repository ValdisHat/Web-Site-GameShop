// productPage.js
import { BasePage } from './basePage.js';
import { products, updateProduct, getProducts, deleteProduct } from '../data/products.js';
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
        
        // Получаем актуальные данные из localStorage
        const currentProducts = getProducts();
        const product = currentProducts.find((item) => item.id === productId);

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
        
        if(this.isAdmin) {
            const admin_actions = document.createElement("div");
            admin_actions.className = "admin-actions";

            // Кнопка редактирования
            const edit_product_btn = document.createElement("button");
            edit_product_btn.id = "edit-product-btn";
            edit_product_btn.className = "admin-edit-btn";
            edit_product_btn.textContent = "✏️ Редактировать товар";
            admin_actions.appendChild(edit_product_btn);

            // Кнопка удаления
            const delete_product_btn = document.createElement("button");
            delete_product_btn.id = "delete-product-btn";
            delete_product_btn.className = "admin-delete-btn";
            delete_product_btn.textContent = "🗑️ Удалить товар";
            delete_product_btn.style.marginTop = "10px";
            delete_product_btn.style.width = "100%";
            delete_product_btn.style.padding = "12px 20px";
            delete_product_btn.style.border = "none";
            delete_product_btn.style.borderRadius = "8px";
            delete_product_btn.style.background = "#f76060";
            delete_product_btn.style.color = "white";
            delete_product_btn.style.fontSize = "16px";
            delete_product_btn.style.fontWeight = "600";
            delete_product_btn.style.cursor = "pointer";
            delete_product_btn.style.transition = "all 0.3s ease";
            
            delete_product_btn.addEventListener('mouseenter', () => {
                delete_product_btn.style.background = "#f76060";
                delete_product_btn.style.transform = "translateY(-2px)";
                delete_product_btn.style.boxShadow = "0 4px 15px rgba(255, 68, 68, 0.4)";
            });
            
            delete_product_btn.addEventListener('mouseleave', () => {
                delete_product_btn.style.background = "#ff4444";
                delete_product_btn.style.transform = "translateY(0)";
                delete_product_btn.style.boxShadow = "none";
            });
            
            delete_product_btn.addEventListener('click', () => {
                this.deleteProduct(product.id);
            });
            
            admin_actions.appendChild(delete_product_btn);

            content.appendChild(admin_actions);
        }

        section.appendChild(wrapper);
        section.appendChild(content);

        this.container.appendChild(section);
    
        if (this.isAdmin && this.isEditing) {
            this.renderEditForm(product);
        }
    }

    deleteProduct(productId) {
        const product = getProducts().find(p => p.id === productId);
        
        if (confirm(`Вы уверены, что хотите удалить товар "${product?.title || 'Товар'}"?`)) {
            // Удаляем товар
            deleteProduct(productId);
            
            // Показываем уведомление
            this.showNotification('✅ Товар успешно удален!', 'success');
            
            // Перенаправляем на главную через 1.5 секунды
            setTimeout(() => {
                window.location.href = 'Home.html';
            }, 1500);
        }
    }

    getDiscountedPrice(price, discount) {
        if (discount && discount > 0) {
            return Math.round(price - (price * discount / 100));
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
        
        // Собираем данные из формы
        const updatedProduct = {
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            genre: document.getElementById('edit-genre').value,
            platform: document.getElementById('edit-platform').value,
            price: Number(document.getElementById('edit-price').value),
            discount: Number(document.getElementById('edit-discount').value) || 0,
            releaseDate: document.getElementById('edit-releaseDate').value,
            developer: document.getElementById('edit-developer').value,
            img: document.getElementById('edit-img').value
        };
        
        // Обновляем товар через функцию updateProduct
        const result = updateProduct(productId, updatedProduct);
        
        if (result) {
            // Показываем уведомление об успехе
            this.showNotification('✅ Товар успешно обновлен и сохранен в localStorage!', 'success');
            
            // Выходим из режима редактирования
            this.isEditing = false;
            
            // Обновляем отображение
            this.renderProduct();
            this.addCartButtonListener();
            
            // Логируем для отладки
            console.log('📦 Товар сохранен в localStorage:', result);
            console.log('📦 Все товары в localStorage:', getProducts());
        } else {
            this.showNotification('❌ Ошибка при обновлении товара', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.product-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `product-notification ${type}`;
        
        const content = document.createElement('div');
        content.className = 'notification-content';
        content.textContent = message;
        notification.appendChild(content);
        
        // Добавляем стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.5s ease;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.cssText += `
                animation: slideOutRight 0.5s ease forwards;
            `;
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return Number(params.get('id'));
    }

    addCartButtonListener() {
        const button = document.querySelector('.add-to-cart-button');

        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            const productId = Number(button.dataset.id);

            CartUtils.addToCart(productId);

            button.textContent = '✅ Добавлено';
            button.style.backgroundColor = "rgb(115, 179, 73)"
            
            setTimeout(() => {
                button.textContent = 'Добавить в корзину';
                button.style.backgroundColor = "";
            }, 2000);
        });

        if (this.isAdmin) {
            const editBtn = document.getElementById('edit-product-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    this.isEditing = true;
                    this.renderProduct();
                });
            }
        }
    }

    CreateWrapper(classWrapper, classImg, product) {
        const wrapper = document.createElement("div")
        wrapper.className = classWrapper;

        const img = document.createElement("img");
        img.className = classImg;
        img.src = product.img;
        img.alt = product.title;

        wrapper.appendChild(img);
        return wrapper;
    }

    createUl(className, product) {
        const hasDiscount = product.discount && product.discount > 0;
        const discountedPrice = this.getDiscountedPrice(product.price, product.discount);

        const ul = document.createElement("ul");
        ul.className = className
        
        const li_genre = document.createElement("li");
        li_genre.textContent = `🎮 Жанр: ${product.genre}`;

        const li_platform = document.createElement("li");
        li_platform.textContent = `💻 Платформа: ${product.platform}`;

        const li_price = document.createElement("li");
        li_price.className = "price-row";
        
        // Добавляем "Цена:" перед ценой
        const priceLabel = document.createElement("span");
        priceLabel.className = "price-label";
        priceLabel.textContent = "Цена:";
        li_price.appendChild(priceLabel);
        
        if (hasDiscount) {
            // Старая цена
            const span_old_price = document.createElement("span");
            span_old_price.className = "old-price";
            span_old_price.textContent = `${product.price}`;

            // Новая цена
            const span_new_price = document.createElement("span");
            span_new_price.className = "new-price";
            span_new_price.textContent = `${discountedPrice} ₽`;

            // Бейдж скидки
            const span_discount = document.createElement("span");
            span_discount.className = "discount-badge-small";
            span_discount.textContent = `${product.discount}%`;

            li_price.appendChild(span_old_price);
            li_price.appendChild(span_new_price);
            li_price.appendChild(span_discount);
        } else {
            // Обычная цена
            const priceSpan = document.createElement("span");
            priceSpan.className = "price";
            priceSpan.textContent = `${product.price} ₽`;
            li_price.appendChild(priceSpan);
        }
        
        ul.appendChild(li_genre);
        ul.appendChild(li_platform);
        ul.appendChild(li_price);
        
        return ul;
    }

    productUndefind() {
        const section = document.createElement("section");
        section.className = "product-page";

        const h1 = document.createElement("h1");
        h1.textContent = "Товар не найден!"

        section.appendChild(h1);
        this.container.appendChild(section);
    }
}