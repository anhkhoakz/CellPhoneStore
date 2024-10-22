const CreateError = require('http-errors');
const {  verifyToken } = require('~v1/auth/authUtils');
const { getAsync } = require('~/config/redis');


const axios = require('axios');

// Middleware for verifying access token and auto-refreshing
const verifyAccessToken = async (req, res, next) => {
    if (!req.cookies['accessToken']) {
        if (!req.cookies['userId']) {
            return res.redirect('/login'); 
        }
    }
    else{
        const accessToken = req.cookies['accessToken'];
        try {
            const decoded = verifyToken(accessToken);
            req.user = decoded;
            return next();
        } catch (error) {
            if (error.name !== 'TokenExpiredError') {
                return next(CreateError.InternalServerError(error.message)); // Other error, return internal error
            }
        }
    }
        

    const userId = req.cookies['userId'];
    const refreshToken = await getAsync(userId.toString());

    if (!refreshToken) {
        return next(
            CreateError.Unauthorized('Refresh token not found'),
        );
    }

        
    try {

        const respone = await axios.post(
            'http://localhost:8080/api/v1/users/refresh-token', 
            { refreshToken }
        );

        const {accessToken, userId} = respone.data.elements;
        res.cookie('accessToken', accessToken, {
            maxAge: process.env.COOKIE_TOKEN_EXPIRY,
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        res.cookie('userId', userId, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // secure: true,
            sameSite: 'lax',
        });


        const decoded = verifyToken(accessToken);
        req.user = decoded;

        return next();
    } catch (error) {

        return next(CreateError.InternalServerError("Error while refreshing token"));
    }
        
};

module.exports = {
    verifyAccessToken,
};
