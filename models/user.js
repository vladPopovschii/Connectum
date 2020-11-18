const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: '\\img\\default.png'
    },
    friendList: {
        type: Array
    }
})

module.exports = mongoose.model('User', userSchema)