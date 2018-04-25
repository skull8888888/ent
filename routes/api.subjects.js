const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const sid = require('shortid-36')
const Subject = require('../models/subject');

router.route('/')

.post((req, res) => {
    var subject = new Subject()

    subject._id = req.body._id
    subject.title = req.body.title


    subject.save( err => {
        if(err) {
            res.json(err)
            return
        }
        res.json('ok')
    })
})
.get((req,res) => {
    Subject.find((err, subjects) =>{
        if(err) {
            res.json(err)
            return
        }
        res.json(subjects)

    });
})

router.route('/:id')
.get((req,res) => {
    Subject.findById(req.params.id, (err, subject) => {
        if(err) {
            res.json("doesn't exist")
            return
        }
        res.json(subject)
    })
})
.put((req,res)=>{

    Subject.findById(req.params.id, (err, subject) => {

        subject.title = req.body.title
        if(req.body.count) subject.count = req.body.count
        subject.save(err=>{
            if(err) {
                res.json(err)
                return
            }
            res.send('updated')
        })

    })
})
.delete((req,res)=>{
    Subject.remove({
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
