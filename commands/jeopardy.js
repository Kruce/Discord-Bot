const Discord = require(`discord.js`);
const Fetch = require(`node-fetch`);
module.exports = {
    name: `jeopardy`,
    description: `get a random instant jeopardy formatted trivia clue or choose from a list of categories to get a jeopardy formatted trivia clue.`,
    aliases: [`j`], //other alias to use this command
    usage: `*${process.env.COMMAND_PREFIX}j* for your new random instant clue, *${process.env.COMMAND_PREFIX}j categories* for your new set of categories to choose from, *${process.env.COMMAND_PREFIX}j* [a number to select your category], *${process.env.COMMAND_PREFIX}j answer* for your selected clue's answer, *${process.env.COMMAND_PREFIX}j repeat* to either repeat your categories or your clue, *${process.env.COMMAND_PREFIX}j quiz* for a communal clue that tallies points for the first correct answer in chat, and *${process.env.COMMAND_PREFIX}j points* for the current point totals. points are reset daily.`,
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        var cmd = (args[0]) ? args[0].toLowerCase() : ``;
        if (cmd && (args[1] || [`categories`, `answer`, `repeat`, `quiz`, `points`, `1`, `2`, `3`, `4`, `5`].indexOf(cmd) == -1)) {
            let reply = `the provided arguments are invald, ${message.author}.`;
            if (this.usage) {
                reply += `\n\`the proper usage would be:\` ${this.usage}`;
            }
            return message.channel.send(reply);
        }
        const GetOrSetJeopardyCache = () =>
            new Promise((resolve, reject) => {
                if (message.author.jeopardy == null || !cmd || cmd == `categories` || cmd == `quiz`) {
                    return Fetch(`https://jservice.io/api/random?count=5`)
                        .then(response => CheckStatus(response))
                        .then(function (clues) {
                            const jcollection = SetGetJeopardyCollection(cmd);
                            for (i = 0; i < clues.length; ++i) {
                                const clue = clues[i];
                                if ((clue.invalid_count !== null && clue.invalid_count >= 5) || (clue.question == null || clue.question === ``)) { //if clue was marked as invalid more than five times or the question is just empty ignore and get another 5
                                    return resolve(`retry`);
                                } else {  //clean up some strings
                                    if (clue.question != null) {
                                        clue.question = `${clue.question.charAt(0).toUpperCase()}${clue.question.slice(1)}`; //convert question to upper case
                                    }
                                    if (clue.category.title != null) {
                                        clue.category.title = `${clue.category.title.charAt(0).toUpperCase()}${clue.category.title.slice(1)}`; //convert category to upper case
                                    }
                                    if (clue.answer != null) {
                                        if (clue.answer.includes(`<i>`) && clue.answer.includes(`</i>`)) { //replace the italic html with discord italics
                                            clue.answer = clue.answer.replace(`<i>`, `*`).replace(`</i>`, `*`);
                                        }
                                        clue.answer = `${clue.answer.charAt(0).toUpperCase()}${clue.answer.slice(1)}`; //convert answer to upper case
                                    }
                                }
                            }
                            jcollection.set(`clues`, clues);
                            if (!cmd || cmd == `quiz`) { //if arg was blank or this is a quiz, set chosen clue to a random one from the 5 returned
                                const min = 0; const max = 4;
                                const number = Math.floor(Math.random() * (max - min + 1) + min);
                                jcollection.set(`chosenclue`, number);
                            }
                            return resolve(`cached`);
                        })
                        .catch(function (error) {
                            console.error(error);
                            return reject(`There is an issue getting or setting jeopardy cache.`);
                        });
                }
                else { resolve(`cached`); }
            });
        const GetJeopardyQuestion = () => //loop until a proper question is cached
            GetOrSetJeopardyCache().then(result => {
                if (result === `retry`) {
                    return GetJeopardyQuestion();
                } else {
                    Promise.resolve();
                }
            });
        GetJeopardyQuestion().then(() => {
            const jcollection = SetGetJeopardyCollection(cmd);
            const chosenclue = jcollection.get(`chosenclue`);
            const clues = jcollection.get(`clues`);
            if (cmd == `points`) {
                CheckPointsReset(jcollection);
                const points = jcollection.get(`points`);
                if (!points) {
                    return message.reply(`Nobody has tallied any points for today.`);
                } else {
                    let data = `\n**Point totals for today:**`;
                    for (const key in points) {
                        data += `\n${key}: ${points[key]}`;
                    }
                    return message.channel.send(data);
                }
            } else if (chosenclue == null) { //if chosen clue isn't set, then they need to select from the list of categories
                if (cmd == `categories` || cmd == `repeat`) {
                    let data = `\n**Select your category:**`;
                    for (i = 0; i < clues.length; ++i) {
                        data += `\n${i + 1}.) ${clues[i].category.title}`;
                    }
                    return message.reply(data);
                } else if (cmd >= 1 && cmd <= 5) {
                    const number = cmd - 1;
                    jcollection.set(`chosenclue`, number);
                    const clue = clues[number];
                    return message.reply(`\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`);
                } else {
                    return message.reply(`you can send *repeat*, a number to select a clue from your given categories, *categories* for your new categories to choose from, blank for your new random instant clue, *quiz* for a communal clue that tallies points for the first correct answer in chat, and *points* to see the current day's point total for *quiz*.`);
                }
            } else {
                let clue = clues[chosenclue];
                if (!cmd || cmd == `repeat`) {
                    return message.reply(`\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`);
                } else if (cmd == `quiz`) {
                    const filter = response => {
                        return response.content.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() == clue.answer.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
                    };
                    message.channel.send(`\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`).then(() => {
                        message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: [`time`] })
                            .then(collected => {
                                CheckPointsReset(jcollection);
                                let points = jcollection.get(`points`);
                                const author = collected.first().author;
                                const key = `<@!${author.id}>`;
                                if (!points) {
                                    points = {};
                                    points[key] = 1;
                                } else if (key in points) {
                                    points[key] += 1;
                                } else {
                                    points[key] = 1;
                                }
                                jcollection.set(`points`, points);
                                return message.channel.send(`${author} got the correct answer: ${clue.answer}`);
                            })
                            .catch(collected => {
                                return message.channel.send(`Time is up! the correct answer was: ${clue.answer}`);
                            });
                    });
                } else if (cmd >= 1 && cmd <= 5) {
                    const number = cmd - 1;
                    jcollection.set(`chosenclue`, number);
                    clue = clues[number];
                    return message.reply(`\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`);
                } else if (cmd == `answer`) {
                    return message.reply(clue.answer);
                } else {
                    return message.reply(`you can send *repeat*, a number to select a clue from your given categories, *categories* for your new categories to choose from, blank for your new random instant clue, *quiz* for a communal clue that tallies points for the first correct answer in chat, and *points* to see the current day's point total for *quiz*.`);
                }
            }
        });
        const CheckStatus = (response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        };
        const CheckPointsReset = (jcollection) => {
            const today = new Date(new Date().toLocaleString(`en-US`, { timeZone: `America/New_York` })).toDateString();
            const pointsday = jcollection.get(`pointsday`);
            if (!pointsday || today != pointsday) {
                jcollection.set(`points`, null);
                jcollection.set(`pointsday`, today);
            }
        };
        const SetGetJeopardyCollection = (cmd) => {
            if (cmd == `quiz` || cmd == `points`) {
                if (!message.client.jeopardy) {
                    message.client.jeopardy = new Discord.Collection();
                }
                return message.client.jeopardy;
            } else {
                if (!message.author.jeopardy) {
                    message.author.jeopardy = new Discord.Collection();
                }
                return message.author.jeopardy;
            }
        };
    },
};