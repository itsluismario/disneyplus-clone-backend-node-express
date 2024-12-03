// controllers/auth.controller.js
require('dotenv').config({ path: '.env.dev' });
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { createClerkClient } = require('@clerk/express');

class AuthController {
  constructor() {
    this.jwt_secret = process.env.JWT_SECRET;
    this.clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    this.generateToken = this.generateToken.bind(this);
  }

  generateToken(user, clerkUserId) {
    if (!this.jwt_secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
      {
        email: user.email,
        userId: user._id,
        clerkId: clerkUserId || user.clerkId
      },
      this.jwt_secret,
      { expiresIn: '1h' }
    );
  }

  async createUserFromClerk(req, res) {
    const { email, password } = req.body;

    try {
      const clerkUser = await this.clerkClient.users.createUser({
        emailAddress: [email],
        password
      });

      const user = new User({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        password
      });

      const result = await user.save();
      const token = this.generateToken(result, clerkUser.id);

      res.status(201).json({
        message: 'User created',
        user: {
          id: result._id,
          clerkId: clerkUser.id,
          email: result.email
        },
        token,
        expiresIn: 3600
      });

    } catch (error) {
      if (error.errors && error.errors.length > 0) {
        return res.status(400).json({
          message: error.errors[0].message
        });
      }

      res.status(500).json({
        message: 'User creation failed',
        error: error.message
      });
    }
  }

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      try {
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(401).json({
            message: 'Invalid email or password'
          });
        }

        try {
          const verificationResponse = await this.clerkClient.users.verifyPassword({
            userId: user.clerkId,
            password
          });

          if (!verificationResponse.verified) {
            return res.status(401).json({
              message: 'Invalid email or password'
            });
          }
        } catch (verifyError) {
          console.error('Password verification failed:', verifyError);
          return res.status(401).json({
            message: 'Invalid email or password'
          });
        }

        const clerkUser = await this.clerkClient.users.getUser(user.clerkId);
        const clerkEmail = clerkUser.emailAddresses[0].emailAddress;

        if (clerkEmail !== email) {
          return res.status(401).json({
            message: 'Email mismatch between systems'
          });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = this.generateToken(user, user.clerkId);

        return res.status(200).json({
          token,
          expiresIn: 3600,
          user: {
            id: user._id,
            clerkId: user.clerkId,
            email: user.email,
            lastLogin: user.lastLogin
          }
        });

      } catch (error) {
        console.error('Clerk operation failed:', error);
        return res.status(401).json({
          message: 'Authentication failed',
          error: error.errors?.[0]?.message || error.message
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        message: 'Login failed',
        error: error.message
      });
    }
  }
}

module.exports = { AuthController };
