const CreateError = require('http-errors');
const { verifyToken } = require('~v1/auth/authUtils');
const { getAsync } = require('~/config/redis');

const Account = require('~v1/models/Account');

require('dotenv').config();

const axios = require('axios');

// Middleware for verifying access token and auto-refreshing
const verifyAccessToken = async (req, res, next) => {
    try {
        const cookieToken = req.cookies['accessToken'];
        const authHeader = req.headers['authorization'];
        const authToken = authHeader?.split(' ')[1];

        if (!cookieToken && !req.cookies['userId']) {
            return next(CreateError.Unauthorized('Access token not found 1'));
        }

        // Check if the Authorization token is missing
        if (!authToken) {
            console.log('No auth token');
            return next(CreateError.Unauthorized('Access token not found 2'));
        }

        // Check if the cookie token matches the Authorization token
        if (cookieToken !== authToken && cookieToken !== undefined) {
            // remove cookie
            res.clearCookie('accessToken');
            res.clearCookie('userId');

            return next(CreateError.Unauthorized('Access token mismatch'));
        }

        if (cookieToken === undefined) {
            // Handle token refresh if expired
            const userId = req.cookies['userId'];

            const user = await Account.findById(userId);

            if (!user) {
                return next(CreateError.Unauthorized('User not found'));
            }

            const refreshToken = await getAsync(userId.toString()); // Retrieve refresh token from Redis

            if (!refreshToken) {
                res.clearCookie('userId');

                return next(
                    CreateError.Unauthorized('Refresh token not found'),
                );
            }

            // Request a new access token using the refresh token
            try {
                const response = await axios.post(
                    ` ${process.env.BACKEND_URL}/api/v1/users/refresh-token`,
                    { refreshToken },
                );

                console.log('Refresh token response:', response.data);

                const { accessToken } = response.data.elements;

                console.log('New access token:', accessToken);

                res.cookie('accessToken', accessToken, {
                    maxAge: process.env.COOKIE_TOKEN_EXPIRY,
                    httpOnly: false,
                    // secure: true,
                    sameSite: 'lax',
                });

                // Verify the new access token
                const decoded = verifyToken(accessToken);
                req.user = decoded;

                return next();
            } catch (error) {
                res.clearCookie('userId');
                console.log('Refresh token error:', error.response.data);
                return next(
                    CreateError.Unauthorized('Unable to refresh access token'),
                );
            }
        }

        const accessToken = authToken;

        // Attempt to verify the access token
        try {
            const decoded = verifyToken(accessToken);
            req.user = decoded;
            return next();
        } catch (error) {
            // Handle cases other than token expiration

            if (error.name !== 'TokenExpiredError') {
                res.clearCookie('userId');
                return next(CreateError.InternalServerError(error.message));
            }
        }
    } catch (error) {

        res.clearCookie('userId');
        return next(CreateError.InternalServerError(error.message));
    }
};

const optionalAuthenticateToken = (req, res, next) => {
    if (req.cookies['userId']) {
        const token = req.cookies['accessToken'];
        try {
            const decoded = verifyToken(token);
            req.user = decoded;
        } catch (error) {}
    }
    next();
};

const combinedAuthMiddleware = (req, res, next) => {
        if (req.cookies['userId']) {
            return verifyAccessToken(req, res, next);
        }
        next();
};

module.exports = {
    verifyAccessToken,
    optionalAuthenticateToken,
    combinedAuthMiddleware,
};
