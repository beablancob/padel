const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {user} = require('../models/index');
const {tournament} = require('../models/index');

//Crear torneo
exports.postTournament = (req,res,next) => {
    const name = req.body.name;
    const numberCouples = req.body.numberCouples;
    user.findById(req.userId)
    .then(user => {
        tournament.create({
            name: name,
            numberCouples: numberCouples,
            adminId: req.userId
        }).then(tournament => {
            res.status(201).json({msg:"Torneo creado con éxtio",
            tournament: tournament
        });
        })
    })
    .catch(err => console.log(err));
};

//Torneos de los que soy admin

exports.getTournaments = (req, res, next) => {
    tournament.findAll({
        where: {
            adminId: req.userId
        }
    }).then(tournaments => {
        res.status(200).json({tournaments: tournaments})
    })
    .catch(err => console.log(err));

};

//eliminar torneo

exports.deleteTournament = (req, res, next) => {
    tournamentId = req.params.tournamentId;
    tournament.destroy({
        where: {
            adminId: req.userId,
            id: tournamentId
        }
    }).then((a) => {
        if(a){
        return res.status(201).json({msg: "Torneo eliminado"})}
        else{
            return res.status(201).json({msg: "No es el admin de este torneo o ya fue eliminado"})
        }
    }).catch(err => console.log(err));

};

// Obtener datos de torneo que soy admin
exports.getTournament = (req,res,next) => {
    tournament.findOne({
        where: {
            id: req.params.tournamentId,
            adminId: req.userId
        }
    })
    .then(tournament => {
        if(tournament && tournament.adminId === req.userId){
        res.status(200).json({msg: 'Correcto', tournament: tournament});}
        else {
            res.status(400).json({msg: 'El torneo no existe o no es usted admin'})
        }
    })
    .catch(err => {
        console.log(err);
    });

};