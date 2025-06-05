# RA 2 – Desarrollo de aplicaciones con bases de datos relacionales

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

## Contenidos 

🧩 1. Introducción a las bases de datos relacionales
¿Qué es una BDR?

- Estructura: tablas, claves primarias y foráneas
- Lenguaje SQL
- Casos de uso reales

🔌 2. ¿Cómo se accede a una base de datos relacional desde una aplicación?
Comunicación entre programa y SGBD

- ¿Qué es un conector (driver)?
- Tipos de gestores: embebidos vs. independientes
- Requisitos para establecer una conexión

📌 Criterios: a), b), c), d)

🧰 3. Herramientas y conectores

- Cómo añadir conectores (Maven / Gradle)
- Ejemplos: PostgreSQL, MySQL, SQLite
- Primer programa que establece conexión

📌 Criterios: c), d)

🔄 4. Modificación de datos

- Inserción (INSERT)
- Actualización (UPDATE)
- Borrado (DELETE)
- Sentencias preparadas (PreparedStatement)

📌 Criterios: f), i)

🔍 5. Consulta de datos

- Consultas con SELECT
- Filtrado (WHERE), ordenación (ORDER BY), joins (INNER JOIN, LEFT JOIN)
- Almacenamiento de resultados (ResultSet, DTOs)

📌 Criterios: g), h), i)

🛡️ 6. Transacciones y control de errores

- ¿Qué es una transacción?
- commit, rollback
- Ejemplo práctico: transferencia entre cuentas
- Manejo de excepciones

📌 Criterios: j)

⚙️ 7. Procedimientos almacenados

- ¿Qué son y cuándo se usan?
- Sintaxis básica en PostgreSQL/MySQL
- Acceso desde código con CallableStatement

📌 Criterios: k)

🔁 8. Formas de acceso a BDR: comparativa

- JDBC (acceso manual)
- ORM: Hibernate, JPA, Exposed
- JDBC Template y Spring Data JPA
- Cuadro comparativo + casos de uso

📌 Complemento a criterio a)


________

1- Introducción a las bases de datos relacionales
   
- Definición y características principales
- Importancia en el desarrollo de aplicaciones
- Modelo entidad-relación y normalización

2- Elección y configuración de conectores y gestores

- Ventajas e inconvenientes de conectores
- Conectores JDBC
- Bibliotecas ORM (Hibernate, JPA)
- Comparativa: rendimiento, facilidad, portabilidad
- Gestores de bases de datos embebidos e independientes
    - SQLite (embebido)
    - PostgreSQL, MySQL (independientes)
- Casos de uso y configuración
- Uso del conector idóneo en la aplicación
- Selección de driver JDBC adecuado
- Configuración del archivo pom.xml o build.gradle

3- Establecimiento y gestión de la conexión

- Clases DriverManager y Connection
- Manejo de excepciones SQL
- Pruebas de conexión

4-  Definición de la estructura de la base de datos

- Modelado lógico y físico
- Esquemas y tablas
- Tipos de datos y restricciones

5- Operaciones con la base de datos

- Aplicaciones que modifican el contenido de la base de datos
- Operaciones CRUD: INSERT, UPDATE, DELETE
- Preparación de sentencias (PreparedStatement)
- Aplicaciones que efectúan consultas
- Consultas SELECT simples y complejas
- Filtros, ordenaciones y uniones (JOIN)

6- Gestión de resultados y objetos

- Definición de objetos para almacenar resultados
- Objetos DTO/POJO
- ResultSet y mapeo de resultados a objetos Kotlin/Java

7- Gestión de recursos y transacciones

- Eliminación de objetos tras su uso
- Cierre de conexiones, sentencias y resultados
- Uso de try-with-resources o use {} en Kotlin
- Gestión de transacciones
- Comandos commit, rollback
- Control manual y automático de transacciones

8- Procedimientos almacenados

- Ejecución de procedimientos almacenados
- Llamadas a procedimientos con CallableStatement
- Parámetros de entrada y salida