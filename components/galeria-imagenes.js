class GaleriaImagenes extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.imagenes = [];
        this.indiceActual = 0;
    }

    connectedCallback() {
        if (this.imagenes.length > 0) {
            this.render();
        }
    }

    static get observedAttributes() {
        return ['imagenes'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'imagenes' && newValue) {
            try {
                this.imagenes = JSON.parse(newValue);
                this.indiceActual = 0;
                this.render();
            } catch (e) {
                console.error("Error al parsear el atributo de imágenes:", e);
            }
        }
    }

    mostrarImagen(indice) {
        if (this.imagenes.length === 0) return;
        if (indice < 0) {
            this.indiceActual = this.imagenes.length - 1;
        } else if (indice >= this.imagenes.length) {
            this.indiceActual = 0;
        } else {
            this.indiceActual = indice;
        }
        this.actualizarVista();
    }

    actualizarVista() {
        const imgEl = this.shadowRoot.querySelector('.imagen-activa');
        const indicador = this.shadowRoot.querySelector('.indicador');
        
        if (imgEl && this.imagenes.length > 0) {
            imgEl.src = this.imagenes[this.indiceActual];
            imgEl.alt = `Fotografía ${this.indiceActual + 1} del destino turístico`;
            indicador.textContent = `${this.indiceActual + 1} / ${this.imagenes.length}`;
        }
    }

    render() {
        if (this.imagenes.length === 0) {
            this.shadowRoot.innerHTML = `<p aria-live="polite">No hay imágenes disponibles.</p>`;
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    margin: 16px 0;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .galeria-contenedor {
                    position: relative;
                    width: 100%;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
                    background: #f0f4f8;
                    aspect-ratio: 16/9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .galeria-contenedor:focus-visible {
                    outline: 3px solid #004d40;
                    outline-offset: 4px;
                }
                .imagen-activa {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: opacity 0.4s ease-in-out;
                }
                .controles {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    transform: translateY(-50%);
                    display: flex;
                    justify-content: space-between;
                    padding: 0 24px;
                    pointer-events: none;
                }
                .btn-nav {
                    pointer-events: auto;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    width: 56px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    transition: transform 0.2s ease, background 0.2s ease;
                    color: #004d40;
                }
                .btn-nav:hover {
                    background: #ffffff;
                    transform: scale(1.1);
                }
                .btn-nav:focus-visible {
                    outline: 3px solid #004d40;
                    outline-offset: 2px;
                }
                .btn-nav svg {
                    width: 28px;
                    height: 28px;
                    fill: currentColor;
                }
                .indicador-contenedor {
                    position: absolute;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 77, 64, 0.7);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 999px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    backdrop-filter: blur(8px);
                }
                
                @media (max-width: 600px) {
                    .btn-nav { width: 48px; height: 48px; }
                    .btn-nav svg { width: 24px; height: 24px; }
                    .controles { padding: 0 16px; }
                }
            </style>
            
            <div class="galeria-contenedor" role="region" aria-label="Galería interactiva de imágenes" tabindex="0">
                <img class="imagen-activa" src="${this.imagenes[0]}" alt="Fotografía 1 del destino turístico">
                
                <div class="controles">
                    <button class="btn-nav btn-prev" aria-label="Ver imagen anterior">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                    </button>
                    <button class="btn-nav btn-next" aria-label="Ver imagen siguiente">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                    </button>
                </div>
                
                <div class="indicador-contenedor" aria-live="polite">
                    <span class="indicador">1 / ${this.imagenes.length}</span>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.btn-prev').addEventListener('click', () => this.mostrarImagen(this.indiceActual - 1));
        this.shadowRoot.querySelector('.btn-next').addEventListener('click', () => this.mostrarImagen(this.indiceActual + 1));
        
        const contenedor = this.shadowRoot.querySelector('.galeria-contenedor');
        contenedor.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.mostrarImagen(this.indiceActual - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.mostrarImagen(this.indiceActual + 1);
            }
        });
    }
}

customElements.define('galeria-imagenes', GaleriaImagenes);