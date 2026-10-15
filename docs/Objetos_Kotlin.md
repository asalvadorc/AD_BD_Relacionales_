# Resultados como objetos Kotlin


## 🔹 Data class

Hasta ahora hemos trabajado con bases de datos relacionales utilizando JDBC, construyendo consultas SQL, procesando los resultados con ResultSet y mostrando la información directamente por consola o almacenándola en estructuras básicas como listas o mapas.

Sin embargo, cuando una aplicación crece, se vuelve más cómodo y legible representar cada tabla de la base de datos como una clase del programa, cuyos atributos correspondan a las columnas de esa tabla.
En **Kotlin**, esto se consigue de forma sencilla y elegante utilizando las **data classes**.

Una **data class** (o clase de datos) es una clase especial de Kotlin diseñada para almacenar y transportar información.
El compilador genera automáticamente métodos útiles como toString(), equals(), hashCode() y copy(), por lo que resulta ideal para representar filas (registros) de una tabla de base de datos.

Su sintaxis básica es:

```kotlin
data class NombreClase(val campo1: Tipo, val campo2: Tipo, ...)
```
!!! question "🤔 Comprueba tu comprensión"
    Si con una `data class` ya representamos los registros de una tabla como objetos, ¿qué diferencia hay entre utilizarla con JDBC y utilizar un ORM?

    ??? success "Ver respuesta"
        La diferencia está en **quién realiza la conversión entre las filas y los objetos y quién gestiona su persistencia**. Una `data class` almacena datos, pero no se conecta a la base de datos ni ejecuta SQL. Con JDBC, escribimos las sentencias y construimos manualmente cada objeto a partir del `ResultSet`.

        Un **ORM**, como Hibernate, utiliza un mapeo entre clases y tablas para generar muchas de las sentencias SQL y convertir los resultados en objetos automáticamente. También permite guardar y modificar los datos de las entidades mediante operaciones de persistencia.

        **En ambos casos trabajamos con objetos, pero una `data class` representa los datos; un ORM gestiona su persistencia.** Por eso, utilizar `data class` con JDBC no significa estar utilizando un ORM.

🧩 **Ejemplo: representación de clientes de `Tienda.sqlite`**

Utilizaremos la tabla **`client`**, que ya existe en `Tienda.sqlite`. Para este ejemplo seleccionaremos tres de sus columnas; no es necesario representar todos los campos de una tabla en cada consulta.

| Columna en `client` | Propiedad Kotlin | Tipo Kotlin |
|---|---|---|
| `cod_cli` | `codigo` | `Int` |
| `nom` | `nombre` | `String?` |
| `poblacio` | `poblacion` | `String?` |

`nombre` y `poblacion` admiten `null` porque las columnas correspondientes permiten valores nulos en la base de datos.

Podemos definir la siguiente clase en el paquete `SQLite`:

```kotlin
package SQLite

data class Cliente(
    val codigo: Int,
    val nombre: String?,
    val poblacion: String?
)
```

A continuación, consultamos los clientes utilizando el objeto `DatabaseTienda` definido en el apartado de [conexión desde Kotlin](Conectores.md#desde-kotlin). Guarda este ejemplo en otro fichero del mismo paquete:

**Ejemplo_DataClass.kt**: Este fragmento muestra todos los clientes de la tabla client

```kotlin
package SQLite

fun main() {
    val clientes = mutableListOf<Cliente>()
    val sql = "SELECT cod_cli, nom, poblacio FROM client ORDER BY cod_cli" // (1)!

    DatabaseTienda.getConnection().use { conn -> // (2)!
        conn.prepareStatement(sql).use { stmt -> // (3)!
            stmt.executeQuery().use { rs -> // (4)!
                while (rs.next()) { // (5)!
                    val cliente = Cliente( // (6)!
                        codigo = rs.getInt("cod_cli"),
                        nombre = rs.getString("nom"),
                        poblacion = rs.getString("poblacio")
                    )
                    clientes.add(cliente)
                }
            }
        }
    }
    clientes.forEach { cliente ->
    clientes.forEach { cliente ->
    }
}
```
```

1. La consulta selecciona las columnas necesarias y ordena los clientes por código.
2. Se obtiene una conexión reutilizando el objeto común `DatabaseTienda`; `use` la cierra al terminar el bloque.
3. `prepareStatement` prepara la sentencia SQL antes de ejecutarla y `use` cierra el `PreparedStatement`.
4. La consulta devuelve un `ResultSet`, que también se cierra con `use`.
5. `next()` avanza a la siguiente fila y devuelve `false` cuando ya no quedan resultados.
6. Cada fila del `ResultSet` se convierte manualmente en un objeto `Cliente`. Los campos `nombre` y `poblacion` pueden ser `null`.
7. Los objetos permanecen disponibles después de cerrar los recursos JDBC. Se muestran los clientes y el operador `?:` sustituye los valores `null` por un texto legible.

En este ejemplo:

- Cada fila del `ResultSet` se convierte manualmente en un objeto `Cliente`.
- Las columnas `cod_cli`, `nom` y `poblacio` se asignan a las propiedades `codigo`, `nombre` y `poblacion`; los nombres no tienen que coincidir.
- Los objetos se guardan en una lista `MutableList<Cliente>` que podemos recorrer y procesar después de cerrar los recursos JDBC con `use`.
- Cambiar un objeto de la lista no modifica automáticamente la base de datos: para guardar cambios necesitamos ejecutar una sentencia SQL.
