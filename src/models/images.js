const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    src: String,
    alt: {
        type: String,
        default: 'No description added yet.',
    },
    nsfw: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        default: 'null',
    }
});

module.exports = model('Image', imageSchema);