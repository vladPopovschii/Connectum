const express = require("express");
const router = express.Router();

const { getFriends } = require("../util/utilbd");

router.get("/", async (req, res) => {
	const friends = await getFriends(req.user.id);
	res.render("./messages/home", {
		user: req.user,
		friends: friends,
	});
});

router.get("/1", (req, res) => {
	res.render("./messages/chat", {
		user: req.user,
	});
});

module.exports = router;
