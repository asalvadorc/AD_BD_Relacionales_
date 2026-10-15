# 📝 Ejercicio obligatorio: gestión de institutos con PostgreSQL

## 📋 Enunciado

Utilizando la base de datos **`geo`** preparada en clase, desarrolla un programa en **Kotlin con JDBC** que consulte y gestione institutos. Puedes reutilizar el objeto `DatabaseLocal` y apoyarte en los ejemplos del tema.

Organiza el código en funciones e invócalas desde un **menú interactivo de consola** en `main`. Solicita al usuario los datos necesarios para cada operación y pásalos como parámetros a las funciones.

## Menú de la aplicación

```text
===== GESTIÓN DE INSTITUTOS =====
1. Consultar institutos de una población
2. Añadir un instituto de prueba
3. Eliminar un instituto de prueba
4. Consultar institutos de una comarca
5. Cambiar la dirección de un instituto
6. Insertar dos institutos en una transacción
0. Salir
Selecciona una opción:
```

El menú debe repetirse hasta seleccionar **0** y volver a mostrarse después de cada operación. Si se introduce una opción inexistente, muestra un mensaje y vuelve al menú. No se exige una validación completa de los datos introducidos.

En la opción **6** puedes utilizar datos de prueba definidos en el código. No necesitas un submenú ni un sistema de pruebas automáticas.

## 🛠️ Operaciones que debes realizar

### 1. Consultar institutos

Dado el código de una población, consulta sus institutos y muestra su **código, nombre y dirección**, ordenados por nombre. Guarda los resultados en una lista de objetos de una **`data class Institut`** y contempla los campos que puedan contener `NULL`.

### 2. Añadir y eliminar un instituto

Inserta un instituto de prueba con código nuevo, nombre, dirección y código de una población existente. Más adelante, después de probar el cambio de dirección del apartado 4, elimínalo. Muestra el número de filas afectadas que devuelve `executeUpdate()`. Utiliza datos válidos: el código del instituto admite hasta ocho caracteres. No necesitas programar comprobaciones previas de las claves o las longitudes.

### 3. Utilizar una función almacenada

Utiliza la función **`instituts_de_comarca(p_nom_c TEXT)`** del apartado de funciones almacenadas de los apuntes. Puedes reutilizar su definición SQL. Solicita el nombre de una comarca, invoca la función desde Kotlin mediante `SELECT * FROM instituts_de_comarca(?)` y muestra los resultados recorriendo el `ResultSet`, como en el ejemplo. No necesitas convertir esta consulta en otra lista de objetos.

### 4. Utilizar un procedimiento almacenado

Crea el procedimiento **`cambiar_direccion_institut`**, que reciba el código de un instituto y su nueva dirección y la actualice. Invócalo desde Kotlin mediante `CallableStatement` y comprueba el cambio con una consulta.

No se exigen parámetros de salida ni validaciones dentro del procedimiento. La actualización mediante este procedimiento completa el CRUD: no necesitas repetirla con un `UPDATE` directo desde Kotlin.

### 5. Crear una transacción

Crea una función que inserte **dos institutos de prueba dentro de una misma transacción**. Deben guardarse los dos o no guardarse ninguno.

- Utiliza la **misma conexión JDBC** para ambas inserciones y desactiva la confirmación automática con `autoCommit = false`.
- Emplea códigos nuevos de hasta ocho caracteres y códigos de poblaciones existentes. Puedes escribir las dos inserciones dentro de la propia función, siguiendo los ejemplos de transacciones de los apuntes.
- Si ambas inserciones se completan correctamente, confirma los cambios con **`commit()`**.
- Si alguna falla, captura el error y deshaz toda la operación con **`rollback()`**. No confirmes la primera inserción por separado.
- Abre la conexión con `DatabaseLocal.getConnection().use` y restablece `autoCommit = true` en un bloque `finally`, como en el ejemplo de los apuntes.

Comprueba desde la opción de consulta del menú que se han guardado los dos institutos. Puedes utilizar la opción de eliminación para borrarlos después. No se exige provocar un error ni programar comprobaciones o limpieza automáticas; sí debe estar incluido el `rollback()` en el bloque `catch`.

## ✅ Condiciones y comprobación

- Utiliza **parámetros JDBC** para los valores variables y **`use`** para cerrar los recursos.
- Gestiona los errores con `try/catch` y muestra mensajes comprensibles.
- Crea la función y el procedimiento en PostgreSQL antes de invocarlos desde Kotlin.
- Trabaja únicamente con registros de prueba para las modificaciones y el borrado.
- Comprueba manualmente las opciones del menú. Para probar la modificación y el borrado, utiliza el instituto que hayas insertado previamente.
- Ejecuta la transacción y consulta los dos institutos insertados. Las comprobaciones pueden hacerse utilizando las opciones del propio menú.

El menú y la transacción son **obligatorios**. Las consultas adicionales quedan como ampliación opcional.

## 📩 Entrega

Entrega un ZIP con:

- El proyecto Kotlin.
- Un archivo SQL con la función utilizada y tu procedimiento.
- Un breve `README.md` con la configuración de conexión y los pasos para ejecutar el programa, indicando que primero hay que crear la función y el procedimiento. No se exige un informe de pruebas ni capturas de cada operación.

Utilizamos la base `geo` de clase: no necesitas volver a entregar sus scripts de creación y carga ni la configuración de Docker.

## 📊 Rúbrica de evaluación

| Criterio | Puntos |
|---|---:|
| Conexión JDBC y organización en funciones | 0,5 |
| Menú interactivo, entrada de datos y navegación | 0,5 |
| Consulta parametrizada y lista de objetos `Institut` | 1,5 |
| Inserción y eliminación con comprobación de resultados | 1,5 |
| Función almacenada e invocación desde Kotlin | 1,5 |
| Procedimiento de actualización e invocación desde Kotlin | 1,5 |
| Transacción con dos inserciones, `commit()` y `rollback()` en caso de error | 1 |
| Gestión de errores y cierre de recursos | 1 |
| Comprobaciones y documentación de la entrega | 1 |
| **Total** | **10** |

Las ampliaciones son voluntarias y no son necesarias para obtener la puntuación máxima.

Las comprobaciones se realizan manualmente: no se requieren pruebas automáticas. Un mismo error no se penalizará dos veces en distintos criterios de la rúbrica.

