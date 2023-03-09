const express = require("express")
const router = express.Router()
const pageController = require('../controllers/pages')


/** VISTAS */

router.get( "/panel", pageController.panel )

router.get( "/crear-producto", pageController.crearProducto )

router.get( "/editar-producto/:id", pageController.editarProducto )

router.get( "/registrar-proveedor",pageController.registrarProveedor )

router.get( "/editar-proveedor/:id", pageController.editarProveedor )

router.get( "/registrar-cliente", pageController.registrarCliente )

router.get( "/editar-cliente/:id", pageController.editarCliente ) 

router.get( "/procesar-entrada", pageController.procesarEntrada ) 

router.get( "/procesar-salida", pageController.procesarSalida ) 


module.exports = router