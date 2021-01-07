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
	if (id != null) removeOnlineFriend(id.userId);
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
}

function removeOnlineFriend(id) {
	document
		.querySelector("[data-friends-online]")
		.querySelector(`[value="${id}"]`)
		.parentElement.remove();
}

function checkIfIsFriend(id, user) {
	user.friendsList.forEach((friend) => {
		if (friend.userId === id) {
			const friendOnline = new FriendOnline(user);
			friendOnline.createContainer();
			return;
		}
	});
}
