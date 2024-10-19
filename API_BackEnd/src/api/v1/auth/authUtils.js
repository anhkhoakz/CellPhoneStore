const JWT = require('jsonwebtoken');
require('dotenv').config();
const { privateKey, publicKey } = require('~v1/helpers/keyPair');

// Sign an access token
const signAccessToken = (payload) => {
    return JWT.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};

// Sign a refresh token
const signRefreshToken = (payload) => {
    return JWT.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1y',
    });
};

// Verify a token (access or refresh)
const verifyToken = (token) => {
    return JWT.verify(token, publicKey, { algorithms: ['RS256'] });
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyToken,
};
