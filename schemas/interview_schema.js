const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    members: {
        type: Array,
    }
})

module.exports = mongoose.model('Interview', interviewSchema)