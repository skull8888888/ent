const mongoose = require('mongoose')
const random = require('mongoose-simple-random')

const articleSchema = new mongoose.Schema({
    index: Number,
    option: String,
    lang: String,
    des: String
},{
    timestamps: true,
    minimize: true
})
articleSchema.plugin(random)

module.exports = mongoose.model('Article', articleSchema);
