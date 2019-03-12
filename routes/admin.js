const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');

router.delete('/admin/tournament/:tournamentId', authController.verifyToken, adminController.deleteTournament);

// Torneos de los que soy admin

router.get('/admin/tournaments', authController.verifyToken, adminController.getTournaments);

// Crear torneo

router.post('/admin/tournament', authController.verifyToken, adminController.postTournament);




module.exports = router;