const Discord = require(`discord.js`);
const Number = require(`../modules/number.js`);
const Request = require(`request-promise`);

module.exports = {
    name: `stock`,
    description: `Retrieves stock data for a given symbol.`,
    aliases: [`s`], //other alias to use this command
    usage: `*${process.env.PREFIX}s* gme`, //how to use the command
    args: true, //arguments are required.
    cooldown: 10, //cooldown on command in seconds
    execute(message, args) {
        if (args.length > 1) return message.reply(`Please only enter one symbol at a time.`);
        const symbol = args[0].toUpperCase();
        Request(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUBAPIKEY}`, { json: true }, (err, res, body) => {
            if (body.name == undefined)
                return message.reply(`There is an issue retrieving that data for that symbol.`).catch(e => { console.error(`stock command issue sending message:`, e); });
            else
                return body;
        })
        .then(function (profile) {
            Request(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUBAPIKEY}`, { json: true }, (err, res, body) => {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Estimated price of ${profile.name} (${profile.ticker})`)
                    .setURL(profile.weburl)
                    .setDescription(profile.finnhubIndustry)
                    .setThumbnail(profile.logo)
                    .setTimestamp(new Date().toUTCString())
                    .addFields(
                        { name: 'Exchange', value: profile.exchange },
                        { name: 'Price', value: `$${Number.DecimalString(body.c)}` },
                    );
                return message.channel.send(embed).catch(e => { console.error(`stock command issue sending message:`, e); });
            });
        })
        .catch(function (e) {
            console.error(e);
            return message.reply(`There is an issue retrieving that data for that symbol.`).catch(e => { console.error(`stock command issue sending message:`, e); });
        })
    },
};