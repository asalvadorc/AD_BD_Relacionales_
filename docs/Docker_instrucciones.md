# 🐘 Instalación y configuración de PostgreSQL con Docker y DBeaver

## 📋 Resumen de la práctica

1. Se instala **PostgreSQL** con **Docker** usando un `docker-compose.yml`.  
2. Se arranca el contenedor y se verifica con `docker ps`.  
3. Se conecta la base de datos con **DBeaver** (`localhost:5432`).  
4. Se crean las tablas `COMARCA`, `POBLACIO` e `INSTITUT`.  
5. Se insertan los datos iniciales desde los scripts `.sql`.

---

## 1️⃣ Instalación de PostgreSQL con Docker

Para crear un contenedor de **PostgreSQL** en nuestro equipo utilizaremos **Docker Compose**.

> 💡 Si eres usuario de **Windows** o **Mac**, instala **Docker Desktop**.  
> Si usas **Ubuntu** o **Debian**, asegúrate de tener instalado `docker` y `docker-compose`.

---

### 1.1. Crear el archivo `docker-compose.yml`

En una carpeta llamada, por ejemplo, `docker/postgres`, crea un archivo con el siguiente contenido:


    version: '3.8'
    services:
    db:
        image: postgres:16.4
        container_name: mi_postgres
        environment:
        POSTGRES_PASSWORD: postgres
        POSTGRES_USER: postgres
        POSTGRES_DB: geo
        volumes:
        - db_data:/var/lib/postgresql/data
        ports:
        - "5432:5432"
    volumes: 
    db_data:


### 1.2. Levantar el servicio

Posiciónate en el terminal en el directorio donde está el fichero `docker-compose.yml` y ejecuta:


    docker-compose up -d


### 1.3. Verificar el contenedor

Para comprobar que PostgreSQL está activo, ejecuta en el terminal:


    docker ps


El resultado debe mostrar una entrada similar a la siguiente:

    CONTAINER ID  IMAGE         COMMAND                  CREATED        STATUS       PORTS                   NAMES
    327fd50443a7  postgres:8    "docker-entrypoint.s…"   29 hours ago   Up 6 hours   0.0.0.0:5432->5432/tcp  docker_postgres


Si aparece el contenedor mi_postgres con estado Up, significa que el servicio de PostgreSQL está funcionando correctamente.


## 2️⃣ Conexión de PostgreSQL con DBeaver

Una vez el contenedor de PostgreSQL está activo, podemos conectarnos mediante el cliente gráfico **DBeaver**.

---

### 2.1. Crear nueva conexión

1. Abre **DBeaver**.  
2. Selecciona **Nueva conexión → PostgreSQL**.  
3. Introduce los siguientes datos de conexión:

| Campo | Valor |
|-------|--------|
| Nombre de conexión | `docker-geo` |
| Server host | `localhost` |
| Port | `5432` |
| Database | `geo` |
| User name | `postgres` |
| Password | `postgres` |

Haz clic en **Test Connection** para comprobar la conexión.  
Si la prueba es satisfactoria, guarda la conexión.

---

## 3️⃣ Creación de la base de datos `geo`

En la conexión local de PostgreSQL (ya desde DBeaver o cualquier cliente SQL), ejecuta los siguientes scripts para crear las tablas del esquema `public`.

---

### 3.1. Creación de la tabla `COMARCA`

    CREATE TABLE public.comarca (
        nom_c varchar(50) NOT NULL,
        provincia varchar(25) NULL,
        CONSTRAINT cp_com PRIMARY KEY (nom_c)
    );


### 3.2. Creación de la tabla `POBLACIO`

    CREATE TABLE public.poblacio (
        cod_m numeric(5) NOT NULL,
        nom varchar(50) NOT NULL,
        poblacio numeric(6) NULL,
        extensio numeric(6, 2) NULL,
        altura numeric(4) NULL,
        longitud varchar(50) NULL,
        latitud varchar(50) NULL,
        llengua bpchar(1) NULL,
        nom_c varchar(50) NULL,
        CONSTRAINT cp_pobl PRIMARY KEY (cod_m),
        CONSTRAINT ce_pob_com FOREIGN KEY (nom_c)
            REFERENCES public.comarca(nom_c)
            ON UPDATE CASCADE
    );

### 3.3. Creación de la tabla `INSTITUT`
    CREATE TABLE public.institut (
        codi varchar(8) NOT NULL,
        nom varchar(60) NULL,
        adreca varchar(100) NULL,
        numero varchar(5) NULL,
        codpostal numeric(5) NULL,
        cod_m numeric(5) NULL,
        CONSTRAINT cp_ins PRIMARY KEY (codi),
        CONSTRAINT ce_ins_pob FOREIGN KEY (cod_m)
            REFERENCES public.poblacio(cod_m)
    );

## 4️⃣ Carga de datos iniciales

Para completar la base de datos, ejecuta los siguientes scripts SQL desde **DBeaver** o desde el terminal de **PostgreSQL**.

Cada script se encarga de insertar los datos de las tablas creadas previamente.

---

📂 [Inserción de comarcas](comarcas.sql)

📂 [Inserción de poblacio](poblacions.sql)

📂 [Inserción de insitut](instituts.sql)

