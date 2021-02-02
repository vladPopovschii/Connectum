const {
	getUserById,
	getUsersById,
	checkIfRequestSended,
	clearNotifications,
	updateLastSeen,
	insertMessageInRoom,
} = require("../util/utilbd");

module.exports = function (io) {
	const users = [];
	let onlineIds = [];

	io.on("connection", (socket) => {
		socket.on("userid", async (userId) => {
			users[userId] = socket.id;
			onlineIds.push({ userId: userId, socketId: socket.id });
			const onlineUsers = await getUsersById(
				onlineIds.map((idObjs) => idObjs.userId)
			);
			const user = await getUserById(userId);
			socket.emit("users-online", onlineUsers);
			socket.broadcast.emit("online", user);
		});

		socket.on("friend-request-sent", async (receiverId, senderId) => {
			if (await checkIfRequestSended(senderId, receiverId)) return;

			const requestedUser = await getUserById(senderId);
			requestedUser.requestDate = Date.now();
			socket.broadcast
				.to(users[receiverId])
				.emit("update-requests", requestedUser, senderId);
			socket.broadcast.to(users[receiverId]).emit("notify");
		});

		socket.on("clear-notifications", (id) => {
			clearNotifications(id);
		});

		socket.on("send-message", (friendId, senderId, msg, roomId) => {
			insertMessageInRoom(roomId, senderId, msg);

			socket.broadcast.to(users[friendId]).emit("receive-message", msg);
			socket.broadcast
				.to(users[friendId])
				.emit("update-last-message", msg);
		});

		socket.on("is-typing", (friendId) => {
			socket.broadcast.to(users[friendId]).emit("user-is-typing");
		});

		socket.on("is-not-typing", (friendId) => {
			socket.broadcast.to(users[friendId]).emit("user-is-not-typing");
		});

		socket.on("disconnect", () => {
			const id = onlineIds.find((idObj) => idObj.socketId === socket.id);
			socket.broadcast.emit("offline", id);
			if (id != null) updateLastSeen(id.userId);
			onlineIds = onlineIds.filter(
				(onlineId) => onlineId.socketId !== socket.id
			);
		});
	});
};
