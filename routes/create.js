var express = require('express');
var router = express.Router();
const axios = require('axios');
const logger = require('../config/logger');
var secured = require('../lib/middleware/secured');




router.get('/', secured(), function (req, res, next) {

    res.render('create', {
        title: 'Create New Auction'
    });

});

module.exports = router;