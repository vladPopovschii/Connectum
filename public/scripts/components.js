class FriendRequest {
	constructor(user, id) {
		(this.senderId = user._id),
			(this.receiverId = id.value),
			(this.profileImage = user.profileImage),
			(this.firstName = user.firstName),
			(this.lastName = user.lastName),
			(this.requestDate = new Date());
	}

	createContainer() {
		const html = `
            <div class="friend-request">
                <input type="hidden" name="receiverId" value="${
					this.receiverId
				}" data-friend-receiver>
                <input type="hidden" name="senderId" value="${
					this.senderId
				}" data-friend-sender>
                    <div class="friend-request-info">
                        <div class="friend-request-image-container">
                            <img src="${this.profileImage}" alt="">
                        </div>
                        <div class="friend-request-data">
                            <div>${this.firstName}</div>
                            <div>${this.lastName}</div>
                            <div class="friend-request-date">${new Date()
								.toString()
								.split(" ")
								.slice(0, 4)
								.join(" ")}</div>
                        </div>
                    </div>
                    <div class="friend-request-buttons">
                        <button class="btn-add-friend hover-effect" data-accept-request>Accept</button>
                        <button class="btn-add-friend hover-effect" data-reject-request>Reject</button>
                    </div>
                </div>
        `;
		document
			.querySelector(".friend-requests")
			.insertAdjacentHTML("afterbegin", html);
	}
}
