var express = require('express');
var router = express.Router();
const axios = require('axios');
const logger = require('../config/logger');
var secured = require('../lib/middleware/secured');

async function bidAuction(auctionId, auctionBidPrice, idToken){


    var options = {
        method: 'PATCH',
        url: process.env.AUTH0_APP_AUCTIONS_ENDPOINT+`/auction/${auctionId}/bid`,
        headers: {'Authorization': 'Bearer '+idToken},
        data: {
          amount: auctionBidPrice
        }
      };

      try{

      const auctiobnBid = await axios.request(options);

        return { status: auctiobnBid.status,
            message: auctiobnBid.data
        };

      }catch(error){
        
        logger.error(error.response.data);
        console.log(error.response.status);
        
        return { status: error.response.status,
                 message: error.response.data
        };

      }

}

//Bid request
router.post('/:auctionId/bid', secured(), async function(req, res, next){

    let idToken = req.session.id_token;
    let auctionId = req.params.auctionId;
    let auctionBidPrice = parseInt(req.body.auctionBidPrice);

    const bidResult = await bidAuction(auctionId, auctionBidPrice, idToken);
    logger.info(bidResult);
    return res.status(bidResult.status).send({
        data : bidResult.message
    });


});

module.exports = router;