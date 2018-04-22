const math = require('mathjax-node-page/lib/main').mjpage
const cheerio = require('cheerio')
var m = {}

m.set = (html) => {
    const $ = cheerio.load(html)
    const arr = $('editor-formula-module').toArray()

    arr.forEach((el, index) => {
        if($(el).attr('display') == "block")
            $(el).after("$$" + $(el).attr('math') + "$$")
        else 
            $(el).after("$" + $(el).attr('math') + "$")
        $(el).remove()
    })
    return $
}

//Rendering math
m.render = (html, cb) => {
    math(html, {
            format: ["TeX"],
            output: 'html',
            singleDollars: true,
            MathJax: {
                jax: ["input/TeX","output/CommonHTML"],
                CommonHTML: {
                    linebreaks: {
                        automatic: true
                    }
                }
            },
            fragment: true
       }, 
       {
            html: true
       }, (res) => {
            cb(res)
    })
}

module.exports = m
