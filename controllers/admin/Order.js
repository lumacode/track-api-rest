'use strict'
const db = require('../../utils/db');
const { sendMail } = require('../../services/send-mail');

const OrderController = {

    create: async (req, res) => {

        try {

            const { id_order, email_client, description, status } = req.body; 

            const data = {
                id_order: id_order,
                email_client: email_client,
                description: description,
                status: status
            }
    
            const [orderDB] = await db.insert(data).into('orders');

            res.status(200).json({
                status: 'ok',
                message: 'Pedido guardado correctamente!',
                id: orderDB
            })

            await sendMail({
                email: email_client, 
                subject: 'Su pedido ha sido recibido',
                html: `Esta es una notificación automática para informarle su pedido ha sido recibido.<br>
                Puede verificar el estado del mismo haciendo clic <a href="#" target="_blank">aquí</a>`
            })

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesarse la petición...'
            })
        }

    },
    edite: async (req, res) => {

        try {
            
            const { id, email_client, description, status } = req.body; 

            const data = {
                id: id,
                email_client: email_client,
                description: description,
                status: status
            }

            const orderDB = await db.where({id: id}).update(data).table('orders');

            if(!orderDB) return res.status(404).json({ status: 'error', message: 'El pedido no existe.'});

            res.status(200).json({
                status: 'ok',
                message: 'Pedido actualizado correctamente!',
                id: id
            })

            await sendMail({
                email: email_client, 
                subject: 'El estado de envío de su pedido ha cambiado',
                html: `Esta es una notificación automática para informarle que el estado de su pedido ha cambiado <br>
                Puede verificar el estado del mismo haciendo clic <a href="#" target="_blank">aquí</a>`
            });

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })
        }
        
    },
    delete: async (req, res) => {

        try {

            const { id } = req.params;
            const orderDB = await db.where({id: id}).delete().table('orders');
    
            if(!orderDB) return res.status(404).json({ status: 'error', message: 'El pedido no existe.'});
    
            res.status(200).json({
                status: 'ok',
                orderId: id
            })

        } catch (error) {

            console.log(error)

            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...',
            })
        }

    },
    getAll: async (req, res) => {

        try {

            const orders = await db.select().into('orders');

            res.status(200).json({
                status: 'ok',
                orders: orders
            })

            if(!orders) return res.status(404).json({ status: 'error', message: 'No hay pedidos disponibles en este momento.'});

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })
        }

    },
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

module.exports = OrderController;