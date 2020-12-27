const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	birthDate: {
		type: Date,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	profileImage: {
		type: String,
		default: "\\img\\default.png",
	},
	info: {
		type: String,
	},
	friendsList: [
		{
			userId: {
				type: String,
				required: true,
			},
		},
	],
	sentRequest: [
		{
			userId: {
				type: String,
				required: true,
			},
		},
	],
	friendRequest: [
		{
			userId: {
				type: String,
				required: true,
			},
			requestDate: {
				type: Date,
				default: Date.now,
			},
		},
	],
	notifications: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("User", userSchema);
