const { Message, ChannelType, EmbedBuilder } = require('discord.js');
const { log, shuffleArray } = require('../../../functions/utility');
const ExtendedClient = require('../../../class/ExtendedClient');
const playerMax = 6;

module.exports = {
    structure: {
        name: 'rivals',
        description: 'Assign the name a rivals role and hero or the rivals role a new hero.',
        aliases: ['r'],
        usage: `Enter any combination of a total of ${playerMax} space separated player names or rivals roles as arguments. Command will assign the player name argument a role and hero, or the rivals role argument a new hero. If no arguments are given, command will use any players currently playing marvel rivals.`,
        permissions: 'SendMessages',
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        if (!args.length && message.channel.type === ChannelType.GuildText)  //if array is empty and this isn't a dm, attempt to get all players currently playing rivals
            args = message.guild.presences.cache.filter(function (p) { return p.activities.some(function (a) { return a.name.trim().toLowerCase().includes(`marvel rivals`) }) }).map(p => p.member.displayName);
        if (!args.length || args.length > playerMax) { //if array is empty or more than allowed players.. return message
            return await message.channel.send(`${message.author}, your provided arguments are invalid.`);
        }

        const rivals = message.client.rivals;
        if (!rivals)
            return await message.channel.send(`${message.author}, there is an issue retrieving heroes from the cache. there is no marvels api, therefore data for this command is scraped directly from the marvel rivals web page. if changes were made to the web page, this scrape may need to be updated to reflect them.`);
        
        const heroes = structuredClone(rivals.get(`heroes`));
        if (typeof heroes === "undefined")
            return await message.channel.send(`${message.author}, there is an issue with the cached heroes. there is no marvels api, therefore data for this command is scraped directly from the marvel rivals web page. if changes were made to the web page, this scrape may need to be updated to reflect them.`);
            
        let roles = Object.keys(heroes);
        let reservedroles = []; //if they are just requesting a hero change, the role gets reserved
        const argslower = args.map(v => v.toLowerCase()); //convert all user input to lower case to help match any roles
        for (const arg of argslower) { //update our reserved roles before we start assigning them
            if (roles.includes(arg)) { //if it exists, remove it from remained roles and add it to reserved roles
                reservedroles.push(arg);
            }
        }

        let embeds = [];
        while (argslower.length > 0) {
            for (let [key, value] of Object.entries(heroes)) { //shuffling roles and heroes inside while loop instead of outside for extra randomness
                heroes[key] = shuffleArray(value)
            }
            const arg = argslower.shift();
            const embed = new EmbedBuilder().setColor("fadb29");
            const reserveRoleIndex = reservedroles.findIndex(x => x == arg);
            if (reserveRoleIndex != -1) { //arg is a rivals role here
                const hero = heroes[reservedroles.splice(reserveRoleIndex, 1)].shift();
                embed.setDescription(`${arg}\n${hero[0]}`)
                embed.setThumbnail(hero[1])
            } else {
                roles = shuffleArray(roles);
                const role = roles[0];
                const hero = heroes[role].shift();
                embed.setDescription(`**${arg}**\n${role}\n${hero[0]}`) //arg is a username here
                embed.setThumbnail(hero[1])
            }
            embeds.push(embed);
        }

        return await message.channel.send({ embeds: embeds })
            .catch((error) => {
                log(`Rivals command error sending message for: ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            });
    }
};