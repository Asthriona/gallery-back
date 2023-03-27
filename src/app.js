const app = require('express')();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// That fucking cors bullshit again. God I hate it when not dealing with damn credentials.  Dude, I just request focking images. piss off. 
// if you come to use this, well... Sorry ahah :) also change this. I'll make a better solution later
app.use(cors({
    origin: ["https://ai.asthriona.com", "http://localhost:8080"],
}));

// Connect to the database
mongoose.connect(process.env.DATABASE_LINK);

// middleware
app.use(express.json());

// Initialize router
app.use('/api', require('./routes/'));

app.get('/', (req, res) => {
    res.json('Hello World');
});

// Start server
app.listen(process.env.APP_PORT, () => {
    console.log('Server started on port 3000');
});