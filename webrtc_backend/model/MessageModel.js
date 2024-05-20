let express = require('express');
let mongoose = require('mongoose');
let schema = mongoose.Schema;

const messageModel = new schema({
    senderId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    message:{
        type:String,
        required:true
    },
    isdeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const messages = mongoose.model('message',messageModel);
module.exports = messages;