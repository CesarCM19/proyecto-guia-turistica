// ==========================================================
// IMPORTACIÓN DE COMPONENTES (WEB COMPONENTS NATIVOS)
// ==========================================================
import '../components/app-header.js';
import '../components/destino-card.js';
import '../components/destino-detalle.js';
import '../components/galeria-imagenes.js';
import '../components/audio-guia.js';
import '../components/mapa-turistico.js';
import '../components/video-destino.js';

// ==========================================================
// ESTADO GLOBAL
// ==========================================================
const state = {
    regionActual: null,
    destinoActual: null,
    busquedaActual: '',
    destinos: []
};

// Alias local para mantener la compatibilidad
let destinos = state.destinos;

// Mapeo región → slug de URL
const regionToSlug = {
    'Caribe':         'caribe',
    'Pacífico Norte': 'pacifico-norte',
    'Central':        'central',
    'Pacífico Sur':   'sur'
};

// Mapeo slug → nombre de región
const slugToRegion = {
    'caribe':         'Caribe',
    'pacifico-norte': 'Pacífico Norte',
    'central':        'Central',
    'sur':            'Pacífico Sur'
};

// Relación de destinos y provincias geográficas de Costa Rica
const provinciaDeDestino = {
    'caribe-001':     'Limón',
    'caribe-002':     'Limón',
    'guanacaste-001': 'Guanacaste',
    'guanacaste-002': 'Guanacaste',
    'central-001':    'Alajuela',
    'central-002':    'Cartago',
    'sur-001':        'Puntarenas',
    'sur-002':        'Puntarenas'
};

// ==========================================================
// UTILIDADES
// ==========================================================
function normalizar(str) {
    if (!str) return '';
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getSlugFromRegion(region) {
    if (!region) return '';
    if (regionToSlug[region]) return regionToSlug[region];
    const norm = normalizar(region);
    if (norm.includes('norte'))   return 'pacifico-norte';
    if (norm.includes('sur'))     return 'sur';
    if (norm.includes('caribe'))  return 'caribe';
    if (norm.includes('central')) return 'central';
    return norm;
}

// ==========================================================
// ESTADOS DE INTERFAZ: loading / error / no-results
// ==========================================================
function renderStatus(tipo, mensaje) {
    const cont = document.getElementById('lista');
    if (!cont) return;

    if (tipo === 'loading') {
        cont.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px 24px; color:var(--text-sec);">
                <div style="font-size:2.5rem; margin-bottom:12px; animation: bounce-slow 1.5s infinite;">🌿</div>
                <p style="font-size:1rem; font-weight:600;">Cargando destinos…</p>
            </div>`;
    } else if (tipo === 'error') {
        cont.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px 24px; color:#e53e3e;">
                <div style="font-size:2.5rem; margin-bottom:12px;">⚠️</div>
                <p style="font-size:1rem; font-weight:600; margin-bottom:16px;">${mensaje}</p>
                <button id="btn-reintentar" style="background:var(--primary-dark);color:white;border:none;padding:12px 28px;border-radius:999px;font-weight:600;cursor:pointer;font-size:0.95rem;">
                    Reintentar
                </button>
            </div>`;
        const btnReint = document.getElementById('btn-reintentar');
        if (btnReint) btnReint.addEventListener('click', cargarDatos);
    } else if (tipo === 'no-results') {
        cont.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px 24px; color:var(--text-sec);">
                <div style="font-size:2.5rem; margin-bottom:12px;">🔍</div>
                <p style="font-size:1rem; font-weight:600;">${mensaje}</p>
            </div>`;
    }
}

// ==========================================================
// BUSCADOR AVANZADO (DIACRÍTICOS Y MULTI-CAMPO)
// ==========================================================
function getFilteredDestinos() {
    return state.destinos.filter(d => {
        // 1. Filtro por Región Activa
        if (state.regionActual) {
            if (normalizar(d.region) !== normalizar(state.regionActual)) return false;
        }

        // 2. Filtro por Búsqueda Activa
        if (state.busquedaActual) {
            const query = normalizar(state.busquedaActual).trim();
            if (query !== '') {
                const matchNombre  = normalizar(d.nombre).includes(query);
                const matchRegion  = normalizar(d.region).includes(query);
                const matchDesc    = normalizar(d.descripcion).includes(query);
                const matchAct     = (d.actividades || []).some(act => normalizar(act).includes(query));
                if (!matchNombre && !matchRegion && !matchDesc && !matchAct) return false;
            }
        }

        return true;
    });
}

// ==========================================================
// RENDER: LISTA DE DESTINOS
// ==========================================
function renderLista(listaFiltrada, titulo) {
    const cont        = document.getElementById('lista');
    const vistaLista  = document.getElementById('vista-lista');
    const vistaRegiones = document.getElementById('vista-regiones');
    const vistaAudios = document.getElementById('vista-audios');
    const detalleSec  = document.getElementById('detalle');

    // Título de sección
    const tituloEl = document.getElementById('titulo-seccion');
    if (tituloEl) tituloEl.textContent = titulo || 'Destinos Destacados';

    // Mostrar/ocultar secciones
    if (vistaLista)    vistaLista.style.display    = 'block';
    if (vistaRegiones) vistaRegiones.style.display = 'none';
    if (vistaAudios)   vistaAudios.style.display   = 'none';
    if (detalleSec)    detalleSec.style.display     = 'none';

    cont.innerHTML = '';

    // Si no hay lista explícita, usar filtros del estado
    const lista = listaFiltrada !== undefined ? listaFiltrada : getFilteredDestinos();

    if (lista.length === 0) {
        renderStatus('no-results', 'No se encontraron destinos para los criterios seleccionados.');
        return;
    }

    lista.forEach(d => {
        const card = document.createElement('destino-card');
        card.data = d;
        cont.appendChild(card);
    });
}

// ==========================================
// RENDER: DETALLE DE DESTINO
// ==========================================
function renderDetalle(id) {
    const cont        = document.getElementById('detalle');
    const vistaLista  = document.getElementById('vista-lista');
    const vistaRegiones = document.getElementById('vista-regiones');
    const vistaAudios = document.getElementById('vista-audios');

    const destino = state.destinos.find(d => d.id === id);
    if (!destino) {
        console.warn('Destino no encontrado:', id);
        return;
    }

    state.destinoActual = id;

    if (vistaLista)    vistaLista.style.display    = 'none';
    if (vistaRegiones) vistaRegiones.style.display = 'none';
    if (vistaAudios)   vistaAudios.style.display   = 'none';

    cont.style.display = 'block';
    cont.innerHTML = '';

    const detalleEl = document.createElement('destino-detalle');
    detalleEl.data = destino;
    cont.appendChild(detalleEl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// ROUTER BASADO EN HASH
// ==========================================
function handleRoute() {
    const hash = window.location.hash || '#/';
    const appHeader = document.querySelector('app-header');
    if (appHeader) appHeader.removeAttribute('active-region');

    // Formato nuevo: #/destino/:id
    if (/^#\/destino\/(.+)$/.test(hash)) {
        const id = hash.match(/^#\/destino\/(.+)$/)[1];
        renderDetalle(id);
        return;
    }

    // Formato legado: #detalle-:id
    if (/^#detalle-(.+)$/.test(hash)) {
        const id = hash.match(/^#detalle-(.+)$/)[1];
        renderDetalle(id);
        return;
    }

    // Formato nuevo: #/region/:slug
    if (/^#\/region\/(.+)$/.test(hash)) {
        const slug = hash.match(/^#\/region\/(.+)$/)[1];
        const regionNombre = slugToRegion[slug] || slug;
        state.regionActual = regionNombre;
        if (appHeader) appHeader.setAttribute('active-region', regionNombre);
        renderLista(undefined, 'Región ' + regionNombre);
        actualizarNavActivo(0);
        return;
    }

    // Vista de regiones: #/regiones
    if (hash === '#/regiones') {
        mostrarVistaRegiones();
        return;
    }

    // Vista de audios: #/audios
    if (hash === '#/audios') {
        mostrarVistaAudios();
        return;
    }

    // Vista de guardados: #/guardados
    if (hash === '#/guardados') {
        mostrarVistaGuardados();
        return;
    }

    // Vista principal: #/ o vacío
    state.regionActual  = null;
    state.destinoActual = null;
    renderLista(undefined, 'Destinos Destacados');
    actualizarNavActivo(0);
}

// ==========================================
// VISTAS ESPECIALES
// ==========================================
function mostrarVistaRegiones() {
    document.getElementById('vista-lista').style.display    = 'none';
    document.getElementById('detalle').style.display        = 'none';
    const vistaAudios = document.getElementById('vista-audios');
    if (vistaAudios) vistaAudios.style.display = 'none';
    document.getElementById('vista-regiones').style.display = 'block';
    actualizarNavActivo(1);
}

function mostrarVistaAudios() {
    document.getElementById('vista-lista').style.display    = 'none';
    document.getElementById('detalle').style.display        = 'none';
    document.getElementById('vista-regiones').style.display = 'none';

    const vistaAudios = document.getElementById('vista-audios');
    if (vistaAudios) vistaAudios.style.display = 'block';

    const contAudios = document.getElementById('lista-audios');
    if (contAudios && contAudios.children.length === 0) {
        state.destinos.filter(d => d.audio).forEach(d => {
            const audioGuia = document.createElement('audio-guia');
            audioGuia.setAttribute('src', d.audio);
            audioGuia.setAttribute('label', 'Guía de ' + d.nombre);
            audioGuia.style.marginBottom = '24px';
            contAudios.appendChild(audioGuia);
        });
    }
    actualizarNavActivo(2);
}

function mostrarVistaGuardados() {
    const guardados  = JSON.parse(localStorage.getItem('guardados') || '[]');
    const filtrados  = state.destinos.filter(d => guardados.includes(d.id));
    if (filtrados.length === 0) {
        renderLista([], 'Mis Destinos Guardados');
        const listaCont = document.getElementById('lista');
        if (listaCont) {
            listaCont.innerHTML = '<p style="padding:24px;color:#718096;text-align:center;grid-column:1/-1;">Explora destinos y guárdalos presionando el ícono de corazón.</p>';
        }
    } else {
        renderLista(filtrados, 'Mis Destinos Guardados');
    }
    actualizarNavActivo(3);
}

// ==========================================
// MAPA INTERACTIVO (LOGICA DE FILTRADO)
// ==========================================
function mostrarExploradorProvincia(idProvincia, nombreProvincia) {
    const destinosProv = state.destinos.filter(d => provinciaDeDestino[d.id] === nombreProvincia);

    if (destinosProv.length > 0) {
        renderLista(destinosProv, 'Destinos en ' + nombreProvincia);
    } else {
        renderLista([], nombreProvincia);
        const listaEl = document.getElementById('lista');
        if (listaEl) {
            listaEl.innerHTML = `
                <p style="padding: 24px; color: #718096; text-align: center; grid-column: 1/-1;">
                    Esta hermosa provincia actualmente no cuenta con guías cargadas en nuestro sistema.
                </p>
            `;
        }
    }
}

function restaurarVistaLista() {
    state.busquedaActual = '';
    const buscadorInput = document.getElementById('buscador');
    if (buscadorInput) buscadorInput.value = '';
    renderLista(state.destinos);
}

// ==========================================
// CARGA DE DATOS (FETCH)
// ==========================================
async function cargarDatos() {
    renderStatus('loading', '');
    try {
        const res = await fetch('data/destinos.json?v=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();

        // Guardar en state y sincronizar alias
        state.destinos.length = 0;
        (json.destinos || []).forEach(d => state.destinos.push(d));
        destinos = state.destinos;

        // Lanzar el router para la ruta inicial
        handleRoute();
    } catch (err) {
        console.error('Error al cargar destinos:', err);
        renderStatus('error', 'No se pudieron cargar los destinos. Verifica tu conexión.');
    }
}

// ==========================================
// BOTTOM NAV
// ==========================================
function actualizarNavActivo(indice) {
    document.querySelectorAll('.nav-item').forEach((el, i) => {
        el.classList.toggle('active', i === indice);
    });
}

document.querySelectorAll('.nav-item').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        actualizarNavActivo(index);
        if (index === 0) {
            state.regionActual  = null;
            state.destinoActual = null;
            state.busquedaActual = '';
            const buscadorInput = document.getElementById('buscador');
            if (buscadorInput) buscadorInput.value = '';
            
            const mapa = document.getElementById('mapa-guia');
            if (mapa) mapa.deseleccionarTodo();

            window.location.hash = '#/';
        } else if (index === 1) {
            window.location.hash = '#/regiones';
        } else if (index === 2) {
            window.location.hash = '#/audios';
        } else if (index === 3) {
            window.location.hash = '#/guardados';
        }
    });
});

// ==========================================
// BUSCADOR EN TIEMPO REAL + BOTÓN
// ==========================================
const inputBuscador = document.getElementById('buscador');
const btnBuscar     = document.getElementById('btnBuscar');

function ejecutarBusqueda() {
    state.busquedaActual = inputBuscador ? inputBuscador.value : '';
    const vistaLista = document.getElementById('vista-lista');
    const detalleSec = document.getElementById('detalle');
    if (detalleSec) detalleSec.style.display = 'none';
    if (vistaLista)  vistaLista.style.display = 'block';
    document.getElementById('vista-regiones').style.display = 'none';
    const vistaAudios = document.getElementById('vista-audios');
    if (vistaAudios) vistaAudios.style.display = 'none';
    renderLista(undefined, state.busquedaActual ? 'Resultados de Búsqueda' : 'Destinos Destacados');
}

if (inputBuscador) {
    inputBuscador.addEventListener('input', ejecutarBusqueda);
}
if (btnBuscar) {
    btnBuscar.addEventListener('click', ejecutarBusqueda);
}

// ==========================================
// VER TODAS LAS REGIONES (link "View All")
// ==========================================
const viewAllLink = document.querySelector('.view-all');
if (viewAllLink) {
    viewAllLink.addEventListener('click', () => {
        window.location.hash = '#/regiones';
    });
    viewAllLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.hash = '#/regiones'; }
    });
}

// ==========================================
// CUSTOM EVENTS (region-selected, destino-selected, volver-lista)
// ==========================================
document.addEventListener('region-selected', (e) => {
    const region = e.detail && e.detail.region;
    if (!region) return;
    state.regionActual  = region;
    state.destinoActual = null;
    const slug = getSlugFromRegion(region);
    window.location.hash = '#/region/' + slug;
});

document.addEventListener('destino-selected', (e) => {
    const id = e.detail && e.detail.id;
    if (!id) return;
    state.destinoActual = id;
    window.location.hash = '#/destino/' + id;
});

document.addEventListener('volver-lista', () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        if (state.regionActual) {
            const slug = getSlugFromRegion(state.regionActual);
            window.location.hash = '#/region/' + slug;
        } else {
            window.location.hash = '#/';
        }
    }
});

// ==========================================
// EVENTO ABRIR-REGIONES (menú hamburguesa)
// ==========================================
document.addEventListener('abrir-regiones', () => {
    window.location.hash = '#/regiones';
});

// ==========================================
// TARJETAS DE REGIONES (click en region-card)
// ==========================================
document.addEventListener('click', (e) => {
    const card = e.target.closest('.region-card');
    if (card) {
        const region = card.dataset.region;
        document.dispatchEvent(new CustomEvent('region-selected', {
            detail: { region },
            bubbles: true,
            composed: true
        }));
    }
});

// ==========================================
// MAPA: eventos provincia-seleccionada / provincia-deseleccionada
// ==========================================
setTimeout(() => {
    const mapa = document.getElementById('mapa-guia');
    if (mapa) {
        mapa.addEventListener('provincia-seleccionada', (e) => {
            mostrarExploradorProvincia(e.detail.id, e.detail.nombre);
        });
        mapa.addEventListener('provincia-deseleccionada', () => {
            restaurarVistaLista();
        });
    }
}, 150);

// ==========================================
// APP-HEADER NAVIGATION SYNCRONIZATION
// ==========================================
const appHeaderElement = document.querySelector('app-header');
if (appHeaderElement) {
    appHeaderElement.addEventListener('nav-change', (e) => {
        const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
        if (bottomNavItems[e.detail.index]) {
            bottomNavItems[e.detail.index].click();
        }
    });
}

// ==========================================
// ROUTER: escuchar cambios de hash
// ==========================================
window.addEventListener('hashchange', handleRoute);

// ==========================================
// ARRANQUE
// ==========================================
cargarDatos();
