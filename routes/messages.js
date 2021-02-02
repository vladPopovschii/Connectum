const express = require("express");
const router = express.Router();

const {
	getFriends,
	getUserById,
	createRoom,
	checkRoom,
	getMessagesFromRoom,
	getFriendsWithLastMessage,
} = require("../util/utilbd");

router.get("/", async (req, res) => {
	let friends = await getFriendsWithLastMessage(req.user.id);
	res.render("./messages/home", {
		user: req.user,
		friends: friends,
	});
});

router.get("/:id", async (req, res) => {
	const friend = await getUserById(req.params.id);
	let roomId = await checkRoom(req.user.id, req.params.id);
	if (!roomId) roomId = await createRoom(req.user.id, req.params.id);

	const messages = await getMessagesFromRoom(roomId);

	res.render("./messages/chat", {
		user: req.user,
		friend: friend,
		roomId: roomId,
		messages: messages,
	});
});

module.exports = router;
