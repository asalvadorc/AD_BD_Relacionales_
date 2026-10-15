# CRUD de comarcas

Siguiendo con el ejemplo del apartado anterior, que accede a una base de datos relacional **Postgres** en un contenedor **Docker**, en este apartado iremos más allá y veremos como realizar operaciones **CRUD**, ya que ahora la base de datos está en local y podemos hacer todas las modificaciones que necesitemos.
Como ejemplo, haremos modificaciones sobre la tabla **comarca**.

En esta etapa didáctica el controlador llama directamente al repositorio. Sustituye el controlador MVC anterior por esta versión y añade las plantillas. Más adelante trasladaremos la lógica de negocio a servicios.

**ComarcaMvcController.kt**

        package org.example.springjpa.controller

        import org.example.springjpa.model.Comarca
        import org.springframework.stereotype.Controller
        import org.springframework.ui.Model
        import org.example.springjpa.repository.ComarcaRepository
        import org.springframework.web.bind.annotation.*


        @Controller     //en lugar de @RestController
        @RequestMapping("/comarcas")
        class ComarcaControllerEntity(private val ComarcaRepository: ComarcaRepository) {
            @GetMapping
            fun listarComarcas(model:Model): String {
                val comarcas = ComarcaRepository.findAll()
                model.addAttribute("comarcas", comarcas)
                return "comarcas" // Nombre de la plantilla HTML
            }

            @GetMapping("/buscar")
            fun buscarComarcasPorProvincia(@RequestParam provincia: String, model: Model): String {
                val comarcas= ComarcaRepository.findByProvincia(provincia)
                model.addAttribute("comarcas", comarcas)
                return "comarcas" // Nombre de la plantilla HTML
            }

            @GetMapping("/nueva")
            fun mostrarFormularioNuevaComarca(model: Model): String {
                model.addAttribute("comarca", Comarca())
                return "nueva_comarca"
            }

            @PostMapping("/nueva")
            fun guardarComarca(@ModelAttribute comarca: Comarca): String {
                require(comarca.nomC.isNotBlank()) { "El nombre es obligatorio" }
                require(!ComarcaRepository.existsById(comarca.nomC)) { "La comarca ya existe" }
                ComarcaRepository.save(comarca)
                return "redirect:/comarcas"
            }

            @GetMapping("/editar/{id}")
            fun mostrarFormularioEditarComarca(
                @PathVariable id: String,
                model: Model
            ): String {

                val comarca = ComarcaRepository.findById(id)
                    .orElseThrow { IllegalArgumentException("Comarca no encontrada: $id") }

                model.addAttribute("comarca", comarca)
                return "editar_comarca"
            }

            @PostMapping("/editar/{id}")
            fun actualizarComarca(
                @PathVariable id: String,
                @ModelAttribute comarca: Comarca
            ): String {

                val comarcaExistente = ComarcaRepository.findById(id)
                    .orElseThrow { IllegalArgumentException("Comarca no encontrada: $id") }

                // Solo se actualizan los campos editables
                comarcaExistente.provincia = comarca.provincia

                ComarcaRepository.save(comarcaExistente)

                return "redirect:/comarcas"
            }

            @GetMapping("/eliminar/{id}")
            fun confirmarEliminacion(@PathVariable id: String, model: Model): String {
                val comarca = ComarcaRepository.findById(id)
                    .orElseThrow { IllegalArgumentException("Comarca no encontrada: $id") }
                model.addAttribute("comarca", comarca)
                return "eliminar_comarca"
            }

            @PostMapping("/eliminar/{id}")
            fun eliminarComarca(@PathVariable id: String): String {
                if (!ComarcaRepository.existsById(id)) {
                    throw IllegalArgumentException("Comarca no encontrada: $id")
                }
                ComarcaRepository.deleteById(id)
                return "redirect:/comarcas"
            }

        }

👉Creamos **las vistas** que permiten gestionar las operaciones CRUD

![alt text](img/image-31.png)

* **nueva_comarca.html**

        <!DOCTYPE html>
        <html xmlns:th="http://www.thymeleaf.org">
        <head>
        <meta charset="UTF-8">
        <title>Nueva Comarca</title>
        </head>
        <body>

        <h1>Nueva Comarca</h1>

        <form th:action="@{/comarcas/nueva}" th:object="${comarca}" method="post">

            <label for="nomC">Nombre:</label>
            <input type="text" th:field="*{nomC}" required>
            <br>

            <label for="provincia">Provincia:</label>
            <input type="text" th:field="*{provincia}" required>
            <br>

            <button type="submit">Guardar</button>

        </form>

        </body>
        </html>


* **editar_comarca.html**

        <!DOCTYPE html>
        <html xmlns:th="http://www.thymeleaf.org">
        <head>
            <meta charset="UTF-8">
            <title>Editar Comarca</title>
        </head>
        <body>

        <h1>Editar Comarca</h1>

        <form th:action="@{/comarcas/editar/{id}(id=${comarca.nomC})}"
            th:object="${comarca}"
            method="post">

            <label for="nomC">Nombre:</label>
            <input type="text" th:field="*{nomC}" readonly>
            <br>

            <label for="provincia">Provincia:</label>
            <input type="text" th:field="*{provincia}" required>
            <br>

            <button type="submit">Actualizar</button>

        </form>

        </body>
        </html>

* **eliminar_comarca.html**

        <!DOCTYPE html>
        <html xmlns:th="http://www.thymeleaf.org">
        <head>
            <meta charset="UTF-8">
            <title>Eliminar Comarca</title>
        </head>
        <body>

        <h1>Eliminar Comarca</h1>

        <p>¿Estás seguro de que deseas eliminar la siguiente comarca?</p>

        <ul>
            <li><strong>Nombre:</strong> <span th:text="${comarca.nomC}">Nombre</span></li>
            <li><strong>Provincia:</strong> <span th:text="${comarca.provincia}">Provincia</span></li>
        </ul>

        <form th:action="@{/comarcas/eliminar/{id}(id=${comarca.nomC})}" method="post">
            <button type="submit">Sí, eliminar</button>
            <a th:href="@{/comarcas}">Cancelar</a>
        </form>

        </body>
        </html>

👉Modificamos la vista **comarcas.html** que muestra todas las comarcas y permite acceder al resto de operaciones del CRUD.


        <!DOCTYPE html>
        <html xmlns:th="http://www.thymeleaf.org">
        <head>
        <title>Lista de Comarcas</title>
        </head>
        <body>
        <h1>Lista de Comarcas</h1>
        <table border="1">
        <tr>
            <th>Nombre</th>
            <th>Provincia</th>
            <th>Acciones</th>

        </tr>
        <tr th:each="comarca : ${comarcas}">
            <td th:text="${comarca.nomC}">Nombre</td>
            <td th:text="${comarca.provincia}">Provincia</td>
            <td>
            <a th:href="@{/comarcas/editar/{id}(id=${comarca.nomC})}">Editar</a>
            <a th:href="@{/comarcas/eliminar/{id}(id=${comarca.nomC})}">Eliminar</a>
            </td>
        </tr>

        </table>
        </body>
        </html>

👉El resultado sería el siguiente:

| URL | Captura |
|-----|---------|
|  [http://localhost:8080/comarcas](http://localhost:8080/comarcas) | ![Listado](img/image-26.png) |
|  [http://localhost:8080/comarcas/nueva](http://localhost:8080/comarcas/nueva) | ![Nueva](img/image-27.png) |
|  [http://localhost:8080/comarcas/editar/ComarcaNueva](http://localhost:8080/comarcas/editar/ComarcaNueva) | ![Editar](img/image-28.png) |
|  [http://localhost:8080/comarcas/eliminar/ComarcaNueva](http://localhost:8080/comarcas/eliminar/ComarcaNueva) | ![Eliminar](img/image-30.png) |




!!! note "Datos de prueba"
    Crea comarcas nuevas y sin poblaciones asociadas para probar el borrado. Una comarca referenciada no se puede eliminar sin resolver antes sus relaciones. Los errores de validación de este ejemplo mínimo deben convertirse en respuestas comprensibles en el proyecto final. La confirmación se muestra con GET y el borrado se ejecuta con POST.
