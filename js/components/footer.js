export class Footer {
    constructor(containerId = 'footer-container') {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container){
            console.log(`${this.container}, не обнаружен!!!`);
            return;
        }

        const footer = document.createElement("footer");
        const p = document.createElement("p");
        p.innerHTML = `&copy;ValdisHat<br>&copy;DenisChecalev<br>2006г`;

        footer.appendChild(p);
        this.container.appendChild(footer);
    }
}