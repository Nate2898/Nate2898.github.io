//Error handling middleware for the application

const ERROR_LEVEL = process.env.ERROR_LEVEL;

function handleError(err, req, res, next) {
    if (err.status === 200) {
        res.status(200).json({ success: true, message: 'OK' });
        //error code 400 handling
    } else if(err.status === 400 && ERROR_LEVEL === "development") {
        res.status(400).json({ 
            success: false,
            message: err.message,
            stack: err.stack 
        });
        console.log(err.message, err.stack);
    } else if(err.status === 400) {
        console.log(err.message);
        res.status(400).json({ 
            success: false,
            message: err.message
        });
         //error code 401 handling
    } else if(err.status === 401 && ERROR_LEVEL === "development") {
        res.status(401).json({ 
            success: false,
            message: err.message,
            stack: err.stack 
        });
        console.log(err.message, err.stack);
    } else if(err.status === 401) {
        console.log(err.message);
        res.status(401).json({ 
            success: false,
            message: err.message
        });
        //404 error code handling
    } else if (err.status === 404 && ERROR_LEVEL === "development") {
        res.status(404).json({ 
            success: false,
            message: err.message, 
            stack: err.stack 
        });
        console.log(err.message, err.stack);
    } else if (err.status === 404) {
        console.log(err.message);
        res.status(404).json({ 
            success: false,
            message: err.message
        });
        //500 error code handling
    } else if (err.status === 500) {
        res.status(500).json({
             success: false, message: 'Internal server error' 
            });
    } else {
        next(err);
    }
}

module.exports = handleError;
