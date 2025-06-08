# Procedimientos almacenados

En una base de datos relacional, además de tablas y consultas, podemos encontrar procedimientos almacenados (stored procedures), que son bloques de código SQL que se guardan y ejecutan directamente dentro del sistema gestor de base de datos (SGBD).

Un procedimiento almacenado (o función en PostgreSQL) es un bloque de código SQL que se guarda en la base de datos para su posterior reutilización. Funciona como un pequeño programa que encapsula lógica de negocio y operaciones complejas (consultas, validaciones, cálculos, actualizaciones, etc.), permitiendo ejecutarlas de forma sencilla mediante una llamada desde SQL o desde una aplicación cliente como Kotlin.

Se utilizan para:

- centralizar la lógica de negocio en la base de datos
- reducir el tráfico entre la aplicación y la base de datos
- mejorar el rendimiento y evitar duplicación de código
- facilitar el mantenimiento y la seguridad

Tanto las funciones (**FUNCTION**) como los procedimientos (**PROCEDURE**) permiten encapsular lógica SQL en el servidor de base de datos.
La diferencia principal es que:

- Las funciones devuelven valores
- Los procedimientos no devuelven nada directamente, pero pueden realizar operaciones como INSERT, UPDATE o controlar transacciones.

**Sintaxis básica**{.azul}

- **Función**:

        CREATE OR REPLACE FUNCTION nombre_funcion(parametros)
        RETURNS tipo
        AS $$
        BEGIN
            -- código SQL
            RETURN valor;
        END;
        $$ LANGUAGE plpgsql;

- **Procedimiento**:
 
        CREATE OR REPLACE PROCEDURE nombre_procedimiento(parametros)
        LANGUAGE plpgsql
        AS $$
        BEGIN
            -- acciones sin devolver datos
        END;
        $$;


Cuando trabajamos con PostgreSQL desde una aplicación Kotlin, es importante saber cómo llamar correctamente a cada tipo de lógica almacenada en la base de datos. Dependiendo de si usamos una función o un procedimiento, y del tipo de resultado que devuelve, la llamada con JDBC cambia ligeramente:


**Ejemplo 1: Función que devuelve un valor**{.azul}

- Se llama con: SELECT nombre_función(?)
- Se usa un PreparedStatement
- Se obtiene el resultado desde el ResultSet

**SQL**

    CREATE OR REPLACE FUNCTION obtener_email(id_cliente INT)
    RETURNS VARCHAR AS $$
    DECLARE
        resultado_email VARCHAR;
    BEGIN
        SELECT email INTO resultado_email FROM cliente WHERE id = id_cliente;
        RETURN resultado_email;
    END;
    $$ LANGUAGE plpgsql;

**Kotlin**

    val sql = "SELECT obtener_email(?)"
    val st = conexion.prepareStatement(sql)
    st.setInt(1, 1)
    val rs = st.executeQuery()

    if (rs.next()) {
        val email = rs.getString(1)
        println("Email: $email")
    }

**Ejemplo 2: Función que devuelve varias columnas (RETURNS TABLE)**{.azul}

- También se llama con: SELECT * FROM nombre_función(?)
- Se usa un PreparedStatement
- El ResultSet contiene varias columnas o filas

**SQL**

    CREATE OR REPLACE FUNCTION datos_cliente(id_cliente INT)
    RETURNS TABLE(nombre TEXT, email TEXT) AS $$
    BEGIN
        RETURN QUERY SELECT nombre, email FROM cliente WHERE id = id_cliente;
    END;
    $$ LANGUAGE plpgsql;


**Kotlin**

    val sql = "SELECT * FROM datos_cliente(?)"
    val st = conexion.prepareStatement(sql)
    st.setInt(1, 1)
    val rs = st.executeQuery()

    while (rs.next()) {
        val nombre = rs.getString("nombre")
        val email = rs.getString("email")
        println("Cliente: $nombre - $email")
    }

**Ejemplo 3: Procedimiento sin retorno (VOID)**{.azul}

- Se llama con: {call nombre_procedimiento(?, ?)}
- Se usa un CallableStatement
- No se espera un ResultSet, solo se ejecuta

**SQL**

    CREATE OR REPLACE PROCEDURE insertar_cliente(nombre TEXT, email TEXT)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT INTO cliente(nombre, email) VALUES (nombre, email);
    END;
    $$;

**Kotlin**

    val sql = "{call insertar_cliente(?, ?)}"
    val call = conexion.prepareCall(sql)
    call.setString(1, "Lucía")
    call.setString(2, "lucia@email.com")
    call.execute()
    println("Cliente insertado correctamente.")


!!!Note "En resumen"
    Tipo de lógica|	Llamada SQL en Kotlin|	Objeto JDBC|	Retorno esperado
    --------------|----------------------|-------------|--------------------
    FUNCTION (un valor)|	"SELECT funcion(?)"|	PreparedStatement|	1 valor
    FUNCTION (tabla)|	"SELECT * FROM funcion(?)"|	PreparedStatement|	Varias filas
    PROCEDURE (void)|	"{call procedimiento(?, ?)}"|	CallableStatement|	Ninguno
