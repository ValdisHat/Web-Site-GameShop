import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import { HomePage } from './pages/homePage.js';
import { ProfilePage } from './pages/profilePage.js';
import { ProductPage } from './pages/productPage.js';
import { OrdersPage } from './pages/ordersPage.js';
import { CartPage } from './pages/cartPage.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    switch (currentPage) {
        case 'Home.html':
            new HomePage().init();
            break;
        case 'product.html':
            new ProductPage().init();
            break;
        case 'orders.html':
            new OrdersPage().init();
            break;
        case 'cart.html':
            new CartPage().init();
            break;
        case 'profile.html':
            new ProfilePage().init();
            break;
        default:
            const header = new Header('header-container');
            header.init();
            const footer = new Footer('footer-container');
            footer.init();
            break;
    }
});