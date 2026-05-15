# ERP Web

Aplicacion web de tipo ERP desarrollada con React y Supabase. El proyecto permite gestionar distintas areas basicas de una empresa desde una interfaz unica, incluyendo autenticacion de usuarios y modulos para proveedores, productos, pedidos y facturas.

## Descripcion general

La aplicacion esta orientada a centralizar operaciones de gestion empresarial en un entorno web. El acceso se realiza mediante registro e inicio de sesion, y una vez autenticado el usuario puede navegar entre los diferentes modulos del sistema.

Las principales funcionalidades implementadas actualmente son:

- registro de usuarios
- inicio y cierre de sesion
- gestion de proveedores
- gestion de productos
- gestion de pedidos
- gestion de facturas

## Tecnologias utilizadas

- React
- React Router DOM
- Supabase
- React Icons
- Create React App

## Requisitos previos

- Node.js
- npm
- acceso al proyecto en Supabase

## Instalacion

1. Clonar o descargar el proyecto.
2. Acceder a la carpeta raiz del proyecto.
3. Instalar las dependencias ejecutando `npm install`

El proyecto utiliza un cliente de Supabase definido en el archivo `src/supabaseClient.js`.

Para un entorno real, se recomienda configurar la URL del proyecto y la clave publica mediante variables de entorno, en lugar de dejarlas escritas directamente en el codigo.

Para iniciar la aplicacion en modo desarrollo ejecutar `npm start`

La aplicacion quedara disponible normalmente en http://localhost:3000

Para generar la version optimizada para produccion ejecutar `npm run build`

`npm test` ejecuta el entorno de pruebas.
