const rateLimit = require('express-rate-limit');

let limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // limit each IP to 20 requests per windowMs
    message: { message: 'Too many requests, please try again later.' },
});

module.exports = limiter;
