const User = require("../models/userProfile");

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