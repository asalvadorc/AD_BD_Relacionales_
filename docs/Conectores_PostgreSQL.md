# Conexión a PostgreSQL desde Kotlin {#conexion-postgresql}

Después de los ejemplos de SQLite, veremos cómo conectarnos a PostgreSQL. Antes de ejecutar este ejemplo, completa la [preparación de PostgreSQL y la BD geo](Docker_instrucciones.md) y comprueba que el contenedor está en funcionamiento.

Utilizaremos el paquete `Postgres` del proyecto `BDRelacionales`. A diferencia de SQLite, la conexión necesita la dirección del servidor, el puerto, el nombre de la base de datos y las credenciales.

**Configuración de Dependencias (Gradle)**{.azul}

Lo primero será incluir las dependencias necesarias en **build.gradle.kts**

```kotlin
        // build.gradle.kts (para PostgreSQL)
        dependencies {
            implementation("org.postgresql:postgresql:42.7.1") // (1)!
        }


```

1. Esta dependencia incorpora al proyecto el controlador JDBC específico de PostgreSQL.

### Objeto de conexión reutilizable

Crea `Postgres/DatabaseLocal.kt`. Este objeto será reutilizado por los ejemplos de operaciones, funciones y procedimientos almacenados.

**Ejemplo_conexion_Postgres_local.kt**

```kotlin
        package Postgres
        import java.sql.DriverManager
        object DatabaseLocal {

            private const val URL =  "jdbc:postgresql://localhost:5432/geo" // (1)!
            private const val USER = "postgres"
            private const val PASSWORD = "postgres"

            fun getConnection() = DriverManager.getConnection(URL, USER, PASSWORD) // (2)!
        }


```

1. La URL PostgreSQL incluye el servidor, el puerto y el nombre de la base de datos `geo`.
2. PostgreSQL requiere abrir la conexión con URL, usuario y contraseña.

### Comprobación de la conexión

```kotlin
package Postgres

fun main() {
    DatabaseLocal.getConnection().use { conn ->
        println("Conexión establecida correctamente con PostgreSQL: ${conn.catalog}")
    }
}
```


!!! question "1. ¿Qué cambia en la conexión al pasar de SQLite a PostgreSQL?"
    ??? success "Ver respuesta"
        Cambian el **driver JDBC** y la **URL de conexión**. Con SQLite, la URL indica la ruta del fichero y normalmente no necesitamos usuario ni contraseña. Con PostgreSQL, indica el servidor, el puerto y la base de datos, por ejemplo `jdbc:postgresql://localhost:5432/geo`, y en nuestro entorno también proporcionamos usuario y contraseña. Además, el servidor PostgreSQL debe estar en funcionamiento. En ambos casos utilizamos `DriverManager.getConnection()` para obtener un objeto `Connection`.

Cada llamada a `getConnection()` abre una conexión nueva; `use` la cierra al terminar. Continúa con las [operaciones CRUD con PostgreSQL](PostgreSQL.md).
