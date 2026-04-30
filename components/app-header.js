/**
 * COMPONENTE: <app-header>
 * RESPONSABLE: César
 * DESCRIPCION: Barra de navegación principal de la Guía Turística de Costa Rica.
 *              Muestra el nombre de la guía y un menú con las 4 regiones.
 *              Emite un CustomEvent 'region-selected' cuando el usuario hace clic.
 *
 * USO EN HTML:
 *   <app-header active-region="Caribe"></app-header>
 *
 * EVENTOS QUE EMITE:
 *   - 'region-selected' → { detail: { region: "Caribe" } }
 *
 * ATRIBUTOS OBSERVADOS:
 *   - active-region → resalta la región activa en el menú
 */

class AppHeader extends HTMLElement {

  // 
  // 1. ATRIBUTOS OBSERVADOS
  // Le decimos al navegador cuáles atributos debe "vigilar".
  // Cuando cambie 'active-region', se llamará automáticamente
  // el método attributeChangedCallback().
  // 
static get observedAttributes() {
    return ['active-region'];
}

  // 2. CONSTRUCTOR
  // Se ejecuta cuando se crea el elemento.
  // Aquí adjuntamos el Shadow DOM (modo 'open' = accesible desde JS externo).
  // 
constructor() {
    super(); // SIEMPRE se debe llamar super() primero en un Custom Element
    this.attachShadow({ mode: 'open' });
}

  // 3. REGIONES DISPONIBLES
  // Array con las 4 regiones del proyecto.
  // Centralizado aquí para fácil mantenimiento.

get regiones() {
    return ['Caribe', 'Pacífico Norte', 'Central', 'Pacífico Sur'];
}

  // 
  // 4. connectedCallback
  // Se ejecuta cuando el elemento se INSERTA en la página.
  // Aquí es donde renderizamos por primera vez.
  // 
connectedCallback() {
    this.render();
    this.setupEventListeners();
}

  // 
  // 5. attributeChangedCallback
  // Se ejecuta cada vez que cambia un atributo observado.
  // Recibe el nombre del atributo, valor anterior y nuevo valor.
  // 
attributeChangedCallback(name, oldValue, newValue) {
    // Solo actualizamos si el valor realmente cambió
    if (oldValue !== newValue) {
      // Actualizamos la clase 'active' en el menú sin re-renderizar todo
    this.updateActiveRegion(newValue);
    }
}

  // 
  // 6. RENDER
  // Genera el HTML y CSS del componente dentro del Shadow DOM.
  // Los estilos aquí NO afectan al resto de la página (encapsulación).
  // 
render() {
    const regionActiva = this.getAttribute('active-region') || '';

    // Generamos los botones del menú dinámicamente desde el array de regiones
    const menuHTML = this.regiones
    .map(region => `
        <button
        class="nav-btn ${region === regionActiva ? 'active' : ''}"
        data-region="${region}"
        aria-label="Ver destinos de ${region}"
        >
        ${region}
        </button>
    `)
    .join('');

    // Inyectamos el HTML completo en el Shadow DOM
    this.shadowRoot.innerHTML = `
    <style>
        /*  ESTILOS ENCAPSULADOS 
        Estos estilos SOLO aplican dentro de este componente.
        No contaminan el resto de la página (gracias al Shadow DOM).
       */

    :host {
        display: block;
        width: 100%;
    }

    header {
        background-color: #1a5276;
        color: #ffffff;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        min-height: 64px;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: inherit;
    }

    .logo-icon {
        font-size: 28px;
    }

    .logo-text {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0.5px;
    }

    nav {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
    }

    .nav-btn {
        background: transparent;
        color: rgba(255, 255, 255, 0.85);
        border: 1px solid transparent;
        border-radius: 6px;
        padding: 8px 14px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .nav-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.3);
    }

    /* Clase 'active' resalta la región seleccionada */
    .nav-btn.active {
        background: rgba(255, 255, 255, 0.25);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.6);
        font-weight: 600;
    }

        /* Diseño responsivo: en pantallas pequeñas el menú va abajo */
        @media (max-width: 640px) {
        header {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px 16px;
        }

        nav {
            width: 100%;
        }

        .nav-btn {
            flex: 1;
            text-align: center;
            font-size: 12px;
            padding: 6px 8px;
        }
    }
    </style>

    <header>
    <div class="logo">
        <span class="logo-icon" aria-hidden="true">&#127464;&#127479;</span>
        <span class="logo-text">Guía Turística de Costa Rica</span>
    </div>

        <nav aria-label="Regiones turísticas">
        ${menuHTML}
        </nav>
    </header>
    `;
}

  // 
  // 7. SETUP DE EVENTOS
  // Escuchamos los clics en los botones de región.
  // Usamos delegación de eventos: un solo listener en el nav.
  // 
setupEventListeners() {
    const nav = this.shadowRoot.querySelector('nav');

    nav.addEventListener('click', (event) => {
      // Buscamos si el clic fue en un botón de región
    const btn = event.target.closest('.nav-btn');
      if (!btn) return; // Clic en otro lugar → ignoramos

    const regionSeleccionada = btn.dataset.region;

      // Actualizamos el atributo activo del componente
    this.setAttribute('active-region', regionSeleccionada);

      //  EMITIR CUSTOM EVENT 
      // Este evento viaja hacia ARRIBA (bubbles: true) en el DOM.
      // index.html lo puede escuchar así:
      //   document.querySelector('app-header')
      //     .addEventListener('region-selected', e => console.log(e.detail.region))
      // 
    const evento = new CustomEvent('region-selected', {
        bubbles: true,        // El evento sube por el árbol DOM
        composed: true,       // Puede cruzar el límite del Shadow DOM
        detail: {
        region: regionSeleccionada
        }
    });

    this.dispatchEvent(evento);
    });
}

  // 
  // 8. ACTUALIZAR REGIÓN ACTIVA
  // En lugar de re-renderizar todo el componente,
  // solo actualizamos las clases CSS de los botones.
  // Esto es más eficiente y evita parpadeos.
  // 
updateActiveRegion(regionActiva) {
    const botones = this.shadowRoot.querySelectorAll('.nav-btn');
    botones.forEach(btn => {
    if (btn.dataset.region === regionActiva) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
    });
  }
}

// 
// 9. REGISTRAR EL CUSTOM ELEMENT
// Le decimos al navegador: "cuando veas <app-header> en el HTML,
// usa la clase AppHeader para crearlo".
// 
customElements.define('app-header', AppHeader);