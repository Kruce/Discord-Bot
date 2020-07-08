const Shuffle = require(`./shuffle`);

module.exports = {
    assign: function (content) {
        let words = content.trim().toLowerCase().replace(/[ ]{2,}/gi, ` `).split(` `).filter(x => x); //trim empty space, replace spaces more than one with one, split by word
        if (words.length <= 6 && words.length >= 1) {
            let message = ``;
            let reservedRoles = []; //if they are just requesting a hero change, the role gets reserved
            let remainedRoles = [`tank`, `tank`, `damage`, `damage`, `support`, `support`];
            let heroes = {
                "tank": [`d.va`, `orisa`, `reinhardt`, `roadhog`, `sigma`, `winston`, `wrecking ball`, `zarya`],
                "damage": [`ashe`, `bastion`, `doomfist`, `echo`, `genji`, `hanzo`, `junkrat`, `mcree`, `mei`, `pharah`, `reaper`, `soldier: 76`, `sombra`, `symmetra`, `torbjörn`, `tracer`, `widowmaker`],
                "support": [`ana`, `baptiste`, `brigitte`, `lúcio`, `mercy`, `moira`, `zenyatta`]
            };
            for (let word of words) { //update our remained and reserved roles before we start assigning them
                let index = remainedRoles.indexOf(word); //check if the current word is equal to a role and there are any remaining
                if (index > -1) { //if it exists, remove it from remained roles and add it to reserved roles
                    let element = remainedRoles[index];
                    remainedRoles.splice(index, 1);
                    reservedRoles.push(element);
                }
            }
            while (words.length > 0) { //shuffling roles and heroes inside while loop for extra randomness
                let word = words[0]; //since we shift at end of loop this will always be the current word
                heroes["tank"] = Shuffle.array(heroes["tank"]);
                heroes["damage"] = Shuffle.array(heroes["damage"]);
                heroes["support"] = Shuffle.array(heroes["support"]);

                if (reservedRoles.includes(word)) { //if the message is a role and there's still roles of that type left to use
                    message += `{**new ${word} hero**: ${heroes[word][0]}} `;
                    heroes[word].shift();
                    reservedRoles.splice(reservedRoles.findIndex(x => x == word), 1); //remove the first instance of the role
                }
                else {
                    remainedRoles = Shuffle.array(remainedRoles);
                    message += `**${(word).replace(`%20`, ` `)}:** {${remainedRoles[0]}, ${heroes[remainedRoles[0]][0]}} `; //replace %20 with space
                    heroes[remainedRoles[0]].shift();
                    remainedRoles.shift();
                }
                words.shift();
            }
            return (message);
        }
        else {
            return (`the !ow command requires six or less space separated names to assign roles`);
        }
    }
};