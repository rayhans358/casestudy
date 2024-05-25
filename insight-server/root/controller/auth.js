const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils/tokenUtils');

const register = async(req, res, next) => {
  try {
    const payload = req.body;
    let user = new User (payload);
    await user.save();
    return res.status(201).json(user);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    };
    next(err);

  };
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User
      .findOne({email})
      .select('-__v -createdAt -updatedAt -cart_items -token');
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ( {password, ...userWithoutPassword} = user.toJSON() );
      return done(null, userWithoutPassword);
    };

  } catch (err) {
    done(err,null)
  };
  done();
};

const login = (req, res, next) => {
  passport.authenticate('local', async function(err, user) {
    if(err) return next (err);

    if (!user) {
      return res.status(400).json({
        error: 1,
        message: 'Email or Password incorect'
      })
    };

    let signed = jwt.sign(user, config.secretkey);

    await User
      .findByIdAndUpdate(
        user._id, 
        {$push: {token: signed}}
      );

    res.status(200).json({
      message: 'Login Successfully',
      user,
      token: signed
    });
  })(req, res, next);
};

const logout = async (req,res, next) => {
  let token = getToken(req);

  let user = await User
    .findOneAndUpdate(
      {token: {$in: [token]}}, 
      {$pull: {token: token}}, 
      {useFindAndModify: false}
    );

  if (!token || !user) {
    res.status(400).json({
      error: 1,
      message: 'User Not Found!!!'
    });
  };

  return res.status(200).json({
    error: 0,
    message: 'Logout berhasil'
  });
};

const me = (req, res, next) => {
  if (!req.user) {
    res.status(400).json({
      error: 1,
      message: `You're not login or token expired`
    });
  };

  res.status(200).json(req.user);
};

const getUserInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userInfo = await User
      .findById(id)
      .select('fullName email phoneNumber');

    if (!userInfo) {
      return res.status(404).json({
        error: 1,
        message: 'User not found'
      });
    };

    res.status(200).json(userInfo);

  } catch (err) {
    next(err);
    console.error('Error fetching user info:', err);
    res.status(500).json({
      error: 1,
      message: 'Internal server error'
    });
  };
};

const editUser = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { fullName, email, phoneNumber } = req.body;

    const updatedUser = await User
    .findOneAndUpdate(
      { _id: id },
      { fullName, email, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 1,
        message: "User not found"
      });
    };

    return res.status(200).json(updatedUser);

  } catch (err) {
    next(err);
    return res.status(500).json({
      error: 1,
      message: "Internal server error"
    });
  };
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
  getUserInfo,
  editUser
}