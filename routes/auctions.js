var express = require('express');
var router = express.Router();

/* GET user profile. */
router.get('/', function (req, res, next) {
  
    //Get available auctions

  

  res.render('auctions', {
    auctionData: {},
    title: 'Auctions'
  });
});

module.exports = router;