const knex = require('../db');

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
        if( name === undefined ) {
            return response.status(400).json( { error: "Character's name is required." } );
        }
    
        const searchedName = await knex('players').where('name', name).select('*');
        if( searchedName.length > 0 ) {
            return response.status(400).json( { error: "This name is already in use." } );
        }
    
        // Validating the sent Vocation
        let vocationId;
        if( vocation === undefined ) {
            vocationId = 0;
        } else {
            const vocationLowerCase = vocation.toString().toLowerCase();
            vocationId = 0;
            if( vocationLowerCase === 'sorcerer' || vocationLowerCase === '1' ) vocationId = 1;
            if( vocationLowerCase === 'druid' || vocationLowerCase === '2' ) vocationId = 2;
            if( vocationLowerCase === 'paladin' || vocationLowerCase === '3' ) vocationId = 3;
            if( vocationLowerCase === 'knight' || vocationLowerCase === '4' ) vocationId = 4;
        }
    
        // Validating the sent Gender
        let genderId = 0;
        let looktype = 136;
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
            townId = 1;
        } else {
            if( Number.isInteger( town ) ) {
                townId = town;
            } else {
                townId = 1;
            }
        }
    
        // Let's construct our character
        const character = {
            name: name,
            group_id: 1,
            account_id: account_id,
            level: 8,
            vocation: vocationId,
            health: 185,
            healthmax: 185,
            experience: 4200,
            lookbody: 68,
            lookfeet: 76,
            lookhead: 78,
            looklegs: 58,
            looktype: looktype,
            lookaddons: 0,
            direction: 2,
            maglevel: 0,
            mana: 90,
            manamax: 90,
            manaspent: 0,
            soul: 100,
            town_id: townId,
            posx: 5,
            posy: 5,
            posz: 2,
            // conditions: null,
            cap: 470,
            sex: genderId,
            lastlogin: 0,
            lastip: 0,
            save: 1,
            skull: 0,
            skulltime: 0,
            lastlogout: 0,
            blessings: 0,
            onlinetime: 0,
            deletion: 0,
            balance: 0,
            offlinetraining_time: 43200,
            offlinetraining_skill: -1,
            stamina: 2520,
            skill_fist: 10,
            skill_fist_tries: 0,
            skill_club: 10,
            skill_club_tries: 0,
            skill_sword: 10,
            skill_sword_tries: 0,
            skill_axe: 10,
            skill_axe_tries: 0,
            skill_dist: 10,
            skill_dist_tries: 0,
            skill_shielding: 10,
            skill_shielding_tries: 0,
            skill_fishing: 10,
            skill_fishing_tries: 0,
        }
    
        const insertedCharacter = await knex('players').insert(character);
        
        const resposta = {
            id: insertedCharacter[0],
            ...character
        };
    
        return response.json( resposta );
    
    }

}

module.exports = CharacterController;