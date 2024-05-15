const express = require('express');
const userroutes = express();
const userControllers = require('../controllers/UserController');
userroutes.post('/registerUser',userControllers.registerUsers);
userroutes.post('/loginUser',userControllers.loginUsers);
module.exports= userroutes;