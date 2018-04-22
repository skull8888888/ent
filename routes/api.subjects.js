const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const sid = require('shortid-36')
const Topic = require('../models/subject');

router.route('/')

.post((req, res) => {
    var topic = new Topic()

    topic._id = req.body._id
    topic.title = req.body.title


    topic.save( err => {
        if(err) {
            res.json(err)
            return
        }
        res.json('ok')
    })
})
.get((req,res) => {
    Topic.find((err, topics) =>{
        if(err) {
            res.json(err)
            return
        }
        res.json(topics)

    });
})

router.route('/:id')
.get((req,res) => {

    if(req.query.populate == 'true'){

        Topic.findById(req.params.id, (err, topic) => {
            if(err || !topic) {
                res.json(null)
                return
            }
            
            res.json(topic)
        })

    } else {
        Topic.findById(req.params.id, (err, topic) => {
            if(err || !topic) {
                res.json("doesn't exist")
                return
            }
            res.json(topic)
        })
    }
    
})
.put((req,res)=>{

    Topic.findById(req.params.id, (err, topic) => {

        topic.title = req.body.title
        
        topic.save(err=>{
            if(err) {
                res.json(err)
                return
            }
            res.send('updated')
        })

    })
})
.delete((req,res)=>{
    Topic.remove({
        _id: req.params.id
    }, err => {
        if(err) {
            res.json(err)
            return
        }
        res.send('deleted')
    })
})

module.exports = router;
