const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controllers/finances');

router.get('/', passport.authenticate('bearer', { session: false }), controller.getAll);
router.get('/:id', passport.authenticate('bearer', { session: false }), controller.getById);
router.post('/', passport.authenticate('bearer', { session: false }), controller.create);
router.patch('/:id', passport.authenticate('bearer', { session: false }), controller.update);
router.delete('/:id', passport.authenticate('bearer', { session: false }), controller.delete);

module.exports = router;
