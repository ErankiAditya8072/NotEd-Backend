const express = require('express');

const router = express.Router();

const { body } = require('express-validator')

const User = require('../models/user');

const authController = require('../controllers/auth');

const isAlreadyAuth = require('../middleware/is-already-auth')

router.post('/signup', [

    body('email')
    .trim()
    .isEmail()
    .withMessage('Please Enter a valid Email')
    .custom(( value , { req }) => {
        return User.findOne({email : value}).then( userDoc => {
            if(userDoc) {
                return Promise.reject('Email-Id already Exists');
            }
        })
    })
    .normalizeEmail(),
    body('password').trim().isLength({min : 5}),
    body('userName').trim().isLength({ min : 5})
], authController.signup)

router.get('/loggedin', isAlreadyAuth, authController.loggedIn)

router.post('/login', authController.login);

router.post('/password-reset',authController.newPassword)

module.exports = router;

