// js/main.js
import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import { HomePage } from './pages/homePage.js';
import { ProfilePage } from './pages/profilePage.js';
import { ProductPage } from './pages/productPage.js';
import { OrdersPage } from './pages/ordersPage.js';
import { CartPage } from './pages/cartPage.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('Current page:', currentPage);

    // Загружаем header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        const header = new Header('header-container');
        header.init();
    }

    // Загружаем footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        const footer = new Footer('footer-container');
        footer.init();
    }

    // Загружаем соответствующую страницу
    switch (currentPage) {
        case 'Home.html':
            console.log('Loading HomePage');
            new HomePage().init();
            break;
        case 'product.html':
            console.log('Loading ProductPage');
            new ProductPage().init();
            break;
        case 'orders.html':
            console.log('Loading OrdersPage');
            new OrdersPage().init();
            break;
        case 'cart.html':
            console.log('Loading CartPage');
            new CartPage().init();
            break;
        case 'profile.html':
            console.log('Loading ProfilePage');
            new ProfilePage().init();
            break;
        default:
            console.log('Unknown page or default');
            if (document.getElementById('main-content')) {
                new HomePage().init();
            }
            break;
    }
});