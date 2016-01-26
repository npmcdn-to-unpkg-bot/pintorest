var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var path = require("path");

var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

require("./config/passport")(passport);

app.use(express.static(path.join(__dirname, '/views')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
	secret: process.env.SESSION_SECRET || "secret-pintorest",
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./app/routes.js")(app, passport);

app.listen(port, function () {
	console.log("Express listening on port " + port);
});