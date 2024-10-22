const express = require('express');
const router = express.Router();
const AuthenticationController = require('~v1/controllers/AuthenticationController');


router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});


// router.post('/forgot-password', AuthenticationController.forgotPassword);


router.post('/register', AuthenticationController.register);
router.post('/login', AuthenticationController.login);
router.post('/verifyAccount', AuthenticationController.verifyAccount);

router.post('/refresh-token', AuthenticationController.refreshToken);

router.delete('/logout', AuthenticationController.logout);

module.exports = router;
