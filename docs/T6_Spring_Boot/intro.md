# Spring Boot con bases de datos relacionales

En el **T4** aprendimos a organizar una aplicación Spring Boot con controladores y servicios para trabajar con ficheros. En el **T5** utilizamos JDBC para acceder a SQLite y PostgreSQL. Ahora unimos ambas experiencias: construiremos una aplicación web que trabaja con la base **`geo`** mediante **Spring Data JPA**.

Antes de empezar, conviene distinguir tres conceptos que utilizaremos a lo largo del tema:

- **JPA (Jakarta Persistence)** es una especificación: define cómo relacionar los objetos de la aplicación con las tablas y cómo realizar operaciones de persistencia. Necesita una implementación que haga ese trabajo.
- **Hibernate** es la implementación de JPA que utilizaremos. Es un **ORM** (mapeo objeto-relacional): genera las sentencias SQL y transforma los resultados en objetos a partir del mapeo de las entidades.
- **Spring Data JPA** facilita el acceso a los datos mediante repositorios. Se apoya en JPA y, en nuestro proyecto, en Hibernate; no es un conector ni un ORM por sí mismo.



## Qué vamos a construir

Comenzaremos consultando comarcas de la base de datos **geo**, mediante una API REST. Después añadiremos búsquedas, páginas HTML con Thymeleaf y formularios para crear, editar y eliminar registros. Separaremos las responsabilidades con servicios y DTO, aprenderemos a escribir datos desde la API  y ampliaremos el modelo a poblaciones e institutos.

```text
Petición HTTP → Controlador → Servicio → Repositorio → JPA / Hibernate → PostgreSQL
```

Los primeros ejemplos acceden al repositorio desde el controlador para mostrar el recorrido mínimo. En el apartado de servicios y DTO separaremos esas responsabilidades. Cada etapa modifica la misma aplicación: sustituye las versiones anteriores de una clase, no crees controladores duplicados con las mismas rutas.



