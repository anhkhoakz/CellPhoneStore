const _preUser = require('~v1/models/preUser');
const bcrypt = require('bcrypt');
const generateOTP = require('~/api/v1/helpers/otpGenerator');

module.exports = {
    validVerifyAccount: async (data) => {
        try {
            const isvalid = await bcrypt.compare(data.otp, data.hashOtp);
            return isvalid;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    CreatePreUser: async (data) => {
        try {
            const isExist = await _preUser.findOne({
                email: data.email,
            });

            if (isExist) {
                return {
                    code: 400,
                    message: 'please check your email to verify account!',
                };
            }

            const __preUser = new _preUser({
                email: data.email,
                otp: generateOTP,
                username: data.username,
                password: data.password,
            });

            const getOpt = __preUser.otp;
            console.log('OTP:', getOpt);

            const savedPreUser = await __preUser.save();

            if (!savedPreUser) {
                return {
                    code: 500,
                    message: 'Failed to create preUser!',
                };
            }

            return {
                code: 201,
                message: getOpt,
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
