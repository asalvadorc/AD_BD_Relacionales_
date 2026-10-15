## CRUD con SQLite

!!!Tip "Conexión"
    La conexión con la base de datos **`Tienda.sqlite`** ya se realizó en el apartado anterior, al explicar [cómo conectar un programa desde Kotlin utilizando JDBC](Conectores.md#desde-kotlin). En este apartado partimos de esa configuración y utilizaremos la misma base de datos para practicar las operaciones de consulta, inserción, modificación y eliminación de registros.

Las operaciones más habituales para modificar los datos en una base de datos relacional son las conocidas como **CRUD**:

- **CREATE**: Permite añadir nuevos registros a una tabla.
- **READ**: Permite consultar registros existentes.
- **UPDATE**: Permite modificar los valores de uno o varios registros existentes.
- **DELETE**: Permite eliminar registros de una tabla.

A continuación se presentan ejemplos en Kotlin de las operaciones **CRUD** sobre la base de datos `Tienda.sqlite` mediante **JDBC**. En cada ejemplo veremos cómo establecer la conexión, preparar la sentencia SQL, ejecutarla y, cuando corresponda, recoger sus resultados. Estos ejemplos sirven como punto de partida para practicar y adaptar las operaciones a otras tablas y datos.

**CREATE (INSERT)**{.verde} 

**Ejemplo_Insert.kt**: Este fragmento añade un nuevo articulo "00001" a la tabla articles

```kotlin
    package SQLite
    import java.sql.DriverManager

    fun main() {
        val dbPath = "src/main/resources/Tienda.sqlite"
        val dbFile = java.io.File(dbPath)
        val url = "jdbc:sqlite:${dbFile.absolutePath}"

        DriverManager.getConnection(url).use { conn ->

            val sql = "INSERT INTO article (cod_a, descrip) VALUES (?, ?)" // (1)!
            //conn.prepareStatement(sql)

            conn.prepareStatement(sql).use { stmt -> // (2)!

                stmt.setString(1, "00001") // (3)!
                stmt.setString(2, "articulo de prueba 1")
                stmt.executeUpdate() // (4)!               
            }
            println("Artículo añadido")
            }
    }
```

1. Los signos `?` reservan la posición de los valores y evitan concatenarlos directamente en el SQL.
2. `PreparedStatement` prepara la orden parametrizada y se cierra automáticamente con `use`.
3. Los parámetros empiezan en la posición 1 y deben asignarse en el mismo orden que los signos `?`.
4. `executeUpdate()` ejecuta `INSERT`, `UPDATE` o `DELETE` y devuelve el número de filas afectadas.

**UPDATE**{.verde}

**Ejemplo_Update.kt**: Este código actualiza la descripción del artículo "00001"

```kotlin
        package SQLite
        import java.sql.DriverManager

        fun main() {
            val dbPath = "src/main/resources/Tienda.sqlite"
            val dbFile = java.io.File(dbPath)
            val url = "jdbc:sqlite:${dbFile.absolutePath}"

            DriverManager.getConnection(url).use { conn ->

                val sql = "UPDATE article SET descrip = ? WHERE cod_a = ?" // (1)!

                conn.prepareStatement(sql).use { stmt ->
                    stmt.setString(1, "descripción nueva")
                    stmt.setString(2, "00001")
                    stmt.executeUpdate() // (2)!
                }
                println("Artículo actualizado")
            }
        }
```

1. El primer parámetro contiene el nuevo valor y el segundo identifica la fila mediante `WHERE`.
2. `executeUpdate()` devuelve cuántas filas se han actualizado.

**DELETE**{.verde}

**Ejemplo_Delete.kt**: Este fragmento elimina el articulo "00001"

```kotlin
       package SQLite
       import java.sql.DriverManager

        fun main() {
            val dbPath = "src/main/resources/Tienda.sqlite"
            val dbFile = java.io.File(dbPath)
            val url = "jdbc:sqlite:${dbFile.absolutePath}"

            DriverManager.getConnection(url).use { conn ->

                val sql = "DELETE FROM article WHERE cod_a = ?" // (1)!
                conn.prepareStatement(sql).use { stmt ->
                stmt.setString(1, "00001")
                stmt.executeUpdate() // (2)!
                }
                println("Artículo eliminado")
            }
        }
```

1. La condición `WHERE` limita el borrado al artículo indicado; omitirla eliminaría todas las filas.
2. El valor devuelto por `executeUpdate()` permite comprobar si realmente se eliminó algún registro.

**READ (SELECT)**{.verde}

**Ejemplo_select_basico.kt**: Consulta la tabla article.

```kotlin
        package SQLite
        import java.io.File
        import java.sql.DriverManager

        fun main() {

            val dbPath = "src/main/resources/Tienda.sqlite"
            val dbFile = File(dbPath)
            println("Ruta de la BD: ${dbFile.absolutePath}")

            val url = "jdbc:sqlite:${dbFile.absolutePath}"

            DriverManager.getConnection(url).use { conn ->

                val sql = "SELECT cod_a, descrip, preu, stock, stock_min FROM article" // (1)!

                conn.prepareStatement(sql).use { stmt ->

                    stmt.executeQuery().use { rs -> // (2)!

                        println("Artículos disponibles:")
                        println("Código\tDescripción\tPrecio\tStock\tStock Mínimo")

                        while (rs.next()) { // (3)!
                            val codA = rs.getString("cod_a") // (4)!
                            val descrip = rs.getString("descrip")
                            val preu = rs.getDouble("preu")
                            val stock = rs.getInt("stock")
                            val stockMin = rs.getInt("stock_min")

                            println("$codA\t$descrip\t$preu\t$stock\t$stockMin")
                        }

                    }
                }
            }
        }




```

1. En una consulta conviene indicar las columnas necesarias en lugar de utilizar `SELECT *`.
2. `executeQuery()` se utiliza cuando la sentencia devuelve filas y entrega un `ResultSet`.
3. El cursor comienza antes de la primera fila; cada llamada a `next()` lo hace avanzar.
4. Los valores se recuperan con el método compatible con el tipo SQL y el nombre de la columna.

**Ejemplo_join.kt**: Este ejemplo obtiene las líneas de factura con nombre del artículo y ordenado por numero de factura y línea.

```kotlin
        package SQLite
        import java.sql.DriverManager

        fun main() {
            val dbPath = "src/main/resources/Tienda.sqlite" // (1)!
            val dbFile = java.io.File(dbPath)
            val url = "jdbc:sqlite:${dbFile.absolutePath}" // (2)!

            DriverManager.getConnection(url).use { conn -> // (3)!

                val sql = """
                    SELECT lf.num_f, lf.num_l, lf.cod_a, a.descrip, lf.quant, lf.preu
                    FROM linia_fac lf
                    JOIN article a ON lf.cod_a = a.cod_a
                    ORDER BY lf.num_f, lf.num_l
                """.trimIndent() // (4)!

                conn.prepareStatement(sql).use { stmt -> // (5)!
                    stmt.executeQuery().use { rs -> // (6)!
                        println("Líneas de factura:")
                        println("Factura | Línea | Artículo | Descripción | Cantidad | Precio")

                        while (rs.next()) { // (7)!
                            val numF = rs.getInt("num_f")
                            val numL = rs.getInt("num_l")
                            val codA = rs.getString("cod_a")
                            val descrip = rs.getString("descrip")
                            val quant = rs.getInt("quant")
                            val preu = rs.getDouble("preu")

                            println("$numF\t$numL\t$codA\t$descrip\t$quant\t$preu")
                        }
                    }
                }
            }
        }



```

1. Se indica la ruta del archivo SQLite y se construye la URL JDBC con su ruta absoluta.
2. La URL identifica el controlador SQLite y el archivo de base de datos que se abrirá.
3. Se obtiene la conexión y `use` la cierra automáticamente al terminar el bloque.
4. La consulta une `linia_fac` con `article` mediante el código del artículo, selecciona los campos necesarios y ordena por factura y línea.
5. `prepareStatement` prepara la consulta SQL y `use` cierra el `PreparedStatement`.
6. `executeQuery()` ejecuta la consulta y devuelve un `ResultSet`, que también se cierra con `use`.
7. `rs.next()` avanza una fila cada vez; los valores de esa fila se leen con métodos compatibles con sus tipos y se muestran en pantalla.

Continúa con la [representación de resultados mediante objetos Kotlin](Objetos_Kotlin.md).
