const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

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

  //generate token

  const token = generateToken(user._id);

  //send HTTP-ONLY cookie
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: 'none',
    secure: true,
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
      token,
    });
  } else {
    res.status(400);
    throw new Error('invalid user data');
  }
});
//LOGIN USER

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    res.status(400);
    throw new Error('please and email and password');
  }
  //if user exixs
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('user not found, please signup');
  }
  //check if password is correct
  const passwordCorrect = await bcrypt.compare(password, user.password);

  //generate token

  const token = generateToken(user._id);

  //send HTTP-ONLY cookie
  res.cookie('token', token, {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: 'none',
    secure: true,
  });

  if (user && passwordCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid email or password');
  }
});

const logout = asyncHandler(async (req, res) => {
  //delete cookie or expire the cookie
  res.cookie('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).json({ message: 'successfully logged out' });
});

//get user data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});
// get login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  //verify the token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updateUser = await user.save();
    res.status(200).json({
      name: updateUser.name,
      email: updateUser.email,
      photo: updateUser.photo,
      phone: updateUser.phone,
      bio: updateUser.bio,
    });
  } else {
    res.status(404);
    throw new Error('user not found');
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, password } = req.body;
  //validate
  if (!user) {
    res.status(400);
    throw new Error('user not found, please signup');
  }
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error('PLEASE add old and newpassword');
  }

  // check if oldpassward match with the database
  const passIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //save new password
  if (user && passIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send('password change successful');
  } else {
    res.status(400);
    throw new Error('old password is incorrect');
  }
});
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  //is email in db
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('user does not exists');
  }

  //delete token if it exists in db
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  // create rest token
  let resetToken = crypto.randomBytes(32).toString('hex') + user._id;
  //hash token before saving to db

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //save token to db in token model
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 min
  }).save();

  //contruct reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //reset email
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>
  <p>This reset link is valid for only 30minutes</p>

  <a href=${resetUrl} clicktracking=off> ${resetUrl}</a>
  <p>Regards....</p>
  <p>Gshon Team</p>
  `;

  const subject = 'Password Reset Request';
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: 'Reset Email Sent' });
  } catch (error) {
    res.status(500);
    throw new Error('Email not sent. please try again');
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  //hash token, then compare with the one in the database
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //find token in db
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(500);
    throw new Error('Invalid or expired token');
  }

  //find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: 'password reset successful. please loggin',
  });
});
module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
