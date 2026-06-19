// accounts.js
const STORAGE_KEY = 'gameStoreAccounts';

const DAY_MS = 24 * 60 * 60 * 1000;

function getYesterdayDate() {
    return Date.now() - DAY_MS;
}

function getCurrentDate() {
    return Date.now();
}

function getRandomAvatar() {
    const randomNumber = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${randomNumber}`;
}

function addMissingDataToAccounts(accounts) {
    return accounts.map((account) => {
        return {
            ...account,
            img: account.img || getRandomAvatar(),
            createdAt: account.createdAt || getYesterdayDate()
        };
    });
}

// Загрузка аккаунтов из localStorage или использование стандартных
function loadAccounts() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
        try {
            const parsedAccounts = JSON.parse(stored);
            const accountsWithData = addMissingDataToAccounts(parsedAccounts);

            saveAccounts(accountsWithData);

            return accountsWithData;
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
            createdAt: getYesterdayDate()
        },
        {
            id: 2,
            username: "user1",
            password: "user123",
            status: "user",
            createdAt: getYesterdayDate()
        },
        {
            id: 3,
            username: "gamer",
            password: "game123",
            status: "user",
            createdAt: getYesterdayDate()
        }
    ];

    const accountsWithData = addMissingDataToAccounts(defaultAccounts);

    saveAccounts(accountsWithData);

    return accountsWithData;
}

// Сохранение аккаунтов в localStorage
function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// Экспортируем аккаунты
export let accounts = loadAccounts();

export function addAccount(username, password) {
    const newId = accounts.length > 0
        ? Math.max(...accounts.map((a) => a.id)) + 1
        : 1;

    const newAccount = {
        id: newId,
        username: username,
        password: password,
        status: "user",
        img: getRandomAvatar(),
        createdAt: getCurrentDate()
    };

    accounts.push(newAccount);
    saveAccounts(accounts);

    return newAccount;
}

export function findAccountByUsername(username) {
    return accounts.find((acc) => {
        return acc.username === username;
    });
}

export function validateLogin(username, password) {
    const account = findAccountByUsername(username);

    if (account && account.password === password) {
        return account;
    }

    return null;
}

export function updateAccount(id, updatedData) {
    const index = accounts.findIndex((acc) => {
        return acc.id === id;
    });

    if (index !== -1) {
        accounts[index] = {
            ...accounts[index],
            ...updatedData
        };

        saveAccounts(accounts);

        return accounts[index];
    }

    return null;
}

export function deleteAccount(id) {
    accounts = accounts.filter((acc) => {
        return acc.id !== id;
    });

    saveAccounts(accounts);
}

export function syncAccounts() {
    accounts = loadAccounts();
    return accounts;
}