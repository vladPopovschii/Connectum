document
	.querySelectorAll("[data-send-friend-request-button]")
	.forEach((button) => {
		button.addEventListener("click", function (e) {
			e.preventDefault();
			$.ajax({
				url: "/friends/send-friend-request",
				type: "POST",
				data: {
					senderId: button.parentElement.querySelector(
						"[data-friend-sender]"
					).value,
					receiverId: button.parentElement.querySelector(
						"[data-friend-receiver]"
					).value,
				},
			});
			button.innerHTML = "Request sent";
		});
	});

document.querySelectorAll("[data-accept-request]").forEach((button) => {
	button.addEventListener("click", function (e) {
		e.preventDefault();
		$.ajax({
			url: "/friends/accept-friend",
			type: "POST",
			data: {
				senderId: button.parentElement.querySelector(
					"[data-friend-sender]"
				).value,
				receiverId: button.parentElement.querySelector(
					"[data-friend-receiver]"
				).value,
			},
		});
		button.parentElement.remove();
	});
});

document.querySelectorAll("[data-reject-request]").forEach((button) => {
	button.addEventListener("click", function (e) {
		e.preventDefault();
		$.ajax({
			url: "/friends/reject-friend",
			type: "POST",
			data: {
				senderId: button.parentElement.querySelector(
					"[data-friend-sender]"
				).value,
				receiverId: button.parentElement.querySelector(
					"[data-friend-receiver]"
				).value,
			},
		});
		button.parentElement.remove();
	});
});
