var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
require('dotenv').config()

require('./services/passport-init');

var authRouter = require('./routes/auth').router;
var usersRouter = require('./routes/users');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3000);

module.exports = app;