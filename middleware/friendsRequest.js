const { getFriendRequests } = require("../util/utilbd");

module.exports = async (req, res, next) => {
	req.user.friendsRequests = await getFriendRequests(req.user.id);
	next();
};
