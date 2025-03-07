const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const components = require("../handlers/components");
const reactions = require("../handlers/reactions");
const schedule = require("../handlers/schedule");
const overwatch = require("../handlers/overwatch");
const rivals = require("../handlers/rivals");

module.exports = class extends Client {
    collection = {
        interactioncommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection()
        },
        reactions: new Collection()
    };
    applicationcommandsArray = [];

    constructor() {
        super({
            intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
            presence: {
                activities: [{
                    name: '',
                    type: 4,
                    state: ''
                }]
            }
        });
    };

    start = async () => {
        commands(this);
        reactions(this);
        events(this);
        components(this);
        schedule(this);
        overwatch(this);
        rivals(this);

        await this.login(process.env.CLIENT_TOKEN || config.client.token);

        if (config.handler.deploy) deploy(this, config);
    };
};