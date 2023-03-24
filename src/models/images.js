const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    src: String,
    alt: String,
    nsfw: {
        type: Boolean,
        default: false,
    },
});

module.exports = model('Image', imageSchema);