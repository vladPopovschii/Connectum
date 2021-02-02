const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
const { upload } = require("../util/imageUpload");

router.get("/", (req, res) => {
	res.render("register");
});

router.post("/", upload.single("profile_image"), async (req, res) => {
	const firstName = req.body.fname;
	const lastName = req.body.lname;
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirm_password;
	const gender = req.body.gender;
	const date = req.body.date;

	const errorMessages = { aux: "text" };

	if (password.length < 8)
		errorMessages.password = "Password must be at least 8 characters";
	if (password !== confirmPassword)
		errorMessages.confirmPassword = "Passwords must match";
	if ((await User.exists({ email: email })) === true)
		errorMessages.email = "This email is already registered";

	if (Object.keys(errorMessages).length > 1)
		return res.render("register", {
			firstName,
			lastName,
			email,
			gender,
			date,
			errorMessages,
		});

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const imagePath =
			req.file != undefined
				? req.file.path.slice(6)
				: "\\img\\default.png";

		const user = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			gender,
			birthDate: date,
			profileImage: imagePath,
		}).save();
	} catch (e) {
		console.log(e);
		return res.redirect("/register");
	}

	res.redirect("/");
});

module.exports = router;
