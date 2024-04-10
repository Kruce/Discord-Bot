const { Message, ChannelType, EmbedBuilder } = require('discord.js');
const { log, shuffleArray } = require('../../../functions/utility');
const ExtendedClient = require('../../../class/ExtendedClient');
const Roles = [`tank`, `damage`, `damage`, `support`, `support`];

module.exports = {
    structure: {
        name: 'overwatch',
        description: 'Assign the name an ow role and hero or the overwatch role a new hero.',
        aliases: ['ow'],
        usage: `Enter any combination of a total of ${Roles.length} space separated player names or overwatch roles as arguments. Command will assign the player name argument a role and hero, or the overwatch role argument a new hero. If no arguments are given, command will use any players currently playing Overwatch.`,
        permissions: 'SendMessages',
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        let roles = [...Roles];
        if (!args.length && message.channel.type === ChannelType.GuildText)  //if array is empty and this isn't a dm, attempt to get all players currently playing overwatch
            args = message.guild.presences.cache.filter(function (p) { return p.activities.some(function (a) { return a.name.trim().toLowerCase().includes(`overwatch`) }) }).map(p => p.member.displayName);
        if (!args.length || args.length > roles.length) { //if array is empty or more than allowed players/roles.. return message
            return await message.channel.send(`${message.author}, your provided arguments are invalid.`);
        }

        let reservedroles = []; //if they are just requesting a hero change, the role gets reserved
        const overwatch = message.client.overwatch;
        if (!overwatch)
            return await message.channel.send(`${message.author}, there is an issue retrieving heroes from the cache.`);

        const heroes = overwatch.get(`heroes`);
        if (typeof heroes === "undefined")
            return await message.channel.send(`${message.author}, there is an issue with the cached heroes.`);

        const argslower = args.map(v => v.toLowerCase()); //convert all user input to lower case to help match any roles
        for (const arg of argslower) { //update our remained and reserved roles before we start assigning them
            const index = roles.indexOf(arg); //check if the current word is equal to a role and there are any remaining
            if (index > -1) { //if it exists, remove it from remained roles and add it to reserved roles
                reservedroles.push(roles.splice(index, 1)[0]);
            }
        }

        let embeds = [];
        while (argslower.length > 0) {
            for (let [key, value] of Object.entries(heroes)) { //shuffling roles and heroes inside while loop instead of outside for extra randomness
                heroes[key] = shuffleArray(value)
            }
            const arg = argslower.shift();
            const embed = new EmbedBuilder().setColor("f06414");
            if (reservedroles.splice(reservedroles.findIndex(x => x == arg), 1)?.length) { //if the message is a role and there's still roles of that type left to use
                const hero = heroes[arg].shift();
                embed.setDescription(`${arg}\n${hero[0]}`) //arg is an ow role here
                embed.setThumbnail(hero[1])
            } else {
                roles = shuffleArray(roles);
                const role = roles.shift();
                const hero = heroes[role].shift();
                embed.setDescription(`**${arg}**\n${role}\n${hero[0]}`) //arg is a username here
                embed.setThumbnail(hero[1])
            }
            embeds.push(embed);
        }

        return await message.channel.send({ embeds: embeds })
            .catch((error) => {
                log(`Overwatch command error sending message for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            });
    }
};