const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const router = express.Router()

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/profile-img')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const fileFilter = (req, file, cb) => {
    if (fileMimeTypes.includes(file.mimetype))
        return cb(null, true)
    cb(null, false)
}

const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 4  
    },
    fileFilter: fileFilter
})

router.get('/', (req, res) => {
    res.render("register")
})

router.post('/', upload.single('profile_image'), (req, res) => {
    const firstName = req.body.fname
    const lastName = req.body.lname
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirm_password
    const gender = req.body.gender
    const date = req.body.date

    const errorMessages = []

    if (password.length < 8) errorMessages.push('Password must be at least 8 characters')
    if (password !== confirmPassword) errorMessages.push('Passwords must match')

    // if (errorMessages.length > 0) return res.redirect('/', )

    
    res.redirect('/')
})

module.exports = router