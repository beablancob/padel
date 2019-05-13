const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');


//Obtener los torneos que estoy inscrito
router.get('/tournaments/myTournaments', authController.verifyToken, userController.getMyTournaments);

//Obtener torneos publicos sin empezar
router.get('/tournaments/publicos', authController.verifyToken, userController.getPublicTournaments);


//Obtener datos de un torneo
router.get('/tournaments/:tournamentId', authController.verifyToken, authController.isPlayer, userController.getTournament);






module.exports = router;
