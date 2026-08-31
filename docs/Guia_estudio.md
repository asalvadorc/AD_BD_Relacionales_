# 🗺️ Guía de estudio

Esta unidad explica cómo acceder desde Kotlin a bases de datos relacionales mediante **JDBC**. El aprendizaje comienza con **SQLite**, que permite practicar sin instalar un servidor, y continúa con **PostgreSQL**, ejecutado localmente mediante Docker.

Sigue los bloques en el orden propuesto. Cada uno reutiliza conceptos, conexiones y ejemplos del anterior.

## 🧭 Entornos utilizados

| Etapa | Base de datos | Proyecto Kotlin | Paquete | Ubicación o conexión |
|-------|---------------|-----------------|---------|----------------------|
| Primeros ejemplos | `Tienda.sqlite` | `BDRelacionales` | `SQLite` | `src/main/resources/Tienda.sqlite` |
| PostgreSQL | `geo` | `BDRelacionales` | `Postgres` | `jdbc:postgresql://localhost:5432/geo` |
| Ejercicio obligatorio | SQLite de temática libre | `BDRelacionales_Ejercicio` | A elección | `src/main/resources/tu_basededatos.sqlite` |

!!! warning "Antes de ejecutar los ejemplos"
    Comprueba siempre qué base de datos utiliza el apartado. Los ejemplos de SQLite y PostgreSQL pertenecen al mismo proyecto, pero utilizan **paquetes, controladores JDBC y conexiones diferentes**.

---

## Bloque 1 — Fundamentos de las bases de datos relacionales ⏱️ ~1 h

Comprenderás qué caracteriza a una base de datos relacional, qué tipos de gestores existen y qué diferencia hay entre un conector JDBC y un ORM.

| Orden | Página | Objetivo |
|-------|--------|----------|
| 1 | [Introducción](Introduccion.md) | Repasar SGBD relacionales, JDBC y ORM |
| 2 | [Resultados de aprendizaje y criterios de evaluación](RA_CE.md) | Conocer qué se evaluará durante la unidad |

---

## Bloque 2 — Herramientas y conexión JDBC ⏱️ ~2 h

Prepararás el proyecto `BDRelacionales`, incorporarás el controlador JDBC y comprobarás la conexión con `Tienda.sqlite` desde IntelliJ, DBeaver y Kotlin.

| Orden | Apartado | Objetivo |
|-------|----------|----------|
| 1 | [Conceptos de JDBC](Conectores.md#jdbc) | Identificar driver, URL y conexión |
| 2 | [Conexión desde IntelliJ](Conectores.md#desde-intellij) | Explorar la base desde el IDE |
| 3 | [Conexión desde DBeaver](Conectores.md#desde-dbeaver) | Consultar la base con una herramienta gráfica |
| 4 | [Conexión desde Kotlin](Conectores.md#desde-kotlin) | Abrir y reutilizar conexiones JDBC |

!!! tip "Comprobación antes de continuar"
    No pases al siguiente bloque hasta poder abrir `Tienda.sqlite` desde Kotlin y ejecutar una consulta sencilla sin errores de controlador ni de ruta.

---

## Bloque 3 — Operaciones CRUD con SQLite ⏱️ ~4 h

Aprenderás a consultar y modificar datos utilizando `Statement`, `PreparedStatement`, `ResultSet`, `executeQuery()` y `executeUpdate()`.

| Orden | Apartado | Objetivo |
|-------|----------|----------|
| 1 | [Peticiones y sentencias JDBC](Operaciones.md) | Elegir el objeto y el método de ejecución adecuados |
| 2 | [CRUD con SQLite](Operaciones.md#crud-con-sqlite) | Insertar, consultar, modificar y eliminar registros |
| 3 | [Liberación de recursos](Operaciones.md#liberacion-de-recursos) | Cerrar conexiones, sentencias y resultados de forma segura |

Ejecuta todos los ejemplos sobre una copia de `Tienda.sqlite`, de modo que puedas restaurar los datos si una operación de modificación no produce el resultado esperado.

---

## Bloque 4 — Transacciones y control de errores ⏱️ ~2 h

Combinarás varias operaciones como una única unidad de trabajo y utilizarás `commit()` y `rollback()` para conservar la integridad de los datos.

| Orden | Apartado | Objetivo |
|-------|----------|----------|
| 1 | [Transacciones](Transacciones.md#transacciones) | Comprender ACID y desactivar `autoCommit` |
| 2 | [Manejo de excepciones](Transacciones.md#manejo-de-excepciones) | Confirmar o revertir operaciones de forma segura |

---

## Bloque 5 — Preparación de PostgreSQL ⏱️ ~3 h

Crearás una instancia local de PostgreSQL con Docker, configurarás la conexión desde DBeaver y cargarás las tablas y datos de la base `geo`.

| Orden | Página | Objetivo |
|-------|--------|----------|
| 1 | [Preparación de PostgreSQL y la BD geo](Docker_instrucciones.md) | Crear el contenedor, las tablas y los datos iniciales |
| 2 | [Scripts SQL de la práctica](Docker_instrucciones.md#4-carga-de-datos-iniciales) | Cargar comarcas, poblaciones e institutos |

!!! tip "Comprobación antes de continuar"
    Verifica en DBeaver que las tablas `comarca`, `poblacio` e `institut` contienen datos antes de ejecutar los ejemplos Kotlin del paquete `Postgres`.

---

## Bloque 6 — PostgreSQL y modelado con `data class` ⏱️ ~4 h

Repetirás las operaciones JDBC sobre PostgreSQL y representarás las filas de las tablas mediante objetos Kotlin tipados.

| Orden | Apartado | Objetivo |
|-------|----------|----------|
| 1 | [CRUD con PostgreSQL](Operaciones.md#crud-con-postgresql) | Trabajar con una base de datos cliente-servidor |
| 2 | [Data class](Operaciones.md#data-class) | Convertir filas de `ResultSet` en objetos Kotlin |

---

## Bloque 7 — Funciones y procedimientos almacenados ⏱️ ~3 h

Crearás lógica reutilizable dentro de PostgreSQL y aprenderás a invocarla tanto desde SQL como desde Kotlin.

| Orden | Apartado | Objetivo |
|-------|----------|----------|
| 1 | [Funciones almacenadas](Procedimientos.md#funciones-function) | Crear funciones que devuelven valores o conjuntos de filas |
| 2 | [Procedimientos almacenados](Procedimientos.md#procedimientos-procedure) | Ejecutar acciones mediante `CALL` |
| 3 | [Resumen comparativo](Procedimientos.md#resumen-de-diferencias-entre-funcion-y-procedimiento-en-postgresql) | Elegir entre función y procedimiento |

---

## Bloque 8 — Ejercicio obligatorio ⏱️ ~5 h

El ejercicio integra los contenidos principales de la unidad sobre una base SQLite diseñada por ti.

| Página | Debes demostrar |
|--------|-----------------|
| [Ejercicio obligatorio](Ejercicio.md) | Modelo relacional, JDBC, CRUD, `data class`, transacciones, control de errores y documentación |

Antes de entregar, comprueba que:

- La base contiene al menos tres tablas relacionadas y datos de prueba.
- Todas las consultas con parámetros utilizan `PreparedStatement`.
- La transacción modifica dos tablas relacionadas y revierte todos los cambios si se produce un error.
- Los recursos JDBC se cierran correctamente.
- El proyecto funciona después de descomprimirlo en otra ubicación.
