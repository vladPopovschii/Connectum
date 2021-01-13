function addGlobalEventListener(type, selector, callback) {
	document.addEventListener(type, (e) => {
		if (e.target.matches(selector)) callback(e);
	});
	formatLastSeen();
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

function formatLastSeen() {
	const container = document.querySelector(".chat-person-online");
	if (container == null) return;
	const date = new Date(container.innerText).getTime();
	const now = new Date().getTime();
	const interval = (now - date) / 1000;

	let finalDate;

	if (interval < 60) {
		container.innerText = `last seen 1 min ago`;
		return;
	}

	if (interval / 60 < 60) {
		container.innerText = `last seen ${Math.floor(interval / 60)} min ago`;
		return;
	}

	if (interval / 60 / 60 < 24) {
		container.innerText = `last seen ${Math.floor(
			interval / 60 / 60
		)} hour ago`;
		return;
	}

	if (interval / 60 / 60 / 24 < 7) {
		container.innerText = `last seen ${Math.floor(
			interval / 60 / 60 / 24
		)} day ago`;
	}
}
