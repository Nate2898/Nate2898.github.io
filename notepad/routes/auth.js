const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = process.env;

const router = express.Router()

router.post('/register', async (req,res)=>{
    // console.log(req.body)
    //gets the parameters from the request body
    const {username, email, password} = req.body
    try {
        if(username.length > 13 || username.length < 3){
            return res.status(400).json({success: false, message: 'Username must be between 3 and 12 characters' })
        }
        //checks if the user already exists with the email
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json({success: false, message: 'User already exists' })
        }
        //otherwise its creates a new user with the properties
        user = new User({
            username,
            email,
            password
        })
        //uses bcrypt to hash the password 10 times 
        const salt = await bcrypt.genSalt(10) //more salt makes it more secure
        user.password = await bcrypt.hash(password, salt) //makes the hashed password the new password for the user

        await user.save() //saves the user to the database

        //creates a payload with the user id used to create a token
        const payload = { user: {id: user.id}}
        //signs the token with the payload and the JWT_SECRET
        jwt.sign(payload, JWT_SECRET, {expiresIn: 36000}, (err, token) =>{  //360000 was not milliseconds❌the token will expire in 6 minutes 
            if(err) throw err
            res.json({token})
        })
    } catch (err) {
        res.status(500).json({success: false, message: 'Internal server error'}) 
    }
})

router.post('/login', async (req,res)=>{
    // console.log(req.body)
    //gets the parameters from the request body
    const {email,password} = req.body
    try {
        //tries to find a user by the email
        let user = await User.findOne({email})
        //if the user does not exist returns an error
        if(!user){
            return res.status(400).json({success: false, message: 'Invalid Email' })
        }
        //compares the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password)
        //if the password does not match returns an error
        if(!isMatch){
            return res.status(400).json({success: false, message: 'Invalid Password' })
        }
        //otherwise it creates a payload with the user id used to create a token
        const payload = { user: { id: user.id, username: user.username, email: user.email } };

        jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
            if (err) throw err;
            console.log('User logged in:', user.email);
            res.json({ token, username: user.username, email: user.email });
        })
    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error' 
           });
    }
})

router.post('/change-password', async (req, res) => {
    const { email, oldPW, newPW } = req.body;
    try {
        console.log('Finding user by email:', email);
        let user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        console.log('Comparing passwords');
        const isMatch = await bcrypt.compare(oldPW, user.password);
        
        if (!isMatch) {
            console.log('Invalid Password');
            return res.status(400).json({ success: false, message: 'Invalid Password' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPW, salt);
        await user.save();
        
        res.json({ message: 'Password Changed Successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/change-username', async (req, res) => {
    const { email, password, newUsername } = req.body;
    try {
        if (newUsername.length > 20 || newUsername.length < 3) {
            return res.status(400).json({ success: false, message: 'Username must be between 3 and 20 characters' });
        }
        console.log('Finding user by email:', email);
        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        console.log('Comparing passwords');
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Invalid Password');
            return res.status(400).json({ success: false, message: 'Invalid Password' });
        }

        user.username = newUsername;
        await user.save();

        res.json({ message: 'Username Changed Successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router