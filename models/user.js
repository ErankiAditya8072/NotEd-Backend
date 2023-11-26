const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    email : {
        type : String,
        required: true
    },

    password : {
        type : String,
        required : true
    },

    userName:  {
        type : String,
        required : true
    },

    branches : [
        {
            type : Schema.Types.ObjectId,
            ref : 'branch',
            required : true
        }
    ]
})

module.exports = mongoose.model('user', userSchema);