const mongoose = require('mongoose');//allows the use of the mongoose package for mongoDB connection

module.exports = () => {
    mongoose.Promise = global.Promise

    if (!process.env.MONGO_URI) {
        console.error("Could not connect to the database. Exiting now... MONGO_URI is not set");
        process.exit(1);
    }

    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
         console.log("Successfully connected to the database!");
    })
    //use to catch any errors when connecting to the database
    .catch(err => {
        console.error("Could not connect to the database. Exiting now...", err);
        process.exit(1);
    });
}