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
        if (args.length > 1) return message.channel.send(`Please enter one symbol at a time.`);
        const symbol = args[0].toUpperCase();
        Request(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUBAPIKEY}`, { json: true }, (err, res, body) => {
            return body;
        }).then(function (price) {
            Request(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUBAPIKEY}`, { json: true }, (err, res, body) => {
                if (body.name == undefined) {
                    return message.channel.send(`There is an issue retrieving data for that symbol.`).catch(e => { console.error(`stock command issue sending message:`, e); });
                }
                else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Estimated price of ${body.name} (${body.ticker})`)
                        .setURL(body.weburl)
                        .setDescription(body.finnhubIndustry)
                        .setThumbnail(body.logo)
                        .setTimestamp(new Date().toUTCString())
                        .addFields(
                            { name: 'Exchange', value: body.exchange },
                            { name: 'Price', value: `$${Number.DecimalString(price.c)}` },
                        );
                    return message.channel.send(embed).catch(e => { console.error(`stock command issue sending message:`, e); });
                }
            });
        })
        .catch(function (e) {
            console.error(e);
            return message.channel.send(`There is an issue retrieving data for that symbol.`).catch(e => { console.error(`stock command issue sending message:`, e); });
        })
    },
};