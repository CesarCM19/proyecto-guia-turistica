class AudioGuia extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isPlaying = false;
        this.duracion = 0;
    }

    static get observedAttributes() {
        return ['src', 'label'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'src') {
                this.src = newValue;
                this.render();
            } else if (name === 'label') {
                this.label = newValue || 'Guía de Audio';
                if (this.shadowRoot) {
                    const titulo = this.shadowRoot.querySelector('.titulo');
                    if (titulo) titulo.textContent = this.label;
                }
            }
        }
    }

    formatearTiempo(segundos) {
        if (isNaN(segundos)) return "0:00";
        const min = Math.floor(segundos / 60);
        const seg = Math.floor(segundos % 60);
        return `${min}:${seg.toString().padStart(2, '0')}`;
    }

    inicializarAudio() {
        this.audioEl = this.shadowRoot.querySelector('audio');
        this.btnPlayPause = this.shadowRoot.querySelector('.btn-play-pause');
        this.barraProgreso = this.shadowRoot.querySelector('.barra-progreso');
        this.tiempoActualEl = this.shadowRoot.querySelector('.tiempo-actual');
        this.duracionEl = this.shadowRoot.querySelector('.duracion');

        this.btnPlayPause.addEventListener('click', () => this.togglePlay());

        this.audioEl.addEventListener('loadedmetadata', () => {
            this.duracion = this.audioEl.duration;
            this.barraProgreso.max = this.duracion;
            this.duracionEl.textContent = this.formatearTiempo(this.duracion);
        });

        this.audioEl.addEventListener('timeupdate', () => {
            if (!this.barraProgreso.matches(':active')) {
                this.barraProgreso.value = this.audioEl.currentTime;
            }
            this.tiempoActualEl.textContent = this.formatearTiempo(this.audioEl.currentTime);
            this.actualizarFondoBarra();
        });

        this.audioEl.addEventListener('ended', () => {
            this.isPlaying = false;
            this.actualizarIconoPlay();
            this.barraProgreso.value = 0;
            this.tiempoActualEl.textContent = "0:00";
            this.actualizarFondoBarra();
        });

        this.barraProgreso.addEventListener('input', (e) => {
            this.tiempoActualEl.textContent = this.formatearTiempo(e.target.value);
            this.actualizarFondoBarra();
        });

        this.barraProgreso.addEventListener('change', (e) => {
            this.audioEl.currentTime = e.target.value;
        });
        
        this.barraProgreso.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                setTimeout(() => this.audioEl.currentTime = this.barraProgreso.value, 0);
            }
        });
    }

    actualizarFondoBarra() {
        const porcentaje = (this.barraProgreso.value / this.barraProgreso.max) * 100;
        this.barraProgreso.style.setProperty('--progreso', porcentaje + '%');
    }

    togglePlay() {
        if (this.audioEl.paused) {
            this.audioEl.play();
            this.isPlaying = true;
        } else {
            this.audioEl.pause();
            this.isPlaying = false;
        }
        this.actualizarIconoPlay();
    }

    actualizarIconoPlay() {
        const path = this.shadowRoot.querySelector('.btn-play-pause path');
        if (this.isPlaying) {
            path.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            this.btnPlayPause.setAttribute('aria-label', 'Pausar audio');
        } else {
            path.setAttribute('d', 'M8 5v14l11-7z');
            this.btnPlayPause.setAttribute('aria-label', 'Reproducir audio');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .reproductor {
                    background: #ffffff;
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    border: 1px solid #f0f0f0;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .titulo {
                    margin: 0;
                    font-size: 1.5rem;
                    color: #004d40;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
                .header-icono {
                    color: #4a5568;
                }
                .header-icono svg {
                    width: 28px;
                    height: 28px;
                    fill: currentColor;
                }
                
                .autor {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: #f8f9fa;
                    padding: 16px;
                    border-radius: 16px;
                }
                .avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #e2e8f0;
                    overflow: hidden;
                }
                .avatar img { width: 100%; height: 100%; object-fit: cover; }
                .autor-info p { margin: 0; }
                .autor-nombre { font-weight: 700; color: #1a1a1a; font-size: 1.05rem; }
                .autor-rol { color: #718096; font-size: 0.9rem; margin-top: 2px;}

                .controles-principal {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }
                .btn-play-pause {
                    background: #004d40;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 64px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
                    flex-shrink: 0;
                    box-shadow: 0 8px 20px rgba(0, 77, 64, 0.2);
                }
                .btn-play-pause:hover {
                    background: #00332a;
                    transform: scale(1.05);
                }
                .btn-play-pause:focus-visible {
                    outline: 3px solid #e0f2f1;
                    outline-offset: 3px;
                }
                .btn-play-pause svg {
                    width: 32px;
                    height: 32px;
                    fill: currentColor;
                }
                .progreso-contenedor {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .tiempos {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                    color: #718096;
                    font-weight: 600;
                }
                
                .barra-progreso {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 8px;
                    border-radius: 99px;
                    outline: none;
                    cursor: pointer;
                    --progreso: 0%;
                    background: linear-gradient(to right, #004d40 var(--progreso), #e2e8f0 var(--progreso));
                    transition: filter 0.2s;
                }
                .barra-progreso:hover {
                    filter: brightness(0.95);
                }
                .barra-progreso:focus-visible {
                    outline: 3px solid #004d40;
                    outline-offset: 4px;
                }
                .barra-progreso::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #004d40;
                    cursor: pointer;
                    transition: transform 0.1s ease;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
                .barra-progreso::-webkit-slider-thumb:hover { transform: scale(1.2); }
                .barra-progreso::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #004d40;
                    cursor: pointer;
                    border: none;
                    transition: transform 0.1s ease;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
                .barra-progreso::-moz-range-thumb:hover { transform: scale(1.2); }
            </style>
            
            <div class="reproductor" role="region" aria-label="Reproductor interactivo de audio">
                <div class="header">
                    <h4 class="titulo" id="titulo-audio">${this.label || 'Guía de Audio'}</h4>
                    <div class="header-icono" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>
                    </div>
                </div>

                <div class="autor">
                    <div class="avatar">
                        <svg viewBox="0 0 24 24" fill="#a0aec0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div class="autor-info">
                        <p class="autor-nombre">Narrador Local</p>
                        <p class="autor-rol">Experto en Costa Rica</p>
                    </div>
                </div>
                
                <audio>
                    <source src="${this.src || ''}" type="audio/mpeg">
                </audio>

                <div class="controles-principal">
                    <button class="btn-play-pause" aria-label="Reproducir audio" aria-controls="titulo-audio">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    
                    <div class="progreso-contenedor">
                        <div class="tiempos" aria-hidden="true">
                            <span class="tiempo-actual">0:00</span>
                            <span class="duracion">0:00</span>
                        </div>
                        <input type="range" class="barra-progreso" value="0" min="0" max="100" aria-label="Barra de progreso de reproducción">
                    </div>
                </div>
            </div>
        `;

        if (this.src) {
            this.inicializarAudio();
        }
    }
}

customElements.define('audio-guia', AudioGuia);