# Vistas y búsquedas con Thymeleaf

La API devuelve JSON. Ahora añadimos una interfaz HTML: `@Controller` prepara los datos y devuelve el nombre de una plantilla que Thymeleaf procesa en el servidor. Las rutas `/comarcas` y `/api/comarcas` pueden coexistir porque son diferentes.

## Dependencia y plantillas

Thymeleaf ya se seleccionó en el [asistente de Spring Boot de IntelliJ](entorno.md). Si no lo hiciste, añade esta dependencia al bloque `<dependencies>` de `pom.xml` y recarga el proyecto Maven:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

Las plantillas se guardan en `src/main/resources/templates`.

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

@Controller
@RequestMapping("/comarcas")
class ComarcaControllerEntity(private val comarcaRepository: ComarcaRepository) {
    @GetMapping
    fun listarComarcas(model: Model): String {
        model.addAttribute("comarcas", comarcaRepository.findAll())
        return "comarcas"
    }

    @GetMapping("/buscar")
    fun buscar(@RequestParam provincia: String, model: Model): String {
        model.addAttribute("comarcas", comarcaRepository.findByProvincia(provincia))
        return "comarcas"
    }
}
```

## Plantilla comarcas.html

```html
<!DOCTYPE html>
<html lang="es" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Comarcas</title>
</head>
<body>
<h1>Comarcas</h1>
<form th:action="@{/comarcas/buscar}" method="get">
    <label>Provincia: <input name="provincia" required></label>
    <button type="submit">Buscar</button>
    <a th:href="@{/comarcas}">Mostrar todas</a>
</form>
<p th:if="${#lists.isEmpty(comarcas)}">No se han encontrado comarcas.</p>
<table>
    <thead><tr><th>Comarca</th><th>Provincia</th></tr></thead>
    <tbody>
        <tr th:each="comarca : ${comarcas}">
            <td th:text="${comarca.nomC}"></td>
            <td th:text="${comarca.provincia}"></td>
        </tr>
    </tbody>
</table>
</body>
</html>
```

## Comprobar el resultado

Abre [el listado de comarcas](http://localhost:8080/comarcas) y busca una provincia que exista en tus datos. Prueba también un valor sin coincidencias. El navegador envía un GET, el controlador consulta el repositorio y Thymeleaf convierte los objetos del modelo en filas HTML.

El siguiente apartado [añade el CRUD](crud.md) sustituyendo esta versión del controlador y de la plantilla.
