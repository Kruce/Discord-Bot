module.exports = {
    assign: function (content) {
        let players = content.trim().replace(/[ ]{2,}/gi, ` `).split(` `); //trim empty space, replace spaces more than one with one, split by word
        if (players.length <= 6 && players.length >= 1) {
            let message = ``;
            let roles = [`tank`, `tank`, `damage`, `damage`, `support`, `support`];
            let heroes = {
                "tank": [`d.va`, `orisa`, `reinhardt`, `roadhog`, `sigma`, `winston`, `wrecking ball`, `zarya`],
                "damage": [`ashe`, `bastion`, `doomfist`, `genji`, `hanzo`, `junkrat`, `mcree`, `mei`, `pharah`, `reaper`, `soldier: 76`, `sombra`, `symmetra`, `torbjörn`, `tracer`, `widowmaker`],
                "support": [`ana`, `baptiste`, `brigitte`, `lúcio`, `mercy`, `moira`, `zenyatta`]
            };

            while (players.length > 0) {
                roles = shuffle(roles); //shuffle roles and heroes. shuffling inside while loop for extra randomness
                heroes["tank"] = shuffle(heroes["tank"]);
                heroes["damage"] = shuffle(heroes["damage"]);
                heroes["support"] = shuffle(heroes["support"]);

                message += `**${(players[0]).replace(`%20`, ` `)}:** {${roles[0]}, ${heroes[roles[0]][0]}} `; //replace %20 with space
                heroes[roles[0]].shift();
                roles.shift();
                players.shift();
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
