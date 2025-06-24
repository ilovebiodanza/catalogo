/**
 * Módulo para manejar la reproducción de audio en la aplicación Biodanza
 */

// Variables globales del módulo
let currentAudioElement = null;
let currentMusicInfo = {
    code: '',
    title: '',
    author: ''
};

/**
 * Carga y reproduce una música
 * @param {string} audioElementId - ID del elemento audio HTML
 * @param {string} mp3Url - URL del archivo MP3
 * @param {string} oggUrl - URL del archivo OGG
 * @param {string} code - Código de la música
 * @param {string} title - Título de la música
 * @param {string} author - Autor de la música
 */
function loadAndPlayMusic(audioElementId, mp3Url, oggUrl, code, title, author) {
    // Detener la reproducción actual si hay alguna
    if (currentAudioElement && !currentAudioElement.paused) {
        currentAudioElement.pause();
    }

    // Obtener el elemento de audio
    const audioElement = document.getElementById(audioElementId);
    if (!audioElement) {
        console.error('Elemento de audio no encontrado');
        return;
    }

    // Actualizar las fuentes de audio
    const sourceElements = audioElement.getElementsByTagName('source');
    
    // MP3 source
    if (sourceElements.length > 0) {
        sourceElements[0].src = mp3Url;
        sourceElements[0].type = 'audio/mpeg';
    } else {
        const mp3Source = document.createElement('source');
        mp3Source.src = mp3Url;
        mp3Source.type = 'audio/mpeg';
        audioElement.appendChild(mp3Source);
    }

    // OGG source
    if (sourceElements.length > 1) {
        sourceElements[1].src = oggUrl;
        sourceElements[1].type = 'audio/ogg';
    } else {
        const oggSource = document.createElement('source');
        oggSource.src = oggUrl;
        oggSource.type = 'audio/ogg';
        audioElement.appendChild(oggSource);
    }

    // Guardar referencia al elemento de audio actual
    currentAudioElement = audioElement;
    currentMusicInfo = { code, title, author };

    // Mostrar el elemento de audio (por si estaba oculto)
    audioElement.style.display = 'block';

    // Cargar y reproducir
    audioElement.load();
    audioElement.play()
        .then(() => {
            console.log(`Reproduciendo: ${code} - ${title} - ${author}`);
            updateMusicAnalyst(audioElement);
        })
        .catch(error => {
            console.error('Error al reproducir:', error);
            // Intento alternativo para algunos navegadores móviles
            setTimeout(() => audioElement.play(), 300);
        });
}

/**
 * Actualiza el analizador de música del elemento personalizado
 * @param {HTMLAudioElement} audioElement - Elemento de audio
 */
function updateMusicAnalyst(audioElement) {
    if (audioElement && typeof audioElement.updateAnalyst === 'function') {
        audioElement.updateAnalyst();
    }
}

/**
 * Obtiene la información de la música actualmente en reproducción
 * @returns {Object} Información de la música actual
 */
function getCurrentMusicInfo() {
    return currentMusicInfo;
}

/**
 * Pausa la reproducción actual
 */
function pauseCurrentMusic() {
    if (currentAudioElement) {
        currentAudioElement.pause();
    }
}

/**
 * Reanuda la reproducción actual
 */
function resumeCurrentMusic() {
    if (currentAudioElement && currentAudioElement.paused) {
        currentAudioElement.play()
            .then(() => updateMusicAnalyst(currentAudioElement))
            .catch(error => console.error('Error al reanudar:', error));
    }
}

/**
 * Detiene completamente la reproducción actual
 */
function stopCurrentMusic() {
    if (currentAudioElement) {
        currentAudioElement.pause();
        currentAudioElement.currentTime = 0;
    }
}

/**
 * Controla el volumen del reproductor
 * @param {number} volume - Nivel de volumen (0 a 1)
 */
function setVolume(volume) {
    if (currentAudioElement) {
        currentAudioElement.volume = Math.min(1, Math.max(0, volume));
    }
}

/**
 * Obtiene el estado actual de reproducción
 * @returns {Object} Estado del reproductor
 */
function getPlayerStatus() {
    if (!currentAudioElement) {
        return {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            ...currentMusicInfo
        };
    }

    return {
        isPlaying: !currentAudioElement.paused,
        currentTime: currentAudioElement.currentTime,
        duration: currentAudioElement.duration || 0,
        volume: currentAudioElement.volume,
        ...currentMusicInfo
    };
}

// Exportar funciones públicas
export {
    loadAndPlayMusic,
    getCurrentMusicInfo,
    pauseCurrentMusic,
    resumeCurrentMusic,
    stopCurrentMusic,
    setVolume,
    getPlayerStatus
};
