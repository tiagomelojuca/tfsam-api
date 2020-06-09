const knex = require('../db');
const config = require('../config.json');

class CharacterController {

    async index(request, response) {
        const data = await knex('players').select('*');
        return response.json(data);
    }

    async show(request, response) {

        const { name } = request.params;

        const searchedCharacter = await knex('players').where('name', name).select('*');
        if( searchedCharacter.length === 0 ) {
            return response.status(400).json( { error: "Character not found." } );
        }

        return response.json( searchedCharacter[0] );

    }

    async create(request, response) {

        const { account_id, name, vocation, gender, town } = request.body;
    
        // Let's validate the account_id field
        if( account_id === undefined ) {
            return response.status(400).json( { error: "Account ID is required." } );
        }
    
        const searchedAccountId = await knex('accounts').where('id', account_id).select('*');
        if( searchedAccountId.length === 0 ) {
            return response.status(400).json( { error: "Account ID not found." } );
        }
    
        // Let's verify if character's name was sent, and if it exists
        if( name === undefined || name === '' ) {
            return response.status(400).json( { error: "Character's name is required." } );
        }
    
        const searchedName = await knex('players').where('name', name).select('*');
        if( searchedName.length > 0 ) {
            return response.status(400).json( { error: "This name is already in use." } );
        }
    
        // Validating the sent Vocation
        let vocationId;
        if( vocation === undefined ) {
            vocationId = config.defaultCharacter.vocation;
        } else {
            const vocationLowerCase = vocation.toString().toLowerCase();
            vocationId = config.defaultCharacter.vocation;
            if( vocationLowerCase === 'sorcerer' || vocationLowerCase === '1' ) vocationId = 1;
            if( vocationLowerCase === 'druid' || vocationLowerCase === '2' ) vocationId = 2;
            if( vocationLowerCase === 'paladin' || vocationLowerCase === '3' ) vocationId = 3;
            if( vocationLowerCase === 'knight' || vocationLowerCase === '4' ) vocationId = 4;
        }
    
        // Validating the sent Gender
        let genderId = config.defaultCharacter.sex;
        let looktype = config.defaultCharacter.looktype;
        if( gender != undefined ) {
            const genderAsString = gender.toString().toLowerCase();
            if( genderAsString === 'male' || genderAsString === '1' ) {
                genderId = 1;
                looktype = 128;
            }
        }
    
        // Validating the sent Town
        let townId;
        if( town === undefined ) {
            townId = config.defaultCharacter.town_id;
        } else {
            if( Number.isInteger( town ) ) {
                townId = town;
            } else {
                townId = config.defaultCharacter.town_id;
            }
        }
    
        // Let's construct our character
        const character = config.defaultCharacter;
        character.name = name;
        character.account_id = account_id;
        character.vocation = vocationId;
        character.sex = genderId;
        character.looktype = looktype;
        character.town_id = townId;
    
        const insertedCharacter = await knex('players').insert(character);
        
        const outputData = {
            id: insertedCharacter[0],
            ...character
        };
    
        return response.json( outputData );
    
    }

}

module.exports = CharacterController;