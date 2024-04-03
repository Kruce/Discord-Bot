const { readdirSync } = require('fs');
const { log } = require('../functions/utility');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = (client) => {
    for (const dir of readdirSync('./src/reactions/')) {
        for (const file of readdirSync('./src/reactions/' + dir + '/').filter((f) => f.endsWith('.js'))) {
            const module = require('../reactions/' + dir + '/' + file);

            if (!module) continue;

            if (!module.structure?.name || !module.structure.emojiId || !module.run) {
                log('Unable to load the reaction ' + file + ' due to missing \'structure#name\' or/and \'structure#emojiId\' or/and \'run\' properties.', 'warn');
                continue;
            };

            client.collection.reactions.set(module.structure.emojiId, module);
            log('Loaded new reaction: ' + file, 'info');
        };
    };
};