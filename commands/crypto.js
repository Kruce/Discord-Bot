const Discord = require(`discord.js`);
const Number = require(`../modules/number.js`);
const Request = require(`request-promise`);

module.exports = {
    name: `crypto`,
    description: `retrieves crypto data for a given symbol.`,
    aliases: [`c`], //other alias to use this command
    usage: `*${process.env.PREFIX}c* [crypto symbol]`, //how to use the command
    args: true, //arguments are required.
    cooldown: 5, //cooldown on command in seconds
    execute(message, args) {
        if (args.length > 1) return message.channel.send(`please enter one symbol at a time.`);
        const symbol = args[0].toUpperCase();
        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
            qs: {
                'symbol': symbol,
            },
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMCAPIKEY
            },
            json: true,
            gzip: true
        };

        Request(requestOptions).then(response => {
            const coinKey = Object.keys(response.data)[0];
            if (!coinKey) {
                return message.reply(`there is an issue retrieving data for that symbol.`).catch(e => { console.error(`crypto command issue sending message:`, e); });
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
        }).catch((e) => {
            console.error(e);
            return message.reply(`there is an issue retrieving data for that symbol.`).catch(e => { console.error(`crypto command issue sending message:`, e); });
        });
    },
};