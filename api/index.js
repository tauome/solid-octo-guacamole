const express = require('express');
const app = express(); 
const cors = require('cors'); 
require('dotenv').config();
const { default: mongoose } = require('mongoose');
const User = require('./models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const jwtSecret = 'dfsdf0ejrwerjknsdfsdf';

app.use(express.json())
app.use(cors({
    credentials: true,
    // update when deploying
    origin: 'http://localhost:5173'
})); 

mongoose.connect(process.env.MONGO_URI);

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
                id: userDoc._id
            }, jwtSecret, {}, (err, createdToken) => {
                if (err) throw err; 
                res.cookie('token', createdToken, {secure: false, sameSite: 'none'}).json('pass ok');
            }); 
            
        } else {
            res.status(422).json('pass not ok'); 
        }
    } else {
        res.json('not found'); 
    }
})



app.listen(4000); 

 