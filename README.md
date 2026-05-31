# Sistema de Solicitud de Recuperatorio Académico

## Nombre del Caso de Uso

Sistema de Solicitud de Recuperatorio Académico mediante Webhook y API.

---

## Descripción del Escenario

Este flujo simula el proceso de inscripción de un alumno a una mesa de recuperatorio.

El alumno completa un formulario web indicando su nombre, DNI y materia. El sistema consulta una base de datos externa mediante API REST para verificar su situación académica.

Si el alumno posee una nota inferior a 6, se registra automáticamente una solicitud de recuperatorio. En caso contrario, la solicitud es rechazada y se informa que el alumno ya aprobó la materia.

---

## Disparador del Flujo (Trigger)

Nodo utilizado: **Webhook**

Método HTTP:  POST

Path:

```text
recuperatorio
```

El webhook recibe datos enviados desde una página web desarrollada en HTML, CSS y JavaScript.

Ejemplo de Payload recibido:

```json
{
  "nombre": "Juan Perez",
  "dni": "40123456",
  "materia": "Programacion"
}
```

---

## Descripción de los Nodos

### 1. Webhook

Recibe la solicitud enviada desde la página web. Actúa como punto de entrada del flujo y recibe los datos del alumno en formato JSON.

### 2. IF - Validación de Datos

Verifica que los campos nombre, dni y materia existan en la petición recibida. Si falta algún dato, el flujo se detiene.

### 3. Edit Fields

Normaliza y organiza los datos recibidos desde el webhook para facilitar su utilización en los nodos posteriores.

Variables utilizadas:

* nombre
* dni
* materia

### 4. HTTP Request

Realiza una petición GET a una API externa desarrollada en MockAPI para obtener la lista de alumnos registrados.


### 5. Filter

Filtra los resultados obtenidos desde la API para localizar únicamente al alumno cuyo DNI coincide con el recibido desde el formulario.

### 6. IF - Evaluación de Nota

Evalúa la nota obtenida por el alumno.

Condición:

```text
nota < 6
```

Justificación:

Los alumnos con nota menor a 6 pueden solicitar recuperatorio.

Los alumnos con nota igual o superior a 6 ya aprobaron la materia y no pueden inscribirse.

### 7. HTTP Request (POST)

Si el alumno cumple la condición anterior, se registra una nueva solicitud de recuperatorio en la API externa.

Método:  POST

### 8. Respond to Webhook (Aprobado para Recuperatorio)

Devuelve una respuesta JSON personalizada indicando que la solicitud fue registrada correctamente.

Ejemplo:

```json
{
  "status": "ok",
  "mensaje": "Inscripción registrada correctamente"
}
```

### 9. Respond to Webhook (Alumno Aprobado)

Devuelve una respuesta JSON personalizada indicando que el alumno ya aprobó la materia.

Ejemplo:

```json
{
  "status": "rechazado",
  "mensaje": "El alumno ya aprobó la materia y no puede inscribirse al recuperatorio"
}
```

---

## Credenciales Necesarias

No se requieren credenciales especiales.

La API utilizada fue desarrollada mediante MockAPI y posee acceso público para fines educativos.

---

## Recursos Externos

### Aplicación Web

```text
https://sofia-michelle.github.io/flujo_automatizado/
```

---

## Payload para Pruebas

Alumno que puede solicitar recuperatorio:

```json
{
  "nombre": "Juan Perez",
  "dni": "40123456",
  "materia": "Programacion"
}
```

Alumno que no puede solicitar recuperatorio:

```json
{
  "nombre": "Ana Lopez",
  "dni": "38765432",
  "materia": "Programacion"
}
```

---

## Resultado 

### Caso 1: Alumno Desaprobado

El sistema registra una nueva solicitud de recuperatorio y devuelve una respuesta de éxito.

### Caso 2: Alumno Aprobado

El sistema rechaza la solicitud y devuelve un mensaje indicando que el alumno ya aprobó la materia.
