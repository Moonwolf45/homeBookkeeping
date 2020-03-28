const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/financeCalendar');

router.get('/', passport.authenticate('jwt', { session: false }), controller.getAll);
router.post('/', passport.authenticate('jwt', { session: false }), controller.create);
router.patch('/:id', passport.authenticate('jwt', { session: false }), controller.update);
router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.delete);

module.exports = router;
