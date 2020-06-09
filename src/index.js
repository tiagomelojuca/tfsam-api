const express = require('express');
const AccountController = require('./controllers/AccountController');
const CharacterController = require('./controllers/CharacterController');

const server = express();
server.use(express.json());
const accountController = new AccountController();
const characterController = new CharacterController();

server.get('/accounts', accountController.index);
server.get('/accounts/:name', accountController.show);
server.post('/accounts', accountController.create);

server.get('/characters', characterController.index);
server.get('/characters/:name', characterController.show);
server.post('/characters', characterController.create);

server.listen(3333);