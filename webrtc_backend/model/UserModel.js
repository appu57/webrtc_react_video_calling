const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserModel = new schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:'0',
    },
    image:{
        type:String,
        required:false,
    },
    
},{timestamps:true}
);

const users = mongoose.model('users',UserModel);
module.exports = users;