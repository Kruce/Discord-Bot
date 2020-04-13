module.exports = {
    assign: function (content) {
        if (WordCount(content) <= 6 && WordCount(content) >= 1) {
            let message = ``;
            let roles = [`tank`, `tank`, `damage`, `damage`, `support`, `support`];
            let heroes = {
                "tank": [`d.va`, `orisa`, `reinhardt`, `roadhog`, `sigma`, `winston`, `wrecking ball`],
                "damage": [`ashe`, `bastion`, `doomfist`, `genji`, `hanzo`, `junkrat`, `mcree`, `mei`, `pharah`, `reaper`, `soldier: 76`, `sombra`, `symmetra`, `torbjörn`, `tracer`, `widowmaker`],
                "support": [`ana`, `baptiste`, `brigitte`, `lúcio`, `mercy`, `moira`, `zenyatta`]
            };

            let players = content.split(` `).filter(function (str) { return /\S/.test(str); }); //remove empty whitespaces

            roles = shuffle(roles);//shuffle roles/heroes
            heroes["tank"] = shuffle(heroes["tank"]);
            heroes["damage"] = shuffle(heroes["damage"]);
            heroes["support"] = shuffle(heroes["support"]);

            while (players.length > 0) {
                message += `**${players[0]}:** {${roles[0]}, ${heroes[roles[0]][0]}} `;
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

function WordCount(str) {
    let totalSoFar = 0;
    let words = str.split(` `);
    for (var i = 0; i < words.length; i++) {
        if (words[i] !== ` ` && words[i] !== ``) {
            totalSoFar++;
        }
    }
    return totalSoFar;
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
