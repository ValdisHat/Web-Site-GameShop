import { NAVIGATION_LINKS } from '../data/constants.js';
export class Header {
    constructor(containerId = "header-container") {
        this.container = document.getElementById(containerId);
        

        const pathParts = window.location.pathname.split('/');
        this.currentPage = pathParts.pop() || 'Home.html';
    }

    render() {
        const navItemsHTML = NAVIGATION_LINKS.slice(1, 4).map(({ href, title, img}) => {
            const fileName = href.replace('./', '');

            return `<li><a href="./${fileName}">
                    <img src="${img}" alt="">
                    ${title}
                    </a></li>`;
        }).join('');

        return `
            <header class="menu-container">
                <a class="logo">
                    <img src="../../img/LogoForSite.png" alt="GameShop Logo">
                </a>
                <button class="catalog-button" aria-label="Toggle menu">
                    <h2 class="catalog-title">Каталог</h2>
                </button>
                <input type="text" class="search-input" placeholder="Search...">
                <nav class="menu">
                    <ul>
                        ${navItemsHTML}
                    </ul>
                </nav>
            </header>
        `;
    }

    init() {
        if (this.container) {
            this.container.innerHTML = this.render();
            console.log('Header загружен');
        }
    }
}