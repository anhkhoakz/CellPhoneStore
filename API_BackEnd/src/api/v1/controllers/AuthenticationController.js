const {
    register,
    verifyAccount,
    login,
    refreshToken,
    logout,
} = require('~/api/v1/services/AccountService');

require('dotenv').config();
const CreateError = require('http-errors');

module.exports = {
    verifyAccount: async (req, res, next) => {
        try {
            console.log(req.body.otp);
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res
                    .status(400)
                    .json({ message: 'Email and OTP are required' });
            }
            const { code, message, elements } = await verifyAccount(req.body);
            return res.status(code).json({
                code,
                message,
                elements,
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    },
    register: async (req, res, next) => {
        try {
            const { email } = req.body;

            console.log(email);

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const { code, message, elements } = await register(req.body);

            return res.status(code).json({
                code,
                message,
                elements,
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: 'Email and Password are required' });
            }

            const { code, message, elements } = await login(req.body);

            if (code === 200) {
                const { accessToken, userId } = elements;

                res.cookie('accessToken', accessToken, {
                    maxAge: process.env.COOKIE_TOKEN_EXPIRY,
                    httpOnly: true,
                    // secure: true,
                    sameSite: 'lax',
                });

                res.cookie('userId', userId, {
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    // secure: true,
                    sameSite: 'lax',
                });
            }

            return res.status(code).json({
                code,
                message,
                elements,
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    },
    logout: async (req, res, next) => {
        try {
            const { code, message } = await logout(req);

            if (code === 200) {
                res.clearCookie('accessToken');
                res.clearCookie('userId');
            }

            return res.status(code).json({
                message,
            });
        } catch (err) {
            next({ code: 500, message: err.message });
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            if (!req.body.refreshToken) {
                throw CreateError.BadRequest('Refresh token is required');
            }

            const { code, message, elements } = await refreshToken(req.body);

            if (code !== 200) {
                return res.status(code).json({
                    message,
                });
            }

            const { accessToken, userId } = elements;

            res.cookie('accessToken', accessToken, {
                maxAge: process.env.COOKIE_TOKEN_EXPIRY,
                httpOnly: true,
                // secure: true,
                sameSite: 'lax',
            });

            res.cookie('userId', userId, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                // secure: true,
                sameSite: 'lax',
            });

            return res.status(code).json({
                elements,
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    },
};
