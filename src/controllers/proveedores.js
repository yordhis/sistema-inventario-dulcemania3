const connection = require('../connection')
const c = console.log

const consultar = (req, res) => {
    const sql = "SELECT * FROM proveedores"
    connection.query(sql, (err, result) => {
        if(err){
            res.render('proveerdores', {
                proveedores: [],
                alert: undefined,
                dataUser: req.session,
                dataProveedor: {},
                metodo: undefined,
                message: `Fallo al consultar los provedores. Info err: ${err}`
            })
        }else{
            res.render('proveerdores', {
                proveedores: result,
                alert: undefined,
                dataUser: req.session,
                dataProveedor: {},
                metodo: undefined,
                message: undefined
            })
        }
    })
}

const crear = (req, res) => {
    const data = req.body 
    const sqlConsulta = `SELECT codigo FROM proveedores WHERE codigo='${data.codigo}' `
    

    connection.query(sqlConsulta, (err, resultCodigo) =>{
        if (err) {
            c(err)
        } else {
            if(resultCodigo[0]){
                const sqlProveedores = "SELECT * FROM proveedores"
                connection.query(sqlProveedores, (err, resultProveedores)=> {
                    if(err){

                    }else{
                        return res.render('proveedores', {
                            message: "Este código ya existe, intente con otro",
                            alert: 'danger',
                            dataUser: req.session,
                            dataProveedor: data,
                            proveedores: resultProveedores,
                            metodo: 'crear'
                        })
                    }
                })
                
            }else{
                const sqlInsertar = "INSERT INTO proveedores SET ?"
                connection.query(sqlInsertar, data, (err, resultInsertar)=>{
                    if(err){
                        c(err)
                    }else{
                        const sqlProveedores = "SELECT * FROM proveedores"
                        connection.query(sqlProveedores, (err, resultProveedores)=>{
                            if (err) {
                                return res.render('proveedores', {
                                    message: `Ha ocurrido un error al consultar los proveedores, Info del error: ${err}`,
                                    alert: 'danger',
                                    dataUser: req.session,
                                    dataProveedor: data,
                                    proveedores: [],
                                    metodo: 'crear'
                                })
                            } else {
                                return res.render('proveedores', {
                                    message: "Se registro correctamente el Proveedor.",
                                    alert: 'success',
                                    dataUser: req.session,
                                    dataProveedor: {},
                                    proveedores: resultProveedores,
                                    metodo: 'crear'
                                })
                            }
                        })
                    }
                })
            }
        }
    })
}

const editar = (req, res) => {
    /* Recibimos el identificador del usuario para consular y actualizar */
    const { id } = req.params
    const data = req.body
    data['id'] = id
     /* preparamos la sentencia SQL en una constante sql*/
     const sql = `UPDATE proveedores SET 
        codigo='${data.codigo}',
        nombre='${data.nombre}', 
        contacto='${data.contacto}',
        direccion='${data.direccion}'
        WHERE id =${id}`
 
     /* ejecutamos la sentencia */
     connection.query(sql, (err, result) =>{
         if (err){
            res.render('proveedores', {
                message: `Ups, Error al editar el producto, Info del error: ${err}`,
                alert: 'danger',
                dataUser: req.session,
                dataProveedor: data,
                metodo: 'editar',
                proveedores: []
            })
         }else{
            if(result){
                const sqlProveedor = `SELECT * FROM proveedores WHERE id=${id} `
                connection.query(sqlProveedor, (err, resultProveedor) => {
                    if(err){
                        res.render('proveedores', {
                            message: `Ha ocurrido un error al consultar el proveedor. info del error: ${err}`,
                            alert: 'danger',
                            dataUser: req.session,
                            dataProveedor: resultProveedor[0],
                            metodo: 'editar'
                        })
                    }else{
                        const sqlProveedores = "SELECT * FROM proveedores"
                        connection.query(sqlProveedores, (err, resultProveedores)=>{
                            if(err){
                                res.render('proveedores', {
                                    message: `Ha ocurrido un error al consultar todos los proveedores. info del error: ${err}`,
                                    alert: 'danger',
                                    dataUser: req.session,
                                    dataProveedor: resultProveedor[0],
                                    proveedores: resultProveedores,
                                    metodo: 'editar'
                                })
                            }else{
                                res.render('proveedores', {
                                    message: "El porducto se actualizó correctamente.",
                                    alert: 'success',
                                    dataUser: req.session,
                                    dataProveedor: resultProveedor[0],
                                    proveedores: resultProveedores,
                                    metodo: 'editar'
                                })
                            }
                        })
                    }
                })
            }else{
                const sqlProveedores = "SELECT * FROM proveedores"
                connection.query(sqlProveedores, (err, resultProveedores) =>{
                    if(err){
                        c(err)
                    }else{
                        res.render('proveedores', {
                            message: "Este proveedor no existe",
                            alert: 'danger',
                            dataUser: req.session,
                            dataProveedor: data,
                            metodo: 'editar',
                            proveedores: resultProveedores
        
                        })
                    }
                })
            }
         }
     })
}


const eliminar = (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM proveedores WHERE id = ${id} `
    
            connection.query(sql, (err, result)=>{
                if(err){
                    res.render('proveedores', {
                        message: `Ups, Error en el eliminar el proveedor, Info del error: ${err}`,
                        alert: 'danger',
                        dataUser: req.session,
                        dataProveedor: {},
                        proveedores: resultProveedores,
                        metodo: 'crear'


                    })
                }else{
                    const sqlProveedor = "SELECT * FROM proveedores"
                    connection.query(sqlProveedor, (err, resultProveedores) =>{
                        if(err){
                            res.render('proveedores', {
                                message: `Ups, Error al consultar los proveedores, Info del error: ${err}`,
                                alert: 'danger',
                                dataUser: req.session,
                                proveedores: resultProveedores,
                                metodo: 'crear'
        
                            })
                        }else{
                            res.render('proveedores', {
                                message: "El proveedor se elimino correctamente.",
                                alert: 'success',
                                dataUser: req.session,
                                dataProveedor: {},
                                proveedores: resultProveedores,
                                metodo: 'crear'
                            })
                        }
                    })
                }
            })
}

module.exports = {
    consultar,
    crear,
    editar,
    eliminar
}