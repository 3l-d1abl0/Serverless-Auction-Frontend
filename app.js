var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let userRouter = require('./routes/user');
let authRouter = require('./routes/auth');
let auctionsRouter = require('./routes/auctions');
let auctionRouter = require('./routes/auction');
let createRouter = require('./routes/create');

let session = require('express-session');
let userInViews = require('./lib/middleware/userInViews');

var app = express();
var dotenv = require('dotenv');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({limit: '3mb'}));
app.use(express.urlencoded({ limit: '3mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


dotenv.config();

// Load Passport
let passport = require('passport');
let Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    state: true,
    domain: process.env.AUTH0_APP_DOMAIN,
    clientID: process.env.AUTH0_APP_CLIENT_ID,
    clientSecret: process.env.AUTH0_APP_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_APP_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user    
    return done(null, profile, extraParams.id_token);
  }
);


passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// config express-session
var sess = {
  secret: process.env.AUTH0_APP_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  sameSite: false
};

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());



/**--- ROUTES ---- */
app.use(userInViews());
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/', userRouter);

app.use('/auctions', auctionsRouter);
app.use('/auction', auctionRouter);
app.use('/create', createRouter);
/**----ROUTES ------- */



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}


module.exports = app;
