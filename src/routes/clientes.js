const express = require("express")
const router = express.Router()
const clienteController = require('../controllers/clientes')


/** ACCIONES */

router.get( "/consultar", clienteController.consultar )

router.post( "/crear", clienteController.crear )

router.post( "/editar/:id", clienteController.editar )

router.post( "/eliminar/:id", clienteController.eliminar )

module.exports = router