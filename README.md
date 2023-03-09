# Sistema de inventario 
### Dulcemania_3

## Dependencias usadas
~~~
"dependencies": {
    "bcrypt": "^5.1.0",
    "ejs": "^3.1.8",
    "express": "^4.18.1",
    "express-session": "^1.17.3",
    "mysql": "^2.18.1"
  },
~~~

## Modelo de Trabajo 
En este proyecto se implemento el Modelo - Vista - Controlador (MVC)
como metodologia de desarrollo de software.

## Como instalar
1. Instalar Xampp en su pc
2. Crear una base de datos con el nombre de (stock_dulcemania)
3. Nos dirigimos al repositorio y clonamos el proyecto [Github] https://github.com/yordhis/sistema-inventario-dulcemania3
4. Despues de clonar el proyecto debemos contar que en la pc ya tenemos NODE.JS sino se debe instalar
5. Teniendo Instalado Node.js procedemos a ejecutar el siguiente comando
~~~
        npm install
~~~

###### Este comando instalará todas las dependencias que el proyecto necesita que estan indicadas en el package.json

6. Al terminar de instalar las dependencias se puede ejecutar el siguiente comando que sirve para poner en marcha el servidor
~~~
        npm run server
~~~

7. Antes de acceder a la aplicacion que debe estar corriendo en http://localhost:3000 debemos crear las tablas en phpmyadmin que es el siguiente modelo entidad relación en nuestro figma:
[figma] https://www.figma.com/file/rjBSe7HeMOocBdxe3wbXXW/DB_Dulcemania_3?node-id=0-1&t=zrn2DlE88U5lNoim-0

8. Al terminar de crear todas las tablas de la base de datos ya tienes el sistema funcionando al 100%

# Arquitectura de directorios
- dulcemania_3
    - src
        - controllers
            > Los controladores son los que se encargan de recibir y entregar peticiones y respuestas
        - routes
            > Las rutas son los puntos de acceso a los controladores y vistas
        - public
            > El directorio publico es donde accedemos a las imagenes, estilos css y JavaScript adicional
        - view
            > Las vistas son los archivos html que van a interactuar con el usuario final
        - config.js
            > El archivo de configuración es donde almacenamos las llaves de conexión a la base de datos
        - connection.js
            > El archivo de conexión es donde ejecutamos el enlace a la base de datos y este archivo es exportado para toda la app con el fin de ejecutar las sentencia SQL donde sea requerido
        - index.js
            > El archivo index es donde tenemos todas las configuraciones del servidor, como el puerto, url, el uso de las rutas, y entre otros.
        - packega.json
            > El Archivo json de los paquetes o dependencia de nuestro proyecto esta aqui.

# MySQL

En esta sección se definen y explican las consultas a la base de datos

## SELECT
~~~
// Esta sentencia SQL me trae todos los producto en un array o arreglo
// en la variable sqlProductos
    const sqlProductos = "SELECT * FROM productos"
    connection.query(sqlProductos, (err, result) =>{
        if(err){
            c(err)
        }else{
          
            res.render('dulcemania-panel', {
               productos: result,
               message: undefined,
               alert: undefined,
               dataUser:req.session
            })
        }
    })
~~~
## INSERT

~~~
/*
    La sentencia SQL INSERT INTO es usada para realizar los registros o inserciones de nuevas filas de datos a las tablas de nuestro DB e igual al UPDATE se usa SET para espesificar que se van a insertar los siguientes datos; pero en este caso despues del SET tenemos un signo de interrogación ? esto no dice que se debe preparar una variable o constante con los datos a insertar. 
*/
    const sqlInsertar = "INSERT INTO productos SET ?"
    const sqlConsulta = `SELECT codigo FROM productos WHERE codigo='${data.codigo}' `
    

    connection.query(sqlConsulta, (err, resultCodigo) =>{
        if (err) {
            c(err)
        } else {
            if(resultCodigo[0]){
                return res.render('form-producto', {
                    message: "Este código ya existe, intente con otro",
                    alert: 'danger',
                    dataUser: req.session,
                    dataProducto: data,
                    metodo: 'crear'
                })
            }else{
                /*
                    Aqui se ejecuta la sentencia INSERT y como vemos ahora el metodo QUERY ademas de recibir la sentencia sql tambien recibe una contante data la cual tiene los datos del producto nuevo.
                */
                connection.query(sqlInsertar, data, (err, resultInsertar)=>{
                    if(err){
                        c(err)
                    }else{
                        return res.render('form-producto', {
                            message: "Se registro correctamente el producto.",
                            alert: 'success',
                            dataUser: req.session,
                            dataProducto: {},
                            metodo: 'crear'
                        })
                    }
                })
            }
        }
    })
~~~

## UPDATE

~~~
/* preparamos la sentencia SQL en una constante sql*/
/* 
    Esta sentecia SQL es para actualizar datos de una fila espesifica de una tabla
    en este caso vemos que se desea actualizar de la tabla productos y con la palabra reservada SET ingresamos los nuevos datos colocando cada nombre de las columnas 
    de manera identica a la base de datos y con el = le asignamos el valor enviado por el formulario
 */
     const sql = `UPDATE productos SET 
        descripcion='${data.descripcion}',
        categoria='${data.categoria}', 
        marca='${data.marca}',
        costo='${data.costo}',
        precio='${data.precio}',
        cantidad_actual='${data.cantidad_actual}'
        WHERE id =${id}`
 
     /* ejecutamos la sentencia */
     /* 
        con las constante CONNECTION que posee el metodo QUERY podemos ejecutar la
        la sentencia SQL escrita anteriormente, por lo tanto el método QUERY recibe 
        varios parametros y en este caso recibe la constante SQL y un callback esto se conoce como una función o metodo y ese callback retorna dos argumentos 
        1. err -> el error si falla la consulta
        2. result -> el Resultado si todo anda bien
      */
     connection.query(sql, (err, result) =>{
         if (err){
            res.render('form-producto', {
                message: `Ups, Error al editar el producto, Info: ${err}`,
                alert: 'danger',
                dataUser: req.session,
                dataProducto: data,
                metodo: 'editar'
            })
         }else{
            const sqlProducto = `SELECT * FROM productos WHERE id=${id} `
            connection.query(sqlProducto, (err, resultProducto) => {
                if(err){
                    c(err)
                }else{
                    res.render('form-producto', {
                        message: "El porducto se actualizó correctamente.",
                        alert: 'success',
                        dataUser: req.session,
                        dataProducto: resultProducto[0],
                        metodo: 'editar'
                    })
                }
            })
         }
     })
~~~

## DELETE

~~~
/*
    La sentencia DELETE es una de las mas sencillas de ejecutar solo se necesita el 
    id o codigo unico para localizar y eliminar la fila de la tabla deseada para ser 
    espesificos con la eliminación de una fila se usa la palabra reservada WHERE que
    significa DONDE y despues viene la condición que espesifica el donde id = ${id}
*/
const sql = `DELETE FROM productos WHERE id = ${id} `
    const sqlProductos = "SELECT * FROM productos"

            /* Aqui Ejecuta la eliminación */
            connection.query(sql, (err, result)=>{
                if(err){
                    res.render('dulcemania-panel', {
                        message: `Ups, Error en el eliminar el producto, Info: ${err}`,
                        alert: 'danger',
                        dataUser: req.session,
                        productos: resultProductos
                    })
                }else{

                    connection.query(sqlProductos, (err, resultProductos) =>{
                        if(err){
                            c(err)
                        }else{
                            res.render('dulcemania-panel', {
                                message: "El porducto se elimino correctamente del inventario",
                                alert: 'success',
                                dataUser: req.session,
                                productos: resultProductos
                            })
                        }
                    })
                }
            })
~~~

## CONSULTAS A MULTIPLE TABLAS CON ----JOIN----
~~~
    /*
        Las sentecias de SQL de consultas multiples son las mas utiles en los casos
        de varias indexaciones de llaves foraneas y nos permiten obtener los datos de
        otras tablas desde una sola consulta o sentencia SQL en el siguiente caso 
        podemos visualizar como usamos la palabra reservada JOIN para unir tablas
        la cual llamamos por su nombre (productos) y le asignamos una letran en Mayuscula asi (productos P) la letra P nos permite acceder a los datos de esta tabla como sifuera un objeto y accedemos a sus atributos y por otra parte la tabla que posee todas las indexaciones es SALIDAS y a esa table se le asigno la letra C y dentro del SELECT solicitamos los datos que deseamos de las tablas en cuestion  
    */
    const sqlSalidas = `SELECT C.id, C.id_producto, C.id_cliente, cantidad, fecha, concepto, P.descripcion, E.nombre FROM salidas C
    JOIN productos P ON C.id_producto = P.id
    JOIN clientes E ON C.id_cliente = E.id
     `
    connection.query(sqlSalidas, (err, resultSalidas)=>{
        if(err){
            c(err)
        }else{ 
            const sqlProveedores ="SELECT id, codigo, nombre FROM clientes"
            connection.query(sqlProveedores, (err, resultClientes)=>{
               
                if(err){
                    res.render('salidas', {
                        dataSalida: {},
                        message: `${err}`,
                        alert: 'danger',
                        dataUser:req.session,
                        metodo: 'crear',
                        salidas: resultSalidas,
                        proveedores: []          
                    })
                }else{
                    res.render('salidas', {
                        dataSalida: {},
                        message: undefined,
                        alert: 'danger',
                        dataUser:req.session,
                        metodo: 'crear',
                        salidas: resultSalidas,
                        clientes: resultClientes          
                    })
                }
            })
            
       
        }
    })
~~~