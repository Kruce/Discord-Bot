const { Collection } = require("discord.js");
const { log } = require('../functions/utility');
const ExtendedClient = require('../class/ExtendedClient');
const BookmarkSchema = require('../schemas/BookmarkSchema');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = async (client) => {
    try {
        client.bookmarks = new Collection();
        const bookmarks = await BookmarkSchema.find({}).lean();
        const cache = bookmarks.reduce((map, item) => {
            map.set(item.key, item.value);
            return map;
        }, new Map());
        client.bookmarks.set(`cache`, cache);
        log(`Bookmark handler cached all bookmarks`, "info");
    } catch (error) {
        log(`Bookmark handler error caching all bookmarks \n ${error}`, "err");
    }
};