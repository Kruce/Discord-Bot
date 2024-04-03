const fetch = require('node-fetch');
const { Collection } = require("discord.js");
const { log } = require('../functions/utility');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = async (client) => {
    try {
        let overwatch = await fetch(`https://overfast-api.tekrop.fr/heroes`);
        let result = await overwatch.text();
        client.overwatch = new Collection();
        let heroes = {};
        let list = JSON.parse(result);
        for (let i = 0; i < list.length; ++i) {
            const hr = list[i];
            const role = hr.role.toLowerCase();
            const hero = [hr.name.toLowerCase(), hr.portrait]
            if (role in heroes) {
                heroes[role].push(hero);
            } else {
                heroes[role] = [hero];
            }
        }
        client.overwatch.set(`heroes`, heroes);
        log(`Overwatch handler cached heroes`, "info");
    } catch (error) {
        log(`Overwatch handler caching heroes error \n ${error}`, "err");
    }
};