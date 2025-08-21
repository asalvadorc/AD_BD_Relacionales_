# RA 2 – Desarrolla aplicaciones que gestionan información almacenada en bases de datos relacionales identificando y utilizando mecanismos de conexión.

| Criterio de Evaluación | Contenido Relacionado                                                                 |
|------------------------|----------------------------------------------------------------------------------------|
| a) Ventajas e inconvenientes de utilizar conectores                      | - Conectores JDBC<br>- Bibliotecas ORM (Hibernate, JPA)<br>- Comparativa: rendimiento, facilidad, portabilidad |
| b) Gestores de bases de datos embebidos e independientes                | - SQLite (embebido)<br>- PostgreSQL, MySQL (independientes)<br>- Casos de uso y configuración |
| c) Uso del conector idóneo en la aplicación                             | - Selección de driver JDBC adecuado<br>- Configuración del archivo `pom.xml` o `build.gradle` |
| d) Establecimiento de la conexión                                       | - Clases `DriverManager`, `Connection`<br>- Manejo de excepciones SQL<br>- Pruebas de conexión |
| e) Definición de la estructura de la base de datos                      | - Modelado lógico y físico<br>- Esquemas y tablas<br>- Tipos de datos y restricciones |
| f) Aplicaciones que modifican el contenido de la base de datos          | - Operaciones CRUD: `INSERT`, `UPDATE`, `DELETE`<br>- Preparación de sentencias (`PreparedStatement`) |
| g) Definición de objetos para almacenar resultados                      | - Objetos DTO/POJO<br>- `ResultSet` y mapeo de resultados a objetos Kotlin/Java |
| h) Aplicaciones que efectúan consultas                                  | - Consultas `SELECT` simples y complejas<br>- Filtros, ordenaciones y uniones (`JOIN`) |
| i) Eliminación de objetos tras su uso                                   | - Cierre de conexiones, sentencias y resultados<br>- Uso de `try-with-resources` o `use {}` en Kotlin |
| j) Gestión de transacciones                                             | - Comandos `commit`, `rollback`<br>- Control manual y automático de transacciones |
| k) Ejecución de procedimientos almacenados                              | - Llamadas a procedimientos con `CallableStatement`<br>- Parámetros de entrada y salida |

**Contenidos**{.azul}

1-  Introducción a las bases de datos relacionales
¿Qué es una BDR?

- Estructura: tablas, claves primarias y foráneas
- Lenguaje SQL
- Casos de uso reales
- ¿Qué es un conector (driver)?
- Tipos de gestores: embebidos vs. independientes
- Requisitos para establecer una conexión

📌 Criterios: a), b), c), d)

2-  Herramientas y conectores

- Cómo añadir conectores 
- Ejemplos: PostgreSQL, SQLite
- Primer programa que establece conexión

📌 Criterios: c), d)

3-  Operaciones sobre la BD

- Inserción (INSERT)
- Actualización (UPDATE)
- Borrado (DELETE)
- Consultas con SELECT
- Sentencias preparadas (PreparedStatement)
- Ejemplos: PostgreSQL, SQLite

📌 Criterios: f), g), h), i)


4-  Transacciones y control de errores

- ¿Qué es una transacción?
- commit, rollback
- Manejo de excepciones

📌 Criterios: j)

5-  Procedimientos y Funciones 

- ¿Qué son y cuándo se usan?
- Sintaxis básica en PostgreSQL
- Acceso desde código con CallableStatement

📌 Criterios: k)



