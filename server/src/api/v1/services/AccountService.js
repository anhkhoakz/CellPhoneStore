const _user = require('~v1/models/Account');
const _preUser = require('~v1/models/preUser');
const _preUserService = require('~v1/services/preUserService');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const {
    Verification_Email_Template,
    Forgot_Password_Template,
} = require('~/public/templates/emailTemplate');

const sendEmail = require('~v1/services/sendEmail');

const { signAccessToken } = require('~v1/auth/authUtils');

const {
    createRefreshToken,
    verifyAndRefreshToken,
} = require('~v1/services/tokenService');

const { delAsync, getAsync } = require('~/config/redis');

const hashPassword = require('~v1/helpers/hashPassword');

const generateResetToken = require('~v1/helpers/generateKey');
const { set } = require('~/app');

require('dotenv').config();

module.exports = {
    verifyGoogleAccount: async (data) => {},
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
                phone: lastPreUser.phone,
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

            const preUsers = await _preUser.findOne({ email: data.email });
            if (preUsers) {
                return {
                    code: 400,
                    message: 'Please check your email to verify first!',
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
                    code: 401,
                    message: 'Email or password is incorrect',
                };
            }

            const accessToken = signAccessToken({
                email: user.email,
                userId: user._id,
                role: user.role,
            });

            const refreshToken = await createRefreshToken({
                email: user.email,
                userId: user._id,
                role: user.role,
            });

            return {
                code: 200,
                message: { accessToken, userId: user._id },
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
                return { code: 401, message: 'redirect to login page' };
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
                role: decoded.role,
            });

            // const _refreshToken = await createRefreshToken({
            //     email: decoded.email,
            //     userId: decoded.userId,
            // });

            return {
                code: 200,
                elements: {
                    accessToken,
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
    update: async (updateData, id) => {
        try {
            const user = await _user.findById({ _id: id });

            if (!user) {
                return {
                    code: 404,
                    message: 'User not found',
                };
            }

            if (updateData.password) {
                if (!updateData.oldPassword || !updateData.confirmPassword) {
                    return {
                        code: 400,
                        message:
                            'Old password and confirm password are required',
                    };
                }

                // Validate old password
                const isPasswordValid = await user.comparePassword(
                    updateData.oldPassword,
                );
                if (!isPasswordValid) {
                    return {
                        code: 400,
                        message: 'Old password is incorrect',
                    };
                }

                if (updateData.password === updateData.oldPassword) {
                    return {
                        code: 400,
                        message: 'New password must be different from old password',
                    };
                }

                if (updateData.password !== updateData.confirmPassword) {
                    return {
                        code: 400,
                        message: 'Passwords do not match',
                    };
                }

                updateData.password = await hashPassword(updateData.password);
            }

            const updatedUser = await user.updateOne(
                updateData,
                { new: true },
            );

            return {
                code: 200,
                message: 'User updated successfully!',
                elements: updatedUser,
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },
    forgotPassword: async (data) => {
        try {
            const user = await _user.findOne({ email: data.email });

            if (!user) {
                return {
                    code: 404,
                    message: 'User not found',
                };
            }

            const resetToken = generateResetToken() + user._id;
            const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

            // Save the reset token and expiry to the user's document in the database
            await _user.updateOne(
                { _id: user._id },
                { resetToken, resetTokenExpiry },
            );

            const resetLink = `${process.env.FRONTEND_URL}/forgot-password/${resetToken}`;

            const emailTemplate = Forgot_Password_Template.replaceAll(
                '{resetLink}',
                resetLink,
            ).replace('{email}', user.username);
            await sendEmail(data.email, 'Forgot Password', emailTemplate);

            return {
                code: 200,
                message: 'Please check your email for a password reset link!',
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },
    resetPassword: async (data) => {
        try {
            const user = await _user.findOne({
                resetToken: data.token,
                resetTokenExpiry: { $gt: Date.now() },
            });


            if (!user) {
                return {
                    code: 404,
                    message: 'Invalid or expired reset token',
                };
            }

            user.password = await hashPassword(data.password);
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;

            await user.save();

            return {
                code: 200,
                message: 'Password reset successfully!',
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },

    checkValidateResetToken: async (token) => {

        try {

            const user = await _user.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() },
            });

            if (!user) {
                return {
                    code: 404,
                    message: 'Invalid or expired reset token',
                };
            }

            return {
                code: 200,
                message: 'Valid reset token',
            };
        }
        catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },

    addAddress: async (data, id) => {
        try {
            const user = await _user.findById({ _id: id });

            if (!user) {
                return {
                    code: 404,
                    message: 'User not found',
                };
            }

            if (!user.addresses) {
                user.addresses = [];
            }


            if(user.addresses.length === 0){
                data.isDefault = true;
            }

            user.addresses.push(data);

            const updatedUser = await user.save();

            return {
                code: 200,
                message: 'Address added successfully!',
                detail: data.detail,
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    },

    setDefaultAddress: async (data, id) => {
        try {
            const user = await _user.findById({ _id: id });

            if (!user) {
                return {
                    code: 404,
                    message: 'User not found',
                };
            }

            if (!user.addresses) {
                user.addresses = [];
            }

            user.addresses.forEach((address) => {
                if (address.id === data.id) {
                    address.isDefault = true;
                } else {
                    address.isDefault = false;
                }
            });

            const updatedUser = await user.save();

            return {
                code: 200,
                message: 'Default address set successfully!',
                elements: updatedUser,
            };
        } catch (error) {
            console.error(error);
            return {
                code: 500,
                message: 'Internal server error',
            };
        }
    }
};
