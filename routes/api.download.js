const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Problem = require('../models/problem')
const Article = require('../models/article')
const cheerio = require('cheerio')
var math = require("mathjax-node")
math.config({
  MathJax: {
    // traditional MathJax configuration
  }
});
math.start()

const letters = ['A','B','C','D','E','F','G','H']

const subjects = [
    {
        id: 'kazhis',
        titleKaz: 'Қазақстан тарихы',
        titleRus: 'История казахстана'
    },
    {
        id: 'mathlit',
        titleKaz: 'Математикалық сауаттылық',
        titleRus: 'Математическая грамотность'
    },
    // {
    //     id: 'kazgram',
    //     titleKaz: 'Оқу сауаттылығы',
    //     titleRus: 'Грамотность чтения'
    // },
    {
        id: 'math',
        titleKaz: 'Математика',
        titleRus: 'Математика'
    },
    {
        id: 'physics',
        titleKaz: 'Физика',
        titleRus: 'Физика'
    },{
        id: 'chem',
        titleKaz: 'Химия',
        titleRus: 'Химия'
    },{
        id: 'biol',
        titleKaz: 'Биология',
        titleRus: 'Биология'
    },{
        id: 'geog',
        titleKaz: 'География',
        titleRus: 'География'
    },{
        id: 'hist',
        titleKaz: 'Тарих',
        titleRus: 'История'
    },{
        id: 'chop',
        titleKaz: 'Адам. Қоғам. Құқық',
        titleRus: 'Человек. Общество. Право'
    },{
        id: 'kazlit',
        titleKaz: 'Қазақ тілі мен әдебиеті',
        titleRus: 'Русский язык и литература'
    },
    {
        id: 'engl',
        titleKaz: 'Ағылшын тілі',
        titleRus: 'Английский язык'
    }
]

router.route('/')
.get((req, res) => {
    res.send(`
    <!doctype html>
    <html lang="en">
    <head>
        <title>ENT KZ</title>
    </head>
    <body>
    <a href="/rus">Тесты на русском</a>
    <a href="/kaz">Тесты на казахском</a>
    </body>
    </html>
    `)
})

router.route('/:lang')
.get(async function(req, res){

    const randomOption = String(Math.floor(1000 + Math.random() * 9000))

    let finalHTML = `
        <!doctype html>
        <html>
            <head>
                <style>
                    .test {
                        font-size:12px; 
                        -webkit-columns: 2 auto;
                        -moz-columns: 2 auto;
                        columns: 2 auto;
                        -webkit-column-gap: 40px;
                        -moz-column-gap: 40px; 
                        column-gap: 40px;
                    }

                    .pageBreak{
                        page-break-before: always
                    }

                    .problem{
                        -webkit-column-break-inside: avoid;
                        page-break-inside: avoid;
                        break-inside: avoid;
                        margin: 32px 0px
                    }

                    .print {
                        display: none;
                    }

                    @media print {
                        .print {
                            display: block;
                        }

                        .noPrint {
                            display: none
                        }

                    }



                </style>
            </head>
            <body>
            <h2 class="noPrint">Нажмите распечатать страницу, чтобы распечатать тесты</h2>
            <div class="print">
    `

    const problems = await getRandomProblems(req.params.lang)
    
    let html = `
        <h2 class="pageBreak">${randomOption} Вариант</h2>
        <div class="test">`

    let answersHTML = `
        <h2 class="pageBreak">${randomOption} Вариант</h2>
        <table style="
        width:100%;
        "
        border="1"
        >
    `

    problems.forEach((problemsOfSubject, subjectIndex) => {

        const subjectTitle = req.params.lang == 'kaz' ? subjects[subjectIndex].titleKaz: subjects[subjectIndex].titleRus

        answersHTML += `
        <tr>
          <th colspan="30">${subjectTitle}</th>
        </tr>
        `

        if(subjects[subjectIndex].id == 'kazgram') {
            html += problemsOfSubject.html
            answersHTML += problemsOfSubject.ans
        } else {
            html += `<h2>${subjectTitle}</h2>`
            let headAnswersHTML = '<tr>'
            let lettersAnswersHTML = '<tr>'

            problemsOfSubject.forEach((problem, index) => {

                let problemHTML =  `
                <div class="problem">
                    <div>${index + 1}.${problem.problem}</div>
                `
                problem.answers.forEach((ans,index)=> {
                    problemHTML += `${letters[index]})${ans}<br>`
                })

                html+= problemHTML + '</div>'

                headAnswersHTML += `
                    <th>${index + 1}</th>
                `
                lettersAnswersHTML += `
                    <td>${problem.correct.map(el => {return letters[el]}).join('')}</td>
                `

            })

            headAnswersHTML += '</tr>'
            lettersAnswersHTML += '</tr>'            

            answersHTML += headAnswersHTML
            answersHTML += lettersAnswersHTML

        }

    })

    html += '</div>'
    html += answersHTML + '</table><script>window.print()</script>'

    finalHTML += html

    finalHTML += `
        </div>
        </body>
        </html>
    `

    const $ = await setMath(finalHTML)
    res.send($.html())

})

async function getRandomProblems(lang){

    var problems = []

    for(let subject of subjects){

        if(subject.id == 'kazhis' || subject.id == 'mathlit') {
            const res = await getRandomSimpleProblems(subject.id, lang)
            problems.push(res)
        } else if (subject.id == 'kazgram') {
            const res = await getKazgram(lang)
            problems.push(res)
        } else {
            const simple = await getRandomSimpleProblems(subject.id, lang)
            const hard = await getRandomHardProblems(subject.id, lang)
            problems.push(simple.concat(hard))

        }
    }

    return problems
}

function getRandomSimpleProblems(subjectId, lang){

    return new Promise((resolve, reject) => {
        const filter = {subjectId: subjectId, type: 'simple', lang: lang}
        const fields = {}
        const options = {limit: 20}

        Problem.findRandom(filter, fields, options, function(err, problems) {
            if (err) reject(err)
            resolve(problems)
        })
    })
}

const getRandomHardProblems = (subjectId, lang) => {

    return new Promise((resolve, reject) => {
        const filter = {subjectId: subjectId, type: 'hard', lang: lang}
        const fields = {}
        const options = {limit: 10}

        Problem.findRandom(filter, fields, options, function(err, problems) {
            if (err) reject(err)
            resolve(problems)
        })
    })

}


async function getKazgram(lang){

    const randomArticle = await new Promise((resolve, reject) => {
        
        const filter = {lang: lang}
        const fields = {}
        const options = {limit: 1}

        console.log(lang)

        Article.findRandom(filter, fields, options, function(err, articles) {
            
            if (err) reject(err)
            resolve(articles)
        })

    })

    const articles = await new Promise((resolve, reject) => {
       
        Article
        .find({option: randomArticle.option, lang: lang})
        .sort({index: 1})
        .lean()
        .exec((err, res) =>{
            if (err) reject(err)
            resolve(res)
        })
    })

    const problems = await new Promise((resolve, reject) => {
    
        Problem
        .find({option: randomArticle.option, lang: lang})
        .sort({textIndex: 1})
        .exec((err, res) =>{
            if (err) reject(err)
            resolve(res)
        })
    })

    let html = '<h2>Оқу сауаттылығы</h2>'   
    let headAnswersHTML = '<tr>'
    let lettersAnswersHTML = '<tr>'

    articles.forEach((article, articleIndex) => {

        html += `
            <h3>${articleIndex + 1}-мәтін</h3>
            <p>
            ${article.des}
            </p>
        `

        problems.forEach((problem, index) => {
            if(problem.textIndex == article.index) {
                let problemHTML =  `
                <div class="problem">
                    <div>${index + 1}.${problem.problem}</div>
                `
                problem.answers.forEach((ans,index)=> {
                    problemHTML += `${letters[index]})${ans}<br>`
                })

                html += problemHTML + '</div>'

                headAnswersHTML += `
                    <th>${index + 1}</th>
                `
                lettersAnswersHTML += `
                    <td>${problem.correct.map(el => {return letters[el]}).join('')}</td>
                `
            }

        })

    })

    headAnswersHTML += '</tr>'
    lettersAnswersHTML += '</tr>'   

    return {
        html: html,
        ans: headAnswersHTML + lettersAnswersHTML
    }

}

async function setMath(html){

    var $ = cheerio.load((' ' + html).substr(1))
    const arr = $('editor-formula-module').toArray()

    for(el of arr) {
        let M = $(el).attr('math')
        
        $(el).after(await renderMath(M))
        $(el).remove()
    }

    return $

}


function renderMath(M) {

    return new Promise((resolve, reject) => {
        math.typeset({
            math: M,
            format: "TeX", 
            svg:true,     
        }, function (data) {

            if (!data.errors) {
                resolve(data.svg)
            } else {
                reject(data.errors)
            }

        })
    })

}

module.exports = router
