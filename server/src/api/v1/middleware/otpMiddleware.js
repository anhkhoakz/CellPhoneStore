const bcrypt = require('bcrypt');

const addOTPMiddleware = async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = addOTPMiddleware;
