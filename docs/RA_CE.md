---
hide:
  - toc
---
# Resultados de Aprendizaje y Criterios de Evaluación.

El T5 y su continuación en el T6 trabajan dos resultados de aprendizaje relacionados entre sí:

- **RA 2**, centrado en el acceso a bases de datos relacionales mediante conectores y en la consulta y modificación de la información almacenada.
- **RA 6**, centrado en la creación de componentes de acceso a datos y en su integración en aplicaciones.

El **T5. BD relacionales** desarrolla el acceso mediante JDBC. El **T6. Spring Boot con BD relacionales** conecta ambos resultados mediante un proyecto: permite organizar el acceso a los datos en componentes y ofrecer sus operaciones mediante una API web. El acceso mediante JDBC se complementa con el uso de Spring Data JPA para trabajar con mapeo objeto-relacional.

## RA 2. Desarrolla aplicaciones que gestionan información almacenada en bases de datos relacionales identificando y utilizando mecanismos de conexión.

**Criterios de evaluación del RA 2**

| Letra | Criterio de evaluación | Tema | Contenido didáctico |
|:---:|---|---|---|
| a) | Se han valorado las ventajas e inconvenientes de utilizar conectores. | Introducción y conectores | JDBC y comparación con las herramientas ORM: rendimiento, facilidad de uso y portabilidad. |
| b) | Se han utilizado gestores de bases de datos embebidos e independientes. | Introducción y preparación del entorno | SQLite como gestor embebido y PostgreSQL como gestor independiente. Configuración con Docker y DBeaver. |
| c) | Se ha utilizado el conector idóneo en la aplicación. | Herramientas y conectores | Selección del driver JDBC y configuración de dependencias en Gradle. |
| d) | Se ha establecido la conexión. | Herramientas y conectores | Uso de `DriverManager` y `Connection`. Comprobación de la conexión y gestión de excepciones SQL. |
| e) | Se ha definido la estructura de la base de datos. | Preparación de la BD y operaciones | Creación de tablas, tipos de datos, claves y restricciones. |
| f) | Se han desarrollado aplicaciones que modifican el contenido de la base de datos. | Operaciones sobre la BD | Inserción, actualización y borrado mediante sentencias parametrizadas con `PreparedStatement`. |
| g) | Se han definido los objetos destinados a almacenar el resultado de las consultas. | Operaciones sobre la BD | Recuperación de resultados con `ResultSet` y mapeo a objetos y `data class` de Kotlin. |
| h) | Se han desarrollado aplicaciones que efectúan consultas. | Operaciones sobre la BD | Consultas `SELECT`, filtros, ordenación y combinación de tablas. |
| i) | Se han eliminado los objetos una vez finalizada su función. | Conectores y operaciones | Cierre de conexiones, sentencias y resultados. Gestión segura de recursos con `use`. |
| j) | Se han gestionado las transacciones. | Transacciones y control de errores | Control de confirmación automática, `commit`, `rollback` y tratamiento de excepciones. |
| k) | Se han ejecutado procedimientos almacenados en la base de datos. | Funciones y procedimientos almacenados | Invocación desde Kotlin mediante JDBC y gestión de parámetros y resultados. |

## RA 6. Programa componentes de acceso a datos identificando las características que debe poseer un componente y utilizando herramientas de desarrollo

Este resultado de aprendizaje se desarrolla progresivamente a lo largo del módulo. El T5 proporciona la base de acceso mediante JDBC. La programación e integración de componentes y el mapeo objeto-relacional con Spring Data JPA se desarrollan en el [T6. Spring Boot con BD relacionales](T6_Spring_Boot/intro.md). La siguiente tabla recoge esa continuidad.

**Criterios de evaluación del RA 6**

| Letra | Criterio de evaluación | Tema | Contenido didáctico |
|:---:|---|---|---|
| a) | Se han valorado las ventajas e inconvenientes de utilizar programación orientada a componentes. | Spring y proyecto con BD relacionales | Separación entre controlador, servicio y acceso a datos. Reutilización, mantenimiento y dependencia entre componentes. |
| b) | Se han identificado herramientas de desarrollo de componentes. | Spring y proyecto con BD relacionales | Spring, Spring Boot, Spring MVC y Spring Data JPA. |
| d) | Se han programado componentes que gestionan mediante conectores información almacenada en bases de datos. | JDBC y componentes de acceso a datos | Encapsulación de conexiones, consultas, modificaciones y transacciones en componentes que utilizan JDBC. |
| e) | Se han programado componentes que gestionan información usando mapeo objeto relacional. | Spring Data JPA | Entidades, relaciones, repositorios y consultas para gestionar la persistencia en PostgreSQL. |
| h) | Se han probado y documentado los componentes desarrollados. | Proyecto con BD relacionales | Pruebas de las operaciones de acceso a datos y de la API con Postman. Documentación de configuración y uso. |
| i) | Se han integrado los componentes desarrollados en aplicaciones. | Proyecto con BD relacionales | Integración de controladores, servicios y componentes de persistencia en una aplicación web con Spring Boot. |

La selección del RA 6 corresponde a los criterios **a), b), d), e), h) e i)**. Los criterios de ficheros, bases de datos objeto-relacionales y orientadas a objetos, y bases de datos documentales se trabajan en sus bloques específicos.

Referencia de los resultados de aprendizaje y criterios: [Real Decreto 405/2023, módulo profesional Acceso a datos (0486)](https://www.boe.es/eli/es/rd/2023/05/29/405).
