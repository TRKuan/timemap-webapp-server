require('../config.js');
const express = require('express');
var cors = require('cors');

//===============================================================
import express from 'express';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
// Import Facebook and Google OAuth apps configs
import { facebook, google } from './config';

// Transform Facebook profile because Facebook and Google profile objects look different
// and we want to transform them into user objects that have the same set of attributes
const transformFacebookProfile = (profile) => ({
  name: profile.name,
  avatar: profile.picture.data.url,
});

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
  name: profile.displayName,
  avatar: profile.image.url,
});
//================================================================

const eventRouter = require('./routers/events.js');
//const todoRouter = require('./routers/todos.js');
const requestLogger = require('./middleware/request-logger.js');
const errorHandler = require('./middleware/error-handler.js');

//================================================================
// Register Facebook Passport strategy
passport.use(new FacebookStrategy(facebook,
  // Gets called when user authorizes access to their profile
  async (accessToken, refreshToken, profile, done)
    // Return done callback and pass transformed user object
    => done(null, transformFacebookProfile(profile._json))
));

// Register Google Passport strategy
passport.use(new GoogleStrategy(google,
  async (accessToken, refreshToken, profile, done)
    => done(null, transformGoogleProfile(profile._json))
));

// Serialize user into the sessions
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));
//=================================================================

const app = express();

// app.use(requestLogger);
app.use(cors());
app.use(express.static('dist', {
    setHeaders: (res, path, stat) => {
        res.set('Cache-Control', 'public, s-maxage=86400');
    }
}));
app.use('/api', eventRouter);
//app.use('/api', postRouter);
app.get('/*', (req, res) => res.redirect('/'));
app.use(errorHandler);

//==================================================================
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Facebook auth routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  // Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
  (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));

// Set up Google auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile','https://www.googleapis.com/auth/calendar'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user)));

//===================================================================
const port = 8080;
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}...`);
});
