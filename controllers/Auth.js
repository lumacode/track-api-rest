'use strict'
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateLog } = require('../utils/generate-log');
const { uid } = require('uid');
const { sendMail } = require('../services/send-mail');

const AuthController = {

    register : async (req, res) => { 

        try {
      
            const { email, password } = req.body;

            const emailExist = await db.select(['email']).table('users').where({email: email});
            
            if(emailExist != ''){
                return res.status(400).json({error: 'El usuario ya se encuentra registrado'});
            }

            const salt = await bcrypt.genSalt(10);
            const passHash = await bcrypt.hash(password, salt);

            const data = {
                email: email,
                password: passHash
            }

            const [user] = await db.insert(data).into('users');

            if (user) return res.status(200).json({status: "ok", userId: user});

            return res.status(400).json({status: 'error', message: 'No pudo registrarse el usuario, vuelva a internar nuevamente.'})
            
        } catch (error) {

            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            generateLog(`Desde ${ip} intentaron registrar un usuario pero hubo una falla.\n`);
            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })
            
        }

    },

    login : async (req, res) => {

        try {

            const { email, password } = req.body;
        
            const [ user ] = await db.select(['id','email', 'password', 'status', 'role']).table('users').where({email: email});

                const validatePassword = await bcrypt.compare(password, user.password);
                if (!validatePassword || user.status == 0) return res.status(401).json({status: 'error', message: 'Credenciales incorrectas!'});
                
                const  {id:userId, email:userEmail, role:userRole } = user

                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    email: userEmail,
                    id: userId,
                    role: userRole
                }, process.env.APP_TOKEN_SECRET);

                res.header('auth-token', token).json({
                    token: token,
                    user:{
                        email: userEmail,
                        id: userId
                    }
                    
                });

        } catch (error) {

            const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            generateLog(`Desde ${ip} intentaron loguearse con credenciales incorrectas.\n`);
            res.status(401).json({status: 'error', message: 'Credenciales incorrectas!'});

        }

    },

    recoverPass : async (req, res) => {

        try {

            const { email } = req.body;

            const [ user ] = await db.select().where({email: email}).table('users');

            const token = uid(128);
    
            if(!user) return res.status(404).json({ status: 'error', message: 'El usuario no es válido.'});
    
            const tokenUpdate = await db.where({email: email}).update({token: token}).table('users');

            res.status(200).json({
                status: 'ok',
                message: 'Hemos enviado un correo al email que tiene registrado en el sistema con las instrucciones para recuperar su clave.'
            });

            const send = await sendMail({
                email: email, 
                subject: 'Generar nueva clave',
                //configurar vista del front para indicar url
                html: `Para regenerar su clave haga click <a href="${process.env.APP_BASE_URL}/api/generatepass?email=${email}&token=${token}" target="_blank">aquí</a> <br> Una vez que ingrese al enlace deberá introducir una nueva clave.`
            });
        
        } catch (error) {

            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })
        }
        
    },

    generatePass : async (req, res) => {

        try {

            const { token, email} = req.query

            const [ userDB ] = await db.select(['token', 'email']).whereRaw(`token = '${token}' AND email = '${email}'`).table('users');
    
            if(!token || !email || !userDB){
    
                const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                generateLog(`Desde ${ip} intentaron recuperar la clave del usuario ${email} con parámetros incorrectos.\n`);
                res.status(401).json({status: 'error', message: 'Acceso denegado!'});
                return 
            }
    
            const { password } = req.body;
            if(!password || password.length < 6) return res.status(400).json({status: 'ok', message: 'Debe ingresar un password mayor a 6 digitos.'});

            const salt = await bcrypt.genSalt(10);
            const passHash = await bcrypt.hash(password, salt);
    
            const passUpdate = await db.where({email: email}).update({password: passHash, token: uid(128)}).table('users');
            console.log(passUpdate)
    
            res.status(200).json({
                status: 'ok',
                message: 'Su clave ha sido actualizada correctamente!'
            })
            
        } catch (error) {

            res.status(500).json({
                status: 'error',
                message: 'En este momento no se puede procesar la solicitud...'
            })
        }


    }
}


module.exports = AuthController;