# 📝 Ejercicio: Operaciones sobre tu propia base de datos relacional en SQLite

## 📋 Enunciado

Diseñar, crear y utilizar una **base de datos relacional SQLite** con al menos **tres tablas relacionadas**, aplicando los principios básicos del modelo relacional y desarrollando un programa **Kotlin** que permita realizar operaciones de acceso a datos de forma segura y estructurada.

Organiza el código en funciones y ejecútalas desde main. No es necesario crear un menú: puedes utilizar valores de prueba definidos en el programa y pasarlos como parámetros.

---

## 🛠️ Requisitos

### 1. Base de datos

- Debes crear una base de datos de **temática libre** (música, libros, cine, videojuegos, recetas, viajes, etc.).
- Incluye una imagen del modelo E/R de tu Base de datos: `imagenER.png`
- La base de datos debe contener:
    - Al menos **3 tablas** relacionadas.
    - Claves primarias y **claves foráneas correctamente definidas**.
    - Relación de tipo 1:N o N:M.
    - Poblar la BD con al menos 3 registros

### 2. Operaciones en Kotlin

- Desde un programa Kotlin con conexión JDBC a la base de datos SQLite:
    - Crear operaciones **CRUD** (Crear, Leer, Actualizar, Eliminar) en al menos 2 tablas.
    - Mostrar un **menú interactivo por consola** para que el usuario pueda seleccionar las opciones **Crear, Leer, Actualizar y Eliminar (CRUD)**.
    - Utiliza **`PreparedStatement`** para todas las consultas con parámetros.
    - Representa al menos 2 tablas mediante **`data class`** y utilízalas en las operaciones de consulta o manipulación de datos.
    - Muestra los resultados por consola de forma clara y legible.
    - Toda la funcionalidad debe estar implementada **en un solo fichero `Main.kt`**, aunque tengas que estructurar el programa en varias funciones.
<!--
### 3. Transacción

- Implementa una **transacción** que afecte a **dos tablas relacionadas** (por ejemplo, insertar un pedido y sus líneas, o una factura y sus productos).
- Debe usarse `commit()` y `rollback()` según corresponda.

### 3. Control de errores

Implementa un **sistema básico de manejo de errores** (`try/catch`) que:  

  - Muestra un mensaje claro en caso de fallo.
  - Cancela las operaciones si hay errores en la transacción (`rollback()`).
  - No permita que la base de datos quede en un estado inconsistente.

-->
### 3. Documentación del código

El código Kotlin debe incluir **comentarios explicativos** que:

  - Indiquen claramente qué hace cada función.
  - Expliquen las partes principales del código (conexión, inserción, consultas, transacción, etc.).


---

## 📦 Estructura mínima del proyecto

    BDRelacionales_Ejercicio/
    └── src/
        └── main/
            ├── resources/
            │   ├── tu_basededatos.sqlite
            │   └── imagenER.png
            └── kotlin/
                └── tu_paquete/
                    └── Main.kt


---

## 📩 Entrega

Sube un archivo `.zip` con:

- La base de datos `tu_basededatos.sqlite` dentro de `src/main/resources`.
- El proyecto Kotlin con todas las operaciones implementadas en un solo fichero `Main.kt`.
- Una imagen con el esquema relacional de la base de datos (imagenER.png).


---

## ✅ Rúbrica de evaluación

| Criterio                                              | Puntos |
|-------------------------------------------------------|--------|
| BD correctamente estructurada (mín. 3 tablas)         | 2      |
| CRUD funcional en al menos dos tablas                 | 4      |
| Uso adecuado de `data class` en al menos 2 tablas     | 2      |
| Código bien estructurado y documentado                | 1      |
| Estructura y entrega del proyecto                     | 1      |
| **Total**                                             | **10** |

---

