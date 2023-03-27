const router = require('express').Router();
const token = process.env.TOKEN;
const multer = require('multer');
const IMG = require('../../models/images');
const AWS = require('aws-sdk');
const upload = multer({
    storage: multer.memoryStorage(),
});
// If you are using this: 
// Don't pay too much Attention to AWS being un-happy. I'll fix that some day maybe?
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    s3ForcePathStyle: true
});
const s3 = new AWS.S3();


function isAuthorized(req, res, next) {
    console.log(req.headers)
    if (req.headers.authorization === token) {
        console.log(req.body)
        next();
    } else {
        res.status(403).json({
            message: 'Not Authorized',
        });
    }
}

router.get('/', isAuthorized,(req, res) => {
    res.json({
        message: 'Hello World',
    });
});

// upload many images to S3 and save them to the database
router.post('/', isAuthorized, upload.array('images'), async (req, res) => {
    try {
        const uploadedFiles = await Promise.all(
            req.files.map(async (file) => {
                console.log(file)
                const fileName = file.originalname;
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `ai/${fileName}`,
                    Body: file.buffer,
                    ContentType: file.mimetype.split('/')[1],
                };
                const { Location } = await s3.upload(params, { ContentType: file.mimetype }).promise();
                return { src: Location, key: fileName };
            })
        );
        const images = await IMG.insertMany(uploadedFiles);
        res.json(images);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
});


// set image as nsfw
router.put('/images/:id', async (req, res) => {
    const image = await IMG.findByIdAndUpdate(req.params.id, { nsfw: true });
    res.json(image);
});

// Edit image via the frontend
router.patch("/images/:id", isAuthorized, async (req,res) => {
    const image = await IMG.findByIdAndUpdate(req.params.id, req.body);
    if(!image) return res.status(404).send("Image not found");
    const { alt, nsfw } = req.body;
    if(!alt) return res.status(400).send("Alt text is required");
    console.log(req.body)
    image.nsfw = req.body.nsfw || image.nsfw;
    image.alt = req.body.alt || image.alt;
    image.save()
    .then((data) => {
        res.send(data);
    });
});

module.exports = router;