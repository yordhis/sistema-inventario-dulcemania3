const express = require("express")
const router = express.Router()
const userController = require('../controllers/users')


/** VISTAS */

router.get( "/registrar", userController.getRegister )

router.get( "/todos", userController.getUsers )

router.get( "/actualizar/:id",userController.getUpdateUser )

router.get( "/eliminar/:id", userController.getDeleteUser ) 

/** ACCIONES */
router.post( "/registrar", userController.register )

router.post( "/entrar", userController.login )

router.get( "/salir", userController.salir )

router.post( "/actualizar/:id", userController.updateUser ) 

router.post( "/eliminar/:id", userController.deleteUser ) 

module.exports = router