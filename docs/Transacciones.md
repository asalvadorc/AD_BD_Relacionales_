# Transacciones y Manejo de Excepciones

La gestión de transacciones y el manejo de excepciones son dos aspectos fundamentales en el desarrollo de aplicaciones que interactúan con bases de datos, ya que garantizan la integridad, la consistencia y la robustez de los sistemas.

## Transacciones

Una transacción es una secuencia de una o más operaciones sobre una base de datos que deben ejecutarse como una unidad indivisible. El objetivo es asegurar que todas las operaciones se completen con éxito o, en caso de fallo, ninguna de ellas se aplique, manteniendo así la base de datos en un estado consistente. Por ejemplo, en una transferencia bancaria, si falla el abono en una cuenta, se cancela el débito en la otra.

Las transacciones se gestionan mediante comandos como BEGIN TRANSACTION (para iniciar), COMMIT (para confirmar los cambios) y ROLLBACK (para deshacer los cambios en caso de error). Este mecanismo protege la base de datos frente a fallos parciales y situaciones de concurrencia, asegurando que los datos siempre reflejen una realidad válida y coherente.


**Propiedades de una transacción (ACID)**{.azul}

Las transacciones garantizan propiedades fundamentales, conocidas por el acrónimo ACID:

Propiedad|	Significado breve
---------|-------------------
Atomicidad|	Todas las operaciones se ejecutan o ninguna lo hace
Consistencia|	El sistema pasa de un estado válido a otro
Isolación|	No interfiere con otras transacciones simultáneas
Durabilidad| Una vez confirmada, el cambio permanece



**Comandos clave**{.azul}

Para controlar correctamente una transacción desde el código, necesitamos usar tres comandos clave:


- **commit()**: Confirma los cambios realizados por la transacción, haciéndolos permanentes.
- **rollback()**: Revierte todos los cambios realizados durante la transacción actual, volviendo al estado anterior.

Por defecto, muchas conexiones JDBC están en modo **auto-commit**, es decir, cada operación se ejecuta y confirma automáticamente. Para usar transacciones de forma manual, debes desactivar este modo:

        conexion.autoCommit = false


## Manejo de excepciones


El manejo de excepciones en las transacciones es absolutamente necesario para garantizar que los datos de la base de datos no queden en un estado inconsistente o corrupto cuando ocurre un error durante una operación.

👉  Cuando realizamos varias operaciones dentro de una misma transacción (por ejemplo, una transferencia bancaria), pueden ocurrir errores como:

- un fallo de conexión,
- un ID incorrecto,
- un valor nulo inesperado,
- un error lógico como saldo insuficiente.
  
👉  Si no controlamos esos errores, la base de datos podría:

- Aplicar solo algunas de las operaciones
- Dejar datos parcialmente modificados
- Generar resultados incorrectos para otros usuarios

👉  Para evitarlo se utiliza un bloque **try-catch** que:

- Llama a commit() si todo sale bien
- Llama a rollback() si ocurre cualquier excepción


        try {
            conexion.autoCommit = false

            // Varias operaciones SQL...
            conexion.commit()  // Todo bien
        } catch (e: Exception) {
            conexion.rollback()  // Algo falló → revertir
            println("Error en la transacción. Cambios anulados.")
        }


📌 “Una transacción sin control de errores no es una transacción segura. Siempre hay que estar preparado para deshacer todo si algo sale mal.”



**Ejemplo práctico: transferencia entre cuentas**

Supongamos que quieres transferir 100 € del cliente A al cliente B. Debes:

- Restar 100 € de la cuenta de A.
- Sumar 100 € a la cuenta de B.

Ambas operaciones deben realizarse juntas, o ninguna.   

        val url = "jdbc:postgresql://localhost:5432/banco"
        val user = "postgres"
        val pass = "admin"

        DriverManager.getConnection(url, user, pass).use { conn ->
            try {
                conn.autoCommit = false  // Iniciar transacción manual

                // Restar saldo a A
                val restar = conn.prepareStatement("UPDATE cuentas SET saldo = saldo - 100 WHERE id = ?")
                restar.setInt(1, 1)  // Cliente A
                restar.executeUpdate()

                // Añadir saldo a B
                val sumar = conn.prepareStatement("UPDATE cuentas SET saldo = saldo + 100 WHERE id = ?")
                sumar.setInt(1, 2)  // Cliente B
                sumar.executeUpdate()

                // Confirmar cambios
                conn.commit()
                println("Transferencia realizada con éxito.")
            } catch (e: Exception) {
                conn.rollback() // Revertir si ocurre un error
                println("Error en la transferencia. Operación anulada.")
                e.printStackTrace()
            }
        }
