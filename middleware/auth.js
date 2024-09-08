const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env;

//checks the token to ensure the user is authenticated to access the routes
module.exports = function(req,res,next){
    const token = req.header('x-auth-token')
    //  console.log(token)
    //if there is no token its shows the message
    if (!token || token === 'null') {
        return res.status(401).json({ message: 'No token, authorization denied!' });
    }
    //otherwise it decodes the token and sets the user to the decoded user
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (error) {
        if(error.name === 'TokenExpiredError')
        res.status(401).json({message: 'Token has expired! Please login again'})
    else{
        console.log(token)
        res.status(401).json({message: 'Token is not valid'})
    }}
}