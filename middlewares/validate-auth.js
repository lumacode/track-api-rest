'use strict'
const validator = require('validator');

const validateAuth = (req, res, next) =>
{

    try {
        const {email, password} = req.body;

        const validate_email = validator.isEmail(email);
        const validate_password = validator.isByteLength(password,{min:6, max: 300});

        if(validate_email && validate_password){
            return next();
        }

        return res.status(422).json({
            status: 'error',
            message: 'Ingrese datos correctos',
        });

    } catch (error) {
        res.status(500).json({
            error: 'No pudo registrarse el usuario, compruebe los datos y vuelva a intentar.'
        })
    }
}

module.exports = validateAuth