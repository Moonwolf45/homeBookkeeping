const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/users');

router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getBalance);

module.exports = router;
