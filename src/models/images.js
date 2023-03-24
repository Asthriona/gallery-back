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
});

module.exports = model('Image', imageSchema);