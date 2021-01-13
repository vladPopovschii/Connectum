const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	members: [
		{
			userId: {
				type: String,
				required: true,
			},
		},
	],
	messages: [
		{
			from: {
				type: String,
				required: true,
			},
			body: {
				type: String,
				required: true,
			},
			time: {
				type: Date,
				default: Date.now(),
			},
		},
	],
});

module.exports = mongoose.model("Room", messageSchema);
