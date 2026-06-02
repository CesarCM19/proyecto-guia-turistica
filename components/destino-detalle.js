class DestinoDetalle extends HTMLElement {
    set data(destino) {
        this.destino = destino;
        this.render();
    }

    render() {
        const galeria = this.destino.galeria || [];
        const img1 = galeria[0] || this.destino.imagen_portada;
        const img2 = galeria[1] || this.destino.imagen_portada;
        const img3 = galeria[2] || this.destino.imagen_portada;

        this.innerHTML = `
            <style>
                .detalle {
                    max-width: 1440px;
                    margin: 0 auto;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .detalle-header-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 24px;
                }
                .btn-volver {
                    background: transparent;
                    border: none;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #004d40;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 16px 8px 0;
                    transition: transform 0.2s;
                }
                .btn-volver:hover {
                    transform: translateX(-4px);
                }
                .btn-volver svg { width: 24px; height: 24px; fill: currentColor; }
                .header-actions {
                    display: flex;
                    gap: 16px;
                }
                .icon-action {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #004d40;
                    padding: 8px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                .icon-action:hover { background: #e0f2f1; }
                .icon-action svg { width: 24px; height: 24px; fill: currentColor; }

                .mosaic-hero {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    grid-template-rows: 240px 240px;
                    gap: 16px;
                    margin-bottom: 32px;
                }
                @media (max-width: 768px) {
                    .mosaic-hero {
                        grid-template-columns: 1fr;
                        grid-template-rows: 300px 150px 150px;
                    }
                }
                .img-large {
                    grid-row: span 2;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 24px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
                }
                .img-small {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 24px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
                }
                
                .info-section {
                    display: flex;
                    flex-direction: column;
                    gap: 48px;
                    margin-top: 24px;
                }
                @media (min-width: 900px) {
                    .info-section {
                        flex-direction: row;
                    }
                    .info-main { flex: 2; }
                    .info-sidebar { flex: 1; min-width: 380px; }
                }

                .pill-rating {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 16px;
                }
                .pill-green {
                    background: #e0f2f1;
                    color: #004d40;
                    padding: 6px 16px;
                    border-radius: 999px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .rating-stars {
                    color: #004d40;
                    font-weight: 600;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .rating-stars svg { fill: #004d40; width: 18px; height: 18px; }

                .title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 32px;
                    flex-wrap: wrap;
                    gap: 24px;
                }
                .title-block h2 {
                    font-size: 3rem;
                    color: #004d40;
                    margin: 0 0 12px 0;
                    letter-spacing: -1.5px;
                    line-height: 1.1;
                }
                .location {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #4a5568;
                    font-weight: 500;
                    font-size: 1.1rem;
                }
                .action-buttons {
                    display: flex;
                    gap: 16px;
                    align-items: center;
                }
                .btn-reserve {
                    background: #004d40;
                    color: white;
                    border: none;
                    padding: 16px 32px;
                    border-radius: 999px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                    box-shadow: 0 8px 20px rgba(0,77,64,0.2);
                }
                .btn-reserve:hover { 
                    background: #00332a; 
                    transform: translateY(-2px);
                }
                .btn-heart {
                    background: #e3f2fd;
                    color: #004d40;
                    border: none;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s;
                }
                .btn-heart:hover { transform: scale(1.1); }
                .btn-heart svg { width: 24px; height: 24px; fill: currentColor; }

                .descripcion h3 {
                    color: #004d40;
                    font-size: 1.75rem;
                    margin-bottom: 20px;
                    letter-spacing: -0.5px;
                }
                .descripcion p {
                    color: #4a5568;
                    line-height: 1.8;
                    font-size: 1.1rem;
                }
                .actividades {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    list-style: none;
                    padding: 0;
                    margin-top: 24px;
                }
                .actividades li {
                    background: #f4f6f8;
                    color: #4a5568;
                    padding: 10px 20px;
                    border-radius: 999px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    border: 1px solid #edf2f7;
                }
            </style>

            <section class="detalle fade-in">
                <div class="detalle-header-top">
                    <button class="btn-volver" aria-label="Volver a la lista">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                        Detalle del Destino
                    </button>
                    <div class="header-actions">
                        <button class="icon-action" aria-label="Compartir"><svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg></button>
                        <button class="icon-action" aria-label="Ver en el mapa"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></button>
                    </div>
                </div>

                <div class="mosaic-hero" role="img" aria-label="Mosaico de imágenes de ${this.destino.nombre}">
                    <img src="${img1}" class="img-large" alt="Vista principal">
                    <img src="${img2}" class="img-small" alt="Vista secundaria">
                    <img src="${img3}" class="img-small" alt="Vista en detalle">
                </div>

                <div class="pill-rating">
                    <span class="pill-green">${this.destino.region}</span>
                    <span class="rating-stars">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        4.9 (2.4k reseñas)
                    </span>
                </div>

                <div class="title-row">
                    <div class="title-block">
                        <h2>${this.destino.nombre}</h2>
                        <div class="location">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            Costa Rica
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-reserve">Reservar un Guía</button>
                        <button class="btn-heart" aria-label="Guardar destino"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></button>
                    </div>
                </div>

                <div class="info-section">
                    <div class="info-main">
                        <div class="descripcion">
                            <h3>Descubre la Magia</h3>
                            <p>${this.destino.descripcion}</p>
                            
                            <h3 style="margin-top:40px;">Actividades Destacadas</h3>
                            <ul class="actividades">
                                ${this.destino.actividades.map(a => `<li>${a}</li>`).join('')}
                            </ul>
                        </div>
                        <h3 style="margin-top:48px; color:#004d40; font-size:1.75rem; letter-spacing:-0.5px;">📸 Más Imágenes</h3>
                        <galeria-imagenes></galeria-imagenes>
                    </div>

                    <div class="info-sidebar">
                        <audio-guia></audio-guia>
                    </div>
                </div>
            </section>
        `;

        this.querySelector('.btn-volver').addEventListener('click', () => {
            window.location.hash = '';
        });

        const galeriaEl = this.querySelector('galeria-imagenes');
        if (this.destino.galeria) galeriaEl.setAttribute('imagenes', JSON.stringify(this.destino.galeria));

        const audioGuiaEl = this.querySelector('audio-guia');
        if (this.destino.audio) {
            audioGuiaEl.setAttribute('src', this.destino.audio);
            audioGuiaEl.setAttribute('label', `Guía de Audio`);
        }
    }
}

customElements.define('destino-detalle', DestinoDetalle);