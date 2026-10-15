# Guía de estudio

El **T5. BD relacionales** enseña a acceder a datos desde Kotlin mediante **JDBC**: primero con SQLite y después con PostgreSQL. Sigue el orden del menú lateral.

## Recorrido recomendado

| Orden | Apartado | Qué aprenderás |
|---|---|---|
| 1 | [Entorno y ubicación de los ejemplos](Entorno.md) | Preparar el proyecto, los paquetes y la base SQLite. |
| 2 | [Introducción](Introduccion.md) | Repasar gestores relacionales y distinguir conectores y ORM. |
| 3 | [Conexión con JDBC](Conectores.md) | Configurar el driver y abrir conexiones desde Kotlin. |
| 4 | [Sentencias y resultados](Sentencias.md) | Elegir sentencias, utilizar parámetros y recuperar resultados. |
| 5 | [Operaciones con SQLite](Operaciones.md) | Consultar, insertar, modificar y eliminar registros. |
| 6 | [Resultados como objetos Kotlin](Objetos_Kotlin.md) | Transformar filas en `data class` y listas tipadas. |
| 7 | [Gestión de recursos](Recursos.md) | Cerrar conexiones, sentencias y resultados. |
| 8 | [Transacciones y control de errores](Transacciones.md) | Confirmar o revertir operaciones relacionadas. |
| 9 | [Preparación de PostgreSQL y geo](Docker_instrucciones.md) | Crear el entorno local y cargar los datos. |
| 10 | [Conexión y operaciones con PostgreSQL](PostgreSQL.md) | Reutilizar JDBC y representar los datos de geo con objetos. |
| 11 | [Funciones y procedimientos almacenados](Procedimientos.md) | Crear e invocar lógica almacenada desde Kotlin. |
| 12 | [Ejercicio obligatorio de PostgreSQL](Ejercicio_PostgreSQL.md) | Comprobar el acceso a geo y la ejecución de funciones y procedimientos. |

## Comprobaciones durante el recorrido

- **Antes del CRUD:** puedes abrir `Tienda.sqlite` desde Kotlin y ejecutar una consulta.
- **Antes del ejercicio SQLite:** sabes parametrizar las sentencias, mapear resultados, cerrar recursos y revertir una transacción.
- **Antes del código PostgreSQL:** las tablas `comarca`, `poblacio` e `institut` existen y contienen datos en DBeaver.
- **Antes de invocar una función o procedimiento:** lo has creado y comprobado en PostgreSQL.

## Evaluación y continuidad

Consulta los [resultados de aprendizaje y criterios de evaluación](RA_CE.md). El ejercicio SQLite y la práctica PostgreSQL recogen evidencias del trabajo con JDBC del RA2.

## T6. Spring Boot con BD relacionales

El T6 continúa el trabajo de Spring con ficheros y utiliza la base `geo` del T5. Se desarrolla en un proyecto Spring independiente del proyecto de consola JDBC.

| Orden | Apartado | Objetivo |
|---|---|---|
| 1 | [Introducción](T6_Spring_Boot/intro.md) y [entorno](T6_Spring_Boot/entorno.md) | Conectar Spring Boot a PostgreSQL. |
| 2 | [Anotaciones](T6_Spring_Boot/anotaciones.md) y [primera aplicación](T6_Spring_Boot/primera_aplicacion.md) | Mapear comarcas y consultar mediante un repositorio. |
| 3 | [Consultas](T6_Spring_Boot/consultas.md) y [vistas](T6_Spring_Boot/vistas.md) | Filtrar datos y mostrarlos en JSON y HTML. |
| 4 | [CRUD](T6_Spring_Boot/crud.md) | Gestionar comarcas con formularios. |
| 5 | [Servicios y DTO](T6_Spring_Boot/dto.md) | Separar responsabilidades y datos de respuesta. |
| 6 | [Relaciones de geo](T6_Spring_Boot/relaciones.md) | Integrar poblaciones e institutos. |
| 7 | [Resumen](T6_Spring_Boot/resumen.md) y [proyecto](T6_Spring_Boot/ejercicios.md) | Probar y documentar una aplicación completa. |
