# 📝 Proyecto obligatorio: institutos de geo con Spring Boot

## Objetivo

Desarrolla una **API REST con Kotlin, Maven, Spring Boot, Spring Data JPA y PostgreSQL** para gestionar los institutos de la base **`geo`**. Reutiliza la base preparada en clase y los ejemplos del T6.

El objetivo es trasladar las operaciones del ejercicio de JDBC a una aplicación organizada en **controlador, servicio y repositorio**, utilizando entidades y DTO sencillos.

## Requisitos

### 1. Proyecto y entidades

- Crea el proyecto desde IntelliJ con **Kotlin y Maven** y configura la conexión en `application.properties`.
- Organiza el código en `model`, `repository`, `service`, `dto` y `controller`.
- Define las entidades **`Institut` y `Poblacio`**, sus repositorios y la relación `@ManyToOne` de instituto a población.
- Respeta las claves, los tipos y la nulabilidad de las tablas existentes. No es necesario mapear todas las columnas ni crear la entidad `Comarca` para esta práctica. Conserva el esquema de `geo` sin regenerarlo desde JPA.

### 2. Operaciones de la API

Implementa estas operaciones:

| Método y ruta orientativa | Operación |
|---|---|
| `GET /api/instituts` | Listar institutos. |
| `GET /api/instituts/{codigo}` | Consultar un instituto por su código. |
| `GET /api/instituts?poblacion=12028` | Filtrar los institutos por el código de población. |
| `POST /api/instituts` | Crear un instituto de prueba. |
| `PUT /api/instituts/{codigo}` | Modificar su nombre y dirección. |
| `DELETE /api/instituts/{codigo}` | Eliminarlo. |

Puedes resolver el listado y el filtro con un único método de controlador que reciba un parámetro `poblacion` opcional. Para filtrar, utiliza un método del repositorio derivado por nombre; no es obligatorio escribir una consulta con `@Query`.

Las poblaciones ya existen: **no se pide un CRUD de poblaciones**. Utiliza registros de prueba para modificar y eliminar institutos.

### 3. Componentes y DTO

- El **controlador** recibe las peticiones y devuelve las respuestas.
- El **servicio** comprueba los datos y realiza las operaciones utilizando los repositorios.
- Los **repositorios** se encargan del acceso a la base de datos.
- Utiliza DTO de entrada y salida sencillos. El alta debe recibir código, nombre, dirección y código de población; la actualización, nombre y dirección. La respuesta mostrará los datos del instituto y el código o nombre de su población.

No devuelvas directamente las entidades JPA desde la API ni permitas cambiar el código del instituto mediante la actualización.

### 4. Validación y errores

Comprueba que el código no esté vacío y tenga como máximo ocho caracteres, que el nombre sea obligatorio y que la población indicada exista. Respeta las longitudes de los campos de la base de datos.

Devuelve mensajes comprensibles para entradas incorrectas, códigos duplicados e institutos inexistentes, con estados HTTP adecuados, por ejemplo **400**, **409** y **404**, respectivamente. Un listado sin coincidencias debe devolver una lista vacía, no un error.

## Pruebas y entrega

Prueba con **Postman** el listado, el filtro y esta secuencia: **crear → consultar → modificar → consultar → eliminar**. Comprueba también un código duplicado, una población inexistente y la consulta de un instituto inexistente.

Entrega un ZIP con:

- El proyecto Maven completo, incluido `pom.xml` y el wrapper de Maven.
- Una colección de Postman con las peticiones utilizadas.
- Un breve `README.md` con la configuración de conexión, los pasos de ejecución y los resultados esperados de las pruebas.

Utiliza la base `geo` de clase: no es necesario volver a entregar sus scripts ni Docker. No incluyas la carpeta `target`.

En la demostración explica el recorrido **controlador → servicio → repositorio**, la diferencia entre entidad y DTO y qué trabajo manual de JDBC sustituye ahora JPA.

## Ampliaciones opcionales

- Mostrar los datos con Thymeleaf.
- Crear una población y su instituto en una única transacción y comprobar el rollback.
- Añadir consultas por comarca o provincia, o utilizar `@Query`.

Estas ampliaciones **no son necesarias para obtener la puntuación máxima**.

## Rúbrica

| Criterio | Puntos |
|---|---:|
| Configuración, entidades y relación entre instituto y población | 2 |
| Repositorios, listado y filtro por población | 1,5 |
| Alta, consulta por código, modificación y eliminación | 2 |
| Separación en controlador, servicio y repositorio; uso de DTO | 2 |
| Validación y respuestas de error | 1 |
| Pruebas, documentación y demostración | 1,5 |
| **Total** | **10** |
