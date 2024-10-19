const CreateError = require('http-errors');
const { signAccessToken, verifyToken } = require('~v1/auth/authUtils');
const { verifyAndRefreshToken } = require('~v1/services/tokenService');
const { getAsync } = require('~/config/redis');
const { post } = require('~/app');

// Middleware for verifying access token and auto-refreshing
const verifyAccessToken = async (req, res, next) => {
    if (!req.cookies['accessToken']) {
        return next(CreateError.Unauthorized('Access token not found'));
    }

    try {
        const accessToken = req.cookies['accessToken'];
        const decoded = verifyToken(accessToken);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            if (!req.cookies['userId']) {
                return res.redirect('/login');
            }

            const userId = req.cookies['userId'];
            const refreshToken = await getAsync(userId.toString());

            if (!refreshToken) {
                return next(
                    CreateError.Unauthorized('Refresh token not found'),
                );
            }

            const { success, error } =
                await verifyAndRefreshToken(refreshToken);

            if (!success) {
                return next(CreateError.Unauthorized(error));
            }

            try {
                post('http://localhost:8080/api/v1/users/refresh-token', {
                    refreshToken,
                });

                const accessToken = req.cookies['accessToken'];
                const decoded = verifyToken(accessToken);
                req.user = decoded;

                return next();
            } catch (error) {
                return next(CreateError.InternalServerError(error.message));
            }
        }

        return next(CreateError.InternalServerError(error.message));
    }
};

module.exports = {
    verifyAccessToken,
};
