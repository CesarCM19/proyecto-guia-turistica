const DURACIONES_VIDEOS = {
    'cahuita.mp4': 44,
    'manuelantonio.mp4': 141,
    'orosii.mp4': 57,
    'poas.mp4': 101,
    'puertoviejo.mp4': 104,
    'rincondelavieja.mp4': 84,
    'tamarindo.mp4': 112,
    'uvita.mp4': 193
};

class VideoDestino extends HTMLElement {
    static get observedAttributes() {
        return ['src', 'poster'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isPlaying = false;
        this.isMuted = false;
        this.duracion = 0;
        this.src = '';
        this.poster = '';
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'src') {
                this.src = newValue || '';
                this.render();
            } else if (name === 'poster') {
                this.poster = newValue || '';
                if (this.shadowRoot) {
                    const video = this.shadowRoot.querySelector('video');
                    if (video) video.setAttribute('poster', this.poster);
                }
            }
        }
    }

    formatearTiempo(segundos) {
        if (isNaN(segundos) || segundos === Infinity) return "0:00";
        const min = Math.floor(segundos / 60);
        const seg = Math.floor(segundos % 60);
        return `${min}:${seg.toString().padStart(2, '0')}`;
    }

    obtenerDuracionEsperada() {
        if (!this.src) return 0;
        const filename = this.src.split('/').pop().toLowerCase();
        return DURACIONES_VIDEOS[filename] || 0;
    }

    obtenerDuracion() {
        const expected = this.obtenerDuracionEsperada();
        if (expected > 0) {
            return expected;
        }
        if (this.videoEl && this.videoEl.duration && !isNaN(this.videoEl.duration) && this.videoEl.duration !== Infinity) {
            return this.videoEl.duration;
        }
        return 0;
    }

    inicializarVideo() {
        this.videoEl = this.shadowRoot.querySelector('video');
        this.btnPlayPause = this.shadowRoot.querySelector('.btn-play-pause');
        this.btnMute = this.shadowRoot.querySelector('.btn-mute');
        this.progressBar = this.shadowRoot.querySelector('.progress-bar');
        this.currentTimeEl = this.shadowRoot.querySelector('.current-time');
        this.durationEl = this.shadowRoot.querySelector('.duration');
        this.container = this.shadowRoot.querySelector('.video-container');
        this.errorOverlay = this.shadowRoot.querySelector('.error-overlay');
        this.playOverlayBtn = this.shadowRoot.querySelector('.overlay-play-btn');

        // Play/Pause Click Events
        this.btnPlayPause.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlay();
        });
        this.container.addEventListener('click', () => {
            if (this.errorOverlay.style.display !== 'flex') {
                this.togglePlay();
            }
        });

        // Mute/Unmute Event
        this.btnMute.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute();
        });

        const updateDuration = () => {
            const d = this.obtenerDuracion();
            if (d > 0) {
                this.duracion = d;
                this.progressBar.max = d;
                this.durationEl.textContent = this.formatearTiempo(d);
                this.actualizarFondoProgreso();
            }
        };

        // Set initial duration
        updateDuration();

        // Native Video Event Listeners
        this.videoEl.addEventListener('loadedmetadata', () => {
            updateDuration();
            this.errorOverlay.style.display = 'none';
            if (this.playOverlayBtn) this.playOverlayBtn.style.display = 'flex';
        });

        this.videoEl.addEventListener('durationchange', updateDuration);

        // Error handling (e.g. video file missing or network block)
        this.videoEl.addEventListener('error', () => {
            if (this.src && this.src.trim() !== '') {
                this.errorOverlay.style.display = 'flex';
                if (this.playOverlayBtn) this.playOverlayBtn.style.display = 'none';
            }
        });

        // Trigger loadedmetadata manually if already loaded in cache
        if (this.videoEl.readyState >= 1) {
            updateDuration();
        }

        this.videoEl.addEventListener('timeupdate', () => {
            const d = this.obtenerDuracion();
            if (d > 0 && (this.duracion !== d || this.progressBar.max !== d)) {
                this.duracion = d;
                this.progressBar.max = d;
                this.durationEl.textContent = this.formatearTiempo(d);
            }
            if (!this.progressBar.matches(':active')) {
                this.progressBar.value = this.videoEl.currentTime;
            }
            this.currentTimeEl.textContent = this.formatearTiempo(this.videoEl.currentTime);
            this.actualizarFondoProgreso();
        });

        this.videoEl.addEventListener('ended', () => {
            this.isPlaying = false;
            this.container.classList.remove('playing');
            this.actualizarIconos();
            this.progressBar.value = 0;
            this.currentTimeEl.textContent = "0:00";
            this.actualizarFondoProgreso();
        });

        // Progress bar drag / interaction
        this.progressBar.addEventListener('click', (e) => e.stopPropagation());

        this.progressBar.addEventListener('input', (e) => {
            e.stopPropagation();
            this.currentTimeEl.textContent = this.formatearTiempo(e.target.value);
            this.actualizarFondoProgreso();
        });

        this.progressBar.addEventListener('change', (e) => {
            e.stopPropagation();
            this.videoEl.currentTime = e.target.value;
        });

        // Keyboard support inside container
        this.container.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.videoEl.currentTime = Math.min(this.videoEl.duration, this.videoEl.currentTime + 5);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.videoEl.currentTime = Math.max(0, this.videoEl.currentTime - 5);
            } else if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                this.toggleMute();
            }
        });
    }

    actualizarFondoProgreso() {
        const porcentaje = (this.progressBar.value / this.progressBar.max) * 100 || 0;
        this.progressBar.style.setProperty('--progreso', porcentaje + '%');
    }

    togglePlay() {
        if (!this.videoEl || this.videoEl.error) return;
        if (this.videoEl.paused) {
            this.videoEl.play();
            this.isPlaying = true;
            this.container.classList.add('playing');
        } else {
            this.videoEl.pause();
            this.isPlaying = false;
            this.container.classList.remove('playing');
        }
        this.actualizarIconos();
    }

    toggleMute() {
        if (!this.videoEl) return;
        this.videoEl.muted = !this.videoEl.muted;
        this.isMuted = this.videoEl.muted;
        this.actualizarIconos();
    }

    actualizarIconos() {
        const pathPlay = this.shadowRoot.querySelector('.btn-play-pause path');
        if (pathPlay) {
            if (this.isPlaying) {
                pathPlay.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
                this.btnPlayPause.setAttribute('aria-label', 'Pausar video');
            } else {
                pathPlay.setAttribute('d', 'M8 5v14l11-7z');
                this.btnPlayPause.setAttribute('aria-label', 'Reproducir video');
            }
        }

        const pathMute = this.shadowRoot.querySelector('.btn-mute path');
        if (pathMute) {
            if (this.isMuted) {
                pathMute.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
                this.btnMute.setAttribute('aria-label', 'Activar sonido video');
            } else {
                pathMute.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
                this.btnMute.setAttribute('aria-label', 'Silenciar video');
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                    font-family: system-ui, -apple-system, sans-serif;
                    background: #000;
                }
                .video-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16/9;
                    background: #000;
                    overflow: hidden;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .video-container:focus-visible {
                    outline: 3px solid #004d40;
                    outline-offset: 4px;
                }
                video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .controls-panel {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 28px 20px 16px 20px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 10;
                    pointer-events: none;
                }
                .video-container:hover .controls-panel,
                .video-container:focus-within .controls-panel {
                    opacity: 1;
                }
                .btn-play-pause, .btn-mute {
                    pointer-events: auto;
                    background: rgba(255, 255, 255, 0.15);
                    border: none;
                    cursor: pointer;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border-radius: 50%;
                    transition: background 0.2s, transform 0.1s;
                    width: 40px;
                    height: 40px;
                    backdrop-filter: blur(4px);
                }
                .btn-play-pause:hover, .btn-mute:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.08);
                }
                .btn-play-pause:focus-visible, .btn-mute:focus-visible {
                    outline: 2px solid white;
                    outline-offset: 2px;
                }
                .btn-play-pause svg, .btn-mute svg {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                }
                .progress-container {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    pointer-events: auto;
                }
                .progress-bar {
                    -webkit-appearance: none;
                    width: 100%;
                    height: 6px;
                    border-radius: 99px;
                    outline: none;
                    cursor: pointer;
                    --progreso: 0%;
                    background: linear-gradient(to right, #004d40 var(--progreso), rgba(255,255,255,0.3) var(--progreso));
                    transition: filter 0.2s;
                }
                .progress-bar:focus-visible {
                    outline: 2px solid white;
                    outline-offset: 4px;
                }
                .progress-bar::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    transition: transform 0.1s ease;
                }
                .progress-bar::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }
                .progress-bar::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: white;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    transition: transform 0.1s ease;
                }
                .progress-bar::-moz-range-thumb:hover {
                    transform: scale(1.2);
                }
                .time-counter {
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 600;
                    min-width: 85px;
                    text-align: center;
                    user-select: none;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
                }
                .overlay-play-btn {
                    position: absolute;
                    background: rgba(0, 77, 64, 0.85);
                    color: white;
                    border-radius: 50%;
                    width: 72px;
                    height: 72px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.9;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    pointer-events: none;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                    z-index: 5;
                }
                .video-container.playing .overlay-play-btn {
                    opacity: 0;
                    transform: scale(1.4);
                }
                .overlay-play-btn svg {
                    width: 36px;
                    height: 36px;
                    fill: currentColor;
                    margin-left: 4px;
                }
                
                /* Error overlay style */
                .error-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.85);
                    color: white;
                    display: none;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    text-align: center;
                    z-index: 15;
                    pointer-events: auto;
                }
                .error-overlay span {
                    font-size: 2.2rem;
                    margin-bottom: 8px;
                }
                .error-overlay h4 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #ff8a80;
                }
                .error-overlay p {
                    margin: 6px 0 0 0;
                    font-size: 0.85rem;
                    color: #cbd5e0;
                }
            </style>
            
            <div class="video-container" role="region" aria-label="Reproductor de video de destinos" tabindex="0">
                <video preload="metadata" poster="${this.poster || ''}" src="${this.src || ''}">
                    Tu navegador no soporta la reproducción de video nativo.
                </video>
                
                <div class="overlay-play-btn" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                
                <div class="error-overlay">
                    <span>⚠️</span>
                    <h4>Archivo de video no encontrado</h4>
                    <p>Verifica que exista en la ruta local:<br><strong>${this.src || ''}</strong></p>
                </div>
                
                <div class="controls-panel">
                    <button class="btn-play-pause" aria-label="Reproducir video">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    
                    <div class="progress-container">
                        <input type="range" class="progress-bar" value="0" min="0" max="100" aria-label="Deslizador de progreso del video">
                    </div>
                    
                    <div class="time-counter">
                        <span class="current-time">0:00</span> / <span class="duration">0:00</span>
                    </div>
                    
                    <button class="btn-mute" aria-label="Silenciar video">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    </button>
                </div>
            </div>
        `;

        if (this.src) {
            this.inicializarVideo();
        }
    }
}

customElements.define('video-destino', VideoDestino);
