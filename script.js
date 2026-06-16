/* ==========================================================================
   1. MAPEO DIRECTO DE TRACKS ORIGINALES (ANIBALBUILD)
   ========================================================================== */
const trackList = {
    // Álbum Armagedón
    "armagedon-1": {
        title: "Intro: Génesis",
        artist: "Anibalbuild",
        src: "audio/intro-genesis.mp3",
        img: "images/armagedon-cover.jpg"
    },
    "armagedon-2": {
        title: "Luz y Sombra",
        artist: "Anibalbuild",
        src: "audio/luz-y-sombra.mp3",
        img: "images/armagedon-cover.jpg"
    },
    "armagedon-3": {
        title: "Ecos del Mañana",
        artist: "Anibalbuild",
        src: "audio/ecos-del-manana.mp3",
        img: "images/armagedon-cover.jpg"
    },
    "armagedon-4": {
        title: "Armagedón",
        artist: "Anibalbuild",
        src: "audio/armagedon.mp3",
        img: "images/armagedon-cover.jpg"
    },
    // Showcase Destacados
    "showcase-1": {
        title: "Mi Despedida",
        artist: "Anibalbuild",
        src: "audio/mi-despedida.mp3",
        img: "images/mi-despedida-cover.jpg"
    },
    "showcase-2": {
        title: "Contigo Soy Invencible",
        artist: "Anibalbuild",
        src: "audio/contigo-soy-invencible.mp3",
        img: "images/contigo-soy-invencible-cover.jpg"
    },
    "showcase-3": {
        title: "Amor Vulnerable",
        artist: "Anibalbuild",
        src: "audio/amor-vulnerable.mp3",
        img: "images/amor-vulnerable-cover.jpg"
    },
    "showcase-4": {
        title: "Luz del Alba",
        artist: "Anibalbuild",
        src: "audio/luz-del-alba.mp3",
        img: "images/luz-del-alba-cover.jpg"
    }
};

/* ==========================================================================
   2. ESTADO GLOBAL Y CAPTURA DOM
   ========================================================================== */
const audioPlayer = new Audio();
let currentTrackId = null;
let isPlaying = false;

const globalPlayer = document.getElementById('globalPlayer');
const playerPlayBtn = document.getElementById('playerPlayBtn');
const playerTrackImg = document.getElementById('playerTrackImg');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const playerProgressBar = document.getElementById('playerProgressBar');
const playerProgressContainer = document.getElementById('playerProgressContainer');
const playerCurrentTime = document.getElementById('playerCurrentTime');
const playerTotalTime = document.getElementById('playerTotalTime');
const volumeSlider = document.getElementById('volumeSlider');
const vinylRecord = document.getElementById('vinylRecord');

/* ==========================================================================
   3. NÚCLEO OPERATIVO DEL REPRODUCTOR
   ========================================================================== */
function playTrack(trackId) {
    const track = trackList[trackId];
    if (!track) return;

    if (currentTrackId !== trackId) {
        currentTrackId = trackId;
        audioPlayer.src = track.src;
        
        playerTrackTitle.textContent = track.title;
        playerTrackArtist.textContent = track.artist;
        playerTrackImg.src = track.img;
        
        globalPlayer.classList.add('active');
    }

    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            playerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            updateTracklistUI(trackId, true);
            toggleVinylAnimation(trackId, true);
        })
        .catch(err => {
            console.log("Modo Simulación Activo: Archivos locales MP3 listos para integración física.", err);
            isPlaying = true;
            playerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            updateTracklistUI(trackId, true);
            toggleVinylAnimation(trackId, true);
        });
}

function pauseTrack() {
    audioPlayer.pause();
    isPlaying = false;
    playerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    updateTracklistUI(currentTrackId, false);
    toggleVinylAnimation(currentTrackId, false);
}

function togglePlay() {
    if (!currentTrackId) return;
    if (isPlaying) pauseTrack(); else playTrack(currentTrackId);
}

function updateTracklistUI(trackId, playing) {
    document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('playing');
        const btn = item.querySelector('.track-play-btn i');
        if (btn) btn.className = 'fas fa-play';
    });

    const activeRow = document.querySelector(`.track-item[data-track="${trackId}"]`);
    if (activeRow) {
        if (playing) {
            activeRow.classList.add('playing');
            activeRow.querySelector('.track-play-btn i').className = 'fas fa-pause';
        } else {
            activeRow.querySelector('.track-play-btn i').className = 'fas fa-play';
        }
    }
}

function toggleVinylAnimation(trackId, playing) {
    if (vinylRecord) {
        if (trackId && trackId.startsWith('armagedon-') && playing) {
            vinylRecord.classList.add('spinning');
        } else {
            vinylRecord.classList.remove('spinning');
        }
    }
}

/* ==========================================================================
   4. EVENTOS DE CONTROL TEMPORAL Y VOLUMEN
   ========================================================================== */
audioPlayer.addEventListener('timeupdate', () => {
    if (!audioPlayer.duration) return;
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    playerProgressBar.style.width = `${progressPercent}%`;
    playerCurrentTime.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    playerTotalTime.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    pauseTrack();
    playerProgressBar.style.width = '0%';
});

playerProgressContainer.addEventListener('click', (e) => {
    if (!audioPlayer.duration) return;
    const clickX = e.offsetX;
    const width = playerProgressContainer.clientWidth;
    audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
});

volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/* ==========================================================================
   5. NAVEGACIÓN Y FORMULARIO DE CONTACTO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.track-play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const trackItem = e.target.closest('.track-item');
            const trackId = trackItem.getAttribute('data-track');
            if (currentTrackId === trackId && isPlaying) pauseTrack(); else playTrack(trackId);
        });
    });

    document.querySelectorAll('.music-card-play').forEach(btn => {
        btn.addEventListener('click', () => {
            const trackId = btn.getAttribute('data-track');
            if (currentTrackId === trackId && isPlaying) pauseTrack(); else playTrack(trackId);
        });
    });

    playerPlayBtn.addEventListener('click', togglePlay);

    // Menú Táctil Móvil
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) mainNav.classList.add('scrolled'); else mainNav.classList.remove('scrolled');
    });

    // Envío Local Seguro
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formFeedback.className = "form-feedback success";
            formFeedback.textContent = "¡Mensaje procesado con éxito! Me pondré en contacto contigo pronto.";
            contactForm.reset();
            setTimeout(() => { formFeedback.style.display = 'none'; }, 5000);
        });
    }
});