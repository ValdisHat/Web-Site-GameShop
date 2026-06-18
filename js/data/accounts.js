// accounts.js
const STORAGE_KEY = 'gameStoreAccounts';

// Загрузка аккаунтов из localStorage или использование стандартных
function loadAccounts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Ошибка загрузки аккаунтов:', e);
        }
    }
    // Стандартные аккаунты, если в localStorage нет данных
    return [
        {
            id: 1,
            username: "admin",
            password: "admin123",
            status: "admin",
        },
        {
            id: 2,
            username: "user1",
            password: "user123",
            status: "user",
        },
        {
            id: 3,
            username: "gamer",
            password: "game123",
            status: "user",

        }
    ];
}

// Сохранение аккаунтов в localStorage
function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// Экспортируем аккаунты (загружаем из localStorage)
export let accounts = loadAccounts();

// Сохраняем при любых изменениях
export function addAccount(username, password) {
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newAccount = {
        id: newId,
        username: username,
        password: password,
        status: "user",
    };
    accounts.push(newAccount);
    saveAccounts(accounts);
    return newAccount;
}

export function findAccountByUsername(username) {
    return accounts.find(acc => acc.username === username);
}

export function validateLogin(username, password) {
    const account = findAccountByUsername(username);
    if (account && account.password === password) {
        return account;
    }
    return null;
}

// Функция для обновления аккаунта (например, смена пароля)
export function updateAccount(id, updatedData) {
    const index = accounts.findIndex(acc => acc.id === id);
    if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updatedData };
        saveAccounts(accounts);
        return accounts[index];
    }
    return null;
}

// Функция для удаления аккаунта
export function deleteAccount(id) {
    accounts = accounts.filter(acc => acc.id !== id);
    saveAccounts(accounts);
}

// Функция для синхронизации (принудительная перезагрузка из localStorage)
export function syncAccounts() {
    accounts = loadAccounts();
    return accounts;
}