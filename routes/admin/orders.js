'use strict'
const router = require('express').Router();

//middlewares
const validateJwt = require('../../middlewares/validate-token');
const validateOrder = require('../../middlewares/validate-input-order');
const validateOrderExists = require('../../middlewares/valite-order-exists');

//controller
const OrderController = require('../../controllers/admin/Order');

router.post('/create', validateJwt, validateOrder, validateOrderExists, OrderController.create );
router.put('/edite', validateJwt, validateOrder, OrderController.edite );
router.get('/getall', validateJwt, OrderController.getAll);
router.get('/getone/:id', validateJwt, OrderController.getOne);
router.delete('/delete/:id', validateJwt, OrderController.delete);


module.exports = router;