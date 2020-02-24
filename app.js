const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const financesRoutes = require('./routes/finances');
const financeCalendarRoutes = require('./routes/financeCalendar');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/financeCalendar', financeCalendarRoutes);

module.exports = app;
