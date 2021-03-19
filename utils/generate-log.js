'use strict'
const fs = require('fs');
const moment = require('moment');

const generateLog = (content) =>{

    const date = moment().format('YYYY-MM-DDTHH:mm');

    //const file = await fs.createWriteStream(`./logs/general.log`);
    fs.appendFile('./logs/general.log', `${date} - ${content}`, (err) => {
        if (err) throw err;
    });

}

module.exports = { generateLog }