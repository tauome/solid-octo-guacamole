const express = require('express');
const app = express(); 
const cors = require('cors'); 
require('dotenv').config();
const { default: mongoose } = require('mongoose');
const User = require('./models/User'); 
const Place = require('./models/Place'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const jwtSecret = 'dfsdf0ejrwerjknsdfsdf';
const CookieParser = require('cookie-parser'); 
const multer = require('multer'); 
const fs = require('fs'); 
const {S3Client} = require('@aws-sdk/client-s3'); 
const download = require('image-downloader'); 


app.use(express.json())
app.use(CookieParser()); 
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({
    credentials: true,
    // update when deploying
    origin: 'http://localhost:5173'
})); 

async function connectDb () {
    await mongoose.connect(process.env.MONGO_URI);
};
connectDb(); 


app.get('/test', (req, res) => {
    res.json('test ok')
});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body; 
    try {
        const userDoc = await User.create({
            name,
            email, 
            password: bcrypt.hashSync(password, 10)
        })
        res.json({userDoc});  
    } catch (e){
        res.status(422).json(e); 
    }
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body; 
    const userDoc = await User.findOne({email: email});
    if (userDoc) {
        const passok =  bcrypt.compareSync(password, userDoc.password); 
        if (passok) {
            jwt.sign({
                email: userDoc.email,
                id: userDoc._id,
            }, jwtSecret, {}, (err, createdToken) => {
                if (err) throw err; 
                res.cookie('token', createdToken, {secure: true, sameSite: 'none'}).json(userDoc);
            }); 
            
        } else {
            res.status(422).json('pass not ok'); 
        }
    } else {
        res.json('not found'); 
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies; 
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user)=> {
            if (err) throw err;
            const {name, email, _id} = await User.findById(user.id);
            res.json({name, email, _id}); 
        })
    } else {
        res.json(null)
    }
}); 


app.post('/logout', (req, res) => {
    res.clearCookie('token', ).json(true); 
})

const client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});

app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body;
    const newName = 'photo'+ Date.now() + '.jpg';
    await download.image({
        url: link,
        dest: __dirname + '/uploads/' + newName
    }); 
    res.json(newName); 
})

const photosMiddlware =  multer({dest: 'uploads/'})
app.post('/upload', photosMiddlware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];

    for (const file of req.files){
        const {path, originalname} = file; 
        const parts = originalname.split('.');
        const ext =  parts[parts.length-1]; 
        const newPath = path + '.' + ext; 
        fs.renameSync(path, newPath); 
        uploadedFiles.push(newPath.replace('uploads/', '')); 
    }
    res.json(uploadedFiles); 
});

app.post('/place', async (req, res) => {
    const {title, address, photos, description, perks, checkIn, checkOut, maxGuests } = req.body; 
    const {token} = req.cookies; 
    jwt.verify(token, jwtSecret, {}, async (err, user)=> {
        const placeDoc = await Place.create({
        owner: user.id, 
        title,
        location: address,
        photos,
        description,
        perks,
        checkIn,
        checkOut,
        maxGuests
        });
        res.status(200).json(placeDoc); 
    }); 
});

app.get('places', async (req, res) => {
    
})


app.listen(4000); 

 