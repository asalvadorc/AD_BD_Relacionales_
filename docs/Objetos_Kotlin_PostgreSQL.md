## Data Class

Las **data class** que representan las tablas de la base de datos `geo` se incluyen en el fichero Kotlin **`Ejemplo_DataClass.kt`**, dentro del paquete `Postgres`. En este fichero agrupamos las clases `Comarca`, `Poblacio` e `Institut`, que utilizaremos en los ejemplos para trabajar con los datos de las tablas `comarca`, `poblacio` e `institut`.

Cada fila recuperada desde JDBC se transforma en un objeto Kotlin con nombre y tipos bien definidos. Esto hace que el código sea más legible y facilita operaciones habituales como recorrer resultados, filtrarlos, agruparlos o relacionarlos entre sí.

**Ejemplo_DataClass.kt**

```kotlin
    package Postgres

    data class Comarca(
        val nomComarca: String,
        val provincia: String?
    )

    data class Poblacio(
        val codMunicipi: Int,
        val nom: String,
        val poblacio: Int?,
        val extensio: Double?,
        val altura: Int?,
        val longitud: String?,
        val latitud: String?,
        val llengua: String?,
        val nomComarca: String?
    )

    data class Institut(
        val codi: String,
        val nom: String?,
        val adreca: String?,
        val numero: String?,
        val codpostal: Int?,
        val codMunicipi: Int?
    )

```

**Ejemplo_dataclass_geo.kt**

```kotlin
    package Postgres

    fun main() {
        val comarques = mutableListOf<Comarca>()
        val poblacions = mutableListOf<Poblacio>()
        val instituts = mutableListOf<Institut>()

        DatabaseLocal.getConnection().use { conn ->

            conn.prepareStatement("SELECT nom_c, provincia FROM comarca ORDER BY nom_c").use { stmt ->
                stmt.executeQuery().use { rs ->
                    while (rs.next()) {
                        comarques.add( // (1)!
                            Comarca( // (2)!
                                nomComarca = rs.getString("nom_c"), // (3)!
                                provincia = rs.getString("provincia")
                            )
                        )
                    }
                }
            }

            conn.prepareStatement("SELECT * FROM poblacio ORDER BY nom").use { stmt ->
                stmt.executeQuery().use { rs ->
                    while (rs.next()) {
                        poblacions.add(
                            Poblacio(
                                codMunicipi = rs.getInt("cod_m"),
                                nom = rs.getString("nom"),
                                poblacio = rs.getInt("poblacio").takeIf { !rs.wasNull() }, // (4)!
                                extensio = rs.getDouble("extensio").takeIf { !rs.wasNull() },
                                altura = rs.getInt("altura").takeIf { !rs.wasNull() },
                                longitud = rs.getString("longitud"),
                                latitud = rs.getString("latitud"),
                                llengua = rs.getString("llengua"),
                                nomComarca = rs.getString("nom_c")
                            )
                        )
                    }
                }
            }

            conn.prepareStatement("SELECT * FROM institut ORDER BY nom").use { stmt ->
                stmt.executeQuery().use { rs ->
                    while (rs.next()) {
                        instituts.add(
                            Institut(
                                codi = rs.getString("codi"),
                                nom = rs.getString("nom"),
                                adreca = rs.getString("adreca"),
                                numero = rs.getString("numero"),
                                codpostal = rs.getInt("codpostal").takeIf { !rs.wasNull() },
                                codMunicipi = rs.getInt("cod_m").takeIf { !rs.wasNull() }
                            )
                        )
                    }
                }
            }
        }

        println("Comarcas cargadas: ${comarques.size}")
        println("Poblaciones cargadas: ${poblacions.size}")
        println("Institutos cargados: ${instituts.size}")

        println("\nPrimeras comarcas:")
        comarques.take(3).forEach { println(it) }

        println("\nPrimeras poblaciones:")
        poblacions.take(3).forEach { println(it) }

        println("\nPrimeros institutos:")
        instituts.take(3).forEach { println(it) }
    }

```

1. Cada fila recuperada se incorpora a una colección tipada en lugar de conservar el `ResultSet`.
2. La fila actual se transforma en una instancia de la `data class` correspondiente.
3. El nombre de la columna SQL se relaciona explícitamente con la propiedad Kotlin.
4. `wasNull()` permite distinguir un `NULL` SQL del valor numérico `0` devuelto inicialmente por JDBC.

En este ejemplo se aprecia mejor la utilidad de las **data class**:

- Cada tabla de la base de datos queda representada por una clase propia.
- Los resultados de cada consulta se almacenan en listas tipadas (`List<Comarca>`, `List<Poblacio>` y `List<Institut>`).
- El código gana claridad porque cada campo se recupera con un significado explícito.
- Después es mucho más fácil relacionar datos entre tablas, por ejemplo, asociar un instituto con su población o una población con su comarca.

### Data class en operaciones `INSERT`, `UPDATE` y `DELETE`

Las **data class** no solo resultan útiles al recuperar datos con `SELECT`. También permiten agrupar en un único objeto la información que queremos insertar o modificar en la base de datos.

En el caso de la tabla `institut`, podemos trabajar con objetos `Institut` para enviar los datos a JDBC de una forma más clara y ordenada.

**Ejemplo_dataclass_crud.kt**

```kotlin
    package Postgres

    fun insertarInstitut(institut: Institut) {
        val sql = """
            INSERT INTO institut (codi, nom, adreca, numero, codpostal, cod_m)
            VALUES (?, ?, ?, ?, ?, ?)
        """.trimIndent()

        DatabaseLocal.getConnection().use { conn -> // (1)!
            conn.prepareStatement(sql).use { stmt ->
                stmt.setString(1, institut.codi) // (2)!
                stmt.setString(2, institut.nom)
                stmt.setString(3, institut.adreca)
                stmt.setString(4, institut.numero)
                stmt.setObject(5, institut.codpostal) // (3)!
                stmt.setObject(6, institut.codMunicipi)
                stmt.executeUpdate()
            }
        }
    }

    fun actualizarInstitut(institut: Institut) {
        val sql = """
            UPDATE institut
            SET nom = ?, adreca = ?, numero = ?, codpostal = ?, cod_m = ?
            WHERE codi = ?
        """.trimIndent()

        DatabaseLocal.getConnection().use { conn ->
            conn.prepareStatement(sql).use { stmt ->
                stmt.setString(1, institut.nom)
                stmt.setString(2, institut.adreca)
                stmt.setString(3, institut.numero)
                stmt.setObject(4, institut.codpostal)
                stmt.setObject(5, institut.codMunicipi)
                stmt.setString(6, institut.codi)
                stmt.executeUpdate()
            }
        }
    }

    fun eliminarInstitut(codi: String) {
        val sql = "DELETE FROM institut WHERE codi = ?"

        DatabaseLocal.getConnection().use { conn ->
            conn.prepareStatement(sql).use { stmt ->
                stmt.setString(1, codi)
                stmt.executeUpdate()
            }
        }
    }

    fun main() {
        val institutNou = Institut(
            codi = "00000001",
            nom = "IES EXEMPLE",
            adreca = "AV. JAUME I",
            numero = "12",
            codpostal = 12001,
            codMunicipi = 12040
        )

        insertarInstitut(institutNou)

        val institutActualitzat = institutNou.copy( // (4)!
            nom = "IES EXEMPLE ACTUALITZAT",
            numero = "14"
        )

        actualizarInstitut(institutActualitzat)
        eliminarInstitut(institutActualitzat.codi)
    }

```

1. La función abre su propia conexión y la libera al finalizar la operación.
2. Las propiedades del objeto alimentan los parámetros del `PreparedStatement`.
3. `setObject` permite enviar `null` a PostgreSQL cuando una propiedad nullable no tiene valor.
4. `copy()` crea otra instancia conservando los datos originales salvo las propiedades indicadas.

En este segundo ejemplo, la **data class** actúa como contenedor de datos del instituto:

- En `insertarInstitut()`, el objeto aporta todos los valores necesarios para crear un nuevo registro.
- En `actualizarInstitut()`, reutilizamos el mismo modelo para modificar un registro existente.
- En `eliminarInstitut()`, basta con pasar la clave primaria porque solo necesitamos identificar la fila.

Este enfoque resulta útil porque separa mejor los datos de la lógica SQL y hace que el código sea más fácil de reutilizar y mantener.


## Resumen

JDBC mantiene las mismas operaciones básicas al cambiar de motor. Cambian el driver, la URL, las credenciales y algunos detalles del SQL. Reutiliza `DatabaseLocal` y comprueba los nombres y tipos del esquema `geo`.

Continúa con [funciones y procedimientos almacenados](Procedimientos.md).
