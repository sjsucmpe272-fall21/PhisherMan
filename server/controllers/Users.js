const Urls = require("../models/Urls");
const User = require("../models/User");

// @desc    Get all Users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = async (req, res, next) => {
    try {
      const users = await User.find();
  
      return res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };

// @desc    Add User
// @route   POST /api/v1/users
// @access  Public
exports.addUser = async (req, res, next) => {
    try {
      console.log(req.body, " body");
  
      const user = await User.create(req.body);
  
      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
  
        return res.status(400).json({
          success: false,
          error: messages,
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Server Error",
        });
      }
    }
  };

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Public
exports.deleteUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "No user found",
        });
      }
  
      await user.remove();
  
      return res.status(200).json({
        success: true,
        data: {},
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  };


// @desc    Login Users
// @route   GET /api/v1/users/login/
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const users = await User.find({email: req.body.email, password:req.body.password } );
if (users.length > 0){
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })} else {
      return res.status(500).json({
        success: true,
        count: users.length,
        data: "No user id and password with this combination",
    })
  }} catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Add Restaurant Menu
// @route   POST /api/v1/restaurant/:id/menu
// @access  Public
exports.addUrl = async (req, res, next) => {
  try {

    
    const user = await User.findById(req.params.id);
    const url = await Urls.create(req.body);
    const body = req.body
    console.log({body});
    const temp = await User.findByIdAndUpdate(req.params.id,{$push :{
      url : body
    }})

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};
