const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const userController = require('../controllers/user');



//Obtener una ronda de un torneo que juego o es publico
router.get('/tournaments/:tournamentId/ronda/:numeroRonda', authController.verifyToken, authController.isPlayerTournament, userController.getRondaInfo);

//Obtener los torneos que estoy inscrito
router.get('/users', authController.verifyToken, userController.getMyTournaments);

//Editar info usuario
router.put('/users', authController.verifyToken, userController.editInfo);

//Eliminar cuenta propia
router.delete('/users', authController.verifyToken, userController.deleteUser);

//Obtener torneos publicos 
router.get('/tournaments/publicos', authController.verifyToken, userController.getPublicTournaments);

//Obtener datos de un torneo
router.get('/tournaments/:tournamentId', authController.verifyToken, authController.isPlayerTournament, userController.getTournament);

//Editar resultado de un partido
router.put('/partidos/:partidoId', authController.verifyToken, authController.isPlayerPartido, userController.editResultPartido );

//Confirmar resultado de un partido
router.put('/partidos/:partidoId/confirmResult', authController.verifyToken, authController.isPlayerPartido, userController.confirmResultPartido);

//Registrarse en un torneo
router.post('/tournaments/:registerLink/couples', authController.verifyToken, userController.tournamentRegister);

//Eliminar pareja a la que pertenezco
router.delete('/couples/:coupleId', authController.verifyToken, userController.deleteCouple);

module.exports = router;
