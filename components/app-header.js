class AppHeader extends HTMLElement {
    static get observedAttributes() {
        return ['active-region', 'location'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._activeRegion = null;
    }
    
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 2000;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(12px);
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
                    transition: background 0.2s;
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
                    cursor: pointer;
                    user-select: none;
                    transition: opacity 0.2s;
                }
                h1:hover {
                    opacity: 0.85;
                }
                
                .location-chip {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #e0f2f1;
                    color: #004d40;
                    border-radius: 99px;
                    padding: 6px 14px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 1px solid #b2dfdb;
                    transition: all 0.2s ease;
                }
                .location-chip svg {
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                }

                /* DRAWER STYLE */
                .drawer-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 77, 64, 0.4);
                    backdrop-filter: blur(4px);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                    z-index: 1009;
                }
                .drawer-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .drawer {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 280px;
                    max-width: 85%;
                    background: #ffffff !important;
                    box-shadow: 8px 0 30px rgba(0, 77, 64, 0.15);
                    z-index: 1010;
                    transform: translateX(-100%);
                    transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                    display: flex;
                    flex-direction: column;
                }
                .drawer.open {
                    transform: translateX(0);
                }
                .drawer-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid #edf2f7;
                }
                .drawer-header h2 {
                    font-size: 1.3rem;
                    color: #004d40;
                    margin: 0;
                    font-weight: 750;
                    letter-spacing: -0.5px;
                }
                .btn-close {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #4a5568;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px;
                    border-radius: 50%;
                    transition: background-color 0.2s;
                }
                .btn-close:hover {
                    background-color: #f4f6f8;
                }
                .btn-close svg {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                }
                .drawer-content {
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .drawer-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    color: #4a5568;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                }
                .drawer-item:hover {
                    background-color: #f0f4f8;
                    color: #004d40;
                }
                .drawer-item.active {
                    background-color: #e0f2f1;
                    color: #004d40;
                }
                .region-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .region-dot.caribe { background: #009688; }
                .region-dot.pacifico-norte { background: #3f51b5; }
                .region-dot.central { background: #ff9800; }
                .region-dot.pacifico-sur { background: #e91e63; }
            </style>
            
            <header class="top-nav">
                <div class="left-section">
                    <button class="btn-icon btn-menu" aria-label="Menú principal">
                        <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                    </button>
                    <h1 id="nav-title">Guía Turística de Costa Rica</h1>
                </div>
                
                <div class="location-chip" id="location-btn">
                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    <span id="location-text">Costa Rica</span>
                </div>
            </header>

            <div class="drawer-overlay" id="drawer-overlay"></div>
            <div class="drawer" id="drawer">
                <div class="drawer-header">
                    <h2>Regiones</h2>
                    <button class="btn-close" id="btn-close-drawer" aria-label="Cerrar menú">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
                <div class="drawer-content">
                    <div class="drawer-item" data-region="Caribe">
                        <span class="region-dot caribe"></span>
                        <span>Caribe</span>
                    </div>
                    <div class="drawer-item" data-region="Pacífico Norte">
                        <span class="region-dot pacifico-norte"></span>
                        <span>Pacífico Norte</span>
                    </div>
                    <div class="drawer-item" data-region="Central">
                        <span class="region-dot central"></span>
                        <span>Central</span>
                    </div>
                    <div class="drawer-item" data-region="Pacífico Sur">
                        <span class="region-dot pacifico-sur"></span>
                        <span>Pacífico Sur</span>
                    </div>
                </div>
            </div>
        `;

        // Toggles del Drawer
        const btnMenu = this.shadowRoot.querySelector('.btn-menu');
        const btnClose = this.shadowRoot.getElementById('btn-close-drawer');
        const overlay = this.shadowRoot.getElementById('drawer-overlay');
        const drawer = this.shadowRoot.getElementById('drawer');

        const toggleDrawer = (show) => {
            drawer.classList.toggle('open', show);
            overlay.classList.toggle('open', show);
        };

        btnMenu.addEventListener('click', () => toggleDrawer(true));
        btnClose.addEventListener('click', () => toggleDrawer(false));
        overlay.addEventListener('click', () => toggleDrawer(false));

        // Click en el título (Home)
        const title = this.shadowRoot.getElementById('nav-title');
        title.addEventListener('click', () => {
            window.location.hash = '#/';
        });

        // Click en items del drawer
        const drawerItems = this.shadowRoot.querySelectorAll('.drawer-item');
        drawerItems.forEach(item => {
            item.addEventListener('click', () => {
                const regionName = item.getAttribute('data-region');
                toggleDrawer(false);
                this.dispatchEvent(new CustomEvent('region-selected', {
                    bubbles: true,
                    composed: true,
                    detail: { region: regionName }
                }));
            });
        });

        this.updateActiveRegionState();
    }

    disconnectedCallback() {
        // No hashchange event listener is bound on window now inside app-header,
        // which prevents memory leaks and complies with the unbinding design.
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'active-region' && oldValue !== newValue) {
            this._activeRegion = newValue;
            this.updateActiveRegionState();
        }
        if (name === 'location' && oldValue !== newValue) {
            this.updateLocationText(newValue);
        }
    }

    updateActiveRegionState() {
        if (!this.shadowRoot) return;
        const drawerItems = this.shadowRoot.querySelectorAll('.drawer-item');
        drawerItems.forEach(item => item.classList.remove('active'));

        if (this._activeRegion) {
            drawerItems.forEach(item => {
                if (item.getAttribute('data-region').toLowerCase() === this._activeRegion.toLowerCase()) {
                    item.classList.add('active');
                }
            });
        }
    }

    updateLocationText(text) {
        if (!this.shadowRoot) return;
        const locationEl = this.shadowRoot.getElementById('location-text');
        if (locationEl) {
            locationEl.textContent = text || 'Costa Rica';
        }
    }
}

customElements.define('app-header', AppHeader);