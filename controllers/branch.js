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

exports.addBranch = async (req, res, next) => {
  const path = req.body.path;
  const userId = req.userId;

  try {
    const branches = path.split("/");

    const user = await User.findById(userId);

    const branch = new Branch({
      userId: user,
      branchName: branches[branches.length - 1],
    });

    const branchResult = await branch.save();


    // only for top level folders
    if (branches.length == 1) {

      user.branches.push(branchResult);
      const userResult = await user.save();
      const userBranches = await User.findById(userId).populate("branches");
      return res.status(200).json({
         branchId : branchResult._id,
         branchName : branchResult.branchName
      });
    }
  
     //after top level folders

    let i = 0;

    //top level folders
    let tempResult = await User.findById(userId).populate("branches");

    // top level child array
    let temp = tempResult.branches;

    // temp id variable for later use 
    let branchId;

    // second level to bottom - 1 level traversal
    while (i < branches.length-1) {
    
        for(let sub of temp) 
        {
            if(sub.branchName === branches[i])
            {
                branchId = sub._id;
                let res = await Branch.findById(branchId).populate('childs'); 
                temp = res.childs;  // assigning child array to temp variable ( updating temp variable for traversal);
                break;
            }
        }
    
      i++;
    }

    
    //  bottom - 1 level subject 
    const childBranchResult = await Branch.findById(branchId);


    // adding new subject to ( bottom - 1) level subject  reference
    childBranchResult.childs.push(branchResult);

    // storing  ( bottom - 1) level subject 
    const finalResult = await childBranchResult.save();

    const userBranches = await User.findById(userId).populate("branches");

    return res.status(200).json({
      branchId : branchResult._id,
      branchName : branchResult.branchName
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

const getAllBranchTree = async (children, finalBranches) => {
  let finalInnerChild = finalBranches.childs; 
  
  for (let child of children) {
    let temp = await Branch.findById(child._id).populate("childs").populate('pages');
    let pages = []
    for( let q of temp.pages)
    {
       pages.push({ pageId : q._id , pageName : q.pageName});
    }
    let childArray = { branchId: child._id ,branchName : child.branchName , childs : [] , pages : pages}
    childArray.childs = await getAllBranchTree(temp.childs, childArray);
    finalInnerChild.push(childArray); 
    
  }
  return finalInnerChild 
};

exports.getAllBranches = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("branches");

    let temp = user.branches;
    // recursive traversal of subjects
    let finalTree = []
    for (let branch of temp) {
      let children = await Branch.findById(branch._id).populate("childs").populate("pages");
      let pages = []
      for( let q of children.pages)
      { 
         pages.push({ pageId : q._id , pageName : q.pageName});
      }
      let finalBranches = { branchId : branch._id, branchName : branch.branchName , childs : [ ]  , pages : pages}
      finalBranches.childs =  await getAllBranchTree(children.childs, finalBranches);
      finalTree.push(finalBranches);
    }

   
    res.status(200).json({
        branches: finalTree
    });
    
  } catch (err) {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      console.log(err);
      next(err);
  }
  
};
