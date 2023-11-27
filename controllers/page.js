const User = require("../models/user");

const Branch = require("../models/branch");

const Page = require('../models/page')

const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId


const { validationResult } = require("express-validator");

const error_validator = async (errors, msg, statusCode) => {
  const err = new Error(msg);
  err.statusCode = statusCode;
  err.data = errors.array();
  throw err;
};

// add new page
exports.addPage = async ( req, res, next) => {
    try {

       const pageName = req.body.pageName;
       const branchId = req.body.branchId;

       const branch = await Branch.findById(branchId)

       const page = new Page({
        pageName : pageName,
        branchId : branch
       })

       const pageResult = await page.save();

       branch.pages.push(pageResult);

       const finalBranch = await branch.save();

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

// add or update page data
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

// retrieve page data
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
      err.message = "page does not exists"
    }
    next(err);
  }

}

// rename page
exports.pageRename = async(req, res, next) => {
  try{
    const pageId = req.body.pageId;
    const pageName = req.body.pageName;
    console.log('page name')

    const page  = await Page.findById(pageId)
    page.pageName = pageName;

    const pageResult = await page.save();

    res.status(200).json({
      pageId : pageResult._id,
      pageData : pageResult.pageData,
    })
    

  }catch(err) {
    if(!err.statusCode){
      err.statusCode  = 500
      err.message = "page Id does not exists or page name not set"
      
    }
    next(err);
  }
}

// delete page and page reference from branch
exports.deletePage = async ( req, res, next) => {

  try {
    const pageId = req.body.pageId;

    const page = await Page.findById(pageId);
 
    const branch = await Branch.findById(page.branchId)
 
    const deletePage = await Page.deleteOne({ _id : page._id});
 
    const finalBranchData = await Branch.updateOne( { _id : branch._id }, { $pull : { pages : page._id}})
 
    res.status(200).json({
           message : "page delete successfully",
           branchdata : finalBranchData
    })
 
    
  }catch(err){
    if(!err.statusCode) {
       err.statusCode = 500;
       err.message = " page deleting error"
    }

    console.log(err);
    next(err);
  }

}


