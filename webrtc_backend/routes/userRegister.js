const express = require('express');
const userroutes = express();
const userControllers = require('../controllers/UserController');
userroutes.get('/getUsers',userControllers.getUsers);
module.exports= userroutes;