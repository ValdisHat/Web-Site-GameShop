import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import { HomePage } from './pages/homePage.js';

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'Home.html':
            new HomePage().init();
            break;
        case 'orders.html':
            new Orders().init();
            break;
        case 'cart.html':
            new Cart().init();
            break;
        case 'portfolio.html':
            new Portfolio().init();
            break;
        case 'profile.html':
            new Profile().init();
            break;
        default:
            const header = new Header('header-container');
            header.init();
            const footer = new Footer('footer-container');
            footer.init();
            break;
    }
});