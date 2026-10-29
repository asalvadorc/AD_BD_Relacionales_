# Vistas y búsquedas con Thymeleaf

Hasta ahora hemos visto los datos JSON en el navegador. Ahora queremos una página con una tabla y un formulario de búsqueda. Para construirla utilizaremos **Thymeleaf**: toma una plantilla HTML y los datos que prepara el controlador y genera la página que recibe el navegador.

El controlador REST devuelve datos; el controlador MVC devuelve el nombre de una plantilla. Las rutas `/comarcas` (HTML) y `/api/comarcas` (JSON) pueden coexistir porque son diferentes. No cambiaremos la entidad ni el repositorio.

## Dependencia y plantillas

Ahora empezamos a utilizar **Thymeleaf** para generar las páginas HTML. Ya la seleccionamos al crear el proyecto, por lo que no necesitas añadirla de nuevo. Puedes reconocerla en el bloque `<dependencies>` de `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

Las plantillas se guardan en `src/main/resources/templates`. Crea esa carpeta si todavía no existe.

Durante el desarrollo, añade esta propiedad a `application.properties` para desactivar la caché de plantillas:

```properties
spring.thymeleaf.cache=false
```

## Repositorio

Reutiliza `ComarcaRepository`, que ya declara `findByProvincia(provincia: String)`. Spring Data deriva la consulta a partir de la propiedad `provincia` de la entidad. En el [apartado de consultas](consultas.md) se explica también la alternativa con `@Query` y JPQL.

## Controlador MVC

Crea `controller/ComarcaMvcController.kt`. Mantén el controlador REST de la primera aplicación; este nuevo controlador atiende las páginas HTML.

```kotlin
package org.example.springjpa.controller

import org.example.springjpa.repository.ComarcaRepository
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller // (1)!
@RequestMapping("/comarcas")
class ComarcaControllerEntity(private val comarcaRepository: ComarcaRepository) {
    @GetMapping
    fun listarComarcas(model: Model): String {
        model.addAttribute("comarcas", comarcaRepository.findAll()) // (2)!
        return "comarcas" // (3)!
    }

    @GetMapping("/buscar")
    fun buscar(@RequestParam provincia: String, model: Model): String { // (4)!
        model.addAttribute("comarcas", comarcaRepository.findByProvincia(provincia))
        return "comarcas"
    }
}
```

1. `@Controller` permite devolver nombres de vistas, a diferencia de `@RestController`, que envía datos en el cuerpo de la respuesta.
2. `Model` transporta datos a la plantilla. El nombre `comarcas` será la variable que utilizaremos en el HTML; no es una entidad JPA nueva.
3. Spring busca la plantilla `templates/comarcas.html`. No escribimos la extensión ni la ruta completa.
4. `@RequestParam` recibe el parámetro `provincia` que envía el formulario. El resultado se muestra reutilizando la misma plantilla.

## Plantilla del listado

Crea **`src/main/resources/templates/comarcas.html`**. Se abre mediante la ruta del controlador, no haciendo doble clic en el archivo: Thymeleaf debe procesar sus atributos `th:*` en el servidor.

```html
<!DOCTYPE html>
<html lang="es" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Comarcas</title>
</head>
<body>
<h1>Comarcas</h1>
<form th:action="@{/comarcas/buscar}" method="get"> <!-- (1)! -->
    <label>Provincia: <input name="provincia" required></label>
    <button type="submit">Buscar</button>
    <a th:href="@{/comarcas}">Mostrar todas</a>
</form>
<p th:if="${#lists.isEmpty(comarcas)}">No se han encontrado comarcas.</p>
<table>
    <thead><tr><th>Comarca</th><th>Provincia</th></tr></thead>
    <tbody>
        <tr th:each="comarca : ${comarcas}"> <!-- (2)! -->
            <td th:text="${comarca.nomC}"></td> <!-- (3)! -->
            <td th:text="${comarca.provincia}"></td>
        </tr>
    </tbody>
</table>
</body>
</html>
```

1. El formulario envía una petición GET a `/comarcas/buscar`; el campo `name="provincia"` proporciona el parámetro. `@{...}` construye una URL.
2. `th:each` repite la fila por cada objeto de la lista del modelo. `${...}` permite acceder a los datos.
3. `th:text` escribe el valor de la propiedad como texto en la celda.

## Comprobar el resultado

Abre [el listado de comarcas](http://localhost:8080/comarcas) y busca una provincia que exista en tus datos. Prueba también un valor sin coincidencias. El navegador envía un GET, el controlador consulta el repositorio y Thymeleaf convierte los objetos del modelo en filas HTML.

El siguiente apartado [añade el CRUD](crud.md) sustituyendo esta versión del controlador y de la plantilla.
