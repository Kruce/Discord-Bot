const Discord = require(`discord.js`);
const https = require(`https`);
module.exports = {
    name: `jeopardy`,
    description: `Get a jeopardy formatted trivia question and answer.`,
    aliases: [`j`], //other alias to use this command
    usage: `<answer>, <repeat>, or blank for a new question`,
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        let cmd = (args.length) ? args[0].toLowerCase() : ``; //command if any
        const GetOrSetJeopardyCache = () =>
            new Promise((resolve, reject) => {
                if (message.client.jeopardy === undefined || message.client.jeopardy === null || !cmd) {
                    https.get(`https://jservice.io/api/random`, (response) => {
                        let data = ``;
                        response.on(`data`, (chunk) => {
                            data += chunk;
                        });
                        response.on(`end`, () => {
                            const jservice = JSON.parse(data)[0];
                            if (jservice.invalid_count !== null && jservice.invalid_count >= 5) { //if question was marked as invalid more than five times, ignore and get another question
                                resolve(`retry`);
                            }
                            message.client.jeopardy = new Discord.Collection();
                            for (const property in jservice) {
                                message.client.jeopardy.set(property, jservice[property])
                            }
                            resolve(`cached`);
                        });
                    }).on(`error`, (error) => {
                        console.error(error.message);
                        reject(error.message);
                    });
                }
                else { resolve(`cached`); }
            });
        const GetJeopardyQuestion = () => //loop until a proper question is cached
            GetOrSetJeopardyCache().then(result => {
                if (result === `retry`) {
                    return GetJeopardyQuestion();
                }
            })
        GetJeopardyQuestion().then(() => {
            if (cmd == `answer`) {
                let answer = message.client.jeopardy.get(`answer`);
                return message.channel.send(`${answer.charAt(0).toUpperCase()}${answer.slice(1)}`).catch(e => { console.error(`jeopardy command issue sending message:`, e); });
            }
            else {
                let category = message.client.jeopardy.get(`category`).title;
                let data = `\n**Category:** ${category.charAt(0).toUpperCase()}${category.slice(1)} \n**Question:** ${message.client.jeopardy.get(`question`)}`;
                return message.channel.send(data).catch(e => { console.error(`jeopardy command issue sending message:`, e); });
            }
        });
    },
};