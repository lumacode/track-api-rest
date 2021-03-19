'use strict'
const nodemailer = require('nodemailer');
const { generateLog } = require('../utils/generate-log');

/* 
obj = {
    mail:'',
    subject: '',
    html: ``
}
*/
const sendMail = async ({email, subject, html}) => { 
try{
    const transporter = nodemailer.createTransport({
        host: process.env.APP_MAIL_HOST,
        port: process.env.APP_PORT_EMAIL,
        secure: true,
        auth: {
            user: process.env.APP_MAIL_USER,
            pass: process.env.APP_MAIL_PASSWORD
        },
    });

    const info = {
        from: process.env.APP_MAIL_USER,
        to: email,
        subject: subject,
        //text: '',
        html: html 
        /*,attachments: [
            {filename: 'factura.pdf', path: 'ubicacion del archivo'},
            {filename: 'foto.png', path: 'ubicacion del archivo''}
        ]*/
    };
    const {messageId} = await transporter.sendMail(info);
    return messageId;
    //sendMail.messageId
} catch(e){
    generateLog(`Fallo durante el envio de email, verificar estado del servidor SMTP.\n`);
}
    
};


module.exports = { sendMail }; 