function sendRequest(e) {
	e.preventDefault();
	const senderId = e.target.parentElement.parentElement.querySelector(
		"[data-friend-sender]"
	).value;
	const receiverId = e.target.parentElement.parentElement.querySelector(
		"[data-friend-receiver]"
	).value;
	$.ajax({
		url: "/friends/send-friend-request",
		type: "POST",
		data: {
			senderId: senderId,
			receiverId: receiverId,
		},
	});
	e.target.innerHTML = "Request sent";
	socket.emit("friend-request-sent", receiverId, senderId);
}

addGlobalEventListener(
	"click",
	"[data-send-friend-request-button]",
	sendRequest
);

function acceptRequest(e) {
	e.preventDefault();
	$.ajax({
		url: "/friends/accept-friend",
		type: "POST",
		data: {
			senderId: e.target.parentElement.parentElement.querySelector(
				"[data-friend-sender]"
			).value,
			receiverId: e.target.parentElement.parentElement.querySelector(
				"[data-friend-receiver]"
			).value,
		},
	});
	e.target.parentElement.parentElement.remove();
}

addGlobalEventListener("click", "[data-accept-request]", acceptRequest);

function rejectRequest(e) {
	e.preventDefault();
	$.ajax({
		url: "/friends/reject-friend",
		type: "POST",
		data: {
			senderId: e.target.parentElement.parentElement.querySelector(
				"[data-friend-sender]"
			).value,
			receiverId: e.target.parentElement.parentElement.querySelector(
				"[data-friend-receiver]"
			).value,
		},
	});
	e.target.parentElement.parentElement.remove();
}

addGlobalEventListener("click", "[data-reject-request]", rejectRequest);
