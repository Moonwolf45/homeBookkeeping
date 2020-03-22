const message = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
    const query = Backendless.DataQueryBuilder.create().setWhereClause();
    await Backendless.Data.of('Finances').find(query).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });

    res.status(200).json({
        message: 'Finances'
    });
};

module.exports.getById = async function (req, res) {
    const query = Backendless.DataQueryBuilder.create().setWhereClause();
    await Backendless.Data.of('Finances').find(query).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });

    res.status(200).json();
};

module.exports.create = async function (req, res) {
    const query = Backendless.DataQueryBuilder.create().setWhereClause();
    await Backendless.Data.of('Finances').find(query).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });

    res.status(200).json();
};

module.exports.update = async function (req, res) {
    const query = Backendless.DataQueryBuilder.create().setWhereClause();
    await Backendless.Data.of('Finances').find(query).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });

    res.status(200).json();
};

module.exports.delete = async function (req, res) {
    const query = Backendless.DataQueryBuilder.create().setWhereClause();
    await Backendless.Data.of('Finances').find(query).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });

    res.status(200).json();
};
