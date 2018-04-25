const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const sid = require('shortid-36')
const Article = require('../models/article')
const cheerio = require('cheerio')

router.route('/')
.post((req, res) => {

    var article = new Article()
    article.des = req.body.des
    article.option = req.body.option
    article.index = req.body.index

    article.save( err => {
        
        if(err) {
            res.json(err)
            return
        }
        
        res.json('ok')
    })
})
.get((req,res) => {
    Article
    .find()
    .sort({createdAt: -1})
    .exec((err, articles) =>{
        if (err) res.json(err)
        res.json(articles)
    });
})

router.route('/random/subject/:subjectId')
.get((req, res) => {
    var filter = {subjectId: req.params.subjectId};
    var fields = {};
    var options = {limit: 2};
    Article.findRandom(filter, fields, options, function(err, articles) {
      if (err) res.json(err)
      res.json(articles)
    });
})

router.route('/:pageId')
.get((req,res) => {

    const perPage = 10

    Article
    .skip(perPage * (req.params.pageId - 1))
    .limit(perPage)
    .sort({createdAt: -1})
    .exec((err, articles) => {
        
        if(err) {
            res.json(err)
            return
        }

        res.json(articles)
    
    })
})

router.route('/id/:id')
.put((req,res)=>{
    Article.findById(req.params.id, (err, article) => {

        article.des = req.body.des
        article.index = req.body.index
        article.option = req.body.option
        
        article.save(err=>{
            if(err) {
                res.json(err)
                return
            }

            res.send('updated')
        })

    })
})
.delete((req,res)=>{

   Article.remove({
       _id: req.params.id
   }, err => {

       if(err) {
           res.json(err)
           return
       }

       res.send('deleted')
   })

})

// Return router
module.exports = router;