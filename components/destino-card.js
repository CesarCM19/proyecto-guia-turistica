class DestinoCard extends HTMLElement {

    set data(destino) {
        this.destino = destino;
        this.render();
    }

    render() {
        this.innerHTML = `
            <article class="card fade-in">
                <img src="${this.destino.imagen_portada}" alt="${this.destino.nombre}">
                
                <div class="card-content">
                    <span class="region">${this.destino.region}</span>
                    <h3>${this.destino.nombre}</h3>
                    <p>${this.destino.descripcion.substring(0, 120)}...</p>
                </div>
            </article>
        `;

        this.addEventListener('click', () => {
            window.location.hash = `#detalle-${this.destino.id}`;
        });
    }
}

customElements.define('destino-card', DestinoCard);