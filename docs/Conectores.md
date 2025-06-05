# Conectores

Un **conector** es una librería software que permite que una aplicación se comunique con un gestor de base de datos (SGBD). Actúa como un puente entre nuestro código y la base de datos, traduciendo las instrucciones SQL a un lenguaje que el gestor puede entender y viceversa.


Para que una aplicación (escrita en Kotlin, Java u otro lenguaje) pueda leer, insertar o modificar información almacenada en una base de datos relacional (BDR), debe establecer una conexión con ella. Esto implica una serie de **pasos técnicos** y el uso de componentes específicos:

- Conectarse al gestor de base de datos (PostgreSQL, MySQL, SQLite…)
- Enviar consultas SQL (SELECT, INSERT, UPDATE, DELETE…)
- Recibir y procesar resultados (ResultSet, listas de objetos…)
- Cerrar correctamente los recursos utilizados



**Requisitos para conectarse al SGBD**{.azul}

Elemento|	Función principal|
--------|--------------------|
Conector (Driver)|	Permite a la aplicación hablar con el SGBD
URL de conexión|	Indica el tipo de base de datos, la dirección, el puerto y el nombre de la BD
Usuario y contraseña|	Identifican al cliente y controlan el acceso



    jdbc:<gestor>://<host>:<puerto>/<nombre_base_datos>



### Ejemplos de conexión a un SGBD

Gestor de Base de Datos|	URL de conexión
-----------------------|---------------------
PostgreSQL|	jdbc:postgresql://localhost:5432/empresa
MySQL|	jdbc:mysql://localhost:3306/empresa
SQLite|	jdbc:sqlite:empresa.db


Para que la conexión funcione, es necesario **añadir el conector** correspondiente al SGBD:   


- **En un proyecto Gradle**

        dependencies {
            implementation("org.postgresql:postgresql:42.7.1") //Postgres
            implementation("mysql:mysql-connector-java:8.3.0") //MySQL
            implementation("org.xerial:sqlite-jdbc:3.43.0.0") //SQLite
        }


- **En un proyecto Maven**

        <dependency>
            //Postgres
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.7.1</version>
        </dependency>

        <dependency>
            //MySQL
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.3.0</version>
        </dependency>

        <dependency>
            //SQLite
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.43.0.0</version>
        </dependency>




**Ejemplo de conexión a Postgresql**

        import java.sql.DriverManager

        
        fun main() {
            // Ruta al archivo de base de datos Postgres
            val url = "jdbc:postgresql://localhost:5432/empresa"
            val user = "postgres"
            val pass = "admin"

            // Conexión y prueba
            DriverManager.getConnection(url, user, pass).use { conn ->
                println("Conexión establecida correctamente.")
            }

            conn.close()
            
        }

**Ejemplo de conexión a SQLite**

        import java.sql.DriverManager

        fun main() {
            // Ruta al archivo de base de datos SQLite
            val url = "jdbc:sqlite:empresa.db"

            // Conexión y prueba
            DriverManager.getConnection(url).use { conn ->
                println("Conexión establecida correctamente con SQLite.")
            }

            conn.close()
        }

!!!Note "Recuerda"
    No se necesita usuario ni contraseña con SQLite, ya que es una base de datos local y embebida.      



**Ventajas e inconvenientes de los conectores**{.azul}

Ventajas|	Inconvenientes
--------|-----------------
Estándar y multiplataforma|	Requiere configurar dependencias
Permite acceso a múltiples SGBD| Gestión manual de errores y recursos
Uso directo de SQL|	Código más extenso en comparación con ORM


## Desde IntellJ