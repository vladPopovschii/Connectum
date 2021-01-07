const express = require("express");
const router = express.Router();
const upload = require("../util/imageUpload");
const { getAndUpdate } = require("../util/utilbd");

router.get("/", (req, res) => {
	res.render("profile/profile", { user: req.user });
});

router.get("/edit", (req, res) => {
	res.render("profile/edit", { user: req.user });
});

router.put("/edit", upload.single("profile_image"), async (req, res) => {
	const data = {};
	data.firstName = req.body.fname;
	data.lastName = req.body.lname;
	data.birthDate = req.body.date;
	data.gender = req.body.gender;
	data.info = req.body.info;
	data.profileImage =
		req.file != undefined ? req.file.path.slice(6) : "\\img\\default.png";

	await getAndUpdate(req.user.id, data);
	res.redirect("/profile");
});

module.exports = router;
