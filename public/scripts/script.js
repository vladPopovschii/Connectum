function addGlobalEventListener(type, selector, callback) {
	document.addEventListener(type, (e) => {
		if (e.target.matches(selector)) callback(e);
	});
}

function showHide(e) {
	let container;
	if (e.target.matches("[data-hidden-container]")) {
		container = e.target.querySelector("[data-child-hidden-container]");
	} else
		container = e.target.parentElement.querySelector(
			"[data-child-hidden-container]"
		);
	container.classList.toggle("hidden");
	socket.emit("clear-notifications", userid.value);
	document
		.querySelector("[data-notifications]")
		.classList.remove("notification");
}

addGlobalEventListener(
	"click",
	".header-nav-btn, .header-nav-btn img",
	showHide
);
