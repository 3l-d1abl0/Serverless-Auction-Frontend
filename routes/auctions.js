var express = require('express');
var router = express.Router();
const axios = require('axios');
const logger = require('../config/logger');
var secured = require('../lib/middleware/secured');

/* GET user profile. */
router.get('/', secured(), function (req, res, next) {

    //If no user logged in , take it to login Page
    if(req.user == undefined){
      return res.redirect('/');
    }
    
    //Get available auctions
    let getAuctionsUrl = process.env.AUTH0_APP_AUCTIONS_ENDPOINT+"/auctions?status=OPEN";
    axios.get(
        getAuctionsUrl,
        {   headers: {
                "Authorization": "Bearer "+req.session.id_token
            },
            redirect: 'follow'
        }).then((response) =>{
            logger.info(response.data);
            //console.log(response.data);
            res.render('auctions', {
                auctionData: response.data,
                error: null,
                title: 'Auctions'
            });

        })
        .catch((err) => {
            res.render('auctions', {
                auctionData: [],
                error: err.response.statusText +' Not able to fetch Data! Try again Later !',
                title: 'Auctions'
            });
        });

});


module.exports = router;