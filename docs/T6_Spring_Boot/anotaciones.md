# Anotaciones JPA

En el T4 ya vimos que **Spring utiliza anotaciones** para configurar la aplicación e indicar la función de sus componentes. Las anotaciones son marcas que comienzan por `@` y añaden información a las clases, propiedades o métodos. Spring interpreta las que le corresponden para gestionar los componentes y su comportamiento, reduciendo la configuración que debemos escribir manualmente.

Por ejemplo, `@SpringBootApplication` identifica la clase principal de configuración de una aplicación Spring Boot. Otras anotaciones que utilizaremos son `@RestController`, para definir controladores que atienden peticiones HTTP y devuelven datos, y `@Service`, para identificar clases que contienen la lógica de negocio.

Al trabajar con bases de datos utilizaremos también **anotaciones de JPA**, que no son exclusivas de Spring. Estas permiten definir **cómo se relacionan los objetos de Kotlin con las tablas y columnas**: qué clase representa una entidad, qué propiedad es su clave primaria y cómo se establecen las relaciones entre entidades.

Por ejemplo, podemos asociar la clase `Comarca` con la tabla `comarca` mediante `@Entity` y `@Table`, y señalar que su propiedad `nomC` corresponde a la clave primaria `nom_c` mediante `@Id` y `@Column`. Hibernate interpreta este mapeo para realizar las operaciones de persistencia, evitando que tengamos que convertir manualmente cada fila en un objeto como hacíamos con JDBC.

La siguiente tabla reúne las principales anotaciones de **JPA**, junto con otras de **Spring Data JPA y Spring**. Algunas se utilizarán en los ejemplos y otras quedan como referencia. No es necesario memorizarlas todas: iremos aplicándolas en los ejemplos del tema.

??? note "Consultar las anotaciones de JPA y Spring"

    | Categoría | Anotación | Descripción |
    |---------|----------|-------------|
    | **Mapeo JPA** | `@Entity` | Marca una clase como entidad JPA |
    |  | `@Table` | Especifica el nombre de la tabla |
    |  | `@Id` | Indica la clave primaria |
    |  | `@GeneratedValue` | Define cómo se genera la clave primaria |
    |  | `@Column` | Configura una columna |
    |  | `@JoinColumn` | Define la clave foránea |
    |  | `@Lob` | Campo de gran tamaño |
    |  | `@Transient` | Excluye un campo del mapeo |
    | **Relaciones JPA** | `@ManyToOne` | Relación muchos a uno |
    |  | `@OneToMany` | Relación uno a muchos |
    |  | `@OneToOne` | Relación uno a uno |
    |  | `@ManyToMany` | Relación muchos a muchos |
    | **Spring** | `@Repository` | Identifica componentes de persistencia; no es necesaria en las interfaces que extienden JpaRepository en este proyecto |
    | **Spring Data JPA** | `@Query` | Define una consulta personalizada (JPQL o SQL) |
    |  | `@Param` | Parámetros nombrados en consultas |
    |  | `@Modifying` | Consultas de actualización o borrado |
    |  | `@EnableJpaRepositories` | Habilita repositorios JPA |
    |  | `@EntityGraph` | Controla la carga de relaciones |
    | **Transacciones** | `@Transactional` | Ejecuta métodos dentro de una transacción |
    |  | `@Rollback` | Fuerza la reversión de la transacción (tests) |



## Anotaciones para empezar

En la primera aplicación utilizaremos estas cuatro. El fragmento es una referencia; crearemos el archivo completo en el siguiente apartado.

```kotlin
@Entity // (1)!
@Table(name = "comarca") // (2)!
class Comarca(
    @Id // (3)!
    @Column(name = "nom_c") // (4)!
    var nomC: String = "",

    @Column(name = "provincia")
    var provincia: String? = null
)
```

1. Declara que la clase es una entidad persistente.
2. Indica la tabla existente a la que corresponde.
3. Señala la propiedad que identifica de forma única cada comarca.
4. Relaciona una propiedad Kotlin con su columna SQL. Es especialmente importante cuando los nombres son distintos, como `nomC` y `nom_c`.

<!--

!!! note "No todas las claves se generan automáticamente"
    En `geo` los códigos y nombres que actúan como clave ya vienen dados. No añadiremos `@GeneratedValue` a estas entidades. Esa anotación corresponde a modelos cuya clave se genera automáticamente.

## Cuándo veremos las demás

| Necesidad | Anotaciones | Apartado |
|---|---|---|
| Escribir una consulta JPQL | `@Query`, `@Param` | [Consultas](consultas.md) |
| Separar la lógica de negocio | `@Service` | [Servicios y DTO](dto.md) |
| Agrupar operaciones de escritura | `@Transactional` | [Escritura desde la API](api_crud.md) |
| Representar una clave foránea | `@ManyToOne`, `@JoinColumn` | [Relaciones de geo](relaciones.md) |

No necesitas añadir todas las anotaciones de la tabla al proyecto. En particular, Spring Boot configura los repositorios del ejemplo sin que escribamos `@EnableJpaRepositories`.

??? note "Anotaciones de ampliación"
    - `@OneToMany`, `@OneToOne` y `@ManyToMany` representan otras relaciones. No son necesarias para las relaciones unidireccionales del proyecto.
    - `@EntityGraph` permite especificar qué relaciones se cargan en una consulta; no elimina de forma general los problemas de carga de datos.
    - `@Modifying` acompaña a consultas `@Query` de actualización o borrado y requiere un contexto transaccional adecuado. Aquí utilizaremos `save` y `delete`.
    - `@Rollback` se utiliza en pruebas transaccionales de Spring; no es la anotación que gestiona las transacciones ordinarias de nuestro servicio.

Estas ampliaciones no son requisitos del ejercicio final.

-->


