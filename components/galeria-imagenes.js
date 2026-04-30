class GaleriaImagenes extends HTMLElement {

    set imagenes(lista) {
        this.lista = lista;
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="galeria">
                ${this.lista.map(img => `
                    <img src="${img}" class="galeria-img">
                `).join('')}
            </div>
        `;
    }
}

customElements.define('galeria-imagenes', GaleriaImagenes);