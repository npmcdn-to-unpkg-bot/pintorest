var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;

var User = new Schema({
	local: {
		username: String,
		password: String,
		firstName: String,
		lastName: String
	},
	twitter: {
		id: String,
		username: String,
		displayName: String
	}
});

User.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);