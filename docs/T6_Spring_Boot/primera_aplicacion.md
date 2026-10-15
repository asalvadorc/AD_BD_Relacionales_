# Primera aplicación: consultar comarcas

Partimos del [proyecto y la conexión local](entorno.md). Vamos a convertir la tabla `comarca` en una entidad, crear su repositorio y exponer un endpoint REST. La clave primaria `nom_c` es de texto y ya existe: no utilizamos `@GeneratedValue`.

Crea cada archivo en el paquete indicado. Usa clases ordinarias para entidades y conserva la configuración de Kotlin y JPA del `pom.xml` generado.



* **Entidad JPA**

Define las entidades que corresponden a las tablas existentes en la base de datos. No necesitas configuraciones especiales más allá de mapear las columnas.
En nuestro caso definimos la entidad comarca y sus campos.

En el paquete **model** crea un archivo llamado **comarca.kt**

    package org.example.springjpa.model

    import jakarta.persistence.*

    @Entity
    @Table(name = "comarca")
    class Comarca(
        @Id
        @Column(name = "nom_c")
        var nomC: String = "",

        @Column(name = "provincia")
        var provincia: String? = null
    )


* **Repositorio**

Crea un repositorio que permita ejecutar consultas sobre la tabla correspondiente.

Dentro del paquete **repository**, crea un archivo llamado **ComarcaRepository.kt**

    package org.example.springjpa.repository

    import org.example.springjpa.model.Comarca
    import org.springframework.data.jpa.repository.JpaRepository
    import org.springframework.stereotype.Repository

    interface ComarcaRepository : JpaRepository<Comarca, String> {
        fun findByProvincia(provincia: String): List<Comarca>
    }

* **Controlador**

El controlador manejará las solicitudes GET para obtener información de la base de datos.

Dentro del paquete **controller**, crea un archivo llamado **ComarcaRestController.kt**

    package org.example.springjpa.controller


    import org.example.springjpa.model.Comarca
    import org.example.springjpa.repository.ComarcaRepository
    import org.springframework.web.bind.annotation.*

    @RestController
    @RequestMapping("/api/comarcas")

    class ComarcaController(private val comarcaRepository: ComarcaRepository) {

        // Endpoint para obtener todas las comarcas
        @GetMapping
        fun obtenerComarcas(): List<Comarca> = comarcaRepository.findAll()
    }

!!!note ""
    * **@RestController:** Combina **@Controller** y **@ResponseBody**.
    Devuelve directamente datos en formato JSON.

    * **ObtenerComarcas()**: Devuelve una lista de objetos comarca.
    Spring automáticamente convierte esta lista a JSON usando Jackson (que viene incluido con Spring Boot).





## Probar la aplicación

Arranca la aplicación y abre [GET /api/comarcas](http://localhost:8080/api/comarcas). Comprueba que devuelve JSON y compara los datos con `SELECT nom_c, provincia FROM comarca` en DBeaver. Observa en la consola el SQL que genera Hibernate.

`JpaRepository<Comarca, String>` indica el tipo de entidad y el tipo de su identificador. `findAll()` recupera las entidades; ya no escribimos el bucle del `ResultSet`. La clase del controlador se llama `ComarcaController` aunque el archivo se denomine `ComarcaRestController.kt`; en las siguientes etapas sustituiremos su contenido.
