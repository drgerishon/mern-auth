const asyncHandler = require('express-async-handler');
const User = require("../models/userModel")
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('please fill all the required fields');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('password must be more than 6 chars');
  }
  //check if email is in use
  const userlExists = await User.findOne({ email });
  if (userlExists) {
    res.status(400);
    throw new Error('user already exists');
  }
  //create new user
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error('invalid user data');
  }
});

const loginUser = asyncHandler (async ( req, res ) => {
  const {email, password } = req.body;

  //validation
})
module.exports = {
  registerUser,
  loginUser, 
};
