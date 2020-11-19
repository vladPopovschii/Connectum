const User = require('../models/user')

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email }).exec()
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

async function getUserById(id) {
    try {
        const user = await User.findById(id).exec()
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

async function searchByName(name) {
    try {
        const users = await User.find({
             '$or': [
                 { firstName: {'$regex': name, '$options': 'i'}},
                { lastName: {'$regex': name, '$options': 'i'}}]
            })
        return users
    } catch (error) {
        console.error(error)
        return null
    }
}

async function getAndUpdate(id, data) {
    try {
        await User.findByIdAndUpdate(id, {
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            gender: data.gender,
            info: data.info,
            profileImage: data.profileImage
        })
    } catch (error) {
        console.log(error) 
        return null
    }
}

module.exports = { getUserByEmail, getUserById, searchByName, getAndUpdate }