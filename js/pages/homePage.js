import { BasePage } from './basePage.js';

export class HomePage extends BasePage {
    constructor() {
        super();
    }
    init() {
        super.init();
        console.log('Главная страница запущена');
    }
}