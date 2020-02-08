const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const financesRoutes = require('./routes/finances');
const financeCalendarRoutes = require('./routes/financeCalendar');

app.use('api/auth', authRoutes);
app.use('api/analytics', analyticsRoutes);
app.use('api/finances', financesRoutes);
app.use('api/financeCalendar', financeCalendarRoutes);

module.exports = app;
