const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    interviews: {
        type: Array,
    },
    busy: {
        type: Array,
    }
})

module.exports = mongoose.model('Student', studentSchema)