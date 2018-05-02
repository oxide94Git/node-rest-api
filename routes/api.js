const express = require('express');
const router = express.Router();
const Ninja = require('../models/ninja');

//get a list of ninjas from database
router.get('/ninjas', function(req, res, next) {
    //console.log(req.query);
    //res.end();
    if (!req.query.lng) {
        Ninja.find({}).then(function(ninjas) {
            res.send(ninjas);
        });
    } else {
        Ninja.aggregate().near({
            near: {
                'type': 'Point',
                'coordinates': [parseFloat(req.query.lng), parseFloat(req.query.lat)]
            },
            maxDistance: 1000000,
            spherical: true,
            distanceField: "dis"
        }).then(function(ninjas) {
            res.send(ninjas);
        });
    }
});

//add a new ninja to database
router.post('/ninjas', function(req, res, next) {
    Ninja.create(req.body).then(function(ninja) {
        res.send(ninja);
    }).catch(next);
});

//update a ninja from database
router.put('/ninjas/:id', function(req, res, next) {
    Ninja.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function() {
        Ninja.findOne({ _id: req.params.id }).then(function(ninja) {
            res.send(ninja);
        }).catch(next);
    }).catch(next);
    //res.send({ type: 'PUT' });
});

//Delete a ninja from database
router.delete('/ninjas/:id', function(req, res, next) {
    Ninja.findByIdAndRemove({ _id: req.params.id }).then(function(ninja) {
        res.send(ninja);
    }).catch(next);
});

module.exports = router;