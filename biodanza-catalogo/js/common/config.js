// Configuración común para todas las páginas
const language = "es";
const themesAvailable = [
    'cerulean', 'ciborg', 'cosmo', 'darkly', 'flatly', 
    'journal', 'litera', 'lumen', 'lux', 'materia', 
    'minty', 'pulse', 'sandstone', 'simplex', 'sketchy', 
    'slate', 'solar', 'spacelab', 'superhero', 'united', 
    'yeti'
];

function loadTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('tema') || 'cerulean';
    
    if (themesAvailable.includes(theme)) {
        document.getElementById('tema').href = `css/themes/${theme}.css`;
    } else {
        console.warn('Tema no válido. Se cargará el tema por defecto.');
    }
}

function checkExpirationDate() {
    function decrypt(text) {
        return atob(text);
    }

    const params = new URLSearchParams(window.location.search);
    const encryptedDate = params.get('ff');
    
    if (encryptedDate) {
        const decryptedDate = new Date(decrypt(encryptedDate));
        
        function verifyDate() {
            const currentDate = new Date();
            if (currentDate > decryptedDate) {
                document.getElementById('mb').innerHTML = "";
                window.location.href = "https://ilovebiodanza.top";
            }
        }
        
        verifyDate();
        setInterval(verifyDate, 300000);
    } else {
        document.getElementById('mb').innerHTML = "";
        window.location.href = "https://ilovebiodanza.top";
    }
}
