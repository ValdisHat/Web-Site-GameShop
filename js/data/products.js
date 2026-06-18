// products.js
const PRODUCTS_STORAGE_KEY = 'gameStoreProducts';

// Стандартные товары
const defaultProducts = [
    {
        id: 1,
        title: "Hollow Knight",
        description: "Атмосферная метроидвания про маленького рыцаря в загадочном подземном королевстве.",
        img: "../img/HollowKnight.jpg",
        genre: "Adventure",
        platform: "PC",
        price: 499,
        discount: 0,
        releaseDate: "2017",
        developer: "Team Cherry",
        quantityOrders: 0,
    },
    {
        id: 2,
        title: "Stardew Valley",
        description: "Уютная фермерская RPG, где игрок развивает ферму, общается с жителями и исследует шахты.",
        genre: "Simulation",
        platform: "PC",
        price: 399,
        discount: 0,
        releaseDate: "2016",
        developer: "ConcernedApe",
        img: "../img/SW.jpeg",
        quantityOrders: 0,
    },
    {
        id: 3,
        title: "The Witcher 3: Wild Hunt",
        description: "Ролевая игра в открытом мире о ведьмаке Геральте, охоте на чудовищ и сложных моральных выборах.",
        genre: "RPG",
        platform: "PC",
        price: 1199,
        discount: 0,
        releaseDate: "2015",
        developer: "CD Projekt Red",
        img: "../img/Ведьмак.jpeg",
        quantityOrders: 0,
    },
    {
        id: 4,
        title: "Cyberpunk 2077",
        description: "Футуристическая RPG в городе Найт-Сити, где игрок берёт на себя роль наёмника Ви.",
        genre: "RPG",
        platform: "PC",
        price: 1999,
        discount: 0,
        releaseDate: "2020",
        developer: "CD Projekt Red",
        img: "../img/киберпунк.jpeg",
        quantityOrders: 0,
    },
    {
        id: 5,
        title: "Red Dead Redemption 2",
        description: "Приключенческий экшен в открытом мире о банде преступников на закате эпохи Дикого Запада.",
        genre: "Action",
        platform: "PC",
        price: 2499,
        discount: 0,
        releaseDate: "2018",
        developer: "Rockstar Games",
        img: "../img/Red.jpeg",
        quantityOrders: 3,
    },
    {
        id: 6,
        title: "Grand Theft Auto V",
        description: "Криминальный экшен в открытом мире с тремя главными героями и множеством активностей.",
        genre: "Action",
        platform: "PC",
        price: 1499,
        discount: 0,
        releaseDate: "2013",
        developer: "Rockstar North",
        img: "../img/GTA5.jpeg",
        quantityOrders: 5,
    },
    {
        id: 7,
        title: "Minecraft",
        description: "Песочница, где игрок может строить, исследовать, добывать ресурсы и выживать в случайно созданном мире.",
        genre: "Sandbox",
        platform: "PC",
        price: 999,
        discount: 0,
        releaseDate: "2011",
        developer: "Mojang Studios",
        img: "../img/minecraft.jpeg",
        quantityOrders: 6,
    },
    {
        id: 8,
        title: "Terraria",
        description: "Двухмерная песочница с исследованием, строительством, крафтом, боссами и приключениями.",
        genre: "Adventure",
        platform: "PC",
        price: 299,
        discount: 0,
        releaseDate: "2011",
        developer: "Re-Logic",
        img: "../img/teraria.jpeg",
        quantityOrders: 0,
    },
    {
        id: 9,
        title: "Celeste",
        description: "Платформер о восхождении на гору Селеста, сложных испытаниях и преодолении внутренних страхов.",
        genre: "Platformer",
        platform: "PC",
        price: 499,
        discount: 0,
        releaseDate: "2018",
        developer: "Maddy Makes Games",
        img: "../img/celeste.png",
        quantityOrders: 0,
    },
    {
        id: 10,
        title: "Dead Cells",
        description: "Динамичный rogue-lite экшен с процедурными уровнями, быстрыми боями и множеством оружия.",
        genre: "Roguelike",
        platform: "PC",
        price: 699,
        discount: 0,
        releaseDate: "2018",
        developer: "Motion Twin",
        img: "../img/dc.jpeg",
        quantityOrders: 0,
    },
    {
        id: 11,
        title: "Hades",
        description: "Rogue-like экшен о попытках Загрея выбраться из подземного царства Аида.",
        genre: "Roguelike",
        platform: "PC",
        price: 799,
        discount: 0,
        releaseDate: "2020",
        developer: "Supergiant Games",
        img: "../img/hades.jpeg",
        quantityOrders: 0,
    },
    {
        id: 12,
        title: "Portal 2",
        description: "Головоломка от первого лица с порталами, юмором и необычными физическими задачами.",
        genre: "Puzzle",
        platform: "PC",
        price: 399,
        discount: 0,
        releaseDate: "2011",
        developer: "Valve",
        img: "../img/portal2.jpeg",
        quantityOrders: 0,
    },
    {
        id: 13,
        title: "Left 4 Dead 2",
        description: "Кооперативный шутер про выживание во время зомби-апокалипсиса.",
        genre: "Shooter",
        platform: "PC",
        price: 399,
        discount: 0,
        releaseDate: "2009",
        developer: "Valve",
        img: "../img/Left4Dead.jpg",
        quantityOrders: 0,
    },
    {
        id: 14,
        title: "DOOM Eternal",
        description: "Быстрый шутер от первого лица, где игрок сражается с демонами в агрессивном боевом ритме.",
        genre: "Shooter",
        platform: "PC",
        price: 1599,
        discount: 0,
        releaseDate: "2020",
        developer: "id Software",
        img: "../img/DoomEternal.jpg",
        quantityOrders: 0,
    },
    {
        id: 15,
        title: "Dark Souls III",
        description: "Мрачная action-RPG с высокой сложностью, атмосферным миром и напряжёнными битвами с боссами.",
        genre: "RPG",
        platform: "PC",
        price: 1999,
        discount: 0,
        releaseDate: "2016",
        developer: "FromSoftware",
        img: "../img/Darksouls3.jpg",
        quantityOrders: 0,
    },
    {
        id: 16,
        title: "Elden Ring",
        description: "Масштабная action-RPG в открытом мире с исследованием, сложными боями и богатым лором.",
        genre: "RPG",
        platform: "PC",
        price: 2999,
        discount: 0,
        releaseDate: "2022",
        developer: "FromSoftware",
        img: "../img/EldenRing.jpg",
        quantityOrders: 0,
    },
    {
        id: 17,
        title: "Among Us",
        description: "Многопользовательская игра о команде космического корабля, среди которой скрываются предатели.",
        genre: "Party",
        platform: "PC",
        price: 199,
        discount: 0,
        releaseDate: "2018",
        developer: "Innersloth",
        img: "../img/AmongUs.jpg",
        quantityOrders: 1,
    },
    {
        id: 18,
        title: "Cuphead",
        description: "Сложный run and gun платформер с визуальным стилем мультфильмов 1930-х годов.",
        genre: "Platformer",
        platform: "PC",
        price: 599,
        discount: 0,
        releaseDate: "2017",
        developer: "Studio MDHR",
        img: "../img/CupHead.jpg",
        quantityOrders: 0,
    },
    {
        id: 19,
        title: "Disco Elysium",
        description: "Необычная ролевая игра о детективе, расследовании убийства и сложных диалогах.",
        genre: "RPG",
        platform: "PC",
        price: 999,
        discount: 0,
        releaseDate: "2019",
        developer: "ZA/UM",
        img: "../img/Disco_Elysium.png",
        quantityOrders: 0,
    },
    {
        id: 20,
        title: "The Binding of Isaac: Rebirth",
        description: "Rogue-like игра с процедурными подземельями, множеством предметов и мрачной атмосферой.",
        genre: "Roguelike",
        platform: "PC",
        price: 499,
        discount: 0,
        releaseDate: "2014",
        developer: "Nicalis",
        img: "../img/isaac.jpg",
        quantityOrders: 0,
    },
];

// Загрузка товаров из localStorage
function loadProducts() {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Ошибка загрузки товаров:', e);
        }
    }
    // Если в localStorage нет данных, сохраняем стандартные
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
}

// Сохранение товаров в localStorage
function saveProducts(productsData) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsData));
}

// Загружаем товары
let products = loadProducts();

// ЭКСПОРТ ФУНКЦИЙ
export function getProducts() {
    return products;
}

export function syncProducts() {
    products = loadProducts();
    return products;
}

export function updateProduct(id, updatedData) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        // Сохраняем старый id и обновляем остальные данные
        products[index] = { 
            id: products[index].id,
            ...updatedData 
        };
        // Сохраняем в localStorage
        saveProducts(products);
        console.log('✅ Товар обновлен:', products[index]);
        return products[index];
    }
    console.error('❌ Товар с id', id, 'не найден');
    return null;
}

export function addProduct(productData) {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
        id: newId,
        ...productData
    };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
}

export function findProductById(id) {
    return products.find(product => product.id === id);
}

export function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveProducts(products);
}

export function getProductsByGenre(genre) {
    return products.filter(p => p.genre.toLowerCase() === genre.toLowerCase());
}

export function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
        p.title.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.developer.toLowerCase().includes(searchTerm)
    );
}

// Функция для сброса товаров к стандартным
export function resetProductsToDefault() {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
    products = defaultProducts;
    return products;
}

// Экспортируем продукты для обратной совместимости
export { products };
