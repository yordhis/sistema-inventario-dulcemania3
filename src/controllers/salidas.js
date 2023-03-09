const connection = require('../connection')
const c = console.log 

const crear = (req, res) => {
    const data = req.body 
    const sqlProducto = `SELECT id, cantidad_actual, codigo FROM productos WHERE codigo=${data.id_producto}`
    connection.query(sqlProducto, (err, resultProducto)=>{
        if (err) {
            c(err)
        } else {
            const sqlClientes = "SELECT * FROM clientes"
            connection.query(sqlClientes, (err, resultClientes)=>{
                if(err){
                    c(err)
                }else{
                    const sqlSalidas = `SELECT C.id, C.id_producto, C.id_cliente, cantidad, fecha, concepto, P.descripcion, E.nombre FROM salidas C
                    JOIN productos P ON C.id_producto = P.id
                    JOIN clientes E ON C.id_cliente = E.id
                     `
                   if(resultProducto[0]){
                        data.id_producto = resultProducto[0].id
                        const sqlInsertar = "INSERT INTO salidas SET ?"
                        if(parseInt(data.cantidad) > parseInt(resultProducto[0].cantidad_actual)){
                            data.id_producto = resultProducto[0].codigo
                            return res.render('salidas', {
                                message: `No hay suficiente Stock de este producto para procesar la salida, la cantidad actual del producto es de: ${resultProducto[0].cantidad_actual} unidades.`,
                                alert: 'danger',
                                dataUser: req.session,
                                dataSalida: data,
                                salidas: [],
                                metodo: 'crear',
                                clientes: resultClientes
                            })
                        }
                        connection.query(sqlInsertar, data, (err, resultInsertar)=>{
                            if(err){
                                c(err)
                            }else{
                               
                                connection.query(sqlSalidas, (err, resultSalidas)=>{
                                    if (err) {
                                        data.id_producto = resultProducto[0].codigo
                                        return res.render('salidas', {
                                            message: `Ha ocurrido un error al consultar las salidas, Info del error: ${err}`,
                                            alert: 'danger',
                                            dataUser: req.session,
                                            dataSalida: data,
                                            salidas: [],
                                            metodo: 'crear',
                                            clientes: resultClientes
                                        })
                                    } else {

                                        const cantidad_actualizada = parseInt(resultProducto[0].cantidad_actual) - parseInt(data.cantidad)

                                        const sqlActualizarCantidadProducto=`UPDATE productos SET cantidad_actual=${cantidad_actualizada} WHERE id=${data.id_producto} `

                                        connection.query(sqlActualizarCantidadProducto, (err, result)=>{
                                            if (err) {
                                                return res.render('salidas', {
                                                    message: `Ocurrio un error info: ${err}`,
                                                    alert: 'danger',
                                                    dataUser: req.session,
                                                    dataSalida: {},
                                                    salidas: resultSalidas,
                                                    metodo: 'crear',
                                                    clientes: resultClientes
                                                }) 
                                            } else {
                                                return res.render('salidas', {
                                                    message: "Se proceso correctamente la salida de stock.",
                                                    alert: 'success',
                                                    dataUser: req.session,
                                                    dataSalida: {},
                                                    salidas: resultSalidas,
                                                    metodo: 'crear',
                                                    clientes: resultClientes
                                                }) 
                                            }
                                        })
                                    }
                                })
                            }
                        })  
                   }else{
                   
                    connection.query(sqlSalidas, (err, resultSalidas) =>{
                        if(err){
                            c(err)
                        }else{
                            return res.render('salidas', {
                                message: 'El código del producto no existe, por favor intente con otro.',
                                alert: 'danger',
                                dataUser: req.session,
                                dataSalida: data,
                                salidas: resultSalidas,
                                metodo: 'crear',
                                clientes: resultClientes
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
    const sql = `DELETE FROM salidas WHERE id = ${id} `
    
            connection.query(sql, (err, result)=>{
                if(err){
                    res.render('salidas', {
                        message: `Ups, Error en el eliminar la salida, Info del error: ${err}`,
                        alert: 'danger',
                        dataUser: req.session,
                        dataEntrada: {},
                        entradas: [],
                        metodo: 'crear'
                    })
                }else{
                    res.redirect('/pages/procesar-salida')
                }
            })
}

module.exports = {
    crear,
    eliminar
}