const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Problem = require('../models/problem')
const Article = require('../models/article')
const cheerio = require('cheerio')
const math = require('mathjax-node-page/lib/main').mjpage

router.route('/')
.get(async (req, res) => {
    
    let finalHTML = ''

    const letters = ['A','B','C','D','E','F','G','H']

    const subjects = [
        {
            id: 'kazhis',
            title: 'Қазақстан тарихы'
        },
        {
            id: 'mathlit',
            title: 'Математикалық сауаттылық'
        },
        {
            id: 'kazgram',
            title: 'Оқу сауаттылығы'
        },
        {
            id: 'math',
            title: 'Математика'
        },
        {
            id: 'physics',
            title: 'Физика'
        },{
            id: 'chem',
            title: 'Химия'
        },{
            id: 'biol',
            title: 'Биология'
        },{
            id: 'geog',
            title: 'География'
        },{
            id: 'hist',
            title: 'Тарих'
        },{
            id: 'chop',
            title: 'Адам. Қоғам. Құқық'
        },{
            id: 'kazlit',
            title: 'Қазақ тілі мен әдебиеті'
        },
        {
            id: 'engl',
            title: 'Ағылшын тілі'
        }
    ]

    for(let i = 0; i < 10; i++) {

        const problems = await getRandomProblems(subjects)
        const randomOption = String(Math.floor(1000 + Math.random() * 9000))

        let html = `
            <h2 style="
            page-break-before: always
            ">${randomOption} Нұсқа</h2>
            <div style="
            font-size:12px; 
            -webkit-columns: 2 auto;
            -moz-columns: 2 auto;
            columns: 2 auto;
            -webkit-column-gap: 40px;
            -moz-column-gap: 40px; 
            column-gap: 40px;
            ">`

        let answersHTML = `
            <h2 style="page-break-before: always;">${randomOption} Нұсқа</h2>
            <table style="
            width:100%;
            "
            border="1"
            >
        `

        problems.forEach((problemsOfSubject, subjectIndex) => {

            answersHTML += `
            <tr>
              <th colspan="30">${subjects[subjectIndex].title}</th>
            </tr>
            `

            if(subjects[subjectIndex].id == 'kazgram') {
                html += problemsOfSubject.html
                answersHTML += problemsOfSubject.ans
            } else {
                html += `<h2>${subjects[subjectIndex].title}</h2>`
                let headAnswersHTML = '<tr>'
                let lettersAnswersHTML = '<tr>'

                problemsOfSubject.forEach((problem, index) => {

                    let problemHTML =  `
                    <div style="
                    -webkit-column-break-inside: avoid;
                    page-break-inside: avoid;
                    break-inside: avoid;
                    margin: 32px 0px">
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

                html += `<h2>${subjects[subjectIndex].title} сынак аякталды</h2>`
            }

        })

        html += '</div>'
        html += answersHTML + '</table><script>window.print()</script>'

        finalHTML += html
    }

    const $ = setMath(finalHTML)

    renderMath($.html(), html => {
        res.send(html)
    })


})

async function getRandomProblems(subjects){

    var problems = []

    for(let subject of subjects){
        if(subject.id == 'kazhis' || subject.id == 'mathlit') {
            const res = await getRandomSimpleProblems(subject.id)

            problems.push(res)
        } else if (subject.id == 'kazgram') {
            const res = await getKazgram()
            problems.push(res)
        } else {
            const simple = await getRandomSimpleProblems(subject.id)
            const hard = await getRandomHardProblems(subject.id)
            
            problems.push(simple.concat(hard))

        }
    }

    return problems
}

function getRandomSimpleProblems(subjectId){

    return new Promise((resolve, reject) => {
        const filter = {subjectId: subjectId, type: 'simple'}
        const fields = {}
        const options = {limit: 20}

        Problem.findRandom(filter, fields, options, function(err, problems) {
            if (err) reject(err)
            resolve(problems)
        })
    })
}

const getRandomHardProblems = (subjectId) => {

    return new Promise((resolve, reject) => {
        const filter = {subjectId: subjectId, type: 'hard'}
        const fields = {}
        const options = {limit: 10}

        Problem.findRandom(filter, fields, options, function(err, problems) {
            if (err) reject(err)
            resolve(problems)
        })
    })

}


async function getKazgram(){

    const letters = ['A','B','C','D','E','F','G','H']

    const randomArticle = await new Promise((resolve, reject) => {
        Article.findOneRandom(function(err, res) {
            if (err) reject(err)
            resolve(res)
        })
    })

    const articles = await new Promise((resolve, reject) => {
       
        Article
        .find({option: randomArticle.option})
        .sort({index: 1})
        .lean()
        .exec((err, res) =>{
            if (err) reject(err)
            resolve(res)
        })
    })

    const problems = await new Promise((resolve, reject) => {
    
        Problem
        .find({option: randomArticle.option})
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
                <div style="
                -webkit-column-break-inside: avoid;
                page-break-inside: avoid;
                break-inside: avoid;
                margin: 32px 0px">
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
        html: html + '<h2>Оқу сауаттылығы сынак аякталды</h2>',
        ans: headAnswersHTML + lettersAnswersHTML
    }

}



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
