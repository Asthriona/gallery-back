const router = require('express').Router();
const IMG = require('../../models/images');

// Get all images from the database
router.get('/', async (req, res) => {
    const images = await IMG.find({});
    // check if image has category "hiden"
    // if it does, remove it from the array
    images.forEach((image, index) => {
        if (image.category === 'hiden') {
            images.splice(index, 1);
        }
    });
    
    res.json(images.reverse());
});

// Get a single image from the database
router.get('/:id', async (req, res) => {
    const image = await IMG.findById(req.params.id);
    if (!image) return res.status(404).send('Image not found');
    res.send(image);
});

module.exports = router;