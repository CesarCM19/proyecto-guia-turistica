class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="top-nav">
                <div class="header-content">
                    <h1>🌿 Guía Turística De Costa Rica</h1>
                    <p>Explora Costa Rica</p>
                </div>
            </header>
        `;
    }
}

customElements.define('app-header', AppHeader);