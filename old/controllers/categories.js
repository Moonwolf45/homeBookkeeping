const message = require('../utils/errorHandler');
const Category = require('../models/Category');

module.exports.getAll = async function (req, res) {
    try {
        const categories = await Category.find({
            user_id: req.user.id
        }).sort({title: 'asc'});
        res.status(200).json(categories);
    } catch (e) {
        message(res, e)
    }
};

module.exports.getById = async function (req, res) {
    const category = await Category.findById(req.params.id);

    if (category) {
        res.status(200).json(category);
    } else {
        message(res, {code: 3070});
    }
};

module.exports.create = async function (req, res) {
    const category = new Category({
        title: req.body.title,
        color: req.body.color,
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
    editCategory.color = req.body.color;

    try {
        const category = await editCategory.save();
        res.status(200).json(category);
    } catch (e) {
        message(res, e)
    }
};
