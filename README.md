TFG Pádel Backend
======
Este proyecto es el backend de una aplicación capaz de gestionar torneos de pádel con liga en modo Ranking de Pádel.
Esta aplicación es capaz de gestionar el registro e inicio de sesión de usuarios. Con ella los usuarios también podrán crear e inscribirse a torneos, subir los resultados de un partido, confirmar los resultados de un partido, comunicarse con otros jugadores, etc. Las peticiones al backend se realizan a través de la API aqui detallada.

## Instalación
Para instalar y ejecutar correctamente será necesario:

1. Tener instalado [Git](https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git).
2. Tener instalado [Node.js 11.8.x](https://nodejs.org/es/download/) o superior.
3. Clonar el repositorio con el comando `git clone https://github.com/Achito/padel.git`
4. Tener instalado [MySQL 8.0.x](https://dev.mysql.com/downloads/installer/).
5. Ejecutar `npm install` en el nuevo directorio clonado para instalar las dependencias necesarias para que funcione el servidor.
6. [Crear una base de datos desde la consola de MySQL](http://www.oscarabadfolgueira.com/crear-una-base-datos-mysql-desde-consola/). Luego habrá que insertar el nombre de la base de datos en el punto 10.
8. Estar registrado en la plataforma [SendGrid](https://sendgrid.com/), la cual gestiona el envío de emails.
9. Obtener una clave para usar la API de [SendGrid](https://sendgrid.com/).
10. Abrir el archivo 'config/config.json' y modificar:

	* Los valores para comunicarse con la base de datos. Usuario, contraseña, nombre de la base de datos y dirección. El valor de `dialect` no se debe modificar.
	* La cadena de texto secreta para encriptar el JSON Web Token. Este secreto debe ser el mismo en el frontend que se conecte a la aplicación a través de la API.
	* La clave de la API de SendGrid para que la aplicación pueda enviar emails.

11. Desde la consola, dentro del directorio principal del servidor ejecutar `sequelize db:migrate` para crear las tablas en la base de datos. Si al ejecutar sale el siguiente error `MySQL Error: : 'Access denied for user 'root'@'localhost'` ejecutar en un terminal los siguientes comandos.
`sudo mysql`
`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tucontraseña';`








