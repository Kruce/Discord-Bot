const fs = require(`fs`);
const Discord = require(`discord.js`);
const Client = new Discord.Client({ partials: [`MESSAGE`, `CHANNEL`, `REACTION`] });
const Schedule = require(`node-schedule-tz`);
const Holiday = require(`./modules/holiday`);
const Shuffle = require(`./modules/shuffle`);

//set our commands collection
Client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    Client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

Client.on(`ready`, () => {
    console.log(`logged in as ${Client.user.tag}!`);
});

Schedule.scheduleJob(`holiday job`, `0 0 * * *`, `America/New_York`, () => {
    const emojis = Holiday.EmojisToday(); //empty string if no holidays
    let name = `me and the boys`;
    if (emojis != ``) name = `${emojis} ${name} ${emojis}`; //if a holiday exists, format name with spaces
    Client.guilds.cache.get(`232319112141996032`).setName(name);
});

Client.on(`message`, message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = Client.commands.get(commandName) || Client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return; //no command exists

    if (command.guildOnly && message.channel.type !== `text`) {
        return message.reply(`I can\'t execute that command inside DMs!`);
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
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
        message.reply(`there was an error trying to execute that command!`);
    }
});

Client.on(`messageReactionAdd`, async (reaction, user) => {
    if (reaction.emoji.id != `651815701782200320`) return; //if emoji is not BUB
    if (user.bot) return; //if it's a bot, ignore
    const message = reaction.message;
    if (reaction.partial) { //check if the reaction is part of a partial, or previously uncached
        try { // If the message this reaction belongs to was removed fetching might result in an API error
            await reaction.fetch();
        } catch (e) {
            console.error(`adding cat emojis error, error when fetching the partial message: `, e);
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
    const botReactions = Array.from(message.reactions.cache.filter(reaction => reaction.users.cache.has(`696792226956836954`)).keys());
    if (cats.every(v => botReactions.includes(v))) return; //message already contains all cats from bot

    Promise.all(Shuffle.ShuffleArray(cats).map((cat) => { //promise.all won't guarantee same order already, but it usally does so I still shuffle order first so they're always random
        message.react(cat)
    })).catch(e => {
        console.error(`adding cat emojis error, one failed to react: `, e)
    });
});

Client.login(process.env.BOT_TOKEN);