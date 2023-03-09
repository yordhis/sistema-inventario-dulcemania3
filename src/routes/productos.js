const express = require("express")
const router = express.Router()
const productoController = require('../controllers/productos')


/** Acciones */

router.post( "/crear", productoController.crear )

router.post( "/eliminar/:id", productoController.eliminar )

router.post( "/editar/:id", productoController.editar )




module.exports = router