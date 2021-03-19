'use strict'
const db = require('../utils/db');
const { generateLog } = require('../utils/generate-log');

const ValidateOrderExists = async (req, res, next) => {

    try {

        const { id_order } = req.body;

        const orderExists = await db.select().table('orders').where({id_order: id_order});

        if(orderExists != ''){
            res.status(400).json({error: 'No puede existir una orden con el mismo identificador.'});
            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            generateLog(`Desde ${ip} intentaron registrar un pedido con id repetido.\n`);
            return 

        }

        next();

    } catch (error) {

        res.status(500).json({
            error: 'En este momento no se puede procesar la solicitud...'
        })
    }
    
}

module.exports = ValidateOrderExists