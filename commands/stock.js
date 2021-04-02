const Discord = require(`discord.js`);
const Fetch = require(`node-fetch`);
const Number = require(`../modules/number.js`);

module.exports = {
    name: `stock`,
    description: `retrieves stock data for a given symbol.`,
    aliases: [`s`], //other alias to use this command
    usage: `*${process.env.PREFIX}s* [stock symbol]`, //how to use the command
    args: true, //arguments are required.
    cooldown: 10, //cooldown on command in seconds
    execute(message, args) {
        if (args.length > 1) return message.reply(`please only enter one symbol at a time.`);
        const symbol = args[0].toUpperCase();
        let profile;
        Fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUBAPIKEY}`)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            })
            .then(function (response) {
                if (response.name == undefined)
                    return Promise.reject(response);
                else {
                    profile = response;
                    return Fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUBAPIKEY}`);
                }
            })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            })
            .then(function (quote) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Estimated price of ${profile.name} (${profile.ticker})`)
                    .setURL(profile.weburl)
                    .setDescription(profile.finnhubIndustry)
                    .setThumbnail(profile.logo)
                    .setTimestamp(new Date().toUTCString())
                    .addFields(
                        { name: 'Exchange', value: profile.exchange },
                        { name: 'Price', value: `$${Number.DecimalString(quote.c)}` },
                    );
                return message.channel.send(embed).catch(e => { console.error(`stock command issue sending message:`, e); });
            })
            .catch(function (error) {
                console.error(error);
                return message.reply(`There is an issue retrieving data for that symbol.`).catch(e => { console.error(`stock command issue sending message:`, e); });
            })
    },
};