const router = require('express').Router();

//controller
const OrderController = require('../controllers/Order');

router.get('/getone/:id', OrderController.getOne)


module.exports = router;