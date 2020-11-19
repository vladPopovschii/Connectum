const express = require('express')
const { searchByName } = require('../util/utilbd')
const router = express.Router()

router.search('/search', async (req, res) => {
    const users = (await searchByName(req.body.friends)).filter(user => user.id !== req.user.id)
    res.render('./friends/find-friends', { users: users, searchField: req.body.friends})
})

module.exports = router

