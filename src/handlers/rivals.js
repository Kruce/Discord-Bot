const fetch = require(`node-fetch`);
const Cheerio = require(`cheerio`);
const { Collection } = require("discord.js");
const { log } = require('../functions/utility');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = async (client) => {
    try {
        let rivals = await fetch(`https://www.marvelrivals.com/heroes/index.html`);
        let result = await rivals.text();
        client.rivals = new Collection();
        const $ = Cheerio.load(result);
        const heroList = $(`.heroNewsList`).children();
        let heroes = {};
        for (let i = 0; i < heroList.length; ++i) {
            const hr = heroList[i];
            const name = hr.attribs[`title`].toLowerCase();
            let role = hr.attribs[`data-tag`].toLowerCase();
            if (role == ``) { //if the role is empty, try and get from the direct hero url
                let heroPage = await fetch(hr.attribs[`data-url`]);
                let heroPageResult = await heroPage.text();
                const $$ = Cheerio.load(heroPageResult);
                role = $$('.artText > p.p3')[0].lastChild.data.toLowerCase();
            }
            const hero = [name, hr.children[1].attribs[`src`]];
            if (role in heroes) {
                heroes[role].push(hero);
            } else {
                heroes[role] = [hero];
            }
        }
        client.rivals.set(`heroes`, heroes);
        log(`Rivals handler cached heroes`, "info");
    } catch (error) {
        log(`Rivals handler caching heroes error \n ${error}`, "err");
    }
};