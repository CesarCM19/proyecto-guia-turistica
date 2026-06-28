# Guía Turística Multimedia de Costa Rica

Este proyecto es una aplicación web interactiva desarrollada para servir como una guía turística multimedia, mostrando distintos destinos de Costa Rica. Permite a los usuarios explorar atractivos turísticos, visualizar galerías fotográficas, reproducir guías de audio descriptivas y disfrutar de videos representativos de cada destino. 

La aplicación está construida utilizando estándares web nativos y modernos, incluyendo HTML5, CSS3, JavaScript (ES6+) y la especificación de Web Components (Custom Elements v1, Shadow DOM v1, HTML Templates y ES Modules), garantizando un diseño modular y encapsulado sin la necesidad de dependencias o frameworks externos (como React o Angular).

## Estructura de Carpetas

```text
proyecto-guia-turistica/
├── assets/                 # Recursos multimedia como audios, videos e imágenes
├── components/             # Definición de los Custom Elements nativos
│   ├── audio-guia.js
│   ├── destino-card.js
│   ├── destino-detalle.js
│   ├── galeria-imagenes.js
│   ├── header.js
│   └── video-destino.js
├── css/                    # Hojas de estilo de la aplicación
├── data/                   # Archivos JSON con la información de los destinos
├── docs/                   # Documentación adicional
├── js/                     # Lógica principal y enrutamiento (app.js)
├── index.html              # Archivo principal y punto de entrada
└── README.md               # Este archivo de documentación
```

## Requisitos previos

Para poder visualizar y ejecutar el proyecto únicamente se requiere:
- Un navegador web moderno actualizado (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, etc.).
- Una herramienta para levantar un servidor HTTP local. No se requieren dependencias de NPM de producción ni procesos de compilación (build tools).

## Cómo ejecutar el proyecto localmente

Este proyecto hace uso intensivo de **ES Modules** (módulos de JavaScript nativos definidos con `type="module"`), lo que significa que **no se puede abrir el archivo `index.html` directamente desde el sistema de archivos** haciendo doble clic (con el protocolo `file://`). Los navegadores bloquean la carga de módulos locales por estrictas políticas de seguridad (CORS). Por esto, es indispensable servir el proyecto a través de un servidor HTTP.

Puedes utilizar cualquiera de las siguientes tres opciones:

### Opción 1: Usando `npx serve` (sin instalación previa de paquetes)
Si tienes Node.js instalado, puedes usar `npx` para ejecutar un servidor estático rápido:
1. Abre tu terminal en la carpeta raíz del proyecto.
2. Ejecuta el comando: 
   ```bash
   npx serve .
   ```
3. **Puerto resultante:** Por defecto, normalmente se asigna el puerto `3000`.
4. **URL a abrir:** Dirígete a `http://localhost:3000` en tu navegador.

### Opción 2: Usando Python
Si tienes Python 3 instalado en tu sistema, ya cuentas con un servidor HTTP integrado:
1. Abre tu terminal en la carpeta raíz del proyecto.
2. Ejecuta el comando:
   ```bash
   python -m http.server 8000
   ```
3. **Puerto resultante:** Se asigna el puerto `8000`.
4. **URL a abrir:** Dirígete a `http://localhost:8000` en tu navegador.

### Opción 3: Extensión "Live Server" de VS Code
Si utilizas el editor de código Visual Studio Code:
1. Instala la extensión **Live Server** (por Ritwick Dey).
2. Abre la carpeta del proyecto en VS Code.
3. Haz clic derecho sobre el archivo `index.html` en el explorador de archivos.
4. Selecciona la opción **"Open with Live Server"**.
5. **Puerto resultante:** Por defecto, suele levantar en el puerto `5500`.
6. **URL a abrir:** Automáticamente se abrirá en tu navegador la URL `http://127.0.0.1:5500/index.html` (o `http://localhost:5500`).

## Tecnologías utilizadas

El proyecto está diseñado bajo una arquitectura de componentes web puros, implementando los siguientes Custom Elements:
- `<app-header>`: Encabezado principal de la aplicación.
- `<destino-card>`: Tarjeta de previsualización para mostrar información básica de cada destino turístico.
- `<destino-detalle>`: Vista detallada del destino, instanciando dentro de sí otros componentes.
- `<galeria-imagenes>`: Carrusel interactivo y encapsulado para visualizar la colección de fotos del destino.
- `<audio-guia>`: Reproductor de audio personalizado para acompañar el recorrido con narración.
- `<video-destino>`: Reproductor para mostrar material audiovisual destacado del lugar.

## Créditos

Este es un proyecto desarrollado para el curso **IF7102 — Multimedios, I Ciclo 2026, Universidad de Costa Rica**.