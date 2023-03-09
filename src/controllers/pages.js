const connection = require('../connection')
const c = console.log

const panel = (req, res) =>{
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
}

const crearProducto = (req, res) => {
    res.render('form-producto', {
        dataUser: req.session,
        message: undefined,
        alert: undefined,
        dataProducto: {},
        metodo: 'crear'
    })
}

const editarProducto = (req, res) => {
    const { id } = req.params
    const sqlProductos = `SELECT * FROM productos WHERE id=${id} `
    connection.query(sqlProductos, (err, result) =>{
        if(err){
            c(err)
        }else{
            
            res.render('form-producto', {
                dataProducto: result[0],
                message: undefined,
                alert: undefined,
                dataUser:req.session,
                metodo: 'editar'
               
            })
        }
    })
}

const registrarProveedor = (req, res) =>{
    const sqlProveedores = "SELECT * FROM proveedores"
    connection.query(sqlProveedores, (err, resultProveedores) =>{
        if(err){
            c(err)
        }else{
            
            res.render('proveedores', {
                dataProveedor: {},
                message: undefined,
                alert: undefined,
                dataUser:req.session,
                metodo: 'crear',
                proveedores: resultProveedores
            })
        }
    })
}

const editarProveedor = (req, res) =>{
    const {id} = req.params
    const sqlProveedores = "SELECT * FROM proveedores"
    connection.query(sqlProveedores, (err, resultProveedores)=>{
        if(err){

        }else{
            const sqlProveedor = `SELECT * FROM proveedores WHERE id=${id} `
            connection.query(sqlProveedor, (err, resultProveedor) =>{
                if(err){
                    c(err)
                }else{
                    
                    res.render('proveedores', {
                        dataProveedor: resultProveedor[0],
                        message: undefined,
                        alert: undefined,
                        dataUser:req.session,
                        metodo: 'editar',
                        proveedores: resultProveedores
                    })
                }
            })
        }
    })

   
}

const registrarCliente = (req, res) =>{
    const sqlClientes = "SELECT * FROM clientes"
    connection.query(sqlClientes, (err, resultClientes) =>{
        if(err){
            c(err)
        }else{
            
            res.render('clientes', {
                dataCliente: {},
                message: undefined,
                alert: undefined,
                dataUser:req.session,
                metodo: 'crear',
                clientes: resultClientes
            })
        }
    })
}

const editarCliente = (req, res) =>{
    const {id} = req.params
    const sqlClientes = "SELECT * FROM clientes"
    connection.query(sqlClientes, (err, resultClientes)=>{
        if(err){
            c(err)
        }else{
            const sqlCliente = `SELECT * FROM clientes WHERE id=${id} `
            connection.query(sqlCliente, (err, resultCliente) =>{
                if(err){
                    c(err)
                }else{
                    
                    res.render('clientes', {
                        dataCliente: resultCliente[0],
                        message: undefined,
                        alert: undefined,
                        dataUser:req.session,
                        metodo: 'editar',
                        clientes: resultClientes
                    })
                }
            })
        }
    })

   
}

const procesarSalida = (req, res) =>{
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
}
const procesarEntrada = (req, res) =>{
    const sqlEntradas = `SELECT C.id, C.id_producto, C.id_proveedor, cantidad, fecha, P.descripcion, E.nombre FROM entradas C
    JOIN productos P ON C.id_producto = P.id
    JOIN proveedores E ON C.id_proveedor = E.id
     `
    connection.query(sqlEntradas, (err, resultEntradas)=>{
        if(err){
            c(err)
        }else{ 
            const sqlProveedores ="SELECT id, codigo, nombre FROM proveedores"
            connection.query(sqlProveedores, (err, resultProveedores)=>{
               
                if(err){
                    res.render('entradas', {
                        dataEntrada: {},
                        message: `${err}`,
                        alert: 'danger',
                        dataUser:req.session,
                        metodo: 'crear',
                        entradas: resultEntradas,
                        proveedores: []          
                    })
                }else{
                    res.render('entradas', {
                        dataEntrada: {},
                        message: undefined,
                        alert: 'danger',
                        dataUser:req.session,
                        metodo: 'crear',
                        entradas: resultEntradas,
                        proveedores: resultProveedores          
                    })
                }
            })
            
       
        }
    })
}

module.exports = {
    panel,
    crearProducto,
    editarProducto,
    registrarProveedor,
    editarProveedor,
    registrarCliente,
    editarCliente,
    procesarEntrada,
    procesarSalida
}