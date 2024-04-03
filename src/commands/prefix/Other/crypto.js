const fetch = require('node-fetch');
const { Message, EmbedBuilder } = require('discord.js');
const { log, decimalString } = require('../../../functions/utility');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'crypto',
        description: `Retrieves crypto data for up to 10 symbols.`,
        aliases: ['c'],
        usage: `Enter between 1 to 10 space separated arguments in the format of crypto symbols.`,
        permissions: 'SendMessages',
        cooldown: 1
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message<true>} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        try {
            if (!args)
                return await message.channel.send(`please enter a symbol to retrieve current data.`);
            if (!args.length || args.length > 10) {
                return await message.channel.send(`only 10 symbols are allowed.`);
            }
            const symbols = args.join(',').toUpperCase(); //if more than one symbol format and add them
            const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`,
                {
                    headers: ({ "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY, "Accept-Encoding": `deflate, gzip` })
                });
            if (response.ok) {
                const json = await response.json();
                const keys = Object.keys(json.data);
                if (!keys || keys.length < 1) {
                    return Promise.reject(json);
                } else {
                    let embeds = [];
                    for (i = 0; i < keys.length; ++i) {
                        const coin = json.data[keys[i]];
                        const embed = new EmbedBuilder()
                            .setTitle(`Estimated price of ${coin.name} (${coin.symbol})`)
                            .setDescription(`Circulating supply: ${decimalString(coin.circulating_supply)} / ${decimalString(coin.max_supply)}`)
                            .setColor("3861fb")
                            .setTimestamp()
                            .addFields(
                                { name: 'Market Cap', value: `$${decimalString(coin.quote.USD.market_cap)}` },
                                { name: 'Price', value: `$${decimalString(coin.quote.USD.price)}` });
                        embeds.push(embed);
                    }
                    return await message.channel.send({ embeds: embeds });
                }
            }
        } catch (error) {
            log(`Crypto command error while attempting to retrieve data for that symbol(s): ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            return await message.reply(`there is an issue retrieving data for that symbol.`);
        }
    },
};