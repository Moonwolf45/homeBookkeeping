const message = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    await Backendless.UserService.login(req.body.email, req.body.password, true).then(function(user ) {
        const token = Backendless.LocalCache.get('user-token');

        user.token = token;
        Backendless.UserService.update(user);

        res.status(200).json({
            token: `Bearer ${token}`
        });
    }).catch(function(error) {
        message(res, error);
    });
};

module.exports.register = async function (req, res) {
    let user = new Backendless.User();
    user.name = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.blUserLocale = 'ru';

    await Backendless.UserService.register(user).then(function(registeredUser) {
        res.status(201).json(registeredUser);
    }).catch(function(error) {
        message(res, error);
    });
};
