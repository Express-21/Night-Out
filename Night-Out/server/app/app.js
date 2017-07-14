/* globals __dirname */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('libs',
    express.static(
        path.join(__dirname, '../../node_modules/'))
);

app.use(express.static(path.join(__dirname, '../../public/')));

require('../../routes');

module.exports = app;
