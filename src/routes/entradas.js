const express = require("express")
const router = express.Router()
const entradaController = require('../controllers/entradas')


/** Acciones */

router.post( "/crear", entradaController.crear )

router.get( "/eliminar/:id", entradaController.eliminar )

module.exports = router