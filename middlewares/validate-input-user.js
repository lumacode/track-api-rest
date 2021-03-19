'use strict'
const validator = require('validator');

const validateUser = (req, res, next) =>
{

    try {
        const { email, password, status, role } = req.body;

        const validate_email = !validator.isEmpty(email) && validator.isEmail(email);
        const validate_password = validator.isByteLength(password,{min:6, max: 300});
        const validate_status = !validator.isEmpty(status.toString()) && validator.isInt(status.toString());
        const validate_role = !validator.isEmpty(role.toString()) && validator.isInt(role.toString());

        if(validate_email && validate_password && validate_status && validate_role){
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

module.exports = validateUser;