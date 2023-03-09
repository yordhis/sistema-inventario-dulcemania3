const connection = require('../connection')
const bcrypt = require('bcrypt')
const { verificandoNombreDeUsuario, getDato, setDato }  = require('./helper/userHelper')
const c = console.log

/** VISTAS */

const getUsers = (req, res) => {
    /* Creamos una constante sql donde tendra la consulta */
    const sql = 'SELECT * FROM usuarios'

    /**
     * Ejecutamos la consulta
     * El objeto -connection- posee
     * @method query
     * El metodo query se encarga de ejecutar la consulta  y recibe dos parametros: 
     * @param sql
     * @param callback
     * el callback hace referencia a un función que nos va a retornar 
     * dos argumentos 
     * @argument err
     * @argument result
     * 
     */

    connection.query(sql, (err, result)=>{
        if (err){
            console.log('Ha ocurrido un error en la consulta de usuarios')
        }else{
           res.render('usuarios', {usuarios: result})
        }
    })
}

/* Este función renderiza la vista del formulario de actualización de usuarios */
const getUpdateUser = (req, res) => {
    const param = req.params.id
    const sql = `SELECT * FROM usuarios WHERE id=${param}`
    connection.query(sql, (err, result)=>{
        if(err){
            c("Ha ocurrido un error: " + err)
        }else{
            // c(result)
            res.render('update-user', {usuarios: result})
        }

    })

}

/* Este función renderiza la vista del formulario de eliminar de usuarios y redirecciona a la lista de usuarios */
const getDeleteUser = (req, res) => {
    /* Recibimos el identificador del usuario para consular y actualizar */
    const param = req.params.id
    /* preparamos la sentencia SQL en una constante sql*/
    const sql = `SELECT * FROM  usuarios WHERE id = ${param}`
    /* ejecutamos la sentencia */
    connection.query(sql, (err, result)=>{
        if (err){
            c("Ha ocurrido un error al eliminar: " + err)
        }else{
            c(result)
            res.render('delete-user', { usuarios: result})
        }
    })
}

/* Este función renderiza la vista del formulario de registro de usuarios*/
const getRegister = (req, res) => {
    res.render('registrar-usuario', {message: '', data: {} })
}

/** ACCIONES */

/* Esta función se encarga de actualizar los datos del usuario */
const updateUser = (req, res) => {
    /* Recibimos el identificador del usuario para consular y actualizar */
    const param = req.params.id
    /* preparamos la sentencia SQL en una constante sql*/
    const sql = `UPDATE usuarios SET nombre_usuario='${req.body.nombreUsuario}', clave=${req.body.clave}, rol=${req.body.rol} WHERE id =${param}`

    /* ejecutamos la sentencia */
    connection.query(sql, (err, result) =>{
        if (err){
            c("Ha ocurrido un error: " + err)
        }else{
            c("Usuario actualizado")
            /* Redireccionamos a la lista de usuarios */
            res.redirect('/usuarios/todos')
        }
    })
}

/* esta función se encarga de eliminar un usuario */
const deleteUser = (req, res) => {
    const param = req.params.id
    const sql = `DELETE FROM usuarios WHERE id = ${param} `
    connection.query(sql, (err, result)=>{
        if(err){
            c("Ha ocurrido un error al eliminar usuario" + err)
        }else{
            res.redirect('/usuarios/todos')
        }
    })
    
}

/* Esta función registra los usuario */
const register = (req, res) => {
    const data = {}
  
    const sql = "INSERT INTO usuarios SET ?"
    const {nombre_usuario, clave, confirmar_clave} = req.body

    verificandoNombreDeUsuario(nombre_usuario)
    if(getDato().length){
        setDato(null)
        return res.render('registrar-usuario', {message: "Este nombre de usuario ya esta registrado.", data: req.body})
    }

    if(clave != confirmar_clave) return res.render('registrar-usuario', {message: "Las claves no coinciden.", data: req.body})

    data.nombre_usuario = nombre_usuario
    data.rol = 'admin'
    data.clave = bcrypt.hashSync(clave, 10)
    connection.query(sql,data, (err, result)=>{
        if (err){
           return res.render('registrar-usuario', {message: "No se pudo registrar intente con otro nombre de usuario.", data: req.body})
        }else{
            c('Registro exitoso')
            const response = {
                message: "Se ha registrado exitosamente, puedes iniciar sesión.",
                status: 201
            }
            res.render('index', response)
        }
    })
}

/* Esta función se encarga de iniciar la sesión */

const login = (req, res)=>{
    const {nombre_usuario, clave} = req.body
    const sql = ` SELECT * FROM usuarios WHERE nombre_usuario = '${nombre_usuario}' `

    connection.query(sql, (err, result)=>{
        if (err) {
            return res.render('index', {message: "Error no se pudo realizar la consulta", data: req.body})
        } else {
            const data = result[0]
            if(data){
                if(bcrypt.compareSync(clave, data.clave)){
                    req.session.nombre_usuario = data.nombre_usuario
                    req.session.rol = data.rol
                    req.session.id = data.id
                    res.redirect('/pages/panel')
                }else{
                    res.send("Contraseña incorrecta")
                }
            }else{
                return res.render('index', {message: "El usuario no existe", data: req.body})
            }
        }   
    })
}

const salir = (req, res) => {
     // eliminar una session
     delete req.session.nombre_usuario
     delete req.session.rol
     delete req.session.id
     return res.redirect('/')
}


module.exports = { 
    /** VISTAS */
        getUsers,  
        getUpdateUser, 
        getDeleteUser,
        getRegister,

    /** ACCIONES */
        register,
        updateUser,
        deleteUser,
        login,
        salir
    
    }