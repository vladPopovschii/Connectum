if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
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
		store: new MongoStore({ mongooseConnection: db }),
	})
);
app.use(passport.initialize());
app.use(passport.session());

require("./configs/socket")(io);

const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const profileRouter = require("./routes/profile");
const friendsRouter = require("./routes/friends");
const messagesRouter = require("./routes/messages");
const postsRouter = require("./routes/posts");

const {
	checkAuthenticated,
	checkNotAuthenticated,
} = require("./middleware/passport");
const friendsRequestMiddleware = require("./middleware/friendsRequest");

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
app.use(
	"/messages",
	checkAuthenticated,
	friendsRequestMiddleware,
	messagesRouter
);

app.use("/posts", checkAuthenticated, friendsRequestMiddleware, postsRouter);

const getPostsMiddleware = require("./middleware/getPosts");
app.get(
	"/",
	checkAuthenticated,
	friendsRequestMiddleware,
	getPostsMiddleware,
	(req, res) => {
		console.log(req.posts);
		res.render("index", { user: req.user, posts: req.posts });
	}
);

app.delete("/logout", (req, res) => {
	req.logOut();
	res.redirect("login");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
