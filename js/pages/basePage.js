import { Header } from '../components/header.js';
import { Footer } from '../components/footer.js';

export class BasePage {
    constructor() {
        this.header = new Header('header-container');
        this.footer = new Footer('footer-container');
    }

    init() {
        
        this.header.init();
        this.footer.init();
    }
}