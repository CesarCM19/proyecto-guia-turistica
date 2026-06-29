class MapaTuristico extends HTMLElement {
    static get observedAttributes() {
        return ['disabled'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedProvinceId = null;
        this.provincias = [];
    }

    async connectedCallback() {
        await this.cargarMapa();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'disabled' && oldValue !== newValue) {
            this.actualizarInteractividad();
        }
    }

    actualizarInteractividad() {
        const disabled = this.hasAttribute('disabled');
        this.provincias.forEach(prov => {
            if (disabled) {
                prov.element.setAttribute('tabindex', '-1');
            } else {
                prov.element.setAttribute('tabindex', '0');
            }
        });
    }

    async cargarMapa() {
        try {
            // Cargar el archivo SVG
            const response = await fetch('./assets/img/mapa.svg');
            if (!response.ok) throw new Error('No se pudo cargar mapa.svg');
            
            let svgText = await response.text();
            // Limpiar la declaración XML si existe
            svgText = svgText.replace(/<\?xml[^>]*\?>/i, '');

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        max-width: 100%;
                        margin: 0 auto;
                        position: relative;
                        user-select: none;
                    }
                    
                    .map-container {
                        width: 100%;
                        height: 100%;
                        position: relative;
                    }

                    svg {
                        width: 100%;
                        height: auto;
                        max-height: 800px;
                        display: block;
                        overflow: visible;
                    }

                    /* Estilo base para los caminos (provincias) */
                    path {
                        fill: #4f772d;
                        stroke: #ECF39E;
                        stroke-width: 2.5;
                        cursor: pointer;
                        transition: 
                            fill 0.3s ease, 
                            stroke 0.3s ease,
                            stroke-width 0.3s ease,
                            opacity 0.4s ease,
                            transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                            filter 0.4s ease;
                        transform-origin: center;
                        transform-box: fill-box;
                    }

                    /* Efecto hover cuando NINGUNA provincia está seleccionada */
                    :host(:not([has-selection])) path:hover {
                        fill: #b2dfdb;
                        stroke: #00796b;
                        stroke-width: 3.5;
                        transform: scale(1.04);
                        filter: drop-shadow(0 8px 16px rgba(0, 77, 64, 0.25));
                        z-index: 10;
                    }

                    /* Estilo de enfoque para accesibilidad por teclado */
                    path:focus-visible {
                        outline: none;
                        fill: #80cbc4;
                        stroke: #004d40;
                        stroke-width: 4;
                        filter: drop-shadow(0 0 12px rgba(0, 77, 64, 0.4));
                    }

                    /* Estilo cuando existe una provincia seleccionada */
                    :host([has-selection]) path {
                        opacity: 0.35;
                        fill: #d1e2df; /* oscurecer un poco */
                        stroke: #ffffff;
                        stroke-width: 1.5;
                    }

                    /* Provincia activa/seleccionada */
                    :host([has-selection]) path.selected {
                        opacity: 1;
                        fill: var(--primary-dark, #004d40) !important;
                        stroke: #ffffff;
                        stroke-width: 4;
                        transform: scale(1.06);
                        filter: drop-shadow(0 12px 24px rgba(0, 77, 64, 0.6)) !important;
                    }

                    /* Estilo para los nombres/etiquetas de las provincias */
                    .province-label {
                        font-family: system-ui, -apple-system, sans-serif;
                        font-size: 18px;
                        font-weight: 700;
                        fill: #ECF39E;
                        pointer-events: none;
                        transition: fill 0.3s, font-size 0.3s, font-weight 0.3s;
                        text-anchor: middle;
                        dominant-baseline: middle;
                    }

                    /* Resaltado de la etiqueta seleccionada */
                    .province-label.active {
                        fill: var(--primary-dark, #004d40);
                        font-size: 16px;
                        font-weight: 800;
                    }

                    /* Contenedor de la etiqueta para crear un fondo sutil de texto */
                    .label-bg {
                        fill: rgba(79, 119, 45, 0.75);
                        pointer-events: none;
                        rx: 6;
                        ry: 6;
                        transition: opacity 0.3s;
                    }

                    /* Ocultar fondos de etiquetas que no están seleccionadas al filtrar */
                    :host([has-selection]) .label-bg:not(.active-bg) {
                        opacity: 0.4;
                    }

                    /* Desactivar interacciones si el componente está deshabilitado */
                    :host([disabled]) path {
                        pointer-events: none !important;
                        cursor: default !important;
                    }
                </style>
                <div class="map-container" role="application" aria-label="Mapa interactivo turístico de Costa Rica">
                    ${svgText}
                </div>
            `;

            this.inicializarComponentes();
        } catch (error) {
            console.error(error);
            this.shadowRoot.innerHTML = `<p style="color: red; padding: 24px; text-align: center;">Error al cargar el mapa interactivo: ${error.message}</p>`;
        }
    }

    inicializarComponentes() {
        const svg = this.shadowRoot.querySelector('svg');
        if (!svg) return;

        // Asegurar que el SVG use viewBox para adaptabilidad
        if (!svg.getAttribute('viewBox')) {
            svg.setAttribute('viewBox', '0 0 1000 1000');
        }
        svg.style.width = '100%';
        svg.style.height = 'auto';

        // Obtener provincias (paths)
        const paths = svg.querySelectorAll('#features path');
        
        // Cargar nombres de las provincias e inicializar interacción
        paths.forEach(path => {
            const id = path.getAttribute('id');
            const name = path.getAttribute('name') || path.getAttribute('class');
            
            if (id && name) {
                this.provincias.push({ id, name, element: path });
                
                // Configurar accesibilidad en el path
                // Configurar accesibilidad en el path
                path.setAttribute('tabindex', this.hasAttribute('disabled') ? '-1' : '0');
                path.setAttribute('role', 'button');
                path.setAttribute('aria-label', `Provincia de ${name}`);
                path.setAttribute('aria-pressed', 'false');

                // Eventos de interacción
                path.addEventListener('click', (e) => {
                    if (this.hasAttribute('disabled')) return;
                    e.stopPropagation();
                    this.seleccionarProvincia(id);
                });

                path.addEventListener('keydown', (e) => {
                    if (this.hasAttribute('disabled')) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.seleccionarProvincia(id);
                    }
                });
            }
        });

        // Crear etiquetas de texto basadas en label_points
        const labelPoints = svg.querySelectorAll('#label_points circle');
        if (labelPoints.length > 0) {
            // Crear grupo para las etiquetas si no existe
            let labelsGroup = svg.querySelector('#text_labels');
            if (!labelsGroup) {
                labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                labelsGroup.setAttribute('id', 'text_labels');
                svg.appendChild(labelsGroup);
            }

            labelPoints.forEach(circle => {
                const id = circle.getAttribute('id');
                const provinceName = circle.className.baseVal || circle.getAttribute('class');
                const cx = parseFloat(circle.getAttribute('cx'));
                const cy = parseFloat(circle.getAttribute('cy'));

                if (provinceName && !isNaN(cx) && !isNaN(cy)) {
                    // Ocular el punto original
                    circle.style.display = 'none';

                    // 1. Crear un fondo sutil para el texto (mejora legibilidad sobre bordes)
                    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    bgRect.setAttribute('x', (cx - 50).toString());
                    bgRect.setAttribute('y', (cy - 12).toString());
                    bgRect.setAttribute('width', '100');
                    bgRect.setAttribute('height', '24');
                    bgRect.setAttribute('class', 'label-bg');
                    bgRect.setAttribute('data-id', id);

                    // 2. Crear texto
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', cx.toString());
                    text.setAttribute('y', cy.toString());
                    text.setAttribute('class', 'province-label');
                    text.setAttribute('data-id', id);
                    text.textContent = provinceName;

                    labelsGroup.appendChild(bgRect);
                    labelsGroup.appendChild(text);

                    // Ajustar el ancho del fondo dinámicamente según el tamaño del texto
                    setTimeout(() => {
                        try {
                            const textLength = text.getBBox().width;
                            bgRect.setAttribute('width', (textLength + 16).toString());
                            bgRect.setAttribute('x', (cx - (textLength + 16) / 2).toString());
                        } catch (e) {
                            // Fallback si getBBox no está disponible inmediatamente
                        }
                    }, 50);
                }
            });
        }

        // Clic en el fondo del SVG deselecciona la provincia activa
        svg.addEventListener('click', () => {
            if (this.hasAttribute('disabled')) return;
            this.deseleccionarTodo();
        });
    }

    seleccionarProvincia(id) {
        if (this.selectedProvinceId === id) {
            // Si ya está seleccionada, deseleccionar
            this.deseleccionarTodo();
            return;
        }

        this.selectedProvinceId = id;
        this.setAttribute('has-selection', '');

        const svg = this.shadowRoot.querySelector('svg');
        const featuresGroup = svg.querySelector('#features');

        this.provincias.forEach(prov => {
            if (prov.id === id) {
                prov.element.classList.add('selected');
                prov.element.setAttribute('aria-pressed', 'true');
                
                // Mover al final de su grupo contenedor en el DOM para que se dibuje encima (capas SVG)
                if (featuresGroup) {
                    featuresGroup.appendChild(prov.element);
                }
            } else {
                prov.element.classList.remove('selected');
                prov.element.setAttribute('aria-pressed', 'false');
            }
        });

        // Activar la clase active en la etiqueta de texto y fondo correspondientes
        this.shadowRoot.querySelectorAll('.province-label, .label-bg').forEach(el => {
            if (el.getAttribute('data-id') === id) {
                el.classList.add('active', 'active-bg');
            } else {
                el.classList.remove('active', 'active-bg');
            }
        });

        // Despachar evento de selección
        const provSeleccionada = this.provincias.find(p => p.id === id);
        if (!this.hasAttribute('disabled')) {
            this.dispatchEvent(new CustomEvent('provincia-seleccionada', {
                detail: {
                    id: id,
                    nombre: provSeleccionada ? provSeleccionada.name : ''
                },
                bubbles: true,
                composed: true
            }));
        }
    }

    deseleccionarTodo() {
        this.selectedProvinceId = null;
        this.removeAttribute('has-selection');

        this.provincias.forEach(prov => {
            prov.element.classList.remove('selected');
            prov.element.setAttribute('aria-pressed', 'false');
        });

        this.shadowRoot.querySelectorAll('.province-label, .label-bg').forEach(el => {
            el.classList.remove('active', 'active-bg');
        });

        // Despachar evento de deselección
        if (!this.hasAttribute('disabled')) {
            this.dispatchEvent(new CustomEvent('provincia-deseleccionada', {
                bubbles: true,
                composed: true
            }));
        }
    }

    resaltarProvinciasDeRegion(regionNombre) {
        if (!regionNombre) {
            this.deseleccionarTodo();
            return;
        }

        const regionToProvincias = {
            'Caribe': ['Limón'],
            'Pacífico Norte': ['Guanacaste'],
            'Central': ['Alajuela', 'Cartago', 'Heredia', 'San José'],
            'Pacífico Sur': ['Puntarenas']
        };

        const provinciasResaltar = regionToProvincias[regionNombre] || [];

        this.selectedProvinceId = null;
        this.setAttribute('has-selection', '');

        const svg = this.shadowRoot.querySelector('svg');
        const featuresGroup = svg ? svg.querySelector('#features') : null;

        this.provincias.forEach(prov => {
            const name = prov.name;
            const match = provinciasResaltar.some(p => p.toLowerCase() === name.toLowerCase());

            if (match) {
                prov.element.classList.add('selected');
                prov.element.setAttribute('aria-pressed', 'true');
                if (featuresGroup) {
                    featuresGroup.appendChild(prov.element);
                }
            } else {
                prov.element.classList.remove('selected');
                prov.element.setAttribute('aria-pressed', 'false');
            }
        });

        // Sync text labels
        this.shadowRoot.querySelectorAll('.province-label, .label-bg').forEach(el => {
            const id = el.getAttribute('data-id');
            const provObj = this.provincias.find(p => p.id === id);
            const match = provObj && provinciasResaltar.some(p => p.toLowerCase() === provObj.name.toLowerCase());
            
            if (match) {
                el.classList.add('active', 'active-bg');
            } else {
                el.classList.remove('active', 'active-bg');
            }
        });
    }

    resaltarProvinciasDeGuardados(savedProvinces) {
        if (!savedProvinces || savedProvinces.length === 0) {
            this.deseleccionarTodo();
            return;
        }

        this.selectedProvinceId = null;
        this.setAttribute('has-selection', '');

        const svg = this.shadowRoot.querySelector('svg');
        const featuresGroup = svg ? svg.querySelector('#features') : null;

        this.provincias.forEach(prov => {
            const name = prov.name;
            const match = savedProvinces.some(p => p.toLowerCase() === name.toLowerCase());

            if (match) {
                prov.element.classList.add('selected');
                prov.element.setAttribute('aria-pressed', 'true');
                if (featuresGroup) {
                    featuresGroup.appendChild(prov.element);
                }
            } else {
                prov.element.classList.remove('selected');
                prov.element.setAttribute('aria-pressed', 'false');
            }
        });

        // Sync text labels
        this.shadowRoot.querySelectorAll('.province-label, .label-bg').forEach(el => {
            const id = el.getAttribute('data-id');
            const provObj = this.provincias.find(p => p.id === id);
            const match = provObj && savedProvinces.some(p => p.toLowerCase() === provObj.name.toLowerCase());
            
            if (match) {
                el.classList.add('active', 'active-bg');
            } else {
                el.classList.remove('active', 'active-bg');
            }
        });
    }
}

customElements.define('mapa-turistico', MapaTuristico);
