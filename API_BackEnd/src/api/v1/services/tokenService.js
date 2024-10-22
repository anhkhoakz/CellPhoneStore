const { signRefreshToken, verifyToken } = require('~v1/auth/authUtils');

const CreateError = require('http-errors');
const { setAsync, getAsync } = require('~/config/redis');
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

// Refresh token service
const createRefreshToken = async (payload) => {
    try {
        if (!payload.userId) {
            return CreateError.BadRequest('User ID is required');
        }

        if (!payload.email) {
            return CreateError.BadRequest('Email is required');
        }

        const token = signRefreshToken(payload);
        await setAsync(payload.userId.toString(), token, {
            EX: ONE_YEAR_IN_SECONDS,
        });
        return token;
    } catch (error) {
        return CreateError.InternalServerError(error.message);
    }
};


// Verify refresh token
const verifyAndRefreshToken = async (token) => {
    try {
        const decoded = verifyToken(token);
        const storedToken = await getAsync(decoded.userId.toString());

        if (!storedToken || storedToken !== token) {
            return {
                success: false,
                error: 'Invalid or expired refresh token',
            };
        }

        return { success: true, decoded };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { success: false, error: error.message };
        }
        return { success: false, error: error.message };
    }
};

module.exports = {
    createRefreshToken,
    verifyAndRefreshToken,
};
