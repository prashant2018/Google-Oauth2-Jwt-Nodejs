const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config()

passport.serializeUser((user, done) => {
    console.log("user", user);
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    console.log("deserialize user", user);
    done(null, user);
});

passport.use(
    new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log("Profile", profile);
            console.log("Access token", accessToken);
            cb(null, profile);
        }
    )
);