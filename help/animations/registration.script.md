# Registro · guion de la animación con audio

**Estado:** texto y manifiesto listos para revisión.  
**Idioma inicial:** español.  
**Formato:** una animación HTML/CSS controlada por una secuencia de audios cortos.

## Criterios de producción

- Voz generada; si el resultado no convence, se sustituye por voz humana.
- Tono cálido, claro y cercano; español neutro con pronunciación natural.
- Ritmo pausado: entre 135 y 150 palabras por minuto.
- Sin música de fondo en esta primera versión.
- Cada segmento dura entre 5 y 9 segundos.
- El audio nunca se reproduce automáticamente: el usuario pulsa **Reproducir**.
- Siempre hay subtítulos.
- La animación espera el final del audio antes de pasar a la siguiente escena.
- Velocidad inicial recomendada: **0.9×**.
- Datos de ejemplo: Ana Pérez, `ana@ejemplo.com`, teléfono opcional. El código IBFed debe ser uno real para la grabación final.

## Pronunciación

| Término | Pronunciación sugerida |
|---|---|
| Yo❤Biodanza | “Yo amo Biodanza” |
| IBFed | “i-be-fed” |
| IBF | “i-be-efe” |
| 30 minutos | “treinta minutos” |

## Segmentos

### 01 · Introducción

**Narración**

> Para crear tu cuenta en Yo amo Biodanza, necesitas tu código IBFed y un correo electrónico válido.

**Subtítulo**

> Crea tu cuenta con tu código IBFed y un correo válido.

**Visual:** pantalla de registro, marca y formulario vacío.  
**Duración estimada:** 5 s.

---

### 02 · Código IBFed

**Narración**

> Empieza en el campo Código IBFed. Escribe el código que te fue asignado cuando te certificaste como Profesor de Biodanza. Para poder registrarte en esta aplicación debes estar certificado por la IBFed.

**Subtítulo**

> Escribe el código que recibiste al certificarte como Profesor de Biodanza.

**Visual:** foco en el campo; escritura de `BARQ 2262`.  
**Duración estimada:** 6 s.

---

### 03 · Datos personales

**Narración**

> Completa tu nombre y tu correo electrónico. El teléfono es opcional. Usa un correo que revises con frecuencia, porque allí recibirás la confirmación.

**Subtítulo**

> Completa nombre y correo. El teléfono es opcional.

**Visual:** escritura de nombre y correo; teléfono opcional.  
**Duración estimada:** 8 s.

---

### 04 · Contraseña

**Narración**

> Crea una contraseña de al menos ocho caracteres, con mayúscula, minúscula, número y símbolo. Luego escríbela de nuevo para confirmarla.

**Subtítulo**

> Crea y confirma una contraseña segura.

**Visual:** escritura de contraseña y confirmación; los requisitos cambian a verde.  
**Duración estimada:** 8 s.

---

### 05 · Enviar el registro

**Narración**

> Al pulsar Crear cuenta, revisa tu correo para confirmar el registro. Tienes treinta minutos.

**Subtítulo**

> Revisa tu correo para confirmar el registro. Tienes 30 minutos.

**Visual:** clic en Crear cuenta; aparece la pantalla de Ingresar con el mensaje de confirmación.  
**Duración estimada:** 7 s.

---

### 06 · Confirmar el correo

**Narración**

> Abre el mensaje de confirmación y pulsa el enlace. Ese enlace verifica tu correo y activa tu cuenta.

**Subtítulo**

> Abre el enlace de confirmación de tu correo.

**Visual:** correo recibido y clic en el enlace de confirmación.  
**Duración estimada:** 7 s.

---

### 07 · Volver a ingresar

**Narración**

> Cuando el correo esté confirmado, vuelve a Ingresar. Escribe tu correo y tu contraseña.

**Subtítulo**

> Vuelve a Ingresar con tu correo y contraseña.

**Visual:** pantalla de Ingresar con el mensaje de correo verificado; escritura de credenciales.  
**Duración estimada:** 6 s.

---

### 08 · Cierre

**Narración**

> Ya estás dentro de Yo amo Biodanza. Desde Inicio puedes entrar a Clases, Música o Actividades.

**Subtítulo**

> Ya puedes entrar a tus módulos.

**Visual:** pantalla de Inicio con la rejilla de módulos.  
**Duración estimada:** 5 s.

**Duración total estimada:** 52 s.

## Flujo real que debe representar

1. Formulario de registro con IBFed, nombre, correo, teléfono opcional, contraseña y confirmación.
2. Al enviar correctamente, redirección a `/users/signin` con aviso de confirmación por correo.
3. El enlace del correo confirma la cuenta.
4. El usuario vuelve a Ingresar y entra a la aplicación.

## Decisiones validadas

- El teléfono es opcional.
- El aviso de confirmación es de 30 minutos.
- No se muestra el enlace de Términos y Privacidad en la animación.
- La primera voz será generada; si no convence, se hará humana.
- Velocidad inicial: 0.9×.
- “Yo❤Biodanza” se pronuncia “Yo amo Biodanza”.
