if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false, limit: '5mb' }))
app.use(express.static('public'))

const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')

app.use('/login', loginRouter)
app.use('/register', registerRouter)

app.get('/', (req, res) => {
    res.render("index")
})


app.listen(3000 || process.env.PORT, () => console.log(`Server running on port ${process.env.PORT || 3000}`))