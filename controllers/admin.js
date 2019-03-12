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
        console.log(name, numberCouples);
        tournament.create({
            name: name,
            numberCouples: numberCouples,
            adminId: req.userId
        })
    })
    .then(tournament => {
        res.status(201).json({msg:"torneocreado",
        tournament
    });
    })
    .catch(err => console.log(err));
};

//Torneos de los que soy admin

exports.getTournaments = (req, res, next) => {
    console.log("aaaa");
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
        console.log(a);
        if(a){
        return res.status(201).json({msg: "elemento destruido"})}
        else{
            return res.status(201).json({msg: "El torneo ya habia sido eliminado"})
        }
    }).catch(err => console.log(err));

};