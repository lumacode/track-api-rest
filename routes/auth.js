'use strict'
const router = require('express').Router();

//middlewares
const validateAuth = require('../middlewares/validate-auth');
const validateJwt = require('../middlewares/validate-token');

//controller
const AuthController = require('../controllers/Auth');

router.post('/login', validateAuth, AuthController.login);
router.post('/register', validateJwt, validateAuth, AuthController.register);
router.post('/recoverpass', AuthController.recoverPass);
router.post('/generatepass', AuthController.generatePass);

module.exports = router;