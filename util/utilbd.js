const User = require("../models/user");

async function getUserByEmail(email) {
	try {
		const user = await User.findOne({ email: email }).exec();
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function getUserById(id) {
	try {
		const user = await User.findById(id).exec();
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function searchByName(name) {
	try {
		const users = await User.find({
			$or: [
				{ firstName: { $regex: name, $options: "i" } },
				{ lastName: { $regex: name, $options: "i" } },
			],
		});
		return users;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function getAndUpdate(id, data) {
	try {
		await User.findByIdAndUpdate(id, {
			firstName: data.firstName,
			lastName: data.lastName,
			birthDate: data.birthDate,
			gender: data.gender,
			info: data.info,
			profileImage: data.profileImage,
		});
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function getFriends(id) {
	try {
		const friends = (await User.findById(id).exec()).friendsList;
		return friends;
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function sendFriendRequest(senderId, receiverId) {
	try {
		const requests = (await User.findById(receiverId).exec()).friendRequest;
		if (requests.find((request) => (request.userId = senderId)) != null) {
			console.log("Request had been already sent!");
			return;
		}
		User.findByIdAndUpdate(senderId, {
			$push: {
				sentRequest: {
					userId: receiverId,
				},
			},
		}).exec();
		User.findByIdAndUpdate(receiverId, {
			$push: {
				friendRequest: {
					userId: senderId,
				},
			},
		}).exec();
	} catch (error) {
		console.log(error);
	}
}

async function acceptRequest(senderId, receiverId) {
	try {
		User.findByIdAndUpdate(senderId, {
			$push: {
				friendsList: {
					userId: receiverId,
				},
			},
			$pull: {
				sentRequest: {
					userId: receiverId,
				},
			},
		});
		User.findByIdAndUpdate(receiverId, {
			$push: {
				friendsList: {
					userId: senderId,
				},
			},
			$pull: {
				sentRequest: {
					userId: senderId,
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
}

async function rejectRequest(senderId, receiverId) {
	try {
		User.findByIdAndUpdate(senderId, {
			$pull: {
				sentRequest: {
					$regex: {
						userId: receiverId,
					},
				},
			},
		});
		User.findByIdAndUpdate(receiverId, {
			$pull: {
				sentRequest: {
					$regex: {
						userId: senderId,
					},
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getUserByEmail,
	getUserById,
	searchByName,
	getAndUpdate,
	getFriends,
	sendFriendRequest,
	acceptRequest,
	rejectRequest,
};
