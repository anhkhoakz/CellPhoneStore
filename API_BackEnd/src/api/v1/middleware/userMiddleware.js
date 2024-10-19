const bcrypt = require('bcrypt');

const hashPassword = async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = { hashPassword, comparePassword };
