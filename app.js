'use strict'
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

//add routes
const authRouter = require('./routes/auth');
const adminOrdersRouter = require('./routes/admin/orders');
const ordersRouter = require('./routes/orders');
const adminUsersRouter = require ('./routes/admin/users');

app.use(express.json());

//config cors 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//ip 
app.set('trust proxy', true);

//profix routes
app.use('/api', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/users', adminUsersRouter);

app.listen(process.env.APP_PORT || 3000);

