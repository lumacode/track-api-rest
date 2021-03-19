'use strict'
const db = require('../../utils/db');
const bcrypt = require('bcrypt');
const validator = require('validator');


const UserController = {

    create: async (req, res) => {

        try {
      
            const { email, password, status, role } = req.body;

            const emailExist = await db.select(['email']).table('users').where({email: email});
            
            if(emailExist != ''){
                return res.status(400).json({error: 'El usuario ya se encuentra registrado'});
            }

            const salt = await bcrypt.genSalt(10);
            const passHash = await bcrypt.hash(password, salt);

            const data = {
                email: email,
                password: passHash,
                status: status,
                role: role
            }

            const [user] = await db.insert(data).into('users');

            if (user) return res.status(200).json({status: "ok", userId: user});
            
        } catch (error) {

            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })

            console.log(error)
            
        }


    },
    edite: async (req, res) => {

        try {
      
            const { id, status, role } = req.body;

            const validate_role = !validator.isEmpty(role.toString()) && validator.isInt(role.toString());
            const validate_status = !validator.isEmpty(status.toString()) && validator.isInt(status.toString());

            if(!validate_role || !validate_status) return res.status(400).json({status: 'error', message: 'Los campos ingresados son incorrectos.'});

            const data = {
                status: status,
                role: role
            }

            const user = await db.where({id: id}).update(data).table('users');

            if (!user) return res.status(404).json({ status: 'error', message: 'El usuario no existe.'});
            
            res.status(200).json({status: "ok", userId: id});
            
        } catch (error) {

            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })

            console.log(error)
            
        }

    },
    editeEmail: async (req, res) => {
        
        try {
      
            const { id, email } = req.body;

            const validate_email = !validator.isEmpty(email) && validator.isEmail(email);
            if(!validate_email) return res.status(400).json({status: 'error', message: 'El email ingresado es incorrecto.'});

            const emailExist = await db.select(['email']).table('users').where({email: email});
            
            if(emailExist != ''){
                return res.status(400).json({status: 'error', message: 'El email ya se encuentra registrado'});
            }

            const data = {
                email: email,
            }

            const user = await db.where({id: id}).update(data).table('users');

            if (!user) return res.status(404).json({ status: 'error', message: 'El usuario que intenta editar no existe.'});
            
            res.status(200).json({status: "ok", userId: id});
            
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
            const userDB = await db.where({id: id}).delete().table('users');
    
            if(!userDB) return res.status(404).json({ status: 'error', message: 'El usuario no existe.'});
    
            res.status(200).json({
                status: 'ok',
                userId: id
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
            
            const users = await db.select(['id', 'email', 'status', 'role', 'ts_create', 'ts_update']).table('users');
           
            res.status(200).json({
                status: 'ok',
                users: users
            })

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
           
            const [user] = await db.select(['id', 'email', 'status', 'role', 'ts_create', 'ts_update']).where({id: id}).table('users');

            if(!user) return res.status(404).json({ status: 'error', message: 'El usuario no existe.'});

            res.status(200).json({
                status: 'ok',
                user: user
            })
 

        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })
        }
    }


}

module.exports = UserController;