module.exports = {
    assign: function (content) {
        let words = content.trim().toLowerCase().replace(/[ ]{2,}/gi, ` `).split(` `); //trim empty space, replace spaces more than one with one, split by word
        if (words.length <= 6 && words.length >= 1) {
            let message = ``;
            let reservedRoles = []; //if they are just requesting a hero change, the role gets reserved
            let remainedRoles = [`tank`, `tank`, `damage`, `damage`, `support`, `support`];
            let heroes = {
                "tank": [`d.va`, `orisa`, `reinhardt`, `roadhog`, `sigma`, `winston`, `wrecking ball`, `zarya`],
                "damage": [`ashe`, `bastion`, `doomfist`, `genji`, `hanzo`, `junkrat`, `mcree`, `mei`, `pharah`, `reaper`, `soldier: 76`, `sombra`, `symmetra`, `torbjörn`, `tracer`, `widowmaker`],
                "support": [`ana`, `baptiste`, `brigitte`, `lúcio`, `mercy`, `moira`, `zenyatta`]
            };

            let tempWords = [...words]; //create an array clone of all our words
            while (tempWords.some(r => remainedRoles.indexOf(r) >= 0)) { //while our user's words contain any remained role
                for (let role of tempWords) { 
                    let index = remainedRoles.indexOf(role); //find the index of role in remained roles
                    if (index > -1) { //if it exists, remove it from remained roles and add it to reserved roles
                        let element = remainedRoles[index];
                        remainedRoles.splice(index, 1);
                        reservedRoles.push(element);
                    }
                    tempWords.splice(tempWords.findIndex(r => r == role), 1);
                }
            }
            while (words.length > 0) { //shuffling roles and heroes inside while loop for extra randomness
                heroes["tank"] = shuffle(heroes["tank"]);
                heroes["damage"] = shuffle(heroes["damage"]);
                heroes["support"] = shuffle(heroes["support"]);

                if (reservedRoles.includes(words[0])) { //if the message is a role and there's still roles of that type left to use
                    message += `{**new ${words[0]} hero**: ${heroes[words[0]][0]}} `;
                    heroes[words[0]].shift();
                    reservedRoles.splice(reservedRoles.findIndex(x => x == words[0]), 1); //remove the first instance of the role
                }
                else {
                    remainedRoles = shuffle(remainedRoles); 
                    message += `**${(words[0]).replace(`%20`, ` `)}:** {${remainedRoles[0]}, ${heroes[remainedRoles[0]][0]}} `; //replace %20 with space
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

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) { // while there remain elements to shuffle...
        randomIndex = Math.floor(Math.random() * currentIndex); // pick a remaining element...
        --currentIndex;
        temporaryValue = array[currentIndex]; // and swap it with the current element.
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
