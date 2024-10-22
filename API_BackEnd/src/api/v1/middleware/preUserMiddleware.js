const bcrypt = require('bcrypt');

const addOTPMiddleware = async function (next) {
    try {
        console.log('password:', this.password);
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = addOTPMiddleware;
