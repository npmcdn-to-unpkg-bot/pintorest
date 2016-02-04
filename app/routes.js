var Pinto = require("./models/pinto");

module.exports = function (app, passport) {

    app.get("/", function (req, res) {
        if (req.isAuthenticated()) {
            var username = req.user.local.username || req.user.twitter.username;
        }

        Pinto.find({})
            .sort({ $natural: -1 })
            .limit(5)
            .exec(function (err, docs) {
                if (err) {
                    throw err;
                }
                res.render("index", {
                    user: req.user,
                    isAuthenticated: req.isAuthenticated(),
                    docs: docs,
                    username: username
                });
            });
    });

    // user's pintos and his reposts
    app.get("/mypintos", isLoggedIn, function (req, res) {
        var username = req.user.local.username || req.user.twitter.username;

        Pinto.find({ $or: [ { "poster": username }, { "repostedBy": username } ] })
            .sort({ "likes": -1 })
            .exec(function (err, docs) {
                if (err) {
                    throw err;
                }

                res.render("mypintos", {
                    user: req.user,
                    docs: docs,
                    username: username
                });
        });
    });

    // all pintos
    app.get("/allpintos", function (req, res) {
        if (req.isAuthenticated()) {
            var username = req.user.local.username || req.user.twitter.username;
        }

        Pinto.find({})
            .sort({ "likes": - 1 })
            .exec(function (err, docs) {
                if (err) {
                    throw err;
                }

                res.render("allpintos", {
                    user: req.user,
                    username: username,
                    docs: docs
                });
        })
    });

    // other user's wall
    app.get("/users/:user", function (req, res) {
        Pinto.find({ "poster": req.params.user })
            .sort({ "likes": -1 })
            .exec(function (err, docs) {
                if (err) {
                    throw err;
                }

                if (!docs.length) {
                    res.redirect("/");
                } else {

                    if (req.isAuthenticated()) {
                        var username = req.user.local.username || req.user.twitter.username;
                    }

                    res.render("other_user_wall.ejs", {
                        user: req.user,
                        username: username,
                        docs: docs,
                        wallOwner: req.params.user
                    });
                }
        });
    });

    app.get("/login", function (req, res) {
        res.render("login", {
            message: req.flash("loginMessage")
        });
    });

    // twitter login
    app.get("/auth/twitter", passport.authenticate("twitter"));

    app.get("/auth/twitter/callback", passport.authenticate("twitter", {
        successRedirect: "/",
        failureRedirect: "/"
    }));

    // local login
    app.post("/login", passport.authenticate("local-login", {
        successRedirect : "/",
        failureRedirect : "/login",
        failureFlash : true
    }));

    app.get("/signup", function (req, res) {
        res.render("signup", {
            message: req.flash("signupMessage")
        });
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    app.post("/signup", passport.authenticate("local-signup", {
        successRedirect : "/",
        failureRedirect : "/signup",
        failureFlash : true
    }));

    // add new pinto
    app.post("/api/pintos", function (req, res) {
        var title = req.body.pintoTitle;
        var pintoUrl = req.body.pintoUrl;

        var pinto = new Pinto;

        pinto.name = title;
        pinto.imgUrl = pintoUrl;
        pinto.likes = 0;
        pinto.reposts = 0;
        pinto.poster = req.user.local.username || req.user.twitter.username;

        pinto.save(function (err) {
            if (err) {
                throw err;
            }

            Pinto.find({}, {"_id": 1})
                .sort({ $natural:-1 })
                .limit(1)
                .exec(function (err, doc) {
                    if (err) {
                        throw err;
                    }
                    res.json(doc);
                });
        });
    });

    // add and remove likes
    app.put("/api/pintos/:id", isLoggedIn, function (req, res) {
        var id = req.params.id;
        var user = req.user.local.username || req.user.twitter.username;
        var method = req.body.method;

        if (method === "add-like") {
            Pinto.findOneAndUpdate(
                { "_id": id },
                { $push: { "likedBy": user }, $inc: { "likes": 1 } }
            ).exec(function (err, docs) {
                if (err) {
                    throw err;
                }
                res.end();
            });
        }

        else if (method === "unlike") {
            Pinto.findOneAndUpdate(
                { "_id": id },
                { $pull: { "likedBy": user }, $inc: { "likes": -1 } }
            ).exec(function (err, docs) {
                if (err) {
                    throw err;
                }
                res.end();
            });
        }

        else if (method === "add-repost") {
            Pinto.findOneAndUpdate(
                { "_id": id },
                { $push: { "repostedBy": user }, $inc: { "reposts": 1 } }
            ).exec(function (err, docs) {
                if (err) {
                    throw err;
                }
                res.end();
            });
        }

        else if (method === "remove-repost") {
            Pinto.findOneAndUpdate(
                { "_id": id },
                { $pull: { "repostedBy": user }, $inc: { "reposts": -1 } }
            ).exec(function (err, docs) {
                if (err) {
                    throw err;
                }
                res.end();
            });
        }
    });

    // remove a pinto
    app.delete("/api/pintos", function (req, res) {
        var id = req.body.id;

        Pinto.remove({ "_id": id }, function (err) {
            if (err) {
                throw err;
            }
            res.end();
        });
    });
};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/");
}
