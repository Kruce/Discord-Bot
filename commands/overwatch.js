const Shuffle = require(`../modules/shuffle.js`);
module.exports = {
    name: `overwatch`,
    description: `Given any combination of a total of six space separated player names or overwatch roles, assign the player name a role and hero or the overwatch role a new hero. If no arguments are given, command will use any players currently playing Overwatch.`,
    aliases: [`ow`], //other alias to use this command
    usage: `*${process.env.PREFIX}ow* to assign a role and hero to any players currently playing overwatch on this server, *${process.env.PREFIX}ow joe bill jane bob smith* to assign a role and hero to the given names, *${process.env.PREFIX}ow support support damage tank damage tank* to assign a new hero for the given roles, *${process.env.PREFIX}ow joe bill damage tank* to do a combination of both.`, //how to use the command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        if (!args.length && message.channel.type === `text`) //if array is empty and this isn't a dm, attempt to get all players currently playing overwatch
            args = Array.from(message.guild.presences.cache.filter(function (p) { return p.activities.some(function (a) { return a.name.trim().toUpperCase() == `OVERWATCH` }) }), p => p[1].member.displayName);
        if (!args.length || args.length > 6) //if array is empty or more than six players/roles return message
            return message.channel.send(`To assign, overwatch requires six or less of any combination of player names or overwatch roles.`);
        let reservedroles = []; //if they are just requesting a hero change, the role gets reserved
        let remainedroles = [`tank`, `tank`, `damage`, `damage`, `support`, `support`];
        let heroes = {
            "tank": [`d.va`, `orisa`, `reinhardt`, `roadhog`, `sigma`, `winston`, `wrecking ball`, `zarya`],
            "damage": [`ashe`, `bastion`, `doomfist`, `echo`, `genji`, `hanzo`, `junkrat`, `mcree`, `mei`, `pharah`, `reaper`, `soldier: 76`, `sombra`, `symmetra`, `torbjörn`, `tracer`, `widowmaker`],
            "support": [`ana`, `baptiste`, `brigitte`, `lúcio`, `mercy`, `moira`, `zenyatta`]
        };
        const argumentslower = args.map(v => v.toLowerCase()); //convert all user input to lower case to help match any roles
        for (const arg of argumentslower) { //update our remained and reserved roles before we start assigning them
            const index = remainedroles.indexOf(arg); //check if the current word is equal to a role and there are any remaining
            if (index > -1) { //if it exists, remove it from remained roles and add it to reserved roles
                const role = remainedroles[index];
                remainedroles.splice(index, 1);
                reservedroles.push(role);
            }
        }
        let data = ``; //data being returned to user
        while (argumentslower.length > 0) { 
            for (let [key, value] of Object.entries(heroes)) { //shuffling roles and heroes inside while loop instead of outside for extra randomness
                heroes[key] = Shuffle.ShuffleArray(value)
            }
            const arg = argumentslower[0]; //since we shift at end of loop this will always be the current word
            if (reservedroles.includes(arg)) { //if the message is a role and there's still roles of that type left to use
                data += `{**new ${arg} hero**: ${heroes[arg][0]}} `;
                heroes[arg].shift();
                reservedroles.splice(reservedroles.findIndex(x => x == arg), 1); //remove the first instance of the role
            }
            else {
                remainedroles = Shuffle.ShuffleArray(remainedroles);
                data += `**${(arg)}:** {${remainedroles[0]}, ${heroes[remainedroles[0]][0]}} `;
                heroes[remainedroles[0]].shift();
                remainedroles.shift();
            }
            argumentslower.shift();
        }
        message.channel.send(data).catch(e => { console.error(`overwatch command error sending message for: ${message.guild.name} id: ${message.guild.id}`, e); });
    },
};
