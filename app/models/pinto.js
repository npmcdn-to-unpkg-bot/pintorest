var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Pinto = new Schema({
	name: String,
	imgUrl: String,
	likes: Number,
	reposts: Number,
	poster: String,
	repostedBy: [String],
	likedBy: [String]
});

module.exports = mongoose.model("Pinto", Pinto);