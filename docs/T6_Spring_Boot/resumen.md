# Resumen

| Concepto | Función en nuestra aplicación |
|---|---|
| Entidad JPA | Representa una tabla y declara columnas, clave y relaciones. |
| Repositorio | Ofrece operaciones de persistencia y consultas. |
| Servicio | Organiza la lógica de negocio, las transacciones y las transformaciones a DTO. |
| Controlador REST | Recibe peticiones y devuelve datos, normalmente JSON. |
| Controlador MVC | Prepara el modelo de una plantilla HTML. |
| DTO | Define qué datos intercambia la aplicación con el cliente. |
| Thymeleaf | Genera HTML utilizando los datos del modelo. |
| `@Transactional` | Delimita una unidad de trabajo; para comprobar rollback utiliza una excepción no comprobada o configura explícitamente las reglas. |

## Antes del proyecto

Comprueba que puedes listar comarcas en JSON y HTML, filtrar por provincia, crear y modificar una comarca de prueba y eliminarla cuando no tenga poblaciones asociadas. Después prueba las consultas sobre poblaciones e institutos y verifica los resultados en DBeaver.

!!! question "¿Seguimos utilizando JDBC cuando trabajamos con JPA?"
    ??? success "Ver respuesta"
        Sí. Hibernate utiliza el driver JDBC para comunicarse con PostgreSQL. Lo que cambia es el nivel de abstracción: escribimos entidades y repositorios en lugar de preparar cada sentencia y recorrer manualmente cada `ResultSet`.

!!! question "¿Una entidad y un DTO cumplen la misma función?"
    ??? success "Ver respuesta"
        No. La entidad participa en el mapeo y la persistencia; el DTO contiene los datos que queremos intercambiar. Una entidad puede tener relaciones que no conviene enviar directamente al cliente.

Continúa con el [proyecto obligatorio](ejercicios.md).
