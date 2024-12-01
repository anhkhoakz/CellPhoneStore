const express = require('express');
const router = express.Router();
const AuthenticationController = require('~v1/controllers/AuthenticationController');
const {
    checkValidateLogin,
    checkValidateRegister,
} = require('~v1/middleware/userMiddleware');

const { verifyAccessToken } = require('~v1/middleware/tokenMiddleware');
const roleAuth = require('~/api/v1/middleware/roleAuth');

// router.get(
//     '/',
//     verifyAccessToken,
//     roleAuth('admin'),
//     AuthenticationController.getAllUsers,
// );

router.get('/', AuthenticationController.getAllUsers);

router.get('/login', AuthenticationController.checkLogin);

router.get('/:id', verifyAccessToken, AuthenticationController.getUser);

router.post('/resetPassword', AuthenticationController.resetPassword);
router.post('/forgotPassword', AuthenticationController.forgotPassword);

router.post(
    '/register',
    checkValidateRegister,
    AuthenticationController.register,
);

router.post('/login', checkValidateLogin, AuthenticationController.login);
router.post('/verifyAccount', AuthenticationController.verifyAccount);

router.post('/refresh-token', AuthenticationController.refreshToken);

router.patch('/update', verifyAccessToken, AuthenticationController.update);

router.delete('/logout', AuthenticationController.logout);

module.exports = router;
