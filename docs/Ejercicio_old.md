## 📘 Guía para entregar una BD PostgreSQL como imagen Docker

### Requisitos
- Tener **Docker** instalado (Desktop o Engine).
- Conocer/usar la **misma versión** de PostgreSQL que usaste en tu proyecto (ej.: `postgres:16`).
- Disponer de tu **dump**: `dump.sql` (texto plano) o `backup.dump` (formato personalizado de `pg_dump -Fc`).

> **Consejo**: Anota en tu entrega la versión exacta de PostgreSQL que has usado (por ejemplo, 14/15/16).

---

### 1) Crear y arrancar un contenedor limpio de PostgreSQL
Levanta un contenedor con Postgres (ajusta la versión si no usas la 16):
```bash
docker run -d --name pg_proyecto   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_DB=proyecto_db   -p 5432:5432   postgres:16
```
Datos por defecto del ejemplo:
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `proyecto_db`
- Puerto: `5432`

---

### 2) Importar la BD del proyecto

#### Opción A — Tienes `dump.sql`
```bash
docker cp dump.sql pg_proyecto:/tmp/dump.sql
docker exec -u postgres pg_proyecto psql -U postgres -d proyecto_db -f /tmp/dump.sql
```

#### Opción B — Tienes `backup.dump` (formato `pg_dump -Fc`)
```bash
docker cp backup.dump pg_proyecto:/tmp/backup.dump
docker exec -u postgres pg_proyecto createdb -U postgres proyecto_db
docker exec -u postgres pg_proyecto pg_restore -U postgres -d proyecto_db -1 /tmp/backup.dump
```

#### Verificación rápida
```bash
docker exec -it pg_proyecto psql -U postgres -d proyecto_db -c "\dt"
```
Si ves tus tablas listadas, la importación se ha realizado correctamente ✅.

---

### 3) Congelar el contenedor en una **imagen** (con los datos dentro)
Detén el contenedor y créale una imagen “congelada”:
```bash
docker stop pg_proyecto
docker commit pg_proyecto alumno_postgres:1.0
```
Esto crea la imagen `alumno_postgres:1.0` con tu BD ya cargada.

---

### 4) Exportar la imagen para entregarla
Genera un fichero `.tar` de la imagen para compartirlo:
```bash
docker save -o alumno_postgres_1_0.tar alumno_postgres:1.0
```
Entrega ese archivo (`alumno_postgres_1_0.tar`) a tu profesor/a (USB, nube, etc.).

---

### 5) Cómo lo probará el profesor
Con el archivo `.tar` recibido, el profesor hará:
```bash
docker load -i alumno_postgres_1_0.tar
docker run -d --name pg_alumno -p 5433:5432 alumno_postgres:1.0
```
Y podrá conectarse con DBeaver/pgAdmin/psql usando:
- **Host**: `localhost`
- **Puerto**: `5433`
- **Usuario**: `postgres`
- **Contraseña**: `postgres`
- **Base de datos**: `proyecto_db`

---

### 6) Plantilla de README para entregar junto con la imagen
Copia/pega este README en tu proyecto (ajusta lo que proceda):

#### Proyecto BD Alumno — Entrega Docker (Opción A)

**Datos de acceso**
- Versión PostgreSQL: 16
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `proyecto_db`
- Puerto recomendado para pruebas del profesor: `5433`

**Instrucciones de ejecución**
1. Cargar la imagen:
   ```bash
   docker load -i alumno_postgres_1_0.tar
   ```

2. Arrancar un contenedor para pruebas:
   ```bash
   docker run -d --name pg_alumno -p 5433:5432 alumno_postgres:1.0
   ```

3. Verificación rápida (tablas):
   ```bash
   docker exec -it pg_alumno psql -U postgres -d proyecto_db -c "\dt"
   ```

**Notas**
- La imagen se ha creado con `postgres:16`. Si necesita otra versión, indíquelo.
- Si su sistema ya usa el puerto `5433`, cambie el mapeo a otro puerto libre (por ejemplo, `-p 5434:5432`).

---

### 7) Problemas comunes (y soluciones rápidas)
- **“El puerto ya está en uso”** → Cambia el puerto publicado (ej.: `-p 5434:5432`).  
- **Versión incompatible** → Usa la misma `postgres:<versión>` que se usó para generar la imagen/dump.  
- **No aparecen tablas tras importar** → Revisa si importaste en la BD correcta (`-d proyecto_db`) y si el dump crea su propia BD (importa entonces contra `-d postgres`).  
- **Extensiones faltantes** → Añade `CREATE EXTENSION IF NOT EXISTS ...;` tras importar, si tu proyecto las requiere.

---

**¡Listo!** Tu imagen contiene la BD y el profesor podrá arrancarla y probarla sin restauraciones adicionales.


## 📘 Guía práctica: Crear tu propia base de datos PostgreSQL en Supabase


## 🎯 Objetivo
En esta práctica vas a crear **tu propia base de datos en la nube** usando [Supabase](https://supabase.com).  
De esta forma podrás trabajar con PostgreSQL sin instalar nada en tu ordenador, y la profesora podrá revisar tu trabajo conectándose a tu BD.

---

### 🔹 Paso 1 – Crear cuenta en Supabase
1. Entra en 👉 [https://supabase.com](https://supabase.com).  
2. Pulsa en **Start your project**.  
3. Regístrate con **GitHub** (recomendado) o con tu correo electrónico.  

![Pantalla de login de Supabase](imagenes/login_supabase.png)

---

### 🔹 Paso 2 – Crear un nuevo proyecto
1. Pulsa en **New project**.  
2. Rellena los datos:  
   - **Project name**: pon tu nombre o usuario → ejemplo: `geo_ad_alicia`.  
   - **Database password**: inventa una contraseña y guárdala (la necesitarás).  
   - **Region**: elige **Frankfurt** (la más cercana).  
3. Pulsa **Create new project** y espera unos segundos.  

![Formulario de creación de proyecto](imagenes/nuevo_proyecto.png)

---

### 🔹 Paso 3 – Obtener la conexión a la base de datos
1. En el panel de tu proyecto, entra en:  
   **Settings → Database → Connection Info**.  
2. Copia estos datos (apúntalos aquí):  

         Host: ___________________________
         Port: 5432
         Database: postgres
         User: postgres
         Password: _______________________

3. Para conectarte desde Kotlin/JDBC usarás algo así:

         val url = "jdbc:postgresql://<host>:5432/postgres"
         val user = "postgres"
         val password = "<tu_clave>"

📸 (Captura sugerida: pantalla con connection string en Supabase)

### 🔹 Paso 4 – Crear tablas con el editor SQL

1. En el menú lateral, entra en SQL Editor.

2. Crea tus tablas con sentencias SQL.

3. Inserta algunos datos de prueba con INSERT INTO.

📸 (Captura sugerida: editor SQL con sentencias ejecutadas)

### 🔹 Paso 5 – Conectarte desde DBeaver o IntelliJ

1. Abre DBeaver o IntelliJ Database Tool.

2. Crea una nueva conexión PostgreSQL.

3. Introduce los datos que guardaste en el Paso 3.

4. Comprueba que aparecen tus tablas.

📸 (Captura sugerida: conexión en DBeaver mostrando tablas)

### 🔹 Paso 6 – Compartir tu BD con la profesora

Una vez creadas tus tablas, envíame estos datos:

   - Host

   - Usuario (postgres)

   - Password

   - Nombre del proyecto

(Puedes mandarlo por mensaje privado en Aules.)

Yo podré entrar en tu BD y comprobar que has creado las tablas y los datos correctamente. ✅