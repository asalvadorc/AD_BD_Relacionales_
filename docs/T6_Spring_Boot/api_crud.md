# Crear y modificar datos desde la API

Hasta ahora la API devuelve JSON, mientras que las modificaciones se realizan con formularios HTML. Ahora aceptaremos **JSON como entrada** y utilizaremos el servicio para crear, modificar y eliminar comarcas de prueba.

Seguimos con `Comarca` para no introducir todavía relaciones nuevas. **No se crean otros controladores ni servicios de comarcas**: ampliamos los del apartado anterior.

## Peticiones y respuestas

| Petición | Operación | Respuesta correcta |
|---|---|---|
| `GET /api/comarcas/{id}` | Consultar una comarca | `200 OK` + datos de la comarca en JSON |
| `POST /api/comarcas` | Crear una comarca | `201 Created` + datos de la comarca creada en JSON |
| `PUT /api/comarcas/{id}` | Cambiar la provincia | `200 OK` + datos de la comarca actualizada en JSON |
| `DELETE /api/comarcas/{id}` | Eliminar una comarca | `204 No Content`, sin cuerpo de respuesta |

La columna **Respuesta correcta** indica el código de estado HTTP y, cuando corresponde, los datos que recibe el cliente si la operación termina bien. El controlador devuelve un `ComarcaDTO` que Spring convierte en el JSON de la respuesta. Al eliminar, solo se envía el código de estado, sin datos en el cuerpo.

!!! note "Navegador y Postman"
    La barra de direcciones del navegador sirve para las consultas GET, pero no para enviar estos cuerpos JSON con POST o PUT. Utilizaremos Postman al final.

## DTO de entrada

Crea **`dto/ComarcaEntrada.kt`**. Las dos clases pueden estar en este archivo:

```kotlin
package org.example.springjpa.dto

data class CrearComarcaDTO( // (1)!
    val nomC: String = "",
    val provincia: String? = null
)

data class ActualizarComarcaDTO( // (2)!
    val provincia: String? = null
)
```

1. El alta admite nombre y provincia. El valor inicial vacío permite comprobar en el servicio si falta el nombre.
2. La actualización solo admite la provincia. La clave se obtiene de la URL y no se cambia.

## Comunicar errores

Queremos distinguir una entrada incorrecta (400), un registro inexistente (404) y un conflicto (409). Para ello creamos una excepción sencilla y un componente que la convierte en respuesta HTTP.

Crea **`service/ErrorOperacion.kt`**:

```kotlin
package org.example.springjpa.service

class ErrorOperacion(val estado: Int, mensaje: String) : RuntimeException(mensaje)
```

Crea **`controller/ErroresApi.kt`**:

```kotlin
package org.example.springjpa.controller

import org.example.springjpa.service.ErrorOperacion
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice(annotations = [RestController::class]) // (1)!
class ErroresApi {
    @ExceptionHandler(ErrorOperacion::class)
    fun operacion(error: ErrorOperacion): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(error.estado)
            .body(mapOf("mensaje" to (error.message ?: "Operacion no realizada"))) // (2)!

    @ExceptionHandler(DataIntegrityViolationException::class)
    fun integridad(): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(409)
            .body(mapOf("mensaje" to "Los datos incumplen una restriccion o tienen registros relacionados."))
}
```

1. Centraliza estos errores para los controladores REST. No cambia las respuestas de los controladores de formularios HTML.
2. Envía el estado HTTP y un mensaje JSON. No devolvemos al cliente detalles internos de la base de datos. El segundo manejador cubre, por ejemplo, una clave duplicada o un borrado impedido por una relación.

## Ampliar el servicio

En **`ComarcaService.kt`**, añade estos imports sin eliminar los existentes:

```kotlin
import org.example.springjpa.dto.CrearComarcaDTO
import org.example.springjpa.dto.ActualizarComarcaDTO
import org.example.springjpa.model.Comarca
```

Añade los siguientes métodos **dentro de las llaves de la clase `ComarcaService`**, conservando los de listado y búsqueda.

!!!Note "Recuerda"
    La clase tiene `@Transactional(readOnly = true)`. Por eso añadimos **`@Transactional` a `crear`, `actualizar` y `eliminar`**: estos métodos necesitan una transacción de escritura. `obtenerPorId` conserva la configuración de lectura de la clase. Puedes repasar la [explicación de las transacciones en el servicio](dto.md#por-que-utilizamos-transactional).


```kotlin
fun obtenerPorId(id: String): ComarcaDTO {
    val comarca = comarcaRepository.findById(id)
        .orElseThrow { ErrorOperacion(404, "Comarca no encontrada") } // (1)!
    return ComarcaDTO(comarca.nomC, comarca.provincia)
}

@Transactional // (2)!
fun crear(datos: CrearComarcaDTO): ComarcaDTO {
    if (datos.nomC.isBlank() || datos.nomC.length > 50) {
        throw ErrorOperacion(400, "El nombre debe tener entre 1 y 50 caracteres")
    }
    comprobarProvincia(datos.provincia)
    if (comarcaRepository.existsById(datos.nomC)) {
        throw ErrorOperacion(409, "La comarca ya existe")
    }
    val comarca = comarcaRepository.save(Comarca(datos.nomC, datos.provincia))
    return ComarcaDTO(comarca.nomC, comarca.provincia)
}

@Transactional
fun actualizar(id: String, datos: ActualizarComarcaDTO): ComarcaDTO {
    comprobarProvincia(datos.provincia)
    val comarca = comarcaRepository.findById(id)
        .orElseThrow { ErrorOperacion(404, "Comarca no encontrada") }
    comarca.provincia = datos.provincia // (3)!
    comarcaRepository.save(comarca)
    return ComarcaDTO(comarca.nomC, comarca.provincia)
}

@Transactional
fun eliminar(id: String) {
    val comarca = comarcaRepository.findById(id)
        .orElseThrow { ErrorOperacion(404, "Comarca no encontrada") }
    comarcaRepository.delete(comarca)
}

private fun comprobarProvincia(provincia: String?) {
    if (provincia != null && provincia.length > 25) {
        throw ErrorOperacion(400, "La provincia admite como maximo 25 caracteres")
    }
}
```

1. `findById` devuelve un `Optional`: puede contener una entidad o estar vacío. `orElseThrow` recupera el valor o lanza la excepción indicada.
2. Esta anotación sustituye la configuración de solo lectura de la clase para este método. Spring gestiona la transacción cuando el controlador llama al servicio: confirma al terminar correctamente y revierte si sale una excepción no comprobada, como `ErrorOperacion`. No escribimos `commit()` ni `rollback()` manualmente.
3. Modificamos únicamente el campo permitido de la entidad recuperada. El identificador sigue siendo el de la URL.

La base de datos sigue aplicando sus restricciones aunque comprobemos antes los datos. Por ejemplo, no podemos borrar una comarca que tenga poblaciones asociadas.



## Ampliar el controlador REST

### Código del controlador

En **`ComarcaRestController.kt`**, añade estos imports:

```kotlin
import org.example.springjpa.dto.CrearComarcaDTO
import org.example.springjpa.dto.ActualizarComarcaDTO
import org.springframework.http.HttpStatus
```

Añade estos métodos **dentro de la clase `ComarcaController`**, sin borrar los de listado y búsqueda. Conserva los imports anteriores, incluido `org.springframework.web.bind.annotation.*`.

```kotlin
@GetMapping("/{id}")
fun obtenerPorId(@PathVariable id: String): ComarcaDTO = // (1)!
    comarcaService.obtenerPorId(id)

@PostMapping
@ResponseStatus(HttpStatus.CREATED) // (2)!
fun crear(@RequestBody datos: CrearComarcaDTO): ComarcaDTO = // (3)!
    comarcaService.crear(datos)

@PutMapping("/{id}")
fun actualizar(
    @PathVariable id: String,
    @RequestBody datos: ActualizarComarcaDTO
): ComarcaDTO = comarcaService.actualizar(id, datos)

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT) // (4)!
fun eliminar(@PathVariable id: String) {
    comarcaService.eliminar(id)
}
```

1. `@PathVariable` toma el identificador del segmento de la URL. No es lo mismo que `@RequestParam`, que lee parámetros como `?provincia=Alacant`.
2. Un alta correcta responde con 201. El DTO devuelto se convierte a JSON.
3. `@RequestBody` convierte el cuerpo JSON en el DTO de entrada. Los formularios HTML anteriores utilizaban `@ModelAttribute`.
4. Un borrado correcto responde con 204, sin cuerpo.

??? note "¿Es necesario HttpStatus? ¿Por qué lo utilizamos?"

    **No es obligatorio utilizar `HttpStatus`**, pero conviene devolver el código HTTP adecuado. Sin `@ResponseStatus`, los métodos de este ejemplo responderían normalmente con 200 si terminan correctamente. La operación seguiría funcionando, pero no distinguiríamos la creación (201) ni el borrado sin contenido (204).

    Cuando el controlador responde a una petición, no solo puede devolver datos JSON: también envía un **código de estado HTTP**. Ese código permite al cliente, como Postman, saber si la operación se ha realizado correctamente y qué tipo de resultado ha producido.

    **`HttpStatus` es un `enum` de Spring** que proporciona nombres descriptivos para esos códigos. Por ejemplo, `HttpStatus.CREATED` representa el código **201**. No realiza la operación ni comprueba los datos: lo utilizamos para indicar el estado de la respuesta.

    En `ComarcaController` lo combinamos con **`@ResponseStatus`**, que establece el código de una respuesta correcta del método:

    | Método del controlador | Estado de la respuesta correcta | Motivo |
    |---|---|---|
    | `obtenerPorId` y los listados | **200 OK** | Devuelven los datos consultados. En estos métodos Spring utiliza 200 por defecto, sin añadir `@ResponseStatus`. |
    | `crear` | **201 CREATED** | Informa de que se ha creado un recurso y devuelve su DTO. Lo indicamos con `@ResponseStatus(HttpStatus.CREATED)`. |
    | `actualizar` | **200 OK** | Devuelve el DTO con los datos actualizados. No necesitamos cambiar el estado predeterminado. |
    | `eliminar` | **204 NO_CONTENT** | Informa de que el borrado se ha realizado correctamente, sin enviar un cuerpo de respuesta. Lo indicamos con `@ResponseStatus(HttpStatus.NO_CONTENT)`. |

    La anotación `@PostMapping` indica **qué petición recibe** el método; `@ResponseStatus` indica **con qué estado responde** cuando termina correctamente. Son funciones distintas: utilizar POST no establece automáticamente una respuesta 201.

    Esta configuración pertenece al controlador porque forma parte de la comunicación HTTP con el cliente. El servicio se encarga de realizar la operación. Si se produce un error, el componente `ErroresApi` que hemos creado devuelve el estado correspondiente, como 400, 404 o 409, en lugar del estado de éxito.

## Probar con Postman

Arranca la aplicación. En Postman crea una colección para guardar las peticiones. Para POST y PUT, selecciona **Body → raw → JSON**; así se envía el tipo de contenido `application/json`.

1. Envía **POST** a `http://localhost:8080/api/comarcas` con este cuerpo:

    ```json
    {"nomC": "ComarcaPrueba", "provincia": "Alacant"}
    ```

2. Consulta con **GET** `http://localhost:8080/api/comarcas/ComarcaPrueba`.
3. Envía **PUT** a esa misma dirección con:

    ```json
    {"provincia": "Valencia"}
    ```

4. Repite GET y comprueba la nueva provincia.
5. Envía **DELETE** a esa misma dirección. Usa una comarca de prueba sin poblaciones asociadas.
6. Repite GET: debe devolver 404 con un mensaje.

Comprueba también un POST con nombre vacío (400) y un POST con un nombre ya existente (409).

Los endpoints HTML de `/comarcas` siguen siendo independientes. Esta sección amplía solamente `/api/comarcas`.

Referencias: [controladores REST de Spring](https://spring.io/guides/gs/rest-service/) y [transacciones con @Transactional](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html).
