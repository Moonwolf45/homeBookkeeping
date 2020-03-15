const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const firebase = require("firebase/app");

const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const financesRoutes = require('./routes/finances');
const financeCalendarRoutes = require('./routes/financeCalendar');
const keys = require('./config/keys');
const app = express();

firebase.initializeApp(keys.firebaseConfig);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/financeCalendar', financeCalendarRoutes);

module.exports = app;
