const express = require('express');
const router = express.Router();

const {user} = require('../models/index');
const authController = require('../controllers/auth');


// POST REGISTRO
router.post('/users', authController.preSignUp, authController.postSignup);

// POST SIGNIN
router.post('/signin', authController.postSignIn);

















module.exports = router;