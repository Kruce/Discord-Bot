const Shuffle = require(`./shuffle`);

/**
* Assigns a random overwatch role/hero to each string in array based on if string is a player name or overwatch role.
* If a word is any of an overwatch role (`damage`, `support`, or `tank`), the role gets reserved and assigns a new hero only instead.
* heroes will not be assigned more than once and roles will not be assigned more than twice per array. Any string that is an overwatch role over total count two is treated as a player name.
* @param {Array} playersRoles an array of strings as player names or roles to assign new roles and heroes or just heroes to.
*/
function AssignRolesHeroes(playersRoles) {
    if (playersRoles.length <= 6 && playersRoles.length >= 1) {
        let message = ``;
        let reservedRoles = []; //if they are just requesting a hero change, the role gets reserved
        let remainedRoles = [`tank`, `tank`, `damage`, `damage`, `support`, `support`];
        let heroes = {
            "tank": [`d.va`, `orisa`, `reinhardt`, `roadhog`, `sigma`, `winston`, `wrecking ball`, `zarya`],
            "damage": [`ashe`, `bastion`, `doomfist`, `echo`, `genji`, `hanzo`, `junkrat`, `mcree`, `mei`, `pharah`, `reaper`, `soldier: 76`, `sombra`, `symmetra`, `torbjörn`, `tracer`, `widowmaker`],
            "support": [`ana`, `baptiste`, `brigitte`, `lúcio`, `mercy`, `moira`, `zenyatta`]
        };
        for (const playerRole of playersRoles) { //update our remained and reserved roles before we start assigning them
            const index = remainedRoles.indexOf(playerRole); //check if the current word is equal to a role and there are any remaining
            if (index > -1) { //if it exists, remove it from remained roles and add it to reserved roles
                const element = remainedRoles[index];
                remainedRoles.splice(index, 1);
                reservedRoles.push(element);
            }
        }
        while (playersRoles.length > 0) { //shuffling roles and heroes inside while loop for extra randomness
            const word = playersRoles[0]; //since we shift at end of loop this will always be the current word
            heroes["tank"] = Shuffle.ShuffleArray(heroes["tank"]);
            heroes["damage"] = Shuffle.ShuffleArray(heroes["damage"]);
            heroes["support"] = Shuffle.ShuffleArray(heroes["support"]);

            if (reservedRoles.includes(word)) { //if the message is a role and there's still roles of that type left to use
                message += `{**new ${word} hero**: ${heroes[word][0]}} `;
                heroes[word].shift();
                reservedRoles.splice(reservedRoles.findIndex(x => x == word), 1); //remove the first instance of the role
            }
            else {
                remainedRoles = Shuffle.ShuffleArray(remainedRoles);
                message += `**${(word)}:** {${remainedRoles[0]}, ${heroes[remainedRoles[0]][0]}} `;
                heroes[remainedRoles[0]].shift();
                remainedRoles.shift();
            }
            playersRoles.shift();
        }
        return (message);
    }
    else {
        return (`To assign, overwatch requires six or less of any combination of player names or overwatch roles`);
    }
}

module.exports = {
    AssignRolesHeroes
};