const mongoose = require('mongoose')
const random = require('mongoose-simple-random')

const problemSchema = new mongoose.Schema({
    problem: String,
    answers: [{
        type: String,
    }],
    type: {
        type: String,
        default: 'simple'
    },
    author: String,
    correct: [Number],
    subjectId: String,
    lang: String
},{
    timestamps: true,
    minimize: true
})

problemSchema.plugin(random)

module.exports = mongoose.model('Problem', problemSchema);
