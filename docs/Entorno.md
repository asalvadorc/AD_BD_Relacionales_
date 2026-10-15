# Entorno y ubicación de los ejemplos

En el **T5. BD relacionales** comenzamos con SQLite y continuamos con PostgreSQL. Utilizaremos Kotlin y un proyecto Gradle llamado **`BDRelacionales`**.

## Preparación inicial

1. Crea un proyecto Kotlin/JVM con Gradle en IntelliJ IDEA.
2. Crea el paquete `SQLite` dentro de `src/main/kotlin`.
3. Descarga `Tienda.sqlite` de Aules y colócala en `src/main/resources`. Conserva una copia original para restaurar los datos.
4. Añade la dependencia y comprueba la conexión siguiendo [Conexión con JDBC](Conectores.md#desde-kotlin).
5. Ejecuta los ejemplos tomando la raíz del proyecto como directorio de trabajo: las rutas utilizadas en el código son relativas a esa carpeta.

## Organización del proyecto

```text
BDRelacionales/
├── build.gradle.kts
└── src/main/
    ├── kotlin/
    │   ├── SQLite/
    │   └── Postgres/
    │       └── DatabaseLocal.kt
    └── resources/
        └── Tienda.sqlite
```

El paquete `Postgres` se utilizará cuando lleguemos al apartado de PostgreSQL; no necesitas preparar ambos motores el primer día.

| Entorno | Base de datos | Paquete | Ubicación o conexión |
|---|---|---|---|
| SQLite | `Tienda.sqlite` | `SQLite` | `src/main/resources/Tienda.sqlite` |
| PostgreSQL local | `geo` | `Postgres` | `jdbc:postgresql://localhost:5432/geo` |


## Herramientas y recursos

- **IntelliJ IDEA y Gradle:** edición, dependencias y ejecución de Kotlin.
- **DBeaver:** inspección de tablas y ejecución de SQL. La configuración está en [Conexión con JDBC](Conectores.md#desde-dbeaver).
- **Docker y PostgreSQL:** se preparan más adelante con la [guía de instalación de geo](Docker_instrucciones.md).
- **Scripts de geo:** disponibles en la [carga de datos iniciales](Docker_instrucciones.md#carga-datos).

!!! tip "Antes de continuar"
    Comprueba qué motor y paquete utiliza cada ejemplo. La conexión de SQLite no sirve para PostgreSQL. Añade las dependencias de cada motor cuando llegues a su apartado.
