const express = require('express');
const cors = require('cors');

const config = require('./config.json');
const AccountController = require('./controllers/AccountController');
const CharacterController = require('./controllers/CharacterController');

const server = express();
server.use(express.json());
server.use(cors( {
    origin: config.corsOrigin,
    optionsSuccessStatus: 200
} ));

const accountController = new AccountController();
const characterController = new CharacterController();

server.get('/accounts', accountController.index);
server.get('/accounts/:name', accountController.show);
server.post('/accounts', accountController.create);

server.get('/characters', characterController.index);
server.get('/characters/:name', characterController.show);
server.post('/characters', characterController.create);

server.listen(config.port);