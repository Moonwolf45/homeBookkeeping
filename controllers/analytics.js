const message = require('../utils/errorHandler');

module.exports.overview = async function (req, res) {
    const query = Backendless.DataQueryBuilder.create().setWhereClause();
    await Backendless.Data.of('Finances').find(query).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });

    res.status(200).json();
};

module.exports.analytics = async function (req, res) {
    const query = Backendless.DataQueryBuilder.create().setWhereClause();
    await Backendless.Data.of('Finances').find(query).then((user) => {
        console.log(user);
    }).catch((error) => {
        console.log(error);
    });

    res.status(200).json();
};
