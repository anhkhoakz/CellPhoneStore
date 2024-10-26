const express = require('express');
const router = express.Router();
const AuthenticationController = require('~v1/controllers/AuthenticationController');
const { checkValidate } = require('~v1/middleware/userMiddleware');

const { verifyAccessToken } = require('~v1/middleware/tokenMiddleware');
const roleAuth = require('~/api/v1/middleware/roleAuth');

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
    });
});

router.get(
    '/',
    verifyAccessToken,
    roleAuth('admin'),
    AuthenticationController.getAllUsers,
);

router.get('/:id', verifyAccessToken, AuthenticationController.getUser);

router.post('/resetPassword', AuthenticationController.resetPassword);
router.post('/forgotPassword', AuthenticationController.forgotPassword);

router.post('/register', AuthenticationController.register);
router.post('/login', checkValidate, AuthenticationController.login);
router.post('/verifyAccount', AuthenticationController.verifyAccount);

router.post('/refresh-token', AuthenticationController.refreshToken);

router.patch('/update', verifyAccessToken, AuthenticationController.update);

router.delete('/logout', AuthenticationController.logout);

module.exports = router;
