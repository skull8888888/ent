const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    index: Number,
    option: String,
    des: String
},{
    timestamps: true,
    minimize: true
})

module.exports = mongoose.model('Article', articleSchema);
