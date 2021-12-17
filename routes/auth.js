let express = require('express');
let router = express.Router();
let passport = require('passport');
let dotenv = require('dotenv');
let util = require('util');
let url = require('url');
let querystring = require('querystring');

dotenv.config();



// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  res.redirect('/');
});





// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {

  passport.authenticate('auth0', function (err, user, info) {

    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }

    req.login(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
    
      delete req.session.returnTo;
      res.redirect(returnTo || '/auctions');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  let returnTo = process.env.AUTH0_APP_LOGOUT_CALLBACK_URL;
  /*
  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }*/

  var logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_APP_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_APP_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

module.exports = router;