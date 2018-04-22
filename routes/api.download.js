const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Problem = require('../models/problem')
const cheerio = require('cheerio')
const math = require('mathjax-node-page/lib/main').mjpage
const pdf = require('html-pdf')
const fs = require('fs')
const options = {
    "border": {
      "top": "10mm",         
      "right": "20mm",
      "bottom": "5mm",
      "left": "10mm"
    },
    "footer": {
      "height": "10mm",
      "contents": {
        default: '<span style="color: #444;text-align: center">Деректер <a href="www.esepterqory.kz">www.esepterqory.kz</a> сайтынан алынған</span>'
      }
    },
}

//Download problem by id
router.route('/problem/:id')
.get((req, res) => {
    res.set({
        "Content-Type": "application/octet-stream",
    })
    Problem.findById(req.params.id, (err, problem) => {

        if(err) {
            res.json(err)
            return
        }

        const $ = setMath('<p style="font-size:12px">' +problem.problem + '</p>')
        $.root().prepend(`<h3>${problem.number}</h3>`)

        renderMath($.html(), html => {
            const FILENAME = encodeURIComponent(problem.number) + '.pdf'
            res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + FILENAME)
            pdf.create(html, options).toStream(function(err, stream){
                stream.pipe(res);
            })

            problem.downloaded += 1
            problem.save()
        })
    })
})



//Download page of problems by topic and page number
router.route('/topic/:id/:page')
.get((req,res) => {

    const perPage = 10

    Problem.find({
        path: req.params.id
    })
    .select('problem number')
    .skip(perPage * (req.params.page - 1))
    .limit(perPage)
    .sort({number: 1})
    .exec((err, problems) => {
        if(err) {
            res.json(err)
            return
        }

        const source = problems.map(el => {return `<div style="font-size:16px; font-weight:700">${el.number}</div><p style="font-size:12px;margin-top: 0">` + el.problem}).join('</p>')
        const $ = setMath(source)
        
        renderMath($.html(), html => {
            const FILENAME = encodeURIComponent(req.params.id) + '.pdf'
            res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + FILENAME)
            pdf.create(html, options).toStream(function(err, stream){
                stream.pipe(res);
            })
            Problem.find()
            .skip(perPage * (req.params.pageId - 1))
            .limit(perPage)
            .setOptions({ multi: true })
            .update({ $inc: { downloaded: 1 } })
            .exec()
        })
    })
})

//Setting math
const setMath = (html) => {
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
const renderMath = (html, cb) => {
    math(html, 
        {
            format: ["TeX"],
            output: 'html',
            singleDollars: true,
        }, 
        {
            html: true
        }, 
        (res) => {
            cb(res)
    })
}


module.exports = router
