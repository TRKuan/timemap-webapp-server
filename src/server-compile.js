'use strict';

require('../config');
var express = require('express');
var cors = require('cors');

//===============================================================
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google-oauth20');
// Import Facebook and Google OAuth apps configs

var _require = require('../config'),
    facebook = _require.facebook,
    google = _require.google;

// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes


var transformFacebookProfile = function transformFacebookProfile(profile) {
  return {
    name: profile.name,
    avatar: profile.picture.data.url
  };
};

// Transform Google profile into user object
var transformGoogleProfile = function transformGoogleProfile(profile) {
  return {
    name: profile.displayName,
    avatar: profile.image.url
  };
};
//================================================================

var eventRouter = require('./routers/events.js');
//const todoRouter = require('./routers/todos.js');
var requestLogger = require('./middleware/request-logger.js');
var errorHandler = require('./middleware/error-handler.js');

//================================================================
// Register Facebook Passport strategy
passport.use(new FacebookStrategy(facebook,
// Gets called when user authorizes access to their profile
function _callee(accessToken, refreshToken, profile, done
// Return done callback and pass transformed user object
) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt('return', done(null, transformFacebookProfile(profile._json)));

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, null, undefined);
}));

// Register Google Passport strategy
passport.use(new GoogleStrategy(google, function _callee2(accessToken, refreshToken, profile, done) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt('return', done(null, transformGoogleProfile(profile._json)));

        case 1:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, undefined);
}));

// Serialize user into the sessions
passport.serializeUser(function (user, done) {
  return done(null, user);
});

// Deserialize user from the sessions
passport.deserializeUser(function (user, done) {
  return done(null, user);
});
//=================================================================

var app = express();

// app.use(requestLogger);
app.use(cors());
app.use(express.static('dist', {
  setHeaders: function setHeaders(res, path, stat) {
    res.set('Cache-Control', 'public, s-maxage=86400');
  }
}));
app.use('/api', eventRouter);
//app.use('/api', postRouter);
app.get('/*', function (req, res) {
  return res.redirect('/');
});
app.use(errorHandler);

//==================================================================
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Facebook auth routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
// Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
function (req, res) {
  return res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user));
});

// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/calendar'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google' }), function (req, res) {
  return res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user));
});

//===================================================================
var port = 8080;
app.listen(port, function () {
  console.log('Server is up and running on port ' + port + '...');
});
