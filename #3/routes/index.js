const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./pages/index');
})

router.get('/login', (req, res) => {
    res.render('./pages/login');
})

router.get('/admin', (req, res) => {
    res.render('./pages/admin');
})

module.exports = router;