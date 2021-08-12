const User = require('../models/User');
const message = require('../utils/errorHandler');

module.exports.getBalance = async function (req, res) {
    const candidate = await User.findById(req.params.id);
    if (candidate) {
        res.status(200).json({
            user: candidate
        });
    } else {
        message(res, {code: 3005});
    }
};


