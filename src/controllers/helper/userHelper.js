const connection = require("../../connection")
const c = console.log
let dataGlobal = []
/** Validando que el usuario no exista */

const verificandoNombreDeUsuario = (nombre_usuario) => {
    const sql = ` SELECT * FROM usuarios WHERE nombre_usuario='${nombre_usuario}' `
     connection.query(sql, (err, result)=>{
        if (err) {
            c(err)
        } 
        return setDato(result)
    })
}
const setDato = (data) => dataGlobal = data
const getDato = () => dataGlobal

module.exports = {
    verificandoNombreDeUsuario,
    setDato,
    getDato
}
