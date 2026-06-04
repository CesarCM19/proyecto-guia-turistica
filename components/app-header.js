class AppHeader extends HTMLElement {
    static get observedAttributes() {
        return ['active-region'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._activeRegion = null;
        this._hashChangeHandler = () => this.syncActiveTab();
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
                    align-items: center;
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
                    display: inline-flex;
                    align-items: center;
                    user-select: none;
                }
                .nav-link:hover, .nav-link.active {
                    color: #004d40;
                }
                
                /* DROPDOWN STYLES */
                .dropdown {
                    position: relative;
                    display: inline-block;
                }
                .dropdown-content {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: white;
                    min-width: 180px;
                    box-shadow: 0px 8px 24px rgba(0,0,0,0.12);
                    z-index: 1010;
                    border-radius: 16px;
                    padding: 8px 0;
                    margin-top: 12px;
                    border: 1px solid #edf2f7;
                    animation: fadeIn 0.2s ease-out;
                }
                .dropdown:hover .dropdown-content {
                    display: block;
                }
                .dropdown-item {
                    color: #4a5568;
                    padding: 12px 20px;
                    text-decoration: none;
                    display: block;
                    font-weight: 500;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    text-align: left;
                    white-space: nowrap;
                }
                .dropdown-item:hover, .dropdown-item.active {
                    background-color: #e0f2f1;
                    color: #004d40;
                    font-weight: 600;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, 4px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
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
                    <span class="nav-link" id="nav-explorar">Explorar</span>
                    <div class="dropdown">
                        <span class="nav-link" id="nav-regiones">
                            Regiones
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 4px; transition: transform 0.2s;"><path d="M7 10l5 5 5-5z"/></svg>
                        </span>
                        <div class="dropdown-content">
                            <span class="dropdown-item" data-region="Caribe">Caribe</span>
                            <span class="dropdown-item" data-region="Pacífico Norte">Pacífico Norte</span>
                            <span class="dropdown-item" data-region="Central">Central</span>
                            <span class="dropdown-item" data-region="Pacífico Sur">Pacífico Sur</span>
                        </div>
                    </div>
                    <span class="nav-link" id="nav-audio">Audio</span>
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

        // Configurar los items del menú desplegable de regiones
        const dropdownItems = this.shadowRoot.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se propague el evento al botón de regiones padre
                const regionName = item.getAttribute('data-region');
                this.dispatchEvent(new CustomEvent('region-selected', {
                    bubbles: true,
                    composed: true,
                    detail: { region: regionName }
                }));
            });
        });

        // Sincronización de ruta activa al arrancar
        this.syncActiveTab();
        window.addEventListener('hashchange', this._hashChangeHandler);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._hashChangeHandler);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active-region' && oldValue !== newValue) {
            this._activeRegion = newValue;
            this.updateActiveRegionState();
        }
    }

    updateActiveRegionState() {
        if (!this.shadowRoot) return;
        const dropdownItems = this.shadowRoot.querySelectorAll('.dropdown-item');
        const parentLinkRegiones = this.shadowRoot.querySelector('#nav-regiones');
        
        dropdownItems.forEach(item => item.classList.remove('active'));

        if (this._activeRegion) {
            let found = false;
            dropdownItems.forEach(item => {
                if (item.getAttribute('data-region').toLowerCase() === this._activeRegion.toLowerCase()) {
                    item.classList.add('active');
                    found = true;
                }
            });
            if (found && parentLinkRegiones) {
                parentLinkRegiones.classList.add('active');
            }
        }
    }

    syncActiveTab() {
        if (!this.shadowRoot) return;
        const hash = window.location.hash || '#/';
        const links = this.shadowRoot.querySelectorAll('.nav-link');
        links.forEach(l => l.classList.remove('active'));

        const linkExplorar = this.shadowRoot.querySelector('#nav-explorar');
        const parentLinkRegiones = this.shadowRoot.querySelector('#nav-regiones');
        const linkAudio = this.shadowRoot.querySelector('#nav-audio');

        if (hash === '#/' || hash === '' || hash.startsWith('#/destino/')) {
            if (linkExplorar) linkExplorar.classList.add('active');
        } else if (hash === '#/regiones' || hash.startsWith('#/region/')) {
            if (parentLinkRegiones) parentLinkRegiones.classList.add('active');
            this.updateActiveRegionState();
        } else if (hash === '#/audios') {
            if (linkAudio) linkAudio.classList.add('active');
        }
    }
}

customElements.define('app-header', AppHeader);