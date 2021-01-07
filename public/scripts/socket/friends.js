window.onload = function (e) {
	var userid = document.querySelector("#userid").value;
	socket.emit("userid", userid);
};

socket.on("update-requests", (user) => {
	addFriendRequest(user);
});

socket.on("notify", () => {
	document
		.querySelector("[data-notifications]")
		.classList.add("notification");
});

socket.on("users-online", (onlineUsers) => {
	friendsFilter(userid.value, onlineUsers);
});

socket.on("online", (user) => {
	addOnlineFriend(userid.value, user);
});

socket.on("offline", (id) => {
	if (id != null) {
		removeOnlineFriend(id.userId);

		const container = document.querySelector(".chat-person-online");
		const friendId = document.querySelector("#friendid");
		if (friendId != null && friendId.value === id.userId)
			container.innerText = "last seen 1 min ago";
	}
});

function addFriendRequest(user) {
	const friendRequest = new FriendRequest(user, userid);
	friendRequest.createContainer();
}

function friendsFilter(id, users) {
	users.forEach((user) => {
		checkIfIsFriend(id, user);
	});
}

function addOnlineFriend(id, user) {
	checkIfIsFriend(id, user);
	addOnlineInChat();
}

function removeOnlineFriend(id) {
	document
		.querySelector("[data-friends-online]")
		.querySelector(`[value="${id}"]`)
		.parentElement.remove();
}

function checkIfIsFriend(id, user) {
	const friendId = document.querySelector("#friendid");
	user.friendsList.forEach((friend) => {
		if (friend.userId === id) {
			const friendOnline = new FriendOnline(user);
			friendOnline.createContainer();

			if (friendId != null && friendId.value === user._id)
				addOnlineInChat();
			return;
		}
	});
}

function addOnlineInChat() {
	const container = document.querySelector(".chat-person-online");
	if (container == null) return;
	container.innerText = "Online";
}
