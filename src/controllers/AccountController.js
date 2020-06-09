const knex = require('../db');
const sha1 = require('sha1');

class AccountController {

    async index(request, response) {
        const data = await knex('accounts').select('*');
        return response.json(data);
    }

    async show(request, response) {

        const { name } = request.params;

        const searchedAccount = await knex('accounts').where('name', name).select('*');
        if( searchedAccount.length === 0 ) {
            return response.status(400).json( { error: "Account Name not found." } );
        }

        return response.json( searchedAccount[0] );

    }

    async create(request, response) {

        const { name, password, email } = request.body;

        // Let's validate the account name field
        if( name === undefined || name === '' ) {
            return response.status(400).json( { error: "Account username is required." } );
        }
    
        const searchedUsername = await knex('accounts').where('name', name).select('*');
        if( searchedUsername.length > 0 ) {
            return response.status(400).json( { error: "This username is already in use." } );
        }
    
        // Let's validate the account password field
        if( password === undefined || password === '' ) {
            return response.status(400).json( { error: "Account password is required." } );
        }

        // Let's just fill email field with anything if not filled
        let verifiedEmail = '';
        if ( email != undefined ) {
            verifiedEmail = email;
        }

        // Generating some info
        const encryptedPass = sha1(password);
        const creation = Date.now().toString().slice(0, 10);
    
        const account = {
            name: name,
            password: encryptedPass,
            secret: null,
            type: 1,
            premdays: 0,
            lastday: 0,
            email: verifiedEmail,
            creation: creation
        }
    
        const insertedAccId = await knex('accounts').insert(account);
        
        const resposta = {
            id: insertedAccId[0],
            ...account
        };
    
        return response.json(resposta);
    
    }

}

module.exports = AccountController;