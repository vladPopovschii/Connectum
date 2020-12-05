const express = require("express");
const {
	searchByName,
	getFriends,
	sendFriendRequest,
	acceptRequest,
	rejectRequest,
} = require("../util/utilbd");
const router = express.Router();

router.get("/", async (req, res) => {
	const friends = await getFriends(req.user.id);
	console.log(friends);
	res.render("./friends/friends");
});

router.search("/search", async (req, res) => {
	const users = (await searchByName(req.body.friends)).filter(
		(user) => user.id !== req.user.id
	);
	res.render("./friends/find-friends", {
		users: users,
		searchField: req.body.friends,
		thisUser: req.user,
	});
});

router.post("/send-friend-request", async (req, res) => {
	sendFriendRequest(req.body.senderId, req.body.receiverId);
	console.log("Request sent");
});

router.post("/accept-friend", (req, res) => {
	acceptRequest(req.body.senderId, req.body.receiverId);
	console.log("Request accepted!");
});

router.post("/reject-friend", (req, res) => {
	rejectRequest(req.body.senderId, req.body.receiverId);
	console.log("Request rejected!");
});

module.exports = router;
