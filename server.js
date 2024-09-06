//use npm packages 
const express = require('express');//allows the use of the express package
const mongoose = require('mongoose');//allows the use of the mongoose package for mongoDB connection
// const bodyParser = require('body-parser'); //didnt use it used express.json instead
const morgan = require('morgan') //used to log requests to the console for debugging
const cors = require('cors'); //use to allow cross-origin requests
require('dotenv').config() //allows the use of the .env file to hide sensitive information for public use

const handleErrors = require('./middleware/middleware.js');//imports the error handling middleware
const connectDB = require('./config/databaseconfig'); //import the function to connect to the database 
const userAuth = require('./routes/auth.js');//import the user auth routes
const noteRoutes = require('./routes/noteroutes.js'); //note routes location
const authMiddleware = require('./middleware/auth.js');//import the middleware for user authentication


const app = express();//sets the app to use the express package 
const port = process.env.PORT || 3000; //port number for the local server

//connect to mongodb server
connectDB();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());


app.use('/api/notes', noteRoutes); //use the routes
app.use('/api/auth', userAuth); //use the user auth routes

app.use(authMiddleware); //use the auth middleware
app.use(handleErrors); //use to handle errors

//starts the local server
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})