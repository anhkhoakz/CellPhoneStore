const express = require('express');
const helmet = require('helmet');
const configViewEngine = require('~/config/viewEngine');
const apiRouter = require('~/routes');
const morgan = require('morgan');
const database = require('~/config/database');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const path = require('path');
const cors = require('cors');

const createError = require('http-errors');
const compression = require('compression');

// connect to database
database.connect();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(cookieParser());

app.use(
    // allow all cors
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);
app.use(helmet());
app.use(morgan('combined'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

configViewEngine(app);

// Use the apiRouter function to set up the API routes
apiRouter(app);

// Error handling
app.use((req, res, next) => {
    next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
    res.status(500 || error.status);
    res.json({
        status: error.status || 500,
        message: error.message,
        // stack: error.stack,
    });
});

module.exports = app;
