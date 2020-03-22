const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const backendLess = require("backendless");

const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const financesRoutes = require('./routes/finances');
const financeCalendarRoutes = require('./routes/financeCalendar');
const keys = require('./config/keys');
const app = express();

backendLess.initApp(keys.applicationId, keys.apiKey);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/financeCalendar', financeCalendarRoutes);

module.exports = app;
