const bcrypt = require('bcrypt');
var validator = require('validator');


const checkValidate = function (req, res, next) {
    try {
        const { email, password } = req.body;

        if (email === undefined || password === undefined) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check email format
        else if (validator.isEmail(email) === false) {
            return res.status(400).json({ message: 'Invalid email format haha' });
        }

        // Check password length
        // else if (password.length < 8 || password.length > 124) {
        //     return res.status(400).json({ message: 'Password must be between 8 and 124 characters' });
        // }

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

module.exports = {  comparePassword, checkValidate };
