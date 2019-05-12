const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');

//Obtener rondas anteriores
router.get('/tournaments/publicos', authController.verifyToken, userController.getPublicTournaments);



module.exports = router;
