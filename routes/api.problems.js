const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const sid = require('shortid-36')
const Problem = require('../models/problem');
const Subject = require('../models/subject');
const math = require('./math')
const cheerio = require('cheerio')
const moment = require('moment')

router.route('/')
.post((req, res) => {

    var problem = new Problem()
    problem.problem = req.body.problem
    problem.answers = req.body.answers.split('||||')
    problem.correct = req.body.correct.split(',')
    problem.subjectId = req.body.subjectId
    problem.lang = 'kaz'
    problem.type = req.body.type
    problem.author = req.user.username

    problem.save( err => {
        
        if(err) {
            res.json(err)
            return
        }
                
        Subject.findById(req.body.subjectId)
        .update({ $inc: { count: 1 } })
        .exec((err, t) => {
            if(err) {
                res.json(err)
                return
            }
            res.json('ok')
        })
       
    })
})
.get((req,res) => {
    Problem.
    find()
    .limit(10)
    .sort({createdAt: -1})
    .exec((err, problems) =>{
        if (err) res.json(err)
        res.json(problems)
    });
})

router.route('/random/subject/:subjectId')
.get((req, res) => {
    var filter = {subjectId: req.params.subjectId};
    var fields = {};
    var options = {limit: 2};
    Problem.findRandom(filter, fields, options, function(err, problems) {
      if (err) res.json(err)
      res.json(problems)
    });
})

router.route('/subject/:subjectId/:pageId')
.get((req,res) => {

    const perPage = 10

    Problem.find({
        subjectId: req.params.subjectId
    })
    .skip(perPage * (req.params.pageId - 1))
    .limit(perPage)
    .sort({createdAt: -1})
    .exec((err, problems) => {
        
        if(err) {
            res.json(err)
            return
        }

        res.json(problems)
        
        // const source = problems.map(el => {return el.problem}).join('____')
        // const $ = math.set(source)

        // math.render($.html(), output => {

        //     output.split('____').forEach((el,index) => {
        //         problems[index].problem = el
        //     })

        //     res.json(problems)
        // })
    })
})

router.route('/id/:id')
.get((req,res) => {

    Problem.findById(req.params.id)
    .populate({
        path: 'path',
        model: 'Topic',
        select: '_id title'
    })
    .exec((err, problem) => {
        
        if(err || !problem) {
            res.json(err)
            return
        }

        res.json(problem)
        
        if(!res.locals.admin){
            problem.seen += 1
            problem.save()
        }
        
    })
})
.put((req,res)=>{
    Problem.findById(req.params.id, (err, problem) => {

        problem.problem = req.body.problem
        problem.answers = req.body.answers.split('||||')
        problem.correct = req.body.correct.split(',')
        problem.type = req.body.type
        
        if(problem.subjectId != req.body.subjectId) {
            Subject.findById(problem.subjectId)
            .update({ $inc: { count: -1 } })
            .exec((err, t) => {
                if(err) {
                    res.json(err)
                    return
                }

                Subject.findById(req.body.subjectId)
                .update({ $inc: { count: 1 } })
                .exec((err, t) => {
                    if(err) {
                        res.json(err)
                        return
                    }

                })
            })
        }

        problem.subjectId = req.body.subjectId

        problem.save(err=>{
            if(err) {
                res.json(err)
                return
            }

            res.send('updated')
        })

    })
})
.delete((req,res)=>{

    Problem.findById(req.params.id, (err, problem) => {

        if(err || !problem) {
            res.json(err)
            return
        }
    
        Subject.findById(problem.subjectId)
        .update({ $inc: { count: -1 } })
        .exec((err, t) => {
            if(err) {
                res.json(err)
                return
            }

            Problem.remove({
                _id: req.params.id
            }, err => {

                if(err) {
                    res.json(err)
                    return
                }

                res.send('deleted')
            })
        })
    })

})

// Return router
module.exports = router;