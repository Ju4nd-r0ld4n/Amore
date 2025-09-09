

// ==========================================
// CONFIGURACIÓN - EDITA AQUÍ LOS AJUSTES
// ==========================================
const VELOCIDAD_SCROLL = 800; // Velocidad del scroll suave (ms)
const OFFSET_HEADER = 80; // Altura del header fijo

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const header = document.getElementById('header');
const menuHamburguesa = document.getElementById('menuHamburguesa');
const menuNavegacion = document.getElementById('menuNavegacion');
const botonArriba = document.getElementById('botonArriba');
const indicadorScroll = document.getElementById('indicadorScroll');
const enlacesNavegacion = document.querySelectorAll('.enlace-navegacion');

// Variables del reproductor de música
let audioPlayer = document.getElementById('audioPlayer');
const btnPlayPause = document.getElementById('btnPlayPause');
const btnNext = document.getElementById('btnNext');
const btnPrev = document.getElementById('btnPrev');
const btnShuffle = document.getElementById('btnShuffle');
const barraProgreso = document.getElementById('barraProgreso');
const tiempoActual = document.getElementById('tiempoActual');
const tiempoTotal = document.getElementById('tiempoTotal');
const volumenControl = document.getElementById('volumen');
const tituloCancion = document.querySelector('.titulo-cancion');
const artistaCancion = document.querySelector('.artista-cancion');
const imagenCancion = document.querySelector('.imagen-cancion');

let cancionActiva = 0;
let estaReproduciendo = false;
let esAleatorio = false;

// ==========================================
// LISTA DE MÚSICA
// EDITA AQUÍ LAS CANCIONES, IMAGENES Y ARTISTAS
// ASEGÚRATE QUE LAS RUTAS DE LOS ARCHIVOS SEAN CORRECTAS
// ==========================================
const listaMusica = [
    {
        titulo: "Perfect",
        artista: "Ed Sheeran",
        rutaMusica: "musica/perfect.mp3",
        rutaImagen: "imagenes/perfect.jpg"
    },
    {
        titulo: "Photograph",
        artista: "Ed Sheeran",
        rutaMusica: "musica/photograph.mp3",
        rutaImagen: "imagenes/photograph.jpg"
    },
    {
        titulo: "Thinking Out Loud",
        artista: "Ed Sheeran",
        rutaMusica: "musica/thinking_out_loud.mp3",
        rutaImagen: "imagenes/thinking_out_loud.jpg"
    }
];

// ==========================================
// FUNCIONES DE NAVEGACIÓN
// ==========================================

// Función para scroll suave - EDITA la velocidad arriba
function scrollSuave(targetId, duracion = VELOCIDAD_SCROLL) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const targetPosition = targetElement.offsetTop - OFFSET_HEADER;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duracion);
        window.scrollTo(0, run);
        if (timeElapsed < duracion) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Evento para los enlaces de navegación
enlacesNavegacion.forEach(enlace => {
    enlace.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        scrollSuave(targetId);
        // Ocultar el menú en móviles
        if (menuNavegacion.classList.contains('activo')) {
            menuHamburguesa.classList.remove('activo');
            menuNavegacion.classList.remove('activo');
        }
    });
});

// Evento para el menú hamburguesa
menuHamburguesa.addEventListener('click', () => {
    menuHamburguesa.classList.toggle('activo');
    menuNavegacion.classList.toggle('activo');
});

// Evento para el scroll y el header
window.addEventListener('scroll', () => {
    // Cambiar header
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Mostrar/ocultar botón de scroll hacia arriba
    if (window.scrollY > 300) {
        botonArriba.classList.add('mostrar');
    } else {
        botonArriba.classList.remove('mostrar');
    }

    // Actualizar indicador de scroll
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = (window.scrollY / alturaTotal) * 100;
    indicadorScroll.style.width = `${progreso}%`;
});

// Evento para el botón de scroll hacia arriba
botonArriba.addEventListener('click', scrollToTop);


// ==========================================
// FUNCIONES DEL REPRODUCTOR DE MÚSICA
// ==========================================

// Función para cargar una canción
function cargarCancion(indexCancion) {
    const cancion = listaMusica[indexCancion];
    audioPlayer.src = cancion.rutaMusica;
    tituloCancion.textContent = cancion.titulo;
    artistaCancion.textContent = cancion.artista;
    imagenCancion.innerHTML = `<img src="${cancion.rutaImagen}" alt="Portada de ${cancion.titulo}">`;
    audioPlayer.load();
    actualizarTiempos();
}

// Función para actualizar los tiempos
function actualizarTiempos() {
    audioPlayer.addEventListener('loadedmetadata', () => {
        const minutos = Math.floor(audioPlayer.duration / 60);
        const segundos = Math.floor(audioPlayer.duration % 60);
        tiempoTotal.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    });
}

// Función para alternar entre reproducir y pausar
function alternarPlayPause() {
    if (estaReproduciendo) {
        audioPlayer.pause();
        btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audioPlayer.play();
        btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
    }
    estaReproduciendo = !estaReproduciendo;
}

// Evento para el botón de Play/Pause
btnPlayPause.addEventListener('click', alternarPlayPause);

// Evento para la barra de progreso
audioPlayer.addEventListener('timeupdate', () => {
    const progreso = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    barraProgreso.style.width = `${progreso}%`;
    const minutos = Math.floor(audioPlayer.currentTime / 60);
    const segundos = Math.floor(audioPlayer.currentTime % 60);
    tiempoActual.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
});

// Evento para arrastrar la barra de progreso
barraProgreso.parentElement.addEventListener('click', (e) => {
    const anchoBarra = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    audioPlayer.currentTime = (clickX / anchoBarra) * audioPlayer.duration;
});

// Evento para el botón de Siguiente
btnNext.addEventListener('click', () => {
    cancionActiva++;
    if (cancionActiva >= listaMusica.length) {
        cancionActiva = 0;
    }
    cargarCancion(cancionActiva);
    if (estaReproduciendo) {
        audioPlayer.play();
    }
});

// Evento para el botón de Anterior
btnPrev.addEventListener('click', () => {
    cancionActiva--;
    if (cancionActiva < 0) {
        cancionActiva = listaMusica.length - 1;
    }
    cargarCancion(cancionActiva);
    if (estaReproduciendo) {
        audioPlayer.play();
    }
});

// Evento para el botón de Aleatorio
btnShuffle.addEventListener('click', () => {
    esAleatorio = !esAleatorio;
    btnShuffle.style.color = esAleatorio ? 'var(--color-secundario)' : 'var(--color-principal)';
});

// Evento cuando la canción termina
audioPlayer.addEventListener('ended', () => {
    if (esAleatorio) {
        let nuevoIndice = cancionActiva;
        while(nuevoIndice === cancionActiva) {
            nuevoIndice = Math.floor(Math.random() * listaMusica.length);
        }
        cancionActiva = nuevoIndice;
    } else {
        cancionActiva++;
        if (cancionActiva >= listaMusica.length) {
            cancionActiva = 0;
        }
    }
    cargarCancion(cancionActiva);
    audioPlayer.play();
});

// Evento para el control de volumen
volumenControl.addEventListener('input', () => {
    audioPlayer.volume = volumenControl.value;
});

// Cargar la primera canción al iniciar
window.addEventListener('load', () => {
    cargarCancion(cancionActiva);
});
// ==========================================
// CONTADOR DE DÍAS - AGREGAR ESTE BLOQUE
// ==========================================

// Función para calcular días transcurridos
function calcularDiasJuntos() {
    const fechaInicio = new Date('2023-09-19'); // Tu fecha de aniversario
    const fechaActual = new Date();
    const diferencia = fechaActual - fechaInicio;
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const diasTranscurridos = Math.floor(diferencia / milisegundosPorDia);
    return diasTranscurridos;
}

// Función para actualizar el contador en el HTML
function actualizarContadorDias() {
    const contadorElement = document.getElementById('contador-dias');
    const dias = calcularDiasJuntos();
    contadorElement.textContent = dias;
}

// Inicializar el contador cuando cargue la página
window.addEventListener('load', () => {
    actualizarContadorDias();
    setInterval(actualizarContadorDias, 3600000);
});
