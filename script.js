/**
 * @file script.js
 * @description Core Architecture for ANIBALBUILD Official Website.
 * Engineered for high-performance, maintainability, and cinematic UI interactions.
 * Built strictly following Clean Code, ES6+, SOLID principles, and Vanilla Production standards.
 * * @version 2.1.0
 * @author ANIBALBUILD <Front-End Engineering>
 */

/* ==========================================================================
   1. CONFIGURATION (Global App Settings Ecosystem)
   ========================================================================== */
const CONFIG = {
    social: {
        spotifyProfile: "https://open.spotify.com/user/im0hb56341foca5u6hd415g5p",
        youtubeChannel: "https://youtube.com",
        instagram: "https://instagram.com",
        email: "contacto@anibalbuild.com"
    },
    ui: {
        animationDuration: 800,       // ms
        parallaxSpeed: 0.15,          // Coeficiente de interpolación
        maxFeaturedSongs: 12,
        scrollNavbarThreshold: 60,
        rippleDuration: 600,          // ms
        mouseGlowLerp: 0.08           // Suavizado del movimiento de luces
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024
    },
    selectors: {
        featuredContainer: "#featuredSongs",
        navbar: "#mainNav",
        hero: "#hero",
        heroImage: ".hero-img",
        heroContent: ".hero-content",
        yearSpan: "#year"
    }
};

/* ==========================================================================
   2. DATA SOURCE (Master Scalable Catalog Ecosystem)
   ========================================================================== */
const featuredSongs = [
    {
        title: "Mi Despedida",
        description: "Una pieza íntima dominada por guitarras acústicas y capas tonales que retratan la melancolía del adiós.",
        youtube: "https://www.youtube.com/watch?v=RU7-Irn_no4",
        spotify: "", // Hereda URL base del perfil por defecto si se deja vacío
        badge: "Nuevo",
        releaseDate: "2025-12-15",
        album: "Lanzamientos Aislados",
        category: "baladas",
        featured: true
    },
    {
        title: "Noche Tranquila",
        description: "Atmósfera nocturna de texturas limpias y arreglos sutiles diseñada para la introspección melódica.",
        youtube: "https://www.youtube.com/watch?v=P6PSARJ_BjI",
        spotify: "",
        badge: "Acústico",
        releaseDate: "2025-11-02",
        album: "Lanzamientos Aislados",
        category: "instrumentales",
        featured: true
    },
    {
        title: "Estar Bien",
        description: "Un enfoque optimista con líneas rítmicas claras y una producción vocal brillante y reconfortante.",
        youtube: "https://www.youtube.com/watch?v=g3LMEz9kkCQ",
        spotify: "",
        badge: "Single",
        releaseDate: "2026-02-10",
        album: "Lanzamientos Aislados",
        category: "pop",
        featured: true
    },
    {
        title: "Lluvia de Estrellas",
        description: "Composición espacial enriquecida con sutiles capas de cuerdas y colchones sonoros profundos.",
        youtube: "https://www.youtube.com/watch?v=NDnm6niNg_c",
        spotify: "",
        badge: "Cinemático",
        releaseDate: "2026-01-20",
        album: "Lanzamientos Aislados",
        category: "instrumentales",
        featured: true
    },
    {
        title: "Ciudad Dinámica",
        description: "Fusión urbana contemporánea con estructuras directas y guitarras rítmicas de gran presencia.",
        youtube: "https://www.youtube.com/watch?v=p_GLVYY3dno",
        spotify: "",
        badge: "Comercial",
        releaseDate: "2025-09-14",
        album: "Lanzamientos Aislados",
        category: "pop",
        featured: true
    },
    {
        title: "Gótica",
        description: "Arreglos densos, contrastes oscuros y una carga emocional profunda que define el lado más rock de estudio.",
        youtube: "https://www.youtube.com/watch?v=A_kuniKhTT8",
        spotify: "",
        badge: "Rock Alternativo",
        releaseDate: "2026-04-05",
        album: "Armagedón",
        category: "albumes",
        featured: true
    }
];

/* ==========================================================================
   3. UTILS (High-Reusability Functional Base)
   ========================================================================== */
const UTILS = {
    /**
     * Extrae de forma segura el identificador de 11 caracteres de un vídeo de YouTube.
     * @param {string} url - Dirección web del recurso audiovisual.
     * @returns {string|null} ID procesado o nulo en caso de fallo.
     */
    getYoutubeId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    },

    /**
     * Abstracción funcional para la creación nativa optimizada de nodos del DOM.
     * @param {string} tag - Etiqueta HTML.
     * @param {Object} attributes - Diccionario de propiedades y atributos.
     * @param {...(HTMLElement|string)} children - Nodos hijos o literales.
     * @returns {HTMLElement} Elemento construido.
     */
    createElement(tag, attributes = {}, ...children) {
        const element = document.createElement(tag);
        for (const [key, val] of Object.entries(attributes)) {
            if (key === "className") {
                element.className = val;
            } else if (key.startsWith("data-")) {
                element.setAttribute(key, val);
            } else {
                element[key] = val;
            }
        }
        children.forEach(child => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
        return element;
    },

    /**
     * Limita un valor numérico entre un umbral inferior y uno superior.
     * @param {number} val - Entrada original.
     * @param {number} min - Mínimo absoluto.
     * @param {number} max - Máximo absoluto.
     * @returns {number} Valor balanceado.
     */
    clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    },

    /**
     * Evalúa si el cliente interactúa desde una pantalla móvil según breakpoints configurados.
     * @returns {boolean}
     */
    isMobile() {
        return window.innerWidth <= CONFIG.breakpoints.mobile;
    },

    /**
     * Controla la ejecución de funciones de alta frecuencia (Resize / Mousemove) mediante control temporal.
     * @param {Function} func - Callback operativo.
     * @param {number} wait - Ventana de bloqueo (ms).
     * @returns {Function}
     */
    debounce(func, wait = 20) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    /**
     * Limita la tasa de ejecuciones periódicas de una función continua (Scroll).
     * @param {Function} func - Callback operativo.
     * @param {number} limit - Intervalo mínimo de refresco (ms).
     * @returns {Function}
     */
    throttle(func, limit = 16) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* ==========================================================================
   4. DOM CACHE (Single Reference Storage Framework)
   ========================================================================== */
const DOM = {
    isCached: false,
    init() {
        if (this.isCached) return;
        this.navbar = document.querySelector(CONFIG.selectors.navbar);
        this.featuredContainer = document.querySelector(CONFIG.selectors.featuredContainer);
        this.hero = document.querySelector(CONFIG.selectors.hero);
        this.heroImage = document.querySelector(CONFIG.selectors.heroImage);
        this.heroContent = document.querySelector(CONFIG.selectors.heroContent);
        this.yearSpan = document.querySelector(CONFIG.selectors.yearSpan);
        this.internalLinks = document.querySelectorAll('a[href^="#"]');
        this.body = document.body;
        this.isCached = true;
    }
};

/* ==========================================================================
   5. ENGINE MOTORS (Filtros, Búsqueda, Favoritos, Estadísticas)
   ========================================================================== */
const ENGINE = {
    activeFilter: "all",
    searchQuery: "",

    /**
     * Subsistema de filtrado lógico del catálogo. Próxima expansión de UI.
     * @param {string} category - Categoría destino extraída del modelo.
     * @returns {Array<Object>} Dataset filtrado resultante.
     */
    filterSongs(category) {
        this.activeFilter = category;
        if (category === "all") {
            return featuredSongs.slice(0, CONFIG.ui.maxFeaturedSongs);
        }
        return featuredSongs.filter(song => song.category === category);
    },

    /**
     * Motor de búsqueda indexado por propiedades del modelo.
     * @param {string} query - Cadena de texto a contrastar.
     * @returns {Array<Object>} Canciones coincidentes.
     */
    searchSongs(query) {
        this.searchQuery = query.toLowerCase().trim();
        if (!this.searchQuery) return featuredSongs;
        return featuredSongs.filter(song => 
            song.title.toLowerCase().includes(this.searchQuery) ||
            song.description.toLowerCase().includes(this.searchQuery) ||
            song.album.toLowerCase().includes(this.searchQuery)
        );
    },

    /**
     * Gestión persistente en cliente para el marcado de favoritos de canciones.
     */
    favorites: {
        STORAGE_KEY: "anibalbuild_favs",
        getAll() {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        },
        toggle(songTitle) {
            const favs = this.getAll();
            const index = favs.indexOf(songTitle);
            if (index > -1) favs.splice(index, 1); else favs.push(songTitle);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favs));
            return index === -1; // Retorna true si se añadió
        },
        isFavorite(songTitle) {
            return this.getAll().includes(songTitle);
        }
    },

    /**
     * Motor analítico interno para el cálculo estructurado de metadata del catálogo.
     * @returns {Object} Reporte analítico de producción.
     */
    getStats() {
        const categoriesCount = {};
        let latest = featuredSongs[0];

        featuredSongs.forEach(song => {
            categoriesCount[song.category] = (categoriesCount[song.category] || 0) + 1;
            if (new Date(song.releaseDate) > new Date(latest.releaseDate)) {
                latest = song;
            }
        });

        return {
            totalTracks: featuredSongs.length,
            uniqueAlbums: new Set(featuredSongs.map(s => s.album)).size,
            lastRelease: latest.title,
            distribution: categoriesCount
        };
    }
};

/* ==========================================================================
   6. AUDIO SYSTEM BRIDGE (Future Floating Player Architecture)
   ========================================================================== */
const AUDIO_BRIDGE = {
    playerInstance: null,
    currentTrack: null,
    isPlaying: false,

    /**
     * Inicializa los ganchos y la abstracción del reproductor multimedia nativo.
     */
    init() {
        this.playerInstance = new Audio();
        this.setupAudioListeners();
        console.log("[Audio Architecture Matrix Ready]");
    },

    setupAudioListeners() {
        this.playerInstance.addEventListener("play", () => this.isPlaying = true);
        this.playerInstance.addEventListener("pause", () => this.isPlaying = false);
        this.playerInstance.addEventListener("ended", () => this.onTrackEnded());
    },

    loadTrack(songObject) {
        this.currentTrack = songObject;
        // La URL final se integrará mediante ganchos físicos del backend o CDN
        this.playerInstance.src = `audio/${UTILS.getYoutubeId(songObject.youtube)}.mp3`;
        console.log(`[Track Loaded Architectural Bridge]: ${songObject.title}`);
    },

    play() { if (this.currentTrack) this.playerInstance.play(); },
    pause() { this.playerInstance.pause(); },
    onTrackEnded() { console.log("[Bridge Intercept]: Playing next conceptual track queue."); }
};

/* ==========================================================================
   7. UI CONTROLLER (Visual Generation & Dynamics Ecosystem)
   ========================================================================== */
const UI = {
    mouseCoords: { x: 0, y: 0, targetX: 0, targetY: 0 },
    scrollState: { current: 0, target: 0, isTicking: false },

    /**
     * Construye de manera asíncrona la grilla dinámica de canciones en el DOM.
     * Protege el rendimiento de renderizado por medio de fragmentación de memoria y carga diferida (Lazy).
     */
    renderFeaturedCatalog() {
        if (!DOM.featuredContainer) return;

        // Limpieza atómica previa del nodo contenedor
        DOM.featuredContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();

        const database = ENGINE.filterSongs("all");

        database.forEach((song, index) => {
            const youtubeId = UTILS.getYoutubeId(song.youtube);
            const computedThumb = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "images/default-cover.jpg";
            const computedSpotify = song.spotify.trim() ? song.spotify : CONFIG.social.spotifyProfile;

            // Construcción estructurada de elementos semánticos por JS Puro
            const card = UTILS.createElement("div", { className: "music-card js-reveal-item" });
            card.style.setProperty("--stagger-index", index);

            const imgBox = UTILS.createElement("div", { className: "music-card-img-box" });
            const image = UTILS.createElement("img", {
                src: computedThumb,
                alt: `${song.title} Official Cover`,
                loading: "lazy",
                decoding: "async"
            });
            
            const badge = UTILS.createElement("span", { className: "music-card-badge" }, song.badge);
            const overlay = UTILS.createElement("div", { className: "music-card-overlay" });
            const playIcon = UTILS.createElement("i", { className: "fas fa-play" });
            const overlayLink = UTILS.createElement("a", {
                href: song.youtube,
                target: "_blank",
                className: "overlay-play-btn",
                ariaLabel: `Escuchar ${song.title} en YouTube`
            }, playIcon);

            overlay.appendChild(overlayLink);
            imgBox.appendChild(image);
            imgBox.appendChild(badge);
            imgBox.appendChild(overlay);

            const body = UTILS.createElement("div", { className: "music-card-body" });
            const title = UTILS.createElement("h3", {}, song.title);
            const desc = UTILS.createElement("p", {}, song.description);
            
            const actions = UTILS.createElement("div", { className: "music-card-actions" });
            const spotBtn = UTILS.createElement("a", {
                href: computedSpotify,
                target: "_blank",
                className: "btn-card btn-spotify js-ripple-target"
            }, UTILS.createElement("i", { className: "fab fa-spotify" }), " Spotify");

            const ytBtn = UTILS.createElement("a", {
                href: song.youtube,
                target: "_blank",
                className: "btn-card btn-youtube js-ripple-target"
            }, UTILS.createElement("i", { className: "fab fa-youtube" }), " YouTube");

            actions.appendChild(spotBtn);
            actions.appendChild(ytBtn);
            body.appendChild(title);
            body.appendChild(desc);
            body.appendChild(actions);

            card.appendChild(imgBox);
            card.appendChild(body);

            fragment.appendChild(card);
        });

        DOM.featuredContainer.appendChild(fragment);
    },

    /**
     * Efecto ondulatorio de impacto (Ripple Effect) táctil y accesible.
     * @param {MouseEvent} e - Instancia del evento de click del cliente.
     * @param {HTMLElement} target - Elemento sobre el que se despliega la física.
     */
    createRipple(e, target) {
        const circle = document.createElement("span");
        const diameter = Math.max(target.clientWidth, target.clientHeight);
        const radius = diameter / 2;

        const rect = target.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.className = "ripple-span";

        const existingRipple = target.querySelector(".ripple-span");
        if (existingRipple) existingRipple.remove();

        target.appendChild(circle);

        setTimeout(() => circle.remove(), CONFIG.ui.rippleDuration);
    },

    /**
     * Orquestador cinemático del fondo Hero por scroll de coordenadas (Parallax).
     * Sincronizado por tasa de refresco a nivel de GPU a través de requestAnimationFrame.
     */
    animateParallaxLoop() {
        if (!DOM.heroImage) {
            UI.scrollState.isTicking = false;
            return;
        }

        // Interpolación lineal suave (LERP) para suavizar parpadeos de refresco
        UI.scrollState.current += (UI.scrollState.target - UI.scrollState.current) * CONFIG.ui.parallaxSpeed;
        
        DOM.heroImage.style.transform = `translate3d(0, ${UI.scrollState.current * 0.4}px, 0) scale(1.05)`;
        
        if (DOM.heroContent) {
            DOM.heroContent.style.transform = `translate3d(0, ${UI.scrollState.current * -0.15}px, 0)`;
            DOM.heroContent.style.opacity = `${UTILS.clamp(1 - (UI.scrollState.current / 400), 0, 1)}`;
        }

        if (Math.abs(UI.scrollState.target - UI.scrollState.current) > 0.1) {
            requestAnimationFrame(UI.animateParallaxLoop);
        } else {
            UI.scrollState.isTicking = false;
        }
    },

    /**
     * Bucle de interpolación matemática continua para el seguimiento elegante de luminancias.
     */
    animateMouseGlowLoop() {
        UI.mouseCoords.x += (UI.mouseCoords.targetX - UI.mouseCoords.x) * CONFIG.ui.mouseGlowLerp;
        UI.mouseCoords.y += (UI.mouseCoords.targetY - UI.mouseCoords.y) * CONFIG.ui.mouseGlowLerp;

        const ambientLights = document.querySelectorAll(".ambient-glow-source");
        ambientLights.forEach(light => {
            light.style.transform = `translate3d(${UI.mouseCoords.x}px, ${UI.mouseCoords.y}px, 0)`;
        });

        requestAnimationFrame(UI.animateMouseGlowLoop);
    },

    /**
     * Transición y reconfiguración de estados visuales para la barra de navegación superior.
     * @param {number} scrollY -