export class Footer {
    constructor(containerId = 'footer-container') {
        this.container = document.getElementById(containerId);
    }

    render() {
        return `
            <footer>
                <p>&copy;ValdisHat<br>&copy;DenisChecalev<br>2006г</p>
            </footer>
        `;
    }

    init() {
        if (this.container) {
            this.container.innerHTML = this.render();
            console.log('Футер загружен');
        }
    }
}