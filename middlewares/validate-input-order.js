'use strict'
const validator = require('validator');

const validateOrder = (req, res, next) => {

    try {
        const {  email_client, status } = req.body; 

        const validate_email = !validator.isEmpty(email_client) && validator.isEmail(email_client)
        const validate_status = !validator.isEmpty(status.toString()) && validator.isInt(status.toString())

        if(validate_email && validate_status){
            return next();
        }

        return res.status(422).json({
            status: 'error',
            message: 'Ingrese datos correctos',
        });

    } catch (error) {

        res.status(500).json({
            error: 'En este momento no puede procesarse la petición.'
        });
    }

}


module.exports = validateOrder;