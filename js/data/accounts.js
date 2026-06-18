// accounts.js
const STORAGE_KEY = 'gameStoreAccounts';
const CURRENT_USER_KEY = 'gameStoreCurrentUser';

// Загрузка аккаунтов из localStorage или использование стандартных
function loadAccounts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Добавляем cart и orders если их нет
            parsed.forEach(acc => {
                if (!acc.cart) acc.cart = [];
                if (!acc.orders) acc.orders = [];
            });
            return parsed;
        } catch (e) {
            console.error('Ошибка загрузки аккаунтов:', e);
        }
    }
    // Стандартные аккаунты, если в localStorage нет данных
    const defaultAccounts = [
        {
            id: 1,
            username: "admin",
            password: "admin123",
            status: "admin",
            cart: [],
            orders: []
        },
        {
            id: 2,
            username: "user1",
            password: "user123",
            status: "user",
            cart: [],
            orders: []
        },
        {
            id: 3,
            username: "gamer",
            password: "game123",
            status: "user",
            cart: [],
            orders: []
        }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAccounts));
    return defaultAccounts;
}

// Сохранение аккаунтов в localStorage
function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// Экспортируем аккаунты (загружаем из localStorage)
export let accounts = loadAccounts();

// =============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С ТЕКУЩИМ ПОЛЬЗОВАТЕЛЕМ
// =============================================

// Получение текущего пользователя из localStorage
export function getCurrentUser() {
    try {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Ошибка загрузки текущего пользователя:', e);
    }
    return null;
}

// Установка текущего пользователя в localStorage
export function setCurrentUser(account) {
    if (account) {
        if (!account.cart) account.cart = [];
        if (!account.orders) account.orders = [];
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(account));
        console.log('✅ Пользователь сохранен:', account.username);
        return true;
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
        return false;
    }
}

// Выход из аккаунта
export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    console.log('👋 Выход выполнен');
    syncAccounts();
}

// Автологин при загрузке страницы
export function autoLogin() {
    console.log('🔄 Проверка автологина...');
    const user = getCurrentUser();
    if (!user) {
        console.log('⚠️ Автологин не выполнен: пользователь не найден');
        return null;
    }
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    
    if (account) {
        setCurrentUser(account);
        console.log('✅ Автологин выполнен для:', account.username);
        return account;
    }
    
    console.log('⚠️ Автологин не выполнен: аккаунт не найден');
    return null;
}

// =============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С АККАУНТАМИ
// =============================================

export function addAccount(username, password) {
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newAccount = {
        id: newId,
        username: username,
        password: password,
        status: "user",
        cart: [],
        orders: []
    };
    accounts.push(newAccount);
    saveAccounts(accounts);
    return newAccount;
}

export function findAccountByUsername(username) {
    return accounts.find(acc => acc.username === username);
}

export function findAccountById(id) {
    return accounts.find(acc => acc.id === id);
}

export function validateLogin(username, password) {
    console.log('🔍 Попытка входа:', username);
    
    accounts = loadAccounts();
    
    const account = findAccountByUsername(username);
    if (account && account.password === password) {
        if (!account.cart) account.cart = [];
        if (!account.orders) account.orders = [];
        saveAccounts(accounts);
        setCurrentUser(account);
        console.log('✅ Вход выполнен для:', account.username);
        return account;
    }
    
    console.log('❌ Неверный логин или пароль');
    return null;
}

export function updateAccount(id, updatedData) {
    const index = accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updatedData };
        saveAccounts(accounts);
        
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === id) {
            setCurrentUser(accounts[index]);
        }
        
        return accounts[index];
    }
    return null;
}

export function deleteAccount(id) {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === id) {
        console.warn('⚠️ Нельзя удалить текущего пользователя');
        return false;
    }
    
    accounts = accounts.filter(acc => acc.id !== id);
    saveAccounts(accounts);
    return true;
}

export function syncAccounts() {
    accounts = loadAccounts();
    return accounts;
}

// =============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С КОРЗИНОЙ
// =============================================

export function getUserCart() {
    const user = getCurrentUser();
    if (!user) {
        console.warn('⚠️ Пользователь не авторизован');
        return [];
    }
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    if (!account) {
        console.warn('⚠️ Аккаунт не найден');
        return [];
    }
    
    if (!account.cart) account.cart = [];
    return account.cart;
}

export function addToUserCart(productId, quantity = 1) {
    console.log('➕ Добавление в корзину:', productId, quantity);
    
    const user = getCurrentUser();
    if (!user) {
        console.warn('⚠️ Пользователь не авторизован');
        return false;
    }
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    if (!account) {
        console.warn('⚠️ Аккаунт не найден');
        return false;
    }
    
    if (!account.cart) account.cart = [];
    
    const existingItem = account.cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        account.cart.push({ id: productId, quantity: quantity });
    }
    
    saveAccounts(accounts);
    setCurrentUser(account);
    console.log('✅ Товар добавлен в корзину');
    return true;
}

export function removeFromUserCart(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    if (!account) return false;
    
    account.cart = (account.cart || []).filter(item => item.id !== productId);
    saveAccounts(accounts);
    setCurrentUser(account);
    return true;
}

export function updateUserCartQuantity(productId, quantity) {
    if (quantity <= 0) {
        return removeFromUserCart(productId);
    }
    
    const user = getCurrentUser();
    if (!user) return false;
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    if (!account) return false;
    
    const item = (account.cart || []).find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveAccounts(accounts);
        setCurrentUser(account);
        return true;
    }
    return false;
}

export function clearUserCart() {
    const user = getCurrentUser();
    if (!user) return false;
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    if (!account) return false;
    
    account.cart = [];
    saveAccounts(accounts);
    setCurrentUser(account);
    return true;
}

// =============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАКАЗАМИ
// =============================================

export function getUserOrders() {
    const user = getCurrentUser();
    if (!user) {
        console.warn('⚠️ Пользователь не авторизован');
        return [];
    }
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    if (!account) {
        console.warn('⚠️ Аккаунт не найден');
        return [];
    }
    
    if (!account.orders) account.orders = [];
    return account.orders;
}

export function addUserOrder(orderData) {
    console.log('📦 Добавление заказа:', orderData);
    
    const user = getCurrentUser();
    if (!user) {
        console.warn('⚠️ Пользователь не авторизован');
        return null;
    }
    
    accounts = loadAccounts();
    const account = findAccountById(user.id);
    if (!account) {
        console.warn('⚠️ Аккаунт не найден');
        return null;
    }
    
    if (!account.orders) account.orders = [];
    
    const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        ...orderData,
        userId: user.id,
        username: user.username
    };
    
    account.orders.push(newOrder);
    saveAccounts(accounts);
    setCurrentUser(account);
    console.log('✅ Заказ добавлен');
    return newOrder;
}