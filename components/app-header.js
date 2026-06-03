class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 1000;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(8px);
                    border-bottom: 1px solid #edf2f7;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .top-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 72px;
                    padding: 0 24px;
                    max-width: 1440px;
                    margin: 0 auto;
                }
                .left-section {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .btn-icon {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #004d40;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border-radius: 8px;
                }
                .btn-icon:hover {
                    background: #f4f6f8;
                }
                .btn-icon svg {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                }
                h1 {
                    font-size: 1.25rem;
                    color: #004d40;
                    font-weight: 700;
                    margin: 0;
                    letter-spacing: -0.5px;
                }
                .nav-links {
                    display: none;
                    gap: 32px;
                }
                @media (min-width: 768px) {
                    .nav-links { display: flex; }
                }
                .nav-link {
                    color: #4a5568;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .nav-link:hover, .nav-link.active {
                    color: #004d40;
                }
            </style>
            
            <header class="top-nav">
                <div class="left-section">
                    <button class="btn-icon" aria-label="Menú principal">
                        <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                    </button>
                    <h1>Guía Turística de Costa Rica</h1>
                </div>
                
                <div class="nav-links">
                    <span class="nav-link active">Explorar</span>
                    <span class="nav-link">Regiones</span>
                    <span class="nav-link">Audio</span>
                </div>
                
                <button class="btn-icon" aria-label="Ver mapa">
                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </button>
            </header>
        `;

        const btnMenu = this.shadowRoot.querySelector('button[aria-label="Menú principal"]');
        btnMenu.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('abrir-regiones', {
                bubbles: true,
                composed: true
            }));
        });

        const links = this.shadowRoot.querySelectorAll('.nav-link');
        links.forEach((link, idx) => {
            link.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                this.dispatchEvent(new CustomEvent('nav-change', {
                    bubbles: true,
                    composed: true,
                    detail: { index: idx }
                }));
            });
        });
    }
}

customElements.define('app-header', AppHeader);