// Utilidades comunes
function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function searchAndHighlightText(element, searchValue) {
    const normalizedSearchValue = normalizeText(searchValue);
    let found = false;

    function highlightRecursive(node) {
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];

            if (child.nodeType === Node.TEXT_NODE) {
                const originalText = child.textContent;
                const normalizedText = normalizeText(originalText);

                if (normalizedText.includes(normalizedSearchValue)) {
                    found = true;
                    const parts = originalText.split(new RegExp(`(${searchValue}|á|é|í|ó|ú)`, 'gi'));
                    const newContent = parts.map((part) => {
                        return normalizeText(part) === normalizedSearchValue 
                            ? `<span class="bg-warning text-founded">${part}</span>` 
                            : part;
                    }).join('');

                    const container = document.createElement('span');
                    container.innerHTML = newContent;
                    node.replaceChild(container, child);
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                highlightRecursive(child);
            }
        }
    }

    highlightRecursive(element);
    return found;
}

async function loadData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        if (!response.ok) throw new Error('Error en la red');
        return await response.json();
    } catch (error) {
        console.error('Hubo un problema con la solicitud Fetch:', error);
        return null;
    }
}

async function loadAndProcessData(baseUrl, type, processFunction) {
    let part = 1;
    let morePartsAvailable = true;

    while (morePartsAvailable) {
        const url = `${baseUrl}${type}_part${part}.json`;
        const data = await loadData(url);

        if (!data || data.length === 0) {
            morePartsAvailable = false;
        } else {
            processFunction(data);
            part++;
        }
    }
}
