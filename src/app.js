const app = require('express')();
const IMG = require('./models/images');
const AWS = require('aws-sdk');
const multer = require('multer');
const cors = require('cors');
const upload = multer({
    storage: multer.memoryStorage(),
});
const mongoose = require('mongoose');
require('dotenv').config();

// That fucking cors bullshit again. God I hate it when not dealing with damn credentials.  Dude, I just request focking images. piss off. 
app.use(cors({
    origin: ['http://localhost:3000', "https://ai.asthriona.com", "http://localhost:8080"],
}));

// Connect to the database
mongoose.connect(process.env.DATABASE_LINK);


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    s3ForcePathStyle: true
});

const s3 = new AWS.S3();

app.get('/', (req, res) => {
    res.json('Hello World');
});

// Get all images from the database
app.get('/images', async (req, res) => {
    const images = await IMG.find({});
    res.json(images);
});

// Get a single image from the database
app.get('/images/:id', (req, res) => {
    const image = IMG.findById(req.params.id);
    res.send(image);
});

// upload many images to S3 and save them to the database
app.post('/images', upload.array('images'), async (req, res) => {
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
app.put('/images/:id', async (req, res) => {
    const image = await IMG.findByIdAndUpdate(req.params.id, { nsfw: true });
    res.json(image);
});

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});