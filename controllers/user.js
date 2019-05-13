const {user, tournament, couple, partido, couplePreviousRound} = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


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

//Obtener torneos en los que estoy inscrito o estoy jugando
 exports.getMyTournaments = async (req, res, next) => {

//     //Cojo parejas en las que estoy
const parejasQueEstoy = await couple.findAll({where:{
    [Op.or]: [{user1Id: req.userId}, {user2Id: req.userId}]

}
});

if(parejasQueEstoy.length == 0){
  return res.status(200).json({msg: "No pertenece a ningún torneo"});
}

let idsTorneos = [];

//Por cada pareja en la que estoy selecciono el id del torneo al que pertenece 
for(p of parejasQueEstoy){
  idsTorneos.push(p.tournamentId);
};

//Busco los torneos en los que estoy con los ids de las parejas de antes
 const torneosQueEstoy = await tournament.findAll({where:{
   id:{
    [Op.or]: [idsTorneos]

   }
 }
});

return res.status(400).json({tournamets: torneosQueEstoy});
    };

//Obtener datos torneo
exports.getTournament = async (req, res, next) => {
    
    //Buscamos el torneo
    tourney = await tournament.findOne({where:
    {
        id:req.params.tournamentId
    }});
    
    return res.status(200).json({tournament: tourney});




};