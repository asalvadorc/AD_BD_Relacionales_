# Repaso y comprobaciones

Hemos pasado de consultar comarcas a una aplicación que presenta HTML, intercambia JSON y trabaja con relaciones. Antes del proyecto, comprueba que puedes explicar qué responsabilidad tiene cada pieza.

| Concepto | Función en nuestra aplicación |
|---|---|
| Entidad JPA | Representa una tabla y declara columnas, clave y relaciones. |
| Repositorio | Ofrece operaciones de persistencia y consultas. |
| Servicio | Organiza la lógica de negocio, las transacciones y las transformaciones a DTO. |
| Controlador REST | Recibe peticiones y devuelve datos, normalmente JSON. |
| Controlador MVC | Prepara el modelo de una plantilla HTML. |
| DTO | Define qué datos intercambia la aplicación con el cliente. |
| Thymeleaf | Genera HTML utilizando los datos del modelo. |
| `@Transactional` | Delimita una unidad de trabajo en el servicio; Spring confirma o revierte según el resultado. |

## Antes del proyecto

Comprueba que puedes listar comarcas en JSON y HTML, filtrar por provincia, crear y modificar una comarca de prueba y eliminarla cuando no tenga poblaciones asociadas. Después prueba las consultas sobre poblaciones e institutos y verifica los resultados en DBeaver.

| Comprobación | Resultado esperado |
|---|---|
| Abrir `/comarcas` | Una página HTML con el listado y las acciones. |
| Consultar `/api/comarcas` | Una lista JSON de DTO. |
| Buscar una provincia inexistente | Lista vacía, no un error. |
| Crear, modificar y eliminar por la API | Estados 201, 200 y 204, respectivamente. |
| Consultar un identificador inexistente | 404 con un mensaje. |
| Enviar un nombre vacío o duplicado | 400 o 409, respectivamente. |
| Consultar institutos por provincia | DTO con los datos de las relaciones, sin exponer entidades completas. |

Realiza las modificaciones solo sobre registros de prueba. Para las peticiones con JSON, utiliza los pasos de [Postman](api_crud.md).



Continúa con el [proyecto obligatorio](ejercicios.md).
