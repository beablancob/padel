const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');

//Editar resultado de un partido si soy admin de la ronda en curso
router.put('/admin/tournaments/:tournamentId/partidos/:partidoId', authController.verifyToken, authController.isAdmin, adminController.editResult);

//Obtener rondas anteriores
router.get('/admin/tournaments/:tournamentId/previousRounds', authController.verifyToken, authController.isAdmin, adminController.previousRounds);

//Iniciar primera ronda que soy admin
router.put('/admin/tournaments/:tournamentId/start',authController.verifyToken, authController.isAdmin, adminController.startTournament)

//Avanzar ronda
router.post('/admin/tournaments/:tournamentId/nextRound', authController.verifyToken, authController.isAdmin, adminController.nextRound);

//Añadir pareja a un torneo que soy admin
router.post('/admin/tournaments/:tournamentId/couples', authController.verifyToken, authController.isAdmin, adminController.putAddCouple);

//Editar configuracion torneo que soy admin
router.put('/admin/tournaments/:tournamentId', authController.verifyToken, authController.isAdmin, adminController.editTournament);

//Eliminar pareja de la que soy admin
router.delete('/admin/tournaments/:tournamentId/couples/:coupleId', authController.verifyToken, authController.isAdmin, adminController.deleteCouple);

// Obtener datos de un torneo que soy admin
router.get('/admin/tournaments/:tournamentId', authController.verifyToken, adminController.getTournament);

//Eliminar torneo que soy admin
router.delete('/admin/tournaments/:tournamentId', authController.verifyToken, adminController.deleteTournament);

// Torneos de los que soy admin
router.get('/admin/tournaments', authController.verifyToken, adminController.getTournaments);


// Crear torneo
router.post('/admin/tournaments', authController.verifyToken, adminController.postTournament);


module.exports = router;