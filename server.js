if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const app = express()

const initializePassport = require('./configs/passport-config')
const { checkAuthenticated, checkNotAuthenticated } = require('./util/passport')
initializePassport(passport)

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const profileRouter = require('./routes/profile')
const friendsRouter = require('./routes/friends')

app.use('/login', checkNotAuthenticated, loginRouter)
app.use('/register', checkNotAuthenticated, registerRouter)
app.use('/profile', checkAuthenticated, profileRouter)
app.use('/friends', checkAuthenticated, friendsRouter)

app.get('/', checkAuthenticated, (req, res) => {
    res.render("index")
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('login')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))