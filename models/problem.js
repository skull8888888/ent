const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    problem: String,
    answers: [{
        type: String
    }],
    author: String,
    correct: Number,
    subjectId: String,
    lang: String
},{
    timestamps: true,
    minimize: true
})

module.exports = mongoose.model('Problem', problemSchema);
