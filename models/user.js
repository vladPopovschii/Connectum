const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lasttName: {
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
        default: 'default.png'
    }
})

module.exports = mongoose.model('User', userSchema)