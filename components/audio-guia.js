class AudioGuia extends HTMLElement {

    set src(audio) {
        this.audio = audio;
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="audio-player">
                <h4>🎧 Audio Guía</h4>
                <audio controls>
                    <source src="${this.audio}" type="audio/mpeg">
                    Tu navegador no soporta audio.
                </audio>
            </div>
        `;
    }
}

customElements.define('audio-guia', AudioGuia);