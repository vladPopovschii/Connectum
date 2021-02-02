socket.on("update-last-message", (msg) => {
	const messageContainer = document.querySelector("[data-last-message]");
	const timeContainer = document.querySelector("[data-last-message-time]");

	if (messageContainer == null) return;

	messageContainer.innerText = msg;
	timeContainer.innerText = new Date().toTimeString().substr(0, 5);
});
