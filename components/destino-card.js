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
                }

                .card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,.12);
                    transition:
                        transform .25s ease,
                        box-shadow .25s ease;
                    cursor: pointer;
                    height: 100%;
                    outline: none;
                }

                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,.18);
                }

                .card:focus {
                    box-shadow:
                        0 0 0 3px #1a5276,
                        0 8px 20px rgba(0,0,0,.18);
                }

                img {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    display: block;
                }

                .card-content {
                    padding: 1rem;
                }

                .region {
                    display: inline-block;
                    font-size: .8rem;
                    font-weight: 600;
                    color: #1a5276;
                    margin-bottom: .5rem;
                }

                h3 {
                    margin: 0 0 .5rem;
                    font-size: 1.2rem;
                    color: #2c3e50;
                }

                p {
                    margin: 0;
                    color: #666;
                    line-height: 1.5;
                    font-size: .95rem;
                }

            </style>

            <article
                class="card"
                tabindex="0"
                role="button"
                aria-label="Ver información de ${this.destino.nombre}"
            >

                <img
                    src="${this.destino.imagen_portada}"
                    alt="${this.destino.nombre}"
                    loading="lazy"
                >

                <div class="card-content">

                    <span class="region">
                        ${this.destino.region}
                    </span>

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