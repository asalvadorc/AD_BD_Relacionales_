# Crear y actualizar las tablas desde Spring

En `src/main/resources/application.properties` elegimos cómo se prepara la estructura de datos al arrancar. Podemos reutilizar tablas, generarlas desde entidades o ejecutar scripts SQL.

## Qué podemos hacer con la base de datos

Distinguimos **la base de datos PostgreSQL** (por ejemplo, `geo`) de **las tablas que contiene** (`comarca`, `poblacio`, `institut`…). Las opciones siguientes permiten preparar esas tablas; **no crean automáticamente la base PostgreSQL indicada en la conexión**.

Podemos encontrarnos con estas situaciones:

1. **La base y las tablas ya existen:** utilizarlas sin modificar su estructura. Es nuestro caso con `geo` (`ddl-auto=none`).
2. **Queremos comprobar las tablas existentes:** verificar su compatibilidad con las entidades sin cambiarlas (`validate`).
3. **La base existe, pero está vacía:** generar las tablas desde las entidades o crearlas con `schema.sql`.
4. **Cambiamos las entidades durante el desarrollo:** intentar adaptar las tablas, por ejemplo añadiendo columnas (`update`).
5. **Queremos empezar de nuevo en una práctica:** borrar y recrear las tablas, perdiendo sus datos anteriores (`create`).
6. **Necesitamos una estructura temporal de pruebas:** recrear las tablas al arrancar y eliminarlas al cerrar normalmente (`create-drop`).
7. **Queremos datos iniciales:** ejecutar `data.sql` cuando las tablas estén preparadas.

Si **la base PostgreSQL todavía no existe**, primero debemos crearla, por ejemplo desde DBeaver. Después elegiremos cómo preparar sus tablas. Por tanto, **no es obligatorio generar las tablas desde Spring**: podemos conservar las que ya tenemos o gestionar su creación desde la aplicación.

## Proiedades de application.properties con BD

Cada línea tiene la forma **`propiedad=valor`**. No necesitamos activar todas las opciones: elegimos los valores según cómo queramos preparar la base.

<div class="tabla-propiedades-spring" markdown="1">

| Propiedad | Para qué sirve | Cuándo utilizarla |
|---|---|---|
| `spring.datasource.url` | Indica el servidor, el puerto y la base a la que nos conectamos. | Para seleccionar `geo` o una base de pruebas. No crea la base indicada. |
| `spring.datasource.username` | Indica el usuario de PostgreSQL. | Para conectar con los permisos de ese usuario. Crear tablas requiere permisos adicionales a los de consultar datos. |
| `spring.datasource.password` | Indica la contraseña del usuario. | Para autenticar la conexión cuando PostgreSQL la requiere. |
| `spring.jpa.hibernate.ddl-auto` | Decide si Hibernate comprueba, crea o modifica la estructura a partir de las entidades. | Para elegir entre reutilizar tablas (`none`), comprobarlas (`validate`) o generarlas y adaptarlas (`create`, `create-drop`, `update`). |
| `spring.jpa.show-sql` | Muestra en la consola el SQL ejecutado por Hibernate. | Con `true`, para observar las consultas y entender qué hace JPA durante las prácticas. No crea tablas por sí misma. |
| `spring.jpa.properties.hibernate.format_sql` | Presenta el SQL de Hibernate con saltos de línea y sangrías. | Con `true`, para facilitar la lectura del SQL mostrado. Es una ayuda de formato. |
| `spring.sql.init.mode` | Controla la ejecución automática de `schema.sql` y `data.sql`. | Usa `always` para ejecutar los scripts también en PostgreSQL; `never` para desactivarlos; `embedded` para limitarlos a bases embebidas. |
| `spring.jpa.defer-datasource-initialization` | Decide si los scripts SQL esperan a que JPA termine de inicializarse. | Con `true`, cuando Hibernate crea las tablas y después `data.sql` inserta datos. Por defecto es `false`: los scripts se ejecutan antes de inicializar JPA. |

</div>

**Las dos opciones que controlan la preparación son distintas:** `ddl-auto` actúa mediante Hibernate y las entidades; `spring.sql.init.mode` actúa mediante archivos SQL. Desactivar una no desactiva la otra. La propiedad `defer-datasource-initialization` solo cambia el orden: no activa los scripts por sí misma.

Por ejemplo, para trabajar con las tablas existentes de clase y observar las consultas:

```properties
# Conexión
spring.datasource.url=jdbc:postgresql://localhost:5432/geo
spring.datasource.username=postgres
spring.datasource.password=postgres

# Conservar la estructura y no ejecutar scripts de inicialización
spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=never

# Mostrar el SQL con un formato legible
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

En esta configuración no hace falta añadir `defer-datasource-initialization`, porque hemos desactivado los scripts. A continuación veremos las alternativas de creación y cuándo elegirlas.

## Antes de crear las tablas: preparar la conexión

**En PostgreSQL, la base indicada en la URL debe existir antes de conectar.** Hibernate puede generar sus tablas, pero `ddl-auto` no ejecuta `CREATE DATABASE`. Para una práctica nueva, crea primero una base vacía desde DBeaver, por ejemplo `spring_pruebas`, y configura la conexión:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/spring_pruebas
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Adapta las credenciales a tu instalación. Los ejemplos de creación de esta página se realizan sobre **esa base de pruebas**, separada de `geo`.

## Generar tablas con Hibernate: ddl-auto

Hibernate utiliza las entidades y sus anotaciones (`@Entity`, `@Id`, `@Column`, `@ManyToOne`…) para determinar la estructura. La propiedad que controla su actuación es:

```properties
spring.jpa.hibernate.ddl-auto=none
```

| Valor | Al arrancar | Al cerrar la aplicación | Uso habitual |
|---|---|---|---|
| `none` | No genera ni comprueba el esquema. | No modifica las tablas. | Trabajar con tablas existentes, como `geo`. |
| `validate` | Comprueba la compatibilidad de las entidades con las tablas y los tipos; si detecta una incompatibilidad, falla el arranque. | No modifica las tablas. | Detectar diferencias sin alterar la estructura. |
| `update` | Intenta adaptar la estructura a las entidades, por ejemplo añadiendo tablas o columnas. | No elimina las tablas al cerrar. | Prototipos y desarrollo. |
| `create` | Elimina y vuelve a crear la estructura gestionada por Hibernate. **Se pierden los datos anteriores de esas tablas.** | Conserva las tablas creadas. | Reiniciar una base de pruebas al arrancar. |
| `create-drop` | Recrea la estructura, como `create`. | Elimina esa estructura al cerrarse normalmente. | Pruebas temporales. |

`validate` no sustituye las validaciones de los datos del cliente. `update` tampoco es una migración completa: no debe utilizarse como garantía de conservación o transformación de datos al renombrar propiedades o realizar cambios complejos.

Referencia: [acciones de generación del esquema en Hibernate](https://docs.hibernate.org/orm/7.2/javadocs/org/hibernate/tool/schema/Action.html).

### Ejemplo: partir de una entidad nueva

En un proyecto de pruebas, esta entidad permite describir una tabla sencilla:

```kotlin
@Entity
@Table(name = "libro")
class Libro(
    @Id
    var id: Long = 0,

    @Column(length = 80, nullable = false)
    var titulo: String = ""
)
```

Con los imports de `jakarta.persistence`, los plugins JPA de Kotlin configurados y la entidad dentro de los paquetes que escanea Spring, Hibernate puede generar la tabla `libro`:

```properties
# Solo sobre spring_pruebas: recrea las tablas al arrancar.
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
```

Comprueba en DBeaver la tabla y sus columnas. Si guardas libros y reinicias con `create`, desaparecerán. `show-sql` permite observar las sentencias; no decide si se crean tablas.

## Crear tablas y cargar datos con SQL

Otra opción es escribir `schema.sql` (estructura) y `data.sql` (datos iniciales) en `src/main/resources`. Para ejecutarlos sobre PostgreSQL:

```properties
spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=always
```

`spring.sql.init.mode` acepta `always` (ejecutar también en PostgreSQL), `never` (desactivar) y `embedded` (solo bases embebidas; opción predeterminada). Los scripts se ejecutan al arrancar, no solo la primera vez: deben admitir la repetición o desactivarse después.

Por ejemplo, `schema.sql` podría contener:

```sql
CREATE TABLE IF NOT EXISTS libro (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(80) NOT NULL
);
```

Y `data.sql`, una inserción repetible en PostgreSQL:

```sql
INSERT INTO libro (id, titulo)
VALUES (1, 'Introduccion a Spring')
ON CONFLICT (id) DO NOTHING;
```

### Hibernate crea las tablas y data.sql las rellena

Para una demostración también podemos generar la estructura con Hibernate y cargar los datos después:

```properties
# Base de pruebas; no utilizar con geo.
spring.jpa.hibernate.ddl-auto=create
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

En esta variante conserva **solo `data.sql`**. La última propiedad retrasa los scripts hasta después de la inicialización de JPA; normalmente se ejecutan antes. Así evitamos insertar sobre una tabla que aún no existe.

En aplicaciones que evolucionan se utilizan herramientas como **Flyway o Liquibase** para versionar los cambios mediante migraciones, en lugar de confiar en `update`. No se requieren en este tema.

Referencia: [inicialización de bases de datos en Spring Boot](https://docs.spring.io/spring-boot/how-to/data-initialization.html).

## Qué utilizamos en este tema

Como `geo` ya tiene su estructura y sus datos, mantenemos:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/geo
spring.jpa.hibernate.ddl-auto=none
spring.sql.init.mode=never
```

**`none` no impide crear, modificar o eliminar registros** mediante los repositorios; controla la generación de la estructura. `never` desactiva la ejecución automática de `schema.sql` y `data.sql`.

Si elegimos `validate` para revisar los mapeos, Hibernate puede detectar diferencias entre los tipos Kotlin y el esquema existente. Debemos resolverlas; esa opción no corrige las tablas automáticamente.
