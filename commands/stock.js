const Cheerio = require(`cheerio`);
const Discord = require(`discord.js`);
const Puppeteer = require(`puppeteer`);

module.exports = {
    name: `stock`,
    description: `Retrieves data for a nyse symbol from google finance.`,
    aliases: [`s`], //other alias to use this command
    usage: `*${process.env.PREFIX}s* gme`, //how to use the command
    cooldown: 10, //cooldown on command in seconds
    execute(message, args) {
        if (!args.length) return message.channel.send(`Please enter a nyse symbol to retrieve data.`);
        if (args.length > 1) return message.channel.send(`Please only enter one nyse symbol at a time.`);
        const url = `https://www.google.com/finance/quote/${args}:NYSE`;
        Puppeteer
            .launch({
                'args' : ['--no-sandbox', '--disable-setuid-sandbox']
            })
            .then(function (browser) {
                return browser.newPage()
            })
            .then(function (page) {
                return page.goto(url).then(function () {
                    return page.content();
                })
            })
            .then(function (html) {
                const main = Cheerio(`main`, html).children();
                const info = main[1].firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
                const name = info.firstChild.firstChild.data;
                const price = info.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.data;
                const change = info.lastChild.lastChild.firstChild.firstChild.attribs[`aria-label`];
                let description = price;
                if (change.length) description += `\n ${change}`;
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Price of ${name}`)
                    .setDescription(description)
                    .setTimestamp(new Date().toUTCString());
                message.channel.send(embed)
                    .catch(e => { console.error(`stock command error sending message for: ${message.guild.name} id: ${message.guild.id}`, e); });
            })
            .catch(function (e) {
                console.error(`stock command error:`, e);
                message.channel.send(`There was an error scraping data for that nyse symbol.`);
            });
    },
};