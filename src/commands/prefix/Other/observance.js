const { Message, EmbedBuilder } = require('discord.js');
const { log } = require('../../../functions/utility');
const { observancesToday } = require('../../../functions/observance');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'observances',
        description: `Description and information on today's observance(s)(emoji) if one exists.`,
        aliases: ['h', 'o'],
        usage: `Enter command with no arguments to get information if today is an observance.`,
        permissions: 'SendMessages',
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const observances = observancesToday();
        if (observances?.length) { //if any observances exist, create a new embed message and add each observance to its description
            let description = ``;
            for (var i = 0; i < observances.length; ++i) {
                if (i > 0) description += `\n`; //add to a new line unless it is the first one
                description += `${observances[i][0]} [${observances[i][1]}](${observances[i][2]})`;
            }
            const embed = new EmbedBuilder()
                .setTitle(`Today's Observances`)
                .setDescription(description)
                .setColor('d1d2d1')
                .setThumbnail(`https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png`)
                .setTimestamp();
            return await message.channel.send({ embeds: [embed] })
                .catch(error => {
                    log(`Observance command error sending message for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
                });
        }
    }
};