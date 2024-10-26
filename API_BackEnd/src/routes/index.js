require('dotenv').config();
const rateLimit = require('~v1/middleware/rateLimit');
const apiRouter_v1 = require('./v1');


const AuthenticationController = require('~v1/controllers/AuthenticationController');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')

const { signAccessToken } = require('~v1/auth/authUtils');

const {
    createRefreshToken,
} = require('~v1/services/tokenService');




passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/oauth2/redirect/google',
  scope: ['profile', 'email'],
  state: true
}, AuthenticationController.verifyGoogleAccount));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




const apiRouter = (app) => {
    app.use(`/api/${process.env.Version}`, rateLimit, apiRouter_v1);

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login/google', passport.authenticate('google'));
    
    app.get('/oauth2/redirect/google',
        passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
        
        async (req, res) => {
            
            try{
                
                const token = signAccessToken({
                    email: req.user.email,
                    userId: req.user.id,
                });

                
                const refresh = await createRefreshToken({
                    email: req.user.email,
                    userId: req.user.id,
                });

                res.cookie('userId', req.user.id, {
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'lax',
                });


                res.cookie('accessToken', token, {
                    maxAge: process.env.COOKIE_TOKEN_EXPIRY,
                    httpOnly: true,
                    // secure: true,
                    sameSite: 'lax',
                });
                res.redirect(`http://localhost:8080/api/v1`);

            }
            catch(error)
            {
                res.status(500).json({error: error.message});
            }

    });


};

module.exports = apiRouter;
