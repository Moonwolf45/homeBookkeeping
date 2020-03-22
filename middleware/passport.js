const BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = passport => {
    passport.use(
        new BearerStrategy(async (token, done) => {
            const query = Backendless.DataQueryBuilder.create().setProperties('ownerId, email, name').setWhereClause(`token = '${token}'`);

            await Backendless.Data.of('Users').find(query).then((user) => {
                console.log(user);
                done(null, user)
            }).catch((error) => {
                console.log(error);
                done(null, false);
            })
        })
    )
};
