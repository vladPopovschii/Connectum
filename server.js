if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
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

app.use('/login', checkNotAuthenticated, loginRouter)
app.use('/register', checkNotAuthenticated, registerRouter)

app.get('/', checkAuthenticated, (req, res) => {
    res.render("index")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))