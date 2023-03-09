const mysql = require('mysql')
const { mysql_database } = require('./config')

const connection = mysql.createConnection(mysql_database)

connection.connect((error, conn)=>{
        if (error){
            console.log('Ha ocurrido un error al conectarse a la base de datos.')
        }else{
            console.log('Conexion exitosa')
            return conn
        }
})

module.exports = connection