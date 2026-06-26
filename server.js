#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 2200;
const fs = require('fs');
const cors = require('cors');
const db = require('./server/db');
const socketUtils = require('./server/socketUtils.js');

app.use(cors());
app.use(morgan('dev'));

app.use(function (req, res, next) {
    console.log(req.originalUrl);
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.resolve('dist')));
app.use('/public', express.static(path.resolve('public')));
app.use('/images', express.static(path.resolve('images'), { etag: true, maxAge: (1000 * 60 * 60 * 3) }));

require('./server/use').use(app);

app.use('/{*path}', function (req, res, next) {
    const filename = path.join('dist', 'index.html')

    fs.readFile(filename, function read(err, result) {
        if (err) {
            console.err('indec html error')
            throw err;
        }
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
    });
});

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