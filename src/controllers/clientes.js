const connection = require('../connection')
const c = console.log

const consultar = (req, res) => {
    const sql = "SELECT * FROM clientes"
    connection.query(sql, (err, result) => {
        if(err){
            res.render('cliente', {
                clientes: [],
                alert: undefined,
                dataUser: req.session,
                dataCliente: {},
                metodo: 'crear',
                message: `Fallo al consultar los clientes. Info err: ${err}`
            })
        }else{
            res.render('cliente', {
                clientes: result,
                alert: undefined,
                dataUser: req.session,
                dataCliente: {},
                metodo: 'crear',
                message: undefined
            })
        }
    })
}

const crear = (req, res) => {
    const data = req.body 
    const sqlConsulta = `SELECT codigo FROM clientes WHERE codigo='${data.codigo}' `
    
    connection.query(sqlConsulta, (err, resultCodigo) =>{
        if (err) {
            c(err)
        } else {
            if(resultCodigo[0]){
                const sqlClientes = "SELECT * FROM clientes"
                connection.query(sqlClientes, (err, resultClientes)=> {
                    if(err){
                        c(err)
                    }else{
                        return res.render('clientes', {
                            message: "Este código ya existe, intente con otro",
                            alert: 'danger',
                            dataUser: req.session,
                            dataCliente: data,
                            clientes: resultClientes,
                            metodo: 'crear'
                        })
                    }
                })
                
            }else{
                const sqlInsertar = "INSERT INTO clientes SET ?"
                connection.query(sqlInsertar, data, (err, resultInsertar)=>{
                    if(err){
                        c(err)
                    }else{
                        const sqlClientes = "SELECT * FROM clientes"
                        connection.query(sqlClientes, (err, resultClientes)=>{
                            if (err) {
                                return res.render('clientes', {
                                    message: `Ha ocurrido un error al consultar los clientes, Info del error: ${err}`,
                                    alert: 'danger',
                                    dataUser: req.session,
                                    dataCliente: data,
                                    clientes: [],
                                    metodo: 'crear'
                                })
                            } else {
                                return res.render('clientes', {
                                    message: "Se registro correctamente el Cliente.",
                                    alert: 'success',
                                    dataUser: req.session,
                                    dataCliente: {},
                                    clientes: resultClientes,
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
     const sql = `UPDATE clientes SET 
        codigo='${data.codigo}',
        nombre='${data.nombre}', 
        telefono='${data.telefono}',
        direccion='${data.direccion}'
        WHERE id= ${id} `
 
     /* ejecutamos la sentencia */
     connection.query(sql, (err, result) =>{
         if (err){
            res.render('clientes', {
                message: `Ups, Error al editar el cliente, Info del error: ${err}`,
                alert: 'danger',
                dataUser: req.session,
                dataCliente: data,
                metodo: 'editar',
                clientes: []
            })
         }else{
            if(result){
                const sqlCliente = `SELECT * FROM clientes WHERE id=${id} `
                connection.query(sqlCliente, (err, resultCliente) => {
                    if(err){
                        res.render('clientes', {
                            message: `Ha ocurrido un error al consultar el cliente. info del error: ${err}`,
                            alert: 'danger',
                            dataUser: req.session,
                            dataCliente: resultCliente[0],
                            metodo: 'editar',
                            clientes: []
                        })
                    }else{
                        const sqlClientes = "SELECT * FROM clientes"
                        connection.query(sqlClientes, (err, resultClientes)=>{
                            if(err){
                                res.render('clientes', {
                                    message: `Ha ocurrido un error al consultar todos los Clientes. info del error: ${err}`,
                                    alert: 'danger',
                                    dataUser: req.session,
                                    dataCliente: resultCliente[0],
                                    clientes: resultClientes,
                                    metodo: 'editar'
                                })
                            }else{
                                res.render('clientes', {
                                    message: "El cliente se actualizó correctamente.",
                                    alert: 'success',
                                    dataUser: req.session,
                                    dataCliente: resultCliente[0],
                                    clientes: resultClientes,
                                    metodo: 'editar'
                                })
                            }
                        })
                    }
                })
            }else{
                const sqlClientes = "SELECT * FROM clientes"
                connection.query(sqlClientes, (err, resultClientes) =>{
                    if(err){
                        c(err)
                    }else{
                        res.render('clientes', {
                            message: "Este cliente no existe",
                            alert: 'danger',
                            dataUser: req.session,
                            dataCliente: data,
                            metodo: 'editar',
                            clientes: resultClientes
        
                        })
                    }
                })
               
            }
         }
     })
}


const eliminar = (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM clientes WHERE id = ${id} `
    
            connection.query(sql, (err, result)=>{
                if(err){
                    res.render('clientes', {
                        message: `Ups, Error en el eliminar el cliente, Info del error: ${err}`,
                        alert: 'danger',
                        dataUser: req.session,
                        dataCliente: {},
                        clientes: resultClientes,
                        metodo: 'crear'


                    })
                }else{
                    const sqlClientes = "SELECT * FROM clientes"
                    connection.query(sqlClientes, (err, resultClientes) =>{
                        if(err){
                            res.render('clientes', {
                                message: `Ups, Error al consultar los Clientes, Info del error: ${err}`,
                                alert: 'danger',
                                dataUser: req.session,
                                dataCliente: {},
                                clientes: resultClientes,
                                metodo: 'crear'
        
                            })
                        }else{
                            res.render('clientes', {
                                message: "El cliente se elimino correctamente.",
                                alert: 'success',
                                dataUser: req.session,
                                dataCliente: {},
                                clientes: resultClientes,
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