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


async function createAuction(title, pictureBase64, idToken){

    var options = {
      method: 'POST',
      url: process.env.AUTH0_APP_AUCTIONS_ENDPOINT+`/auction`,
      headers: {'Authorization': 'Bearer '+idToken},
      data: {
        title: title
      }
    };

    try{

      const createAuctionResult = await axios.request(options);
      logger.info(createAuctionResult);

      const auction = createAuctionResult.data;
      const auctionId = auction.id;

      options.url = process.env.AUTH0_APP_AUCTIONS_ENDPOINT+`/auction/${auctionId}/picture`;
      options.method = 'PATCH';
      options.data = pictureBase64;
      logger.info(options);

      const auctionPicture = await axios.request(options);
      logger.info(auctionPicture);


      return { status: createAuctionResult.status,
        message: createAuctionResult.data
      };

    }catch(error){
      console.error('Could not create auction!');
      logger.error(error);

      if(error.code == 'ENOTFOUND'){
        return { status: 500, message: 'Internal server Error !' }
      }

      return { status: error.response.status,
        message: error.response.data
      };

    }
}


router.post('/', secured(), async function(req, res, next){

    const idToken = req.session.id_token;
    const title = req.body.title;
    const picture = req.body.picture;

    const createAuctionResult = await createAuction(title, picture, idToken);
    logger.info(createAuctionResult);
    return res.status(createAuctionResult.status).send({
      data: createAuctionResult.message
    });

})

module.exports = router;