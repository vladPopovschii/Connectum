const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	imageSrc: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	ownerId: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Posts", postSchema);
