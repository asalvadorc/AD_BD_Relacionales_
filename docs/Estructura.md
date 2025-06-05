# Estructura de un ejemplo completo CRUD con Postgres y SQLite

Para estructurar un ejemplo completo de CRUD en Kotlin con PostgreSQL y SQLite, sigue estos pasos clave, adaptando las configuraciones según el gestor de bases de datos elegido. El ejemplo incluye conexión JDBC, operaciones básicas y buenas prácticas:



**Estructura Recomendada del Proyecto**

    /src/main/kotlin/
    ├── model/
    │   └── Producto.kt
    ├── database/
    │   └── Database.kt
    ├── dao/
    │   └── ProductoDao.kt
    └── Main.kt


## Ejemplo con Postgres

**1- Configuración de Dependencias (Gradle)**{.azul}


        // build.gradle.kts (para PostgreSQL)
        dependencies {
            implementation("org.postgresql:postgresql:42.6.0")
        }

**2- Modelo de Datos (Clase POJO)**{.azul}

        data class Producto(
            val id: Int? = null,
            val nombre: String,
            val precio: Double,
            val stock: Int
        )


**3- Clase de Conexión a la Base de Datos**{.azul}

        import java.sql.DriverManager

        object Database {
            
            private const val URL =  "jdbc:postgresql://localhost:5432/tienda"
            private const val USER = "root"
            private const val PASSWORD = ""

            fun getConnection() = DriverManager.getConnection(URL, USER, PASSWORD)
        }


**4- Operaciones CRUD**{.azul}

  **Create (INSERT)**

    fun crearProducto(producto: Producto) {
        Database.getConnection().use { conn ->
            val sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)"
            conn.prepareStatement(sql).apply {
                setString(1, producto.nombre)
                setDouble(2, producto.precio)
                setInt(3, producto.stock)
                executeUpdate()
            }
        }
    }


  **Read (SELECT)**

        fun obtenerProductos(): List<Producto> {
            return Database.getConnection().use { conn ->
                val sql = "SELECT * FROM productos"
                val stmt = conn.createStatement()
                val rs = stmt.executeQuery(sql)
                
                mutableListOf<Producto>().apply {
                    while (rs.next()) {
                        add(Producto(
                            id = rs.getInt("id"),
                            nombre = rs.getString("nombre"),
                            precio = rs.getDouble("precio"),
                            stock = rs.getInt("stock")
                        ))
                    }
                }
            }
        }


  **Update (UPDATE)**

        fun actualizarProducto(id: Int, producto: Producto) {
            Database.getConnection().use { conn ->
                val sql = """
                    UPDATE productos 
                    SET nombre = ?, precio = ?, stock = ? 
                    WHERE id = ?
                """.trimIndent()
                
                conn.prepareStatement(sql).apply {
                    setString(1, producto.nombre)
                    setDouble(2, producto.precio)
                    setInt(3, producto.stock)
                    setInt(4, id)
                    executeUpdate()
                }
            }
        }


  **Delete (DELETE)**

        fun eliminarProducto(id: Int) {
            Database.getConnection().use { conn ->
                val sql = "DELETE FROM productos WHERE id = ?"
                conn.prepareStatement(sql).apply {
                    setInt(1, id)
                    executeUpdate()
                }
            }
        }

**5- Aplicación**{.azul}


        fun main() {
            // Crear producto
            crearProducto(Producto(nombre = "Laptop", precio = 1200.0, stock = 10))

            // Obtener todos los productos
            val productos = obtenerProductos()
            productos.forEach { println(it) }

            // Actualizar producto (ID 1)
            actualizarProducto(1, Producto(nombre = "Laptop Pro", precio = 1500.0, stock = 5))

            // Eliminar producto (ID 1)
            eliminarProducto(1)
        }



## Ejemplo con SQLite

- No hay usuario ni contraseña en SQLite por defecto.
- La base de datos es un solo archivo fácil de copiar o mover.
- SQLite es ideal para aplicaciones locales, móviles o de bajo tráfico.

Si la conexión es a una BD SQlite los cambios serían los siguientes:

**1- Dependencias y Driver**{.azul}

Dependencia del driver en **build.gradle.kts**:

        dependencies {
            implementation("org.xerial:sqlite-jdbc:3.44.1.0") // Driver JDBC para SQLite
        }


**2- URL de conexión**{.azul}

        object Database {
            private const val URL = "jdbc:sqlite:mi_base_de_datos.db"
            fun getConnection() = DriverManager.getConnection(URL)
        }



**3- Tipos de datos y creación de tabla**{.azul}
   
SQLite es más flexible con los tipos de datos que Postgres, pero sigue siendo buena práctica definir tipos claros.
Al crear la tabla, puedes usar:


        fun crearTabla() {
            Database.getConnection().use { conn ->
                conn.createStatement().executeUpdate("""
                    CREATE TABLE IF NOT EXISTS productos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nombre TEXT NOT NULL,
                        precio REAL NOT NULL,
                        stock INTEGER NOT NULL
                    )
                """)
            }
        }



- AUTOINCREMENT es específico de SQLite.
- TEXT, REAL y INTEGER son los tipos básicos de SQLite.


!!!Note ""
    Las operaciones **CRUD** en Kotlin no cambian significativamente, solo asegúrate de que las consultas SQL usen la sintaxis de SQLite (por ejemplo, AUTOINCREMENT en vez de SERIAL o AUTO_INCREMENT).



