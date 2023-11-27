const User = require('../models/user');

const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const json_web_token = require('jsonwebtoken');

const error_validator = async( errors, msg, statusCode) => {

    const err = new Error(msg);
    err.statusCode = statusCode;
    err.data = errors.array();
    throw err;

}

exports.signup = async( req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) 
    {
        try {
            await error_validator(errors, " Validation Failed", 422);
        } catch ( err ) {
           return next(err);
        }
       
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email : email,
            password : hashedPassword,
            firstName : firstName,
            lastName : lastName
        });

        const userResult = await user.save();

        res.status(201).json({

            message : "User Created Successfully",
            userId : userResult._id,
            statusCode : 201
        })
    } catch( err) {

        if(!err.statusCode) 
        {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.loggedIn = async( req, res, next) => {

    res.status(200).json({
        authenticated : true,
        reason : 'successfully validated',
        statusCode : 200
    })

}

exports.login = async( req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    try {
        const user = await User.findOne( { email : email});

        if(!user) {

            const err = new Error('This Email-id does not exists');
            err.statusCode = 401 // not authenticated
            throw err;
        }

        loadedUser = user;

        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual) {
            const err = new Error('Incorrect Password');
            err.statusCode = 401;
            throw err;
        }

        //generate a JWT

        const token = json_web_token.sign( {
            email : loadedUser.email,
            userId : loadedUser._id.toString()
            },
            "DawinderAditya",
        )

        res.status(200).json(
            {
                token : token,
                userId: loadedUser._id.toString(),
                email : loadedUser.email,
                firstName : loadedUser.firstName,
                lastName : loadedUser.lastName,
                statusCode : 200
            }
        );
    }catch( err ) {
        if( !err.statusCode) 
        {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.newPassword = async( req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    let resetUser ;
    
    try {

        const user = await User.findOne( { email : email})
        if(!user) 
        {
            const err = new Error('This Email-id does not exists');
            err.statusCode = 401 // not authenticated
            throw err; 
        }

        resetUser = user;

        const hashedPassword = await bcrypt.hash(password, 12);

        resetUser.password = hashedPassword;

        const userResult = await resetUser.save();

        res.status(201).json( {
            message : 'User password updated Successfully',
            userId : userResult._id,
            statusCode : 201
        });

    } catch ( err ) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    }

}