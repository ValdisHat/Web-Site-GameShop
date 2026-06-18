import { NAVIGATION_LINKS } from '../data/constants.js';
import { Search } from './search.js';
export class Header {
    constructor(containerId = "header-container") {
        this.container = document.getElementById(containerId);
        

        const pathParts = window.location.pathname.split('/');
        this.currentPage = pathParts.pop() || 'Home.html';
    }

    render() {
        if (!this.container){
            console.log(`${this.container}, не обнаружен!!!`);
            return;
        }

        const header = document.createElement("header")
        header.className = "menu-container";

        const logo = document.createElement("a");
        logo.className = "logo";
        logo.href = NAVIGATION_LINKS[0].href;

        const img = document.createElement("img");
        img.src = "../../img/LogoForSite.png";
        img.alt = "GameShop Logo";

        logo.appendChild(img);

        const catalog = document.createElement("button");
        catalog.className = "catalog-button";
        catalog.textContent = "Каталог";

        const search_div = document.createElement("div");
        search_div.className = "search";

        const input_search = document.createElement("input");
        input_search.className = "search-input";
        input_search.placeholder = "Search...";

        const ul = document.createElement("ul");
        ul.className = "search-suggestions";

        search_div.appendChild(input_search);
        search_div.appendChild(ul);

        const nav = this.CreateNavMenu(NAVIGATION_LINKS.slice(1,4))

        header.appendChild(logo);
        header.appendChild(catalog);
        header.appendChild(search_div);
        header.appendChild(nav);
        this.container.appendChild(header);

        const search = new Search();
        search.init();
    }

    CreateNavMenu(links)
    {
            const nav = document.createElement("nav");
            nav.className = "menu";

            const ul = document.createElement("ul");

            links.forEach(link => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = link.href;
                
                const img = document.createElement("img");
                img.className = "default-img";
                img.src = link.img;
                const img_hover = document.createElement("img");
                img_hover.className = "hover-img";
                img_hover.src = link.img_hover;

                const p = document.createElement("p");
                p.textContent = link.title;

                a.appendChild(img);
                a.appendChild(img_hover);
                a.appendChild(p);

                li.appendChild(a);
                ul.appendChild(li); 
            });

            nav.appendChild(ul)
            return nav;
    }

    attachButtonEvent(button, func)
    {
        button.addEventListener('click', () => {
            func();
        });
    }
}