const { getUsersPosts } = require("./../util/utilbd");

async function getPosts(req, res, next) {
	const posts = await getUsersPosts(req.user.id);
	req.posts = posts;
	next();
}

module.exports = getPosts;
