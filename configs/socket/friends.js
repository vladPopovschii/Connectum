const {
	getUserById,
	checkIfRequestSended,
	clearNotifications,
} = require("../../util/utilbd");

module.exports = function (io, users) {
	io.on("connection", (socket) => {
		socket.on("userid", (userId) => {
			users[userId] = socket.id;
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

		socket.on("disconnect", () => {
			delete users[users.indexOf(socket.id)];
		});
	});
};
