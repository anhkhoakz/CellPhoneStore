const apiRouter_v1 = require('./v1');

const apiRouter = (app) => {
    app.use('/v1', apiRouter_v1);
};

module.exports = apiRouter;
