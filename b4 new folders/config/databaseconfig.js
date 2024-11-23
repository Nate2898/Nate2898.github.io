const mongoose = require('mongoose');//allows the use of the mongoose package for mongoDB connection

module.exports = () => {
    mongoose.Promise = global.Promise
    mongoose.connect(process.env.MONGO_URI,{
         useNewUrlParser: true,
         useUnifiedTopology: true
     })
    .then(() => {
         console.log("Successfully connected to the database!");
    })
    //use to catch any errors when connecting to the database
    .catch(err => {
        console.error("Could not connect to the database. Exiting now...", err);
        process.exit();
    });
}