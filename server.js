if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const initializePassport = require("./configs/passport-config");
initializePassport(passport);

mongoose.connect(process.env.DATABASE_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

const usersConnected = [];
require("./configs/socket/friends")(io, usersConnected);

const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const profileRouter = require("./routes/profile");
const friendsRouter = require("./routes/friends");

const {
	checkAuthenticated,
	checkNotAuthenticated,
} = require("./middleware/passport");
const friendsRequestMiddleware = require("./middleware/friendsRequest");
const { use } = require("passport");

app.use("/login", checkNotAuthenticated, loginRouter);
app.use("/register", checkNotAuthenticated, registerRouter);
app.use(
	"/profile",
	checkAuthenticated,
	friendsRequestMiddleware,
	profileRouter
);
app.use(
	"/friends",
	checkAuthenticated,
	friendsRequestMiddleware,
	friendsRouter
);

app.get("/", checkAuthenticated, friendsRequestMiddleware, (req, res) => {
	res.render("index", { user: req.user });
});

app.delete("/logout", (req, res) => {
	req.logOut();
	res.redirect("login");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
