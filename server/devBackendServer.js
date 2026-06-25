const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = 2200;

const db = require('./db');
const socketUtils = require('./socketUtils.js');

app.use(morgan('dev'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/public', express.static(path.resolve('public')))

app.use(function (req, res, next) {
    console.log(req.originalUrl);
    next();
});

require('./use').use(app);

const initServer = async () => {
    try {
        await db.connect();
        const server = app.listen(port, () => {
            console.log('server up');
        });
        socketUtils.setSocket(server);
    } catch (err) {
        console.error('init server faied', err);
    }
}

initServer();

