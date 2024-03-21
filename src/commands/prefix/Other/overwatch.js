const { Message, ChannelType, EmbedBuilder } = require('discord.js');
const { log, shuffleArray } = require('../../../functions');
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
        let overwatch = message.client.overwatch;
        if (!overwatch)
            return await message.channel.send(`${message.author}, there is an issue retrieving heroes from the cache.`);

        let cachedheroes = overwatch.get(`heroes`);
        if (typeof cachedheroes === "undefined")
            return await message.channel.send(`${message.author}, there is an issue with the cached heroes.`);

        let heroes = JSON.parse(JSON.stringify(cachedheroes));
        const argumentslower = args.map(v => v.toLowerCase()); //convert all user input to lower case to help match any roles
        for (const arg of argumentslower) { //update our remained and reserved roles before we start assigning them
            const index = roles.indexOf(arg); //check if the current word is equal to a role and there are any remaining
            if (index > -1) { //if it exists, remove it from remained roles and add it to reserved roles
                const role = roles[index];
                roles.splice(index, 1);
                roles.push(role);
            }
        }

        let embeds = [];
        while (argumentslower.length > 0) {
            for (let [key, value] of Object.entries(heroes)) { //shuffling roles and heroes inside while loop instead of outside for extra randomness
                heroes[key] = shuffleArray(value)
            }
            const arg = argumentslower[0]; //since we shift at end of loop this will always be the current word
            if (reservedroles.includes(arg)) { //if the message is a role and there's still roles of that type left to use
                let embed = new EmbedBuilder()
                    .setDescription(`${arg}\n${heroes[arg][0][0]}`)
                    .setThumbnail(heroes[arg][0][1])
                    .setColor("f06414");
                embeds.push(embed);
                heroes[arg].shift();
                reservedroles.splice(reservedroles.findIndex(x => x == arg), 1); //remove the first instance of the role
            } else {
                roles = shuffleArray(roles);
                let role = roles[0];
                let embed = new EmbedBuilder()
                    .setDescription(`**${arg}**\n${role}\n${heroes[role][0][0]}`)
                    .setThumbnail(heroes[role][0][1])
                    .setColor("f06414");
                embeds.push(embed);
                heroes[roles[0]].shift();
                roles.shift();
            }
            argumentslower.shift();
        }

        return await message.channel.send({ embeds: embeds })
            .catch((error) => {
                log(`Overwatch command error sending message for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            });
    }
};