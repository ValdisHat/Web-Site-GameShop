import { BasePage } from './basePage.js';
import { accounts, addAccount, validateLogin } from '../data/accounts.js';

export class ProfilePage extends BasePage {
    constructor() {
        super();
        this.currentUser = null;
        this.showLogin = true;
    }

    init() {
        console.log('ProfilePage initialized');
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

    showAuthForm() {
        const mainContent = document.getElementById('profile-main-container');
        
        if (mainContent) {
            if (this.showLogin) {
                mainContent.innerHTML = this.renderLoginForm();
            } else {
                mainContent.innerHTML = this.renderRegisterForm();
            }
        } else {
            console.error('profile-main-container not found!');
        }
    }

    renderLoginForm() {
        return `
            <div class="profile-container">
                <div class="auth-form">
                    <h2>Вход в аккаунт</h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="username">Имя пользователя:</label>
                            <input type="text" id="login-username" name="username" placeholder="Введите имя пользователя" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Пароль:</label>
                            <input type="password" id="login-password" name="password" placeholder="Введите пароль" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Войти</button>
                    </form>
                    <div id="login-error" class="error-message"></div>
                    <p class="auth-switch">
                        Нет аккаунта? 
                        <a href="#" id="switch-to-register">Зарегистрироваться</a>
                    </p>
                </div>
            </div>
        `;
    }

    renderRegisterForm() {
        return `
            <div class="profile-container">
                <div class="auth-form">
                    <h2>Регистрация</h2>
                    <form id="register-form">
                        <div class="form-group">
                            <label for="reg-username">Имя пользователя:</label>
                            <input type="text" id="reg-username" name="username" placeholder="Минимум 3 символа" required>
                        </div>
                        <div class="form-group">
                            <label for="reg-password">Пароль:</label>
                            <input type="password" id="reg-password" name="password" placeholder="Минимум 4 символа" required>
                        </div>
                        <div class="form-group">
                            <label for="confirm-password">Подтверждение пароля:</label>
                            <input type="password" id="confirm-password" name="confirm-password" placeholder="Повторите пароль" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Зарегистрироваться</button>
                    </form>
                    <div id="register-error" class="error-message"></div>
                    <p class="auth-switch">
                        Уже есть аккаунт? 
                        <a href="#" id="switch-to-login">Войти</a>
                    </p>
                </div>
            </div>
        `;
    }

    renderProfileInfo() {
        const statusText = this.currentUser.status === 'admin' ? '👑 Администратор' : 'Пользователь';
        const accountTypeText = this.currentUser.status === 'admin' ? 'Администратор' : 'Обычный пользователь';
        
        return `
            <div class="profile-container">
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            <img src="../img/default-avatar.png" alt="Аватар" onerror="this.src='https://via.placeholder.com/100'">
                        </div>
                        <div class="profile-status ${this.currentUser.status}">
                            ${statusText}
                        </div>
                    </div>
                    <div class="profile-details">
                        <h2>Добро пожаловать, ${this.currentUser.username}!</h2>
                        <div class="info-row">
                            <span class="info-label">ID пользователя:</span>
                            <span class="info-value">#${this.currentUser.id}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Тип аккаунта:</span>
                            <span class="info-value">${accountTypeText}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Дата регистрации:</span>
                            <span class="info-value">${new Date().toLocaleDateString('ru-RU')}</span>
                        </div>
                    </div>
                    <div class="profile-actions">
                        <button id="logout-btn" class="btn btn-danger">Выйти</button>
                    </div>
                </div>
            </div>
        `;
    }

    showProfileInfo() {
        const mainContent = document.getElementById('profile-main-container');
        
        if (mainContent) {
            mainContent.innerHTML = this.renderProfileInfo();
            
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }
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
            if (errorDiv) errorDiv.textContent = 'Пожалуйста, заполните все поля';
            return;
        }

        const user = validateLogin(username, password);
        
        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.showProfileInfo();
            if (errorDiv) errorDiv.textContent = '';
        } else {
            if (errorDiv) errorDiv.textContent = 'Неверное имя пользователя или пароль';
        }
    }

    handleRegister() {
        const username = document.getElementById('reg-username')?.value;
        const password = document.getElementById('reg-password')?.value;
        const confirmPassword = document.getElementById('confirm-password')?.value;
        const errorDiv = document.getElementById('register-error');

        if (!username || !password || !confirmPassword) {
            if (errorDiv) errorDiv.textContent = 'Пожалуйста, заполните все поля';
            return;
        }

        if (username.length < 3) {
            if (errorDiv) errorDiv.textContent = 'Имя пользователя должно содержать минимум 3 символа';
            return;
        }

        if (password.length < 4) {
            if (errorDiv) errorDiv.textContent = 'Пароль должен содержать минимум 4 символа';
            return;
        }

        if (password !== confirmPassword) {
            if (errorDiv) errorDiv.textContent = 'Пароли не совпадают';
            return;
        }

        const existingUser = accounts.find(acc => acc.username === username);
        if (existingUser) {
            if (errorDiv) errorDiv.textContent = 'Имя пользователя уже существует';
            return;
        }

        const newUser = addAccount(username, password);
        this.currentUser = newUser;
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
        this.showProfileInfo();
        
        if (errorDiv) errorDiv.textContent = '';
        alert('Аккаунт успешно создан! Добро пожаловать в GameShop!');
    }

    logout() {
        this.currentUser = null;
        this.showLogin = true;
        sessionStorage.removeItem('currentUser');
        this.showAuthForm();
    }
}