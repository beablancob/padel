const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');


//Obtener los torneos que estoy inscrito
router.get('/tournaments/myTournaments', authController.verifyToken, userController.getMyTournaments);

//Obtener torneos publicos sin empezar
router.get('/tournaments/publicos', authController.verifyToken, userController.getPublicTournaments);

//Obtener datos de un torneo
router.get('/tournaments/:tournamentId', authController.verifyToken, authController.isPlayerTournament, userController.getTournament);

//Editar resultado de un partido
router.put('/partido/:partidoId/editResult', authController.verifyToken, authController.isPlayerPartido, userController.editResultPartido );

//Confirmar resultado de un partido
router.put('/partido/:partidoId/confirmResult', authController.verifyToken, authController.isPlayerPartido, userController.confirmResultPartido);

//Editar info usuario
router.put('/user/editInfo', authController.verifyToken, userController.editInfo);

//Registrarse en un torneo
router.put('/tournament/register/:registerLink', authController.verifyToken, userController.tournamentRegister);




module.exports = router;
