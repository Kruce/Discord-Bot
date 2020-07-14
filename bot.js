const Discord = require(`discord.js`);
const Client = new Discord.Client({ partials: [`MESSAGE`, `CHANNEL`, `REACTION`] });
const Schedule = require(`node-schedule-tz`);
const TinyColor = require(`tinycolor2`);
const Holiday = require(`./holiday.js`);
const Overwatch = require(`./overwatch`);
const Shuffle = require(`./shuffle`);

Client.on(`ready`, () => {
    console.log(`logged in as ${Client.user.tag}!`);
});

Schedule.scheduleJob(`holiday job`, `0 0 * * *`, `America/New_York`, () => {
    let emojis = Holiday.EmojisToday(); //empty string if no holidays
    let name = `me and the boys`;
    if (emojis != ``) name = `${emojis} ${name} ${emojis}`; //if a holiday exists, format name with spaces
    Client.guilds.cache.get(`232319112141996032`).setName(name);
});

Client.on(`message`, msg => {
    if (msg.content.substring(0, 1) == `!`) {
        let args = msg.content.substring(1).split(` `);
        let cmd = args[0];
        let content = args.splice(1).join(` `); //remove the cmd with splice then join each argument for the user's requested content string
        switch (cmd) {
            case `c`: {
                let color = `DEFAULT`;
                let contentUpper = content.toUpperCase();
                if (contentUpper != color) { //unless default, generate color from user's input
                    let colorObj = (contentUpper == `RANDOM`) ? TinyColor.random() : TinyColor(contentUpper);
                    while (!colorObj.isValid() || (colorObj.isValid() && TinyColor.readability(`#36393F`, colorObj.toHexString()) <= 1)) { //if the colorObj is not valid, or if it is valid but not very readable when compared to discord's background color, generate a new color until one is found.
                        colorObj = TinyColor.random();
                    }
                    color = colorObj.toHexString();
                }
                let restrictedRoleIds = [`232319112141996032`, `674393490423021568`]; //`everyone` and `Server Booster` roles are restricted from color change
                let role = msg.member.roles.cache.filter(r => !restrictedRoleIds.includes(r.id)).first(); //filter out restricted roles and set the role to the only one (users have one role)
                if (role) { //if a role exists, change color as expected, otherwise create a new role with color
                    role.setColor(color)
                        .then(role => console.log(`!rc successfully set color of role ${role.name} to ${role.color}`))
                        .catch(e => {
                            console.log(`!rc error setting color: ${msg.guild.name} for id: ${msg.guild.id}`);
                        });
                }
                else {
                    msg.guild.roles
                        .create({
                            data: {
                                name: msg.member.displayName,
                                color: color,
                                position: restrictedRoleIds.length //since this is new, place it above all restricted roles highest role. since restricted roles are on the bottom and start at zero, just count all restricted roles in the restrictedRoleIds array to get position the new role should be.
                            },
                            reason: `!rc user did not have a role when trying to access command.`,
                        })
                        .then(r => msg.member.roles.add(r)) //add new role to user requesting the color change
                        .catch(e => {
                            console.log(`!rc error creating role for: ${msg.guild.name} id: ${msg.guild.id}`);
                        })
                        .finally(() => console.log(`!rc new role created and added to the user: ${msg.member.displayName}.`));
                }
                break;
            }
            case `holiday`: {
                let holidays = Holiday.HolidaysToday();
                if (holidays && holidays.length) { //if holiday(s) exist, create a new embed message and add each holiday as a field with holiday information
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Today's Holidays`)
                        .setThumbnail(`https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png`)
                        .setTimestamp(new Date().toUTCString());
                    for (var i = 0; i < holidays.length; ++i) {
                        embed.addField(holidays[i][0], `[${holidays[i][1]}](${holidays[i][2]})`);
                    }
                    MsgSend(msg, embed);
                }
                break;
            }
            case `ow`: {
                if (content === ``) { //if empty, get any players currently playing overwatch and use them
                    for (let [key, presence] of msg.guild.presences.cache) {
                        let name = presence.user.username.replace(` `, `%20`); //splitting by space in overwatch command, so using %20 until then
                        for (let activity of presence.activities) {
                            if (activity.name.trim().toUpperCase() == `OVERWATCH`) {
                                content += `${name} `;
                            }
                        }
                    }
                }
                MsgSend(msg, Overwatch.AssignRolesHeroes(content));
                break;
            }
            case `rit`: {
                let numbers = [`zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`];
                let message = ``; //empty string for a return message
                for (var i = 0; i < content.length; i++) {
                    let charCurrent = content.charAt(i);
                    if (charCurrent.match(/[a-z]/i)) { //match alpha characters regardless of case
                        message += `:regional_indicator_${charCurrent.toLowerCase()}:`;
                    }
                    else if (charCurrent.match(/\d+/)) { //match numeric characters
                        message += `:${numbers[parseInt(charCurrent)]}:`;
                    }
                    else if (charCurrent == `?`) {
                        message += `:grey_question:`;
                    }
                    else if (charCurrent == `!`) {
                        message += `:grey_exclamation:`;
                    }
                    else {
                        message += charCurrent;
                    }
                    message += ` `; //added space to display emoji correctly for mobile users
                }
                MsgDelete(msg, 1);
                MsgSend(msg, `${msg.member.displayName} ${message}`);
                break;
            }
        }
    }
});

Client.on(`messageReactionAdd`, async (reaction, user) => {
    if (reaction.emoji.id != `651815701782200320`) return; //if emoji is not BUB
    if (user.bot) return; //if it's a bot, ignore
    let message = reaction.message;
    if (reaction.partial) { //check if the reaction is part of a partial, or previously uncached
        try { // If the message this reaction belongs to was removed fetching might result in an API error
            await reaction.fetch();
        } catch (e) {
            console.log(`Something went wrong when fetching the message: `, e);
            return;
        }
    }
    //message is cached and available now
    let cats = [
        `598348083490979846`, //smordecai2
        `597272180769685527`, //smordecai
        `651815701782200320`, //BUB
        `598345950951374898`, //zexy2
        `597270542139260930`, //zexy
        `602357863104512030`, //oliver
        `598377503333285891`, //thunderpaws
        `607772984098160660`, //reggie
        `665730452119879721`, //nala
    ];
    let botReactions = Array.from(message.reactions.cache.filter(reaction => reaction.users.cache.has(`696792226956836954`)).keys());
    if (cats.every(v => botReactions.includes(v))) return; //message already contains all cats from bot

    Promise.all(Shuffle.ShuffleArray(cats).map((cat) => { //promise.all won't guarantee same order already, but it usally does so I still shuffle order first so they're always random
        message.react(cat)
    })).catch(() => console.log(`one emoji failed to react.`));
});

/**
* Sends a message to the msg channel
* @param {Message} msg a message on Discord
* @param {string} message a new message to send to the msg channel
*/
function MsgSend(msg, message) {
    msg.channel.send(message)
        .catch(e => {
            console.log(`error sending message for: ${msg.guild.name} id: ${msg.guild.id}`);
        });
}

/**
* Deletes the msg after a given timeout
* @param {Message} msg a message on Discord
* @param {number} timeout How long to wait to delete the message in milliseconds
*/
function MsgDelete(msg, timeout) {
    msg.delete({ timeout: timeout })
        .catch(e => {
            console.log(`error deleting message for: ${msg.guild.name} for id: ${msg.guild.id}`);
        });
}

Client.login(process.env.BOT_TOKEN);