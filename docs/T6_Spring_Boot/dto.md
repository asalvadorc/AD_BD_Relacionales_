# Separar responsabilidades: servicios y DTO

Hasta ahora, los controladores consultan directamente el repositorio. Vamos a separar **cómo recibimos una petición**, **qué operaciones realizamos** y **qué datos devolvemos**. No cambiamos la base de datos: reorganizamos el código de la aplicación.

## Qué es un DTO

**DTO** significa **Data Transfer Object**, es decir, **objeto de transferencia de datos**. Es un objeto cuya función es agrupar los datos que queremos enviar o recibir. En Kotlin podemos representarlo con una `data class` sencilla.

En nuestra API, el cliente es quien realiza la petición, por ejemplo el navegador o Postman. Hasta ahora devolvíamos directamente las entidades obtenidas del repositorio. Con un DTO, elegimos qué datos de esas entidades queremos incluir en la respuesta.

Por ejemplo, para mostrar un instituto podríamos necesitar solo su nombre y el nombre de su población. No tendríamos que enviar todas sus columnas ni el objeto completo de la población: podríamos preparar un DTO con esos dos valores.

**Un DTO no es una tabla nueva ni una consulta**. Contiene datos en memoria, pero no se conecta a PostgreSQL ni guarda cambios por sí mismo. Tampoco es el JSON: es el objeto Kotlin que Spring Web puede convertir en JSON al enviar la respuesta.

### Diferencia entre entidad y DTO

| Entidad JPA | DTO |
|---|---|
| Representa datos persistentes y su relación con la base de datos. | Representa los datos que queremos intercambiar con el cliente. |
| Utiliza anotaciones de mapeo como `@Entity`, `@Id` y `@Column`. | No necesita anotaciones de mapeo JPA. |
| Puede tener relaciones con otras entidades. | Puede incluir solo los valores necesarios, incluso procedentes de varias entidades. |
| Es el tipo con el que trabaja el repositorio. | Es el tipo que utilizaremos para recibir datos o devolver respuestas desde la API. |

En este primer ejemplo, `ComarcaDTO` tendrá los mismos campos que `Comarca`: `nomC` y `provincia`. Aunque la respuesta JSON se vea igual, serán clases con responsabilidades distintas. Más adelante podremos cambiar los datos de la respuesta sin modificar el mapeo de la tabla.

### DTO de entrada y de salida

- **Como salida:** para decidir qué información devolvemos, sin enviar directamente toda la entidad.
- **Como entrada:** para definir qué campos puede enviar el cliente al crear o modificar un registro. Por ejemplo, un DTO de actualización puede omitir la clave primaria para no permitir cambiarla.

El DTO de entrada no necesita coincidir con la entidad ni con el DTO de respuesta:

| Operación | Datos que podemos intercambiar |
|---|---|
| Crear | DTO de entrada con los campos permitidos. |
| Consultar | DTO de salida con la información que queremos mostrar. |
| Modificar | DTO de entrada con los campos editables, sin permitir cambiar la clave. |
| Eliminar por identificador | El identificador de la URL suele ser suficiente; no hace falta un cuerpo JSON. |

No es obligatorio utilizar DTO en toda aplicación, pero en el proyecto de este tema los usaremos para separar la API del modelo de persistencia. **En este apartado construiremos un DTO de salida: `ComarcaDTO`.**

Un DTO ayuda a separar la API del modelo de persistencia, pero **no valida los datos ni garantiza la seguridad por sí solo**: las comprobaciones deben programarse. Primero veremos DTO de salida; los de entrada se utilizarán al escribir datos desde la API.


!!! question "¿Seguimos utilizando JDBC cuando trabajamos con JPA?"
    ??? success "Ver respuesta"
        Sí. Hibernate utiliza el driver JDBC para comunicarse con PostgreSQL. Lo que cambia es el nivel de abstracción: escribimos entidades y repositorios en lugar de preparar cada sentencia y recorrer manualmente cada `ResultSet`.


## Qué papel tiene el servicio

Un **servicio** reúne las operaciones y comprobaciones de negocio. En este ejemplo también se encargará de **transformar las entidades del repositorio en DTO**: leerá sus propiedades y construirá los objetos de respuesta.

Son conceptos distintos: el servicio realiza operaciones y el DTO transporta los datos. Un servicio puede existir sin utilizar DTO.

## Qué cambia en el proyecto

| Elemento | Qué haremos |
|---|---|
| `model/Comarca.kt` | Se conserva: es la entidad que representa la tabla. |
| `repository/ComarcaRepository.kt` | Se conserva: sigue trabajando con entidades. |
| `dto/ComarcaDTO.kt` | Se crea: define los datos de salida. |
| `service/ComarcaService.kt` | Se crea: consulta el repositorio y transforma los resultados. |
| `controller/ComarcaRestController.kt` | Se sustituye: ahora llama al servicio. |
| Controlador MVC y plantillas | Se conservan; este paso modifica solo la API JSON. |

Crea los paquetes `dto` y `service` dentro de `org.example.springjpa` si no existen. No son carpetas generadas automáticamente.

```text
Petición HTTP → Controlador REST → Servicio → Repositorio → Base de datos
Respuesta JSON ← DTO ← Transformación de la entidad
```

## Definir los datos de salida

Crea **`dto/ComarcaDTO.kt`**:

```kotlin
package org.example.springjpa.dto

data class ComarcaDTO( // (1)!
    val nomC: String,
    val provincia: String?
)
```

1. El DTO es una `data class`, sin `@Entity` ni mapeo de columnas. Aquí tiene los mismos campos que la entidad para mantener el ejemplo sencillo, pero permite decidir qué información enviamos sin exponer directamente la entidad.

No estamos renombrando `nom_c` aquí: la propiedad de la entidad ya se llama `nomC`. El mapeo entre columna y propiedad se definió con `@Column`.

## Crear el servicio

### Por qué utilizamos @Transactional

Una **transacción** agrupa operaciones de base de datos en una unidad de trabajo. En JDBC gestionábamos la confirmación y la reversión con `commit()` y `rollback()`. Con Spring podemos declarar ese límite mediante **`@Transactional`**, sin escribir esas llamadas manualmente.

**No es obligatorio añadirla a todos los métodos.** Muchos métodos heredados de `JpaRepository` ya tienen su propia configuración transaccional. La utilizamos en el servicio para que todas las llamadas al repositorio que forman una misma operación compartan una transacción.

En este ejemplo solo consultamos datos, por lo que anotamos la clase con **`@Transactional(readOnly = true)`**. Así establecemos la configuración predeterminada de lectura para sus métodos. Es una indicación que puede permitir optimizaciones, **no una protección que impida cualquier escritura**.

Más adelante, al añadir métodos que modifiquen datos, utilizaremos esta distinción:

<div class="tabla-transacciones" markdown="1">

| Dónde se coloca | Configuración | Para qué se utiliza |
|---|---|---|
| En la clase | `@Transactional(readOnly = true)` | Configuración predeterminada para listar, buscar y consultar. |
| En un método de escritura | `@Transactional` | Sustituye la configuración de la clase por una transacción de lectura y escritura para crear, actualizar o eliminar. |

</div>

Por ejemplo, **consultar una comarca → modificar su provincia → guardar** formará una sola operación en el servicio. Spring confirma al terminar correctamente y, por defecto, revierte si sale del método una excepción no comprobada (`RuntimeException`) o un `Error`. Nuestra excepción `ErrorOperacion`, que veremos después, será de ese tipo.

La gestión transaccional se aplica cuando el controlador llama al servicio gestionado por Spring. No necesitamos repetir la anotación en cada método de lectura: hereda la configuración de la clase.

### Código del servicio

Crea **`service/ComarcaService.kt`**:

```kotlin
package org.example.springjpa.service

import org.example.springjpa.dto.ComarcaDTO
import org.example.springjpa.repository.ComarcaRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service // (1)!
@Transactional(readOnly = true) // (2)!
class ComarcaService(private val comarcaRepository: ComarcaRepository) {
    fun obtenerComarcas(): List<ComarcaDTO> =
        comarcaRepository.findAll().map { comarca -> // (3)!
            ComarcaDTO(comarca.nomC, comarca.provincia)
        }

    fun obtenerComarcasPorProvincia(provincia: String): List<ComarcaDTO> =
        comarcaRepository.findByProvincia(provincia).map { comarca ->
            ComarcaDTO(comarca.nomC, comarca.provincia) // (4)!
        }
}
```

1. Spring detecta el servicio y puede proporcionarlo al controlador mediante el constructor, igual que hacía con el repositorio.
2. Las llamadas al servicio se ejecutan en una transacción de lectura. Importamos la anotación de Spring. No es una validación de permisos ni una garantía de que sea imposible escribir.
3. `map` crea una nueva lista: transforma cada entidad en un DTO. Una lista vacía se transforma en otra lista vacía.
4. Mantenemos `null` cuando la provincia no tiene valor, igual que en el listado general. No cambiamos arbitrariamente un dato ausente por una cadena vacía.

## Utilizar el servicio desde el controlador

**Sustituye** el contenido de **`controller/ComarcaRestController.kt`**, manteniendo la clase `ComarcaController` del primer ejemplo. No crees otro controlador para las mismas rutas.

```kotlin
package org.example.springjpa.controller

import org.example.springjpa.dto.ComarcaDTO
import org.example.springjpa.service.ComarcaService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/comarcas")
class ComarcaController(private val comarcaService: ComarcaService) { // (1)!
    @GetMapping
    fun obtenerComarcas(): List<ComarcaDTO> =
        comarcaService.obtenerComarcas()

    @GetMapping("/buscar")
    fun obtenerComarcasPorProvincia(
        @RequestParam provincia: String // (2)!
    ): List<ComarcaDTO> =
        comarcaService.obtenerComarcasPorProvincia(provincia)
}
```

1. El controlador ya no depende del repositorio: recibe el servicio y devuelve sus DTO. Spring Web transforma la respuesta a JSON.
2. Lee el parámetro de la URL, por ejemplo `/api/comarcas/buscar?provincia=Alacant`. Si no se envía, Spring responde con un error de petición.

## Comprobar el cambio

Abre [todas las comarcas](http://localhost:8080/api/comarcas) y [la búsqueda por provincia (Alacant)](http://localhost:8080/api/comarcas/buscar?provincia=Alacant). Prueba también una provincia inexistente: recibirás `[]`.

El JSON puede ser igual al anterior: lo que cambia es la organización interna. Comprueba en el código el recorrido:  
 controlador → servicio → repositorio.

En el [siguiente apartado](api_crud.md) utilizaremos DTO de entrada para recibir y validar los datos al crear o modificar comarcas.

Referencia: [transacciones declarativas de Spring](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html).


!!! question "¿Una entidad y un DTO cumplen la misma función?"
    ??? success "Ver respuesta"
        No. La entidad participa en el mapeo y la persistencia; el DTO contiene los datos que queremos intercambiar. Una entidad puede tener relaciones que no conviene enviar directamente al cliente.
