const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render("login")
})

router.post('/', (req, res) => {
    res.redirect('/')
})

module.exports = router