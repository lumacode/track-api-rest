'use strict'
const jwt = require('jsonwebtoken');

const validateSupAdmin = (req, res, next) => 
{
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({ error: 'Acceso denegado.' })

    try {

        const { role } = jwt.decode(token);
        if(role === 2) return next();
        
        return res.status(401).json({ status: 'error', message: 'No tiene permisos suficientes.' })

    } catch (error) {
        res.status(401).json({ error: 'Acceso denegado.' })
    }
}


module.exports = validateSupAdmin