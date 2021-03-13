const Discord = require(`discord.js`);
const Request = require(`request-promise`);

/**
 * @param {number} number number to format.
 */
function CommaString(number) {
    if (!number) {
        return `?`;
    }
    else {
        let parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
}
/**
 * @param {number} number number to format.
 */
function DecimalString(number) {
    let log10 = number ? Math.floor(Math.log10(number)) : 0,
        div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;
    numb = Math.round(number * div) / div;
    return (CommaString(numb));
}

module.exports = {
    name: `crypto`,
    description: `Retrieves crypto data for a given symbol.`,
    aliases: [`c`], //other alias to use this command
    usage: `*${process.env.PREFIX}c* btc`, //how to use the command
    cooldown: 5, //cooldown on command in seconds
    execute(message, args) {
        if (!args.length) return message.channel.send(`Please enter a symbol to retrieve data.`);
        if (args.length > 1) return message.channel.send(`Please enter one symbol at a time.`);
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
                return message.channel.send(`There is an issue retrieving data for that symbol.`).catch(e => { console.error(`crypto command issue sending message:`, e); });
            }
            else {
                const coin = response.data[coinKey];
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Estimated price of ${coin.name} (${coin.symbol})`)
                    .setDescription(`Circulating supply: ${CommaString(coin.circulating_supply)} / ${CommaString(coin.max_supply)}`)
                    .setTimestamp(new Date().toUTCString())
                    .addFields(
                        { name: 'Market Cap', value: `$${DecimalString(coin.quote.USD.market_cap)}` },
                        { name: 'Price', value: `$${DecimalString(coin.quote.USD.price)}` },
                    );
                return message.channel.send(embed).catch(e => { console.error(`crypto command issue sending message:`, e); });
            }
        }).catch((e) => {
            console.error(e);
            return message.channel.send(`There is an issue retrieving data for that symbol.`).catch(e => { console.error(`crypto command issue sending message:`, e); });
        });
    },
};