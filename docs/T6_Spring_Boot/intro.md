# Spring Boot con bases de datos relacionales

En el **T4** aprendimos a organizar una aplicación Spring Boot con controladores y servicios para trabajar con ficheros. En el **T5** utilizamos JDBC para acceder a SQLite y PostgreSQL. Ahora unimos ambas experiencias: construiremos una aplicación web que trabaja con la base **`geo`** mediante **Spring Data JPA**.

## Qué vamos a construir

Comenzaremos consultando comarcas de la base de datos **geo**, mediante una API REST. Después añadiremos búsquedas, páginas HTML con Thymeleaf y operaciones CRUD. Finalmente separaremos las respuestas mediante DTO y ampliaremos el modelo a poblaciones e institutos.

```text
Petición HTTP → Controlador → Servicio → Repositorio → JPA / Hibernate → PostgreSQL
```

Los primeros ejemplos acceden al repositorio desde el controlador para mostrar el recorrido mínimo. En el apartado de servicios y DTO separaremos esas responsabilidades. Cada etapa modifica la misma aplicación: sustituye las versiones anteriores de una clase, no crees controladores duplicados con las mismas rutas.

## JDBC, JPA, Hibernate y Spring Data JPA

| Elemento | Responsabilidad |
|---|---|
| JDBC | Comunicación con PostgreSQL mediante su driver. Sigue utilizándose por debajo del ORM. |
| JPA (Jakarta Persistence) | Especificación del mapeo y las operaciones de persistencia. |
| Hibernate | Implementación ORM que traduce el mapeo y las operaciones a SQL. |
| Spring Data JPA | Repositorios que simplifican las operaciones y la definición de consultas. |

Una `data class` del T5 almacenaba datos obtenidos manualmente de un `ResultSet`. Aquí una **entidad JPA** declara su correspondencia con la tabla. Reservaremos las `data class` para DTO y utilizaremos clases ordinarias para las entidades.

## Recorrido

1. [Preparar el proyecto y la conexión](entorno.md).
2. [Conocer las anotaciones de persistencia](anotaciones.md).
3. [Crear la primera aplicación con comarcas](primera_aplicacion.md).
4. [Definir consultas](consultas.md).
5. [Mostrar y buscar datos con Thymeleaf](vistas.md).
6. [Añadir operaciones CRUD](crud.md).
7. [Separar servicios y DTO](dto.md).
8. [Relacionar las tres tablas de geo](relaciones.md).
9. [Repasar](resumen.md) y realizar el [proyecto obligatorio](ejercicios.md).

## Resultados de aprendizaje

Trabajaremos el RA6, especialmente la organización en componentes, el mapeo objeto-relacional, las pruebas y documentación y la integración en aplicaciones. El acceso directo mediante conectores se ha trabajado en el T5. Consulta la [tabla de RA y CE](../RA_CE.md).

Este tema adapta los ejemplos relacionales de AD_Componentes al entorno local de `geo` del T5. Los contenidos de MongoDB pertenecen al bloque documental.
