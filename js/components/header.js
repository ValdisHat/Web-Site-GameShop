import { NAVIGATION_LINKS } from '../data/constants.js';
import { Search } from './search.js';
export class Header {
    constructor(containerId = "header-container") {
        this.container = document.getElementById(containerId);
        

        const pathParts = window.location.pathname.split('/');
        this.currentPage = pathParts.pop() || 'Home.html';
    }

    render() {
        const navItemsHTML = NAVIGATION_LINKS.slice(1, 4).map(({ href, title, img, img_hover}) => {
            const fileName = href.replace('./', '');

            return `<li><a href="./${fileName}">
                    <img src="${img}" alt="" class="default-img">
                    <img src="${img_hover}" alt="" class="hover-img">
                    ${title}
                    </a></li>`;
        }).join('');

        return `
            <header class="menu-container">
                <a class="logo" href="./Home.html">
                    <img src="../../img/LogoForSite.png" alt="GameShop Logo">
                </a>
                <div class="search">
                    <input type="text" class="search-input" placeholder="Search...">
                    <ul class="search-suggestions"></ul>
                </div>
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
            this.container.innerHTML = this.render()
            
            const search = new Search();
            search.init();

            console.log('Header загружен');
        }
    }
}