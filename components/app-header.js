class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
        <style>
            header {
                position: fixed;
                top: 0; width: 100%;
                height: 70px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(15px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 30px;
                z-index: 1000;
                border-bottom: 1px solid rgba(0,0,0,0.05);
                font-family: sans-serif;
            }
            .logo { font-weight: 800; font-size: 20px; color: #00502d; }
            .btn { cursor: pointer; font-size: 24px; border: none; background: none; }
        </style>
        <header>
            <button class="btn">☰</button>
            <div class="logo">Pura Vida Guide</div>
            <button class="btn">📍</button>
        </header>
        `;
    }
}
customElements.define('app-header', AppHeader);