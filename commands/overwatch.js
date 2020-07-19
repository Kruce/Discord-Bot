const Shuffle = require(`../modules/shuffle.js`);
module.exports = {
    name: `overwatch`,
    description: `Given any combination of a total of six space separated player names or overwatch roles, assign the player name a role and hero or the overwatch role a new hero. If no arguments are given, command will use any players currently playing Overwatch.`,
    aliases: [`ow`], //other alias to use this command
    usage: `<player name> or <overwatch role>`, //how to use the command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        if (!args.length && message.channel.type === `text`) { //if not a dm and the arguments are empty, get any players currently playing overwatch and use them
            for (const [key, presence] of message.guild.presences.cache) {
                for (const activity of presence.activities) {
                    if (activity.name.trim().toUpperCase() == `OVERWATCH`) {
                        args.push(presence.user.username);
                    }
                }
            }
        }
        if (!args.length || args.length > 6) return message.channel.send(`To assign, overwatch requires six or less of any combination of player names or overwatch roles.`);
        args = args.map(v => v.toLowerCase()); //convert all user input to lower case
        let data = ``;
        let reservedroles = []; //if they are just requesting a hero change, the role gets reserved
        let remainedroles = [`tank`, `tank`, `damage`, `damage`, `support`, `support`];
        let heroes = {
            "tank": [`d.va`, `orisa`, `reinhardt`, `roadhog`, `sigma`, `winston`, `wrecking ball`, `zarya`],
            "damage": [`ashe`, `bastion`, `doomfist`, `echo`, `genji`, `hanzo`, `junkrat`, `mcree`, `mei`, `pharah`, `reaper`, `soldier: 76`, `sombra`, `symmetra`, `torbjörn`, `tracer`, `widowmaker`],
            "support": [`ana`, `baptiste`, `brigitte`, `lúcio`, `mercy`, `moira`, `zenyatta`]
        };
        for (const arg of args) { //update our remained and reserved roles before we start assigning them
            const index = remainedroles.indexOf(arg); //check if the current word is equal to a role and there are any remaining
            if (index > -1) { //if it exists, remove it from remained roles and add it to reserved roles
                const role = remainedroles[index];
                remainedroles.splice(index, 1);
                reservedroles.push(role);
            }
        }
        while (args.length > 0) { //shuffling roles and heroes inside while loop for extra randomness
            const arg = args[0]; //since we shift at end of loop this will always be the current word
            heroes["tank"] = Shuffle.ShuffleArray(heroes["tank"]);
            heroes["damage"] = Shuffle.ShuffleArray(heroes["damage"]);
            heroes["support"] = Shuffle.ShuffleArray(heroes["support"]);

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
            args.shift();
        }
        message.channel.send(data).catch(e => { console.error(`overwatch command error sending message for: ${message.guild.name} id: ${message.guild.id}`, e); });
    },
};