// profilePage.js
import { BasePage } from './basePage.js';
import { accounts, addAccount, validateLogin } from '../data/accounts.js';
import { addProduct } from '../data/products.js';
import { CartUtils } from '../components/cartUtils.js';

export class ProfilePage extends BasePage {
    constructor() {
        super();
        this.currentUser = null;
        this.showLogin = true;
        this.isAddingProduct = false;
        this.selectedImage = null;
    }

    init() {
        console.log('ProfilePage initialized');
        this.saveAccountsData();
        super.init();
        this.render();
    }

    render() {
        console.log('Rendering ProfilePage');

        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showProfileInfo();
        } else {
            this.showAuthForm();
        }

        this.setupEventListeners();
    }

    clearMainContent() {
        const mainContent = document.getElementById('profile-main-container');

        if (!mainContent) {
            console.error('profile-main-container not found!');
            return null;
        }

        mainContent.textContent = '';
        return mainContent;
    }

    showAuthForm() {
        const mainContent = this.clearMainContent();

        if (!mainContent) return;

        if (this.showLogin) {
            mainContent.appendChild(this.renderLoginForm());
        } else {
            mainContent.appendChild(this.renderRegisterForm());
        }
    }

    createFormGroup(labelText, inputType, inputId, inputName, placeholder) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.name = inputName;
        input.placeholder = placeholder;
        input.required = true;

        formGroup.appendChild(label);
        formGroup.appendChild(input);

        return formGroup;
    }

    createButton(type, className, textContent, id = null) {
        const button = document.createElement('button');

        button.type = type;
        button.className = className;
        button.textContent = textContent;

        if (id) {
            button.id = id;
        }

        return button;
    }

    renderLoginForm() {
        const profileContainer = document.createElement('div');
        profileContainer.className = 'profile-container';

        const authForm = document.createElement('div');
        authForm.className = 'auth-form';

        const title = document.createElement('h2');
        title.textContent = 'Вход в аккаунт';

        const form = document.createElement('form');
        form.id = 'login-form';

        const usernameGroup = this.createFormGroup(
            'Имя пользователя:',
            'text',
            'login-username',
            'username',
            'Введите имя пользователя'
        );

        const passwordGroup = this.createFormGroup(
            'Пароль:',
            'password',
            'login-password',
            'password',
            'Введите пароль'
        );

        const button = this.createButton(
            'submit',
            'btn btn-primary',
            'Войти'
        );

        form.appendChild(usernameGroup);
        form.appendChild(passwordGroup);
        form.appendChild(button);

        const errorDiv = document.createElement('div');
        errorDiv.id = 'login-error';
        errorDiv.className = 'error-message';

        const switchText = document.createElement('p');
        switchText.className = 'auth-switch';
        switchText.append('Нет аккаунта? ');

        const switchLink = document.createElement('a');
        switchLink.href = '#';
        switchLink.id = 'switch-to-register';
        switchLink.textContent = 'Зарегистрироваться';

        switchText.appendChild(switchLink);

        authForm.appendChild(title);
        authForm.appendChild(form);
        authForm.appendChild(errorDiv);
        authForm.appendChild(switchText);

        profileContainer.appendChild(authForm);

        return profileContainer;
    }

    renderRegisterForm() {
        const profileContainer = document.createElement('div');
        profileContainer.className = 'profile-container';

        const authForm = document.createElement('div');
        authForm.className = 'auth-form';

        const title = document.createElement('h2');
        title.textContent = 'Регистрация';

        const form = document.createElement('form');
        form.id = 'register-form';

        const usernameGroup = this.createFormGroup(
            'Имя пользователя:',
            'text',
            'reg-username',
            'username',
            'Минимум 3 символа'
        );

        const passwordGroup = this.createFormGroup(
            'Пароль:',
            'password',
            'reg-password',
            'password',
            'Минимум 4 символа'
        );

        const confirmPasswordGroup = this.createFormGroup(
            'Подтверждение пароля:',
            'password',
            'confirm-password',
            'confirm-password',
            'Повторите пароль'
        );

        const button = this.createButton(
            'submit',
            'btn btn-primary',
            'Зарегистрироваться'
        );

        form.appendChild(usernameGroup);
        form.appendChild(passwordGroup);
        form.appendChild(confirmPasswordGroup);
        form.appendChild(button);

        const errorDiv = document.createElement('div');
        errorDiv.id = 'register-error';
        errorDiv.className = 'error-message';

        const switchText = document.createElement('p');
        switchText.className = 'auth-switch';
        switchText.append('Уже есть аккаунт? ');

        const switchLink = document.createElement('a');
        switchLink.href = '#';
        switchLink.id = 'switch-to-login';
        switchLink.textContent = 'Войти';

        switchText.appendChild(switchLink);

        authForm.appendChild(title);
        authForm.appendChild(form);
        authForm.appendChild(errorDiv);
        authForm.appendChild(switchText);

        profileContainer.appendChild(authForm);

        return profileContainer;
    }

    renderProfileInfo() {
        const profileContainer = document.createElement('div');
        profileContainer.className = 'profile-container';

        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';

        const profileHeader = document.createElement('div');
        profileHeader.className = 'profile-header';

        const profileAvatar = document.createElement('div');
        profileAvatar.className = 'profile-avatar';

        const avatarImg = document.createElement('img');
        avatarImg.src = this.currentUser.img;;
        avatarImg.alt = 'Аватар';

        avatarImg.onerror = () => {
            avatarImg.onerror = null;
            avatarImg.src = this.currentUser.img;
        };

        profileAvatar.appendChild(avatarImg);

        const profileStatus = document.createElement('div');
        profileStatus.className = `profile-status ${this.currentUser.status}`;

        if (this.currentUser.status === 'admin') {
            profileStatus.textContent = 'Администратор';
        } else {
            profileStatus.textContent = 'Пользователь';
        }

        profileHeader.appendChild(profileAvatar);
        profileHeader.appendChild(profileStatus);

        const profileDetails = document.createElement('div');
        profileDetails.className = 'profile-details';

        const title = document.createElement('h2');
        title.textContent = `Добро пожаловать, ${this.currentUser.username}!`;

        const idRow = this.createInfoRow(
            'ID пользователя:',
            `#${this.currentUser.id}`
        );

        const accountTypeText = this.currentUser.status === 'admin'
            ? 'Администратор'
            : 'Обычный пользователь';

        const typeRow = this.createInfoRow(
            'Тип аккаунта:',
            accountTypeText
        );

        const dateRow = this.createInfoRow(
            'Дата регистрации:',
            new Date(this.currentUser.createdAt).toLocaleDateString('ru-RU')
        );

        profileDetails.appendChild(title);
        profileDetails.appendChild(idRow);
        profileDetails.appendChild(typeRow);
        profileDetails.appendChild(dateRow);

        const profileActions = document.createElement('div');
        profileActions.className = 'profile-actions';

        // Кнопка "Добавить товар" только для администратора
        const gridStatistic = document.createElement("div");
        gridStatistic.className = "grid-statistic";


        if (this.currentUser.status === 'admin') {
            const addProductBtn = this.createButton(
                'button',
                'btn btn-success add-product-btn',
                'Добавить товар',
                'add-product-btn'
            );

            addProductBtn.addEventListener('click', () => {
                this.showAddProductForm();
            });
            
            profileActions.appendChild(addProductBtn);

            

            const popularProduct = CartUtils.popularProduct();

            const popularProductBlock = this.createStatisticBlock(
                'Самая популярная игра',
                popularProduct.title,
                `Была куплена: ${popularProduct.quantityOrders} раз.`,
                popularProduct.img,
                popularProduct.title
            );

            const userOrders = this.getUserMaxOrders();
            

            const userMaxOrders = this.createStatisticBlock(
                'Пользователь с наибольшим кол-вом заказов',
                userOrders.user.username,
                `Количество заказов: ${userOrders.total}`,
                userOrders.user.img,
                'Аватар пользователя'
            );

            const userSpend = this.getUserMaxSpendMoney();

            const maxOrdersBlock2 = this.createStatisticBlock(
                'Лидер по трате денег',
                userSpend.user.username,
                `Количество потраченных денег: ${userSpend.total}`,
                userSpend.user.img,
                'Аватар пользователя'
            );

            const maxOrdersBlock3 = this.createStatisticBlock(
                'Кол-во заказов сегодня',
                'Кол-во заказов сегодня',
                this.getQuantityOrdersToday(),
                '../img/Ведьмак.jpeg',
                'Аватар пользователя'
            );

            const maxOrdersBlock4 = this.createStatisticBlock(
                'Кол-во зареганных пользователей сегодня',
                'Кол-во зареганных пользователей сегодня',
                this.getRegisteredUsersToday(),
                '../img/Ведьмак.jpeg',
                'Аватар пользователя'
            );
            gridStatistic.appendChild(popularProductBlock);
            gridStatistic.appendChild(userMaxOrders);
            gridStatistic.appendChild(maxOrdersBlock2);
            gridStatistic.appendChild(maxOrdersBlock3);
            gridStatistic.appendChild(maxOrdersBlock4);
           

        }

        const logoutButton = this.createButton(
            'button',
            'btn btn-danger',
            'Выйти',
            'logout-btn'
        );

        profileActions.appendChild(logoutButton);

        profileCard.appendChild(profileHeader);
        profileCard.appendChild(profileDetails);
        profileCard.appendChild(profileActions);
        

        profileContainer.appendChild(profileCard);
        profileContainer.appendChild(gridStatistic);
        
        return profileContainer;
    }

    createStatisticBlock(titleText, mainText, descriptionText, imageSrc, imageAlt) {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';

        const profileHeader = document.createElement('div');
        profileHeader.className = 'profile-header';

        const profileAvatar = document.createElement('div');
        profileAvatar.className = 'profile-avatar';

        const image = document.createElement('img');
        image.src = imageSrc;
        image.alt = imageAlt;



        profileAvatar.appendChild(image);

        const profileStatus = document.createElement('div');
        profileStatus.className = 'profile-status user';
        profileStatus.textContent = titleText;

        profileHeader.appendChild(profileAvatar);
        profileHeader.appendChild(profileStatus);

        const profileDetails = document.createElement('div');
        profileDetails.className = 'profile-details';

        const title = document.createElement('h2');
        title.textContent = mainText;

        const descriptionRow = this.createInfoRow(
            'Информация:',
            descriptionText
        );

        profileDetails.appendChild(title);
        profileDetails.appendChild(descriptionRow);

        profileCard.appendChild(profileHeader);
        profileCard.appendChild(profileDetails);

        return profileCard;
    }

    getUserMaxOrders()
    {
        const users = CartUtils.get("gameStoreAccounts");
        let maxOrders  = null;
        let maxOrdersUser = null;

        users.forEach(user => {
            const orders = CartUtils.get(`gameStoreOrders_${user.id}`);
            if (maxOrders === null || maxOrders < orders.length)
            {
                maxOrders = orders.length;
                maxOrdersUser = user;
            }
        });

        return {
            user: maxOrdersUser,
            total: maxOrders
        };
    }

    getUserMaxSpendMoney()
    {
        const users = CartUtils.get("gameStoreAccounts");
        let maxMoney  = null;
        let maxMoneyUser = null;

        users.forEach(user => {
            const orders = CartUtils.get(`gameStoreOrders_${user.id}`);
            const totalSpent = orders.reduce((sum, order) => {
            return sum + order.total;
            }, 0);
            if (maxMoney === null || maxMoney < totalSpent)
            {
                maxMoney = totalSpent;
                maxMoneyUser = user;
            }
        });
        return {
            user: maxMoneyUser,
            total: maxMoney
        };
    }

    getQuantityOrdersToday() {
        const users = CartUtils.get("gameStoreAccounts") || [];

        let quantity = 0;

        const today = new Date().toLocaleDateString('ru-RU');

        users.forEach((user) => {
            const orders = CartUtils.get(`gameStoreOrders_${user.id}`) || [];

            orders.forEach((order) => {
                if (order.date.startsWith(today)) {
                    quantity += 1;
                }
            });
        });

        return quantity;
    }

    getRegisteredUsersToday() {
        const users = CartUtils.get("gameStoreAccounts") || [];

        const today = new Date();

        const usersToday = users.filter((user) => {
            if (!user.createdAt) return false;

            const registrationDate = new Date(user.createdAt);

            return registrationDate.getDate() === today.getDate() &&
                registrationDate.getMonth() === today.getMonth() &&
                registrationDate.getFullYear() === today.getFullYear();
        });

        return usersToday.length;
    }

    showAddProductForm() {
        this.isAddingProduct = true;
        this.selectedImage = null;
        
        const mainContent = this.clearMainContent();
        if (!mainContent) return;

        const profileContainer = document.createElement('div');
        profileContainer.className = 'profile-container';

        const formDiv = document.createElement('div');
        formDiv.className = 'product-add-form';

        const title = document.createElement('h3');
        title.textContent = 'Добавление нового товара';
        title.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            color: var(--color-text-main);
        `;
        formDiv.appendChild(title);

        const form = document.createElement('form');
        form.id = 'add-product-form';
        form.className = 'edit-product-form';

        // Название
        const titleGroup = this.createFormGroup('Название товара:', 'text', 'add-title', 'title', 'Введите название');
        form.appendChild(titleGroup);

        // Описание
        const descGroup = this.createFormGroup('Описание:', 'textarea', 'add-description', 'description', 'Введите описание');
        form.appendChild(descGroup);

        // Жанр
        const genreGroup = this.createFormGroup('Жанр:', 'text', 'add-genre', 'genre', 'Введите жанр');
        form.appendChild(genreGroup);

        // Платформа
        const platformGroup = this.createFormGroup('Платформа:', 'text', 'add-platform', 'platform', 'Введите платформу');
        form.appendChild(platformGroup);

        // Цена
        const priceGroup = this.createFormGroup('Цена (₽):', 'number', 'add-price', 'price', 'Введите цену');
        form.appendChild(priceGroup);

        // Скидка
        const discountGroup = this.createFormGroup('Скидка (%):', 'number', 'add-discount', 'discount', '0');
        form.appendChild(discountGroup);

        // Дата выхода
        const releaseGroup = this.createFormGroup('Дата выхода:', 'text', 'add-releaseDate', 'releaseDate', 'Введите год');
        form.appendChild(releaseGroup);

        // Разработчик
        const developerGroup = this.createFormGroup('Разработчик:', 'text', 'add-developer', 'developer', 'Введите разработчика');
        form.appendChild(developerGroup);

        // Загрузка изображения с компьютера
        const imageUploadGroup = document.createElement('div');
        imageUploadGroup.className = 'form-group';
        
        const imageLabel = document.createElement('label');
        imageLabel.textContent = 'Изображение товара:';
        imageUploadGroup.appendChild(imageLabel);
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'add-image-file';
        fileInput.accept = 'image/*';
        fileInput.style.cssText = `
            display: block;
            margin-top: 8px;
            padding: 8px;
            border: 2px dashed var(--color-card-border);
            border-radius: 8px;
            width: 100%;
            cursor: pointer;
        `;
        imageUploadGroup.appendChild(fileInput);
        
        // Контейнер для превью
        const previewContainer = document.createElement('div');
        previewContainer.id = 'image-preview-container';
        previewContainer.style.cssText = `
            margin-top: 10px;
            display: none;
            text-align: center;
        `;
        
        const previewImg = document.createElement('img');
        previewImg.id = 'add-preview-img';
        previewImg.style.cssText = `
            max-width: 200px;
            max-height: 200px;
            border-radius: 8px;
            border: 2px solid var(--color-card-border);
            padding: 5px;
            object-fit: cover;
        `;
        previewImg.alt = 'Превью товара';
        previewContainer.appendChild(previewImg);
        
        const removeImageBtn = document.createElement('button');
        removeImageBtn.type = 'button';
        removeImageBtn.textContent = '✕ Удалить изображение';
        removeImageBtn.style.cssText = `
            display: block;
            margin: 8px auto 0;
            padding: 4px 12px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        removeImageBtn.addEventListener('click', () => {
            this.selectedImage = null;
            fileInput.value = '';
            previewContainer.style.display = 'none';
            previewImg.src = '';
        });
        previewContainer.appendChild(removeImageBtn);
        
        imageUploadGroup.appendChild(previewContainer);
        form.appendChild(imageUploadGroup);

        // Кнопки
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'form-buttons';

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-success';
        submitBtn.textContent = '💾 Добавить товар';
        submitBtn.style.cssText = `
            background: linear-gradient(135deg, #00b894, #00a381);
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = '❌ Отмена';
        cancelBtn.style.cssText = `
            background: #a0aec0;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
        `;

        buttonsDiv.style.cssText = `
            display: flex;
            gap: 12px;
            margin-top: 20px;
        `;
        
        buttonsDiv.appendChild(submitBtn);
        buttonsDiv.appendChild(cancelBtn);
        form.appendChild(buttonsDiv);

        formDiv.appendChild(form);
        profileContainer.appendChild(formDiv);
        mainContent.appendChild(profileContainer);

        // Обработчик загрузки файла
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.selectedImage = event.target.result;
                    previewImg.src = this.selectedImage;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Обработчик отправки формы
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNewProduct();
        });

        // Обработчик отмены
        cancelBtn.addEventListener('click', () => {
            this.isAddingProduct = false;
            this.render();
        });
    }

    saveNewProduct() {
        // Собираем данные из формы
        const newProduct = {
            title: document.getElementById('add-title').value,
            description: document.getElementById('add-description').value,
            genre: document.getElementById('add-genre').value,
            platform: document.getElementById('add-platform').value,
            price: Number(document.getElementById('add-price').value),
            discount: Number(document.getElementById('add-discount').value) || 0,
            releaseDate: document.getElementById('add-releaseDate').value,
            developer: document.getElementById('add-developer').value,
            img: this.selectedImage || '../img/placeholder.jpg',
            quatityOrders: 0,
        };

        // Проверка обязательных полей
        if (!newProduct.title || !newProduct.description || !newProduct.price) {
            this.showNotification('❌ Заполните все обязательные поля!', 'error');
            return;
        }

        // Добавляем товар
        const result = addProduct(newProduct);
        
        if (result) {
            this.showNotification('✅ Товар успешно добавлен!', 'success');
            this.isAddingProduct = false;
            this.selectedImage = null;
            
            // Возвращаемся в профиль через секунду
            setTimeout(() => {
                this.render();
            }, 1500);
        } else {
            this.showNotification('❌ Ошибка при добавлении товара', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const oldNotification = document.querySelector('.profile-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `profile-notification ${type}`;
        notification.textContent = message;
        
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
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    createInfoRow(labelText, valueText) {
        const infoRow = document.createElement('div');
        infoRow.className = 'info-row';

        const label = document.createElement('span');
        label.className = 'info-label';
        label.textContent = labelText;

        const value = document.createElement('span');
        value.className = 'info-value';
        value.textContent = valueText;

        infoRow.appendChild(label);
        infoRow.appendChild(value);

        return infoRow;
    }

    showProfileInfo() {
        const mainContent = this.clearMainContent();

        if (!mainContent) return;

        mainContent.appendChild(this.renderProfileInfo());

        const logoutBtn = document.getElementById('logout-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'switch-to-register') {
                e.preventDefault();
                this.showLogin = false;
                this.showAuthForm();
            } else if (e.target.id === 'switch-to-login') {
                e.preventDefault();
                this.showLogin = true;
                this.showAuthForm();
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.id === 'login-form') {
                e.preventDefault();
                this.handleLogin();
            } else if (e.target.id === 'register-form') {
                e.preventDefault();
                this.handleRegister();
            }
        });
    }

    handleLogin() {
        const username = document.getElementById('login-username')?.value;
        const password = document.getElementById('login-password')?.value;
        const errorDiv = document.getElementById('login-error');

        if (!username || !password) {
            if (errorDiv) {
                errorDiv.textContent = 'Пожалуйста, заполните все поля';
            }

            return;
        }

        const user = validateLogin(username, password);

        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.showProfileInfo();

            if (errorDiv) {
                errorDiv.textContent = '';
            }
        } else {
            if (errorDiv) {
                errorDiv.textContent = 'Неверное имя пользователя или пароль';
            }
        }
    }

    handleRegister() {
        const username = document.getElementById('reg-username')?.value;
        const password = document.getElementById('reg-password')?.value;
        const confirmPassword = document.getElementById('confirm-password')?.value;
        const errorDiv = document.getElementById('register-error');

        if (!username || !password || !confirmPassword) {
            if (errorDiv) {
                errorDiv.textContent = 'Пожалуйста, заполните все поля';
            }

            return;
        }

        if (username.length < 3) {
            if (errorDiv) {
                errorDiv.textContent = 'Имя пользователя должно содержать минимум 3 символа';
            }

            return;
        }

        if (password.length < 4) {
            if (errorDiv) {
                errorDiv.textContent = 'Пароль должен содержать минимум 4 символа';
            }

            return;
        }

        if (password !== confirmPassword) {
            if (errorDiv) {
                errorDiv.textContent = 'Пароли не совпадают';
            }

            return;
        }

        const existingUser = accounts.find((acc) => {
            return acc.username === username;
        });

        if (existingUser) {
            if (errorDiv) {
                errorDiv.textContent = 'Имя пользователя уже существует';
            }

            return;
        }

        const newUser = addAccount(username, password);

        this.currentUser = newUser;
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
        this.showProfileInfo();

        if (errorDiv) {
            errorDiv.textContent = '';
        }

        alert('Аккаунт успешно создан! Добро пожаловать в GameShop!');
    }

    logout() {
        this.currentUser = null;
        this.showLogin = true;
        sessionStorage.removeItem('currentUser');
        this.showAuthForm();
    }

    saveAccountsData()
    {
        const data = localStorage.getItem("gameStoreAccounts");
        if (!data){CartUtils.save("gameStoreAccounts",accounts)}  
    }
}