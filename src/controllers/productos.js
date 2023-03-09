const e = require('express')
const connection = require('../connection')
const c = console.log

const crear = (req, res) => {
    const data = req.body 
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
}

const editar = (req, res) => {
    /* Recibimos el identificador del usuario para consular y actualizar */
    const { id } = req.params
    const data = req.body
     /* preparamos la sentencia SQL en una constante sql*/
     const sql = `UPDATE productos SET 
        descripcion='${data.descripcion}',
        categoria='${data.categoria}', 
        marca='${data.marca}',
        costo='${data.costo}',
        precio='${data.precio}',
        cantidad_actual='${data.cantidad_actual}'
        WHERE id =${id}`
 
     /* ejecutamos la sentencia */
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
}

const eliminar = (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM productos WHERE id = ${id} `
    const sqlProductos = "SELECT * FROM productos"
    
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
}




module.exports = {
    crear,
    eliminar,
    editar
}