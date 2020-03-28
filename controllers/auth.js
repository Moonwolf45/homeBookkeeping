const User = require('../models/User');
const bCrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const message = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        const passwordResult = bCrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            const token = jwt.sign({
                username: candidate.username,
                email: candidate.email,
                userId: candidate._id,
            }, keys.jwt, {
                expiresIn: 604800
            });

            res.status(200).json({
                token: `Bearer ${token}`
            });
        } else {
            message(res, {code: 3003});
        }
    } else {
        message(res, {code: 3004});
    }
};

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        message(res, {code: 3033});
    } else {
        const salt = bCrypt.genSaltSync(10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bCrypt.hashSync(req.body.password, salt)
        });

        try {
            await user.save();
            res.status(201).json(user);
        } catch (e) {
            message(res, e)
        }
    }
};
