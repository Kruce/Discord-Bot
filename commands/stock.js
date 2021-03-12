const Cheerio = require(`cheerio`);
const Discord = require(`discord.js`);

module.exports = {
    name: `stock`,
    description: `Retrieves data for a nyse symbol from google finance.`,
    aliases: [`s`], //other alias to use this command
    usage: `*${process.env.PREFIX}s* gme`, //how to use the command
    cooldown: 10, //cooldown on command in seconds
    execute(message, args) {
        if (!args.length) return message.channel.send(`Please enter a nyse symbol for current price.`);
        if (args.length > 1) return message.channel.send(`Please only enter one nyse symbol at a time.`);

        const options = { uri: `https://www.google.com/finance/quote/${args}:NYSE`, transform: function (body) { return Cheerio.load(body); } };
        Request(options)
            .then(function ($) {
                const main = $(`main`).children();
                const info = main[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
                const name = info.firstChild.firstChild.data;
                const price = info.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.data;
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Price of ${name}`)
                    .setDescription(price)
                    .setTimestamp(new Date().toUTCString());
                message.channel.send(embed)
                    .catch(e => { console.error(`stock command error sending message for: ${message.guild.name} id: ${message.guild.id}`, e); });
            })
            .catch(function (e) {
                console.error(`stock command error:`, e);
                message.channel.send(`There was an error scraping google finance for that nyse symbol.`);
            });
    },
};