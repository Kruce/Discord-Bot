const fs = require(`fs`);
const Discord = require(`discord.js`);
const Client = new Discord.Client({ partials: [`MESSAGE`, `CHANNEL`, `REACTION`] });
const Schedule = require(`node-schedule-tz`);
const Holiday = require(`./modules/holiday`);
const Shuffle = require(`./modules/shuffle`);
const Cheerio = require(`cheerio`);
const Fetch = require('node-fetch');
const Server = require(`./modules/server`);

//set our commands collection
Client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    Client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

Server.Listen();

Client.on(`ready`, () => {
    console.log(`logged in as ${Client.user.tag}!`);
});

Schedule.scheduleJob(`daily job`, `0 0 * * *`, `America/New_York`, () => {
    console.log(`daily job has started!`);
    const emojis = Holiday.EmojisToday(); //empty string if no holidays
    let name = `me and the boys`;
    if (emojis != ``) name = `${emojis} ${name} ${emojis}`; //if a holiday exists, format name with spaces
    Client.guilds.cache.get(`232319112141996032`).setName(name);

    //scrape blizzard's site for overwatch hero data until an api is available
    Client.overwatch = new Discord.Collection();
    Fetch(`https://overwatch.blizzard.com/en-us/heroes/`)
        .then(response => response.text())
        .then(function (body) {
            let $ = Cheerio.load(body);
            let main = $(`blz-media-gallery`).children();
            let heroes = { "tank": [], "damage": [], "support": [] };
            for (let i = 1; i < main.length; ++i) {
                const role = main[i].attribs[`data-role`].replace(/\W/g, ``).toLowerCase(); //remove non-alpha characters and convert to lowercase
                const hero = main[i].attribs[`hero-name`].toLowerCase();
                heroes[role].push(hero);
            }
            Client.overwatch.set(`heroes`, heroes);
        })
        .catch(function (error) {
            console.error(`Daily overwatch web scrape error: ${error}`);
        });
});

Client.on(`message`, message => {
    if (!message.content.startsWith(process.env.COMMAND_PREFIX) || message.author.bot) return;
    const args = message.content.slice(process.env.COMMAND_PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = Client.commands.get(commandName) || Client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return; //no command exists

    if (command.guildOnly && message.channel.type !== `text`) {
        return message.reply(`I can't execute that command inside dms.`);
    }

    if (command.args && !args.length) {
        let reply = `you didn't provide any arguments, ${message.author}.`;
        if (command.usage) {
            reply += `\n\`an example of proper usage would be:\` ${command.usage}`;
        }
        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`there was an error trying to execute that command.`);
    }
});

Client.on(`messageReactionAdd`, async (reaction, user) => {
    if (reaction.emoji.id != `651815701782200320` || user.bot) return; //if emoji is not BUB or this is a bot reacting
    const message = reaction.message;
    if (reaction.partial) { //check if the reaction is part of a partial, or previously uncached
        try { // If the message this reaction belongs to was removed fetching might result in an API error
            await reaction.fetch();
        } catch (e) {
            console.error(`adding cat emojis error, error when fetching the partial message: `, e);
            return;
        }
    } //message is cached and available now
    let catEmojis = Shuffle.ShuffleArray(message.guild.emojis.cache.filter(emoji => emoji.name.endsWith(`_`)).map(emoji => emoji.id));
    let totalReactionAmount = 20 - message.reactions.cache.size; //20 is the max amount of emojis allowed, subtract any slots already used
    //if message already has cat emojis, move to the front or back based on whether the bot reacted to them already or not
    message.reactions.cache.forEach((reaction) => {
        if (reaction.emoji.name.endsWith(`_`)) {
            let index = catEmojis.indexOf(reaction.emoji.id);
            if (index !== -1) {
                if (reaction.me) {
                    catEmojis.push(catEmojis.splice(index, 1)[0]);
                }
                else {
                    catEmojis.unshift(catEmojis.splice(index, 1)[0]);
                    totalReactionAmount += 1; //add one reaction if it was a cat that hasn't been reacted by the bot yet
                }
            }
        }
    });
    if (totalReactionAmount == 0)
        return;
    Promise.all(catEmojis.slice(0, totalReactionAmount).map(reaction => message.react(reaction)))
        .catch(e => { console.error(`adding cat emojis error, one failed to react: `, e) });
});

Client.login(process.env.BOT_TOKEN);