const multer = require("multer");

const postStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/img/posts");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const fileMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const fileFilter = (req, file, cb) => {
	if (fileMimeTypes.includes(file.mimetype)) return cb(null, true);
	cb(null, false);
};

const postUpload = multer({
	storage: postStorage,
	limits: {
		fileSize: 1024 * 1024 * 4,
	},
	fileFilter: fileFilter,
});

module.exports = { postUpload };
