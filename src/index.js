const express = require('express')
const app = express()
// const connection = require('./connection')
const userRoute = require('./routes/users')
const pageRoute = require('./routes/pages')
const productoRoute = require('./routes/productos')
const proveedorRoute = require('./routes/proveedores')
const clienteRoute = require('./routes/clientes')
const entradaRoute = require('./routes/entradas')
const salidaRoute = require('./routes/salidas')

const path = require('path')
const session = require('express-session')

// SETTING (LAS CONFIGURACIONES GLOBALES DE NODE.JS)
// PODEMOS ACCEDER DE LA SIGUIENTE MANERA
app.set('title', 'Dulcemania')
app.set('port', 3000)

// se configura el motor de plantillas
app.set('view engine', 'ejs')

// se configura la direccion de las platillas
app.set('views', path.join(__dirname, 'views'))

// Esto nos permite ver los datos enviados
app.use(express.urlencoded({extended:false}))

// Modulo para manejar las sesiones
app.use(session({
    secret: 'my_secret'
}))




app.use(express.static(path.join(__dirname, 'public')))

// --IMPORTAR RUTAS--  *******************
app.get("/", (req, res) => {
    // res.send('Bienvenido a mi app express')
    res.render('index', {message: '', data:{}})
})



// En esta parte importamos todas las rutas de la aplicación
app.use("/usuarios", userRoute)
app.use("/pages", pageRoute)
app.use("/productos", productoRoute)
app.use("/proveedores", proveedorRoute)
app.use("/clientes", clienteRoute)
app.use("/entradas", entradaRoute)
app.use("/salidas", salidaRoute)



// Escuchamos el servidor
app.listen(app.get('port'), () => {
    console.log(app.get('title') + " esta corriendo en http://localhost:" + app.get('port'))
})