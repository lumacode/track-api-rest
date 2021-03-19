'use strict'
const db = require('../utils/db');

const OrderController = {

    getOne: async (req, res) => {

        try {

            const { id } = req.params;
           
            const [order] = await db.select().where({id: id}).table('orders');

            if(!order) return res.status(404).json({ status: 'error', message: 'El pedido no existe.'});

            res.status(200).json({
                status: 'ok',
                order: order
            })
 

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })
        }

    }
}//endController

module.exports = OrderController



