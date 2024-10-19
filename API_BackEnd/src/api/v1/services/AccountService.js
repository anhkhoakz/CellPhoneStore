const _user = require('~v1/models/Account');
const _otp = require('~v1/models/OTP');
const _otpService = require('~v1/services/otpService');

const {
    Verification_Email_Template,
} = require('~/public/templates/emailTemplate');

const sendEmail = require('~v1/services/sendEmail');

// const {
//     siginToken,
//     refreshToken,
//     verifyRefreshToken,
// } = require('~v1/helpers/JWT');

const { signAccessToken } = require('~v1/auth/authUtils');

const {
    createRefreshToken,
    verifyAndRefreshToken,
} = require('~v1/services/tokenService');

const { delAsync, getAsync } = require('~/config/redis');

module.exports = {
    verifyOtp: async (data) => {
        try {
            const otp = await _otp.find({
                email: data.email,
            });
            if (otp.length === 0) {
                return {
                    code: 404,
                    message: 'Expired OTP!',
                };
            }

            const lastOtp = otp[otp.length - 1];

            const isvalid = await _otpService.validOtp({
                otp: data.otp,
                hashOtp: lastOtp.otp,
            });

            if (!isvalid) {
                return {
                    code: 400,
                    message: 'Invalid OTP!',
                };
            }

            const user = await _user.create({
                username: lastOtp.username,
                email: data.email,
                password: lastOtp.password,
            });

            if (!user) {
                return {
                    code: 400,
                    message: 'Failed to create user!',
                };
            }

            await _otp.deleteMany({ email: data.email });

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

            const otpCreationResult = await _otpService.CreateOtp({
                email: data.email,
                username: data.username,
                password: data.password,
            });

            if (otpCreationResult.code === 500) {
                return {
                    code: 500,
                    message: otpCreationResult.message,
                };
            }

            if (otpCreationResult.code === 400) {
                return {
                    code: otpCreationResult.code,
                    message: otpCreationResult.message,
                };
            }

            const emailTemplate = Verification_Email_Template.replace(
                '{verificationCode}',
                otpCreationResult.getOpt,
            ).replace('{email}', data.email);

            await sendEmail(data.email, 'Email Verification', emailTemplate);

            return {
                code: 201,
                message: 'OTP created successfully. Please verify your email.',
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
