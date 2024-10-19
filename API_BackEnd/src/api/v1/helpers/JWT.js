require('dotenv').config();
const CreateError = require('http-errors');
const JWT = require('jsonwebtoken');

const { privateKey, publicKey } = require('~v1/helpers/keyPair');

const { client } = require('~/config/redis');

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

const siginToken = (payload) => {
    return JWT.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h',
    });
};

const verifyAccessToken = async (req, res, next) => {
    const token = req.cookies['accessToken'];
    // const token = req.headers['authorization'];

    if (!token) {
        return next(CreateError.Unauthorized());
    }

    try {
        const decoded = JWT.verify(token, publicKey, {
            algorithms: ['RS256'],
        });
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const refreshToken = await client.get(req.user.userId.toString());

            if (!refreshToken) {
                return next(CreateError.Unauthorized(error.message));
            }

            const { success, decoded, error } =
                await verifyRefreshToken(refreshToken);

            if (!success) {
                return next(CreateError.Unauthorized(error));
            }

            const newAccessToken = siginToken({
                userId: decoded.userId,
                email: decoded.email,
            });

            res.cookies('accessToken', newAccessToken, {
                maxage: 3600000,
                httpOnly: true,
                // secure: true,
                sameSite: 'lax',
            });

            req.user = decoded;
            next();
        }
        return next(CreateError.InternalServerError());
    }
};

const refreshToken = async (payload) => {
    try {
        const token = JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1y',
        });

        await client.set(payload.userId.toString(), token, {
            EX: ONE_YEAR_IN_SECONDS,
        });

        return token;
    } catch (error) {
        return CreateError.InternalServerError();
    }
};

const verifyRefreshToken = async (token) => {
    try {
        const decoded = JWT.verify(token, publicKey, {
            algorithms: ['RS256'],
        });

        const storedToken = await client.get(decoded.userId.toString());

        if (token !== storedToken || !storedToken) {
            return {
                success: false,
                error: 'Invalid or expired refresh token',
            };
        }

        return { success: true, decoded };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { success: false, error: 'Refresh token has expired' };
        }
        return { success: false, error: 'Token verification failed' };
    }
};

module.exports = {
    siginToken,
    verifyAccessToken,
    refreshToken,
    verifyRefreshToken,
};
