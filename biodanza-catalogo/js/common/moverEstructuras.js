/**
 * Clase para manipular y transformar estructuras de datos de Biodanza
 * con capacidades de encriptación básica y manejo de textos
 */
class MoverEstructuras {
    /**
     * Constructor de la clase
     * @param {string} clave - Clave para operaciones de transformación
     */
    constructor(clave) {
        this.clave = clave || "0a1Ab@Bc#C2d$De%EfF^gG&hH3iI(Jj4)k-KlLm5Mn+NoOpPq6Q]rRSs}t|TuU;V7v:w8WxX9'y,Y=Zz<>?/`~ !_*[{";
        this.patron = this.crearPatron(this.clave);
    }

    /**
     * Crea un patrón de transformación basado en la clave
     * @param {string} clave - Clave para generar el patrón
     * @returns {Object} Patrón de transformación
     */
    crearPatron(clave) {
        const patron = {};
        const longitud = clave.length;
        
        for (let i = 0; i < longitud; i++) {
            const caracter = clave[i];
            patron[caracter] = clave[(i + 5) % longitud];
        }
        
        return patron;
    }

    /**
     * Transforma un texto según el patrón
     * @param {string} texto - Texto a transformar
     * @param {boolean} invertir - Si es true, invierte la transformación
     * @returns {string} Texto transformado
     */
    transformar(texto, invertir = false) {
        if (!texto) return '';
        
        let resultado = '';
        const patron = this.patron;
        
        for (const caracter of texto) {
            if (invertir) {
                const encontrado = Object.entries(patron).find(([_, v]) => v === caracter);
                resultado += encontrado ? encontrado[0] : caracter;
            } else {
                resultado += patron[caracter] || caracter;
            }
        }
        
        return resultado;
    }

    /**
     * Procesa una descripción (encripta/desencripta según corresponda)
     * @param {string} id - Identificador del elemento
     * @param {string} texto - Texto a procesar
     * @returns {string} Texto procesado
     */
    des(id, texto) {
        if (!texto || texto.length < 10) return texto;
        
        const esEncriptado = this.esTextoEncriptado(texto);
        const partes = texto.split('|');
        
        if (partes.length === 1) {
            return esEncriptado ? this.transformar(texto, true) : texto;
        }
        
        const [indicador, ...resto] = partes;
        const contenido = resto.join('|');
        
        if (esEncriptado) {
            return this.transformar(contenido, true);
        } else if (indicador === id) {
            return contenido;
        }
        
        return texto;
    }

    /**
     * Determina si un texto está encriptado
     * @param {string} texto - Texto a evaluar
     * @returns {boolean} True si el texto parece encriptado
     */
    esTextoEncriptado(texto) {
        if (!texto) return false;
        
        // Heurística simple: más del 30% de caracteres no alfanuméricos
        const caracteresNoAlfa = texto.replace(/[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '').length;
        return (caracteresNoAlfa / texto.length) > 0.3;
    }

    /**
     * Normaliza un texto para búsquedas (elimina acentos y convierte a minúsculas)
     * @param {string} texto - Texto a normalizar
     * @returns {string} Texto normalizado
     */
    normalizar(texto) {
        return texto.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Formatea una línea de Biodanza (acrónimos)
     * @param {string} linea - Línea a formatear
     * @returns {string} Línea formateada
     */
    formatearLinea(linea) {
        if (!linea) return '';
        
        return linea.replace(/Afectividad/g, 'AF')
                   .replace(/Creatividad/g, 'CR')
                   .replace(/Sexualidad/g, 'SX')
                   .replace(/Trascendencia/g, 'TR')
                   .replace(/Vitalidad/g, 'VT');
    }

    /**
     * Genera un identificador único basado en el contenido
     * @param {string} contenido - Contenido para generar el ID
     * @returns {string} ID generado
     */
    generarId(contenido) {
        if (!contenido) return '';
        
        let hash = 0;
        for (let i = 0; i < contenido.length; i++) {
            const char = contenido.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convierte a entero de 32 bits
        }
        
        return Math.abs(hash).toString(16).substring(0, 8);
    }

    /**
     * Extrae metadatos de un texto estructurado
     * @param {string} texto - Texto con metadatos
     * @returns {Object} Objeto con los metadatos extraídos
     */
    extraerMetadatos(texto) {
        const resultado = {
            autor: null,
            año: null,
            fuente: null,
            lineas: []
        };
        
        if (!texto) return resultado;
        
        // Expresiones regulares para buscar patrones comunes
        const patronAutor = /(?:autor|creado por|by)\s*:\s*([^\n]+)/i;
        const patronAño = /(?:año|year)\s*:\s*(\d{4})/i;
        const patronFuente = /(?:fuente|source)\s*:\s*([^\n]+)/i;
        const patronLineas = /(?:línea|line)\s*:\s*([^\n]+)/i;
        
        // Extraer información
        const matchAutor = texto.match(patronAutor);
        const matchAño = texto.match(patronAño);
        const matchFuente = texto.match(patronFuente);
        const matchLineas = texto.match(patronLineas);
        
        if (matchAutor) resultado.autor = matchAutor[1].trim();
        if (matchAño) resultado.año = parseInt(matchAño[1]);
        if (matchFuente) resultado.fuente = matchFuente[1].trim();
        
        if (matchLineas) {
            resultado.lineas = matchLineas[1]
                .split(',')
                .map(linea => this.formatearLinea(linea.trim()))
                .filter(linea => linea);
        }
        
        return resultado;
    }
}

// Exportar la clase para su uso en otros módulos
export default MoverEstructuras;
