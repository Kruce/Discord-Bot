const fetch = require('node-fetch');
const { Message, EmbedBuilder } = require('discord.js');
const { log, decimalString } = require('../../../functions');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: 'stock',
        description: `Retrieves stock data for a given symbol.`,
        aliases: ['s'],
        usage: `Enter 1 company symbol argument to retrieve stock data for the given symbol`,
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
            if (!args.length || args.length > 1) {
                return await message.reply(`please enter no more than one symbol at a time.`);
            }
            const symbol = args[0].toUpperCase();
            let response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
            if (response.ok) {
                const profile = await response.json()
                let qresponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
                if (qresponse.ok) {
                    const quote = await qresponse.json();
                    const embed = new EmbedBuilder()
                        .setTitle(`Estimated price of ${profile.name} (${profile.ticker})`)
                        .setDescription(profile.finnhubIndustry)
                        .setColor("1db954")
                        .setURL(profile.weburl)
                        .setThumbnail(profile.logo)
                        .setTimestamp()
                        .addFields(
                            { name: 'Exchange', value: profile.exchange },
                            { name: 'Price', value: `$${decimalString(quote.c)}` });
                    return await message.channel.send({ embeds: [embed] });
                }
            }
        } catch (error) {
            log(`Stock command error while attempting to retrieve data for that symbol(s): ${message.guild.name} id: ${message.guild.id}. \n ${error}`, "err");
            return await message.reply(`there is an issue retrieving data for that symbol.`);
        }
    },
};