require('dotenv').config({ path: '.env.dev' });
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

class AuthController {
    jwt_secret;

    constructor() {
        this.jwt_secret = process.env.JWT_SECRET;
    }

    async createUser(req, res) {
        try {
            const hash = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                email: req.body.email,
                password: hash
            });

            const result = await user.save();
            res.status(201).json({
                message: 'User created',
                result: result
            });
        } catch (err) {
            res.status(500).json({
                message: 'Email already in use',
                error: err
            });
        }
    }

    async userLogin(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return this.sendAuthError(res);
            }

            const passwordValid = await bcrypt.compare(req.body.password, user.password);

            if (!passwordValid) {
                return this.sendAuthError(res);
            }

            const token = this.generateToken(user);

            return res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: user._id
            });
        } catch (err) {
            console.log(err);
            return this.sendAuthError(res);
        }
    }

    generateToken(user) {
        return jwt.sign(
            {
                email: user.email,
                userId: user._id
            },
            this.jwt_secret,
            { expiresIn: '1h' }
        );
    }

    sendAuthError(res) {
        return res.status(401).json({
            message: 'Invalid authentication'
        });
    }
}

module.exports = { AuthController };
