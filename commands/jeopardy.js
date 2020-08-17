const Discord = require(`discord.js`);
const https = require(`https`);
module.exports = {
    name: `jeopardy`,
    description: `Get a jeopardy formatted trivia question and answer.`,
    aliases: [`j`], //other alias to use this command
    usage: `<answer>, <next>, or blank to repeat the question`, //how to use the command
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        let GetJeopardy = new Promise((resolve, reject) => {
            if (args[0] == `next` || message.client.jeopardy === undefined || message.client.jeopardy === null) {
                message.client.jeopardy = new Discord.Collection();
                https.get(`https://jservice.io/api/random`, (resp) => {
                    let data = ``;
                    resp.on(`data`, (chunk) => {
                        data += chunk;
                    });
                    // The whole response has been received. Print out the result.
                    resp.on(`end`, () => {
                        let jeopardyJson = JSON.parse(data)[0];
                        message.client.jeopardy.set(`id`, jeopardyJson.id);
                        message.client.jeopardy.set(`category`, jeopardyJson.category.title);
                        message.client.jeopardy.set(`question`, jeopardyJson.question);
                        message.client.jeopardy.set(`answer`, jeopardyJson.answer);
                        resolve(true);
                    });

                }).on(`error`, (err) => {
                    console.error(err.message);
                    reject(false);
                });
            }
            else {
                resolve(true);
            }
        })
        GetJeopardy.then((response) => {
            if (response) {
                if (args[0] == `answer`) {
                    let answer = message.client.jeopardy.get(`answer`);
                    message.channel.send(`${answer.charAt(0).toUpperCase()}${answer.slice(1)}`)
                        .catch(e => { console.error(`jeopardy command issue sending message:`, e); });
                }
                else {
                    let category = message.client.jeopardy.get(`category`);
                    let data = `\n**Category:** ${category.charAt(0).toUpperCase()}${category.slice(1)} \n**Question:** ${message.client.jeopardy.get(`question`)}`;
                    message.channel.send(data)
                        .catch(e => { console.error(`jeopardy command issue sending message:`, e); });
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    },
};