const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    title: String,
    _id: String,
    count: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Subject', subjectSchema);
