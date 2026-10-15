# Relaciones entre las tablas de geo

Para practicar la funcionalidad de Spring Data JPA vamos a seguir con el ejemplo **SpringJPA**.
Recordemos que la aplicación accede a la base de datos local en **Docker**.
En este ejemplo vamos a mapear las 3 tablas de la base de datos: **comarca, poblacio e institut** y a realizar los cambios necesarios para crear algunas consultas y operaciones CRUD. Utilizaremos Thymeleaf para mostrar los resultados.


* Entidad **Comarca**. Ya la teníamos creada en el ejemplo anterior.


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


* Entidad **Poblacio**

        package org.example.springjpa.model

        import jakarta.persistence.*

        @Entity
        @Table(name = "poblacio")
        class Poblacio(
            @Id
            @Column(name = "cod_m")
            var codM: Int = 0,

            @Column(name = "nom")
            var nom: String = "",

            @Column(name = "poblacio")
            var poblacio: Int? = null,

            @Column(name = "extensio")
            var extensio: Double? = null,

            @Column(name = "altura")
            var altura: Int? = null,

            @Column(name = "longitud")
            var longitud: String? = null,

            @Column(name = "latitud")
            var latitud: String? = null,

            @Column(name = "llengua")
            var llengua: String? = null,

            @ManyToOne //clave ajena a comarca
            @JoinColumn(name = "nom_c", referencedColumnName = "nom_c")
            var comarca: Comarca? = null
        )

* Entidad **Institut**

        package org.example.springjpa.model

        import jakarta.persistence.*

        @Entity
        @Table(name = "institut")
        class Institut(
            @Id
            @Column(name = "codi")
            var codi: String = "",

            @Column(name = "adreca")
            var adreca: String? = null,

            @Column(name = "codpostal")
            var codPostal: Int? = null,

            @Column(name = "nom")
            var nom: String? = null,

            @Column(name = "numero")
            var numero: String? = null,

            @ManyToOne //clave ajena a poblacio
            @JoinColumn(name = "cod_m", referencedColumnName = "cod_m")
            var poblacio: Poblacio? = null
        )


* Repositorio para Comarca: **ComarcaRepository**.

        package org.example.springjpa.repository

        import org.springframework.data.jpa.repository.Query
        import org.springframework.data.repository.query.Param
        import org.example.springjpa.model.Comarca
        import org.springframework.data.jpa.repository.JpaRepository
        import org.springframework.stereotype.Repository


        @Repository
        interface ComarcaRepository : JpaRepository<Comarca, String> {
            @Query("SELECT c FROM Comarca c WHERE c.provincia = :provincia")
            fun findComarcasporProvincia(@Param("provincia") provincia: String): List<Comarca>
            fun findByProvincia(provincia: String): List<Comarca>
        }

* Repositorio para Institut: **InstitutRepository**

        package org.example.springjpa.repository

        import org.example.springjpa.model.Institut
        import org.springframework.data.jpa.repository.JpaRepository

        interface InstitutRepository : JpaRepository<Institut, String> {
            // Obtener institutos de una población
            fun findByPoblacioNom(nom: String): List<Institut>

            // Obtener institutos de una comarca
            fun findByPoblacioComarcaNomC(nomC: String): List<Institut>

            // Obtener institutos de una provincia
            fun findByPoblacioComarcaProvincia(provincia: String): List<Institut>

            // Obtener institutos cuya población es mayor a
            fun findByPoblacioPoblacioGreaterThan(poblacio: Int): List<Institut>


        }

* Repositorio para Poblacio: **PoblacioRepository**

        import org.example.springjpa.model.Poblacio
        import org.springframework.data.jpa.repository.JpaRepository

        interface PoblacioRepository : JpaRepository<Poblacio, Int> {

            // Obtener poblaciones de una comarca
            fun findByComarcaNomC(nomC: String): List<Poblacio>

            // Obtener poblaciones de una provincia
            fun findByComarcaProvincia(provincia: String): List<Poblacio>

        }



* Controlador para Institut: **InstitutMvcController**

        package org.example.springjpa.controller


        import org.example.springjpa.repository.InstitutRepository
        import org.springframework.stereotype.Controller
        import org.springframework.ui.Model
        import org.springframework.web.bind.annotation.*

        @Controller
        @RequestMapping("/instituts")
        class InstitutController(private val institutRepository: InstitutRepository) {

            //Muestra todos los intitutos
            @GetMapping
            fun listarInstituts(model: Model): String {
                val instituts = institutRepository.findAll()
                model.addAttribute("instituts", instituts)
                return "instituts"
            }

            // Muestra institutos de una población
            @GetMapping("/por-poblacio")
            fun obtenerInstitutsPoblacio(@RequestParam poblacio: String, model: Model): String {
                val institutsPoblacio = institutRepository.findByPoblacioNom(poblacio)
                model.addAttribute("instituts", institutsPoblacio)
                return "instituts" // Plantilla para mostrar la lista de institutos
            }

            // Muestra institutos de una comarca
            @GetMapping("/por-comarca")
            fun obtenerInstitutsComarca(@RequestParam comarca: String, model: Model): String {
                val institutsComarca = institutRepository.findByPoblacioComarcaNomC(comarca)
                model.addAttribute("instituts", institutsComarca)
                return "instituts" // Plantilla para mostrar la lista de institutos
            }



            // Muestra institutos de una provincia
            @GetMapping("/por-provincia")
            fun obtenerInstitutsProvincia(@RequestParam provincia: String, model: Model): String {
                val institutsProvincia = institutRepository.findByPoblacioComarcaProvincia(provincia)
                model.addAttribute("instituts", institutsProvincia)
                return "instituts" // Plantilla para mostrar la lista de institutos
            }


            // Muestra institutos con población superior a un valor
            @GetMapping("/poblacion-superior")
            fun obtenerInstitutsPoblacionSuperior(@RequestParam poblacio: Int, model: Model): String {
                val institutsConPoblacionSuperiorA = institutRepository.findByPoblacioPoblacioGreaterThan(poblacio)
                model.addAttribute("instituts", institutsConPoblacionSuperiorA)
                return "instituts" // Plantilla para mostrar la lista de institutos
            }
        }

* Controlador para Poblacio: **PoblacioMvcController**

        package org.example.springjpa.controller

        import org.example.springjpa.repository.PoblacioRepository
        import org.springframework.stereotype.Controller
        import org.springframework.ui.Model
        import org.springframework.web.bind.annotation.*


        @Controller
        @RequestMapping("/poblacions")
        class PoblacioController(private val poblacioRepository: PoblacioRepository) {

            // Muestra todas las poblaciones
            @GetMapping
            fun listarTodasPoblacions(model: Model): String {
                val poblacions = poblacioRepository.findAll()
                model.addAttribute("poblacions", poblacions)
                return "poblacions" // Vista Thymeleaf para mostrar todas las poblaciones
            }

            // Muestra las poblaciones por comarca
            @GetMapping("/por-comarca")
            fun listarPoblacionsPorComarca(@RequestParam comarca: String, model: Model): String {
                val poblacions = poblacioRepository.findByComarcaNomC(comarca)
                model.addAttribute("poblacions", poblacions)
                return "poblacions" // Vista Thymeleaf para mostrar las poblaciones por comarca
            }

            @GetMapping("/por-provincia")
            fun listarPoblacionsPorProvincia(@RequestParam provincia: String, model: Model): String {
                val poblacions = poblacioRepository.findByComarcaProvincia(provincia)
                model.addAttribute("poblacions", poblacions)
                return "poblacions" // Vista Thymeleaf para mostrar las poblaciones por comarca
            }
        }



* Vista **instituts.html**

        <!DOCTYPE html>
        <html xmlns:th="http://www.thymeleaf.org">

        <head>
            <title>Instituts</title>
        </head>
        <body>
        <h1>Llista d'Instituts</h1>
        <table border="1">
            <tr>
                <th>Codi</th>
                <th>Nom</th>
                <th>Adreça</th>
                <th>Població</th>
                <th>Habitants</th>
                <th>Comarca</th>
                <th>Provincia</th>

            </tr>
            <tr th:each="institut : ${instituts}">
                <td th:text="${institut.codi}">Codi</td>
                <td th:text="${institut.nom}">Nom</td>
                <td th:text="${institut.adreca}">Adreça</td>
                <td th:text="${institut.poblacio?.nom}">Població</td>
                <td th:text="${institut.poblacio?.poblacio}">Habitants</td>
                <td th:text="${institut.poblacio?.comarca?.nomC}">Comarca</td>
                <td th:text="${institut.poblacio?.comarca?.provincia}">Provincia</td>



            </tr>
        </table>
        </body>
        </html>

* Vista **poblacions.html**


        <!DOCTYPE html>
        <html xmlns:th="http://www.thymeleaf.org">

        <head>
        <title>Poblacions</title>
        </head>
        <body>
        <h1>Llista de Poblacions per Comarca</h1>
        <table border="1">
        <tr>
            <th>Codi</th>
            <th>Nom</th>
            <th>Comarca</th>
            <th>Provincia</th>
        </tr>
        <tr th:each="poblacio : ${poblacions}">
            <td th:text="${poblacio.codM}">Codi</td>
            <td th:text="${poblacio.nom}">Nom</td>
            <td th:text="${poblacio.comarca?.nomC}">Comarca</td>
            <td th:text="${poblacio.comarca?.provincia}">Provincia</td>


        </tr>
        </table>
        </body>
        </html>

**Con esta configuración podemos listar los siguientes ejemplos**{.azul}:

* Todos los institutos: [http://localhost:8080/instituts](http://localhost:8080/instituts)
* Todas las poblaciones: [http://localhost:8080/poblacions](http://localhost:8080/poblacions)
* Todas las comarcas: [http://localhost:8080/comarcas](http://localhost:8080/comarcas)
* Listar institutos de una población: [http://localhost:8080/instituts/por-poblacio?poblacio=Gandia](http://localhost:8080/instituts/por-poblacio?poblacio=Gandia)
* Listar institutos de una comarca: [http://localhost:8080/instituts/por-comarca?comarca=Safor](http://localhost:8080/instituts/por-comarca?comarca=Safor)
* Listar institutos de una provincia: [http://localhost:8080/instituts/por-provincia?provincia=Alacant](http://localhost:8080/instituts/por-provincia?provincia=Alacant)
* Listar comarcas de una provincia: [http://localhost:8080/comarcas/buscar?provincia=Alacant](http://localhost:8080/comarcas/buscar?provincia=Alacant)
* Listar poblaciones de una comarca [http://localhost:8080/poblacions/por-comarca?comarca=Safor](http://localhost:8080/poblacions/por-comarca?comarca=Safor)
* Listar poblaciones de una provincia: [http://localhost:8080/poblacions/por-provincia?provincia=Alacant](http://localhost:8080/poblacions/por-provincia?provincia=Alacant)
* Listar institutos con población superior a un valor: [http://localhost:8080/instituts/poblacion-superior?poblacio=20000](http://localhost:8080/instituts/poblacion-superior?poblacio=20000)

![](img/listar_instituts.png)


**Transformación del ejemplo utilizando DTO**{.azul}

- Las entidades NO cambian
- Los repositorios NO cambian
- Se añaden DTO + Service
- Los Controller pasan DTO a la vista

En este ejemplo mostraremos los resultados en JSON y por tanto utilizaremos los controladores REST.

👉**Nuevo paquete dto**


    package org.example.springjpa.dto

    data class ComarcaDTO(
        val nomC: String,
        val provincia: String?
    )

    package org.example.springjpa.dto


    data class PoblacioDTO(
        val codM: Int,
        val nom: String,
        val poblacio: Int?,
        val comarcaNom: String
    )


    package org.example.springjpa.dto

    data class InstitutDTO(
        val codi: String,
        val nom: String?,
        val adreca: String?,
        val poblacioNom: String,
        val comarcaNom: String,
        val provincia: String
    )


👉**Nuevo paquete PoblacioService**

    package org.example.springjpa.service

    import org.example.springjpa.dto.PoblacioDTO
    import org.example.springjpa.repository.PoblacioRepository
    import org.springframework.stereotype.Service
        import org.springframework.transaction.annotation.Transactional


    @Service
        @Transactional(readOnly = true)
    class PoblacioService(
        private val poblacioRepository: PoblacioRepository
    ) {

        fun obtenerPoblacionesPorComarca(nomC: String): List<PoblacioDTO> =
            poblacioRepository.findByComarcaNomC(nomC).map {
                PoblacioDTO(
                    codM = it.codM,
                    nom = it.nom,
                    poblacio = it.poblacio,
                    comarcaNom = it.comarca?.nomC ?: ""
                )
            }
    }

👉**Nuevo paquete InstitutService**

        package org.example.springjpa.service

        import org.example.springjpa.dto.InstitutDTO
        import org.example.springjpa.repository.InstitutRepository
        import org.springframework.stereotype.Service
        import org.springframework.transaction.annotation.Transactional

        @Service
        @Transactional(readOnly = true)
        class InstitutService(
            private val institutRepository: InstitutRepository
        ) {

            fun obtenerInstitutosPorProvincia(provincia: String): List<InstitutDTO> =
                institutRepository.findByPoblacioComarcaProvincia(provincia)
                    .map {
                        InstitutDTO(
                            codi = it.codi,
                            nom = it.nom,
                            adreca = it.adreca,
                            poblacioNom = it.poblacio?.nom ?: "",
                            comarcaNom = it.poblacio?.comarca?.nomC ?: "",
                            provincia = it.poblacio?.comarca?.provincia ?: ""
                        )
                    }
        }


👉**Nuevo Paquete InstitutRestcontroller**

    package org.example.springjpa.controller

    import org.example.springjpa.service.InstitutService
    import org.example.springjpa.dto.InstitutDTO
    import org.springframework.web.bind.annotation.*

    @RestController
    @RequestMapping("/api/instituts")
    class InstitutRestController(
        private val institutService: InstitutService
    ) {

        @GetMapping("/provincia")
        fun obtenirPerProvincia(
            @RequestParam provincia: String
        ): List<InstitutDTO> =
            institutService.obtenerInstitutosPorProvincia(provincia)
    }

👉**Nuevo Paquete PoblacioRestcontroller**

        package org.example.springjpa.controller

        import org.example.springjpa.dto.PoblacioDTO
        import org.example.springjpa.service.PoblacioService
        import org.springframework.web.bind.annotation.*

        @RestController
        @RequestMapping("/api/poblacions")
        class PoblacioRestController(
            private val poblacioService: PoblacioService
        ) {

            // Obtener poblaciones de una comarca
            @GetMapping("/comarca")
            fun obtenirPerComarca(
                @RequestParam nomC: String
            ): List<PoblacioDTO> =
                poblacioService.obtenerPoblacionesPorComarca(nomC)


        }


* Listar las poblaciones de la Comarca del Ports: [http://localhost:8080/api/poblacions/comarca?nomC=Ports](http://localhost:8080/api/poblacions/comarca?nomC=Ports)
* Ampliación: añade un endpoint `/api/poblacions/provincia` que reutilice `findByComarcaProvincia`; no está implementado en el controlador REST anterior.




## Integración y comprobación

Cada bloque corresponde a un archivo de su paquete. Conserva una sola definición de `Comarca`, `Poblacio` e `Institut`: sustituye las entidades anteriores. Las claves de `comarca` e `institut` son `String`; la de `poblacio` se representa con `Int`. Los campos numéricos del esquema se convierten al tipo Kotlin correspondiente.

Compara las consultas con las del T5. Comprueba un filtro con resultados y otro sin coincidencias. Los controladores MVC muestran plantillas; los REST devuelven DTO. Mantén accesible la sesión al convertir relaciones a DTO: anota las operaciones de lectura del servicio con `@Transactional(readOnly = true)` e importa `org.springframework.transaction.annotation.Transactional`.
