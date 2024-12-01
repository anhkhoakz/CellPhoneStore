const bcrypt = require('bcrypt');
var validator = require('validator');

const checkValidateLogin = function (req, res, next) {
    try {
        const { email, password } = req.body;

        if (email === undefined || password === undefined) {
            return res
                .status(400)
                .json({ message: 'Email and password are required' });
        }

        // Check email format
        else if (validator.isEmail(email) === false) {
            return res
                .status(400)
                .json({ message: 'Invalid email format haha' });
        }

        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const checkValidateRegister = function (req, res, next) {
    try {
        const { email, password, confirmPassword, username } = req.body;

        if (
            email === undefined ||
            username === undefined ||
            password === undefined ||
            confirmPassword === undefined
        ) {
            return res.status(400).json({ message: 'Please fill out fields' });
        }

        // Check email format
        else if (validator.isEmail(email) === false) {
            return res.status(400).json({ message: 'Invalid email format' });
        } else if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Password does not match' });
        }

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

module.exports = { comparePassword, checkValidateLogin, checkValidateRegister };
