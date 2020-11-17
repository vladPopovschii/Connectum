const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { getUserByEmail, getUserById } = require('../util/utilbd')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (user == null) return done(null, false, { message: 'User with that email does not exist' })
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else return done(null, false, { message: 'Incorrect password' })
        } catch (error) {
            return(error)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser(async (id, done) => done(null, await getUserById(id)))
}

module.exports = initialize