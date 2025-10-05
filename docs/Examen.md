# 🧪 Ejercicio: Gestión musical con SQLite y JDBC (sin DAO)

## 🎯 Objetivo

Desarrollar un programa en **Kotlin** que se conecte a una base de datos **SQLite** llamada `musica.sqlite`, ubicada en la carpeta `resources`, y realice las siguientes operaciones **directamente desde `main()`**, sin utilizar `data class` ni DAO.

---

## 📁 Recursos proporcionados

- `schema.sql`: crea la base de datos con las tablas `estilo`, `grupo`, `disco` y `cancion`.
- `insert.sql`: inserta datos de ejemplo para probar.
- Archivo `musica.sqlite` ya creado (puedes generarlo desde los scripts).

---

## 🧩 Requisitos del ejercicio

1. **Establecer conexión con la base de datos `musica.sqlite`** desde Kotlin usando JDBC.

2. **Insertar un nuevo grupo musical** con los siguientes datos:
   - `id`: `99`
   - `nombre`: `Nach`
   - `país`: `España`
   - `año de creación`: `1999`
   - `estilo`: `2` (Rap, ya existente en la tabla `estilo`)

3. **Mostrar por pantalla** todos los grupos actuales tras la inserción, incluyendo sus atributos.

4. **Iniciar una transacción JDBC** que haga lo siguiente:
   - Insertar un disco con:
     - `id`: `20`
     - `título`: `Un día en el mundo`
     - `año`: `2008`
     - `grupo`: `99` (el grupo insertado antes)
   - Insertar dos canciones asociadas a ese disco:
     - `Copenhague` (300 s)
     - `Sálvese quien pueda` (270 s)

5. Si todo va bien, **confirmar la transacción** (`commit`); en caso de error, **revertirla** (`rollback`).

---

## 🛠 Instrucciones adicionales

- Toda la lógica debe estar en el fichero `Main.kt`.
- **No** se debe utilizar ningún `data class`, DAO ni estructuras adicionales.
- Utiliza **`PreparedStatement`** para todas las consultas.
- El programa debe imprimir los resultados de forma legible.

---

## ✅ Criterios de evaluación

| Criterio                                 | Puntos |
|------------------------------------------|--------|
| Conexión correctamente establecida       | 1      |
| Inserción del grupo                      | 1      |
| Listado de grupos                        | 1      |
| Uso correcto de transacciones            | 2      |
| Inserción correcta de disco y canciones  | 2      |
| Gestión de errores con rollback          | 2      |
| Código estructurado y funcional          | 1      |
| **Total**                                | **10** |

---
