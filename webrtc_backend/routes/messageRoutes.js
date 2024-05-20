let messageroutes= require('express')();
let messageModel = require('../model/MessageModel');
let messageController = require('../controllers/MessageController');
messageroutes.post('/saveMessage',messageController.saveMessage);
messageroutes.post('/getMessages',messageController.getMessages);
module.exports = messageroutes;