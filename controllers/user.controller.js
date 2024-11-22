// controllers/user.controller.js
const { User } = require('../models');

const createUser = async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, profileImage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ clerkId }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      clerkId,
      email,
      firstName,
      lastName,
      profileImage,
      lastLogin: new Date()
    });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

module.exports = {
  createUser
};
