const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const branchSchema = new Schema({

    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },

    branchName : {
        type : String,
        required : true
    },
    
    childs : [
        {
            type : Schema.Types.ObjectId,
            ref : 'branch',
            required : true
        }
    ],

    pages : [
        {
            type : Schema.Types.ObjectId,
            ref : 'page',
            required : true 
        }
    ],

    parentBranchId : {
        type : Schema.Types.ObjectId,
        ref : 'branch'
    }
})

module.exports = mongoose.model('branch',branchSchema)