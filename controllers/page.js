const User = require("../models/user");

const Branch = require("../models/branch");

const Page = require('../models/page')

const { validationResult } = require("express-validator");

const error_validator = async (errors, msg, statusCode) => {
  const err = new Error(msg);
  err.statusCode = statusCode;
  err.data = errors.array();
  throw err;
};


exports.addPage = async ( req, res, next) => {
    try {

       const pageName = req.body.pageName;
       const branchId = req.body.branchId;

       const branch = await Branch.findById(branchId).populate('pages');

       const page = new Page({
        pageName : pageName,
        branchId : branch
       })

       const pageResult = await page.save();

       branch.pages.push(pageResult);

       const finalBranch = await branch.save();

       const finalBranchResult = await Branch.findById(branchId).populate('pages')

       res.status(200).json({
         pageId : pageResult._id,
         pageName : pageResult.pageName,
         branchId : finalBranch._id,
         branchName : finalBranch.branchName
       })

    }catch (err) {
        if(!err) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addPageData = async ( req, res, next) => {
  try{
    const pageId = req.body.pageId;
    const dataFile = req.body.dataFile

    const page  = await Page.findById(pageId)
    page.pageData = dataFile;

    const pageResult = await page.save();

    res.status(200).json({
      pageId : pageResult._id,
      pageData : pageResult.pageData,
    })
    

  }catch(err) {
    if(!err.statusCode){
      err.statusCode  = 500
    }
    next(err);
  }

}


exports.getPageData = async( req, res, next) => {

  try{
    const pageId  = req.body.pageId;

    const page = await Page.findById(pageId);

    res.status(200).json({
      pageId : page._id,
      pageData : page.pageData
    })
  }catch( err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}
