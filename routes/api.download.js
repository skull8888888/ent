const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Problem = require('../models/problem')
const cheerio = require('cheerio')
const math = require('mathjax-node-page/lib/main').mjpage
const pdf = require('html-pdf')
const fs = require('fs')
const pdfOptions = {
    "border": {
      "top": "10mm",         
      "right": "20mm",
      "bottom": "10mm",
      "left": "20mm"
    },
    // "format": "A4",
    "orientation": "landscape",
}

//Download problem by id
router.route('/')
.get((req, res) => {
    
    res.set({
        "Content-Type": "application/octet-stream",
    })


    var filter = {subjectId: req.params.subjectId};
    var fields = {};
    var options = {limit: 20};
    const letters = ['A)','B)','C)','D)','E)','F)','G)','H)']

    Problem.findRandom(filter, fields, options, function(err, problems) {
        if (err) res.json(err)

        let html = `
        <div style="display:flex;flex-direction:row;flex-wrap:wrap">
        `

        problems.forEach(el => {
            
            const problem = el.toObject()
            console.log(problem)
            html += `<p>
            <div>${problem.problem} </div>
            `

            problem.answers.forEach((ans, index) => {
                html += `
                        <div>${letters[index]}${ans}</div>
                `
            })
            html+= '</p>'
        })

        html+= '</div>'

        const $ = setMath(html)
        renderMath($.html(), html => { 
                const FILENAME = 'ent.pdf'
                res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + FILENAME)
                pdf.create(html, pdfOptions).toStream(function(err, stream){
                    stream.pipe(res);
                })

        })

    });

    // Problem.findById(req.params.id, (err, problem) => {

    //     if(err) {
    //         res.json(err)
    //         return
    //     }

    //     const $ = setMath('<p style="font-size:12px">' +problem.problem + '</p>')
    //     $.root().prepend(`<h3>${problem.number}</h3>`)

    //     renderMath($.html(), html => {
    //         const FILENAME = encodeURIComponent(problem.number) + '.pdf'
    //         res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + FILENAME)
    //         pdf.create(html, options).toStream(function(err, stream){
    //             stream.pipe(res);
    //         })

    //         problem.downloaded += 1
    //         problem.save()
    //     })
    // })
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
