# Anotaciones JPA

Las **anotaciones** son marcas que comienzan por `@` y añaden información a las clases, propiedades o métodos. En Spring ya hemos utilizado algunas, como `@RestController` y `@Service`, para indicar la función de cada componente. Al trabajar con bases de datos, las anotaciones JPA permiten definir **cómo se relacionan los objetos de Kotlin con las tablas y columnas**: qué clase representa una entidad, qué propiedad es su clave primaria y cómo se establecen las relaciones entre entidades.

Por ejemplo, podemos asociar la clase `Comarca` con la tabla `comarca` mediante `@Entity` y `@Table`, y señalar que su propiedad `nomC` corresponde a la clave primaria `nom_c` mediante `@Id` y `@Column`. Hibernate interpreta este mapeo para realizar las operaciones de persistencia, evitando que tengamos que convertir manualmente cada fila en un objeto como hacíamos con JDBC.

La siguiente tabla reúne las principales anotaciones de **JPA**, junto con otras de **Spring Data JPA y Spring** que utilizaremos para definir consultas, repositorios y transacciones. No es necesario memorizarlas todas: iremos aplicándolas en los ejemplos del tema.

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
| **Spring Data JPA** | `@Repository` | Identifica componentes de persistencia; en interfaces JpaRepository suele ser opcional |
|  | `@Query` | Define una consulta personalizada (JPQL o SQL) |
|  | `@Param` | Parámetros nombrados en consultas |
|  | `@Modifying` | Consultas de actualización o borrado |
|  | `@EnableJpaRepositories` | Habilita repositorios JPA |
|  | `@EntityGraph` | Controla la carga de relaciones |
| **Transacciones** | `@Transactional` | Ejecuta métodos dentro de una transacción |
|  | `@Rollback` | Fuerza la reversión de la transacción (tests) |



**Ejemplos**{.azul}

- **@Entity** - Marca una clase como una entidad JPA, mapeada a una tabla en la base de datos.

        @Entity
        class User(
            @Id
            val id: Long,
            val name: String
        )


- **@Table** - Especifica el nombre de la tabla que corresponde a la entidad.

        @Entity
        @Table(name = "users")
        class User(
            @Id
            val id: Long,
            val name: String
        )


- **@Id** - Indica que un campo es la clave primaria de la tabla.

        @Id
        val id: Long


- **@GeneratedValue** - Define cómo se genera el valor de la clave primaria.

  >Estrategias comunes: `GenerationType.IDENTITY`, `GenerationType.SEQUENCE`, etc.

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long


- **@Column** - Configura una columna de la tabla, como nombre, si es nula o única.

            @Column(name = "user_name", nullable = false, unique = true)
            val name: String



- **@ManyToOne**, **@OneToMany**, **@OneToOne**, **@ManyToMany**

  >Define relaciones entre entidades.

            @ManyToOne
            val department: Department


- **@JoinColumn** - Especifica la columna que actúa como clave foránea.

            @ManyToOne
            @JoinColumn(name = "department_id")
            val department: Department



- **@Lob** - Indica que un campo es un objeto grande (texto o binario).

            @Lob
            val description: String


- **@Transient**  - Excluye un campo del mapeo de base de datos (no se almacena).

            @Transient
            val calculatedField: String


---

- **@Repository** - Marca una interfaz o clase como repositorio Spring.

El _data class_ representa la entidad (tabla), mientras que el @Repository se encarga de las operaciones de acceso a datos sobre esa entidad.

        @Repository
        interface UserRepository : JpaRepository<User, Long>


- **@Query** - Define una consulta personalizada usando JPQL o SQL nativo.

>>- Ejemplo (JPQL):

        @Query("SELECT u FROM User u WHERE u.name = :name")
        fun findByName(@Param("name") name: String): List<User>

>>- Ejemplo (SQL nativo):

        @Query(value = "SELECT * FROM users WHERE user_name = :name", nativeQuery = true)
        fun findByNameNative(@Param("name") name: String): List<User>


**@Param** - Define parámetros nombrados para consultas con `@Query`.

        @Query("SELECT u FROM User u WHERE u.name = :name")
        fun findByName(@Param("name") name: String): List<User>


**@Modifying** - Se utiliza con consultas `@Query` para operaciones de actualización o eliminación.

        @Modifying
        @Query("UPDATE User u SET u.name = :name WHERE u.id = :id")
        fun updateName(@Param("id") id: Long, @Param("name") name: String)


**@EnableJpaRepositories** - Habilita la funcionalidad de Spring Data JPA y escanea paquetes para detectar repositorios.

        @EnableJpaRepositories(basePackages = ["com.example.repository"])


**@EntityGraph** - Especifica cómo cargar las relaciones en una consulta, evitando lazy loading.

        @EntityGraph(attributePaths = ["roles"])
        fun findByName(name: String): User


---

- **@Transactional** - Marca un método o clase para ejecutar dentro de una transacción.

        @Transactional
        fun updateUserDetails(user: User) { ... }


- **@Rollback** - Utilizada en pruebas para forzar la reversión de una transacción.

        @Transactional
        @Rollback
        fun testSaveUser() { ... }



Los ejemplos `User` ilustran las anotaciones: no se añaden al proyecto geo. El ejemplo completo de una entidad está en [Primera aplicación](primera_aplicacion.md).
