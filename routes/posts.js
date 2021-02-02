const express = require("express");
const Post = require("./../models/post");
const router = express.Router();
const { postUpload } = require("../util/postImageUpload");

router.post("/post", postUpload.single("image_Name"), (req, res) => {
	const imagePath =
		req.file != undefined ? req.file.path.slice(6) : "\\img\\default.png";
	const post = new Post({
		ownerId: req.user.id,
		date: Date.now(),
		imageSrc: imagePath,
	}).save();
});

module.exports = router;
