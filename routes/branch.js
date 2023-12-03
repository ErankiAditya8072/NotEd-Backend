const express = require('express');

const router = express.Router();

const { body } = require('express-validator')

const User = require('../models/user');

const branchController = require('../controllers/branch')

const isAuth = require('../middleware/is-auth');
const branch = require('../models/branch');

router.post('/add-new',isAuth, branchController.addBranch )

router.get('/branchNames', isAuth, branchController.getAllBranches);

router.delete('/delete-branch/:branchId',isAuth, branchController.deleteBranch);

router.put('/branch-rename', isAuth, branchController.branchRename);

module.exports = router;