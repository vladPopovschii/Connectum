const friendId = document.querySelector("#friendid").value;
const btn = document.querySelector("[data-send-message-btn]");
const inputContainer = document.querySelector("[data-send-message-container]");
const typingContainer = document.querySelector("[data-is-typing]");
const chatContainer = document.querySelector("[data-chat-container]");
const roomId = document.getElementById("roomId").value;

chatContainer.scrollTo(0, chatContainer.scrollHeight);

btn.addEventListener("click", sendMessage);
document.addEventListener("keyup", function (e) {
	if (e.key === "Enter") btn.click();
});

socket.on("receive-message", (msg) => {
	const msgContainer = new Message(msg, Date.now(), true);
	msgContainer.createContainer();
});

function sendMessage() {
	const msg = inputContainer.value;
	if (msg === "") return;
	inputContainer.value = "";
	socket.emit("send-message", friendId, userid.value, msg, roomId);
	socket.emit("is-not-typing", friendId);
	const msgContainer = new Message(msg, Date.now());
	msgContainer.createContainer();

	chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

inputContainer.addEventListener("input", function (e) {
	if (inputContainer.value === "") {
		socket.emit("is-not-typing", friendId);
		return;
	}
	socket.emit("is-typing", friendId);
});

socket.on("user-is-typing", function () {
	typingContainer.classList.remove("hidden");
});

socket.on("user-is-not-typing", function () {
	typingContainer.classList.add("hidden");
});
