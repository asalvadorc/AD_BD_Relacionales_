# Preparación del proyecto

## Base de datos

Reutiliza la base de datos **`geo`** del T5 y comprueba que el servidor PostgreSQL está arrancado y tiene datos en `comarca`, `poblacio` e `institut`. Si todavía no la tienes, sigue la [preparación de PostgreSQL y geo](../Docker_instrucciones.md).

## Crear la aplicación desde IntelliJ IDEA

En Ficheros creamos el proyecto con Gradle desde la web de Spring Initializr. En este tema utilizaremos **Maven y el asistente de Spring Boot integrado en IntelliJ IDEA**, para conocer otra forma de preparar una aplicación. El lenguaje seguirá siendo **Kotlin**: Maven se encarga de las dependencias, la compilación y el empaquetado.

1. Abre **File → New → Project**.
2. Selecciona **Spring Boot** en el asistente.
3. Configura estas opciones:

| Opción | Valor |
|---|---|
| Name | `SpringJPA` |
| Language | **Kotlin** |
| Type / Build system | **Maven** |
| Group | `org.example` |
| Artifact | `springjpa` |
| Package name | `org.example.springjpa` |
| Packaging | Jar |
| JDK y Java | La versión indicada por el profesor, compatible con la versión de Spring Boot elegida. |

4. En la selección de dependencias, añade **Spring Web**, **Spring Data JPA**, **PostgreSQL Driver**, **Thymeleaf** y **Validation**.
5. Finaliza la creación y espera a que IntelliJ importe el proyecto y descargue sus dependencias.

El asistente utiliza Spring Initializr internamente, pero realizamos los pasos desde IntelliJ. Si tu instalación no muestra la opción Spring Boot, puedes generar el mismo proyecto en [Spring Initializr](https://start.spring.io/), seleccionando **Maven y Kotlin**, y abrir su `pom.xml` en IntelliJ.

## El archivo pom.xml

Maven utiliza **`pom.xml`** para describir el proyecto y gestionar sus dependencias y plugins. Conserva las versiones compatibles generadas por el asistente.

Por ejemplo, al seleccionar Spring Data JPA y PostgreSQL se incorporan estas dependencias dentro de `<dependencies>`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

No las añadas otra vez si ya están presentes. Spring Boot gestiona sus versiones. Cuando modifiques el `pom.xml`, utiliza **Reload All Maven Projects** en la ventana de Maven para actualizar el proyecto.

### Kotlin y JPA

Comprueba que el proyecto generado contiene **`kotlin-maven-plugin`** y los plugins de compilador `spring` y `jpa`. Estos adaptan las clases Kotlin a las necesidades de Spring y JPA, como los constructores sin argumentos de las entidades. Desde Kotlin 2.3.20, el plugin `jpa` también incorpora la apertura de las clases JPA; conserva la configuración generada para tu versión.

??? note "Si utilizas una versión anterior de Kotlin"
    Puede ser necesario configurar explícitamente `all-open` para las entidades. Integra estos elementos en el plugin Kotlin existente, conservando sus demás opciones y ejecuciones:

    ```xml
    <configuration>
        <compilerPlugins>
            <plugin>spring</plugin>
            <plugin>jpa</plugin>
            <plugin>all-open</plugin>
        </compilerPlugins>
        <pluginOptions>
            <option>all-open:annotation=jakarta.persistence.Entity</option>
            <option>all-open:annotation=jakarta.persistence.MappedSuperclass</option>
            <option>all-open:annotation=jakarta.persistence.Embeddable</option>
        </pluginOptions>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-allopen</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
    ```

    Estas dependencias pertenecen al plugin Kotlin, dentro de `<build><plugins>`, no al bloque de dependencias de la aplicación. No dupliques elementos que el asistente ya haya generado.

Referencias: [asistente de Spring Boot en IntelliJ](https://www.jetbrains.com/help/idea/spring-initializr-project-wizard.html), [plugin JPA de Kotlin](https://kotlinlang.org/docs/no-arg-plugin.html) y [cambios de Kotlin 2.3.20](https://kotlinlang.org/docs/whatsnew2320.html).

## Organización

En la raíz encontrarás `pom.xml` y el wrapper de Maven (`mvnw` y `mvnw.cmd`). El código se organiza así:

```text
src/main/
├── kotlin/org/example/springjpa/
│   ├── SpringjpaApplication.kt
│   ├── model/
│   ├── repository/
│   ├── controller/
│   ├── service/
│   └── dto/
└── resources/
    ├── application.properties
    └── templates/
```

Mantén la clase de arranque generada en `org.example.springjpa` y los componentes dentro de sus subpaquetes. Los paquetes `service` y `dto` se utilizarán más adelante.

## Conexión a PostgreSQL

Configura `src/main/resources/application.properties`:

```properties
spring.application.name=springjpa
spring.datasource.url=jdbc:postgresql://localhost:5432/geo
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.thymeleaf.cache=false
```

Son las credenciales del entorno local del T5; adapta los valores si tu instalación es diferente. `ddl-auto=none` evita que Hibernate cree o modifique las tablas. `show-sql` permite observar el SQL generado. Spring configura las conexiones a partir de estas propiedades: en este proyecto no copiamos el objeto JDBC `DatabaseLocal`.

## Puesta en marcha

Ejecuta la clase de arranque generada. Con el controlador del siguiente apartado podrás abrir `http://localhost:8080/api/comarcas`. Si la aplicación no arranca, revisa el puerto 5432, la existencia de `geo`, las credenciales y las dependencias.


También puedes ejecutar la aplicación desde el terminal de IntelliJ, situado en la raíz del proyecto:

```powershell
.\mvnw.cmd spring-boot:run
```

En Linux o macOS utiliza `./mvnw spring-boot:run`.
