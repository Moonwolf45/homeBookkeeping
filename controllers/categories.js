const message = require('../utils/errorHandler');
const Category = require('../models/Category');

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category.find({
            user_id: req.user.id
        });
        res.status(200).json(categories);
    } catch (e) {
        message(res, e)
    }
};

module.exports.getById = async function (req, res) {
    res.status(200).json();
};

module.exports.create = async function (req, res) {
    const category = new Category({
        title: req.body.title,
        user_id: req.user.id
    });

    try {
        await category.save();
        res.status(201).json(category);
    } catch (e) {
        message(res, e)
    }
};

module.exports.update = async function (req, res) {
    let editCategory = await Category.findById(req.params.id);
    editCategory.title = req.body.title;

    try {
        const category = await editCategory.save();
        res.status(200).json(category);
    } catch (e) {
        message(res, e)
    }
};
