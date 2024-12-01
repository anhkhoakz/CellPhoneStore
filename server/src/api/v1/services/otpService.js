const _otp = require('~v1/models/OTP');
const bcrypt = require('bcrypt');
const generateOTP = require('~/api/v1/helpers/otpGenerator');

module.exports = {
    validOtp: async (data) => {
        try {
            const isvalid = await bcrypt.compare(data.otp, data.hashOtp);
            return isvalid;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    CreateOtp: async (data) => {
        try {
            const isExist = await _otp.findOne({
                email: data.email,
            });

            if (isExist) {
                return {
                    code: 400,
                    message: 'OTP already sent, please check your email!',
                };
            }

            const __otp = new _otp({
                email: data.email,
                otp: generateOTP,
            });

            const getOpt = __otp.otp;
            console.log('OTP:', getOpt);

            const savedOtp = await __otp.save();

            if (!savedOtp) {
                return {
                    code: 500,
                    message: 'Failed to create OTP!',
                };
            }

            return {
                code: 201,
                getOpt: getOpt,
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
