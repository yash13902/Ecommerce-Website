const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) =>{
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error!";

    //Wrong ids

    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //wrong duplicate key error
    if(err.code == 11000){
        const message = `Duplicate Email: ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //wrong jwt token
    if(err.name === "JsonWebTokenError"){
        const message = `JsonWebToken is invalid, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    //jwt expire error
    if(err.name === "TokenExpiredError"){
        const message = `JsonWebToken is Expired, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success : false,
        message: err.message

    });
};