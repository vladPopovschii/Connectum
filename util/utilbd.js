const User = require("../models/user");
const Room = require("../models/room");
const Post = require("../models/post");

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
		const friendsId = (await User.findById(id).exec()).friendsList;
		const ids = [];
		friendsId.forEach((friendId) => {
			ids.push(friendId.userId);
		});
		const friends = await User.find({
			_id: {
				$in: ids,
			},
		});
		return friends;
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function checkIfRequestSended(senderId, receiverId) {
	const requests = (await User.findById(receiverId).exec()).friendRequest;
	if (requests.find((request) => (request.userId = senderId)) != null) {
		console.log("Request had been already sent!");
		return true;
	}
	return false;
}

async function sendFriendRequest(senderId, receiverId) {
	try {
		if (await checkIfRequestSended(senderId, receiverId)) return;
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
			$inc: {
				notifications: 1,
			},
		}).exec();
	} catch (error) {
		console.log(error);
	}
}

async function acceptRequest(senderId, receiverId) {
	try {
		await User.findByIdAndUpdate(senderId, {
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
		await User.findByIdAndUpdate(receiverId, {
			$push: {
				friendsList: {
					userId: senderId,
				},
			},
			$pull: {
				friendRequest: {
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
		await User.findByIdAndUpdate(senderId, {
			$pull: {
				sentRequest: {
					userId: receiverId,
				},
			},
		});
		await User.findByIdAndUpdate(receiverId, {
			$pull: {
				friendRequest: {
					userId: senderId,
				},
			},
		});
	} catch (error) {
		console.log(error);
	}
}

async function getFriendRequests(receiverId) {
	const requests = (await User.findById(receiverId).exec()).friendRequest;
	let friendRequests = [];
	for (const request of requests) {
		const friend = await User.findById(request.userId);
		friend.requestDate = request.requestDate;
		friendRequests.push(friend);
	}
	return friendRequests;
}

async function clearNotifications(id) {
	try {
		await User.findByIdAndUpdate(id, {
			notifications: 0,
		});
	} catch (error) {
		console.log(error);
	}
}

async function getUsersById(ids) {
	try {
		const users = await User.find({
			_id: { $in: ids },
		});
		return users;
	} catch (error) {
		console.log(error);
	}
}

async function updateLastSeen(id) {
	try {
		await User.findByIdAndUpdate(id, {
			lastSeen: Date.now(),
		});
	} catch (error) {
		console.error(error);
	}
}

async function createRoom(id1, id2) {
	try {
		const room = await new Room({
			members: [id1, id2],
			messages: [
				{
					body: "Say Hi",
					time: new Date(),
				},
			],
		}).save();
		return room.id;
	} catch (error) {
		console.error(error);
	}
}

async function checkRoom(id1, id2) {
	try {
		const room = await Room.findOne({
			$or: [{ members: [id1, id2] }, { members: [id2, id1] }],
		});
		return room != null ? room.id : false;
	} catch (error) {
		console.error(error);
	}
}

async function insertMessageInRoom(roomId, senderId, msg) {
	try {
		await Room.findByIdAndUpdate(roomId, {
			$push: {
				messages: {
					from: senderId,
					body: msg,
					time: new Date(),
				},
			},
		});
	} catch (error) {
		console.error(error);
	}
}

async function getMessagesFromRoom(roomId) {
	try {
		const room = await Room.findById(roomId);
		if (room != null) return room.messages;
	} catch (error) {
		console.error(error);
	}
}

async function getLastMessageFromRoom(roomId) {
	const messages = await getMessagesFromRoom(roomId);
	return messages[messages.length - 1];
}

async function getFriendsWithLastMessage(id) {
	const friends = await getFriends(id);
	for (const friend of friends) {
		try {
			const room = await Room.findOne({
				$or: [
					{ members: [id, friend.id] },
					{ members: [friend.id, id] },
				],
			});
			friend.lastMessage =
				(await getLastMessageFromRoom(room.id)) || "Say hi!";
		} catch (error) {
			console.error(error);
		}
	}
	friends.sort(function (a, b) {
		return a.lastMessage.time < b.lastMessage.time ? 1 : -1;
	});
	return friends;
}

async function getUsersPosts(id) {
	try {
		let friendsIds = await User.findById(id);
		friendsIds = friendsIds.friendsList.map((friend) => friend.userId);
		friendsIds.push(id);
		const posts = await Post.find({
			ownerId: {
				$in: friendsIds,
			},
		});
		return posts;
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	getUserByEmail,
	getUserById,
	getUsersById,
	searchByName,
	getAndUpdate,
	getFriends,
	sendFriendRequest,
	acceptRequest,
	rejectRequest,
	getFriendRequests,
	checkIfRequestSended,
	clearNotifications,
	updateLastSeen,
	createRoom,
	checkRoom,
	insertMessageInRoom,
	getMessagesFromRoom,
	getFriendsWithLastMessage,
	getUsersPosts,
};
