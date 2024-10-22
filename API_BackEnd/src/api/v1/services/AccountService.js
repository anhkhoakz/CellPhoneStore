const _user = require('~v1/models/Account');
const _preUser = require('~v1/models/preUser');
const _preUserService = require('~v1/services/preUserService');
const mongoSanitize = require('express-mongo-sanitize');

const {
    Verification_Email_Template,
} = require('~/public/templates/emailTemplate');

const sendEmail = require('~v1/services/sendEmail');


const { signAccessToken } = require('~v1/auth/authUtils');

const {
    createRefreshToken,
    verifyAndRefreshToken,
} = require('~v1/services/tokenService');

const { delAsync, getAsync } = require('~/config/redis');

module.exports = {
    verifyAccount: async (data) => {
        try {
            const preUsers = await _preUser.find({
                email: data.email,
            });
            if (preUsers.length === 0) {
                return {
                    code: 404,
                    message: 'Expired OTP!',
                };
            }

            const lastPreUser = preUsers[preUsers.length - 1];

            const isvalid = await _preUserService.validVerifyAccount({
                otp: data.otp,
                hashOtp: lastPreUser.otp,
            });

            if (!isvalid) {
                return {
                    code: 400,
                    message: 'Invalid OTP!',
                };
            }

            const user = await _user.create({
                username: lastPreUser.username,
                email: data.email,
                password: lastPreUser.password,
            });

            if (!user) {
                return {
                    code: 400,
                    message: 'Failed to create user!',
                };
            }

            await _preUser.deleteMany({ email: data.email });

            return {
                code: 201,
                elements: user,
                message: 'User created successfully!',
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },

    register: async (data) => {
        try {
            const user = await _user.findOne({ email: data.email });

            if (user) {
                return {
                    code: 400,
                    message: 'Email already exists',
                };
            }

            const createPreUser = await _preUserService.CreatePreUser({
                email: data.email,
                username: data.username,
                password: data.password,
            });

            if (createPreUser.code === 500) {
                return {
                    code: 500,
                    message: createPreUser.message,
                };
            }

            if (createPreUser.code === 400) {
                return {
                    code: createPreUser.code,
                    message: createPreUser.message,
                };
            }

            const emailTemplate = Verification_Email_Template.replace(
                '{verificationCode}',
                createPreUser.message,
            ).replace('{email}', data.email);

            await sendEmail(data.email, 'Email Verification', emailTemplate);

            return {
                code: 201,
                message: 'please check your email to verify!',
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },

    login: async (data) => {
        try {
            if (mongoSanitize.has(data)) {
                return {
                    code: 400,
                    message: 'Invalid input',
                };
            }

            const user = await _user.findOne({
                email: data.email,
            });

            if (!user) {
                return {
                    code: 404,
                    message: 'Email or password is incorrect',
                };
            }

            const isPasswordValid = await user.comparePassword(data.password);

            if (!isPasswordValid) {
                return {
                    code: 404,
                    message: 'Email or password is incorrect',
                };
            }

            const token = signAccessToken({
                email: user.email,
                userId: user._id,
            });

            const refreshToken = await createRefreshToken({
                email: user.email,
                userId: user._id,
            });

            return {
                code: 200,
                message: 'User found!',
                elements: {
                    accessToken: token,
                    refreshToken,
                    userId: user._id,
                },
            };
        } catch (error) {
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },
    logout: async (req) => {
        try {
            if (!req.cookies['userId']) {
                return { code: 400, message: 'redirect to login page' };
            }

            const userId = req.cookies['userId'];
            const refreshToken = await getAsync(userId.toString());

            const { success, decoded, error } =
                await verifyAndRefreshToken(refreshToken);

            if (!success || !decoded) {
                return {
                    code: 401,
                    message: error || 'Invalid or expired refresh token',
                };
            }
            await delAsync(decoded.userId.toString());
            return {
                code: 200,
                message: 'User logged out successfully!',
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },
    refreshToken: async (data) => {
        try {
            const { success, decoded, error } = await verifyAndRefreshToken(
                data.refreshToken,
            );

            if (!success || !decoded) {
                return {
                    code: 401,
                    message: error || 'Invalid or expired refresh token',
                };
            }

            const accessToken = signAccessToken({
                email: decoded.email,
                userId: decoded.userId,
            });

            const _refreshToken = await createRefreshToken({
                email: decoded.email,
                userId: decoded.userId,
            });

            return {
                code: 200,
                elements: {
                    accessToken,
                    refreshToken: _refreshToken,
                    userId: decoded.userId,
                },
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },
};
