const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {user, tournament, couple} = require('../models/index');

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

// Añadir pareja a torneo que soy admin

exports.postAddCouple = (req, res, next) => {
    couple.create({
        user1Id: req.body.user1Id,
        user2Id: req.body.user2Id,
        tournamentId: req.params.tournamentId
    })
    .then(couple => {

        return res.status(201).json({msg:'Añadida correctamente',
    couple: couple});
    })
    .catch(err => console.log(err));


};

// Eliminar pareja de torneo del que soy admin

exports.deleteCouple = (req, res, next) => {
    
    couple.findById(req.params.coupleId)
    .then(couple => {


        if(couple && couple.tournamentId == req.params.tournamentId){
            
            couple.destroy()
            .then(couple => {
                
                 return res.json({msg: 'Destruido correctamente'});
            })
        }else {
            return res.json({msg: 'La pareja no es suya'});
        } 
    })
    .catch(err => console.log(err));
};

