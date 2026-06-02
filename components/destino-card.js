class DestinoCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return [
            'destino-id',
            'nombre',
            'imagen',
            'region'
        ];
    }

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.destino = {
            id: '',
            nombre: '',
            imagen_portada: '',
            region: '',
            descripcion: ''
        };
    }

    connectedCallback() {

        if (!this.destino.id) {

            this.destino.id =
                this.getAttribute('destino-id') || '';

            this.destino.nombre =
                this.getAttribute('nombre') || '';

            this.destino.imagen_portada =
                this.getAttribute('imagen') || '';

            this.destino.region =
                this.getAttribute('region') || '';
        }

        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (oldValue === newValue) return;

        switch (name) {

            case 'destino-id':
                this.destino.id = newValue;
                break;

            case 'nombre':
                this.destino.nombre = newValue;
                break;

            case 'imagen':
                this.destino.imagen_portada = newValue;
                break;

            case 'region':
                this.destino.region = newValue;
                break;
        }

        this.render();
    }

    set data(destino) {
        this.destino = destino;
        this.render();
    }

    navegarDetalle() {

        this.dispatchEvent(
            new CustomEvent('destino-selected', {
                bubbles: true,
                composed: true,
                detail: {
                    id: this.destino.id
                }
            })
        );

        window.location.hash = `#detalle-${this.destino.id}`;
    }

    render() {
        if (!this.destino) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    cursor: pointer;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .card {
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #f0f0f0;
                }
                .card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
                }
                .img-container {
                    position: relative;
                    width: 100%;
                    height: 240px;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .pill {
                    position: absolute;
                    bottom: 16px;
                    left: 16px;
                    background: #2b6cb0; 
                    color: white;
                    padding: 6px 14px;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .pill.green { background: #004d40; }
                .pill.light-green { background: #e0f2f1; color: #004d40; }
                
                .card-content {
                    padding: 24px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                h3 {
                    margin: 0;
                    font-size: 1.4rem;
                    color: #004d40;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
                .rating {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.85rem;
                    color: #4a5568;
                    font-weight: 600;
                }
                .rating svg {
                    fill: #f59e0b;
                    width: 16px;
                    height: 16px;
                }
                p {
                    margin: 0;
                    color: #4a5568;
                    line-height: 1.6;
                    font-size: 0.95rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            </style>

            <article class="card" aria-label="Ver detalles de ${this.destino.nombre}" tabindex="0">
                <div class="img-container">
                    <img src="${this.destino.imagen_portada}" alt="${this.destino.nombre}" loading="lazy">
                    <span class="pill ${this.destino.region.includes('Pacífico') ? '' : 'green'}">${this.destino.region}</span>
                </div>

                <div class="card-content">
                    <div class="header-row">
                        <h3>${this.destino.nombre}</h3>
                        <div class="rating">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            4.9 (2.4k)
                        </div>
                    </div>
                    <p>${this.destino.descripcion}</p>
                </div>

            </article>
        `;

        const card = this.shadowRoot.querySelector('.card');
        const destinoId = this.destino.id;
        card.addEventListener('click', () => { window.location.hash = '#detalle-' + destinoId; });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.location.hash = '#detalle-' + destinoId;
        });
    }
}

customElements.define('destino-card', DestinoCard);