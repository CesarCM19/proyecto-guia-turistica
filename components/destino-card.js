class DestinoCard extends HTMLElement {

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
        this.cargarAtributos();
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (oldValue === newValue) return;

        switch (name) {
            case 'destino-id':
                this.destino.id = newValue || '';
                break;

            case 'nombre':
                this.destino.nombre = newValue || '';
                break;

            case 'imagen':
                this.destino.imagen_portada = newValue || '';
                break;

            case 'region':
                this.destino.region = newValue || '';
                break;
        }

        if (this.isConnected) {
            this.render();
        }
    }

    cargarAtributos() {

        if (this.destino.id) return;

        this.destino.id =
            this.getAttribute('destino-id') || '';

        this.destino.nombre =
            this.getAttribute('nombre') || '';

        this.destino.imagen_portada =
            this.getAttribute('imagen') || '';

        this.destino.region =
            this.getAttribute('region') || '';
    }

    set data(destino) {

        this.destino = {
            ...this.destino,
            ...destino
        };

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

        const colorRegion =
            this.destino.region.includes('Pacífico')
                ? '#2b6cb0'
                : '#004d40';

        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    display: block;
                    cursor: pointer;
                    font-family: system-ui, sans-serif;
                }

                .card {
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0,0,0,.06);
                    transition: transform .3s ease,
                                box-shadow .3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #f0f0f0;
                    outline: none;
                }

                .card:hover,
                .card:focus {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 40px rgba(0,0,0,.12);
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
                    background: ${colorRegion};
                    color: white;
                    padding: 6px 14px;
                    border-radius: 999px;
                    font-size: .75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .card-content {
                    padding: 24px;
                    flex-grow: 1;
                }

                h3 {
                    margin: 0 0 12px;
                    font-size: 1.3rem;
                    color: #004d40;
                }

                p {
                    margin: 0;
                    color: #4a5568;
                    line-height: 1.6;
                    font-size: .95rem;
                }

            </style>

            <article
                class="card"
                tabindex="0"
                role="button"
                aria-label="Ver detalles de ${this.destino.nombre}"
            >

                <div class="img-container">

                    <img
                        src="${this.destino.imagen_portada}"
                        alt="${this.destino.nombre}"
                        loading="lazy"
                    >

                    <span class="pill">
                        ${this.destino.region}
                    </span>

                </div>

                <div class="card-content">

                    <h3>${this.destino.nombre}</h3>

                    <p>
                        ${(this.destino.descripcion || '').substring(0, 120)}...
                    </p>

                </div>

            </article>
        `;

        const card = this.shadowRoot.querySelector('.card');

        card.addEventListener('click', () => {
            this.navegarDetalle();
        });

        card.addEventListener('keydown', (event) => {

            if (
                event.key === 'Enter' ||
                event.key === ' '
            ) {
                event.preventDefault();
                this.navegarDetalle();
            }
        });
    }
}

customElements.define('destino-card', DestinoCard);