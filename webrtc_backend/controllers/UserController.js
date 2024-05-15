const UsersModel = require('../model/UserModel');
const bcrypt = require('bcrypt');
const registerUsers = async function (req, res, next) {
  try {
    let password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(`${password}`, salt);

    const User = new UsersModel({
      username: req.body.username,
      password: hash,
      email: req.body.email
    });

    const userSaved = await User.save();
    res.statusCode = 200;
    res.json(userSaved);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.json({ error: error})
  }
};

const loginUsers = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  var findUserWithEmail = await UsersModel.findOne({ email: email });
  if (findUserWithEmail) {
    const passwrordMatches = await bcrypt.compare(password, findUserWithEmail.password);
    if (passwrordMatches) {
      res.statusCode = 200;
      res.json({ message: "User Login Successful", status: true });
    }
    else {
      res.statusCode = 501;
      res.json({ message: "Password didnt match", status: false });
    }
  }
  else {
    res.statusCode = 501;
    res.json({ message: `User with ${email} doesn't exist`, status: false });
  }
};

module.exports = {
  registerUsers,
  loginUsers
};