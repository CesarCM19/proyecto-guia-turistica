class DestinoCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set data(destino) {
        this.destino = destino;
        this.render();
    }

    render() {

        if (!this.destino) return;

        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    display: block;
                    cursor: pointer;
                }

                .card {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,.12);
                    transition: transform .25s ease,
                                box-shadow .25s ease;
                    height: 100%;
                }

                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,.18);
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

            <article class="card">
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
                        ${this.destino.descripcion.substring(0, 120)}...
                    </p>
                </div>
            </article>
        `;

        const card = this.shadowRoot.querySelector('.card');

        card.addEventListener('click', () => {

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
        });
    }
}

customElements.define('destino-card', DestinoCard);