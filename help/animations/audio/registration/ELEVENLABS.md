# Guía práctica: generar los audios de Registro con ElevenLabs

## 1. Crear la cuenta

1. Entra a <https://elevenlabs.io>.
2. Crea una cuenta.
3. Verifica el correo.
4. Revisa el plan disponible y sus límites. Para ocho fragmentos cortos suele
   alcanzar el plan gratuito, pero confirma las condiciones actuales.

## 2. Elegir una voz

1. Abre **Text to Speech**.
2. Filtra por idioma **Spanish**.
3. Escucha varias voces.
4. Elige una voz cálida, clara y neutra.
5. Usa la misma voz para los ocho segmentos y para futuras animaciones.

Antes de generar todo, prueba solo `01-intro.mp3`.

## 3. Configuración recomendada

- Modelo: el modelo multilingüe de mayor calidad disponible.
- Idioma: español.
- Velocidad: natural, aproximadamente 1.0×.
- Estabilidad: media.
- Similitud: alta.
- Estilo: bajo o neutro.
- Sin música de fondo.

La velocidad lenta se aplicará después en el reproductor, no conviene generar
el audio exageradamente lento.

## 4. Texto

Copia la narración de cada segmento desde:

`src/public/help/animations/registration.script.md`

No incluyas los títulos como “02 · Código IBFed” dentro del audio.

Pronunciaciones:

- **Yo❤Biodanza** → “Yo amo Biodanza”.
- **IBFed** → “i-be-fed”.
- **IBF** → “i-be-efe”.

Si ElevenLabs pronuncia mal una palabra, usa el diccionario de pronunciación
o prueba otra grafía en el texto.

## 5. Generar un segmento

1. Pega únicamente la narración del segmento.
2. Genera.
3. Escucha completa.
4. Descarga el MP3.
5. Renómbralo exactamente así:

```text
01-intro.mp3
02-ibfed.mp3
03-datos.mp3
04-password.mp3
05-enviar.mp3
06-email.mp3
07-ingresar.mp3
08-cierre.mp3
```

## 6. Dónde guardarlos

Colócalos en:

```text
src/public/help/animations/audio/registration/
```

Deben quedar junto a este archivo y al manifiesto.

## 7. Revisión antes de continuar

- ¿La voz suena natural?
- ¿Pronuncia bien “Yo amo Biodanza”?
- ¿Pronuncia bien “IBFed”?
- ¿El volumen es uniforme?
- ¿Hay ruido o cortes?
- ¿El tono es cercano y no publicitario?

## 8. Después de generarlos

Avísame cuando los archivos estén en esa carpeta. Yo:

1. leeré las duraciones reales;
2. actualizaré el manifiesto;
3. adaptaré la animación para que espere cada audio;
4. conectaré reproducción, pausa, subtítulos y velocidad 0.9×.

## Si usas la API

No pegues la API key en el chat. Si se automatiza, debe ir en una variable de
entorno segura del proyecto. Para ocho audios, la interfaz web es más simple.
