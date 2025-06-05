# Operaciones con la Base de Datos


En el desarrollo de aplicaciones con bases de datos relacionales, es fundamental saber cómo modificar y consultar información. Estas operaciones son el núcleo de la interacción entre la aplicación y la base de datos, y se realizan principalmente mediante instrucciones SQL y el uso de conectores como JDBC y, en el caso de Java/Kotlin, a través de objetos como **Statement** o, preferiblemente, **PreparedStatement**.


**¿Por qué usar PreparedStatement?**{.azul}

**1- Evita inyecciones SQL**

- La inyección SQL es una técnica maliciosa en la que un usuario introduce código SQL dentro de los campos de entrada (por ejemplo, un formulario), y este código se ejecuta porque el programa lo interpreta como parte de la consulta SQL:
  

        val nombre = "Lucía' OR '1'='1"
        val sql = "SELECT * FROM cliente WHERE nombre = '$nombre'"

        Este código generaría:
        SELECT * FROM cliente WHERE nombre = 'Lucía' OR '1'='1'

Devuelve todos los registros, aunque no exista "Lucía".

- Con PreparedStatement:

        val sql = "SELECT * FROM cliente WHERE nombre = ?"
        val st = conexion.prepareStatement(sql)
        st.setString(1, "Lucía' OR '1'='1")

La cadena "Lucía' OR '1'='1" se trata como texto literal, no como parte del SQL.
    No hay inyección, la consulta busca el nombre exacto "Lucía' OR '1'='1" (y no lo encuentra).


**2- Permite reutilizar la misma consulta**

Cuando usamos **PreparedStatement**, la consulta se precompila una sola vez, y luego se puede ejecutar muchas veces con diferentes valores sin recompilarla cada vez:

        val sql = "INSERT INTO cliente(nombre, email) VALUES (?, ?)"
        val st = conexion.prepareStatement(sql)

        st.setString(1, "Lucía")
        st.setString(2, "lucia@email.com")
        st.executeUpdate()

        st.setString(1, "Marcos")
        st.setString(2, "marcos@email.com")
        st.executeUpdate()

**Peticiones a la BD**{.azul}

Cuando una aplicación se conecta a una base de datos, necesita ejecutar sentencias SQL desde el código. En JDBC (Java/Kotlin), existen dos métodos principales para ello: **executeQuery()** y **executeUpdate()**.

Ambos permiten enviar instrucciones SQL al gestor de base de datos, pero se usan en situaciones diferentes:

Método|	Uso principal|	Tipo de sentencia SQL|	Resultado que devuelve
------|--------------|-----------------------|------------------------
executeQuery()|	Realizar consultas|	SELECT|	Objeto ResultSet con los datos consultados
executeUpdate()|Realizar modificaciones|	INSERT, UPDATE, DELETE, DDL (CREATE, DROP, etc.)|	Un entero con el número de filas afectadas

!!!Warning ""
    Utilizar estas instrucciones en un contexto diferente al mencionado, devolverá **SQLException** en su ejecución.

!!!Note "execute()"
    El método execute() en JDBC se utiliza principalmente en los siguientes casos:

      - Cuando no se sabe de antemano qué tipo de sentencia SQL se va a ejecutar o si la consulta puede ser tanto de consulta como de modificación de datos.
      - Para ejecutar sentencias SQL que pueden devolver varios resultados.
      - En situaciones donde se necesita una gestión flexible de la ejecución, ya que execute() devuelve un booleano:
        - true si el resultado es un ResultSet (SELECT).
        - false si el resultado es un entero (INSERT, UPDATE, DELETE,CREATE, ALTER)

## Modificaciones

Las operaciones más habituales para modificar los datos en una base de datos relacional son las conocidas como **CRUD**:

- **INSERT**: Permite añadir nuevos registros a una tabla.
- **UPDATE**: Permite modificar los valores de uno o varios registros existentes.
- **DELETE**: Permite eliminar registros de una tabla.


**Ejemplo de operación INSERT**

Este fragmento añade un nuevo cliente a la tabla clientes

    val sql = "INSERT INTO clientes (nombre, email) VALUES (?, ?)"
    val stmt = connection.prepareStatement(sql)
    stmt.setString(1, "Ana López")
    stmt.setString(2, "ana@email.com")
    stmt.executeUpdate()
    stmt.close()



**Ejemplo de operación UPDATE**

Este código actualiza el correo electrónico del cliente con id = 1

    val sql = "UPDATE clientes SET email = ? WHERE id = ?"
    val stmt = connection.prepareStatement(sql)
    stmt.setString(1, "nuevo@email.com")
    stmt.setInt(2, 1)
    stmt.executeUpdate()
    stmt.close()

**Ejemplo de operación DELETE**

Este fragmento elimina el cliente con id = 1

    val sql = "DELETE FROM clientes WHERE id = ?"
    val stmt = connection.prepareStatement(sql)
    stmt.setInt(1, 1)
    stmt.executeUpdate()
    stmt.close()

## Consultas    

Las consultas permiten recuperar información, desde consultas simples hasta consultas complejas con filtros, ordenaciones y uniones entre tablas.

**Ejemplo de consulta SELECT**

        val sql = "SELECT * FROM clientes WHERE nombre LIKE ?"
        val stmt = connection.prepareStatement(sql)
        stmt.setString(1, "%Ana%")
        val rs = stmt.executeQuery(sql)
        while (rs.next()) {
            // Procesar resultados
        }
        rs.close()
        stmt.close()

Aquí solo se recuperan los clientes cuyo nombre contiene la palabra "Ana"


### Consultas complejas: JOIN, filtros y ordenaciones

Aunque la consulta SQL es igual en cualquier lenguaje, aquí tienes un ejemplo de cómo podrías ejecutar una consulta con JOIN en Kotlin:

Este ejemplo obtiene los clientes y los productos que han pedido desde el 1 de enero de 2024, ordenados por nombre de cliente

        val sql = """
            SELECT c.nombre, p.producto
            FROM clientes c
            JOIN pedidos p ON c.id = p.cliente_id
            WHERE p.fecha > ?
            ORDER BY c.nombre
        """
        val stmt = connection.prepareStatement(sql)
        stmt.setString(1, "2024-01-01")
        val rs = stmt.executeQuery()
        while (rs.next()) {
            val nombre = rs.getString("nombre")
            val producto = rs.getString("producto")
            println("$nombre - $producto")
        }
        rs.close()
        stmt.close()

## Liberación de recursos

Cuando una aplicación accede a una base de datos, abre varios recursos internos que consumen memoria y conexiones activas en el sistema:

- La conexión con el servidor de base de datos (Connection)
- Las sentencias SQL preparadas (Statement o PreparedStatement)
- El resultado de la consulta (ResultSet)

Estos recursos no se liberan automáticamente cuando se termina su uso (especialmente en Java o Kotlin con JDBC). Si no se cierran correctamente, se pueden producir problemas como:

- Fugas de memoria
- Bloqueo de conexiones (demasiadas conexiones abiertas)
- Degradación del rendimiento
- Errores inesperados en la aplicación

En Kotlin, puedes usar **use {}** para cerrar recursos automáticamente al finalizar el bloque.

Si no utilizas **use {}** en Kotlin (o try-with-resources en Java), entonces debes cerrar manualmente cada uno de los recursos abiertos (ResultSet, Statement y Connection) usando .**close()**, y normalmente deberías hacerlo dentro de un bloque **finally** para garantizar su cierre incluso si ocurre un error. El orden correcto de cierre es del más interno al más externo.

**Ejemplo:**

        import java.sql.Connection
        import java.sql.DriverManager
        import java.sql.PreparedStatement
        import java.sql.ResultSet

        fun main() {
            val url = "jdbc:postgresql://localhost:5432/empresa"
            val user = "postgres"
            val pass = "admin"

            var conn: Connection? = null
            var st: PreparedStatement? = null
            var rs: ResultSet? = null

            try {
                conn = DriverManager.getConnection(url, user, pass)
                st = conn.prepareStatement("SELECT * FROM cliente")
                rs = st.executeQuery()

                while (rs.next()) {
                    val nombre = rs.getString("nombre")
                    println("Cliente: $nombre")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                // Cerrar en orden inverso al que se abrieron
                try { rs?.close() } catch (e: Exception) { e.printStackTrace() }
                try { st?.close() } catch (e: Exception) { e.printStackTrace() }
                try { conn?.close() } catch (e: Exception) { e.printStackTrace() }
            }
        }


**Actividad práctica propuesta**

Crear una tabla productos con campos id, nombre, precio.

Insertar varios productos desde Kotlin.

Consultarlos y mostrarlos.

Modificar el precio de uno.

Eliminar uno.

Al finalizar, cerrar todos los recursos correctamente.
