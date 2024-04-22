const { model, Schema } = require('mongoose');

module.exports = model('bookmarks',
    new Schema({
        key: {
            type: String
        },
        value: {
            type: String
        },
    }), 
);