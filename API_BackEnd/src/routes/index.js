require('dotenv').config();
const rateLimit = require('~v1/middleware/rateLimit');
const apiRouter_v1 = require('./v1');

const apiRouter = (app) => {
    app.use(`/api/${process.env.Version}`, rateLimit, apiRouter_v1);
};

module.exports = apiRouter;
