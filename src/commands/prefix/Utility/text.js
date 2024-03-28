const { Message, ChannelType } = require('discord.js');
const { log } = require('../../../functions');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'text',
        description: 'Translate text into emojis.',
        aliases: ['t'],
        usage: `Enter a phrase argument you want translated into emojis. Translateable text includes numbers, letters, ?, and !`,
        permissions: "SendMessages",
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const numbers = [`zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`];
        let data = ``; //empty string for a return message
        for (let i = 0; i < args.length; ++i) { //for each argument
            for (let c = 0; c < args[i].length; ++c) { //for each character in each argument
                const charCurrent = args[i].charAt(c);
                if (charCurrent.match(/[a-z]/i)) { //match alpha characters regardless of case
                    data += `:regional_indicator_${charCurrent.toLowerCase()}:`;
                } else if (charCurrent.match(/\d+/)) { //match numeric characters
                    data += `:${numbers[parseInt(charCurrent)]}:`;
                } else if (charCurrent == `?`) {
                    data += `:grey_question:`;
                } else if (charCurrent == `!`) {
                    data += `:grey_exclamation:`;
                } else {
                    data += charCurrent;
                } data += ` `; //added space in between each character to correctly display for mobile users
            } data += `  `; //added space inbetween each word
        }
        if (message.channel.type === ChannelType.GuildText) { //if this isn't a dm, delete previous message
            message.delete({ timeout: 1 }).catch((error) => {
                log(`Text command error deleteing previous message. \n ${error}`, "err");
            });
            data = `${message.member.displayName} ${data}`;
        }
        return await message.channel.send(data)
            .catch((error) => {
                log(`Text command error sending message in: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            });
    },
};