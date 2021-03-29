var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
require('dotenv').config()

var refreshTokens = []

router.get('/login-google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-google' }), (req, res) => {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = jwt.sign(req.user, process.env.PRIVATE_REFRESH_TOKEN_KEY, { expiresIn: "10h" });
    refreshTokens.push(refreshToken);
    res.header('Authorization', accessToken).json({ accessToken, refreshToken });
});

router.post('/refreshtoken', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    try {
        const decoded = jwt.verify(refreshToken, process.env.PRIVATE_REFRESH_TOKEN_KEY);
        if (decoded) {
            delete decoded.expiresIn;
            const accessToken = generateAccessToken({ name: decoded });
            res.header('Authorization', accessToken).json({ accessToken }).status(200);
        }
    } catch (ex) {
        res.sendStatus(403);
    }
});
router.post('/logout', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    try {
        refreshTokens = refreshTokens.filter(rt => rt != refreshToken);
        res.send(200);
    } catch (ex) {
        res.sendStatus(403);
    }
});
isAuthorized = function(req, res, next) {
    const accessToken = req.header('Authorization');
    if (!accessToken) return res.status(400).send("Access denied. Invalid Token");
    try {
        const decoded = jwt.verify(accessToken, process.env.PRIVATE_ACCESS_TOKEN_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        console.log("Exception", ex);
        res.status(400).send("Invalid token");
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.PRIVATE_ACCESS_TOKEN_KEY, { expiresIn: '30s' });
}
module.exports = { router, isAuthorized };