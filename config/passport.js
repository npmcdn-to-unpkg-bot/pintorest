var LocalStrategy = require("passport-local").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;

var User = require("../app/models/user");

var auth = require("./auth");

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use("local-signup", new LocalStrategy({
        passReqToCallback : true
    },
    function (req, username, password, done) {

        process.nextTick(function () {

        User.findOne({ "username" :  username }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false, req.flash("signupMessage", "That username is already taken."));
            } else {

                var user = new User;

                user.local.username = username;
                user.local.password = user.generateHash(password);
                user.local.firstName = req.body.firstname;
                user.local.lastName = req.body.lastname;
                
                // save the user
                user.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, user);
                });
            }

        });    

        });

    }));


	passport.use("local-login", new LocalStrategy({
	        passReqToCallback : true 
    },
    function (req, username, password, done) { 

        User.findOne({ "local.username" :  username }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash("loginMessage", "No user found.")); // req.flash is the way to set flashdata using connect-flash
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash("loginMessage", "Oops! Wrong password.")); // create the loginMessage and save it to session as flashdata
            }

            return done(null, user);
        });

    }));


    passport.use(new TwitterStrategy({
        consumerKey: auth.twitterAuth.consumer_key, 
        consumerSecret: auth.twitterAuth.consumer_secret,
        callbackUrl: auth.twitterAuth.callback_url
    },
    function (token, tokenSecret, profile, done) {
        process.nextTick(function () {
            User.findOne({ "twitter.id": profile.id }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, user);
                } else {
                    var user = new User;
                    user.twitter.id = profile.id;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;

                    user.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, user);
                    });
                }
            });
        });
    }));

};