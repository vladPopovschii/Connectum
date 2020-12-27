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

function addFriendRequest(user) {
	const friendRequest = new FriendRequest(user, userid);
	friendRequest.createContainer();
}
