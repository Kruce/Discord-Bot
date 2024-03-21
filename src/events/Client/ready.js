const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    event: 'ready',
    once: true,
    /**
     * 
     * @param {ExtendedClient} _ 
     * @param {import('discord.js').Client<true>} client 
     * @returns 
     */
    run: (_, client) => {
        if (config.development && config.development.enabled) {
            client.user.setPresence({
                status: 'invisible'
            });
        }
        log('Logged in as: ' + client.user.tag, 'done');
    }
};