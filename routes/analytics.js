const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/analytics');

router.get('/overview', passport.authenticate('bearer', { session: false }), controller.overview);
router.get('/analytics', passport.authenticate('bearer', { session: false }), controller.analytics);

module.exports = router;
