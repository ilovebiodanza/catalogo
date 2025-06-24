import { normalizeText, searchAndHighlightText, loadData, loadAndProcessData } from '../common/utils.js';
import { loadTheme, checkExpirationDate } from '../common/config.js';

// Variables específicas del catálogo
let currentIndex = 0;
let filteredRows = [];
let isHighlighted = false;
const minChars = 1;
const mvst = new MoverEstructuras("0a1Ab@Bc#C2d$De%EfF^gG&hH3iI(Jj4)k-KlLm5Mn+NoOpPq6Q]rRSs}t|TuU;V7v:w8WxX9'y,Y=Zz<>?/`~ !_*[{");

let titles = [];
let musics = [];

// Funciones específicas del catálogo
function processTitles(data) {
    titles = [...titles, ...data];
}

function processMusics(data) {
    musics = [...musics, ...data];
}

function updateCounter() {
    const total = filteredRows.length;
    $("#contador").html(`Danza: <strong>${currentIndex + 1} / ${total}</strong>`);
}

function updateButtons() {
    const total = filteredRows.length;
    $("#anterior").prop('disabled', currentIndex === 0);
    $("#siguiente").prop('disabled', currentIndex >= total - 1);
}

function scrollToCurrent() {
    const row = filteredRows[currentIndex];
    $('html, body').animate({
        scrollTop: row.offset().top
    }, 500);
    updateCounter();
    updateButtons();
}

function updateCounterManually() {
    const total = filteredRows.length;
    if (total > 0) {
        const newValue = prompt("Introduce un nuevo valor entre 1 y " + total + ":");
        const numericValue = parseInt(newValue);

        if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= total) {
            currentIndex = numericValue - 1;
            scrollToCurrent();
        } else {
            alert("Valor inválido. Debe estar entre 1 y " + total + ".");
        }
    }
}

function showDance(index) {
    const descriptionElement = $(`#description-${index}`);
    const musicsElement = $(`#musics-${index}`);
    
    if (descriptionElement.hasClass('d-none')) {
        descriptionElement.removeClass('d-none');    
        descriptionElement.html(mvst.des(titles[index]._id, titles[index].description));
        musicsElement.parent().removeClass('d-none');
        musicsElement.html(titles[index].musics.map(({ _id, code, title, author, line, propusedBy }) => {
            const propused = propusedBy.split('|')[0];
            const shortTitle = propusedBy.split('|').pop();
            return `<a href="javascript:playSelectedMusic('audio-music','${_id}')" class="list-group-item list-group-item-action"><strong>${code}</strong> <span class="text-primary">${title}</span> <span class="text-danger">${author}</span> <i>${line}</i> <sub><small class="small lang" title="${propused}">(${shortTitle})</small></sub></a>`;
        }).join(''));
    } else {
        descriptionElement.addClass('d-none');
        descriptionElement.html('');
        musicsElement.parent().addClass('d-none');
        musicsElement.html('');
    }
}

function playSelectedMusic(id, musicId) {
    const music = musics.find(m => m._id === musicId);
    loadAndPlayMusic(id, mvst.des(music.code, music.mp3), mvst.des(music.code, music.ogg), music.code, music.title, music.author);
}

// Inicialización
$(document).ready(function() {
    loadTheme();
    checkExpirationDate();
    
    $("#myInput").on("keyup", function() {
        $('.card-body').addClass('d-none');
        $('.card-footer').addClass('d-none');
        $('.card-contenido').html('');

        const value = $(this).val();
        filteredRows = [];
        
        $("#myTable tr").filter(function() {
            const row = this;

            if (isHighlighted) {
                $(this).find('span.text-founded').each(function() {
                    $(this).replaceWith($(this).text());
                });
            }
            
            const content = row.innerHTML;
            row.innerHTML = content;

            if (value.length >= minChars) {
                if (searchAndHighlightText(row, value)) {
                    filteredRows.push($(row));
                }
                $(row).toggle(exist);
            } else {
                if (value.length === 0) filteredRows.push($(row));
                $(row).toggle(true);
            }
        });
        
        currentIndex = 0;
        updateCounter();
        updateButtons();
    });
    
    $("#myInput").trigger("keyup");
    $("#siguiente").on("click", function() {
        if (currentIndex < filteredRows.length - 1) {
            currentIndex++;
            scrollToCurrent();
        }
    });
    
    $("#anterior").on("click", function() {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToCurrent();
        }
    });
    
    document.getElementById('contador').addEventListener('click', updateCounterManually);
    
    // Cargar y mostrar datos
    async function showIndex() {
        await loadAndProcessData('https://ilovebiodanza.github.io/catalogo/data/', 'Title', processTitles);
        await loadAndProcessData('https://ilovebiodanza.github.io/catalogo/data/', 'Music', processMusics);

        const myTable = document.getElementById('myTable');

        titles.sort((a, b) => {
            return a.type.localeCompare(b.type) || a.title.localeCompare(b.title);
        });

        titles.forEach((t, index) => {
            if (t.type === 'Dance' && t.musics) {
                const sources = new Set();
                t.musics.forEach((m, i) => {
                    const proposedBy = titles.find(title => title._id === m.ccre);
                    const result = musics.find(music => music._id === m.id);
                    if (result) {
                        sources.add(proposedBy.title + '|' + proposedBy.shortTitle);
                        result.propusedBy = proposedBy.title + '|' + proposedBy.shortTitle;
                        t.musics[i] = JSON.parse(JSON.stringify(result));
                    }
                });

                t.musics.sort((a, b) => (a.propusedBy + a.code).localeCompare(b.propusedBy + b.code));

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="p-1">
                        <div class="card">
                            <div class="card-header" style="cursor:pointer" onclick="showDance(${index})">
                                <div class="d-flex">
                                    <div class="p-2 mr-auto text-primary">${t.title} ${Array.from(sources).map((source) => {
                                        const shortTitle = '_' + source.split('|').pop();
                                        const title = source.split('|')[0];
                                        return `<sub class="badge badge-info" title="${title}">${shortTitle}</sub>`;
                                    }).join(' ')}</div>
                                    <div class="p-2"><span class="badge badge-${t.description.length > 15 ? 'success' : 'danger'}" title="Description available"><i class="bi bi-list"></i></span></div>
                                    <div class="p-2"><span class="badge badge-${t.musics.length > 0 ? 'success' : 'danger'}" title="Music available"><i class="bi bi-music-note"></i></span></div>
                                </div>                                
                            </div>
                            <div class="card-body d-none card-contenido" id="description-${index}"></div>
                            <div class="card-footer d-none">
                                <div class="list-group card-contenido" id="musics-${index}"></div>
                            </div>
                        </div>
                    </td>`;
                myTable.appendChild(tr);                        
            }
        });
    }
    
    showIndex();
    $('.toast').toast('show');
});
