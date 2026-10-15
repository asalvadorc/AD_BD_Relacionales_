# Consultas con Spring Data JPA

Las consultas a la Base de datos las podemos hacer de dos maneras, utilizando la **convención de nombres** en funciones de Spring Data JPA o con la anotación **@Query**.

✔️ La **convención de nombres** se utiliza:

* En consultas sencillas y que no requieren lógica compleja ni múltiples combinaciones.
* Cuando quieres mantener un código más limpio y directo.

✔️ La anotación **@Query** se utiliza:

* En consultas complejas que involucren múltiples tablas, condiciones avanzadas o subconsultas.
* Si prefieres optimizar manualmente las consultas.
* Cuando la convención de nombres generaría un nombre de método excesivamente largo.


**Convención de Nombres**{.azul}

Spring Data JPA permite definir métodos en repositorios siguiendo una convención de nombres específica. Esto simplifica la escritura de consultas comunes sin necesidad de usar JPQL o SQL. Para ello analiza el nombre de los métodos en el repositorio e interpreta su significado para generar consultas automáticamente.

La estructura básica es:

        findBy + NombreDeCampo + Condición

1) **findBy**:

Indica que se busca una entidad en la base de datos.
Alternativas:

* readBy (lectura de datos)
* queryBy (consulta de datos)
* getBy (obtener datos)

2) **NombreDeCampo**:

* Debe coincidir exactamente con el nombre del atributo en la entidad.
* Se puede incluir navegación de atributos para relaciones (EntidadRelacionada.Atributo).

3) **Condición** (opcional):

* Permite añadir operadores lógicos como And, Or, etc.
* Ejemplo: findByNombreAndEdad.


**Ejemplos de métodos según la convención**{.azul}

* Consultas simples

    * Método: findByNombre(String nombre)
    * Consulta generada:

            SELECT * FROM entidad WHERE nombre = ?

* Consultas con condiciones

    * Método: findByNombreAndEdad(String nombre, Integer edad)
    * Consulta generada:

            SELECT * FROM entidad WHERE nombre = ? AND edad = ?

* Consultas con orden

    * Método: findByNombreOrderByEdadDesc(String nombre)
    * Consulta generada:

            SELECT * FROM entidad WHERE nombre = ? ORDER BY edad DESC

* Consultas con relaciones. Si hay una relación entre entidades, se puede navegar por los campos relacionados:

    * Método: findByComarcaNomC(String nomC)
    * Consulta generada:

             SELECT * FROM entidad e JOIN comarca c ON e.comarca_id = c.id WHERE c.nomC = ?

**Palabras clave en la convención**

![](img/convenciones.png)

!!!warning "A tener en cuenta"
    * **Coincidencia exacta del nombre del campo**: Los nombres deben coincidir con los atributos definidos en la entidad.
    * **Relaciones**: Usa la notación _EntidadRelacionada.Atributo_ para navegar entre tablas relacionadas.
    * **Orden**: Los métodos pueden incluir palabras clave de ordenación, como _OrderBy_.
    * **Parámetros**: Los métodos generados reciben parámetros en el mismo orden en que se declaran en el nombre del método.


🔹**@Query**{.azul}

<u>Estructura básica:</u>

    @Query("SELECT e FROM EntityName e WHERE e.property = :value")
    fun findByProperty(@Param("value") value: String): List<EntityName>

* Se utilizan nombres de entidades y propiedades de las clases en lugar de nombres de tablas y columnas.
* Se puede navegar por relaciones entre entidades.
* _:nombreParametro_ para parámetros dinámicos.

<u>Ejemplo sencillo:</u>

    @Query("SELECT c FROM Comarca c WHERE c.provincia = :provincia")
    fun findByProvincia(@Param("provincia") provincia: String): List<Comarca>

<u>Ejemplo con relaciones:</u>

Siguiendo con nuestro ejemplo de geo, la consulta para buscar Institutos en una Provincia por Población Mínima quedaría así:


    @Query("""
        SELECT i FROM Institut i
        JOIN i.poblacio p
        JOIN p.comarca c
        WHERE c.provincia = :provincia AND p.poblacio >= :minPoblacion
    """)
    fun findByProvinciaAndPoblacion(
        @Param("provincia") provincia: String,
        @Param("minPoblacion") minPoblacion: Int
    ): List<Institut>


**Este mismo ejemplo utilizando convención de nombres quedaría así:**{.verde}

    @Repository
    interface InstitutRepository : JpaRepository<Institut, String> {
        fun findByPoblacioComarcaProvinciaAndPoblacioPoblacioGreaterThanEqual(
            provincia: String,
            minPoblacion: Int
        ): List<Institut>
    }



* **findBy**: Indica que es un método de consulta.
* **PoblacioComarcaProvincia**: Navega por las relaciones de las entidades Institut  Poblacio -> Comarca para filtrar por la provincia.
* **AndPoblacioPoblacioGreaterThanEqual**: Navega por Institut -> Poblacio y aplica el filtro de población mínima.

!!!note "Conclusión"
    A medida que las relaciones aumentan en complejidad, los nombres de los métodos pueden volverse difíciles de leer y mantener.




Los ejemplos con relaciones se aplican después de definir las entidades en [Relaciones de geo](relaciones.md). Los SQL mostrados son orientativos; los métodos derivados se basan en los nombres de las propiedades Kotlin. [Referencia de consultas JPA](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html).
