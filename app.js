const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require("mongoose");

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const eventsRoutes = require('./routes/events');
const categoriesRoutes = require('./routes/categories');
const keys = require('./config/keys');
const app = express();

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((error) => {
    console.log(error);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/analytics', analyticsRoutes);

module.exports = app;
