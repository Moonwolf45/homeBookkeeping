const message = require('../utils/errorHandler');
const User = require('../models/User');
const Event = require('../models/Event');

module.exports.getAll = async function (req, res) {
    try {
        const events = await Event.find({
            user_id: req.user.id
        });
        res.status(200).json(events);
    } catch (e) {
        message(res, e)
    }
};

module.exports.getById = async function (req, res) {
    res.status(200).json();
};

module.exports.create = async function (req, res) {
    const balanceAvailability = await User.findById(req.user.id);

    const event = new Event({
        category_id: req.body.category_id,
        currency: req.body.currency,
        type: req.body.type,
        amount: req.body.amount,
        date: req.body.date,
        description: req.body.description,
        user_id: req.user.id
    });

    if (req.body.type === 'outcome') {
        if (req.body.currency === 'rub') {
            if (balanceAvailability.balanceRUB < req.body.amount) {
                message(res, { code: 3051 })
            } else {
                balanceAvailability.balanceRUB -= req.body.amount;
                balanceAvailability.save();
            }
        } else if (req.body.currency === 'usd') {
            if (balanceAvailability.balanceUSD < req.body.amount) {
                message(res, { code: 3051 })
            } else {
                balanceAvailability.balanceUSD -= req.body.amount;
                balanceAvailability.save();
            }
        } else if (req.body.currency === 'eur') {
            if (balanceAvailability.balanceEUR < req.body.amount) {
                message(res, { code: 3051 })
            } else {
                balanceAvailability.balanceEUR -= req.body.amount;
                balanceAvailability.save();
            }
        }

        try {
            await event.save();
            res.status(201).json(event);
        } catch (e) {
            message(res, e)
        }
    } else {
        if (req.body.currency === 'rub') {
            balanceAvailability.balanceRUB += req.body.amount;
            balanceAvailability.save();
        } else if (req.body.currency === 'usd') {
            balanceAvailability.balanceUSD += req.body.amount;
            balanceAvailability.save();
        } else if (req.body.currency === 'eur') {
            balanceAvailability.balanceEUR += req.body.amount;
            balanceAvailability.save();
        }

        try {
            await event.save();
            res.status(201).json(event);
        } catch (e) {
            message(res, e)
        }
    }
};

module.exports.update = async function (req, res) {
    res.status(200).json();
};

module.exports.delete = async function (req, res) {
    res.status(200).json();
};
