'use strict'
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => 
{
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({ error: 'Acceso denegado' })

    try {
        const verify = jwt.verify(token, process.env.APP_TOKEN_SECRET)
        //console.log(jwt.decode(token))
        next();
    } catch (error) {
        res.status(401).json({ error: 'Acceso denegado' })
    }
}


module.exports = verifyToken