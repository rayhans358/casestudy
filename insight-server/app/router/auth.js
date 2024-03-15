const router = require('express').Router();
const authController = require('../controller/auth');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({usernameField: 'email'}, authController.localStrategy));
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.me);
router.get('/users/:id', authController.getUserInfo);
router.put('/users/:id/edit', authController.editUser);

module.exports = router;