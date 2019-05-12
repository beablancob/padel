const {user, tournament, couple, partido, couplePreviousRound} = require('../models/index');
const Sequelize = require('sequelize');


//Devolver torneos publicos no empezados
exports.getPublicTournaments = (req, res, next) => {

    tournament.findAll({
        where: {
            rondaActual: 0,
            publico: true

        }
    }).then(torneosPublicos => {

        if(torneosPublicos.length == 0){
            return res.status(200).json({mensaje: "No hay ningún torneo público"})
        }else{
            return res.status(200).json({tournaments: torneosPublicos});
        }
    }).catch(err => {
        return res.status(400).json({error: err});

    })


};

//Obtener torneos en los que estoy incristo o estoy jugando
// exports.getPlayingTournaments = async (req, res, next) => {

//     const parejasQueEstoy = couple.findAll({where:{
//         [Op.or]: [{user1Id: req.userId}, {user2Id: req.userId}]

//     }
//     });

    
//     const torneosQueEstoy = tournament.findAll({where:{
//         [Op.or]: [{couple1Id: req.userId}, {couple2Id: req.userId}]

//     }
//     });
