var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var isAuthorized = require('./auth').isAuthorized;

require('dotenv').config()

// Protected Route
router.get('/', isAuthorized, function(req, res, next) {
    res.send(req.user).status(200);
});

module.exports = router;