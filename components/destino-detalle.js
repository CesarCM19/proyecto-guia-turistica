class DestinoDetalle extends HTMLElement {

    set data(destino) {
        this.destino = destino;
        this.render();
    }

    render() {
        this.innerHTML = `
            <section class="detalle fade-in">

                <img src="${this.destino.imagen_portada}" class="detalle-hero">

                <div class="detalle-content">

                    <h2>${this.destino.nombre}</h2>
                    <p class="region">${this.destino.region}</p>

                    <p class="descripcion">
                        ${this.destino.descripcion}
                    </p>

                    <h3>✨ Actividades</h3>
                    <ul class="actividades">
                        ${this.destino.actividades.map(a => `<li>${a}</li>`).join('')}
                    </ul>

                    <h3>📸 Galería</h3>
                    <galeria-imagenes></galeria-imagenes>

                    <h3>🎧 Audio Guía</h3>
                    <audio-guia></audio-guia>

                    <button class="btn-volver">⬅ Volver</button>

                </div>
            </section>
        `;

        // Inyectar galería
        this.querySelector('galeria-imagenes').imagenes = this.destino.galeria;

        // Inyectar audio
        this.querySelector('audio-guia').src = this.destino.audio;

        // Volver
        this.querySelector('.btn-volver').addEventListener('click', () => {
            window.location.hash = '';
        });
    }
}

customElements.define('destino-detalle', DestinoDetalle);