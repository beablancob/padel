const {user, tournament, couple, partido, couplePreviousRound} = require('../models/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

exports.editResultPartido = async(req, res, next) => {


    //Buscar partido
    match = await partido.findOne({where:
    {
        id: req.params.partidoId
    }});

    tourney = await tournament.findOne({where:
    {
        id: match.tournamentId
    }})

    //Ver que modificamos un partido de la ronda actual
    if(tourney.rondaActual != match.numeroRonda){
        return res.status(400).json({error:"No puedes modificar un resultado de una ronda anterior"});
    }

    const sets = req.body.sets;

  //Obtener los sets del body y añadirselos al partido
  //Comprobar que hay 6 sets y que ninguno es nulo
  if(Object.keys(sets).length != 6){
    return res.status(400).json({error: "El numero de sets total no es correcto"})
  }

  for(set of sets) {
    if(set == null ){
      return res.status(400).json({error: "Error en un set"});
    }

  }

  let juegospareja1 = sets[0]+sets[1]+sets[2];
  let juegospareja2 = sets[3]+sets[4]+sets[5];

  if(juegospareja1 === juegospareja2){
    return res.status(400).json({error: "Error en los juegos introducidos"})
  }
  
  //Sets pareja 1
  set1Couple1 = sets[0];
  set2Couple1 = sets[1];
  set3Couple1 = sets[2];
  //Sets pareja 2
  set1Couple2 = sets[3];
  set2Couple2 = sets[4];
  set3Couple2 = sets[5];

  //Actualizar los sets del partidos con los datos de la req
  match.set1Couple1 = set1Couple1;
  match.set2Couple1 = set2Couple1;
  match.set3Couple1 = set3Couple1;
  match.set1Couple2 = set1Couple2;
  match.set2Couple2 = set2Couple2;
  match.set3Couple2 = set3Couple2;
    
  //Vemos quien gana

  if(juegospareja1 > juegospareja2){
    match.ganador = match.couple1Id;
    

  }else {
    match.ganador = match.couple2Id;
  }

    //Poner que pareja ha editado el partido
    match.coupleEditedId = req.couple.id;
    console.log(match.coupleEditedId);


  //No ponemos true en este metodo, si en confirmar
  //partido.jugado = true;
  //Una vez añadido el resultado lo guardamos en la bbdd
  await match.save();

 //Devolvemos el partido con los datos actualizados
    return res.status(200).json({partido: match})



};

exports.confirmResultPartido = async(req, res, next) => {

    match = await partido.findOne({where:
        {
            id: req.params.partidoId
        }});

        tourney = await tournament.findOne({where:{
        id: match.tournamentId
    }})
    
    //Como pasamos antes el middleware de isPlayingPartido,
    //solo comprobamos que no sea el mismo id que coupleEditedId
    console.log(req.couple.id);
    if(req.couple.id != match.coupleEditedId){
        




        

        return res.status(200).json({confirm: "true", partido: match});
        
    }

    return res.status(400).json({error:"Tiene que confirmar un miembro de la otra pareja el resultado"});       

};

exports.editInfo = async(req, res, next) => {

    
    
  u = await user.findOne({where:{
    id: req.userId
    }});

    //Si envia password encriptarlo con bcrypt
    if(req.body.password){
    console.log("se ejecuta");
    req.body.password = await bcrypt.hashSync(req.body.password,10);
    }


u.email = req.body.email || u.email;
u.name = req.body.name || u.name;
u.apellidos = req.body.apellidos || u.apellidos;
u.password = req.body.password || u.password;

u.save();

return res.status(201).json({edited: true});
//Enviar nuevo token?? ya que en el token estan los datos del user y si se mantiene el token los valores no concuerdan
    


};