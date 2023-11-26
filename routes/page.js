const express = require('express');

const router = express.Router();

const { body } = require('express-validator')

const User = require('../models/user');

const branchController = require('../controllers/branch')

const pageController = require('../controllers/page');

const isAuth = require('../middleware/is-auth');

router.post('/add-page',isAuth, pageController.addPage )

module.exports = router;