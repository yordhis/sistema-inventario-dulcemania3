const connection = require('../connection')
const c = console.log 

const crear = (req, res) => {
    const data = req.body 
    const sqlProducto = `SELECT id, cantidad_actual FROM productos WHERE codigo=${data.id_producto}`
    connection.query(sqlProducto, (err, resultProducto)=>{
        if (err) {
            c(err)
        } else {
            const sqlProveedores = "SELECT * FROM proveedores"
            connection.query(sqlProveedores, (err, resultProveedores)=>{
                if(err){
                    c(err)
                }else{
                    const sqlEntradas = `SELECT C.id_producto, C.id_proveedor, cantidad, fecha, P.descripcion, E.nombre FROM entradas C
                    JOIN productos P ON C.id_producto = P.id
                    JOIN proveedores E ON C.id_proveedor = E.id
                    `
                   if(resultProducto[0]){
                        data.id_producto = resultProducto[0].id
                        const sqlInsertar = "INSERT INTO entradas SET ?"
                        connection.query(sqlInsertar, data, (err, resultInsertar)=>{
                            if(err){
                                c(err)
                            }else{
                                
                                connection.query(sqlEntradas, (err, resultEntradas)=>{
                                    if (err) {
                                        return res.render('entradas', {
                                            message: `Ha ocurrido un error al consultar las entradas, Info del error: ${err}`,
                                            alert: 'danger',
                                            dataUser: req.session,
                                            dataEntrada: data,
                                            entradas: [],
                                            metodo: 'crear',
                                            proveedores: resultProveedores
                                        })
                                    } else {
                                        const cantidad_actualizada = parseInt(resultProducto[0].cantidad_actual) + parseInt(data.cantidad)
                                        const sqlActualizarCantidadProducto=`UPDATE productos SET cantidad_actual=${cantidad_actualizada} WHERE id=${data.id_producto} `

                                        connection.query(sqlActualizarCantidadProducto, (err, result)=>{
                                            if (err) {
                                                return res.render('entradas', {
                                                    message: `Ocurrio un error info: ${err}`,
                                                    alert: 'danger',
                                                    dataUser: req.session,
                                                    dataEntrada: {},
                                                    entradas: resultEntradas,
                                                    metodo: 'crear',
                                                    proveedores: resultProveedores
                                                }) 
                                            } else {
                                                return res.render('entradas', {
                                                    message: "Se proceso correctamente la entrada al stock.",
                                                    alert: 'success',
                                                    dataUser: req.session,
                                                    dataEntrada: {},
                                                    entradas: resultEntradas,
                                                    metodo: 'crear',
                                                    proveedores: resultProveedores
                                                }) 
                                            }
                                        })
                                    }
                                })
                            }
                        })  
                   }else{
                   
                    connection.query(sqlEntradas, (err, resultEntradas) =>{
                        if(err){
                            c(err)
                        }else{
                            return res.render('entradas', {
                                message: 'El código del producto no existe, por favor intente con otro.',
                                alert: 'danger',
                                dataUser: req.session,
                                dataEntrada: data,
                                entradas: resultEntradas,
                                metodo: 'crear',
                                proveedores: resultProveedores
                            })
                        }
                    })
                   }
                }
            })
        }
    })        
}
 

const eliminar = (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM entradas WHERE id = ${id} `
    
            connection.query(sql, (err, result)=>{
                if(err){
                    res.render('entradas', {
                        message: `Ups, Error en el eliminar la entrada, Info del error: ${err}`,
                        alert: 'danger',
                        dataUser: req.session,
                        dataEntrada: {},
                        entradas: [],
                        metodo: 'crear'
                    })
                }else{
                    res.redirect('/pages/procesar-entrada')
                }
            })
}

module.exports = {
    crear,
    eliminar
}