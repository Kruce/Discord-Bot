const Discord = require(`discord.js`);
const Fetch = require(`node-fetch`);
const Number = require(`../modules/number.js`);

module.exports = {
    name: `crypto`,
    description: `retrieves crypto data for a given symbol.`,
    aliases: [`c`], //other alias to use this command
    usage: `*${process.env.COMMAND_PREFIX}c* [crypto symbol]`, //how to use the command
    args: true, //arguments are required.
    cooldown: 5, //cooldown on command in seconds
    execute(message, args) {
        if (!args) return message.channel.send(`Please enter a symbol to retrieve current data.`);
        if (args.length > 1) return message.channel.send(`Please only enter one symbol at a time.`);
        const symbol = args[0].toUpperCase();
        Fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
            headers: ({
                "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
                "Accept-Encoding": `deflate, gzip`
            })
        })
        .then(response => CheckStatus(response))
        .then(function (response) {
            const coinKey = Object.keys(response.data)[0];
            if (!coinKey) {
                return Promise.reject(response);
            }
            else {
                const coin = response.data[coinKey];
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Estimated price of ${coin.name} (${coin.symbol})`)
                    .setDescription(`Circulating supply: ${Number.CommaString(coin.circulating_supply)} / ${Number.CommaString(coin.max_supply)}`)
                    .setTimestamp(new Date().toUTCString())
                    .addFields(
                        { name: 'Market Cap', value: `$${Number.DecimalString(coin.quote.USD.market_cap)}` },
                        { name: 'Price', value: `$${Number.DecimalString(coin.quote.USD.price)}` },
                    );
                return message.channel.send(embed).catch(e => { console.error(`crypto command issue sending message:`, e); });
            }
        })
        .catch(function (error) {
            console.error(error);
            return message.reply(`There is an issue retrieving data for that symbol.`).catch(e => { console.error(`crypto command issue sending message:`, e); });
        });
        const CheckStatus = (response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }
    },
};