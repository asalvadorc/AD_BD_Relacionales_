# 📝 Proyecto obligatorio: entrega final de la aplicación del tema

## Objetivo

Este proyecto es la **entrega final e integrada de la aplicación que hemos ido desarrollando a lo largo del T6** con Kotlin, Maven, Spring Boot, Spring Data JPA y PostgreSQL sobre la base **`geo`**. **No tienes que comenzar otro proyecto ni repetir desde cero los ejemplos realizados.** Continúa trabajando sobre tu proyecto `SpringJPA`.

El objetivo es reunir lo aprendido en una aplicación funcional, organizada en **controlador, servicio y repositorio**, con entidades, DTO y gestión de errores. La parte obligatoria que se evaluará es la **API de gestión de institutos** descrita a continuación.

## Del trabajo del tema a la entrega

| Trabajo desarrollado en los ejemplos | Qué debes revisar para la entrega |
|---|---|
| Preparación de `SpringJPA` y conexión a `geo` | Reutiliza el proyecto y comprueba que arranca correctamente. |
| Consultas, entidades y repositorios | Conserva lo realizado e integra las consultas de institutos requeridas. |
| CRUD de comarcas mediante la API | Adapta las operaciones a los campos de los institutos. |
| Servicios, DTO y errores HTTP | Aplica esa organización al conjunto de operaciones de institutos. |
| Relaciones y ejemplo de alta con población existente | Integra la asociación de la población en el alta, junto con las validaciones y los DTO. |
| Pruebas con Postman | Guarda y completa las peticiones que demuestran el funcionamiento de la entrega. |

Los ejemplos proporcionan las técnicas y gran parte del código, pero algunos pasos se han mostrado por separado o sobre comarcas. Tu tarea final es **integrar, adaptar y completar lo que falte**, no entregar fragmentos independientes. Si ya has implementado una operación requerida, basta con revisarla y probarla: no debes volver a escribirla.

Puedes conservar las páginas HTML, las operaciones de comarcas y las consultas adicionales realizadas durante el tema. No es necesario eliminarlas ni ampliarlas para esta entrega. Evita clases duplicadas y controladores con las mismas rutas. La demostración servirá también para comprobar que comprendes el código reutilizado.

## Requisitos

Utiliza los siguientes requisitos como **lista de comprobación de la versión final**. Puedes apoyarte en los ejemplos de [servicios y DTO](dto.md), [escritura desde la API](api_crud.md) y [relaciones de geo](relaciones.md). No se exige incorporar otras bibliotecas ni aprender una arquitectura diferente.

### 1. Proyecto y entidades

- Conserva el proyecto creado desde IntelliJ con **Kotlin, Maven y JDK 21** y revisa la conexión en `application.properties`.
- Organiza el código en `model`, `repository`, `service`, `dto` y `controller`.
- Revisa las entidades **`Institut` y `Poblacio`**, sus repositorios y la relación `@ManyToOne` de instituto a población que hemos trabajado en el tema.
- Respeta las claves, los tipos y la nulabilidad de las tablas existentes. No es necesario mapear todas las columnas. Puedes conservar la entidad `Comarca` y su relación, aunque no se exige utilizarlas en las operaciones obligatorias. Conserva el esquema de `geo` sin regenerarlo desde JPA.

### 2. Operaciones de la API

Comprueba que la API incluye estas operaciones y completa las que todavía no hayas integrado:

| Método y ruta orientativa | Operación |
|---|---|
| `GET /api/instituts` | Listar institutos. |
| `GET /api/instituts/{codigo}` | Consultar un instituto por su código. |
| `GET /api/instituts?poblacion=12028` | Filtrar los institutos por el código de población. |
| `POST /api/instituts` | Crear un instituto de prueba. |
| `PUT /api/instituts/{codigo}` | Modificar su nombre y dirección. |
| `DELETE /api/instituts/{codigo}` | Eliminarlo. |

Puedes resolver el listado y el filtro con un único método de controlador que reciba un parámetro `poblacion` opcional. Para filtrar, utiliza un método del repositorio derivado por nombre; no es obligatorio escribir una consulta con `@Query`.

También puedes usar una ruta de búsqueda separada, como `GET /api/instituts/buscar?poblacion=12028`, siguiendo el ejemplo de comarcas. Ambas soluciones son válidas; no se exige manejar parámetros opcionales para resolver la práctica.

Las poblaciones ya existen: **no se pide un CRUD de poblaciones**. Utiliza registros de prueba para modificar y eliminar institutos.

### 3. Componentes y DTO

- El **controlador** recibe las peticiones y devuelve las respuestas.
- El **servicio** comprueba los datos y realiza las operaciones utilizando los repositorios.
- Los **repositorios** se encargan del acceso a la base de datos.
- Utiliza DTO de entrada y salida sencillos. El alta debe recibir código, nombre, dirección y código de población; la actualización, nombre y dirección. La respuesta mostrará los datos del instituto y el código o nombre de su población.

No devuelvas directamente las entidades JPA desde la API ni permitas cambiar el código del instituto mediante la actualización.

### 4. Validación y errores

Comprueba que el código no esté vacío y tenga como máximo ocho caracteres, que el nombre sea obligatorio y que la población indicada exista. Respeta las longitudes de los campos de la base de datos.

Puedes realizar estas comprobaciones con condicionales y usar el manejo de errores del ejemplo de comarcas. No es obligatorio utilizar anotaciones de Validation. Para asociar la población, recupera la entidad existente desde su repositorio; no crees una población nueva.

Devuelve mensajes comprensibles para entradas incorrectas, códigos duplicados e institutos inexistentes, con estados HTTP adecuados, por ejemplo **400**, **409** y **404**, respectivamente. Un listado sin coincidencias debe devolver una lista vacía, no un error.

## Pruebas y entrega

Prueba con **Postman** el listado, el filtro y esta secuencia: **crear → consultar → modificar → consultar → eliminar**. Comprueba también un código duplicado, una población inexistente y la consulta de un instituto inexistente.

Sigue los pasos de Postman del [ejemplo de escritura REST](api_crud.md). Las comprobaciones son manuales: no se exige una batería de pruebas automáticas.

Entrega un único ZIP con la versión final del trabajo del tema:

- El proyecto Maven completo e integrado, incluido `pom.xml` y el wrapper de Maven. No entregues un proyecto separado por cada ejemplo ni únicamente archivos `.kt` sueltos.
- Una colección de Postman con las peticiones utilizadas.
- Un breve `README.md` con la configuración de conexión, los pasos de ejecución y los resultados esperados de las pruebas.

Utiliza la base `geo` de clase: no es necesario volver a entregar sus scripts ni Docker. No incluyas la carpeta `target`.

En la demostración explica el recorrido **controlador → servicio → repositorio**, la diferencia entre entidad y DTO y qué trabajo manual de JDBC sustituye ahora JPA.

Se permite reutilizar y adaptar el código de los apuntes: forma parte del desarrollo progresivo del proyecto. Debes poder explicar cómo funciona y mostrar las pruebas de tu aplicación.
<!--
## Ampliaciones opcionales

- Mostrar los datos con Thymeleaf.
- Crear una población y su instituto en una única transacción y comprobar el rollback.
- Añadir consultas por comarca o provincia, o utilizar `@Query`.

Estas ampliaciones **no son necesarias para obtener la puntuación máxima**.
-->
## Rúbrica

La rúbrica se aplica a la aplicación final integrada y a su demostración, no a la cantidad de código nuevo escrito después de terminar los ejemplos.

| Criterio | Puntos |
|---|---:|
| Configuración, entidades y relación entre instituto y población | 2 |
| Repositorios, listado y filtro por población | 1,5 |
| Alta, consulta por código, modificación y eliminación | 2 |
| Separación en controlador, servicio y repositorio; uso de DTO | 2 |
| Validación y respuestas de error | 1 |
| Pruebas, documentación y demostración | 1,5 |
| **Total** | **10** |
