import { loadData, loadAndProcessData, normalizeText } from '../common/utils.js';
import { loadTheme, checkExpirationDate } from '../common/config.js';

// Variables específicas de la página
const mvst = new MoverEstructuras("0a1Ab@Bc#C2d$De%EfF^gG&hH3iI(Jj4)k-KlLm5Mn+NoOpPq6Q]rRSs}t|TuU;V7v:w8WxX9'y,Y=Zz<>?/`~ !_*[{");
let titles = [];
let musics = [];
let musicDances = [];
let currentPage = 1;
const limit = 30;
let sortOrder = 'asc';
let filteredMusicDances = [];
let dataRandom = [];
let playedMusic = [];

// Funciones específicas de la página
function processTitles(data) {
    titles = [...titles, ...data];
}

function processMusics(data) {
    musics = [...musics, ...data];
}

function shortLine(line) {
    return line.replace("Afectividad", "AF")
              .replace("Sexualidad", "SX")
              .replace("Vitalidad", "VT")
              .replace("Trascendencia", "TR")
              .replace("Creatividad", "CR");
}

function playSelectedMusic(id, musicId) {
    const music = musics.find(m => m._id === musicId);
    loadAndPlayMusic(id, mvst.des(music.code, music.mp3), mvst.des(music.code, music.ogg), music.code, music.title, music.author);
}

function showDanceDetails(id) {
    const dance = titles.find(title => title._id === id);
    const modalBody = document.getElementById('danceModalBody');

    modalBody.innerHTML = `
        <p><strong>Danza:</strong> ${dance.title}</p>
        <p><strong>Descripción:</strong> ${mvst.des(id, dance.description)}</p>
    `;
    $('#danceModal').modal('show');
}

function showMusicDetails(id) {
    const music = musics.find(music => music._id === id);
    const modalBody = document.getElementById('musicModalBody');

    modalBody.innerHTML = `
        <p><strong>Music:</strong> ${music.title} - ${music.author}</p>
        <p><strong>Descripción:</strong> ${mvst.des(music.code, music.description)}</p>
    `;
    $('#musicModal').modal('show');
}

function changeChecked(danceId, musicId, isChecked) {
    const item = musicDances.find(i => i.d.id === danceId && i.m.id === musicId);
    if (item) {
        item.checked = isChecked;
        renderTable(document.getElementById('searchInput').value);
        renderPagination();
    }
}

function copyToClipboard() {
    const headers = "ID Musica\tCodigo\tTitulo\tAutor\tLinea\tID Danza\tTitulo Danza";
    const textToCopy = filteredMusicDances.map(item => 
        `${item.m.id}\t${item.m.code}\t${item.m.title}\t${item.m.author}\t${item.m.line}\t${item.d.id}\t${item.d.title}`
    ).join('\n');

    navigator.clipboard.writeText(`${headers}\n${textToCopy}`).then(() => {
        alert('Las danzas y músicas seleccionadas han sido copiadas al portapapeles.');
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

function eliminarMusicasDuplicadas(musicList) {
    const uniqueMusic = [];
    const seenMusic = new Set();

    for (const music of musicList) {
        if (!seenMusic.has(music.m.title + music.m.author)) {
            uniqueMusic.push(music);
            seenMusic.add(music.m.title + music.m.author);
        }
    }

    return uniqueMusic;
}

function playRandomMusic() {
    if (playedMusic.length === dataRandom.length) {
        alert('Todas las canciones han sido reproducidas.');
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * dataRandom.length);
    } while (playedMusic.includes(randomIndex));

    playedMusic.push(randomIndex);
    document.getElementById('random-monitor').textContent = `${playedMusic.length} / ${dataRandom.length}`;

    const item = dataRandom[randomIndex];
    loadAndPlayMusic('audio-music', mvst.des(item.m.code, item.m.mp3), mvst.des(item.m.code, item.m.ogg), item.m.code, item.m.title, item.m.author);
    
    setTimeout(() => {
        document.getElementById('audio-music').onended = playRandomMusic;
    }, 2000);
}

function getPage(searchedValue, limit, page) {
    const searchTerms = searchedValue.split(" ");
    const regTerms = searchTerms.map(term => 
        new RegExp(term.replace(/[aá]/gi, '[aá]')
                      .replace(/[eé]/gi, '[eé]')
                      .replace(/[ií]/gi, '[ií]')
                      .replace(/[oó]/gi, '[oó]')
                      .replace(/[uúü]/gi, '[uúü]'), 'gi')
    );
    
    const fullfield = (item) => `${item.m.code} ${item.m.title} ${item.m.author} ${item.m.line} ${item.d.title}`;
    const isCheckedFilter = document.getElementById('filterChecked').checked;

    const filteredData = musicDances.filter(item => 
        (!isCheckedFilter || item.checked) && 
        regTerms.every(term => fullfield(item).toLowerCase().match(term))
    );

    const startIndex = limit * (page - 1);

    if (isCheckedFilter) {
        filteredMusicDances = filteredData.map(item => ({
            m: { id: item.m.id, code: item.m.code, title: item.m.title, author: item.m.author, line: item.m.line },
            d: { id: item.d.dance, title: item.d.title }
        }));
        document.getElementById('clickboard').classList.remove('invisible');
    } else {
        filteredMusicDances = [];
        document.getElementById('clickboard').classList.add('invisible');
    }

    dataRandom = eliminarMusicasDuplicadas(filteredData);
    playedMusic = [];
    document.getElementById('random-monitor').textContent = `${playedMusic.length} / ${dataRandom.length}`;

    return filteredData.slice(startIndex, startIndex + limit);
}

function renderTable(searchedValue = '') {
    const dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = '';

    const paginatedData = getPage(searchedValue, limit, currentPage);
    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button class="btn btn-success btn-sm" onclick="playSelectedMusic('audio-music','${item.m.id}')">
                <i class="bi bi-music-note-beamed"></i>
            </button></td>
            <td nowrap${item.m.wd !== '' ? ` class="text-primary danzo" onclick="showMusicDetails('${item.m.wd}')"` : ''}>${item.m.code}</td>
            <td>${item.m.title}</td>
            <td>${item.m.author}</td>
            <td class="text-primary danzo" onclick="showDanceDetails('${item.d.id}')">${item.d.title}</td>
            <td nowrap>${shortLine(item.m.line)}</td>
            <td class="text-right"><input type="checkbox" class="form-check-input" 
                onclick="changeChecked('${item.d.id}','${item.m.id}',this.checked)" ${item.checked ? 'checked' : ''}></td>
        `;
        dataTable.appendChild(row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(musicDances.length / limit);
    const maxButtons = 5;

    // Botón primera página
    if (currentPage > 1) {
        pagination.innerHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="changePage(1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-backward" viewBox="0 0 16 16">
                    <path d="M.5 3.5A.5.5 0 0 1 1 4v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v2.94l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L8.5 8.752v2.94c0 .653-.713.998-1.233.696L1 8.752V12a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m7 1.133L1.696 8 7.5 11.367zm7.5 0L9.196 8 15 11.367z"/>
                </svg>
            </a>
        </li>`;
    }

    // Botón anterior
    if (currentPage > 1) {
        pagination.innerHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-start" viewBox="0 0 16 16">
                    <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.52-.302 1.233.043 1.233.696v7.384c0 .653-.713.998-1.233.696L5 8.752V12a.5.5 0 0 1-1 0zm7.5.633L5.696 8l5.804 3.367z"/>
                </svg>
            </a>
        </li>`;
    }

    // Botones numerados
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pagination.innerHTML += `<li class="page-item ${currentPage === i ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        </li>`;
    }

    // Botón siguiente
    if (currentPage < totalPages) {
        pagination.innerHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-end" viewBox="0 0 16 16">
                    <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.713 3.31 4 3.655 4 4.308v7.384c0 .653.713.998 1.233.696L11.5 8.752V12a.5.5 0 0 0 1 0zM5 4.633 10.804 8 5 11.367z"/>
                </svg>
            </a>
        </li>`;
    }

    // Botón última página
    if (currentPage < totalPages) {
        pagination.innerHTML += `<li class="page-item">
            <a class="page-link" href="#" onclick="changePage(${totalPages})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-forward" viewBox="0 0 16 16">
                    <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.752l-6.267 3.636c-.52.302-1.233-.043-1.233-.696v-2.94l-6.267 3.636C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696L7.5 7.248v-2.94c0-.653.713-.998 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5M1 4.633v6.734L6.804 8zm7.5 0v6.734L14.304 8z"/>
                </svg>
            </a>
        </li>`;
    }
}

function changePage(page) {
    currentPage = page;
    renderTable(document.getElementById('searchInput').value);
    renderPagination();
}

function sortTable(field) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const [obj, prop] = field.split('.');

    musicDances.sort((a, b) => {
        const compareResult = a[obj][prop].localeCompare(b[obj][prop]);
        return sortOrder === 'asc' ? compareResult : -compareResult;
    });

    renderTable(document.getElementById('searchInput').value);
    renderPagination();
}

// Inicialización
document.addEventListener('DOMContentLoaded', async function() {
    loadTheme();
    checkExpirationDate();

    // Cargar datos
    await loadAndProcessData('https://ilovebiodanza.github.io/catalogo/data/', 'Title', processTitles);
    await loadAndProcessData('https://ilovebiodanza.github.io/catalogo/data/', 'Music', processMusics);

    // Procesar datos
    titles.forEach((t) => {
        t.musics.forEach((m) => {
            const music = musics.find(music => music._id === m.id);
            if (music) {
                musicDances.push({
                    m: {
                        id: music._id,
                        code: music.code,
                        title: music.title,
                        author: music.author,
                        line: music.line,
                        mp3: music.mp3,
                        ogg: music.ogg,
                        wd: (music.description.length > 20) ? music._id : ''
                    },
                    d: { id: t._id, title: t.title, dance: t.musics[0].d },
                    checked: false
                });
            }
        });
    });

    // Ordenar datos
    musicDances.sort((a, b) => {
        const aKey = a.m.title + a.m.author + (a.m.wd === '' ? "1" : "0");
        const bKey = b.m.title + b.m.author + (b.m.wd === '' ? "1" : "0");
        return aKey.localeCompare(bKey);
    });

    // Asignar wd a los que no tienen descripción
    for (let i = 1; i < musicDances.length; i++) {
        if (musicDances[i - 1].m.title + musicDances[i - 1].m.author === 
            musicDances[i].m.title + musicDances[i].m.author) {
            musicDances[i].m.wd = musicDances[i - 1].m.wd;
        }
    }

    // Ordenar por danza, música y reseña
    musicDances.sort((a, b) => {
        const aKey = a.d.id + a.m.code + (a.m.wd === '' ? "1" : "0");
        const bKey = b.d.id + b.m.code + (b.m.wd === '' ? "1" : "0");
        return aKey.localeCompare(bKey);
    });

    // Eliminar duplicados
    musicDances = musicDances.filter((item, index, self) =>
        index === 0 || (item.m.code + item.d._id) !== (self[index - 1].m.code + self[index - 1].d._id)
    );

    // Ordenar por título de danza, música y autor
    musicDances.sort((a, b) => {
        const aKey = a.d.title + a.m.title + a.m.author;
        const bKey = b.d.title + b.m.title + b.m.author;
        return aKey.localeCompare(bKey);
    });

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', (event) => {
        currentPage = 1;
        renderTable(event.target.value);
        renderPagination();
    });

    document.getElementById('filterChecked').addEventListener('change', function() {
        document.getElementById('searchInput').value = '';
        currentPage = 1;
        renderTable();
        renderPagination();
    });

    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    document.getElementById('randomButton').addEventListener('click', playRandomMusic);

    // Delegación de eventos para ordenar tablas
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => sortTable(th.dataset.sort));
    });

    // Renderizar vista inicial
    renderTable();
    renderPagination();
});

// Hacer funciones accesibles globalmente para los eventos en línea
window.playSelectedMusic = playSelectedMusic;
window.showDanceDetails = showDanceDetails;
window.showMusicDetails = showMusicDetails;
window.changeChecked = changeChecked;
window.changePage = changePage;
