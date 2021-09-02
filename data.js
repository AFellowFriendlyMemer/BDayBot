const mongoose = require('mongoose');

const bdayDataSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },

    month: {
        type: Number,
        required: false
    }, 

    date: {
        type: Number,
        required: false
    },

    hour: {
        type: Number,
        required: false
    },

    minute: {
        type: Number,
        required: false
    },

    guildId: {
        type: String,
        required: false
    }, 

    channel: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('bday-data', bdayDataSchema);