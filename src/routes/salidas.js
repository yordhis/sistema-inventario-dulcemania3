const express = require("express")
const router = express.Router()
const salidaController = require('../controllers/salidas')


/** Acciones */

router.post( "/crear", salidaController.crear )

router.get( "/eliminar/:id", salidaController.eliminar )

module.exports = router