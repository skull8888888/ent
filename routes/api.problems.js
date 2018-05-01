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
    problem.lang = 'rus'
    problem.type = req.body.type
    problem.author = req.user.username

    if(req.body.option) problem.option = req.body.option
    if(req.body.textIndex) problem.textIndex = req.body.textIndex

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

router.route('/user/:userId')
.get((req,res) => {
    Problem
    .count({ author: req.params.userId },(err, count) => {
      if (err) res.json(err)
      res.json(count)
    });
})

router.route('/subject/:subjectId/:pageId')
.get((req,res) => {

    const perPage = 10

    Problem.find({
        subjectId: req.params.subjectId,
        lang: 'rus'
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
        res.json(problems)

    })
})

router.route('/id/:id')
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