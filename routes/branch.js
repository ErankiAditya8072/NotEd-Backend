const express = require('express');

const router = express.Router();

const { body } = require('express-validator')

const User = require('../models/user');

const branchController = require('../controllers/branch')

const isAuth = require('../middleware/is-auth');

router.post('/add-new',isAuth, branchController.addBranch )

router.get('/branchNames', isAuth, branchController.getAllBranches);


module.exports = router;