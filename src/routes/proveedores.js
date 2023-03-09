const express = require("express")
const router = express.Router()
const proveedorController = require('../controllers/proveedores')


/** Acciones */

router.get( "/consultar", proveedorController.consultar )

router.post( "/crear", proveedorController.crear )

router.post( "/editar/:id", proveedorController.editar )

router.post( "/eliminar/:id", proveedorController.eliminar )

module.exports = router