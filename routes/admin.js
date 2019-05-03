const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');

//Editar resultado de un partido si soy admin de la ronda en curso
router.put('/admin/tournament/:tournamentId/partido/:partidoId/edit', authController.verifyToken, authController.isAdmin, adminController.editResult);

//Iniciar primera ronda que soy admin
router.put('/admin/tournament/:tournamentId/start',authController.verifyToken, authController.isAdmin, adminController.startTournament)

//Avanzar ronda
router.put('/admin/tournament/:tournamentId/nextRound', authController.verifyToken, authController.isAdmin, adminController.nextRound);

//Editar configuracion torneo que soy admin

router.put('/admin/tournament/:tournamentId/edit', authController.verifyToken, authController.isAdmin, adminController.editTournament);

//Añadir pareja a un torneo que soy admin

router.put('/admin/tournament/:tournamentId/addCouple', authController.verifyToken, authController.isAdmin, adminController.putAddCouple);

//Eliminar pareja de la que soy admin

router.delete('/admin/tournament/:tournamentId/deleteCouple/:coupleId', authController.verifyToken, authController.isAdmin, adminController.deleteCouple);

// Obtener datos de un torneo que soy admin

router.get('/admin/tournament/:tournamentId', authController.verifyToken, adminController.getTournament);

//Eliminar torneo que soy admin

router.delete('/admin/tournament/:tournamentId', authController.verifyToken, adminController.deleteTournament);

// Torneos de los que soy admin

router.get('/admin/tournaments', authController.verifyToken, adminController.getTournaments);

//Obtener datos de un torneo

router.get('/admin/tournament/:tournamentId', authController.verifyToken, adminController.getTournament);

// Crear torneo
router.post('/admin/tournament', authController.verifyToken, adminController.postTournament);




module.exports = router;