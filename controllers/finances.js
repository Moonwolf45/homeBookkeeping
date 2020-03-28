const message = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
    res.status(200).json({
        message: 'Finances'
    });
};

module.exports.getById = async function (req, res) {
    res.status(200).json();
};

module.exports.create = async function (req, res) {
    res.status(200).json();
};

module.exports.update = async function (req, res) {
    res.status(200).json();
};

module.exports.delete = async function (req, res) {
    res.status(200).json();
};
