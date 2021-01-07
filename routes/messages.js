const express = require("express");
const router = express.Router();

const { getFriends, getUserById } = require("../util/utilbd");

router.get("/", async (req, res) => {
	const friends = await getFriends(req.user.id);
	res.render("./messages/home", {
		user: req.user,
		friends: friends,
	});
});

router.get("/:id", async (req, res) => {
	const friend = await getUserById(req.params.id);
	res.render("./messages/chat", {
		user: req.user,
		friend: friend,
	});
});

module.exports = router;
