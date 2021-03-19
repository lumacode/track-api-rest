'use strict'
const router = require('express').Router();

//middlewares
const validateJwt = require('../../middlewares/validate-token');
const validateSupAdmin = require('../../middlewares/validate-super-admin');
const validateInput = require('../../middlewares/validate-input-user');

//controller
const UserController = require('../../controllers/admin/User');

router.get('/getall', validateJwt, validateSupAdmin, UserController.getAll);
router.get('/getone/:id', validateJwt, validateSupAdmin, UserController.getOne);
router.post('/create', validateJwt, validateSupAdmin,validateInput, UserController.create);
router.put('/edite', validateJwt, validateSupAdmin, UserController.edite);
router.put('/edite-email', validateJwt, validateSupAdmin, UserController.editeEmail);
router.delete('/delete/:id', validateJwt, validateSupAdmin, UserController.delete);




module.exports = router;