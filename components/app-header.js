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
                top: 0;
                width: 100%;
                height: 70px;
                background: rgba(255,255,255,0.9);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                z-index: 1000;
            }

            .logo {
                font-weight: bold;
                color: #00502d;
            }

            button {
                border: none;
                background: none;
                font-size: 20px;
                cursor: pointer;
            }
        </style>

        <header>
            <button>☰</button>
            <div class="logo">Guia Turistica de Costa Rica</div>
            <button>📍</button>
        </header>
        `;
    }
}

customElements.define('app-header', AppHeader);