const path = require('path');
const express = require('express');
const configViewEngine = (app) => {
    app.set('view engine', 'ejs');
    app.set('views', path.join('~', 'views'));
    app.use(express.static(path.join('~', 'public')));
};

module.exports = configViewEngine;
