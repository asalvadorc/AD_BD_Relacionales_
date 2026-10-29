# 📝 Proyecto obligatorio: API de institutos

Continúa en **`SpringJPA`**, sobre la base de datos **`geo`**. El trabajo consiste en **adaptar el CRUD de comarcas a institutos** y completar su relación con una población existente. Reutiliza las entidades, repositorios, servicios y controladores del tema; completa los que ya tienes.

Trabaja en los **tres hitos siguientes** y comprueba cada uno antes de continuar. La entrega final reúne los tres en la misma aplicación.

## Hito 1. Consultar institutos

Revisa `Institut`, `Poblacio` y su relación. Utiliza el recorrido **controlador → servicio → repositorio** y reutiliza `InstitutDTO` como DTO de salida, con código, nombre, dirección y código o nombre de la población. Puedes conservar sus campos adicionales; la API no debe devolver entidades JPA directamente.

| Petición | Operación | Respuesta correcta |
|---|---|---|
| `GET /api/instituts` | Listar todos los institutos. | `200` + lista JSON |
| `GET /api/instituts/{codigo}` | Consultar uno por su código. | `200` + JSON |
| `GET /api/instituts/buscar?poblacion=12028` | Filtrar por código de población. | `200` + lista JSON |

Las rutas son orientativas. También puedes integrar el filtro en el listado mediante un parámetro opcional. Utiliza una consulta derivada por nombre para filtrar por población.

**Comprueba en Postman:** listado, consulta de un código existente y filtro por población. Un listado o filtro sin coincidencias devuelve `200` con `[]`; consultar un código inexistente devuelve `404`.

## Hito 2. Crear un instituto

Implementa **`POST /api/instituts`**. En el paquete `dto`, crea **`InstitutCrearDTO`** con `codi`, `nom`, `adreca` y `codigoPoblacion` para recibir este JSON:

```json
{
  "codi": "PRUEBA01",
  "nom": "Institut de prova",
  "adreca": "Carrer Major, 1",
  "codigoPoblacion": 12028
}
```

Utiliza un código de instituto nuevo y sustituye `12028` si necesitas otro código de población existente. En Postman selecciona **Body → raw → JSON**.

En el servicio, valida los datos, recupera una **`Poblacio` existente** por su código y asígnala a `Institut.poblacio`. Guarda el instituto y devuelve `InstitutDTO`. La respuesta será **`201 Created` con los datos en JSON**. El alta del ejemplo de relaciones sirve como punto de partida.

**Comprueba en Postman:** crea el instituto, consúltalo y verifica su población. Prueba también un código duplicado (`409`) y una población inexistente (`400`).

## Hito 3. Modificar, eliminar y completar los errores

Implementa **`PUT /api/instituts/{codigo}`**. Crea **`InstitutActualizarDTO`** con `nom` y `adreca` para recibir este JSON:

```json
{
  "nom": "Institut actualizado",
  "adreca": "Carrer Nou, 2"
}
```

El código se obtiene de la URL. Cambia solo nombre y dirección, conservando el código y la población; devuelve **`200 OK` con el `InstitutDTO` actualizado**.

Implementa **`DELETE /api/instituts/{codigo}`** y devuelve **`204 No Content`, sin cuerpo**. Si el instituto no existe al consultar, modificar o eliminar, devuelve **`404`**.

**Comprueba en Postman:** modifica el instituto de prueba, consulta los cambios, elimínalo y verifica que consultarlo después devuelve `404`.

## Reglas comunes

- Organiza el código en `model`, `repository`, `service`, `dto` y `controller`. El servicio valida y transforma las entidades en DTO. Aplica `@Transactional` a las operaciones de escritura.
- Código obligatorio, de un máximo de **8 caracteres**, y sin duplicados al crear.
- Nombre obligatorio, de un máximo de **60 caracteres**; dirección de un máximo de **100 caracteres**.
- Reutiliza `ErrorOperacion` y `ErroresApi`: **400** para datos incorrectos o población inexistente, **409** para código duplicado y **404** para instituto inexistente. Puedes validar con condicionales.

Conserva los tipos, claves, nulabilidad y esquema de `geo`, sin regenerar las tablas desde JPA. No se pide CRUD de poblaciones ni ampliar las páginas HTML. Puedes conservar el resto del trabajo del tema.

## Entrega

Guarda las peticiones de los tres hitos en una **colección de Postman**. Utiliza institutos de prueba para las modificaciones y el borrado.

Entrega **un ZIP** con:

- El proyecto Maven completo, con `pom.xml` y wrapper, **sin `target`**.
- La colección de Postman.
- Un breve `README.md` con la conexión, los pasos de ejecución y los resultados esperados.

Mantén Kotlin, Maven y JDK 21, como en el proyecto del tema. No hace falta entregar de nuevo la base `geo` ni Docker, ni crear pruebas automáticas.

En la demostración explica el recorrido **controlador → servicio → repositorio**, la diferencia entre entidad y DTO y qué trabajo de JDBC sustituye JPA.

Puedes apoyarte en [servicios y DTO](dto.md), [escritura desde la API](api_crud.md) y [relaciones](relaciones.md).

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
