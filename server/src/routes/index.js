require('dotenv').config();
const rateLimit = require('~v1/middleware/rateLimit');
const apiRouter_v1 = require('./v1');

const User = require('~v1/models/Account');

const AuthenticationController = require('~v1/controllers/AuthenticationController');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

const { signAccessToken } = require('~v1/auth/authUtils');

const { createRefreshToken } = require('~v1/services/tokenService');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/oauth2/redirect/google`,
            scope: ['profile', 'email'],
            state: true,
        },
        AuthenticationController.verifyGoogleAccount,
    ),
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

const apiRouter = (app) => {
    app.use(`/api/${process.env.Version}`, rateLimit, apiRouter_v1);

    app.use(passport.initialize());
    app.use(passport.session());

    console.log('API Router');
    app.get('/login/google', passport.authenticate('google'));

    app.get(
        '/oauth2/redirect/google',
        passport.authenticate('google', {
            failureRedirect: '/login',
            failureMessage: true,
        }),

        async (req, res) => {
            try {
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
                    httpOnly: false,
                    sameSite: 'lax',
                });

                res.cookie('accessToken', token, {
                    maxAge: process.env.COOKIE_TOKEN_EXPIRY,
                    httpOnly: false,
                    // secure: true,
                    sameSite: 'lax',
                });

                // res.status(200).json({ message: token });
                res.redirect(`${process.env.FRONTEND_URL}`);
            } catch (error) {
                // res.status(500).json({ error: error.message });
                res.redirect(`${process.env.FRONTEND_URL}/login/error`);
            }
        },
    );
};

module.exports = apiRouter;
