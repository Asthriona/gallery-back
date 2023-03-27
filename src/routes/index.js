const router = require('express').Router();

const imgs = require('./v1/images');
const admin = require('./v1/admin');

router.use('/images', imgs);
router.use('/admin', admin);
// 
router.all('/', (req, res) => {
    res.json({
        message: 'wrong. Nothing to see here. Move along.',});
});

module.exports = router;