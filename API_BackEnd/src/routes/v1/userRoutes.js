const express = require('express');
const router = express.Router();
const AuthenticationController = require('~v1/controllers/AuthenticationController');

router.post('/register', AuthenticationController.register);
router.post('/login', AuthenticationController.login);
router.post('/verify-otp', AuthenticationController.verifyOtp);

router.post('/refresh-token', AuthenticationController.refreshToken);

router.delete('/logout', AuthenticationController.logout);

module.exports = router;
