const Discord = require(`discord.js`);
const https = require(`https`);
module.exports = {
    name: `jeopardy`,
    description: `Choose from a list of categories to get a jeopardy formatted trivia clue and answer. You can also say random to skip selecting a category for an instant clue. A blank command will give you a list of new categories to choose from.`,
    aliases: [`j`], //other alias to use this command
    usage: `*${process.env.PREFIX}j* for new categories to choose from, *${process.env.PREFIX}j* then a number to select a category, *${process.env.PREFIX}j answer* for a selected clue's answer, *${process.env.PREFIX}j repeat* to either repeat the categories or the clue, or *${process.env.PREFIX}j random* for a new random instant clue.`,
    cooldown: 1, //cooldown on command in seconds
    execute(message, args) {
        let arg = (args.length) ? (!isNaN(args[0]) ? parseInt(args[0]) : args[0].toLowerCase()) : ``; //if there are any arguments get the first one only, if it is a number parse int and return that, otherwise return lowercase string
        const GetOrSetJeopardyCache = () =>
            new Promise((resolve, reject) => {
                if (message.client.jeopardy == null || !arg || arg == `random`) {
                    https.get(`https://jservice.io/api/random?count=5`, (response) => {
                        let data = ``;
                        response.on(`data`, (chunk) => {
                            data += chunk;
                        });
                        response.on(`end`, () => {
                            const clues = JSON.parse(data);
                            message.client.jeopardy = new Discord.Collection();
                            for (i = 0; i < clues.length; ++i) {
                                const clue = clues[i];
                                if ((clue.invalid_count !== null && clue.invalid_count >= 5) || (clue.question == null || clue.question === ``)) { //if clue was marked as invalid more than five times or the question is just empty ignore and get another 5
                                    resolve(`retry`);
                                }
                                else {  //clean up some strings
                                    if (clue.question != null) {
                                        clue.question = `${clue.question.charAt(0).toUpperCase()}${clue.question.slice(1)}`; //convert question to upper case
                                    }
                                    if (clue.category.title != null) {
                                        clue.category.title = `${clue.category.title.charAt(0).toUpperCase()}${clue.category.title.slice(1)}`; //convert category to upper case
                                    }
                                    if (clue.answer != null) {
                                        clue.answer = `${clue.answer.charAt(0).toUpperCase()}${clue.answer.slice(1)}`; //convert answer to upper case
                                    }
                                }
                            }
                            message.client.jeopardy.set(`clues`, clues);
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
            });
        GetJeopardyQuestion().then(() => {
            let data = ``;
            const chosenclue = message.client.jeopardy.get(`chosenclue`);
            const clues = message.client.jeopardy.get(`clues`);
            if (arg == `random`) {
                const min = 0;
                const max = 4;
                const number = Math.floor(Math.random() * (max - min + 1) + min);
                message.client.jeopardy.set(`chosenclue`, number);
                const clue = clues[number];
                data = `\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`;
            }
            else if (chosenclue == null) {
                if (arg >= 1 && arg <= 5) {
                    const number = arg - 1;
                    message.client.jeopardy.set(`chosenclue`, number);
                    const clue = clues[number];
                    data = `\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`;
                }
                else if (!arg || arg == `repeat`) {
                    data = `\n**Select your category:**`;
                    for (i = 0; i < clues.length; ++i) {
                        data += `\n${i + 1}.) ${clues[i].category.title}`;
                    }
                }
                else {
                    data = `You can send *repeat*, a number to select a clue from the given categories, *random* for a new random instant clue, or blank for new categories to choose from.`;
                }
            }
            else {
                let clue = clues[chosenclue];
                if (arg >= 1 && arg <= 5) {
                    const number = arg - 1;
                    message.client.jeopardy.set(`chosenclue`, number);
                    clue = clues[number];
                    data = `\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`;
                }
                else if (!arg || arg == `repeat`) {
                    data = `\n**Category:** ${clue.category.title} \n**Clue:** ${clue.question}`;
                }
                else if (arg == `answer`) {
                    data = clue.answer;
                }
                else {
                    data = `You can send *repeat*, *answer*, a number to select a clue from the given categories, *random* for a random new clue, or blank for new categories to choose from.`;
                }
            }
            return message.channel.send(data).catch(e => { console.error(`jeopardy command issue sending message:`, e); });
        });
    },
};