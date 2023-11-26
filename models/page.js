const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pageSchema = new Schema ( {
    pageName : {
        type: String,
        required : true
    },

    pageData : {
        type : String
    },

    branchId : {
        type : Schema.Types.ObjectId,
        ref : 'page',
        required : true
    }
})

module.exports = mongoose.model('page',pageSchema)